import { useState, useMemo, useCallback, forwardRef } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { colors } from '@/lib/theme/colors';
import { ClassBadge } from '@/components/ui/ClassBadge';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

interface PeakPickerSheetProps {
	peaks: PeakWithStandardRoute[];
	onSelect: (peak: PeakWithStandardRoute) => void;
}

export const PeakPickerSheet = forwardRef<BottomSheet, PeakPickerSheetProps>(
	function PeakPickerSheet({ peaks, onSelect }, ref) {
		const [search, setSearch] = useState('');
		const snapPoints = useMemo(() => ['70%', '90%'], []);

		const filtered = useMemo(() => {
			if (!search) return peaks;
			const q = search.toLowerCase();
			return peaks.filter((p) => p.name.toLowerCase().includes(q));
		}, [peaks, search]);

		const renderBackdrop = useCallback(
			(props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
			[]
		);

		const handleSelect = useCallback(
			(peak: PeakWithStandardRoute) => {
				onSelect(peak);
				setSearch('');
			},
			[onSelect]
		);

		return (
			<BottomSheet
				ref={ref}
				index={-1}
				snapPoints={snapPoints}
				enablePanDownToClose
				backdropComponent={renderBackdrop}
				backgroundStyle={{ backgroundColor: colors.light.bgPrimary }}
				handleIndicatorStyle={{ backgroundColor: colors.light.borderStrong }}>
				<View style={{ flex: 1, paddingHorizontal: 20 }}>
					<Text
						style={{
							fontFamily: 'InstrumentSerif',
							fontSize: 22,
							color: colors.light.textPrimary,
							marginBottom: 12,
						}}>
						Select a Peak
					</Text>
					<TextInput
						style={{
							fontFamily: 'Inter',
							fontSize: 15,
							color: colors.light.textPrimary,
							backgroundColor: colors.light.bgSecondary,
							borderRadius: 10,
							borderWidth: 1,
							borderColor: colors.light.border,
							paddingHorizontal: 12,
							height: 40,
							marginBottom: 12,
						}}
						placeholder="Search peaks..."
						placeholderTextColor={colors.light.textMuted}
						value={search}
						onChangeText={setSearch}
						autoCorrect={false}
					/>
					<FlatList
						data={filtered}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<Pressable
								onPress={() => handleSelect(item)}
								style={({ pressed }) => ({
									flexDirection: 'row',
									alignItems: 'center',
									paddingVertical: 12,
									paddingHorizontal: 4,
									backgroundColor: pressed ? colors.light.bgSecondary : 'transparent',
									borderRadius: 8,
								})}>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontFamily: 'Inter-SemiBold',
											fontSize: 15,
											color: colors.light.textPrimary,
										}}>
										{item.name}
									</Text>
									<Text
										style={{
											fontFamily: 'Inter',
											fontSize: 13,
											color: colors.light.textMuted,
											marginTop: 2,
										}}>
										{item.elevation.toLocaleString()} ft &middot; {item.range}
									</Text>
								</View>
								{item.standard_route && (
									<ClassBadge difficulty={item.standard_route.difficulty_class} />
								)}
							</Pressable>
						)}
						ItemSeparatorComponent={() => (
							<View style={{ height: 1, backgroundColor: colors.light.border, marginHorizontal: 4 }} />
						)}
					/>
				</View>
			</BottomSheet>
		);
	}
);
