import { useState, useCallback } from 'react';
import {
	View, Text, TextInput, ScrollView, Pressable,
	Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { useSync } from '@/lib/offline/SyncProvider';
import { enqueueReview } from '@/lib/offline/actions';
import { StarRating } from '@/components/ui/StarRating';
import type { ReviewCreateResponse } from '@/lib/types/api';

export default function ReviewModal() {
	const { peakName, slug } = useLocalSearchParams<{
		peakId: string;
		peakName: string;
		slug: string;
	}>();
	const { user } = useSession();
	const { isOnline } = useOffline();
	const { refreshPendingCount } = useSync();

	const [rating, setRating] = useState(0);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (!user || !slug || rating === 0) return;

		setLoading(true);
		try {
			if (!isOnline) {
				await enqueueReview({
					slug,
					rating,
					title: title.trim() || undefined,
					body: body.trim() || undefined,
				});
				await refreshPendingCount();
				Alert.alert(
					'Saved Offline',
					'Your review will be submitted when you\'re back online.',
					[{ text: 'OK', onPress: () => router.back() }]
				);
				return;
			}

			const result = await apiFetch<ReviewCreateResponse>(
				`/api/v1/peaks/${slug}/reviews`,
				{
					method: 'POST',
					body: {
						rating,
						title: title.trim() || null,
						body: body.trim() || null,
					},
				}
			);

			if (result.newAchievements?.length > 0) {
				Alert.alert(
					'Achievement Earned!',
					'Check your profile to see your new achievement.',
					[{ text: 'OK', onPress: () => router.back() }]
				);
			} else {
				router.back();
			}
		} catch (e: any) {
			if (e?.status === 400) {
				try {
					const errorBody = typeof e.body === 'string' ? JSON.parse(e.body) : e.body;
					if (errorBody?.error?.includes('already reviewed')) {
						Alert.alert('Already Reviewed', 'You have already reviewed this peak.');
						return;
					}
				} catch {}
			}
			Alert.alert('Error', 'Failed to submit review. Please try again.');
		} finally {
			setLoading(false);
		}
	}, [user, slug, rating, title, body, isOnline, refreshPendingCount]);

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
				{peakName && (
					<Text style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 22,
						color: colors.light.textPrimary,
						textAlign: 'center',
					}}>
						{peakName}
					</Text>
				)}

				{/* Star Rating */}
				<View style={{ gap: 8, alignItems: 'center' }}>
					<Text style={labelStyle}>Your Rating</Text>
					<StarRating rating={rating} size={36} interactive onRate={setRating} />
					{rating === 0 && (
						<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
							Tap to rate
						</Text>
					)}
				</View>

				{/* Title */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Title (optional)</Text>
					<TextInput
						style={inputStyle}
						placeholder="Sum up your experience..."
						placeholderTextColor={colors.light.textMuted}
						value={title}
						onChangeText={setTitle}
						maxLength={100}
					/>
				</View>

				{/* Body */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Your Review (optional)</Text>
					<TextInput
						style={[inputStyle, { minHeight: 120, textAlignVertical: 'top' }]}
						placeholder="Share details about the trail, views, or tips..."
						placeholderTextColor={colors.light.textMuted}
						value={body}
						onChangeText={setBody}
						multiline
						numberOfLines={5}
					/>
				</View>

				{/* Submit */}
				<Pressable
					onPress={handleSubmit}
					disabled={rating === 0 || loading}
					style={{
						height: 52,
						borderRadius: 12,
						backgroundColor: rating === 0 || loading ? colors.light.bgTertiary : colors.accent.default,
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: 8,
					}}
				>
					{loading ? (
						<ActivityIndicator color="#ffffff" />
					) : (
						<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
							Submit Review
						</Text>
					)}
				</Pressable>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const labelStyle = {
	fontFamily: 'Inter-Medium',
	fontSize: 14,
	color: colors.light.textSecondary,
} as const;

const inputStyle = {
	fontFamily: 'Inter',
	fontSize: 15,
	color: colors.light.textPrimary,
	backgroundColor: colors.light.bgSecondary,
	borderRadius: 10,
	borderWidth: 1,
	borderColor: colors.light.border,
	paddingHorizontal: 12,
	paddingVertical: 10,
} as const;
