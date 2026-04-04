-- ========================================
-- COMMUNITY FORUM
-- Discussion platform with categories, topics, replies,
-- reactions, bookmarks, views, and mentions
-- ========================================

-- ─── forum_categories ──────────────────────────────────────────

CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  topic_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_categories_select" ON forum_categories
  FOR SELECT USING (true);

-- ─── forum_topics ──────────────────────────────────────────────

CREATE TABLE forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  body TEXT NOT NULL CHECK (char_length(body) >= 10 AND char_length(body) <= 10000),
  category_id UUID NOT NULL REFERENCES forum_categories(id),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peak_id UUID REFERENCES peaks(id) ON DELETE SET NULL,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  reply_count INT NOT NULL DEFAULT 0,
  view_count INT NOT NULL DEFAULT 0,
  reaction_count INT NOT NULL DEFAULT 0,
  last_reply_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reply_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

CREATE INDEX forum_topics_category_listing_idx
  ON forum_topics(category_id, is_pinned DESC, last_reply_at DESC NULLS LAST);
CREATE INDEX forum_topics_author_idx
  ON forum_topics(author_id, created_at DESC);
CREATE INDEX forum_topics_peak_idx
  ON forum_topics(peak_id, last_reply_at DESC) WHERE peak_id IS NOT NULL;
CREATE INDEX forum_topics_search_idx
  ON forum_topics USING GIN(search_vector);

ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_topics_select" ON forum_topics
  FOR SELECT USING (true);

CREATE POLICY "forum_topics_insert" ON forum_topics
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "forum_topics_update" ON forum_topics
  FOR UPDATE USING (
    auth.uid() = author_id
    AND (created_at > now() - interval '30 minutes' OR reply_count = 0)
  );

CREATE POLICY "forum_topics_delete" ON forum_topics
  FOR DELETE USING (
    auth.uid() = author_id
    AND (created_at > now() - interval '30 minutes' OR reply_count = 0)
  );

-- ─── forum_replies ─────────────────────────────────────────────

CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 5000),
  reply_to_id UUID REFERENCES forum_replies(id) ON DELETE SET NULL,
  reaction_count INT NOT NULL DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX forum_replies_topic_idx ON forum_replies(topic_id, created_at);
CREATE INDEX forum_replies_author_idx ON forum_replies(author_id, created_at DESC);
CREATE INDEX forum_replies_search_idx ON forum_replies USING GIN(search_vector);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_replies_select" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "forum_replies_insert" ON forum_replies
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND NOT EXISTS (
      SELECT 1 FROM forum_topics WHERE id = topic_id AND is_locked = true
    )
  );

CREATE POLICY "forum_replies_update" ON forum_replies
  FOR UPDATE USING (
    auth.uid() = author_id
    AND created_at > now() - interval '30 minutes'
  );

CREATE POLICY "forum_replies_delete" ON forum_replies
  FOR DELETE USING (
    auth.uid() = author_id
    AND created_at > now() - interval '30 minutes'
  );

-- ─── forum_reactions ───────────────────────────────────────────

CREATE TABLE forum_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reactable_type TEXT NOT NULL CHECK (reactable_type IN ('topic', 'reply')),
  reactable_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'helpful', 'fire', 'summit')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reactable_type, reactable_id, user_id, reaction_type)
);

CREATE INDEX forum_reactions_target_idx ON forum_reactions(reactable_type, reactable_id);

ALTER TABLE forum_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_reactions_select" ON forum_reactions
  FOR SELECT USING (true);

CREATE POLICY "forum_reactions_insert" ON forum_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "forum_reactions_delete" ON forum_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- ─── forum_bookmarks ──────────────────────────────────────────

CREATE TABLE forum_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(topic_id, user_id)
);

CREATE INDEX forum_bookmarks_user_idx ON forum_bookmarks(user_id, created_at DESC);

ALTER TABLE forum_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_bookmarks_select" ON forum_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "forum_bookmarks_insert" ON forum_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "forum_bookmarks_delete" ON forum_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- ─── forum_topic_views ────────────────────────────────────────

