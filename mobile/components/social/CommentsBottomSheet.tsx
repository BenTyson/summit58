import { forwardRef, useState, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { CommentRow } from './CommentRow';
import type { SummitComment } from '@/lib/types/api';

interface CommentsBottomSheetProps {
	summitId: string | null;
	comments: SummitComment[];
	currentUserId: string | null;
	onCommentAdded: (comment: SummitComment) => void;
	onCommentDeleted: (commentId: string) => void;
	onClose: () => void;
}

export const CommentsBottomSheet = forwardRef<BottomSheet, CommentsBottomSheetProps>(
	function CommentsBottomSheet(
		{ summitId, comments, currentUserId, onCommentAdded, onCommentDeleted, onClose },
		ref
	) {
		const [text, setText] = useState('');
		const [submitting, setSubmitting] = useState(false);

		const handleSubmit = useCallback(async () => {
			if (!summitId || !text.trim() || submitting) return;
			setSubmitting(true);
			Keyboard.dismiss();

			try {
				const { comment } = await apiFetch<{ comment: SummitComment }>('/api/v1/comments', {
					method: 'POST',
					body: { summit_id: summitId, body: text.trim() },
				});
				setText('');
				onCommentAdded(comment);
			} catch {
				// Error handled silently — user can retry
			} finally {
				setSubmitting(false);
			}
		}, [summitId, text, submitting, onCommentAdded]);

		const handleDelete = useCallback(
			async (commentId: string) => {
				try {
					await apiFetch('/api/v1/comments', {
						method: 'DELETE',
						body: { comment_id: commentId },
					});
					onCommentDeleted(commentId);
				} catch {
					// Error handled silently
				}
			},
			[onCommentDeleted]
		);

		const handleSheetChange = useCallback(
			(index: number) => {
				if (index === -1) onClose();
			},
			[onClose]
		);

		return (
			<BottomSheet
				ref={ref}
				index={-1}
				snapPoints={['50%', '85%']}
				enablePanDownToClose
				enableDynamicSizing={false}
				onChange={handleSheetChange}
				backgroundStyle={{
					backgroundColor: colors.light.bgPrimary,
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
				}}
				handleIndicatorStyle={{
					backgroundColor: colors.light.borderStrong,
					width: 40,
				}}>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontFamily: 'Inter-SemiBold',
							fontSize: 16,
							color: colors.light.textPrimary,
							paddingHorizontal: 16,
							paddingBottom: 12,
						}}>
						Comments{comments.length > 0 ? ` (${comments.length})` : ''}
					</Text>

					<BottomSheetFlatList
						data={comments}
						keyExtractor={(item: SummitComment) => item.id}
						renderItem={({ item }: { item: SummitComment }) => (
							<CommentRow
								comment={item}
								currentUserId={currentUserId}
								onDelete={handleDelete}
							/>
						)}
						contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
						ListEmptyComponent={
							<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
								<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted }}>
									No comments yet. Be the first!
								</Text>
							</View>
						}
					/>

					{currentUserId && (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
								borderTopWidth: 1,
								borderTopColor: colors.light.border,
							}}>
							<BottomSheetTextInput
								value={text}
								onChangeText={setText}
								placeholder="Add a comment..."
								placeholderTextColor={colors.light.textMuted}
								style={{
									flex: 1,
									fontFamily: 'Inter',
									fontSize: 14,
									color: colors.light.textPrimary,
									backgroundColor: colors.light.bgSecondary,
									borderRadius: 8,
									paddingHorizontal: 12,
									paddingVertical: 10,
									borderWidth: 1,
									borderColor: colors.light.border,
								}}
								returnKeyType="send"
								onSubmitEditing={handleSubmit}
							/>
							<Pressable
								onPress={handleSubmit}
								disabled={!text.trim() || submitting}
								style={({ pressed }) => ({
									backgroundColor:
										!text.trim() || submitting
											? colors.light.bgTertiary
											: pressed
												? colors.accent.dark
												: colors.accent.default,
									borderRadius: 8,
									paddingHorizontal: 14,
									paddingVertical: 10,
								})}>
								{submitting ? (
									<ActivityIndicator size="small" color="#ffffff" />
								) : (
									<Text
										style={{
											fontFamily: 'Inter-SemiBold',
											fontSize: 14,
											color: !text.trim() ? colors.light.textMuted : '#ffffff',
										}}>
										Send
									</Text>
								)}
							</Pressable>
						</View>
					)}
				</View>
			</BottomSheet>
		);
	}
);
