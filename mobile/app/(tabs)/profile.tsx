import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, FlatList, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';
import { Alert } from 'react-native';
import { apiFetch } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatsBar } from '@/components/profile/StatsBar';
import { My58Grid } from '@/components/profile/My58Grid';
import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { SummitHistoryItem } from '@/components/profile/SummitHistoryItem';
import type { ProfileResponse } from '@/lib/types/api';

export default function ProfileScreen() {
	const { user, loading: authLoading, signOut } = useSession();
	const [data, setData] = useState<ProfileResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadProfile = useCallback(async () => {
		if (!user) return;
		try {
			setError(null);
			const result = await apiFetch<ProfileResponse>('/api/v1/profile');
			setData(result);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load profile');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			setLoading(true);
			loadProfile();
		}
	}, [user, loadProfile]);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		loadProfile();
	}, [loadProfile]);

	// Auth loading
	if (authLoading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState />
			</View>
		);
	}

	// Not signed in
	if (!user) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: colors.light.bgPrimary,
					padding: 40
				}}>
				<SymbolView
					name={{ ios: 'person.crop.circle', android: 'person', web: 'person' }}
					tintColor={colors.light.textMuted}
					size={64}
				/>
				<Text
					style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 24,
						color: colors.light.textPrimary,
						marginTop: 16
					}}>
					Sign in to view your profile
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textMuted,
						textAlign: 'center',
						marginTop: 8
					}}>
					Track your summits, earn achievements, and see your progress across all 58
					fourteeners.
				</Text>
				<Pressable
					onPress={() => router.push('/(auth)/login')}
					style={{
						backgroundColor: colors.accent.default,
						paddingHorizontal: 24,
						paddingVertical: 12,
						borderRadius: 8,
						marginTop: 20
					}}>
					<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#ffffff' }}>
						Sign In
					</Text>
				</Pressable>
			</View>
		);
	}

	// Loading profile data
	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState message="Loading profile..." />
			</View>
		);
	}

	// Error loading
	if (error || !data) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<ErrorState message={error || 'Failed to load profile'} onRetry={loadProfile} />
			</View>
		);
	}

	const { profile, summitStats, summits, achievements, uniquePeakIds, allPeaks } = data;
	const summitedSet = new Set(uniquePeakIds);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
			{/* Cover image area */}
			<View style={{ height: 140, backgroundColor: colors.mountain.slate }}>
				{profile?.cover_image_url && (
					<Image
						source={{ uri: profile.cover_image_url }}
						style={{ width: '100%', height: 140 }}
						resizeMode="cover"
					/>
				)}
			</View>

			{/* Avatar + name */}
			<View style={{ paddingHorizontal: 20, marginTop: -36 }}>
				<View
					style={{
						width: 72,
						height: 72,
						borderRadius: 36,
						borderWidth: 3,
						borderColor: colors.light.bgPrimary,
						backgroundColor: colors.light.bgTertiary,
						overflow: 'hidden'
					}}>
					{profile?.avatar_url ? (
						<Image
							source={{ uri: profile.avatar_url }}
							style={{ width: 72, height: 72 }}
							resizeMode="cover"
						/>
					) : (
						<View
							style={{
								width: 72,
								height: 72,
								alignItems: 'center',
								justifyContent: 'center'
							}}>
							<SymbolView
								name={{ ios: 'person.fill', android: 'person', web: 'person' }}
								tintColor={colors.light.textMuted}
								size={32}
							/>
						</View>
					)}
				</View>

				<Text
					style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 24,
						color: colors.light.textPrimary,
						marginTop: 8
					}}>
					{profile?.display_name || user.email?.split('@')[0]}
				</Text>
				{profile?.tagline && (
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 14,
							color: colors.light.textSecondary,
							marginTop: 2
						}}>
						{profile.tagline}
					</Text>
				)}
				{profile?.location && (
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 13,
							color: colors.light.textMuted,
							marginTop: 2
						}}>
						{profile.location}
					</Text>
				)}

				{/* Sign out */}
				<Pressable
					onPress={() => {
						Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
							{ text: 'Cancel', style: 'cancel' },
							{ text: 'Sign Out', style: 'destructive', onPress: signOut },
						]);
					}}
					style={{
						alignSelf: 'flex-start',
						marginTop: 12,
						paddingHorizontal: 14,
						paddingVertical: 7,
						borderRadius: 6,
						borderWidth: 1,
						borderColor: colors.light.border,
					}}>
					<Text style={{ fontFamily: 'Inter-Medium', fontSize: 13, color: colors.light.textMuted }}>
						Sign Out
					</Text>
				</Pressable>
			</View>

			<View style={{ padding: 20, gap: 24 }}>
				{/* Stats bar */}
				<StatsBar
					totalSummits={summitStats.totalSummits}
					uniquePeaks={summitStats.uniquePeaks}
					progress={summitStats.progress}
				/>

				{/* My 58 Grid */}
				<My58Grid peaks={allPeaks} summitedIds={summitedSet} />

				{/* Achievements */}
				{achievements.length > 0 && (
					<View>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 18,
								color: colors.light.textPrimary,
								marginBottom: 12
							}}>
							Achievements ({achievements.length})
						</Text>
						<FlatList
							horizontal
							data={achievements}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <AchievementBadge achievement={item} />}
							contentContainerStyle={{ gap: 10 }}
							showsHorizontalScrollIndicator={false}
							scrollEnabled
						/>
					</View>
				)}

				{/* Summit History */}
				{summits.length > 0 && (
					<View>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 18,
								color: colors.light.textPrimary,
								marginBottom: 12
							}}>
							Summit History
						</Text>
						<View style={{ gap: 10 }}>
							{summits.slice(0, 10).map((summit) => (
								<SummitHistoryItem
									key={summit.id}
									summit={summit}
									onPress={() => router.push(`/peaks/${summit.peak.slug}`)}
								/>
							))}
						</View>
						{summits.length > 10 && (
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 14,
									color: colors.light.textMuted,
									textAlign: 'center',
									marginTop: 12
								}}>
								And {summits.length - 10} more...
							</Text>
						)}
					</View>
				)}

				{/* Additional stats */}
				{summitStats.totalSummits > 0 && (
					<View
						style={{
							backgroundColor: colors.light.bgSecondary,
							borderRadius: 12,
							padding: 16,
							borderWidth: 1,
							borderColor: colors.light.border,
							gap: 8
						}}>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 16,
								color: colors.light.textPrimary,
								marginBottom: 4
							}}>
							Stats
						</Text>
						<StatRow
							label="Total Elevation Gain"
							value={`${summitStats.totalElevationGain.toLocaleString()} ft`}
						/>
						<StatRow
							label="Total Distance"
							value={`${summitStats.totalDistanceMiles.toFixed(1)} mi`}
						/>
						{summitStats.highestPeak && (
							<StatRow
								label="Highest Peak"
								value={`${summitStats.highestPeak.name} (${summitStats.highestPeak.elevation.toLocaleString()} ft)`}
							/>
						)}
						<StatRow
							label="Avg Summit Elevation"
							value={`${Math.round(summitStats.avgElevation).toLocaleString()} ft`}
						/>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

function StatRow({ label, value }: { label: string; value: string }) {
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
			<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted }}>
				{label}
			</Text>
			<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.light.textPrimary }}>
				{value}
			</Text>
		</View>
	);
}
