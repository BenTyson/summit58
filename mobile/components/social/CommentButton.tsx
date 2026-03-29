import { Pressable, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface CommentButtonProps {
	count: number;
	onPress: () => void;
}

export function CommentButton({ count, onPress }: CommentButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
			<SymbolView
				name={{ ios: 'bubble.right', android: 'chat_bubble_outline', web: 'chat_bubble_outline' }}
				tintColor={colors.light.textMuted}
				size={18}
			/>
			{count > 0 && (
				<Text
					style={{
						fontFamily: 'Inter-Medium',
						fontSize: 13,
						color: colors.light.textMuted,
					}}>
					{count}
				</Text>
			)}
		</Pressable>
	);
}
