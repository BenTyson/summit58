import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import { QuoteBlock } from './QuoteBlock';

interface ReplyComposerProps {
	onSubmit: (body: string) => Promise<void>;
	quotedReply?: { authorName: string | null; body: string } | null;
	onClearQuote?: () => void;
	isLocked?: boolean;
}

export function ReplyComposer({ onSubmit, quotedReply, onClearQuote, isLocked }: ReplyComposerProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const [body, setBody] = useState('');
	const [submitting, setSubmitting] = useState(false);

	if (isLocked) {
		return (
			<View
				style={{
					padding: 16,
					borderTopWidth: 1,
					borderTopColor: theme.border,
					backgroundColor: theme.bgSecondary,
					alignItems: 'center'
				}}>
				<Text style={{ fontFamily: 'Inter', fontSize: 14, color: theme.textMuted }}>
					This topic is locked
				</Text>
			</View>
		);
	}

	const handleSubmit = async () => {
		const trimmed = body.trim();
		if (!trimmed || submitting) return;
		setSubmitting(true);
		try {
			await onSubmit(trimmed);
			setBody('');
			onClearQuote?.();
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
			<View
				style={{
					borderTopWidth: 1,
					borderTopColor: theme.border,
					backgroundColor: theme.bgPrimary,
					padding: 12
				}}>
				{quotedReply && (
					<View style={{ marginBottom: 8 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
							<Text style={{ fontFamily: 'Inter-Medium', fontSize: 12, color: theme.textMuted }}>
								Replying to
							</Text>
							<Pressable onPress={onClearQuote} hitSlop={8}>
								<SymbolView
									name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
									tintColor={theme.textMuted}
									size={16}
								/>
							</Pressable>
						</View>
						<QuoteBlock authorName={quotedReply.authorName} body={quotedReply.body} />
					</View>
				)}

				{body.length > 0 && (
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 11,
							color: body.length > 4500 ? colors.semantic.warning : theme.textMuted,
							textAlign: 'right',
							marginBottom: 4
						}}>
						{body.length.toLocaleString()}/5,000
					</Text>
				)}

				<View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
					<TextInput
						style={{
							flex: 1,
							fontFamily: 'Inter',
							fontSize: 15,
							color: theme.textPrimary,
							backgroundColor: theme.bgSecondary,
							borderRadius: 10,
							paddingHorizontal: 14,
							paddingVertical: 10,
							maxHeight: 100,
							borderWidth: 1,
							borderColor: theme.border
						}}
						placeholder="Write a reply..."
						placeholderTextColor={theme.textMuted}
						value={body}
						onChangeText={setBody}
						multiline
						autoCorrect
					/>
					<Pressable
						onPress={handleSubmit}
						disabled={!body.trim() || submitting}
						style={{
							width: 40,
							height: 40,
							borderRadius: 20,
							backgroundColor: body.trim() ? colors.accent.default : theme.bgTertiary,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						{submitting ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<SymbolView
								name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
								tintColor={body.trim() ? '#ffffff' : theme.textMuted}
								size={18}
							/>
						)}
					</Pressable>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
