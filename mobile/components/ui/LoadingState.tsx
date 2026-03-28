import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface LoadingStateProps {
	message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
			<ActivityIndicator size="large" color={colors.accent.default} />
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 14,
					color: colors.light.textMuted,
					marginTop: 12
				}}>
				{message}
			</Text>
		</View>
	);
}
