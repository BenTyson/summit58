import { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import type { ForumSearchResult, ForumSearchResponse } from '@/lib/types/api';

interface ForumSearchProps {
	onResultPress: (result: ForumSearchResult) => void;
}

export function ForumSearch({ onResultPress }: ForumSearchProps) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<ForumSearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const search = useCallback(async (q: string) => {
		if (!q.trim()) {
			setResults([]);
			return;
		}
		setLoading(true);
		try {
			const data = await apiFetch<ForumSearchResponse>(
				`/api/v1/forum/search?q=${encodeURIComponent(q.trim())}`,
				{ auth: false }
			);
			setResults(data.results);
		} catch {
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleChange = (text: string) => {
		setQuery(text);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => search(text), 300);
	};

	return (
		<View style={{ flex: 1 }}>
			{/* Search input */}
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: colors.light.bgSecondary,
					borderRadius: 10,
					paddingHorizontal: 12,
					height: 40,
					marginHorizontal: 16,
					marginVertical: 8,
					borderWidth: 1,
					borderColor: colors.light.border
				}}>
				<SymbolView
					name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
					tintColor={colors.light.textMuted}
					size={18}
				/>
				<TextInput
					style={{
						flex: 1,
						fontFamily: 'Inter',
						fontSize: 15,
						color: colors.light.textPrimary,
						marginLeft: 8
					}}
					placeholder="Search discussions..."
					placeholderTextColor={colors.light.textMuted}
					value={query}
					onChangeText={handleChange}
					autoCorrect={false}
					returnKeyType="search"
				/>
				{query !== '' && (
					<Pressable
						onPress={() => {
							setQuery('');
							setResults([]);
						}}
						hitSlop={8}>
						<SymbolView
							name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
							tintColor={colors.light.textMuted}
							size={18}
						/>
					</Pressable>
				)}
			</View>

			{loading && (
				<View style={{ padding: 20, alignItems: 'center' }}>
					<ActivityIndicator size="small" color={colors.accent.default} />
				</View>
			)}

			<FlatList
				data={results}
				keyExtractor={(item) => `${item.result_type}-${item.id}`}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => onResultPress(item)}
						style={{
							padding: 14,
							borderBottomWidth: 1,
							borderBottomColor: colors.light.border
						}}>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 11,
									color: colors.light.textMuted,
									textTransform: 'uppercase'
								}}>
								{item.result_type}
							</Text>
							<Text style={{ color: colors.light.textMuted }}>&#183;</Text>
							<Text style={{ fontFamily: 'Inter', fontSize: 11, color: colors.light.textMuted }}>
								{item.category_slug}
							</Text>
						</View>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 15,
								color: colors.light.textPrimary
							}}
							numberOfLines={1}>
							{item.topic_title}
						</Text>
						<Text
							style={{
								fontFamily: 'Inter',
								fontSize: 13,
								color: colors.light.textSecondary,
								marginTop: 2,
								lineHeight: 18
							}}
							numberOfLines={2}>
							{item.body.replace(/[#*_`~>\[\]]/g, '').slice(0, 150)}
						</Text>
					</Pressable>
				)}
				ListEmptyComponent={
					query.trim() && !loading ? (
						<View style={{ padding: 40, alignItems: 'center' }}>
							<Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.light.textMuted }}>
								No results found
							</Text>
						</View>
					) : null
				}
			/>
		</View>
	);
}
