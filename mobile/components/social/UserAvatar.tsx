import { Image, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface UserAvatarProps {
	user: { id: string; display_name: string | null; avatar_url: string | null };
	size: number;
	onPress?: () => void;
	navigateOnPress?: boolean;
}

export function UserAvatar({ user, size, onPress, navigateOnPress = true }: UserAvatarProps) {
	const handlePress = onPress ?? (navigateOnPress ? () => router.push(`/users/${user.id}`) : undefined);

	const content = user.avatar_url ? (
		<Image
			source={{ uri: user.avatar_url }}
			style={{ width: size, height: size, borderRadius: size / 2 }}
			resizeMode="cover"
		/>
	) : (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: size / 2,
				backgroundColor: colors.light.bgTertiary,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<SymbolView
				name={{ ios: 'person.fill', android: 'person', web: 'person' }}
				tintColor={colors.light.textMuted}
				size={size * 0.5}
			/>
		</View>
	);

	if (handlePress) {
		return (
			<Pressable onPress={handlePress} style={{ borderRadius: size / 2, overflow: 'hidden' }}>
				{content}
			</Pressable>
		);
	}

	return content;
}
