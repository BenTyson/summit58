import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';

interface SkeletonBlockProps {
	width: number | `${number}%`;
	height: number;
	borderRadius?: number;
	style?: ViewStyle;
}

export function SkeletonBlock({ width, height, borderRadius = 6, style }: SkeletonBlockProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const opacity = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0.7,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.3,
					duration: 800,
					useNativeDriver: true,
				}),
			])
		);
		animation.start();
		return () => animation.stop();
	}, [opacity]);

	return (
		<Animated.View
			style={[
				{
					width: width as number,
					height,
					borderRadius,
					backgroundColor: theme.bgTertiary,
					opacity,
				},
				style,
			]}
		/>
	);
}
