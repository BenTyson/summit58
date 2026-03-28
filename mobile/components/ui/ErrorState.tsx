import { View, Text, Pressable } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface ErrorStateProps {
	message: string;
	onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
			<Text
				style={{
					fontFamily: 'Inter-SemiBold',
					fontSize: 16,
					color: colors.light.textPrimary,
					marginBottom: 8
				}}>
				Something went wrong
			</Text>
			<Text
				style={{
					fontFamily: 'Inter',
					fontSize: 14,
					color: colors.light.textMuted,
					textAlign: 'center',
					marginBottom: 16
				}}>
				{message}
			</Text>
			{onRetry && (
				<Pressable
					onPress={onRetry}
					style={{
						backgroundColor: colors.accent.default,
						paddingHorizontal: 20,
						paddingVertical: 10,
						borderRadius: 8
					}}>
					<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#ffffff' }}>
						Try Again
					</Text>
				</Pressable>
			)}
		</View>
	);
}
