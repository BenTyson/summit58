import { View, Text, Pressable, Alert } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { UserAvatar } from './UserAvatar';
import type { SummitComment } from '@/lib/types/api';

interface CommentRowProps {
	comment: SummitComment;
	currentUserId: string | null;
	onDelete: (commentId: string) => void;
}

function formatRelativeTime(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return 'now';
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d`;
	return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CommentRow({ comment, currentUserId, onDelete }: CommentRowProps) {
	const isOwn = currentUserId === comment.user_id;

	const handleLongPress = () => {
		if (!isOwn) return;
		Alert.alert('Delete Comment', 'Remove this comment?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => onDelete(comment.id) },
		]);
	};

	return (
		<Pressable
			onLongPress={handleLongPress}
			style={{ flexDirection: 'row', gap: 10, paddingVertical: 8 }}>
			<UserAvatar user={comment.user} size={32} />
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
					<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: colors.light.textPrimary }}>
						{comment.user.display_name || 'Anonymous'}
					</Text>
					<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
						{formatRelativeTime(comment.created_at)}
					</Text>
				</View>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textSecondary,
						lineHeight: 20,
						marginTop: 2,
					}}>
					{comment.body}
				</Text>
			</View>
		</Pressable>
	);
}
