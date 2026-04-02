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

// ─── Weather Forecast v2 types ──────────────────────────────────────

export type PeakForecastRow = Tables<'peak_forecasts'>;

export interface ForecastResponse {
	peak: { name: string; slug: string; elevation: number };
	bands: {
		summit: ElevationBandForecast;
		mid: ElevationBandForecast;
		base: ElevationBandForecast;
	};
	insights: HikerInsight[];
	fetched_at: string;
}

export interface ElevationBandForecast {
	elevation_ft: number;
	label: string;
	summary: string;
	days: DayForecast[];
}

export interface DayForecast {
	date: string;
	high_f: number;
	low_f: number;
	sunrise: string;
	sunset: string;
	morning: PeriodForecast;
	afternoon: PeriodForecast;
	night: PeriodForecast;
}

export interface PeriodForecast {
	temperature_f: number;
	feels_like_f: number;
	humidity_percent: number;
	wind_speed_mph: number;
	wind_gust_mph: number;
	wind_direction: number;
	precipitation_in: number;
	snow_in: number;
	cloud_cover_percent: number;
	weather_code: number;
	freezing_level_ft: number;
	cloud_base_ft: number | null;
	uv_index: number;
	visibility_miles: number;
}

export interface HikerInsight {
	type:
		| 'summit_window'
		| 'storm_warning'
		| 'wind_advisory'
		| 'freeze_warning'
		| 'snow_alert'
		| 'clear_day'
		| 'uv_warning'
		| 'afternoon_storms';
	severity: 'info' | 'caution' | 'warning' | 'danger';
	title: string;
	description: string;
}
