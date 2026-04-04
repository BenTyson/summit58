import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';

interface QuoteBlockProps {
	authorName: string | null;
	body: string;
}

export function QuoteBlock({ authorName, body }: QuoteBlockProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	return (
		<View
			style={{
				borderLeftWidth: 3,
				borderLeftColor: colors.accent.default,
				backgroundColor: theme.bgSecondary,
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
						color: theme.textMuted,
						marginBottom: 2
					}}>
					{authorName}
				</Text>
			)}
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 13,
					color: theme.textSecondary,
					lineHeight: 18
				}}
				numberOfLines={3}>
				{body}
			</Text>
		</View>
	);
}
