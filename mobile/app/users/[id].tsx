import { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Image, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';
import { apiFetch } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatsBar } from '@/components/profile/StatsBar';
import { AchievementBadge } from '@/components/profile/AchievementBadge';
import { UserAvatar } from '@/components/social/UserAvatar';
import { FollowButton } from '@/components/social/FollowButton';
import { ReactionBar } from '@/components/social/ReactionBar';
import { CommentButton } from '@/components/social/CommentButton';
import { CommentsBottomSheet } from '@/components/social/CommentsBottomSheet';
import type { PublicProfileResponse, ReactionData, SummitComment } from '@/lib/types/api';
import { ClassBadge } from '@/components/ui/ClassBadge';

export default function UserProfileScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { user: currentUser } = useSession();
	const [data, setData] = useState<PublicProfileResponse | null>(null);
	const [reactions, setReactions] = useState<Record<string, ReactionData>>({});
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const bottomSheetRef = useRef<BottomSheet>(null);
	const [activeCommentSummitId, setActiveCommentSummitId] = useState<string | null>(null);

	const loadProfile = useCallback(async () => {
		if (!id) return;
		try {
			setError(null);
			const result = await apiFetch<PublicProfileResponse>(`/api/v1/users/${id}`, {
				auth: !!currentUser,
			});
			setData(result);
			setReactions(result.reactions);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load profile');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [id, currentUser]);

	useFocusEffect(
		useCallback(() => {
			loadProfile();
		}, [loadProfile])
	);

	const handleRefresh = () => {
		setRefreshing(true);
		loadProfile();
	};

	const handleCommentPress = (summitId: string) => {
		setActiveCommentSummitId(summitId);
		bottomSheetRef.current?.snapToIndex(0);
	};

	const handleReactionUpdate = (summitId: string, rd: ReactionData) => {
		setReactions((prev) => ({ ...prev, [summitId]: rd }));
	};

	const handleCommentAdded = (comment: SummitComment) => {
		if (!activeCommentSummitId || !data) return;
		setData((prev) => {
			if (!prev) return prev;
			const existing = prev.comments[activeCommentSummitId] || { count: 0, comments: [] };
			return {
				...prev,
				comments: {
					...prev.comments,
					[activeCommentSummitId]: {
						count: existing.count + 1,
						comments: [...existing.comments, comment],
					},
				},
			};
		});
	};

	const handleCommentDeleted = (commentId: string) => {
		if (!activeCommentSummitId || !data) return;
		setData((prev) => {
			if (!prev) return prev;
			const existing = prev.comments[activeCommentSummitId];
			if (!existing) return prev;
			return {
				...prev,
				comments: {
					...prev.comments,
					[activeCommentSummitId]: {
						count: existing.count - 1,
						comments: existing.comments.filter((c) => c.id !== commentId),
					},
				},
			};
		});
	};

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState message="Loading profile..." />
			</View>
		);
	}

	if (error || !data) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<ErrorState message={error || 'Profile not found'} onRetry={loadProfile} />
			</View>
		);
	}

	const { profile, stats, recentSummits, achievements, followStats, isFollowing, comments } = data;
	const isOwn = data.isOwnProfile;
	const activeComments = activeCommentSummitId
		? comments[activeCommentSummitId]?.comments ?? []
		: [];

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<ScrollView
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
				{/* Cover image */}
				<View style={{ height: 140, backgroundColor: colors.mountain.slate }}>
					{profile.cover_image_url && (
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
							overflow: 'hidden',
						}}>
						<UserAvatar user={profile} size={72} navigateOnPress={false} />
					</View>

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							marginTop: 8,
						}}>
						<View style={{ flex: 1 }}>
							<Text
								style={{
									fontFamily: 'InstrumentSerif',
									fontSize: 24,
									color: colors.light.textPrimary,
								}}>
								{profile.display_name || 'Climber'}
							</Text>
							{profile.tagline && (
								<Text
									style={{
										fontFamily: 'Inter',
										fontSize: 14,
										color: colors.light.textSecondary,
										marginTop: 2,
									}}>
									{profile.tagline}
								</Text>
							)}
							{profile.location && (
								<Text
									style={{
										fontFamily: 'Inter',
										fontSize: 13,
										color: colors.light.textMuted,
										marginTop: 2,
									}}>
									{profile.location}
								</Text>
							)}
						</View>

						{!isOwn && currentUser && isFollowing !== null && (
							<FollowButton
								userId={profile.id}
								displayName={profile.display_name}
								initialIsFollowing={isFollowing}
							/>
						)}
					</View>

					{/* Follow stats */}
					<View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
						<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textSecondary }}>
							<Text style={{ fontFamily: 'Inter-SemiBold', color: colors.light.textPrimary }}>
								{followStats.followingCount}
							</Text>{' '}
							Following
						</Text>
						<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textSecondary }}>
							<Text style={{ fontFamily: 'Inter-SemiBold', color: colors.light.textPrimary }}>
								{followStats.followersCount}
							</Text>{' '}
							Followers
						</Text>
					</View>
				</View>

				<View style={{ padding: 20, gap: 24 }}>
					{/* Stats */}
					<StatsBar
						totalSummits={stats.totalSummits}
						uniquePeaks={stats.uniquePeaks}
						progress={stats.progress}
					/>

					{/* Achievements */}
					{achievements.length > 0 && (
						<View>
							<Text
								style={{
									fontFamily: 'Inter-SemiBold',
									fontSize: 18,
									color: colors.light.textPrimary,
									marginBottom: 12,
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

					{/* Recent Summits */}
					{recentSummits.length > 0 && (
						<View>
							<Text
								style={{
									fontFamily: 'Inter-SemiBold',
									fontSize: 18,
									color: colors.light.textPrimary,
									marginBottom: 12,
								}}>
								Recent Summits
							</Text>
							<View style={{ gap: 10 }}>
								{recentSummits.map((summit: any) => (
									<View
										key={summit.id}
										style={{
											backgroundColor: colors.light.bgSecondary,
											borderRadius: 10,
											padding: 14,
											borderWidth: 1,
											borderColor: colors.light.border,
										}}>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												gap: 8,
											}}>
											{summit.peak?.thumbnail_url && (
												<Image
													source={{ uri: summit.peak.thumbnail_url }}
													style={{ width: 40, height: 40, borderRadius: 6 }}
													resizeMode="cover"
												/>
											)}
											<View style={{ flex: 1 }}>
												<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
													<Text
														style={{
															fontFamily: 'Inter-SemiBold',
															fontSize: 14,
															color: colors.light.textPrimary,
														}}
														numberOfLines={1}>
														{summit.peak?.name}
													</Text>
													{summit.route?.difficulty_class && (
														<ClassBadge difficulty={summit.route.difficulty_class} />
													)}
												</View>
												<Text
													style={{
														fontFamily: 'Inter',
														fontSize: 13,
														color: colors.light.textMuted,
														marginTop: 2,
													}}>
													{summit.peak?.elevation?.toLocaleString()} ft &middot;{' '}
													{new Date(summit.date_summited).toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric',
													})}
												</Text>
											</View>
										</View>

										{/* Reactions + Comments */}
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
												marginTop: 10,
											}}>
											{reactions[summit.id] && (
												<ReactionBar
													summitId={summit.id}
													data={reactions[summit.id]}
													onUpdate={(rd) => handleReactionUpdate(summit.id, rd)}
												/>
											)}
											{comments[summit.id] && (
												<CommentButton
													count={comments[summit.id].count}
													onPress={() => handleCommentPress(summit.id)}
												/>
											)}
										</View>
									</View>
								))}
							</View>
						</View>
					)}
				</View>
			</ScrollView>

			<CommentsBottomSheet
				ref={bottomSheetRef}
				summitId={activeCommentSummitId}
				comments={activeComments}
				currentUserId={currentUser?.id ?? null}
				onCommentAdded={handleCommentAdded}
				onCommentDeleted={handleCommentDeleted}
				onClose={() => setActiveCommentSummitId(null)}
			/>
		</View>
	);
}
