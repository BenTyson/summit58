import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import type { TrailReportActivityData } from '@/lib/types/api';

const STATUS_COLORS: Record<string, string> = {
	open: colors.alpine.pine,
	caution: colors.semantic.warning,
	closed: colors.semantic.danger,
	unknown: colors.light.textMuted,
};

interface TrailReportActivityCardProps {
	data: TrailReportActivityData;
}

export function TrailReportActivityCard({ data }: TrailReportActivityCardProps) {
	const date = new Date(data.hike_date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
	const statusColor = STATUS_COLORS[data.trail_status || 'unknown'] || colors.light.textMuted;

	return (
		<Pressable onPress={() => router.push(`/peaks/${data.peak.slug}`)}>
			<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
				{data.trail_status && (
					<View
						style={{
							backgroundColor: statusColor + '20',
							paddingHorizontal: 8,
							paddingVertical: 2,
							borderRadius: 4,
						}}>
						<Text
							style={{
								fontFamily: 'Inter-Medium',
								fontSize: 12,
								color: statusColor,
								textTransform: 'capitalize',
							}}>
							{data.trail_status}
						</Text>
					</View>
				)}
				<Text
					style={{
						fontFamily: 'Inter-SemiBold',
						fontSize: 15,
						color: colors.light.textPrimary,
					}}
					numberOfLines={1}>
					{data.peak.name}
				</Text>
				<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
					{date}
				</Text>
			</View>

			{data.hazards && data.hazards.length > 0 && (
				<View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
					{data.hazards.map((hazard) => (
						<View
							key={hazard}
							style={{
								backgroundColor: colors.semantic.warning + '20',
								paddingHorizontal: 6,
								paddingVertical: 2,
								borderRadius: 4,
							}}>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 11,
									color: colors.semantic.warning,
								}}>
								{hazard}
							</Text>
						</View>
					))}
				</View>
			)}

			{data.notes && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 13,
						color: colors.light.textSecondary,
						lineHeight: 18,
						marginTop: 4,
					}}
					numberOfLines={2}>
					{data.notes}
				</Text>
			)}
		</Pressable>
	);
}
