import { useState, useCallback } from 'react';
import {
	View, Text, TextInput, ScrollView, Pressable,
	Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import type { TrailReportCreateResponse } from '@/lib/types/api';

const TRAIL_STATUS_OPTIONS = [
	{ value: 'clear', label: 'Clear' },
	{ value: 'muddy', label: 'Muddy' },
	{ value: 'snowy', label: 'Snowy' },
	{ value: 'icy', label: 'Icy' },
	{ value: 'mixed', label: 'Mixed' },
] as const;

const CROWD_OPTIONS = [
	{ value: 'empty', label: 'Empty' },
	{ value: 'light', label: 'Light' },
	{ value: 'moderate', label: 'Moderate' },
	{ value: 'crowded', label: 'Crowded' },
	{ value: 'packed', label: 'Packed' },
] as const;

const ROAD_OPTIONS = [
	{ value: 'open', label: 'Open' },
	{ value: 'rough', label: 'Rough' },
	{ value: '4wd_required', label: '4WD Required' },
	{ value: 'closed', label: 'Closed' },
] as const;

const HAZARD_OPTIONS = [
	{ value: 'fallen_trees', label: 'Fallen Trees' },
	{ value: 'stream_crossing', label: 'Stream Crossing' },
	{ value: 'rockfall', label: 'Rockfall' },
	{ value: 'wildlife', label: 'Wildlife' },
	{ value: 'lightning_risk', label: 'Lightning Risk' },
] as const;

export default function TrailReportModal() {
	const { peakName, slug } = useLocalSearchParams<{
		peakId: string;
		peakName: string;
		slug: string;
	}>();
	const { user } = useSession();

	const [hikeDate, setHikeDate] = useState(new Date().toISOString().split('T')[0]);
	const [trailStatus, setTrailStatus] = useState('clear');
	const [snowDepth, setSnowDepth] = useState('');
	const [crowdLevel, setCrowdLevel] = useState('moderate');
	const [roadStatus, setRoadStatus] = useState('open');
	const [hazards, setHazards] = useState<string[]>([]);
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);

	const showSnowDepth = trailStatus === 'snowy' || trailStatus === 'icy' || trailStatus === 'mixed';

	const toggleHazard = useCallback((hazard: string) => {
		setHazards((prev) =>
			prev.includes(hazard) ? prev.filter((h) => h !== hazard) : [...prev, hazard]
		);
	}, []);

	const handleSubmit = useCallback(async () => {
		if (!user || !slug) return;

		setLoading(true);
		try {
			const result = await apiFetch<TrailReportCreateResponse>(
				`/api/v1/peaks/${slug}/trail-reports`,
				{
					method: 'POST',
					body: {
						hike_date: hikeDate,
						trail_status: trailStatus,
						snow_depth_inches: showSnowDepth && snowDepth ? parseInt(snowDepth, 10) : null,
						crowd_level: crowdLevel,
						road_status: roadStatus,
						hazards,
						notes: notes.trim() || null,
					},
				}
			);

			if (result.newAchievements?.length > 0) {
				Alert.alert(
					'Achievement Earned!',
					'Check your profile to see your new achievement.',
					[{ text: 'OK', onPress: () => router.back() }]
				);
			} else {
				router.back();
			}
		} catch {
			Alert.alert('Error', 'Failed to submit trail report. Please try again.');
		} finally {
			setLoading(false);
		}
	}, [user, slug, hikeDate, trailStatus, snowDepth, crowdLevel, roadStatus, hazards, notes, showSnowDepth]);

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
				{peakName && (
					<Text style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 22,
						color: colors.light.textPrimary,
						textAlign: 'center',
					}}>
						{peakName}
					</Text>
				)}

				{/* Hike Date */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>When did you hike?</Text>
					<TextInput
						style={inputStyle}
						placeholder="YYYY-MM-DD"
						placeholderTextColor={colors.light.textMuted}
						value={hikeDate}
						onChangeText={setHikeDate}
					/>
				</View>

				{/* Trail Status */}
				<ChipSelector
					label="Trail Conditions"
					options={TRAIL_STATUS_OPTIONS}
					selected={trailStatus}
					onSelect={setTrailStatus}
					activeColor={colors.accent.default}
				/>

				{/* Snow Depth (conditional) */}
				{showSnowDepth && (
					<View style={{ gap: 6 }}>
						<Text style={labelStyle}>Snow Depth (inches)</Text>
						<TextInput
							style={[inputStyle, { width: 120 }]}
							placeholder="0"
							placeholderTextColor={colors.light.textMuted}
							value={snowDepth}
							onChangeText={setSnowDepth}
							keyboardType="number-pad"
						/>
					</View>
				)}

				{/* Crowd Level */}
				<ChipSelector
					label="Crowd Level"
					options={CROWD_OPTIONS}
					selected={crowdLevel}
					onSelect={setCrowdLevel}
					activeColor={colors.mountain.blueLight}
				/>

				{/* Road Status */}
				<ChipSelector
					label="Road Access"
					options={ROAD_OPTIONS}
					selected={roadStatus}
					onSelect={setRoadStatus}
					activeColor={colors.alpine.pine}
				/>

				{/* Hazards (multi-select) */}
				<View style={{ gap: 8 }}>
					<Text style={labelStyle}>Hazards (select any)</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
						{HAZARD_OPTIONS.map(({ value, label }) => {
							const active = hazards.includes(value);
							return (
								<Pressable
									key={value}
									onPress={() => toggleHazard(value)}
									style={{
										paddingHorizontal: 14,
										paddingVertical: 8,
										borderRadius: 10,
										backgroundColor: active ? colors.semantic.warning : colors.light.bgSecondary,
										borderWidth: 1,
										borderColor: active ? colors.semantic.warning : colors.light.border,
									}}
								>
									<Text style={{
										fontFamily: 'Inter-Medium',
										fontSize: 14,
										color: active ? '#ffffff' : colors.light.textPrimary,
									}}>
										{label}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</View>

				{/* Notes */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Additional Notes (optional)</Text>
					<TextInput
						style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
						placeholder="Route finding, conditions, parking..."
						placeholderTextColor={colors.light.textMuted}
						value={notes}
						onChangeText={setNotes}
						multiline
						numberOfLines={3}
					/>
				</View>

				{/* Submit */}
				<Pressable
					onPress={handleSubmit}
					disabled={loading}
					style={{
						height: 52,
						borderRadius: 12,
						backgroundColor: loading ? colors.light.bgTertiary : colors.accent.default,
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: 8,
					}}
				>
					{loading ? (
						<ActivityIndicator color="#ffffff" />
					) : (
						<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
							Submit Report
						</Text>
					)}
				</Pressable>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

function ChipSelector({
	label,
	options,
	selected,
	onSelect,
	activeColor,
}: {
	label: string;
	options: ReadonlyArray<{ value: string; label: string }>;
	selected: string;
	onSelect: (value: string) => void;
	activeColor: string;
}) {
	return (
		<View style={{ gap: 8 }}>
			<Text style={labelStyle}>{label}</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
				{options.map((option) => {
					const active = selected === option.value;
					return (
						<Pressable
							key={option.value}
							onPress={() => onSelect(option.value)}
							style={{
								paddingHorizontal: 14,
								paddingVertical: 8,
								borderRadius: 10,
								backgroundColor: active ? activeColor : colors.light.bgSecondary,
								borderWidth: 1,
								borderColor: active ? activeColor : colors.light.border,
							}}
						>
							<Text style={{
								fontFamily: 'Inter-Medium',
								fontSize: 14,
								color: active ? '#ffffff' : colors.light.textPrimary,
							}}>
								{option.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

const labelStyle = {
	fontFamily: 'Inter-Medium',
	fontSize: 14,
	color: colors.light.textSecondary,
} as const;

const inputStyle = {
	fontFamily: 'Inter',
	fontSize: 15,
	color: colors.light.textPrimary,
	backgroundColor: colors.light.bgSecondary,
	borderRadius: 10,
	borderWidth: 1,
	borderColor: colors.light.border,
	paddingHorizontal: 12,
	paddingVertical: 10,
} as const;
