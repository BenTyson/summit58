import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface SummitButtonProps {
	date: string; // e.g. "March 28, 2026"
	disabled: boolean;
	loading: boolean;
	onPress: () => void;
}

export function SummitButton({ date, disabled, loading, onPress }: SummitButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled || loading}
			style={({ pressed }) => ({
				height: 80,
				borderRadius: 16,
				backgroundColor: disabled
					? colors.light.bgTertiary
					: pressed
						? colors.accent.dark
						: colors.accent.default,
				alignItems: 'center',
				justifyContent: 'center',
				opacity: disabled ? 0.5 : 1,
			})}>
			{loading ? (
				<ActivityIndicator size="large" color="#ffffff" />
			) : (
				<View style={{ alignItems: 'center' }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
						<SymbolView
							name={{ ios: 'mountain.2.fill', android: 'landscape', web: 'landscape' }}
							tintColor="#ffffff"
							size={24}
						/>
						<Text
							style={{
								fontFamily: 'Inter-Bold',
								fontSize: 20,
								color: '#ffffff',
							}}>
							I Summited!
						</Text>
					</View>
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 14,
							color: 'rgba(255,255,255,0.8)',
							marginTop: 2,
						}}>
						{date}
					</Text>
				</View>
			)}
		</Pressable>
	);
}
