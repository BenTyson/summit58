import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import { usePeaks } from '@/lib/peaks/PeaksProvider';
import { ConditionChips } from '@/components/summit/ConditionChips';
import { PeakPickerSheet } from '@/components/summit/PeakPickerSheet';
import type BottomSheet from '@gorhom/bottom-sheet';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';
import type { SummitCreateResponse, PeakDetailResponse } from '@/lib/types/api';

export default function SummitLogModal() {
	const { peakId, summitId } = useLocalSearchParams<{ peakId?: string; summitId?: string }>();
	const { user } = useSession();
	const { peaks, refresh: refreshPeaks } = usePeaks();
	const pickerRef = useRef<BottomSheet>(null);

	const isEditMode = !!summitId;

	const [selectedPeak, setSelectedPeak] = useState<PeakWithStandardRoute | null>(null);
	const [dateSummited, setDateSummited] = useState(new Date().toISOString().split('T')[0]);
	const [conditions, setConditions] = useState<string[]>([]);
	const [notes, setNotes] = useState('');
	const [startTime, setStartTime] = useState('');
	const [summitTime, setSummitTime] = useState('');
	const [partySize, setPartySize] = useState('');
	const [routeId, setRouteId] = useState<string | null>(null);
	const [routes, setRoutes] = useState<{ id: string; name: string; difficulty_class: number }[]>([]);
	const [loading, setLoading] = useState(false);
	const [loadingExisting, setLoadingExisting] = useState(!!summitId);

	// Pre-select peak if peakId provided
	useEffect(() => {
		if (peakId && peaks.length > 0) {
			const peak = peaks.find((p) => p.id === peakId);
			if (peak) {
				setSelectedPeak(peak);
				loadRoutes(peak.slug);
			}
		}
	}, [peakId, peaks]);

	// Load existing summit for edit mode
	useEffect(() => {
		if (!summitId || !user) return;

		async function loadSummit() {
			try {
				// Fetch user profile which contains summits
				const profile = await apiFetch<{ summits: any[] }>('/api/v1/profile');
				const summit = profile.summits.find((s: any) => s.id === summitId);
				if (!summit) {
					Alert.alert('Error', 'Summit not found');
					router.back();
					return;
				}

				const peak = peaks.find((p) => p.id === summit.peak_id);
				if (peak) {
					setSelectedPeak(peak);
					loadRoutes(peak.slug);
				}

				setDateSummited(summit.date_summited);
				if (summit.conditions) setConditions(summit.conditions.split(', '));
				if (summit.notes) setNotes(summit.notes);
				if (summit.start_time) setStartTime(summit.start_time);
				if (summit.summit_time) setSummitTime(summit.summit_time);
				if (summit.party_size) setPartySize(String(summit.party_size));
				if (summit.route_id) setRouteId(summit.route_id);
			} catch {
				Alert.alert('Error', 'Failed to load summit');
				router.back();
			} finally {
				setLoadingExisting(false);
			}
		}

		loadSummit();
	}, [summitId, user, peaks]);

	async function loadRoutes(slug: string) {
		try {
			const detail = await apiFetch<PeakDetailResponse>(`/api/v1/peaks/${slug}`, { auth: false });
			if (detail.peak.routes) {
				setRoutes(
					detail.peak.routes.map((r: any) => ({
						id: r.id,
						name: r.name,
						difficulty_class: r.difficulty_class,
					}))
				);
			}
		} catch {
			// Routes are optional
		}
	}

	const handleSelectPeak = useCallback(
		(peak: PeakWithStandardRoute) => {
			setSelectedPeak(peak);
			setRouteId(null);
			setRoutes([]);
			pickerRef.current?.close();
			loadRoutes(peak.slug);
		},
		[]
	);

	const handleToggleCondition = useCallback((condition: string) => {
		setConditions((prev) =>
			prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
		);
	}, []);

	const handleSave = useCallback(async () => {
		if (!selectedPeak || !user) return;

		setLoading(true);
		try {
			const body: Record<string, unknown> = {
				date_summited: dateSummited,
				conditions: conditions.length > 0 ? conditions.join(', ') : null,
				notes: notes || null,
				start_time: startTime || null,
				summit_time: summitTime || null,
				party_size: partySize ? parseInt(partySize, 10) : null,
				route_id: routeId,
			};

			if (isEditMode) {
				await apiFetch(`/api/v1/summits/${summitId}`, { method: 'PATCH', body });
			} else {
				body.peak_id = selectedPeak.id;
				await apiFetch<SummitCreateResponse>('/api/v1/summits', { method: 'POST', body });
				refreshPeaks();
			}

			router.back();
		} catch (e: any) {
			if (e?.status === 403) {
				Alert.alert('Summit Limit Reached', 'Upgrade to Pro for unlimited summit logging.');
			} else {
				Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'log'} summit.`);
			}
		} finally {
			setLoading(false);
		}
	}, [selectedPeak, user, dateSummited, conditions, notes, startTime, summitTime, partySize, routeId, isEditMode, summitId, refreshPeaks]);

	if (loadingExisting) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator size="large" color={colors.accent.default} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
				{/* Peak selection */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Peak</Text>
					{selectedPeak ? (
						<Pressable
							onPress={() => !isEditMode && pickerRef.current?.snapToIndex(0)}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: colors.light.bgSecondary,
								borderRadius: 10,
								borderWidth: 1,
								borderColor: colors.light.border,
								padding: 12,
							}}>
							<View style={{ flex: 1 }}>
								<Text
									style={{
										fontFamily: 'Inter-SemiBold',
										fontSize: 16,
										color: colors.light.textPrimary,
									}}>
									{selectedPeak.name}
								</Text>
								<Text
									style={{
										fontFamily: 'Inter',
										fontSize: 13,
										color: colors.light.textMuted,
										marginTop: 2,
									}}>
									{selectedPeak.elevation.toLocaleString()} ft &middot; {selectedPeak.range}
								</Text>
							</View>
							{!isEditMode && (
								<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.accent.default }}>
									Change
								</Text>
							)}
						</Pressable>
					) : (
						<Pressable
							onPress={() => pickerRef.current?.snapToIndex(0)}
							style={{
								backgroundColor: colors.light.bgSecondary,
								borderRadius: 10,
								borderWidth: 1,
								borderColor: colors.light.border,
								borderStyle: 'dashed',
								padding: 16,
								alignItems: 'center',
							}}>
							<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.accent.default }}>
								Select a Peak
							</Text>
						</Pressable>
					)}
				</View>

				{/* Date */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Date</Text>
					<TextInput
						style={inputStyle}
						placeholder="YYYY-MM-DD"
						placeholderTextColor={colors.light.textMuted}
						value={dateSummited}
						onChangeText={setDateSummited}
					/>
				</View>

				{/* Route */}
				{routes.length > 0 && (
					<View style={{ gap: 6 }}>
						<Text style={labelStyle}>Route</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
							<View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 4 }}>
								{routes.map((route) => {
									const active = routeId === route.id;
									return (
										<Pressable
											key={route.id}
											onPress={() => setRouteId(active ? null : route.id)}
											style={{
												paddingHorizontal: 14,
												paddingVertical: 10,
												borderRadius: 10,
												backgroundColor: active ? colors.accent.default : colors.light.bgSecondary,
												borderWidth: 1,
												borderColor: active ? colors.accent.default : colors.light.border,
											}}>
											<Text
												style={{
													fontFamily: 'Inter-Medium',
													fontSize: 14,
													color: active ? '#ffffff' : colors.light.textPrimary,
												}}>
												{route.name}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</ScrollView>
					</View>
				)}

				{/* Conditions */}
				<ConditionChips selected={conditions} onToggle={handleToggleCondition} />

				{/* Notes */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Notes</Text>
					<TextInput
						style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
						placeholder="How was the hike?"
						placeholderTextColor={colors.light.textMuted}
						value={notes}
						onChangeText={setNotes}
						multiline
						numberOfLines={3}
					/>
				</View>

				{/* Times */}
				<View style={{ flexDirection: 'row', gap: 12 }}>
					<View style={{ flex: 1, gap: 6 }}>
						<Text style={labelStyle}>Start Time</Text>
						<TextInput
							style={inputStyle}
							placeholder="5:30 AM"
							placeholderTextColor={colors.light.textMuted}
							value={startTime}
							onChangeText={setStartTime}
						/>
					</View>
					<View style={{ flex: 1, gap: 6 }}>
						<Text style={labelStyle}>Summit Time</Text>
						<TextInput
							style={inputStyle}
							placeholder="10:00 AM"
							placeholderTextColor={colors.light.textMuted}
							value={summitTime}
							onChangeText={setSummitTime}
						/>
					</View>
				</View>

				{/* Party size */}
				<View style={{ gap: 6 }}>
					<Text style={labelStyle}>Party Size</Text>
					<TextInput
						style={[inputStyle, { width: 80 }]}
						placeholder="1"
						placeholderTextColor={colors.light.textMuted}
						value={partySize}
						onChangeText={setPartySize}
						keyboardType="number-pad"
					/>
				</View>

				{/* Save button */}
				<Pressable
					onPress={handleSave}
					disabled={!selectedPeak || loading}
					style={{
						height: 52,
						borderRadius: 12,
						backgroundColor: !selectedPeak || loading ? colors.light.bgTertiary : colors.accent.default,
						alignItems: 'center',
						justifyContent: 'center',
						marginTop: 8,
					}}>
					{loading ? (
						<ActivityIndicator color="#ffffff" />
					) : (
						<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
							{isEditMode ? 'Save Changes' : 'Log Summit'}
						</Text>
					)}
				</Pressable>
			</ScrollView>

			{!isEditMode && <PeakPickerSheet ref={pickerRef} peaks={peaks} onSelect={handleSelectPeak} />}
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
