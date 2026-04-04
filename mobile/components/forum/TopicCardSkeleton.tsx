import { View } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SkeletonBlock } from './SkeletonBlock';

export function TopicCardSkeleton() {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;

	return (
		<View
			style={{
				backgroundColor: theme.bgPrimary,
				borderRadius: 12,
				padding: 14,
				borderWidth: 1,
				borderColor: theme.border,
			}}>
			{/* Title */}
			<SkeletonBlock width="75%" height={18} borderRadius={4} />
			{/* Body lines */}
			<View style={{ marginTop: 8, gap: 6 }}>
				<SkeletonBlock width="100%" height={14} borderRadius={4} />
				<SkeletonBlock width="60%" height={14} borderRadius={4} />
			</View>
			{/* Author row */}
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
				<SkeletonBlock width={28} height={28} borderRadius={14} />
				<SkeletonBlock width={80} height={12} borderRadius={4} />
			</View>
			{/* Stats row */}
			<View
				style={{
					flexDirection: 'row',
					gap: 14,
					marginTop: 10,
					paddingTop: 10,
					borderTopWidth: 1,
					borderTopColor: theme.border,
				}}>
				<SkeletonBlock width={40} height={12} borderRadius={4} />
				<SkeletonBlock width={40} height={12} borderRadius={4} />
				<SkeletonBlock width={40} height={12} borderRadius={4} />
			</View>
		</View>
	);
}
