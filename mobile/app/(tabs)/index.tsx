import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { PeakCard } from '@/components/peaks/PeakCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { PeaksListResponse } from '@/lib/types/api';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

const RANGES = [
	'Sawatch Range',
	'Elk Mountains',
	'San Juan Mountains',
	'Sangre de Cristo Range',
	'Front Range',
	'Mosquito Range',
	'Tenmile Range'
];

const CLASSES = [1, 2, 3, 4] as const;

export default function ExploreScreen() {
	const [peaks, setPeaks] = useState<PeakWithStandardRoute[]>([]);
	const [summitedIds, setSummitedIds] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedRange, setSelectedRange] = useState<string | null>(null);
	const [selectedClass, setSelectedClass] = useState<number | null>(null);

	const loadPeaks = useCallback(async () => {
		try {
			setError(null);
			const data = await apiFetch<PeaksListResponse>('/api/v1/peaks');
			setPeaks(data.peaks);
			setSummitedIds(new Set(data.summitedPeakIds));
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load peaks');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		loadPeaks();
	}, [loadPeaks]);

	const filteredPeaks = useMemo(() => {
		let result = peaks;

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			result = result.filter((p) => p.name.toLowerCase().includes(q));
		}
		if (selectedRange) {
			result = result.filter((p) => p.range === selectedRange);
		}
		if (selectedClass) {
			result = result.filter((p) => p.standard_route?.difficulty_class === selectedClass);
		}

		return result;
	}, [peaks, searchQuery, selectedRange, selectedClass]);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		loadPeaks();
	}, [loadPeaks]);

	if (loading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState message="Loading peaks..." />
			</SafeAreaView>
		);
	}

	if (error && peaks.length === 0) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<ErrorState message={error} onRetry={loadPeaks} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			{/* Header */}
			<View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
				<Text
					style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 28,
						color: colors.light.textPrimary
					}}>
					Explore
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: colors.light.textMuted,
						marginTop: 2
					}}>
					{peaks.length} Colorado 14ers
				</Text>
			</View>

			{/* Search bar */}
			<View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						backgroundColor: colors.light.bgSecondary,
						borderRadius: 10,
						paddingHorizontal: 12,
						height: 40,
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
						placeholder="Search peaks..."
						placeholderTextColor={colors.light.textMuted}
						value={searchQuery}
						onChangeText={setSearchQuery}
						autoCorrect={false}
					/>
					{searchQuery !== '' && (
						<Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
							<SymbolView
								name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' }}
								tintColor={colors.light.textMuted}
								size={18}
							/>
						</Pressable>
					)}
				</View>
			</View>

			{/* Filter chips */}
			<View style={{ paddingBottom: 8 }}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
					{/* Class chips */}
					{CLASSES.map((cls) => {
						const active = selectedClass === cls;
						return (
							<Pressable
								key={`class-${cls}`}
								onPress={() => setSelectedClass(active ? null : cls)}
								style={{
									backgroundColor: active
										? colors.class[cls]
										: colors.light.bgSecondary,
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderRadius: 16,
									borderWidth: 1,
									borderColor: active ? colors.class[cls] : colors.light.border
								}}>
								<Text
									style={{
										fontFamily: 'Inter-Medium',
										fontSize: 13,
										color: active ? '#ffffff' : colors.light.textSecondary
									}}>
									Class {cls}
								</Text>
							</Pressable>
						);
					})}

					{/* Divider */}
					<View
						style={{
							width: 1,
							backgroundColor: colors.light.border,
							marginHorizontal: 4,
							marginVertical: 4
						}}
					/>

					{/* Range chips */}
					{RANGES.map((range) => {
						const active = selectedRange === range;
						const shortName = range
							.replace(' Range', '')
							.replace(' Mountains', '');
						return (
							<Pressable
								key={range}
								onPress={() => setSelectedRange(active ? null : range)}
								style={{
									backgroundColor: active
										? colors.mountain.slate
										: colors.light.bgSecondary,
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderRadius: 16,
									borderWidth: 1,
									borderColor: active ? colors.mountain.slate : colors.light.border
								}}>
								<Text
									style={{
										fontFamily: 'Inter-Medium',
										fontSize: 13,
										color: active ? '#ffffff' : colors.light.textSecondary
									}}>
									{shortName}
								</Text>
							</Pressable>
						);
					})}
				</ScrollView>
			</View>

			{/* Results count */}
			{(searchQuery || selectedRange || selectedClass) && (
				<View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
					<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
						{filteredPeaks.length} peak{filteredPeaks.length !== 1 ? 's' : ''} found
					</Text>
				</View>
			)}

			{/* Peak list */}
			<FlatList
				data={filteredPeaks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<PeakCard
						peak={item}
						summited={summitedIds.has(item.id)}
						onPress={() => router.push(`/peaks/${item.slug}`)}
					/>
				)}
				contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
				refreshing={refreshing}
				onRefresh={handleRefresh}
				ListEmptyComponent={
					<View style={{ alignItems: 'center', paddingTop: 40 }}>
						<Text
							style={{
								fontFamily: 'Inter',
								fontSize: 15,
								color: colors.light.textMuted
							}}>
							No peaks match your filters
						</Text>
					</View>
				}
			/>
		</SafeAreaView>
	);
}
