import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { UserAvatar } from './UserAvatar';
import type { ReactionData } from '@/lib/types/api';

interface ReactionBarProps {
	summitId: string;
	data: ReactionData;
	onUpdate?: (data: ReactionData) => void;
}

export function ReactionBar({ summitId, data, onUpdate }: ReactionBarProps) {
	const [reactionData, setReactionData] = useState(data);
	const [toggling, setToggling] = useState(false);

	const handleToggle = async () => {
		if (toggling) return;
		setToggling(true);

		const prev = reactionData;
		const optimistic: ReactionData = {
			...prev,
			hasReacted: !prev.hasReacted,
			count: prev.hasReacted ? prev.count - 1 : prev.count + 1,
		};
		setReactionData(optimistic);
		onUpdate?.(optimistic);

		try {
			await apiFetch('/api/v1/reactions', {
				method: 'POST',
				body: { summit_id: summitId },
			});
		} catch {
			setReactionData(prev);
			onUpdate?.(prev);
		} finally {
			setToggling(false);
		}
	};

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
			<Pressable
				onPress={handleToggle}
				style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
				<SymbolView
					name={{
						ios: reactionData.hasReacted ? 'heart.fill' : 'heart',
						android: reactionData.hasReacted ? 'favorite' : 'favorite_border',
						web: 'favorite',
					}}
					tintColor={reactionData.hasReacted ? colors.semantic.danger : colors.light.textMuted}
					size={20}
				/>
				{reactionData.count > 0 && (
					<Text
						style={{
							fontFamily: 'Inter-Medium',
							fontSize: 13,
							color: reactionData.hasReacted ? colors.semantic.danger : colors.light.textMuted,
						}}>
						{reactionData.count}
					</Text>
				)}
			</Pressable>

			{reactionData.recentReactors.length > 0 && (
				<View style={{ flexDirection: 'row', marginLeft: -4 }}>
					{reactionData.recentReactors.slice(0, 3).map((reactor, i) => (
						<View key={reactor.id} style={{ marginLeft: i > 0 ? -6 : 0, zIndex: 3 - i }}>
							<UserAvatar user={reactor} size={20} />
						</View>
					))}
				</View>
			)}
		</View>
	);
}
