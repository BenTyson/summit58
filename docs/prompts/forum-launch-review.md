# Forum Launch Review — Full Audit, Modularize, Optimize

You are reviewing the community forum feature for SaltGoat (Colorado 14ers tracking app) before it goes live. The forum was built across 7 phases and touches 73 files across web (SvelteKit 5), mobile (Expo/React Native), and shared infrastructure (Supabase/PostgreSQL). Your job is to audit, clean up, modularize, and optimize — not add features.

READ `docs/forum.md` for the full feature spec and `CLAUDE.md` for project conventions.

## What was built

- **Database:** 7 tables (forum_categories, forum_topics, forum_replies, forum_reactions, forum_bookmarks, forum_topic_views, forum_topic_search), RLS policies, triggers for denormalized counters, GIN indexes for full-text search. Migration: `supabase/migrations/20260403000000_community_forum.sql`
- **Server modules (4):** `src/lib/server/forum.ts` (~700 lines, 20+ exports), `forumReactions.ts`, `forumBookmarks.ts`, `forumAdmin.ts`
- **Web components (14):** `src/lib/components/forum/` — TopicCard, ReplyCard, CategoryCard, TopicDetail, ForumReactions, ReplyComposer, TopicComposer, ForumAuthorInfo, ForumBreadcrumb, PeakTag, QuoteBlock, PeakDiscussions, TopicCardSkeleton, CategoryCardSkeleton
- **Web routes (10):** `src/routes/community/` — hub, category listing, topic detail, topic creation, search (each with +page.svelte and +page.server.ts)
- **API endpoints (8):** `src/routes/api/v1/forum/` — categories, topics, topic detail, replies, reactions, bookmarks, search
- **Mobile components (13):** `mobile/components/forum/` — mirrors web components plus SkeletonBlock, TopicCardSkeleton, CategoryCardSkeleton
- **Mobile screens (4):** `mobile/app/community/` — hub, category listing, topic detail, new topic
- **Integration points:** Peak detail page discussions section, user profile discussions, admin moderation (pin/lock/move/delete), admin stats

## What to do

### 1. Code review — correctness and safety

Read every forum file. Look for:

