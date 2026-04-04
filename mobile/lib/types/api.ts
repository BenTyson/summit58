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
	Profile,
	ForecastResponse,
	ElevationBandForecast,
	DayForecast,
	PeriodForecast,
	HikerInsight,
	TrailGeometry
} from '@saltgoat/shared/types/helpers';

export type { ForecastResponse, ElevationBandForecast, DayForecast, PeriodForecast, HikerInsight, TrailGeometry };

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

// --- Forum Types ---

export interface ForumCategory {
	id: string;
	slug: string;
	name: string;
	description: string;
	icon: string;
	color: string;
	display_order: number;
	topic_count: number;
	created_at: string;
}

export interface ForumAuthorProfile {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
	summit_count: number;
}

export interface ForumTopic {
	id: string;
	slug: string;
	title: string;
	body: string;
	category_id: string;
	author_id: string;
	peak_id: string | null;
	route_id: string | null;
	is_pinned: boolean;
	is_locked: boolean;
	reply_count: number;
	view_count: number;
	reaction_count: number;
	last_reply_at: string;
	last_reply_by: string | null;
	created_at: string;
	updated_at: string;
	author: ForumAuthorProfile;
	peak: { id: string; name: string; slug: string } | null;
}

export interface ForumTopicDetail extends ForumTopic {
	category: ForumCategory;
	route: { id: string; name: string } | null;
}

export interface ForumReply {
	id: string;
	topic_id: string;
	author_id: string;
	body: string;
	reply_to_id: string | null;
	reaction_count: number;
	created_at: string;
	updated_at: string;
	author: ForumAuthorProfile;
	quoted_reply: {
		id: string;
		body: string;
		author: { display_name: string | null };
	} | null;
}

export interface ForumReactionData {
	counts: Record<string, number>;
	userReactions: string[];
}

export interface ForumSearchResult {
	result_type: 'topic' | 'reply';
	id: string;
	topic_id: string;
	topic_title: string;
	topic_slug: string;
	category_slug: string;
	title: string | null;
	body: string;
	author_display_name: string | null;
	author_avatar_url: string | null;
	rank: number;
	created_at: string;
}

export interface ForumCategoriesResponse {
	categories: ForumCategory[];
}

export interface ForumTopicsResponse {
	topics: ForumTopic[];
	nextCursor: string | null;
}

export interface ForumTopicDetailResponse {
	topic: ForumTopicDetail;
	replies: ForumReply[];
	nextCursor: string | null;
	reactions: Record<string, ForumReactionData>;
	bookmarks: Record<string, boolean>;
}

export interface ForumRepliesResponse {
	replies: ForumReply[];
	nextCursor: string | null;
	reactions: Record<string, ForumReactionData>;
}

export interface ForumSearchResponse {
	results: ForumSearchResult[];
}

export interface ForumBookmarksResponse {
	topics: ForumTopic[];
	nextCursor: string | null;
}

// Route detail (3D viewer)
export interface RouteDetailResponse {
	peak: {
		id: string;
		name: string;
		slug: string;
		elevation: number;
		range: string;
		latitude: number;
		longitude: number;
		hero_image_url: string | null;
		thumbnail_url: string | null;
	};
	route: {
		id: string;
		name: string;
		slug: string;
		distance_miles: number;
		elevation_gain_ft: number;
		difficulty_class: number;
		typical_time_hours: number | null;
		is_standard: boolean | null;
	};
	trailGeometry: TrailGeometry | null;
}
