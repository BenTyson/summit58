import { View } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SkeletonBlock } from './SkeletonBlock';

export function CategoryCardSkeleton() {
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
				borderLeftWidth: 3,
				borderLeftColor: theme.borderStrong,
				flexDirection: 'row',
				alignItems: 'center',
				gap: 12,
			}}>
			{/* Icon */}
			<SkeletonBlock width={40} height={40} borderRadius={10} />
			{/* Text */}
			<View style={{ flex: 1, gap: 6 }}>
				<SkeletonBlock width={120} height={16} borderRadius={4} />
				<SkeletonBlock width={180} height={12} borderRadius={4} />
				<SkeletonBlock width={60} height={10} borderRadius={4} />
			</View>
		</View>
	);
}