- **XSS vectors:** Markdown rendering uses `marked` + `DOMPurify` on web. Verify sanitization is applied everywhere rendered HTML appears (TopicDetail.svelte, ReplyCard.svelte inline edit). Mobile uses plain Text components — verify no `dangerouslySetInnerHTML` equivalents.
- **SQL injection / RLS gaps:** All server modules use the Supabase client's query builder (not raw SQL). Verify no `.rpc()` calls with string interpolation. Verify RLS policies in the migration match what the server modules expect (e.g., users can only delete their own topics within the edit window).
- **Auth checks:** Every mutating API endpoint and form action must verify `session.user` exists. Check all 8 API endpoints + all form actions in `src/routes/community/[category]/[topic]/+page.server.ts`.
- **Input validation:** Title length (5-200), body length (10-10000 for topics, 1-5000 for replies). Verify server-side validation matches database CHECK constraints. Verify validation exists on both form actions AND API endpoints — not just one.
- **Race conditions:** `toggleForumReaction` and `toggleBookmark` do read-then-write. Verify this is safe under concurrent requests (Supabase's serializable transactions, or upsert/ON CONFLICT patterns).
- **Denormalized counter accuracy:** `reply_count`, `reaction_count`, `view_count`, `topic_count` are maintained by triggers. Verify triggers handle all edge cases (delete cascades, etc.).

### 2. Modularize — break up large files

`src/lib/server/forum.ts` is the main target. It contains ~20+ exports handling categories, topics, replies, search, views, and slug generation. Split into focused modules:

- `src/lib/server/forum/categories.ts` — `getCategories`, `getCategoryBySlug`
- `src/lib/server/forum/topics.ts` — `getTopicsByCategory`, `getPopularTopics`, `getRecentTopics`, `getTopicsForPeak`, `getUserTopics`, `getTopicBySlug`, `getTopicDetail`, `createTopic`, `updateTopic`, `deleteTopic`
- `src/lib/server/forum/replies.ts` — `getReplies`, `createReply`, `updateReply`, `deleteReply`
- `src/lib/server/forum/search.ts` — `searchForum`
- `src/lib/server/forum/views.ts` — `recordTopicView`, `getUserTopicViewTimestamps`
- `src/lib/server/forum/utils.ts` — `generateUniqueSlug`, shared helpers, the `db()` wrapper
- `src/lib/server/forum/index.ts` — re-exports everything for backward compatibility

Keep `forumReactions.ts`, `forumBookmarks.ts`, `forumAdmin.ts` as-is (they're already focused). Move them into the `forum/` directory too if it makes sense.

Update all imports across routes and API endpoints after splitting. Verify `npm run build` passes.

### 3. Compartmentalize — reduce coupling and duplication

- **Shared SVG icons:** The category icon SVGs (mountain, compass, backpack, message-circle, shield-alert, camera) are duplicated in `[category]/+page.svelte` header AND empty state sections. Extract to a `CategoryIcon.svelte` component that accepts the icon name and size.
- **`formatRelativeTime`:** Duplicated in `TopicCard.svelte` and `ReplyCard.svelte` (web), and `TopicCard.tsx` (mobile as `timeAgo`). Extract to a shared utility — web: `src/lib/utils/time.ts`, mobile: `mobile/lib/utils/time.ts` (or add to `@saltgoat/shared` if not already there).
- **Reaction type definitions:** The 4 reaction types (`like`, `helpful`, `fire`, `summit`) are defined as arrays in both `ForumReactions.svelte` (web) and `ForumReactions.tsx` (mobile). Consider putting the canonical list in `@saltgoat/shared` or at minimum keep them consistent.
- **`isUnread` logic:** Currently duplicated as inline functions in both `community/+page.svelte` and `community/[category]/+page.svelte`. Extract to a shared helper or the forum views module.
- **Skeleton components:** Web has `TopicCardSkeleton.svelte` and `CategoryCardSkeleton.svelte`. Mobile has `TopicCardSkeleton.tsx`, `CategoryCardSkeleton.tsx`, and a generic `SkeletonBlock.tsx`. These are appropriately platform-specific — no cross-platform sharing needed, just verify layout consistency.
- **Mobile color pattern:** All 13 mobile forum files now use `useColorScheme()` + `const theme = colorScheme === 'dark' ? colors.dark : colors.light`. This is fine but repetitive — consider a `useTheme()` hook that returns `theme` directly. Check if one already exists elsewhere in the mobile app.

### 4. Optimize — performance and bundle

- **`forum.ts` query efficiency:** Review every Supabase query for:
  - Unnecessary `select('*')` — only select needed columns
  - Missing `.limit()` on queries that should be bounded
  - N+1 patterns — batch operations where possible (already uses `getReactionsForPosts` batch pattern, verify no regressions)
  - Index usage — verify the queries in `getTopicsByCategory`, `getPopularTopics`, `searchForum` align with the indexes defined in the migration

- **Web page load optimization:**
  - `community/[category]/[topic]/+page.server.ts` runs `getReplies` + `getReactionsForPosts` (topic) + `getReactionsForPosts` (all replies) + `getBookmarkStatus` + `recordTopicView` sequentially or in `Promise.all`. Verify `Promise.all` is used where possible. `recordTopicView` is fire-and-forget (no `await` needed).
  - Hub page loads categories + recent + popular + bookmarks + topic views — verify parallelism.

- **Component lazy loading:** The community pages pull in `marked` + `DOMPurify` for markdown rendering. These are only needed on the topic detail page (where rendered bodies appear). Verify they're not pulled into the category listing page bundle. If they are, consider dynamic imports.

- **Mobile performance:**
  - `ForumReactions.tsx` creates a new `ScrollView` per reaction bar. On a topic detail page with 30 replies, that's 31 ScrollViews. Verify this doesn't cause performance issues — may need to replace with a simple `View` + `flexDirection: 'row'` since 4 items never need scrolling.
  - `SkeletonBlock.tsx` creates a new `Animated.loop` per instance. On a loading screen with 10+ skeleton blocks, that's 10+ independent animation loops. Consider a shared animation driver or use `react-native-reanimated` for better performance.

### 5. Type safety

- **Forum types in `@saltgoat/shared`:** Check whether forum types were added to the shared package or only exist in `src/lib/server/forum.ts` and `mobile/lib/types/api.ts`. If they're not shared, the mobile types are manually duplicated and could drift. Evaluate whether key types (`ForumCategory`, `ForumTopic`, `ForumReply`, `ForumReactionData`) should live in `@saltgoat/shared`.
- **Database types:** After `supabase gen types typescript`, verify the generated types include the forum tables. Check that the server modules' type assertions (`as ForumTopicWithAuthor[]`) are safe — no runtime type mismatches possible.
- **API response types:** Verify the mobile `ForumTopicsResponse`, `ForumCategoriesResponse`, etc. in `mobile/lib/types/api.ts` match the actual shapes returned by the API endpoints. Any mismatch will cause silent runtime errors.

### 6. Missing pieces for launch

These items are noted as deferred in `docs/forum.md`. Evaluate whether they're truly optional for launch or should be addressed now:

- **Content flags:** Forum topics and replies have no flag/report button. The existing `content_flags` table needs its `content_type` CHECK constraint extended to include `'forum_topic'` and `'forum_reply'`. Without this, users cannot report abusive content. **Recommend: add before launch.**
- **Activity feed integration:** `forum_topic` as an ActivityType so new topics appear in followers' feeds. Nice-to-have but not blocking.
- **Rate limiting:** No rate limiting on topic creation or reply creation API endpoints. A bad actor could spam thousands of topics. At minimum add a simple per-user throttle.
- **Seed content:** The forum will launch empty. The spec says to seed 3-5 topics per category as "SaltGoat Team" with genuine trip reports and gear discussions. Write the seed script or SQL.

### 7. Documentation

- **Update `CLAUDE.md`:** Add forum tables to the Database Tables section. Add forum routes to Key Routes. Add forum API endpoints to the Mobile REST API table. Add `src/lib/server/forum/` to the Server Modules table (after modularization). Add the community routes to the Key Routes section.
- **Update `docs/forum.md`:** Mark Phase 7 as COMPLETE with the completion date and summary of what was done. Add a "Launch Checklist" section.

## Constraints

- Do NOT add new features. This is cleanup only.
- Match existing code style — Svelte 5 runes, dark mode via `.dark` class, existing naming conventions.
- `npm run build` must pass after every change.
- Do not modify the database migration — it's already been pushed. Any schema changes need a new migration.
- Keep all API endpoints backward-compatible with deployed mobile clients.

## Verification

After all changes:
1. `npm run build` passes
2. All imports resolve — no broken references from the modularization
3. Manual walkthrough: browse community hub, category, topic detail, create topic, reply, react, bookmark, search, admin moderation — all still work
4. Dark mode correct on all forum pages (web)
5. No new TypeScript errors in `mobile/` directory
