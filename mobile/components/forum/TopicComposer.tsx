import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { ForumCategory } from '@/lib/types/api';

interface TopicComposerProps {
	categories: ForumCategory[];
	initialCategoryId?: string;
	initialPeak?: { id: string; name: string; slug: string } | null;
	onSubmit: (data: {
		title: string;
		body: string;
		category_id: string;
		peak_id?: string;
	}) => Promise<void>;
}

export function TopicComposer({ categories, initialCategoryId, initialPeak, onSubmit }: TopicComposerProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [categoryId, setCategoryId] = useState(initialCategoryId || categories[0]?.id || '');
	const [selectedPeak] = useState(initialPeak);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const canSubmit = title.trim().length >= 5 && body.trim().length >= 10 && categoryId && !submitting;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setSubmitting(true);
		setError(null);
		try {
			await onSubmit({
				title: title.trim(),
				body: body.trim(),
				category_id: categoryId,
				peak_id: selectedPeak?.id
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to create topic');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.bgPrimary }}
			contentContainerStyle={{ padding: 20, gap: 16 }}
			keyboardShouldPersistTaps="handled">
			{/* Title */}
			<View>
				<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: theme.textPrimary, marginBottom: 6 }}>
					Title
				</Text>
				<TextInput
					style={{
						fontFamily: 'Inter',
						fontSize: 16,
						color: theme.textPrimary,
						backgroundColor: theme.bgSecondary,
						borderRadius: 10,
						paddingHorizontal: 14,
						paddingVertical: 12,
						borderWidth: 1,
						borderColor: theme.border
					}}
					placeholder="What's on your mind?"
					placeholderTextColor={theme.textMuted}
					value={title}
					onChangeText={setTitle}
					maxLength={200}
					autoFocus
				/>
				<Text style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted, textAlign: 'right', marginTop: 4 }}>
					{title.length}/200
				</Text>
			</View>

			{/* Category picker */}
			<View>
				<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: theme.textPrimary, marginBottom: 6 }}>
					Category
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 8 }}>
					{categories.map((cat) => (
						<Pressable
							key={cat.id}
							onPress={() => setCategoryId(cat.id)}
							style={{
								paddingHorizontal: 14,
								paddingVertical: 8,
								borderRadius: 16,
								backgroundColor: categoryId === cat.id ? colors.accent.default : theme.bgSecondary,
								borderWidth: 1,
								borderColor: categoryId === cat.id ? colors.accent.default : theme.border
							}}>
							<Text
								style={{
									fontFamily: 'Inter-Medium',
									fontSize: 13,
									color: categoryId === cat.id ? '#ffffff' : theme.textSecondary
								}}>
								{cat.name}
							</Text>
						</Pressable>
					))}
				</ScrollView>
			</View>

			{/* Peak context */}
			{selectedPeak && (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 8,
						backgroundColor: colors.mountain.blue + '10',
						padding: 12,
						borderRadius: 10
					}}>
					<SymbolView
						name={{ ios: 'mountain.2', android: 'landscape', web: 'landscape' }}
						tintColor={colors.mountain.blueLight}
						size={16}
					/>
					<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.mountain.blueLight }}>
						{selectedPeak.name}
					</Text>
				</View>
			)}

			{/* Body */}
			<View>
				<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: theme.textPrimary, marginBottom: 6 }}>
					Body
				</Text>
				<TextInput
					style={{
						fontFamily: 'Inter',
						fontSize: 15,
						color: theme.textPrimary,
						backgroundColor: theme.bgSecondary,
						borderRadius: 10,
						paddingHorizontal: 14,
						paddingVertical: 12,
						minHeight: 160,
						textAlignVertical: 'top',
						borderWidth: 1,
						borderColor: theme.border
					}}
					placeholder="Share your thoughts, ask a question, or report conditions..."
					placeholderTextColor={theme.textMuted}
					value={body}
					onChangeText={setBody}
					multiline
					maxLength={10000}
				/>
				<Text style={{ fontFamily: 'Inter', fontSize: 11, color: theme.textMuted, textAlign: 'right', marginTop: 4 }}>
					{body.length}/10000
				</Text>
			</View>

			{error && (
				<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.semantic.danger }}>
					{error}
				</Text>
			)}

			{/* Submit */}
			<Pressable
				onPress={handleSubmit}
				disabled={!canSubmit}
				style={{
					backgroundColor: canSubmit ? colors.accent.default : theme.bgTertiary,
					paddingVertical: 14,
					borderRadius: 10,
					alignItems: 'center',
					flexDirection: 'row',
					justifyContent: 'center',
					gap: 8
				}}>
				{submitting ? (
					<ActivityIndicator size="small" color="#ffffff" />
				) : (
					<Text
						style={{
							fontFamily: 'Inter-SemiBold',
							fontSize: 16,
							color: canSubmit ? '#ffffff' : theme.textMuted
						}}>
						Post Topic
					</Text>
				)}
			</Pressable>
		</ScrollView>
	);
}
