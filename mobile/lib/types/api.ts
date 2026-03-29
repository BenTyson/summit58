import type {
	PeakWithStandardRoute,
	PeakWithRoutes,
	ReviewWithProfile,
	TrailReportWithProfile,
	TrailReport,
	PeakImage,
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

export interface ReviewCreateRequest {
	rating: number;
	title?: string | null;
	body?: string | null;
}

export interface ReviewCreateResponse {
	review: UserReview;
	newAchievements: string[];
}

export interface TrailReportCreateRequest {
	hike_date: string;
	trail_status: string;
	snow_depth_inches?: number | null;
	crowd_level: string;
	road_status: string;
	hazards?: string[];
	notes?: string | null;
}

export interface TrailReportCreateResponse {
	trailReport: TrailReport;
	newAchievements: string[];
}

export interface ImageUploadResponse {
	image: PeakImage;
	url: string;
}

// --- Phase 3D: Social Features ---

// Activity feed types
export type ActivityType = 'summit' | 'review' | 'trail_report' | 'achievement';

export interface ActivityUser {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
}

export interface SummitActivityData {
	peak: {
		id: string;
		name: string;
		slug: string;
		elevation: number;
		thumbnail_url: string | null;
	};
	route: { id: string; name: string; difficulty_class: number } | null;
	date_summited: string;
	conditions: string | null;
	notes: string | null;
}

export interface ReviewActivityData {
	peak: { id: string; name: string; slug: string };
	rating: number;
	title: string | null;
	body: string | null;
	created_at: string;
}

export interface TrailReportActivityData {
	peak: { id: string; name: string; slug: string };
	hike_date: string;
	trail_status: string | null;
	hazards: string[] | null;
	notes: string | null;
}

export interface AchievementActivityData {
	achievement_id: string;
	earned_at: string;
	definition: { id: string; title: string; description: string; icon: string; category: string };
}

export interface ActivityItem {
	id: string;
	type: ActivityType;
	date: string;
	data: SummitActivityData | ReviewActivityData | TrailReportActivityData | AchievementActivityData;
	user?: ActivityUser;
}

// Reactions
export interface ReactionData {
	count: number;
	hasReacted: boolean;
	recentReactors: ActivityUser[];
}

// Comments
export interface SummitComment {
	id: string;
	user_id: string;
	summit_id: string;
	body: string;
	created_at: string;
	user: ActivityUser;
}

export interface CommentData {
	count: number;
	comments: SummitComment[];
}

// Activity feed response
export interface ActivityFeedResponse {
	items: ActivityItem[];
	reactions: Record<string, ReactionData>;
	comments: Record<string, CommentData>;
}

// Follows
export interface UserWithFollowStatus {
	id: string;
	display_name: string | null;
	username: string | null;
	avatar_url: string | null;
	bio: string | null;
	is_following: boolean;
	summitCount: number;
	peakOverlap?: number;
}

export interface SuggestedUsersResponse {
	suggestions: UserWithFollowStatus[];
}

// Public user profile
export interface PublicProfileResponse {
	profile: Profile;
	isOwnProfile: boolean;
	stats: {
		totalSummits: number;
		uniquePeaks: number;
		progress: number;
		totalElevation: number;
	};
	recentSummits: UserSummitWithPeak[];
	achievements: UserAchievementWithDef[];
	followStats: { followingCount: number; followersCount: number };
	isFollowing: boolean | null;
	reactions: Record<string, ReactionData>;
	comments: Record<string, CommentData>;
}
