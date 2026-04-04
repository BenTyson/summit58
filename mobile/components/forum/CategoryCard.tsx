import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { ForumCategory } from '@/lib/types/api';

const COLOR_MAP: Record<string, string> = {
	'class-1': colors.class[1],
	'class-2': colors.class[2],
	'class-3': colors.class[3],
	'class-4': colors.class[4],
	accent: colors.accent.default,
	'mountain-blue': colors.mountain.blueLight
};

const ICON_MAP: Record<string, { ios: string; android: string; web: string }> = {
	'map': { ios: 'map', android: 'map', web: 'map' },
	'calendar': { ios: 'calendar', android: 'event', web: 'event' },
	'backpack': { ios: 'bag', android: 'backpack', web: 'backpack' },
	'message-circle': { ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' },
	'shield': { ios: 'shield', android: 'shield', web: 'shield' },
	'camera': { ios: 'camera', android: 'photo_camera', web: 'photo_camera' }
};

interface CategoryCardProps {
	category: ForumCategory;
	onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const accentColor = COLOR_MAP[category.color] ?? colors.mountain.blueLight;
	const iconSpec = ICON_MAP[category.icon] ?? { ios: 'bubble.left', android: 'chat_bubble', web: 'chat_bubble' };

	return (
		<Pressable
			onPress={onPress}
			style={{
				backgroundColor: theme.bgPrimary,
				borderRadius: 12,
				padding: 14,
				borderWidth: 1,
				borderColor: theme.border,
				borderLeftWidth: 3,
				borderLeftColor: accentColor
			}}>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
				<View
					style={{
						width: 36,
						height: 36,
						borderRadius: 8,
						backgroundColor: accentColor + '15',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<SymbolView name={iconSpec as any} tintColor={accentColor} size={18} />
				</View>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontFamily: 'Inter-SemiBold',
							fontSize: 15,
							color: theme.textPrimary
						}}>
						{category.name}
					</Text>
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 13,
							color: theme.textMuted,
							marginTop: 1
						}}
						numberOfLines={1}>
						{category.description}
					</Text>
				</View>
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 12,
						color: theme.textMuted
					}}>
					{category.topic_count} topic{category.topic_count !== 1 ? 's' : ''}
				</Text>
			</View>
		</Pressable>
	);
}
