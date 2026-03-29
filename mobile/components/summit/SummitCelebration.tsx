import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, Animated } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { ACHIEVEMENT_MAP } from '@saltgoat/shared/data/achievements';

interface SummitCelebrationProps {
	visible: boolean;
	peakName: string;
	peakElevation: number;
	date: string;
	newAchievements: string[];
	onDismiss: () => void;
}

export function SummitCelebration({
	visible,
	peakName,
	peakElevation,
	date,
	newAchievements,
	onDismiss,
}: SummitCelebrationProps) {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0)).current;
	const achievementSlide = useRef(new Animated.Value(40)).current;
	const achievementOpacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			// Reset
			fadeAnim.setValue(0);
			scaleAnim.setValue(0);
			achievementSlide.setValue(40);
			achievementOpacity.setValue(0);

			// Sequence
			Animated.sequence([
				// Overlay fade
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
				// Check mark spring
				Animated.spring(scaleAnim, {
					toValue: 1,
					friction: 5,
					tension: 80,
					useNativeDriver: true,
				}),
				// Achievement card slide up
				...(newAchievements.length > 0
					? [
							Animated.parallel([
								Animated.timing(achievementSlide, {
									toValue: 0,
									duration: 300,
									useNativeDriver: true,
								}),
								Animated.timing(achievementOpacity, {
									toValue: 1,
									duration: 300,
									useNativeDriver: true,
								}),
							]),
						]
					: []),
			]).start();

			// Auto-dismiss after 8 seconds
			const timer = setTimeout(onDismiss, 8000);
			return () => clearTimeout(timer);
		}
	}, [visible]);

	const firstAchievement = newAchievements.length > 0
		? ACHIEVEMENT_MAP.get(newAchievements[0])
		: null;

	return (
		<Modal visible={visible} transparent animationType="none" statusBarTranslucent>
			<Animated.View
				style={{
					flex: 1,
					backgroundColor: 'rgba(0,0,0,0.85)',
					alignItems: 'center',
					justifyContent: 'center',
					paddingHorizontal: 32,
					opacity: fadeAnim,
				}}>
				{/* Check mark */}
				<Animated.View
					style={{
						width: 80,
						height: 80,
						borderRadius: 40,
						backgroundColor: colors.semantic.success,
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 24,
						transform: [{ scale: scaleAnim }],
					}}>
					<SymbolView
						name={{ ios: 'checkmark', android: 'check', web: 'check' }}
						tintColor="#ffffff"
						size={40}
					/>
				</Animated.View>

				{/* Summit info */}
				<Text
					style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 32,
						color: '#ffffff',
						textAlign: 'center',
					}}>
					Summit Logged!
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 16,
						color: 'rgba(255,255,255,0.7)',
						textAlign: 'center',
						marginTop: 8,
					}}>
					{peakName} &middot; {peakElevation.toLocaleString()} ft
				</Text>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 14,
						color: 'rgba(255,255,255,0.5)',
						textAlign: 'center',
						marginTop: 4,
					}}>
					{date}
				</Text>

				{/* Achievement card */}
				{firstAchievement && (
					<Animated.View
						style={{
							marginTop: 32,
							backgroundColor: 'rgba(200,165,92,0.15)',
							borderWidth: 1,
							borderColor: colors.accent.default,
							borderRadius: 12,
							padding: 16,
							width: '100%',
							alignItems: 'center',
							opacity: achievementOpacity,
							transform: [{ translateY: achievementSlide }],
						}}>
						<SymbolView
							name={{ ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' }}
							tintColor={colors.accent.default}
							size={28}
						/>
						<Text
							style={{
								fontFamily: 'Inter-Bold',
								fontSize: 16,
								color: colors.accent.default,
								marginTop: 8,
							}}>
							Achievement Earned!
						</Text>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 14,
								color: '#ffffff',
								marginTop: 4,
							}}>
							{firstAchievement.title}
						</Text>
						<Text
							style={{
								fontFamily: 'Inter',
								fontSize: 13,
								color: 'rgba(255,255,255,0.6)',
								marginTop: 2,
								textAlign: 'center',
							}}>
							{firstAchievement.description}
						</Text>
						{newAchievements.length > 1 && (
							<Text
								style={{
									fontFamily: 'Inter-Medium',
									fontSize: 12,
									color: colors.accent.light,
									marginTop: 8,
								}}>
								+{newAchievements.length - 1} more achievement{newAchievements.length > 2 ? 's' : ''}
							</Text>
						)}
					</Animated.View>
				)}

				{/* Buttons */}
				<View style={{ flexDirection: 'row', gap: 12, marginTop: 40, width: '100%' }}>
					<Pressable
						onPress={onDismiss}
						style={{
							flex: 1,
							height: 52,
							borderRadius: 12,
							backgroundColor: colors.accent.default,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
							Done
						</Text>
					</Pressable>
				</View>
			</Animated.View>
		</Modal>
	);
}
