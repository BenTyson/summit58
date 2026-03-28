import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface ClassBadgeProps {
	difficulty: number;
	size?: 'sm' | 'md';
}

export function ClassBadge({ difficulty, size = 'sm' }: ClassBadgeProps) {
	const bgColor = colors.class[difficulty as keyof typeof colors.class] || colors.alpine.rock;
	const isSmall = size === 'sm';

	return (
		<View
			style={{
				backgroundColor: bgColor,
				paddingHorizontal: isSmall ? 8 : 10,
				paddingVertical: isSmall ? 2 : 4,
				borderRadius: 6
			}}>
			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: isSmall ? 11 : 13,
					color: '#ffffff'
				}}>
				Class {difficulty}
			</Text>
		</View>
	);
}
