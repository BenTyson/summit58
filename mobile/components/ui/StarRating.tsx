import { View, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface StarRatingProps {
	rating: number;
	size?: number;
	interactive?: boolean;
	onRate?: (rating: number) => void;
}

export function StarRating({ rating, size = 14, interactive = false, onRate }: StarRatingProps) {
	return (
		<View style={{ flexDirection: 'row', gap: interactive ? 4 : 2 }}>
			{[1, 2, 3, 4, 5].map((star) => {
				const filled = star <= Math.round(rating);
				const starView = (
					<SymbolView
						name={{
							ios: filled ? 'star.fill' : 'star',
							android: filled ? 'star' : 'star_border',
							web: 'star'
						}}
						tintColor={filled ? colors.accent.default : colors.light.border}
						size={size}
					/>
				);

				if (interactive && onRate) {
					return (
						<Pressable
							key={star}
							onPress={() => onRate(star)}
							hitSlop={8}
							style={{ padding: 2 }}
						>
							{starView}
						</Pressable>
					);
				}

				return <View key={star}>{starView}</View>;
			})}
		</View>
	);
}
