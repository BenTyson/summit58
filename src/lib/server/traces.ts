import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import { parseGPX, simplifyCoordinates, type TrailGeometry } from './gpx';

const STORAGE_BUCKET = 'gpx-traces';
const MIN_POINTS = 50;
const MAX_POINTS = 2000;

// Colorado bounding box (generous)
const CO_BOUNDS = {
  minLat: 36.5,
  maxLat: 41.5,
  minLon: -109.5,
  maxLon: -101.5
};

export interface RouteTrace {
  id: string;
  route_id: string;
  uploaded_by: string;
  storage_path: string;
  trail_geometry: TrailGeometry;
  point_count: number;
  distance_miles: number | null;
  elevation_gain: number | null;
  vote_count: number;
  created_at: string;
}

export interface RouteTraceWithUploader extends RouteTrace {
  uploader: { id: string; display_name: string | null } | null;
  userVoted: boolean;
}

function validateColoradoBounds(coords: [number, number, number][]): boolean {
  return coords.every(
    ([lon, lat]) =>
      lat >= CO_BOUNDS.minLat &&
      lat <= CO_BOUNDS.maxLat &&
      lon >= CO_BOUNDS.minLon &&
      lon <= CO_BOUNDS.maxLon
  );
}

export async function uploadTrace(
  supabase: SupabaseClient<Database>,
  routeId: string,
  userId: string,
  gpxContent: string
): Promise<RouteTrace> {
  const geometry = parseGPX(gpxContent);
  if (!geometry) {
    throw new Error('Could not parse GPX file. Ensure it contains a valid track or route.');
  }

  if (geometry.coordinates.length < MIN_POINTS) {
    throw new Error(`GPX trace must have at least ${MIN_POINTS} points. Found ${geometry.coordinates.length}.`);
  }

  if (!validateColoradoBounds(geometry.coordinates)) {
    throw new Error('GPS coordinates are outside Colorado. Please upload a trace from a Colorado 14er.');
  }

  // Simplify if too many points
  let coords = geometry.coordinates;
  if (coords.length > MAX_POINTS) {
    coords = simplifyCoordinates(coords, 0.00005);
    // If still too many after simplification, increase tolerance
    if (coords.length > MAX_POINTS) {
      coords = simplifyCoordinates(coords, 0.0001);
    }
    geometry.coordinates = coords;
  }

  // Store raw GPX to storage (keyed by user for delete policy)
  const filename = `${userId}/${routeId}/${Date.now()}-${Math.random().toString(36).slice(2)}.gpx`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, gpxContent, {
      cacheControl: '31536000',
      contentType: 'application/gpx+xml',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('route_traces')
    .insert({
      route_id: routeId,
      uploaded_by: userId,
      storage_path: filename,
      trail_geometry: geometry as unknown as Record<string, unknown>,
      point_count: coords.length,
      distance_miles: geometry.properties.totalDistanceMiles,
      elevation_gain: geometry.properties.elevationGain
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from(STORAGE_BUCKET).remove([filename]);
    throw error;
  }

  return {
    ...data,
    trail_geometry: data.trail_geometry as unknown as TrailGeometry
  };
}

export async function getBestTrace(
  supabase: SupabaseClient<Database>,
  routeId: string
): Promise<TrailGeometry | null> {
  const { data, error } = await supabase
    .from('route_traces')
    .select('trail_geometry')
    .eq('route_id', routeId)
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  return data.trail_geometry as unknown as TrailGeometry;
}

export async function getTracesForRoute(
  supabase: SupabaseClient<Database>,
  routeId: string,
  currentUserId?: string
): Promise<RouteTraceWithUploader[]> {
  const { data, error } = await supabase
    .from('route_traces')
    .select('*')
    .eq('route_id', routeId)
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) return [];

  // Get uploader profiles
  const uploaderIds = [...new Set(data.map((t) => t.uploaded_by))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', uploaderIds);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  // Get current user's votes
  let votedTraceIds = new Set<string>();
  if (currentUserId) {
    const traceIds = data.map((t) => t.id);
    const { data: votes } = await supabase
      .from('route_trace_votes')
      .select('trace_id')
      .eq('user_id', currentUserId)
      .in('trace_id', traceIds);

    votedTraceIds = new Set(votes?.map((v) => v.trace_id) ?? []);
  }

  return data.map((trace) => ({
    ...trace,
    trail_geometry: trace.trail_geometry as unknown as TrailGeometry,
    uploader: profileMap.get(trace.uploaded_by) ?? null,
    userVoted: votedTraceIds.has(trace.id)
  }));
}

export async function toggleVote(
  supabase: SupabaseClient<Database>,
  traceId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_trace_vote', {
    p_trace_id: traceId,
    p_user_id: userId
  });

  if (error) throw error;
  return data as boolean;
}

export async function deleteTrace(
  supabase: SupabaseClient<Database>,
  traceId: string
): Promise<void> {
  const { data: trace, error: fetchError } = await supabase
    .from('route_traces')
    .select('storage_path')
    .eq('id', traceId)
    .single();

  if (fetchError) throw fetchError;

  await supabase.storage.from(STORAGE_BUCKET).remove([trace.storage_path]);

  const { error } = await supabase
    .from('route_traces')
    .delete()
    .eq('id', traceId);

  if (error) throw error;
}

export function getTraceDownloadUrl(
  supabase: SupabaseClient<Database>,
  storagePath: string
): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);
  return data.publicUrl;
}
