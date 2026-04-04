import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { ForumAuthorInfo } from './ForumAuthorInfo';
import { QuoteBlock } from './QuoteBlock';
import { ForumReactions } from './ForumReactions';
import type { ForumReply, ForumReactionData } from '@/lib/types/api';

interface ReplyCardProps {
	reply: ForumReply;
	reactions?: ForumReactionData;
	onReply?: () => void;
	onReactionUpdate?: (replyId: string, data: ForumReactionData) => void;
}

export function ReplyCard({ reply, reactions, onReply, onReactionUpdate }: ReplyCardProps) {
	const defaultReactions: ForumReactionData = { counts: {}, userReactions: [] };

	return (
		<View
			style={{
				backgroundColor: colors.light.bgPrimary,
				borderRadius: 10,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			<ForumAuthorInfo author={reply.author} timestamp={reply.created_at} size="sm" />

			<View style={{ marginTop: 10 }}>
				{reply.quoted_reply && (
					<QuoteBlock
						authorName={reply.quoted_reply.author.display_name}
						body={reply.quoted_reply.body}
					/>
				)}

				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textSecondary,
						lineHeight: 22
					}}>
					{reply.body}
				</Text>
			</View>

			{/* Actions row */}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					marginTop: 10,
					paddingTop: 8,
					borderTopWidth: 1,
					borderTopColor: colors.light.border
				}}>
				<ForumReactions
					reactableType="reply"
					reactableId={reply.id}
					data={reactions ?? defaultReactions}
					onUpdate={(data) => onReactionUpdate?.(reply.id, data)}
				/>

				{onReply && (
					<Pressable
						onPress={onReply}
						style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingLeft: 8 }}>
						<SymbolView
							name={{ ios: 'arrowshape.turn.up.left', android: 'reply', web: 'reply' }}
							tintColor={colors.light.textMuted}
							size={14}
						/>
						<Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: colors.light.textMuted }}>
							Reply
						</Text>
					</Pressable>
				)}
			</View>
		</View>
	);
}
