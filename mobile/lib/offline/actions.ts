import { enqueueOutboxEntry } from './syncEngine';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface SummitPayload {
  peak_id: string;
  date_summited: string;
  conditions?: string | null;
  notes?: string | null;
  start_time?: string | null;
  summit_time?: string | null;
  party_size?: number | null;
  route_id?: string | null;
}

export async function enqueueSummit(payload: SummitPayload): Promise<string> {
  const localId = generateId();
  await enqueueOutboxEntry({
    id: generateId(),
    action: 'create_summit',
    endpoint: '/api/v1/summits',
    method: 'POST',
    payload: JSON.stringify(payload),
    created_at: Date.now(),
    priority: 2,
    local_id: localId,
  });
  return localId;
}

export interface ReviewPayload {
  slug: string;
  rating: number;
  title?: string;
  body?: string;
}

export async function enqueueReview(payload: ReviewPayload): Promise<string> {
  const localId = generateId();
  const { slug, ...body } = payload;
  await enqueueOutboxEntry({
    id: generateId(),
    action: 'create_review',
    endpoint: `/api/v1/peaks/${slug}/reviews`,
    method: 'POST',
    payload: JSON.stringify(body),
    created_at: Date.now(),
    priority: 3,
    local_id: localId,
  });
  return localId;
}

export interface TrailReportPayload {
  slug: string;
  hike_date: string;
  trail_status: string;
  snow_depth?: string | null;
  crowd_level: string;
  road_status: string;
  hazards?: string[];
  notes?: string | null;
}

export async function enqueueTrailReport(payload: TrailReportPayload): Promise<string> {
  const localId = generateId();
  const { slug, ...body } = payload;
  await enqueueOutboxEntry({
    id: generateId(),
    action: 'create_trail_report',
    endpoint: `/api/v1/peaks/${slug}/trail-reports`,
    method: 'POST',
    payload: JSON.stringify(body),
    created_at: Date.now(),
    priority: 3,
    local_id: localId,
  });
  return localId;
}
