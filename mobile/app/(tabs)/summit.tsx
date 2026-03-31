import { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import type BottomSheet from '@gorhom/bottom-sheet';
import { colors } from '@/lib/theme/colors';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth/AuthProvider';
import { usePeaks } from '@/lib/peaks/PeaksProvider';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { useSync } from '@/lib/offline/SyncProvider';
import { enqueueSummit } from '@/lib/offline/actions';
import { haversineDistance } from '@saltgoat/shared/utils/geo';
import { LoadingState } from '@/components/ui/LoadingState';
import { NearbyPeakCard } from '@/components/summit/NearbyPeakCard';
import { PeakPickerSheet } from '@/components/summit/PeakPickerSheet';
import { ConditionChips } from '@/components/summit/ConditionChips';
import { SummitButton } from '@/components/summit/SummitButton';
import { SummitDetails } from '@/components/summit/SummitDetails';
import { SummitCelebration } from '@/components/summit/SummitCelebration';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';
import type { CanLogSummitResponse, SummitCreateResponse } from '@/lib/types/api';

type ScreenState = 'not-authenticated' | 'detecting' | 'ready' | 'submitting' | 'success';

interface DetectedPeak {
	peak: PeakWithStandardRoute;
	distance: number;
}

export default function SummitScreen() {
	const { user } = useSession();
	const { peaks, refresh: refreshPeaks, addOptimisticSummit } = usePeaks();
	const { isOnline } = useOffline();
	const { refreshPendingCount } = useSync();
	const pickerRef = useRef<BottomSheet>(null);

	const [screenState, setScreenState] = useState<ScreenState>('detecting');
	const [selectedPeak, setSelectedPeak] = useState<PeakWithStandardRoute | null>(null);
	const [nearbyPeaks, setNearbyPeaks] = useState<DetectedPeak[]>([]);
	const [detectionMode, setDetectionMode] = useState<'auto' | 'nearby' | 'manual'>('manual');
	const [conditions, setConditions] = useState<string[]>([]);
	const [notes, setNotes] = useState('');
	const [startTime, setStartTime] = useState('');
	const [summitTime, setSummitTime] = useState('');
	const [partySize, setPartySize] = useState('');
	const [canLog, setCanLog] = useState<CanLogSummitResponse | null>(null);
	const [summitResult, setSummitResult] = useState<{
		peakName: string;
		peakElevation: number;
		newAchievements: string[];
	} | null>(null);

	const today = new Date();
	const dateStr = today.toISOString().split('T')[0];
	const dateLabel = today.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	// Detect peaks and check summit limit on tab focus
	useFocusEffect(
		useCallback(() => {
			if (!user) {
				setScreenState('not-authenticated');
				return;
			}

			let cancelled = false;

			async function detect() {
				setScreenState('detecting');

				// Check summit limit
				try {
					const limitCheck = await apiFetch<CanLogSummitResponse>('/api/v1/summits');
					if (!cancelled) setCanLog(limitCheck);
				} catch {
					// Non-blocking — we'll check again on submit
				}

				// GPS detection
				try {
					const { status } = await Location.requestForegroundPermissionsAsync();
					if (status !== 'granted' || cancelled) {
						if (!cancelled) {
							setDetectionMode('manual');
							setScreenState('ready');
						}
						return;
					}

					const location = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.High,
					});

					if (cancelled) return;

					const { latitude, longitude } = location.coords;
					const withDistance = peaks
						.map((p) => ({
							peak: p,
							distance: haversineDistance(latitude, longitude, p.latitude, p.longitude),
						}))
						.sort((a, b) => a.distance - b.distance);

					const nearest = withDistance[0];
					if (!nearest) {
						setDetectionMode('manual');
						setScreenState('ready');
						return;
					}

					if (nearest.distance <= 500) {
						setDetectionMode('auto');
						setSelectedPeak(nearest.peak);
						setNearbyPeaks([nearest]);
					} else if (nearest.distance <= 5000) {
						setDetectionMode('nearby');
						setNearbyPeaks(withDistance.slice(0, 3));
						setSelectedPeak(null);
					} else {
						setDetectionMode('manual');
					}

					setScreenState('ready');
				} catch {
					if (!cancelled) {
						setDetectionMode('manual');
						setScreenState('ready');
					}
				}
			}

			detect();
			return () => {
				cancelled = true;
			};
		}, [user, peaks])
	);

	const handleToggleCondition = useCallback((condition: string) => {
		setConditions((prev) =>
			prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
		);
	}, []);

	const handleSelectPeak = useCallback((peak: PeakWithStandardRoute) => {
		setSelectedPeak(peak);
		setDetectionMode('manual');
		pickerRef.current?.close();
	}, []);

	const handleSubmit = useCallback(async () => {
		if (!selectedPeak || !user) return;

		// Pre-flight check (skip if offline — we'll validate on sync)
		if (isOnline && canLog && !canLog.allowed) {
			router.push('/(modals)/paywall' as any);
			return;
		}

		setScreenState('submitting');

		const payload = {
			peak_id: selectedPeak.id,
			date_summited: dateStr,
			conditions: conditions.length > 0 ? conditions.join(', ') : null,
			notes: notes || null,
			start_time: startTime || null,
			summit_time: summitTime || null,
			party_size: partySize ? parseInt(partySize, 10) : null,
		};

		if (!isOnline) {
			// Offline: queue for later sync
			await enqueueSummit(payload);
			addOptimisticSummit(selectedPeak.id);
			await refreshPendingCount();

			Alert.alert(
				'Saved Offline',
				`${selectedPeak.name} summit saved. It will sync when you're back online.`,
				[{ text: 'OK' }]
			);
			setScreenState('ready');
			setSelectedPeak(null);
			setConditions([]);
			setNotes('');
			setStartTime('');
			setSummitTime('');
			setPartySize('');
			return;
		}

		try {
			const result = await apiFetch<SummitCreateResponse>('/api/v1/summits', {
				method: 'POST',
				body: payload as Record<string, unknown>,
			});

			setSummitResult({
				peakName: selectedPeak.name,
				peakElevation: selectedPeak.elevation,
				newAchievements: result.newAchievements,
			});
			setScreenState('success');
			refreshPeaks();
		} catch (e: any) {
			if (e?.status === 403) {
				router.push('/(modals)/paywall' as any);
			} else {
				Alert.alert('Error', 'Failed to log summit. Please try again.');
			}
			setScreenState('ready');
		}
	}, [selectedPeak, user, canLog, dateStr, conditions, notes, startTime, summitTime, partySize, refreshPeaks, isOnline, addOptimisticSummit, refreshPendingCount]);

	const handleCelebrationDismiss = useCallback(() => {
		setSummitResult(null);
		setScreenState('ready');
		setSelectedPeak(null);
		setConditions([]);
		setNotes('');
		setStartTime('');
		setSummitTime('');
		setPartySize('');
	}, []);

	// Not authenticated
	if (screenState === 'not-authenticated') {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
					<Text
						style={{
							fontFamily: 'InstrumentSerif',
							fontSize: 24,
							color: colors.light.textPrimary,
							textAlign: 'center',
						}}>
						Log Your Summit
					</Text>
					<Text
						style={{
							fontFamily: 'Inter',
							fontSize: 14,
							color: colors.light.textMuted,
							textAlign: 'center',
							marginTop: 8,
							marginBottom: 24,
						}}>
						Sign in to start tracking your 14er progress
					</Text>
					<Pressable
						onPress={() => router.push('/(auth)/login')}
						style={{
							backgroundColor: colors.accent.default,
							paddingHorizontal: 32,
							paddingVertical: 14,
							borderRadius: 12,
						}}>
						<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
							Sign In
						</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	// Detecting GPS
	if (screenState === 'detecting') {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState message="Finding your peak..." />
			</SafeAreaView>
		);
	}

	// Main screen
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
				{/* Header */}
				<View>
					<Text
						style={{
							fontFamily: 'InstrumentSerif',
							fontSize: 28,
							color: colors.light.textPrimary,
						}}>
						Log Summit
					</Text>
					{canLog && !canLog.isPro && (
						<Pressable
							onPress={canLog.remaining === 0 ? () => router.push('/(modals)/paywall' as any) : undefined}
							disabled={canLog.remaining > 0}>
							<Text
								style={{
									fontFamily: 'Inter',
									fontSize: 13,
									color: canLog.remaining === 0 ? colors.accent.default : colors.light.textMuted,
									marginTop: 2,
								}}>
								{canLog.remaining === 0
									? 'Free limit reached — Upgrade to Pro'
									: `${canLog.remaining} of 5 free summits remaining`}
							</Text>
						</Pressable>
					)}
				</View>

				{/* GPS status / peak selection */}
				{detectionMode === 'auto' && selectedPeak && nearbyPeaks[0] && (
					<View style={{ gap: 8 }}>
						<Text
							style={{
								fontFamily: 'Inter-Medium',
								fontSize: 13,
								color: colors.semantic.success,
							}}>
							GPS detected nearby peak
						</Text>
						<NearbyPeakCard
							peak={selectedPeak}
							distance={nearbyPeaks[0].distance}
							onChangePeak={() => pickerRef.current?.snapToIndex(0)}
						/>
					</View>
				)}

				{detectionMode === 'nearby' && !selectedPeak && (
					<View style={{ gap: 10 }}>
						<Text
							style={{
								fontFamily: 'Inter-Medium',
								fontSize: 14,
								color: colors.light.textSecondary,
							}}>
							Nearby peaks detected
						</Text>
						{nearbyPeaks.map(({ peak, distance }) => (
							<Pressable
								key={peak.id}
								onPress={() => handleSelectPeak(peak)}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: colors.light.bgSecondary,
									borderRadius: 12,
									padding: 14,
									borderWidth: 1,
									borderColor: colors.light.border,
								}}>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontFamily: 'Inter-SemiBold',
											fontSize: 16,
											color: colors.light.textPrimary,
										}}>
										{peak.name}
									</Text>
									<Text
										style={{
											fontFamily: 'Inter',
											fontSize: 13,
											color: colors.light.textMuted,
											marginTop: 2,
										}}>
										{peak.elevation.toLocaleString()} ft &middot;{' '}
										{distance < 1000
											? `${Math.round(distance)}m`
											: `${(distance / 1000).toFixed(1)}km`}{' '}
										away
									</Text>
								</View>
							</Pressable>
						))}
						<Pressable
							onPress={() => pickerRef.current?.snapToIndex(0)}
							style={{ paddingVertical: 4 }}>
							<Text
								style={{
									fontFamily: 'Inter-Medium',
									fontSize: 14,
									color: colors.accent.default,
								}}>
								Search all peaks
							</Text>
						</Pressable>
					</View>
				)}

				{detectionMode === 'manual' && !selectedPeak && (
					<Pressable
						onPress={() => pickerRef.current?.snapToIndex(0)}
						style={{
							backgroundColor: colors.light.bgSecondary,
							borderRadius: 12,
							borderWidth: 1,
							borderColor: colors.light.border,
							borderStyle: 'dashed',
							padding: 24,
							alignItems: 'center',
						}}>
						<Text
							style={{
								fontFamily: 'Inter-SemiBold',
								fontSize: 16,
								color: colors.accent.default,
							}}>
							Select a Peak
						</Text>
						<Text
							style={{
								fontFamily: 'Inter',
								fontSize: 13,
								color: colors.light.textMuted,
								marginTop: 4,
							}}>
							Tap to choose from all 58 fourteeners
						</Text>
					</Pressable>
				)}

				{detectionMode === 'manual' && selectedPeak && (
					<NearbyPeakCard
						peak={selectedPeak}
						distance={0}
						onChangePeak={() => pickerRef.current?.snapToIndex(0)}
					/>
				)}

				{/* Summit button */}
				<SummitButton
					date={dateLabel}
					disabled={!selectedPeak || (canLog != null && !canLog.allowed)}
					loading={screenState === 'submitting'}
					onPress={handleSubmit}
				/>

				{/* Conditions */}
				<ConditionChips selected={conditions} onToggle={handleToggleCondition} />

				{/* Details */}
				<SummitDetails
					notes={notes}
					onNotesChange={setNotes}
					startTime={startTime}
					onStartTimeChange={setStartTime}
					summitTime={summitTime}
					onSummitTimeChange={setSummitTime}
					partySize={partySize}
					onPartySizeChange={setPartySize}
				/>
			</ScrollView>

			{/* Peak picker bottom sheet */}
			<PeakPickerSheet ref={pickerRef} peaks={peaks} onSelect={handleSelectPeak} />

			{/* Celebration overlay */}
			{summitResult && (
				<SummitCelebration
					visible={screenState === 'success'}
					peakName={summitResult.peakName}
					peakElevation={summitResult.peakElevation}
					date={dateLabel}
					newAchievements={summitResult.newAchievements}
					onDismiss={handleCelebrationDismiss}
				/>
			)}
		</SafeAreaView>
	);
}
