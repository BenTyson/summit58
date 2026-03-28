import type { Tables } from './database';
import type { AchievementDef } from '../data/achievements';

export type Peak = Tables<'peaks'>;
export type Route = Tables<'routes'>;
export type PeakWithRoutes = Peak & { routes: Route[] };
export type PeakWithStandardRoute = Peak & { standard_route?: Route };

// Composite types shared between web and mobile API responses
export type UserSummit = Tables<'user_summits'>;
export type UserReview = Tables<'user_reviews'>;
export type TrailReport = Tables<'trail_reports'>;
export type PeakConditions = Tables<'peak_conditions'>;
export type PeakImage = Tables<'peak_images'>;
export type UserAchievement = Tables<'user_achievements'>;
export type Profile = Tables<'profiles'>;

export type UserSummitWithPeak = UserSummit & {
	peak: {
		id: string;
		name: string;
		slug: string;
		elevation: number;
		range: string;
		thumbnail_url: string | null;
	};
	route: {
		id: string;
		name: string;
		difficulty_class: number;
	} | null;
};

export type ReviewWithProfile = UserReview & {
	profile: { display_name: string | null; avatar_url: string | null } | null;
};

export type TrailReportWithProfile = TrailReport & {
	profile: { display_name: string | null; avatar_url: string | null } | null;
};

export type PeakImageWithUrl = PeakImage & {
	url: string;
	uploader: { id: string; display_name: string | null } | null;
};

export type UserAchievementWithDef = UserAchievement & {
	definition: AchievementDef;
};
