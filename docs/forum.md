# Community Forum

Modern discussion platform for the SaltGoat community. Not a traditional forum — card-based, identity-rich, peak-integrated, beautiful on every screen.

## Architecture

**Decision:** Build on Supabase (PostgreSQL) with server modules following the existing pattern. No external forum service, no real-time subscriptions in v1 (pull-to-refresh is fine). Full-text search via PostgreSQL `tsvector` — no Algolia/Meilisearch needed at this scale.

**Two-platform delivery.** Web (SvelteKit) ships first (Phases 1-5), mobile (Expo) follows (Phase 6). API endpoints serve both, identical to the existing `/api/v1/` pattern.

**Access:** Fully free. No Pro gating. Community is the growth engine — the more people talking, the more valuable SaltGoat becomes. Pro revenue comes from weather, exports, and premium features.

## Design Decisions

### Flat threading with quote references
All replies display chronologically at the same depth. Any reply can reference a previous reply via `reply_to_id`, rendered as an inline quote block above the reply body. This is the Discord/Slack model. Nested threads (Reddit-style) create terrible mobile UX with progressive indentation and collapsed branches. Flat-with-quotes preserves conversational context while keeping the layout clean.

### Peak-linked discussions
Topics can optionally link to a peak and/or route via foreign keys. Peak detail pages get a "Discussions" section showing linked topics. Users can start discussions from peak pages with context pre-filled. This is the killer differentiator from 14ers.com — discussions are contextual, not siloed in a separate forum.

### Identity-rich author cards
Every post shows the author's avatar, display name, summit count badge, and top achievement flair. When someone with 45 summits gives Class 3 route beta, that credibility is immediately visible. This is something 14ers.com cannot do — SaltGoat knows who has actually climbed what.

### Markdown content
Not WYSIWYG. Markdown is simpler to store, renders consistently across web (`marked` + `DOMPurify`) and mobile (`react-native-markdown-display`), and the audience is technical enough. Inline images uploaded to a `forum-images` Supabase storage bucket.

### PostgreSQL full-text search
`tsvector` columns with GIN indexes on topic titles + reply bodies. `ts_rank` for relevance scoring. Handles thousands of topics without external infrastructure. Upgrade to dedicated search only if needed.

### Six categories

| Category | Slug | Description | Color |
|----------|------|-------------|-------|
| Trip Reports & Beta | `trip-reports` | Recent conditions, route reports, summit stories | `class-1` (green) |
| Trip Planning | `trip-planning` | Partner finding, advice, itineraries | `class-2` (blue) |
| Gear & Equipment | `gear` | Reviews, recommendations, what to bring | `accent` (gold) |
| General Discussion | `general` | Anything 14er-related | `mountain-blue` |
| Safety & Skills | `safety` | Navigation, weather, first aid, training | `class-4` (red) |
| Peak Photography | `photography` | Photo sharing, camera gear, technique | `class-3` (gold-warm) |

### Mobile strategy
Community is NOT a new tab — the 5-tab layout stays. Access points: button in Explore tab header, "Discussions" section on peak detail pages, and deep links from notifications (future). Four Expo Router screens under `mobile/app/community/`.

## Database Schema

Migration file: `supabase/migrations/YYYYMMDD000000_community_forum.sql`

### forum_categories

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| slug | text | UNIQUE, NOT NULL |
| name | text | NOT NULL |
| description | text | NOT NULL |
| icon | text | NOT NULL (Lucide icon name for web, SF Symbol name for mobile) |
| color | text | NOT NULL (design system color key) |
| display_order | int | NOT NULL, default 0 |
| topic_count | int | NOT NULL, default 0 |
| created_at | timestamptz | default now() |

**RLS:** Public read. No user writes (admin seeds via migration).

### forum_topics

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| slug | text | NOT NULL (generated from title) |
| title | text | NOT NULL, CHECK length 5-200 |
| body | text | NOT NULL, CHECK length 10-10000 |
| category_id | uuid | FK forum_categories(id), NOT NULL |
| author_id | uuid | FK auth.users(id) ON DELETE CASCADE, NOT NULL |
| peak_id | uuid | FK peaks(id) ON DELETE SET NULL, nullable |
| route_id | uuid | FK routes(id) ON DELETE SET NULL, nullable |
| is_pinned | boolean | NOT NULL, default false |
| is_locked | boolean | NOT NULL, default false |
| reply_count | int | NOT NULL, default 0 |
| view_count | int | NOT NULL, default 0 |
| reaction_count | int | NOT NULL, default 0 |
| last_reply_at | timestamptz | nullable |
| last_reply_by | uuid | FK auth.users(id), nullable |
| search_vector | tsvector | generated column |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

