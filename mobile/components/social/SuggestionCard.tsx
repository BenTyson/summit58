import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { UserAvatar } from './UserAvatar';
import { FollowButton } from './FollowButton';
import type { UserWithFollowStatus } from '@/lib/types/api';

interface SuggestionCardProps {
	user: UserWithFollowStatus;
	onFollowToggle?: (userId: string, isFollowing: boolean) => void;
}

export function SuggestionCard({ user, onFollowToggle }: SuggestionCardProps) {
	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 12,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border,
				width: 180,
				alignItems: 'center',
				gap: 8,
			}}>
			<UserAvatar user={user} size={48} />
			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: 14,
					color: colors.light.textPrimary,
					textAlign: 'center',
				}}
				numberOfLines={1}>
				{user.display_name || user.username || 'Climber'}
			</Text>
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 12,
					color: colors.light.textMuted,
					textAlign: 'center',
				}}>
				{user.summitCount} summit{user.summitCount !== 1 ? 's' : ''}
				{user.peakOverlap ? ` · ${user.peakOverlap} shared` : ''}
			</Text>
			<FollowButton
				userId={user.id}
				displayName={user.display_name}
				initialIsFollowing={user.is_following}
				onToggle={(following) => onFollowToggle?.(user.id, following)}
			/>
		</View>
	);
}
