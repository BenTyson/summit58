import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import type { TrailReportWithProfile } from '@saltgoat/shared/types/helpers';

const STATUS_COLORS: Record<string, string> = {
	open: colors.alpine.pine,
	caution: colors.semantic.warning,
	closed: colors.semantic.danger,
	unknown: colors.light.textMuted
};

interface TrailReportCardProps {
	report: TrailReportWithProfile;
}

export function TrailReportCard({ report }: TrailReportCardProps) {
	const date = new Date(report.hike_date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});

	const statusColor = STATUS_COLORS[report.trail_status || 'unknown'] || colors.light.textMuted;

	return (
		<View
			style={{
				backgroundColor: colors.light.bgSecondary,
				borderRadius: 10,
				padding: 14,
				borderWidth: 1,
				borderColor: colors.light.border
			}}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					{report.trail_status && (
						<View
							style={{
								backgroundColor: statusColor + '20',
								paddingHorizontal: 8,
								paddingVertical: 2,
								borderRadius: 4
							}}>
							<Text
								style={{
									fontFamily: 'Inter-Medium',
									fontSize: 12,
									color: statusColor,
									textTransform: 'capitalize'
								}}>
								{report.trail_status}
							</Text>
						</View>
					)}
					<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textMuted }}>
						{date}
					</Text>
				</View>
				<Text style={{ fontFamily: 'Inter', fontSize: 12, color: colors.light.textMuted }}>
					{report.profile?.display_name || 'Anonymous'}
				</Text>
			</View>

			<View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
				{report.crowd_level && (
					<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textSecondary }}>
						Crowds: {report.crowd_level}
					</Text>
				)}
				{report.snow_depth_inches != null && report.snow_depth_inches > 0 && (
					<Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.light.textSecondary }}>
						Snow: {report.snow_depth_inches}"
					</Text>
				)}
			</View>

			{report.notes && (
				<Text
					style={{
						fontFamily: 'Inter',
						fontSize: 13,
						color: colors.light.textSecondary,
						marginTop: 6,
						lineHeight: 18
					}}
					numberOfLines={3}>
					{report.notes}
				</Text>
			)}
		</View>
	);
}
