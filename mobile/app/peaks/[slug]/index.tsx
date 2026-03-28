import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ClassBadge } from '@/components/ui/ClassBadge';
import { StarRating } from '@/components/ui/StarRating';
import { RouteCard } from '@/components/peaks/RouteCard';
import { ReviewCard } from '@/components/peaks/ReviewCard';
import { TrailReportCard } from '@/components/peaks/TrailReportCard';
import { PeakCard } from '@/components/peaks/PeakCard';
import { WeatherSection } from '@/components/weather/WeatherSection';
import type { PeakDetailResponse } from '@/lib/types/api';

export default function PeakDetailScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const [data, setData] = useState<PeakDetailResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadPeak = useCallback(async () => {
		try {
			setError(null);
			const result = await apiFetch<PeakDetailResponse>(`/api/v1/peaks/${slug}`);
			setData(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load peak');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [slug]);

	useEffect(() => {
		loadPeak();
	}, [loadPeak]);

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

	const { peak, reviews, avgRating, totalReviews, images, conditions, trailReports, relatedPeaks } =
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

			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}>
				{/* Hero Image */}
				{peak.hero_image_url ? (
					<Image
						source={{ uri: peak.hero_image_url }}
						style={{ width: '100%', height: 240 }}
						resizeMode="cover"
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
					{conditions.length > 0 && (
						<Section title="Weather">
							<WeatherSection conditions={conditions} />
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
					{totalReviews > 0 && (
						<Section title="Reviews">
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
							<View style={{ gap: 10 }}>
								{reviews.map((review) => (
									<ReviewCard key={review.id} review={review} />
								))}
							</View>
						</Section>
					)}

					{/* Trail Reports */}
					{trailReports.length > 0 && (
						<Section title="Recent Trail Reports">
							<View style={{ gap: 10 }}>
								{trailReports.map((report) => (
									<TrailReportCard key={report.id} report={report} />
								))}
							</View>
						</Section>
					)}

					{/* Photo Gallery */}
					{images.length > 0 && (
						<Section title={`Photos (${images.length})`}>
							<FlatList
								horizontal
								data={images}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<Image
										source={{ uri: item.url }}
										style={{
											width: 140,
											height: 140,
											borderRadius: 8
										}}
										resizeMode="cover"
									/>
								)}
								contentContainerStyle={{ gap: 8 }}
								showsHorizontalScrollIndicator={false}
								scrollEnabled
							/>
						</Section>
					)}

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
