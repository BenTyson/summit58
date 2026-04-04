import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import { UserAvatar } from '@/components/social/UserAvatar';
import type { ForumAuthorProfile } from '@/lib/types/api';

interface ForumAuthorInfoProps {
	author: ForumAuthorProfile;
	timestamp?: string;
	size?: 'sm' | 'md';
}

export function ForumAuthorInfo({ author, timestamp, size = 'md' }: ForumAuthorInfoProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const avatarSize = size === 'sm' ? 28 : 36;
	const nameSize = size === 'sm' ? 13 : 14;

	const formattedDate = timestamp
		? new Date(timestamp).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			})
		: null;

	return (
		<Pressable
			onPress={() => router.push(`/users/${author.id}`)}
			style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
			<UserAvatar user={author} size={avatarSize} navigateOnPress={false} />
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
					<Text
						style={{
							fontFamily: 'Inter-Medium',
							fontSize: nameSize,
							color: theme.textPrimary
						}}
						numberOfLines={1}>
						{author.display_name || 'Anonymous'}
					</Text>
					{author.summit_count > 0 && (
						<View
							style={{
								backgroundColor: colors.accent.default + '20',
								paddingHorizontal: 6,
								paddingVertical: 1,
								borderRadius: 8
							}}>
							<Text
								style={{
									fontFamily: 'Inter-Medium',
									fontSize: 11,
									color: colors.accent.dark
								}}>
								{author.summit_count} summit{author.summit_count !== 1 ? 's' : ''}
							</Text>
						</View>
					)}
				</View>
				{formattedDate && (
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 12,
							color: theme.textMuted,
							marginTop: 1
						}}>
						{formattedDate}
					</Text>
				)}
			</View>
		</Pressable>
	);
}
