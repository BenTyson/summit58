import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, RefreshControl, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/lib/theme/colors';
import { cachedApiFetch } from '@/lib/offline/cache';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { CACHE_TIERS } from '@/lib/offline/types';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CachedImage } from '@/components/ui/CachedImage';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { StaleDataIndicator } from '@/components/ui/StaleDataIndicator';
import { ClassBadge } from '@/components/ui/ClassBadge';
import { StarRating } from '@/components/ui/StarRating';
import { RouteCard } from '@/components/peaks/RouteCard';
import { ReviewCard } from '@/components/peaks/ReviewCard';
import { TrailReportCard } from '@/components/peaks/TrailReportCard';
import { PeakCard } from '@/components/peaks/PeakCard';
import { WeatherSummaryCard } from '@/components/weather/WeatherSummaryCard';
import { ImageGalleryViewer } from '@/components/gallery/ImageGalleryViewer';
import { useSession } from '@/lib/auth/AuthProvider';
import type { PeakDetailResponse, ForecastResponse } from '@/lib/types/api';

export default function PeakDetailScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const [data, setData] = useState<PeakDetailResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [galleryVisible, setGalleryVisible] = useState(false);
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [cachedAt, setCachedAt] = useState<number | null>(null);
	const [forecast, setForecast] = useState<ForecastResponse | null>(null);
	const { user } = useSession();
	const { isOnline } = useOffline();

	const loadPeak = useCallback(async () => {
		try {
			setError(null);
			const { data: result, cachedAt: ts } = await cachedApiFetch<PeakDetailResponse>(
				`/api/v1/peaks/${slug}`,
				{
					cache: CACHE_TIERS.STATIC,
					onRefresh: (fresh) => {
						setData(fresh as PeakDetailResponse);
						setCachedAt(null);
					},
				},
				isOnline
			);
			setData(result);
			setCachedAt(ts);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load peak');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [slug, isOnline]);

	const loadForecast = useCallback(async () => {
		try {
			const { data } = await cachedApiFetch<ForecastResponse>(
				`/api/v1/peaks/${slug}/forecast`,
				{
					cache: CACHE_TIERS.WEATHER,
					fetchOptions: { auth: false },
					onRefresh: (fresh) => setForecast(fresh as ForecastResponse),
				},
				isOnline
			);
			setForecast(data);
		} catch {
			// Non-critical — weather section just won't show
		}
	}, [slug, isOnline]);

	useEffect(() => {
		loadPeak();
		loadForecast();
	}, [loadPeak, loadForecast]);

	// Re-fetch when screen regains focus (e.g. returning from upload modal)
	useFocusEffect(
		useCallback(() => {
			if (!loading) loadPeak();
		}, [loadPeak, loading])
	);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		loadPeak();
	}, [loadPeak]);

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: '' }} />
				<LoadingState message="Loading peak..." />
			</View>
		);
	}

	if (error || !data) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<Stack.Screen options={{ title: 'Peak' }} />
				<ErrorState message={error || 'Peak not found'} onRetry={loadPeak} />
			</View>
		);
	}

	const { peak, reviews, avgRating, totalReviews, images, trailReports, relatedPeaks } =
		data;
	const standardRoute = peak.routes?.find((r) => r.is_standard);

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<Stack.Screen
				options={{
					title: peak.name,
					headerTransparent: false
				}}
			/>

			<OfflineBanner />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}>
				{/* Hero Image */}
				{peak.hero_image_url ? (
					<CachedImage
						source={{ uri: peak.hero_image_url }}
						style={{ width: '100%', height: 240 }}
						contentFit="cover"
					/>
				) : (
					<View
						style={{
							width: '100%',
							height: 200,
							backgroundColor: colors.mountain.slate,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						<Text
							style={{
								fontFamily: 'InstrumentSerif',
								fontSize: 32,
								color: colors.accent.default
							}}>
							{peak.name}
						</Text>
					</View>
				)}

				<View style={{ padding: 20 }}>
					{/* Peak Info Header */}
					<View style={{ marginBottom: 16 }}>
						<Text
							style={{
								fontFamily: 'InstrumentSerif',
								fontSize: 28,
								color: colors.light.textPrimary
							}}>
							{peak.name}
						</Text>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 8,
								marginTop: 4
							}}>
							<Text
								style={{
									fontFamily: 'Inter-SemiBold',
									fontSize: 16,
									color: colors.light.textSecondary
								}}>
								{peak.elevation.toLocaleString()} ft
							</Text>
							<Text style={{ color: colors.light.textMuted }}>&#183;</Text>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 14,
									color: colors.light.textSecondary
								}}>
								{peak.range}
							</Text>
							<Text style={{ color: colors.light.textMuted }}>&#183;</Text>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 14,
									color: colors.light.textMuted
								}}>
								Rank #{peak.rank}
							</Text>
						</View>
						{standardRoute && (
							<View style={{ marginTop: 8 }}>
								<ClassBadge difficulty={standardRoute.difficulty_class} size="md" />
							</View>
						)}
					</View>

					{/* Weather */}
					{forecast && (
						<Section title="Weather">
							<StaleDataIndicator cachedAt={cachedAt} />
							<WeatherSummaryCard
								forecast={forecast}
								onViewFull={() => router.push(`/peaks/${slug}/weather`)}
							/>
						</Section>
					)}

					{/* Routes */}
					{peak.routes && peak.routes.length > 0 && (
						<Section title="Routes">
							<View style={{ gap: 10 }}>
								{peak.routes.map((route) => (
									<RouteCard
										key={route.id}
										route={route}
										isStandard={route.is_standard ?? false}
									/>
								))}
							</View>
						</Section>
					)}

					{/* Reviews */}
					<Section title="Reviews">
						{totalReviews > 0 && (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 8,
									marginBottom: 12
								}}>
								<StarRating rating={avgRating} size={18} />
								<Text
									style={{
										fontFamily: 'Inter-SemiBold',
										fontSize: 15,
										color: colors.light.textPrimary
									}}>
									{avgRating.toFixed(1)}
								</Text>
								<Text
									style={{
										fontFamily: 'Inter',
										fontSize: 14,
										color: colors.light.textMuted
									}}>
									({totalReviews} review{totalReviews !== 1 ? 's' : ''})
								</Text>
							</View>
						)}
						{user && !data.userData?.userReview && (
							<Pressable
								onPress={() => router.push({
									pathname: '/(modals)/review',
									params: { peakId: peak.id, peakName: peak.name, slug: peak.slug }
								})}
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									paddingVertical: 12,
									borderRadius: 10,
									borderWidth: 1,
									borderColor: colors.accent.default,
									borderStyle: 'dashed',
									marginBottom: 12,
								}}
							>
								<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.accent.default }}>
									Write a Review
								</Text>
							</Pressable>
						)}
						{totalReviews > 0 && (
							<View style={{ gap: 10 }}>
								{reviews.map((review) => (
									<ReviewCard key={review.id} review={review} />
								))}
							</View>
						)}
						{totalReviews === 0 && !user && (
							<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, textAlign: 'center' }}>
								No reviews yet
							</Text>
						)}
					</Section>

					{/* Trail Reports */}
					<Section title="Recent Trail Reports">
						{user && (
							<Pressable
								onPress={() => router.push({
									pathname: '/(modals)/trail-report',
									params: { peakId: peak.id, peakName: peak.name, slug: peak.slug }
								})}
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									paddingVertical: 12,
									borderRadius: 10,
									borderWidth: 1,
									borderColor: colors.accent.default,
									borderStyle: 'dashed',
									marginBottom: 12,
								}}
							>
								<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.accent.default }}>
									Report Trail Conditions
								</Text>
							</Pressable>
						)}
						{trailReports.length > 0 ? (
							<View style={{ gap: 10 }}>
								{trailReports.map((report) => (
									<TrailReportCard key={report.id} report={report} />
								))}
							</View>
						) : (
							<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, textAlign: 'center' }}>
								No recent trail reports
							</Text>
						)}
					</Section>

					{/* Photo Gallery */}
					<Section title={images.length > 0 ? `Photos (${images.length})` : 'Photos'}>
						{user && (
							<Pressable
								onPress={() => router.push({
									pathname: '/(modals)/photo-upload',
									params: { peakId: peak.id, peakName: peak.name, slug: peak.slug }
								})}
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									paddingVertical: 12,
									borderRadius: 10,
									borderWidth: 1,
									borderColor: colors.accent.default,
									borderStyle: 'dashed',
									marginBottom: 12,
								}}
							>
								<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.accent.default }}>
									Add a Photo
								</Text>
							</Pressable>
						)}
						{images.length > 0 ? (
							<FlatList
								horizontal
								data={images}
								keyExtractor={(item) => item.id}
								renderItem={({ item, index }) => (
									<Pressable onPress={() => {
										setGalleryIndex(index);
										setGalleryVisible(true);
									}}>
										<CachedImage
											source={{ uri: item.url }}
											style={{
												width: 140,
												height: 140,
												borderRadius: 8,
											}}
											contentFit="cover"
										/>
									</Pressable>
								)}
								contentContainerStyle={{ gap: 8 }}
								showsHorizontalScrollIndicator={false}
								scrollEnabled
							/>
						) : (
							!user && (
								<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted, textAlign: 'center' }}>
									No photos yet
								</Text>
							)
						)}
					</Section>

					{/* Related Peaks */}
					{relatedPeaks.length > 0 && (
						<Section title="Nearby Peaks">
							<FlatList
								horizontal
								data={relatedPeaks}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<View style={{ width: 260 }}>
										<PeakCard
											peak={item}
											onPress={() => router.push(`/peaks/${item.slug}`)}
										/>
									</View>
								)}
								contentContainerStyle={{ gap: 12 }}
								showsHorizontalScrollIndicator={false}
								scrollEnabled
							/>
						</Section>
					)}

					{/* Description */}
					{peak.description && (
						<Section title="About">
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 14,
									color: colors.light.textSecondary,
									lineHeight: 22
								}}>
								{peak.description}
							</Text>
						</Section>
					)}
				</View>
			</ScrollView>

			<ImageGalleryViewer
				images={images}
				visible={galleryVisible}
				initialIndex={galleryIndex}
				onClose={() => setGalleryVisible(false)}
			/>
		</View>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<View style={{ marginBottom: 24 }}>
			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: 18,
					color: colors.light.textPrimary,
					marginBottom: 12
				}}>
				{title}
			</Text>
			{children}
		</View>
	);
}
