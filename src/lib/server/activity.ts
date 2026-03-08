import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import { ACHIEVEMENT_MAP, type AchievementDef } from '$lib/data/achievements';

// Activity types
export type ActivityType = 'summit' | 'review' | 'trail_report' | 'achievement';

export interface SummitActivity {
  peak: {
    id: string;
    name: string;
    slug: string;
    elevation: number;
    thumbnail_url: string | null;
  };
  route: {
    id: string;
    name: string;
    difficulty_class: number;
  } | null;
  date_summited: string;
  conditions: string | null;
  notes: string | null;
}

export interface ReviewActivity {
  peak: {
    id: string;
    name: string;
    slug: string;
  };
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
}

export interface TrailReportActivity {
  peak: {
    id: string;
    name: string;
    slug: string;
  };
  hike_date: string;
  trail_status: string | null;
  hazards: string[] | null;
  notes: string | null;
}

export interface AchievementActivity {
  achievement_id: string;
  earned_at: string;
  definition: AchievementDef;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  date: string;
  data: SummitActivity | ReviewActivity | TrailReportActivity | AchievementActivity;
  user?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

// Get unified activity feed for a user
export async function getUserActivityFeed(
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 50
): Promise<ActivityItem[]> {
  // Fetch all activity sources in parallel
  const [summitsRes, reviewsRes, reportsRes, achievementsRes] = await Promise.all([
    supabase
      .from('user_summits')
      .select(`
        id,
        date_summited,
        conditions,
        notes,
        peak:peaks(id, name, slug, elevation, thumbnail_url),
        route:routes(id, name, difficulty_class)
      `)
      .eq('user_id', userId)
      .order('date_summited', { ascending: false }),

    supabase
      .from('user_reviews')
      .select(`
        id,
        rating,
        title,
        body,
        created_at,
        peak:peaks(id, name, slug)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),

    supabase
      .from('trail_reports')
      .select(`
        id,
        hike_date,
        trail_status,
        hazards,
        notes,
        peak:peaks(id, name, slug)
      `)
      .eq('user_id', userId)
      .order('hike_date', { ascending: false }),

    supabase
      .from('user_achievements')
      .select('id, achievement_id, earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
  ]);

  const activities: ActivityItem[] = [];

  // Transform summits
  (summitsRes.data ?? []).forEach((s) => {
    activities.push({
      id: `summit-${s.id}`,
      type: 'summit',
      date: s.date_summited,
      data: {
        peak: s.peak as SummitActivity['peak'],
        route: s.route as SummitActivity['route'],
        date_summited: s.date_summited,
        conditions: s.conditions,
        notes: s.notes
      }
    });
  });

  // Transform reviews
  (reviewsRes.data ?? []).forEach((r) => {
    activities.push({
      id: `review-${r.id}`,
      type: 'review',
      date: r.created_at,
      data: {
        peak: r.peak as ReviewActivity['peak'],
        rating: r.rating,
        title: r.title,
        body: r.body,
        created_at: r.created_at
      }
    });
  });

  // Transform trail reports
  (reportsRes.data ?? []).forEach((t) => {
    activities.push({
      id: `report-${t.id}`,
      type: 'trail_report',
      date: t.hike_date,
      data: {
        peak: t.peak as TrailReportActivity['peak'],
        hike_date: t.hike_date,
        trail_status: t.trail_status,
        hazards: t.hazards,
        notes: t.notes
      }
    });
  });

  // Transform achievements
  (achievementsRes.data ?? []).forEach((a) => {
    const definition = ACHIEVEMENT_MAP.get(a.achievement_id);
    if (definition) {
      activities.push({
        id: `achievement-${a.id}`,
        type: 'achievement',
        date: a.earned_at,
        data: {
          achievement_id: a.achievement_id,
          earned_at: a.earned_at,
          definition
        }
      });
    }
  });

  // Sort by date descending
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply limit
  return activities.slice(0, limit);
}

// Get activity feed for users the current user follows
export async function getFollowingActivityFeed(
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 20
): Promise<ActivityItem[]> {
  // Get following IDs
  const { data: follows } = await supabase
    .from('user_follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (!follows || follows.length === 0) return [];

  const followingIds = follows.map((f) => f.following_id);

  // Date limit: last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateLimit = thirtyDaysAgo.toISOString().split('T')[0];

  // Fetch profiles for all followed users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', followingIds);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, { id: p.id, display_name: p.display_name, avatar_url: p.avatar_url }])
  );

  // Fetch activity from all sources in parallel
  const [summitsRes, reviewsRes, reportsRes, achievementsRes] = await Promise.all([
    supabase
      .from('user_summits')
      .select(`
        id,
        user_id,
        date_summited,
        conditions,
        notes,
        peak:peaks(id, name, slug, elevation, thumbnail_url),
        route:routes(id, name, difficulty_class)
      `)
      .in('user_id', followingIds)
      .gte('date_summited', dateLimit)
      .order('date_summited', { ascending: false }),

    supabase
      .from('user_reviews')
      .select(`
        id,
        user_id,
        rating,
        title,
        body,
        created_at,
        peak:peaks(id, name, slug)
      `)
      .in('user_id', followingIds)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false }),

    supabase
      .from('trail_reports')
      .select(`
        id,
        user_id,
        hike_date,
        trail_status,
        hazards,
        notes,
        peak:peaks(id, name, slug)
      `)
      .in('user_id', followingIds)
      .gte('hike_date', dateLimit)
      .order('hike_date', { ascending: false }),

    supabase
      .from('user_achievements')
      .select('id, user_id, achievement_id, earned_at')
      .in('user_id', followingIds)
      .gte('earned_at', thirtyDaysAgo.toISOString())
      .order('earned_at', { ascending: false })
  ]);

  const activities: ActivityItem[] = [];

  (summitsRes.data ?? []).forEach((s: any) => {
    activities.push({
      id: `summit-${s.id}`,
      type: 'summit',
      date: s.date_summited,
      data: {
        peak: s.peak as SummitActivity['peak'],
        route: s.route as SummitActivity['route'],
        date_summited: s.date_summited,
        conditions: s.conditions,
        notes: s.notes
      },
      user: profileMap.get(s.user_id)
    });
  });

  (reviewsRes.data ?? []).forEach((r: any) => {
    activities.push({
      id: `review-${r.id}`,
      type: 'review',
      date: r.created_at,
      data: {
        peak: r.peak as ReviewActivity['peak'],
        rating: r.rating,
        title: r.title,
        body: r.body,
        created_at: r.created_at
      },
      user: profileMap.get(r.user_id)
    });
  });

  (reportsRes.data ?? []).forEach((t: any) => {
    activities.push({
      id: `report-${t.id}`,
      type: 'trail_report',
      date: t.hike_date,
      data: {
        peak: t.peak as TrailReportActivity['peak'],
        hike_date: t.hike_date,
        trail_status: t.trail_status,
        hazards: t.hazards,
        notes: t.notes
      },
      user: profileMap.get(t.user_id)
    });
  });

  (achievementsRes.data ?? []).forEach((a: any) => {
    const definition = ACHIEVEMENT_MAP.get(a.achievement_id);
    if (definition) {
      activities.push({
        id: `achievement-${a.id}`,
        type: 'achievement',
        date: a.earned_at,
        data: {
          achievement_id: a.achievement_id,
          earned_at: a.earned_at,
          definition
        },
        user: profileMap.get(a.user_id)
      });
    }
  });

  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return activities.slice(0, limit);
}
