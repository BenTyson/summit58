import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface QuoteBlockProps {
	authorName: string | null;
	body: string;
}

export function QuoteBlock({ authorName, body }: QuoteBlockProps) {
	return (
		<View
			style={{
				borderLeftWidth: 3,
				borderLeftColor: colors.accent.default,
				backgroundColor: colors.light.bgSecondary,
				paddingHorizontal: 10,
				paddingVertical: 8,
				borderRadius: 4,
				marginBottom: 8
			}}>
			{authorName && (
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 12,
						color: colors.light.textMuted,
						marginBottom: 2
					}}>
					{authorName}
				</Text>
			)}
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 13,
					color: colors.light.textSecondary,
					lineHeight: 18
				}}
				numberOfLines={3}>
				{body}
			</Text>
		</View>
	);
}
