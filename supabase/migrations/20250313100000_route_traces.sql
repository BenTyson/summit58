-- route_traces: community GPX uploads
CREATE TABLE route_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  storage_path TEXT NOT NULL,
  trail_geometry JSONB NOT NULL,
  point_count INTEGER NOT NULL,
  distance_miles NUMERIC(5,1),
  elevation_gain INTEGER,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX route_traces_route_idx ON route_traces(route_id);
CREATE INDEX route_traces_best_idx ON route_traces(route_id, vote_count DESC);

ALTER TABLE route_traces ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "route_traces_select" ON route_traces
  FOR SELECT USING (true);

-- Authenticated insert
CREATE POLICY "route_traces_insert" ON route_traces
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Owner delete
CREATE POLICY "route_traces_delete" ON route_traces
  FOR DELETE USING (auth.uid() = uploaded_by);

-- route_trace_votes: one upvote per user per trace
CREATE TABLE route_trace_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id UUID NOT NULL REFERENCES route_traces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trace_id, user_id)
);

CREATE INDEX route_trace_votes_trace_idx ON route_trace_votes(trace_id);

ALTER TABLE route_trace_votes ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "route_trace_votes_select" ON route_trace_votes
  FOR SELECT USING (true);

-- Authenticated insert own
CREATE POLICY "route_trace_votes_insert" ON route_trace_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delete own
CREATE POLICY "route_trace_votes_delete" ON route_trace_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Atomic vote toggle RPC (SECURITY DEFINER to bypass UPDATE RLS on route_traces.vote_count)
CREATE OR REPLACE FUNCTION toggle_trace_vote(p_trace_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM route_trace_votes
    WHERE trace_id = p_trace_id AND user_id = p_user_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM route_trace_votes
    WHERE trace_id = p_trace_id AND user_id = p_user_id;

    UPDATE route_traces
    SET vote_count = GREATEST(0, vote_count - 1)
    WHERE id = p_trace_id;

    RETURN FALSE; -- vote removed
  ELSE
    INSERT INTO route_trace_votes (trace_id, user_id)
    VALUES (p_trace_id, p_user_id);

    UPDATE route_traces
    SET vote_count = vote_count + 1
    WHERE id = p_trace_id;

    RETURN TRUE; -- vote added
  END IF;
END;
$$;

-- Storage bucket for GPX files
INSERT INTO storage.buckets (id, name, public)
VALUES ('gpx-traces', 'gpx-traces', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read
CREATE POLICY "gpx_traces_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gpx-traces');

-- Authenticated upload
CREATE POLICY "gpx_traces_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gpx-traces'
    AND auth.role() = 'authenticated'
  );

-- Owner delete (path starts with user id)
CREATE POLICY "gpx_traces_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gpx-traces'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