**RLS:** Public read. Authenticated create (own author_id). Update own (within 30 min of creation, or if no replies). Delete own (within 30 min, or if no replies).

**Indexes:**
- `(category_id, is_pinned DESC, last_reply_at DESC NULLS LAST)` — main listing query
- `(author_id, created_at DESC)` — user's topics
- `(peak_id, last_reply_at DESC)` WHERE peak_id IS NOT NULL — peak discussions
- GIN on `search_vector` — full-text search
- UNIQUE on `(category_id, slug)` — URL uniqueness per category

### forum_replies

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| topic_id | uuid | FK forum_topics(id) ON DELETE CASCADE, NOT NULL |
| author_id | uuid | FK auth.users(id) ON DELETE CASCADE, NOT NULL |
| body | text | NOT NULL, CHECK length 1-5000 |
| reply_to_id | uuid | FK forum_replies(id) ON DELETE SET NULL, nullable |
| reaction_count | int | NOT NULL, default 0 |
| search_vector | tsvector | generated column |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

**RLS:** Public read. Authenticated create (own author_id, topic not locked). Update own (within 30 min). Delete own (within 30 min).

**Indexes:**
- `(topic_id, created_at)` — reply pagination
- `(author_id, created_at DESC)` — user's replies
- GIN on `search_vector`

### forum_reactions

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| reactable_type | text | NOT NULL, CHECK IN ('topic', 'reply') |
| reactable_id | uuid | NOT NULL |
| user_id | uuid | FK auth.users(id) ON DELETE CASCADE, NOT NULL |
| reaction_type | text | NOT NULL, CHECK IN ('like', 'helpful', 'fire', 'summit') |
| created_at | timestamptz | default now() |

**RLS:** Public read. Authenticated insert (own user_id). Delete own.

**Indexes:**
- UNIQUE `(reactable_type, reactable_id, user_id, reaction_type)` — one reaction type per user per post
- `(reactable_type, reactable_id)` — batch fetch

### forum_bookmarks

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| topic_id | uuid | FK forum_topics(id) ON DELETE CASCADE, NOT NULL |
| user_id | uuid | FK auth.users(id) ON DELETE CASCADE, NOT NULL |
| created_at | timestamptz | default now() |

**RLS:** Own read + write only (user_id = auth.uid()).

**Indexes:**
- UNIQUE `(topic_id, user_id)`
- `(user_id, created_at DESC)` — user's bookmarks list

### forum_topic_views

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| topic_id | uuid | FK forum_topics(id) ON DELETE CASCADE, NOT NULL |
| user_id | uuid | FK auth.users(id) ON DELETE CASCADE, NOT NULL |
| last_viewed_at | timestamptz | default now() |

**RLS:** Own read + write. Used for "unread" indicators.

**Indexes:**
- UNIQUE `(topic_id, user_id)` — upsert on view
- `(user_id, last_viewed_at DESC)` — recently viewed

### forum_mentions

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| post_type | text | NOT NULL, CHECK IN ('topic', 'reply') |
| post_id | uuid | NOT NULL |
| mentioned_user_id | uuid | FK auth.users(id) ON DELETE CASCADE, NOT NULL |
| read | boolean | NOT NULL, default false |
| created_at | timestamptz | default now() |

**RLS:** Read where mentioned_user_id = auth.uid(). Insert by authenticated (on topic/reply creation).

**Indexes:**
- `(mentioned_user_id, read, created_at DESC)` — unread mentions
- `(post_type, post_id)` — mentions for a post

### Database Triggers

