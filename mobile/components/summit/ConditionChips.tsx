import { View, Text, Pressable } from 'react-native';
import { colors } from '@/lib/theme/colors';

const CONDITIONS = [
	{ label: 'Bluebird', color: '#4A90D9' },
	{ label: 'Cloudy', color: '#8E99A4' },
	{ label: 'Windy', color: '#5B7B9A' },
	{ label: 'Snow', color: '#B0C4DE' },
] as const;

interface ConditionChipsProps {
	selected: string[];
	onToggle: (condition: string) => void;
}

export function ConditionChips({ selected, onToggle }: ConditionChipsProps) {
	return (
		<View style={{ gap: 8 }}>
			<Text
				style={{
					fontFamily: 'Inter-Medium',
					fontSize: 14,
					color: colors.light.textSecondary,
				}}>
				Conditions (optional)
			</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
				{CONDITIONS.map(({ label, color }) => {
					const active = selected.includes(label);
					return (
						<Pressable
							key={label}
							onPress={() => onToggle(label)}
							style={{
								height: 56,
								paddingHorizontal: 20,
								borderRadius: 12,
								backgroundColor: active ? color : colors.light.bgSecondary,
								borderWidth: 2,
								borderColor: active ? color : colors.light.border,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Text
								style={{
									fontFamily: 'Inter-SemiBold',
									fontSize: 16,
									color: active ? '#ffffff' : colors.light.textSecondary,
								}}>
								{label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
