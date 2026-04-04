import { Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface PeakTagProps {
	peak: { id: string; name: string; slug: string };
}

export function PeakTag({ peak }: PeakTagProps) {
	return (
		<Pressable
			onPress={() => router.push(`/peaks/${peak.slug}`)}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				gap: 4,
				backgroundColor: colors.mountain.blue + '15',
				paddingHorizontal: 8,
				paddingVertical: 3,
				borderRadius: 6,
				alignSelf: 'flex-start'
			}}>
			<SymbolView
				name={{ ios: 'mountain.2', android: 'landscape', web: 'landscape' }}
				tintColor={colors.mountain.blueLight}
				size={12}
			/>
			<Text
				style={{
					fontFamily: 'Inter-Medium',
					fontSize: 12,
					color: colors.mountain.blueLight
				}}
				numberOfLines={1}>
				{peak.name}
			</Text>
		</Pressable>
	);
}