```
trigger_update_topic_reply_count
  AFTER INSERT/DELETE ON forum_replies
  → increment/decrement forum_topics.reply_count
  → update forum_topics.last_reply_at and last_reply_by (on INSERT)
  → update forum_categories.topic_count (via topic's category)

trigger_update_reaction_count
  AFTER INSERT/DELETE ON forum_reactions
  → increment/decrement reaction_count on forum_topics or forum_replies

trigger_update_topic_view_count
  AFTER INSERT ON forum_topic_views (on conflict do update)
  → increment forum_topics.view_count (only on INSERT, not upsert update)

trigger_update_search_vector
  BEFORE INSERT OR UPDATE ON forum_topics
  → set search_vector = to_tsvector('english', title || ' ' || body)

trigger_update_search_vector_replies
  BEFORE INSERT OR UPDATE ON forum_replies
  → set search_vector = to_tsvector('english', body)

trigger_update_category_topic_count
  AFTER INSERT/DELETE ON forum_topics
  → increment/decrement forum_categories.topic_count
```

### Seed Data

Insert 6 categories with slugs, names, descriptions, icons, colors, and display_order (0-5).

### Storage Bucket

Create `forum-images` bucket: authenticated upload, public read, 5MB max, image types only. RLS: own upload, public read on approved images.

## Server Modules

All in `src/lib/server/`, all accept `SupabaseClient<Database>` as first param.

### forum.ts (core CRUD)

| Function | Params | Returns | Notes |
|----------|--------|---------|-------|
| `getCategories()` | — | `ForumCategory[]` | With topic_count |
| `getCategoryBySlug(slug)` | slug | `ForumCategory \| null` | |
| `getTopicsByCategory(categoryId, opts)` | categoryId, { cursor?, limit? } | `{ topics, nextCursor }` | Cursor-based, includes author profile + summit count + peak tag |
| `getTopicDetail(topicId)` | topicId | `TopicDetail \| null` | Topic + author + peak + route + category |
| `getTopicBySlug(categorySlug, topicSlug)` | categorySug, topicSlug | `TopicDetail \| null` | For URL resolution |
| `getReplies(topicId, opts)` | topicId, { cursor?, limit? } | `{ replies, nextCursor }` | With author profiles, quote context |
| `createTopic(data)` | { title, body, categoryId, authorId, peakId?, routeId? } | `ForumTopic` | Generates slug, parses mentions |
| `createReply(data)` | { topicId, authorId, body, replyToId? } | `ForumReply` | Checks not locked, parses mentions |
| `updateTopic(topicId, userId, data)` | topicId, userId, { title?, body? } | `ForumTopic` | Enforces edit window |
| `updateReply(replyId, userId, data)` | replyId, userId, { body } | `ForumReply` | Enforces edit window |
| `deleteTopic(topicId, userId)` | topicId, userId | void | Enforces delete rules |
| `deleteReply(replyId, userId)` | replyId, userId | void | Enforces delete window |
| `searchForum(query, opts)` | query, { category?, limit?, offset? } | `SearchResult[]` | ts_rank ordering |
| `recordTopicView(topicId, userId)` | topicId, userId | void | Upsert, increments view_count |
| `getPopularTopics(limit)` | limit | `ForumTopic[]` | By reply_count, last 30 days |
| `getRecentTopics(limit)` | limit | `ForumTopic[]` | By created_at |
| `getTopicsForPeak(peakId, limit)` | peakId, limit | `ForumTopic[]` | For peak detail pages |
| `getUserTopics(userId, opts)` | userId, { cursor?, limit? } | `{ topics, nextCursor }` | For profile pages |

### forumReactions.ts

| Function | Params | Returns |
|----------|--------|---------|
| `toggleForumReaction(data)` | { reactableType, reactableId, userId, reactionType } | `{ reacted: boolean }` |
| `getReactionsForPosts(postType, postIds, userId?)` | postType, postIds, userId | `Record<string, ReactionData>` |

### forumBookmarks.ts

| Function | Params | Returns |
|----------|--------|---------|
| `toggleBookmark(topicId, userId)` | topicId, userId | `{ bookmarked: boolean }` |
| `getUserBookmarks(userId, opts)` | userId, { cursor?, limit? } | `{ topics, nextCursor }` |
| `getBookmarkStatus(topicIds, userId)` | topicIds, userId | `Record<string, boolean>` |

### forumAdmin.ts

| Function | Params | Returns |
|----------|--------|---------|
| `pinTopic(topicId, pinned)` | topicId, boolean | void |
| `lockTopic(topicId, locked)` | topicId, boolean | void |
| `moveTopic(topicId, newCategoryId)` | topicId, categoryId | void |
| `adminDeleteTopic(topicId)` | topicId | void |
| `adminDeleteReply(replyId)` | replyId | void |
| `getForumModerationQueue()` | — | `{ flaggedTopics, flaggedReplies }` |
| `getForumStats()` | — | `{ topicCount, replyCount, activeUsers7d }` |

