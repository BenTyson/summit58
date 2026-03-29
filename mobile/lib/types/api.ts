import type {
	PeakWithStandardRoute,
	PeakWithRoutes,
	ReviewWithProfile,
	TrailReportWithProfile,
	PeakImageWithUrl,
	PeakConditions,
	UserSummit,
	UserReview,
	UserSummitWithPeak,
	UserAchievementWithDef,
	Profile
} from '@saltgoat/shared/types/helpers';

export interface PeaksListResponse {
	peaks: PeakWithStandardRoute[];
	summitedPeakIds: string[];
}

export interface PeakDetailResponse {
	peak: PeakWithRoutes;
	reviews: ReviewWithProfile[];
	avgRating: number;
	totalReviews: number;
	images: PeakImageWithUrl[];
	conditions: PeakConditions[];
	trailReports: TrailReportWithProfile[];
	relatedPeaks: PeakWithStandardRoute[];
	userData?: {
		userSummits: UserSummit[];
		userReview: UserReview | null;
		isWatched: boolean;
	};
}

export interface ConditionsResponse {
	conditions: PeakConditions[];
}

export interface PeakGridItem {
	id: string;
	name: string;
	slug: string;
	rank: number;
	range: string;
	elevation: number;
}

export interface SummitStats {
	totalSummits: number;
	uniquePeaks: number;
	progress: number;
	recentSummits: UserSummitWithPeak[];
	totalElevationGain: number;
	totalDistanceMiles: number;
	highestPeak: { name: string; elevation: number } | null;
	avgElevation: number;
}

export interface ProfileResponse {
	profile: Profile;
	summitStats: SummitStats;
	summits: UserSummitWithPeak[];
	achievements: UserAchievementWithDef[];
	uniquePeakIds: string[];
	allPeaks: PeakGridItem[];
}

export interface SummitCreateRequest {
	peak_id: string;
	date_summited: string;
	route_id?: string;
	conditions?: string;
	notes?: string;
	start_time?: string;
	summit_time?: string;
	party_size?: number;
}

export interface SummitCreateResponse {
	summit: UserSummit;
	newAchievements: string[];
}

export interface SummitUpdateRequest {
	date_summited?: string;
	route_id?: string | null;
	conditions?: string | null;
	notes?: string | null;
	start_time?: string | null;
	summit_time?: string | null;
	party_size?: number | null;
}

export interface CanLogSummitResponse {
	allowed: boolean;
	remaining: number;
	isPro: boolean;
}
