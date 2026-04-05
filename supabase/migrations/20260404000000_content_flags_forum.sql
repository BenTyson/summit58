-- Extend content_flags to support forum content types

ALTER TABLE content_flags
  DROP CONSTRAINT IF EXISTS content_flags_content_type_check;

ALTER TABLE content_flags
  ADD CONSTRAINT content_flags_content_type_check
    CHECK (content_type IN ('photo', 'review', 'trail_report', 'forum_topic', 'forum_reply'));
