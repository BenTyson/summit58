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