## API Endpoints (Mobile)

All under `src/routes/api/v1/forum/`. Pattern: thin wrappers around server modules. Auth via `requireAuth(request)` where needed.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/forum/categories` | GET | No | List categories with counts |
| `/api/v1/forum/categories/[slug]/topics` | GET | Optional | Paginated topics (cursor in query) |
| `/api/v1/forum/topics` | POST | Required | Create topic |
| `/api/v1/forum/topics/[id]` | GET | Optional | Topic detail + first page replies |
| `/api/v1/forum/topics/[id]` | PATCH | Required | Edit own topic |
| `/api/v1/forum/topics/[id]` | DELETE | Required | Delete own topic |
| `/api/v1/forum/topics/[id]/replies` | GET | Optional | Paginated replies (cursor) |
| `/api/v1/forum/topics/[id]/replies` | POST | Required | Create reply |
| `/api/v1/forum/reactions` | POST | Required | Toggle reaction |
| `/api/v1/forum/bookmarks` | POST | Required | Toggle bookmark |
| `/api/v1/forum/bookmarks` | GET | Required | User's bookmarked topics |
| `/api/v1/forum/search` | GET | No | Full-text search |

## Web Routes

| Route | Purpose | Server Load |
|-------|---------|-------------|
| `/community` | Hub: category grid + recent + popular + bookmarked | `getCategories`, `getRecentTopics`, `getPopularTopics`, `getUserBookmarks` |
| `/community/[category]` | Topic list for category | `getCategoryBySlug`, `getTopicsByCategory` |
| `/community/[category]/new` | New topic composer | `getCategoryBySlug` (+ peaks list for picker) |
| `/community/[category]/[topic]` | Topic detail + replies | `getTopicBySlug`, `getReplies`, `getReactionsForPosts`, `getBookmarkStatus`, `recordTopicView` |
| `/community/search` | Search results | `searchForum` |

Form actions on topic/reply pages: `createTopic`, `createReply`, `updateTopic`, `deleteReply`, `toggleReaction`, `toggleBookmark`.

## Web Components

New directory: `src/lib/components/forum/`

| Component | Purpose |
|-----------|---------|
| `CategoryCard.svelte` | Card with icon, name, description, topic count, accent color border. Hover lift effect. |
| `TopicCard.svelte` | Title, author info (ForumAuthorInfo), 2-line body preview, peak tag, reply count, view count, last activity timestamp, reaction summary. Card style matching activity feed. |
| `TopicDetail.svelte` | Full topic: rendered markdown body, author card (large), peak/route link, reactions bar, bookmark button, edit/delete (if own + within window). |
| `ReplyCard.svelte` | Author info, rendered markdown body, quoted reply block (if reply_to), reactions, edit/delete (if own + within window), "Reply" button. |
| `ReplyComposer.svelte` | Markdown textarea with character count, image upload button, optional quote context preview, "Preview" toggle (renders markdown), submit button. |
| `TopicComposer.svelte` | Title input, category selector, optional peak/route search picker, markdown body textarea, image upload, preview toggle. |
| `ForumAuthorInfo.svelte` | Avatar (h-10 w-10), display name, summit count badge (e.g., "42 summits"), top achievement icon. Reused everywhere. |
| `PeakTag.svelte` | Small linked badge showing peak name + class color. Appears on topics linked to peaks. |
| `ForumReactions.svelte` | Horizontal reaction bar: like/helpful/fire/summit icons with counts. Toggle on click. Accent highlight when user has reacted. |
| `QuoteBlock.svelte` | Styled blockquote showing quoted reply author + truncated body. Click to scroll to original. |
| `ForumSearch.svelte` | Search input with debounced query. Results as TopicCard list. Category filter dropdown. |
| `ForumBreadcrumb.svelte` | Community > Category > Topic breadcrumb navigation. |
| `PeakDiscussions.svelte` | Section for peak detail pages: recent topics linked to this peak + "Start a discussion" CTA. |

## Mobile Screens

New directory: `mobile/app/community/`

| Screen | Path | Purpose |
|--------|------|---------|
| `index.tsx` | `/community` | Category cards + recent topics. Header with search icon. |
| `[category].tsx` | `/community/[category]` | FlatList of topics for category. Pull-to-refresh. Infinite scroll. FAB for new topic. |
| `topic/[id].tsx` | `/community/topic/[id]` | Topic header + FlatList of replies. Reply composer at bottom (keyboard-aware). |
| `new-topic.tsx` | `/community/new-topic` | Modal screen. Title, category picker, peak picker, body textarea, submit. |

## Mobile Components

New directory: `mobile/components/forum/`

| Component | Purpose |
|-----------|---------|
| `TopicCard.tsx` | Pressable card: title, author info, preview, peak tag, stats row |
| `ReplyCard.tsx` | Author info, body, quote block, reactions, reply button |
| `CategoryCard.tsx` | Icon + name + description + count. Pressable, accent color left border |
| `ForumAuthorInfo.tsx` | Avatar + name + summit badge. Pressable to profile |
| `ReplyComposer.tsx` | KeyboardAvoidingView textarea + send button. Quote context if replying to specific reply |
| `TopicComposer.tsx` | Full-screen form: title, category, peak picker, body |
| `ForumReactions.tsx` | Horizontal ScrollView of reaction buttons with counts |
| `PeakTag.tsx` | Small badge linking to peak detail |
| `QuoteBlock.tsx` | Styled quote with author name + truncated text |
| `ForumSearch.tsx` | Search bar + results FlatList |

## Integration Points

### Peak detail pages
**File:** `src/routes/peaks/[slug]/+page.server.ts` and corresponding Svelte component
- Add `getTopicsForPeak(peakId, 5)` to server load
- New `PeakDiscussions.svelte` section below reviews/trail reports
- "Start a discussion about [Peak Name]" CTA links to `/community/general/new?peak=[slug]`
- Mobile: same section in peak detail screen, links to community screens

### Activity feed
**File:** `src/lib/server/activity.ts`
- Add `'forum_topic'` as new `ActivityType`
- New `ForumTopicActivity` interface: topic title, category, peak tag, reply count
- Query `forum_topics` in `getFollowingActivityFeed()` alongside summits/reviews
- Mobile: new `ForumActivityCard` variant in activity feed

### User profiles
**Files:** `src/routes/users/[id]/+page.server.ts`, profile components
- Add "Discussions" tab showing user's topics via `getUserTopics(userId)`
- Show topic count in profile stats
- Mobile: same tab in user profile screen

### Admin dashboard
**Files:** `src/routes/admin/`, `src/lib/server/admin.ts`
- New "Forum" section in admin moderation page
- Pin/lock/move/delete controls
- Forum stats in admin overview (topic count, reply count, active discussants)
- Flagged forum content in moderation queue

### Content flags
**File:** `supabase/migrations/` (existing content_flags table)
- Extend `content_type` CHECK constraint to include `'forum_topic'` and `'forum_reply'`
- Add flag buttons to topic and reply cards
- Flagged content appears in admin moderation queue
- Same auto-hide at 3 flags threshold

## Implementation Phases

### Phase 1: Database + Server Modules

**Scope:** Schema, migration, types, all server-side CRUD.

**Create:**
- `supabase/migrations/YYYYMMDD000000_community_forum.sql` — all 7 tables, triggers, RLS policies, indexes, seed data, storage bucket
- `src/lib/server/forum.ts` — core CRUD (17 functions)
- `src/lib/server/forumReactions.ts` — reaction toggle + batch fetch
- `src/lib/server/forumBookmarks.ts` — bookmark toggle + list + batch status
- `src/lib/server/forumAdmin.ts` — admin operations
- Update `src/lib/types/` — add forum types (or generate from Supabase)

**Modify:**
- `packages/shared/` — add forum-related shared types if needed

**Verify:**
- `supabase db push` succeeds
- `supabase gen types typescript` regenerates types including new tables
- `npm run build` passes
- Manual verification: 6 categories seeded, RLS policies correct via Supabase dashboard

### Phase 2: Web Community Hub + Topic Lists

**Scope:** Main community page, category pages, topic listing with pagination.

**Create:**
- `src/routes/community/+page.server.ts` — load categories, recent, popular
- `src/routes/community/+page.svelte` — hub layout: hero, category grid, recent/popular columns
- `src/routes/community/[category]/+page.server.ts` — load category + paginated topics
- `src/routes/community/[category]/+page.svelte` — topic list with infinite scroll
- `src/lib/components/forum/CategoryCard.svelte`
- `src/lib/components/forum/TopicCard.svelte`
- `src/lib/components/forum/ForumAuthorInfo.svelte`
- `src/lib/components/forum/PeakTag.svelte`
- `src/lib/components/forum/ForumBreadcrumb.svelte`

**Modify:**
- `src/routes/+layout.svelte` or nav component — add "Community" to main navigation

**Verify:**
- `/community` renders with 6 category cards
- `/community/trip-reports` renders topic list (empty state initially)
- Dark mode works on all new components
- Responsive: mobile, tablet, desktop layouts
- `npm run build` passes

### Phase 3: Web Topic Detail + Replies

**Scope:** Topic view, reply display, reactions, bookmarks, view tracking.

**Create:**
- `src/routes/community/[category]/[topic]/+page.server.ts` — load topic, replies, reactions, bookmark status, record view
- `src/routes/community/[category]/[topic]/+page.svelte` — topic detail page
- `src/lib/components/forum/TopicDetail.svelte`
- `src/lib/components/forum/ReplyCard.svelte`
- `src/lib/components/forum/ReplyComposer.svelte`
- `src/lib/components/forum/ForumReactions.svelte`
- `src/lib/components/forum/QuoteBlock.svelte`

**Modify:**
- Topic detail page — form actions for `createReply`, `toggleReaction`, `toggleBookmark`

**Verify:**
- Topic detail renders with markdown body
- Replies display chronologically with author info
- Quote blocks render for replies with `reply_to_id`
- Reactions toggle and update counts
- Bookmark toggle works
- View count increments on page load
- Reply composer submits and reply appears
- Dark mode correct
- `npm run build` passes

### Phase 4: Web Topic Creation + Search

**Scope:** Topic composer, editing, deletion, full-text search, image upload.

**Create:**
- `src/routes/community/[category]/new/+page.server.ts` — load category, peaks list
- `src/routes/community/[category]/new/+page.svelte` — composer page
- `src/routes/community/search/+page.server.ts` — search query handler
- `src/routes/community/search/+page.svelte` — search results page
- `src/lib/components/forum/TopicComposer.svelte`
- `src/lib/components/forum/ForumSearch.svelte`

**Modify:**
- Topic/reply pages — add edit/delete form actions with window enforcement
- Community hub — add search bar linking to `/community/search`
- Topic composer — peak/route search picker (reuse existing peak search if available)

**Verify:**
- Create topic with title, body, category. Topic appears in category list.
- Create topic linked to a peak. Peak tag displays correctly.
- Edit topic within 30-min window. Edit blocked after window.
- Delete topic within window.
- Search returns relevant results ranked by relevance.
- Image upload in topic/reply body works.
- `npm run build` passes

### Phase 5: Integration + Admin

**Scope:** Peak page discussions, activity feed integration, profile tab, admin moderation, content flagging.

**Create:**
- `src/lib/components/forum/PeakDiscussions.svelte` — discussions section for peak pages

**Modify:**
- `src/routes/peaks/[slug]/+page.server.ts` — add `getTopicsForPeak` to load
- Peak detail component — add PeakDiscussions section
- `src/lib/server/activity.ts` — add `forum_topic` activity type
- `src/routes/users/[id]/+page.server.ts` — add user topics to load
- User profile component — add "Discussions" tab
- `src/routes/admin/+page.server.ts` — add forum stats to overview
- `src/routes/admin/moderation/` — add forum moderation queue
- Admin moderation component — pin/lock/move/delete controls
- Content flags migration — extend CHECK constraint for forum content types
- Topic/reply components — add flag buttons

**Verify:**
- Peak detail page shows linked discussions
- "Start a discussion" from peak page pre-fills peak context
- New topics from followed users appear in activity feed
- User profile shows discussions tab with their topics
- Admin can pin, lock, move, delete topics
- Flagging a topic/reply works, shows in admin queue
- Auto-hide at 3 flags works for forum content
- `npm run build` passes

### Phase 6: Mobile API + Screens

**Scope:** All 12 REST endpoints, 4 Expo screens, 10 RN components.

**Create:**
- `src/routes/api/v1/forum/categories/+server.ts`
- `src/routes/api/v1/forum/categories/[slug]/topics/+server.ts`
- `src/routes/api/v1/forum/topics/+server.ts`
- `src/routes/api/v1/forum/topics/[id]/+server.ts`
- `src/routes/api/v1/forum/topics/[id]/replies/+server.ts`
- `src/routes/api/v1/forum/reactions/+server.ts`
- `src/routes/api/v1/forum/bookmarks/+server.ts`
- `src/routes/api/v1/forum/search/+server.ts`
- `mobile/app/community/index.tsx`
- `mobile/app/community/[category].tsx`
- `mobile/app/community/topic/[id].tsx`
- `mobile/app/community/new-topic.tsx`
- `mobile/components/forum/TopicCard.tsx`
- `mobile/components/forum/ReplyCard.tsx`
- `mobile/components/forum/CategoryCard.tsx`
- `mobile/components/forum/ForumAuthorInfo.tsx`
- `mobile/components/forum/ReplyComposer.tsx`
- `mobile/components/forum/TopicComposer.tsx`
- `mobile/components/forum/ForumReactions.tsx`
- `mobile/components/forum/PeakTag.tsx`
- `mobile/components/forum/QuoteBlock.tsx`
- `mobile/components/forum/ForumSearch.tsx`

**Modify:**
- `mobile/lib/types/api.ts` — add forum API response types
- `mobile/app/(tabs)/explore/` — add Community button in header
- Peak detail screen — add discussions section
- User profile screen — add discussions tab

**Verify:**
- All 12 API endpoints return correct data (test via curl or Postman)
- Category list screen renders, navigates to topic list
- Topic list paginates with infinite scroll
- Topic detail shows replies, reactions work
- Reply composer submits (keyboard-aware)
- New topic creation works
- Peak-linked topics show tag, navigable
- Community accessible from Explore tab and peak detail
- `npm run build` passes (web), `npx expo start` runs (mobile)

### Phase 7: Polish

**Scope:** Empty states, loading skeletons, animations, dark mode audit, error handling, performance.

**Tasks:**
- Empty state illustrations for categories with no topics
- Loading skeleton components for topic lists and detail pages
- Fade-in animations on topic/reply cards (match existing `animate-fade-in-up`)
- Dark mode audit on all forum components (both platforms)
- Error boundaries and retry states
- Optimistic updates for reactions and bookmarks (both platforms)
- Meta tags / OG images for topic pages (SEO)
- Keyboard shortcuts on web: `Cmd+Enter` to submit, `Esc` to cancel
- "Unread" indicators on topic cards (based on forum_topic_views)
- Character count indicators on composers
- Slug collision handling (append `-2`, `-3`, etc.)
- Mobile: pull-to-refresh on all list screens
- Mobile: haptic feedback on reaction toggle

**Verify:**
- All empty states display correctly
- Loading states smooth, no layout shift
- Dark mode perfect on both platforms
- `npm run build` passes
- Manual end-to-end walkthrough: create account, browse community, create topic, reply, react, bookmark, search, view from peak page

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Empty forum on launch | Seed 3-5 topics per category as "SaltGoat Team". Write genuine trip reports and gear discussions. |
| Spam/abuse | Content flags + auto-hide at 3 flags. Require account creation. 30-min edit/delete window prevents drive-by trolling. Rate limit topic creation (future). |
| Performance at scale | Cursor-based pagination, denormalized counters (no COUNT(*) queries), GIN indexes for search. Sufficient for thousands of topics. |
| Markdown XSS | DOMPurify sanitization on web, react-native-markdown-display strips HTML on mobile. Never render raw HTML. |
| Slug collisions | Append numeric suffix on conflict. Category-scoped slugs reduce collision rate. |
| Mobile keyboard overlap | KeyboardAvoidingView on reply composer. Test on various iOS/Android devices. |
| Two-platform maintenance | Server modules are platform-agnostic. API endpoints are thin wrappers. Shared types via @saltgoat/shared. |
| Search quality | PostgreSQL full-text search is good enough for launch. Upgrade to dedicated search if >10k topics. |
| Admin tooling gaps | Single admin (Ben) for now. Forum moderation adds to existing queue. Consider community moderators (future). |