CREATE TABLE forum_topic_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(topic_id, user_id)
);

CREATE INDEX forum_topic_views_user_idx ON forum_topic_views(user_id, last_viewed_at DESC);

ALTER TABLE forum_topic_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_topic_views_select" ON forum_topic_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "forum_topic_views_insert" ON forum_topic_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "forum_topic_views_update" ON forum_topic_views
  FOR UPDATE USING (auth.uid() = user_id);

-- ─── forum_mentions ───────────────────────────────────────────

CREATE TABLE forum_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type TEXT NOT NULL CHECK (post_type IN ('topic', 'reply')),
  post_id UUID NOT NULL,
  mentioned_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX forum_mentions_user_idx ON forum_mentions(mentioned_user_id, read, created_at DESC);
CREATE INDEX forum_mentions_post_idx ON forum_mentions(post_type, post_id);

ALTER TABLE forum_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_mentions_select" ON forum_mentions
  FOR SELECT USING (auth.uid() = mentioned_user_id);

CREATE POLICY "forum_mentions_insert" ON forum_mentions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ─── Trigger Functions ────────────────────────────────────────

-- Search vector for topics
CREATE OR REPLACE FUNCTION update_forum_topic_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.title, '') || ' ' || coalesce(NEW.body, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topic_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, body ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION update_forum_topic_search_vector();

-- Search vector for replies
CREATE OR REPLACE FUNCTION update_forum_reply_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.body, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_reply_search_vector_trigger
  BEFORE INSERT OR UPDATE OF body ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_forum_reply_search_vector();

-- Reply count + last reply tracking on topics
CREATE OR REPLACE FUNCTION handle_forum_reply_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_topics
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at,
        last_reply_by = NEW.author_id
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_topics
    SET reply_count = GREATEST(reply_count - 1, 0),
        last_reply_at = COALESCE(
          (SELECT MAX(created_at) FROM forum_replies WHERE topic_id = OLD.topic_id AND id != OLD.id),
          (SELECT created_at FROM forum_topics WHERE id = OLD.topic_id)
        ),
        last_reply_by = (
          SELECT author_id FROM forum_replies
          WHERE topic_id = OLD.topic_id AND id != OLD.id
          ORDER BY created_at DESC LIMIT 1
        )
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_reply_change_trigger
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION handle_forum_reply_change();

-- Category topic count (INSERT/DELETE)
CREATE OR REPLACE FUNCTION handle_forum_topic_count_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_categories SET topic_count = topic_count + 1 WHERE id = NEW.category_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_categories SET topic_count = GREATEST(topic_count - 1, 0) WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topic_count_trigger
  AFTER INSERT OR DELETE ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION handle_forum_topic_count_change();

-- Category topic count (UPDATE of category_id — topic move)
CREATE OR REPLACE FUNCTION handle_forum_topic_move()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    UPDATE forum_categories SET topic_count = GREATEST(topic_count - 1, 0) WHERE id = OLD.category_id;
    UPDATE forum_categories SET topic_count = topic_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topic_move_trigger
  AFTER UPDATE OF category_id ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION handle_forum_topic_move();

-- Reaction count on topics/replies
CREATE OR REPLACE FUNCTION handle_forum_reaction_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reactable_type = 'topic' THEN
      UPDATE forum_topics SET reaction_count = reaction_count + 1 WHERE id = NEW.reactable_id;
    ELSIF NEW.reactable_type = 'reply' THEN
      UPDATE forum_replies SET reaction_count = reaction_count + 1 WHERE id = NEW.reactable_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reactable_type = 'topic' THEN
      UPDATE forum_topics SET reaction_count = GREATEST(reaction_count - 1, 0) WHERE id = OLD.reactable_id;
    ELSIF OLD.reactable_type = 'reply' THEN
      UPDATE forum_replies SET reaction_count = GREATEST(reaction_count - 1, 0) WHERE id = OLD.reactable_id;
    END IF;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_reaction_change_trigger
  AFTER INSERT OR DELETE ON forum_reactions
  FOR EACH ROW EXECUTE FUNCTION handle_forum_reaction_change();

-- View count (only increments on true INSERT, not upsert UPDATE path)
CREATE OR REPLACE FUNCTION handle_forum_topic_view()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE forum_topics SET view_count = view_count + 1 WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topic_view_trigger
  AFTER INSERT ON forum_topic_views
  FOR EACH ROW EXECUTE FUNCTION handle_forum_topic_view();

-- Updated_at timestamp
CREATE OR REPLACE FUNCTION update_forum_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_topics_updated_at
  BEFORE UPDATE ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at();

CREATE TRIGGER forum_replies_updated_at
  BEFORE UPDATE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_forum_updated_at();

-- ─── Search RPC ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION search_forum(
  search_query TEXT,
  category_filter UUID DEFAULT NULL,
  result_limit INT DEFAULT 20,
  result_offset INT DEFAULT 0
)
RETURNS TABLE (
  result_type TEXT,
  id UUID,
  topic_id UUID,
  topic_title TEXT,
  topic_slug TEXT,
  category_slug TEXT,
  title TEXT,
  body TEXT,
  author_display_name TEXT,
  author_avatar_url TEXT,
  rank REAL,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  tsq TSQUERY;
BEGIN
  tsq := websearch_to_tsquery('english', search_query);

  RETURN QUERY
  SELECT * FROM (
    SELECT
      'topic'::TEXT AS result_type,
      t.id,
      t.id AS topic_id,
      t.title AS topic_title,
      t.slug AS topic_slug,
      c.slug AS category_slug,
      t.title,
      left(t.body, 200) AS body,
      p.display_name AS author_display_name,
      p.avatar_url AS author_avatar_url,
      ts_rank(t.search_vector, tsq) AS rank,
      t.created_at
    FROM forum_topics t
    JOIN forum_categories c ON c.id = t.category_id
    JOIN profiles p ON p.id = t.author_id
    WHERE t.search_vector @@ tsq
      AND (category_filter IS NULL OR t.category_id = category_filter)

    UNION ALL

    SELECT
      'reply'::TEXT,
      r.id,
      r.topic_id,
      t.title,
      t.slug,
      c.slug,
      NULL::TEXT,
      left(r.body, 200),
      p.display_name,
      p.avatar_url,
      ts_rank(r.search_vector, tsq),
      r.created_at
    FROM forum_replies r
    JOIN forum_topics t ON t.id = r.topic_id
    JOIN forum_categories c ON c.id = t.category_id
    JOIN profiles p ON p.id = r.author_id
    WHERE r.search_vector @@ tsq
      AND (category_filter IS NULL OR t.category_id = category_filter)
  ) combined
  ORDER BY rank DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ─── Seed Data ────────────────────────────────────────────────

INSERT INTO forum_categories (slug, name, description, icon, color, display_order) VALUES
  ('trip-reports', 'Trip Reports & Beta', 'Recent conditions, route reports, summit stories', 'mountain', 'class-1', 0),
  ('trip-planning', 'Trip Planning', 'Partner finding, advice, itineraries', 'compass', 'class-2', 1),
  ('gear', 'Gear & Equipment', 'Reviews, recommendations, what to bring', 'backpack', 'accent', 2),
  ('general', 'General Discussion', 'Anything 14er-related', 'message-circle', 'mountain-blue', 3),
  ('safety', 'Safety & Skills', 'Navigation, weather, first aid, training', 'shield-alert', 'class-4', 4),
  ('photography', 'Peak Photography', 'Photo sharing, camera gear, technique', 'camera', 'class-3', 5);

-- ─── Storage Bucket ───────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'forum-images',
  'forum-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

CREATE POLICY "forum_images_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'forum-images' AND auth.role() = 'authenticated');

CREATE POLICY "forum_images_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'forum-images');

CREATE POLICY "forum_images_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'forum-images' AND auth.uid()::text = (storage.foldername(name))[1]);
