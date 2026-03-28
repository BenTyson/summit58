import { View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface StarRatingProps {
	rating: number;
	size?: number;
}

export function StarRating({ rating, size = 14 }: StarRatingProps) {
	return (
		<View style={{ flexDirection: 'row', gap: 2 }}>
			{[1, 2, 3, 4, 5].map((star) => (
				<SymbolView
					key={star}
					name={{
						ios: star <= Math.round(rating) ? 'star.fill' : 'star',
						android: star <= Math.round(rating) ? 'star' : 'star_border',
						web: 'star'
					}}
					tintColor={star <= Math.round(rating) ? colors.accent.default : colors.light.border}
					size={size}
				/>
			))}
		</View>
	);
}
