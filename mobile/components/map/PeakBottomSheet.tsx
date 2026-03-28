import { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '@/lib/theme/colors';
import { ClassBadge } from '@/components/ui/ClassBadge';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

interface PeakBottomSheetProps {
	peak: PeakWithStandardRoute | null;
	onClose: () => void;
	onViewDetails: (slug: string) => void;
}

export const PeakBottomSheet = forwardRef<BottomSheet, PeakBottomSheetProps>(
	function PeakBottomSheet({ peak, onClose, onViewDetails }, ref) {
		const snapPoints = useMemo(() => [220], []);

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
				snapPoints={snapPoints}
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
				<BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 4 }}>
					{peak && (
						<>
							<Text
								style={{
									fontFamily: 'InstrumentSerif',
									fontSize: 22,
									color: colors.light.textPrimary,
								}}
								numberOfLines={1}>
								{peak.name}
							</Text>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 14,
									color: colors.light.textSecondary,
									marginTop: 4,
								}}>
								{peak.elevation.toLocaleString()} ft &middot; {peak.range}
							</Text>
							{peak.standard_route && (
								<View style={{ marginTop: 10 }}>
									<ClassBadge difficulty={peak.standard_route.difficulty_class} size="md" />
								</View>
							)}
							<Pressable
								onPress={() => onViewDetails(peak.slug)}
								style={({ pressed }) => ({
									backgroundColor: pressed
										? colors.accent.dark
										: colors.accent.default,
									borderRadius: 10,
									paddingVertical: 14,
									alignItems: 'center',
									marginTop: 16,
								})}>
								<Text
									style={{
										fontFamily: 'Inter-SemiBold',
										fontSize: 15,
										color: '#ffffff',
									}}>
									View Details
								</Text>
							</Pressable>
						</>
					)}
				</BottomSheetView>
			</BottomSheet>
		);
	}
);
