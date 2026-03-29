import { useState } from 'react';
import { Pressable, Text, ActivityIndicator, Alert } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';

interface FollowButtonProps {
	userId: string;
	displayName?: string | null;
	initialIsFollowing: boolean;
	onToggle?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, displayName, initialIsFollowing, onToggle }: FollowButtonProps) {
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
	const [loading, setLoading] = useState(false);

	const handlePress = async () => {
		if (isFollowing) {
			Alert.alert(
				'Unfollow',
				`Stop following ${displayName || 'this user'}?`,
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Unfollow',
						style: 'destructive',
						onPress: () => toggleFollow(),
					},
				]
			);
		} else {
			await toggleFollow();
		}
	};

	const toggleFollow = async () => {
		const wasFollowing = isFollowing;
		setIsFollowing(!wasFollowing);
		setLoading(true);

		try {
			if (wasFollowing) {
				await apiFetch('/api/v1/follows', {
					method: 'DELETE',
					body: { following_id: userId },
				});
			} else {
				await apiFetch('/api/v1/follows', {
					method: 'POST',
					body: { following_id: userId },
				});
			}
			onToggle?.(!wasFollowing);
		} catch {
			setIsFollowing(wasFollowing);
			Alert.alert('Error', `Failed to ${wasFollowing ? 'unfollow' : 'follow'} user`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Pressable
			onPress={handlePress}
			disabled={loading}
			style={({ pressed }) => ({
				paddingHorizontal: 20,
				paddingVertical: 8,
				borderRadius: 8,
				backgroundColor: isFollowing
					? 'transparent'
					: pressed
						? colors.accent.dark
						: colors.accent.default,
				borderWidth: 1,
				borderColor: isFollowing ? colors.light.border : colors.accent.default,
				alignItems: 'center',
				justifyContent: 'center',
				minWidth: 90,
				opacity: loading ? 0.7 : 1,
			})}>
			{loading ? (
				<ActivityIndicator size="small" color={isFollowing ? colors.light.textMuted : '#ffffff'} />
			) : (
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 14,
						color: isFollowing ? colors.light.textSecondary : '#ffffff',
					}}>
					{isFollowing ? 'Following' : 'Follow'}
				</Text>
			)}
		</Pressable>
	);
}
