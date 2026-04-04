import { useState } from 'react';
import { Text, Pressable, ScrollView } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useColorScheme } from '@/components/useColorScheme';
import * as Haptics from 'expo-haptics';
import { apiFetch } from '@/lib/api';
import type { ForumReactionData } from '@/lib/types/api';

type ReactionDef = {
	type: string;
	ios: string;
	activeIos: string;
	android: string;
};

const REACTION_TYPES: ReactionDef[] = [
	{ type: 'like', ios: 'heart', activeIos: 'heart.fill', android: 'favorite_border' },
	{ type: 'helpful', ios: 'lightbulb', activeIos: 'lightbulb.fill', android: 'lightbulb' },
	{ type: 'fire', ios: 'flame', activeIos: 'flame.fill', android: 'local_fire_department' },
	{ type: 'summit', ios: 'mountain.2', activeIos: 'mountain.2.fill', android: 'landscape' }
];

interface ForumReactionsProps {
	reactableType: 'topic' | 'reply';
	reactableId: string;
	data: ForumReactionData;
	onUpdate?: (data: ForumReactionData) => void;
}

export function ForumReactions({ reactableType, reactableId, data, onUpdate }: ForumReactionsProps) {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? colors.dark : colors.light;
	const [reactionData, setReactionData] = useState(data);
	const [toggling, setToggling] = useState<string | null>(null);

	const handleToggle = async (reactionType: string) => {
		if (toggling) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setToggling(reactionType);

		const prev = reactionData;
		const isActive = prev.userReactions.includes(reactionType);

		const optimistic: ForumReactionData = {
			counts: {
				...prev.counts,
				[reactionType]: (prev.counts[reactionType] ?? 0) + (isActive ? -1 : 1)
			},
			userReactions: isActive
				? prev.userReactions.filter((r) => r !== reactionType)
				: [...prev.userReactions, reactionType]
		};
		setReactionData(optimistic);
		onUpdate?.(optimistic);

		try {
			await apiFetch('/api/v1/forum/reactions', {
				method: 'POST',
				body: {
					reactable_type: reactableType,
					reactable_id: reactableId,
					reaction_type: reactionType
				}
			});
		} catch {
			setReactionData(prev);
			onUpdate?.(prev);
		} finally {
			setToggling(null);
		}
	};

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ gap: 6 }}>
			{REACTION_TYPES.map((reaction) => {
				const count = reactionData.counts[reaction.type] ?? 0;
				const isActive = reactionData.userReactions.includes(reaction.type);

				if (count === 0 && !isActive) {
					return (
						<Pressable
							key={reaction.type}
							onPress={() => handleToggle(reaction.type)}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 3,
								paddingHorizontal: 8,
								paddingVertical: 4,
								borderRadius: 14,
								backgroundColor: theme.bgSecondary
							}}>
							<SymbolView
								name={{ ios: reaction.ios as any, android: reaction.android as any, web: reaction.android as any }}
								tintColor={theme.textMuted}
								size={14}
							/>
						</Pressable>
					);
				}

				return (
					<Pressable
						key={reaction.type}
						onPress={() => handleToggle(reaction.type)}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 4,
							paddingHorizontal: 10,
							paddingVertical: 5,
							borderRadius: 14,
							backgroundColor: isActive ? colors.accent.default + '20' : theme.bgSecondary,
							borderWidth: isActive ? 1 : 0,
							borderColor: colors.accent.default + '40'
						}}>
						<SymbolView
							name={{
								ios: (isActive ? reaction.activeIos : reaction.ios) as any,
								android: reaction.android as any,
								web: reaction.android as any
							}}
							tintColor={isActive ? colors.accent.default : theme.textMuted}
							size={14}
						/>
						{count > 0 && (
							<Text
								style={{
									fontFamily: 'Inter-Medium',
									fontSize: 12,
									color: isActive ? colors.accent.default : theme.textMuted
								}}>
								{count}
							</Text>
						)}
					</Pressable>
				);
			})}
		</ScrollView>
	);
}
