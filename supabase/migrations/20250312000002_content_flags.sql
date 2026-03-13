-- Generic content flagging table for photos, reviews, trail reports

CREATE TABLE IF NOT EXISTS content_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('photo', 'review', 'trail_report')),
  content_id UUID NOT NULL,
  reported_by UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'spam', 'inaccurate', 'other')),
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'dismissed', 'actioned')),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, content_id, reported_by)
);

-- Indexes
CREATE INDEX content_flags_status_idx ON content_flags(status);
CREATE INDEX content_flags_content_idx ON content_flags(content_type, content_id);

-- Enable RLS
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own flags
CREATE POLICY "Authenticated users can create flags"
  ON content_flags FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

-- Admin can view all flags
CREATE POLICY "Admin can view flags"
  ON content_flags FOR SELECT
  USING (auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid);

-- Users can view their own flags (to prevent duplicate submissions)
CREATE POLICY "Users can view own flags"
  ON content_flags FOR SELECT
  USING (reported_by = auth.uid());

-- Admin can update flags (resolve/dismiss)
CREATE POLICY "Admin can update flags"
  ON content_flags FOR UPDATE
  USING (auth.uid() = 'c983d602-d0e0-4da6-be9d-f91a456bfdb0'::uuid);
