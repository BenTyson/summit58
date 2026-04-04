import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { ForumAuthorInfo } from './ForumAuthorInfo';
import { PeakTag } from './PeakTag';
import type { ForumTopic } from '@/lib/types/api';

interface TopicCardProps {
	topic: ForumTopic;
	onPress: () => void;
}

function timeAgo(dateStr: string): string {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d`;
	return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TopicCard({ topic, onPress }: TopicCardProps) {
	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: colors.light.bgPrimary,
				borderRadius: 12,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			{topic.is_pinned && (
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
					<SymbolView
						name={{ ios: 'pin.fill', android: 'push_pin', web: 'push_pin' }}
						tintColor={colors.accent.default}
						size={12}
					/>
					<Text style={{ fontFamily: 'Inter-Medium', fontSize: 11, color: colors.accent.default }}>
						Pinned
					</Text>
				</View>
			)}

			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: 16,
					color: colors.light.textPrimary,
					lineHeight: 22
				}}
				numberOfLines={2}>
				{topic.title}
			</Text>

			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 14,
					color: colors.light.textSecondary,
					lineHeight: 20,
					marginTop: 4
				}}
				numberOfLines={2}>
				{topic.body.replace(/[#*_`~>\[\]]/g, '').slice(0, 150)}
			</Text>

			{topic.peak && (
				<View style={{ marginTop: 8 }}>
					<PeakTag peak={topic.peak} />
				</View>
			)}

			<View style={{ marginTop: 10 }}>
				<ForumAuthorInfo author={topic.author} size="sm" />
			</View>

			{/* Stats row */}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					gap: 14,
					marginTop: 10,
					paddingTop: 10,
					borderTopWidth: 1,
					borderTopColor: colors.light.border
				}}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					<SymbolView
						name={{ ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' }}
						tintColor={colors.light.textMuted}
						size={14}
					/>
					<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
						{topic.reply_count}
					</Text>
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					<SymbolView
						name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
						tintColor={colors.light.textMuted}
						size={14}
					/>
					<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
						{topic.view_count}
					</Text>
				</View>
				{topic.reaction_count > 0 && (
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
						<SymbolView
							name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
							tintColor={colors.light.textMuted}
							size={14}
						/>
						<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
							{topic.reaction_count}
						</Text>
					</View>
				)}
				<View style={{ flex: 1 }} />
				<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
					{timeAgo(topic.last_reply_at || topic.created_at)}
				</Text>
			</View>
		</Pressable>
	);
}
