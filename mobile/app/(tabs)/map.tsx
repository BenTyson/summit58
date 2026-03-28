import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type BottomSheet from '@gorhom/bottom-sheet';
import { colors } from '@/lib/theme/colors';
import { shadows } from '@/lib/theme/shadows';
import { apiFetch } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PeakBottomSheet } from '@/components/map/PeakBottomSheet';
import type { PeaksListResponse } from '@/lib/types/api';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

const COLORADO_14ERS_REGION: Region = {
	latitude: 39.1,
	longitude: -106.2,
	latitudeDelta: 2.5,
	longitudeDelta: 2.0,
};

function getMarkerColor(difficultyClass?: number): string {
	if (!difficultyClass) return colors.alpine.rock;
	return colors.class[difficultyClass as keyof typeof colors.class] || colors.alpine.rock;
}

export default function MapScreen() {
	const insets = useSafeAreaInsets();
	const mapRef = useRef<MapView>(null);
	const bottomSheetRef = useRef<BottomSheet>(null);

	const [peaks, setPeaks] = useState<PeakWithStandardRoute[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedPeak, setSelectedPeak] = useState<PeakWithStandardRoute | null>(null);
	const [mapType, setMapType] = useState<'standard' | 'hybrid'>('standard');
	const [showsUserLocation, setShowsUserLocation] = useState(false);

	const loadPeaks = useCallback(async () => {
		try {
			setError(null);
			const data = await apiFetch<PeaksListResponse>('/api/v1/peaks', { auth: false });
			setPeaks(data.peaks);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load peaks');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPeaks();
	}, [loadPeaks]);

	const handleMarkerPress = useCallback(
		(peak: PeakWithStandardRoute) => {
			setSelectedPeak(peak);
			bottomSheetRef.current?.snapToIndex(0);
		},
		[]
	);

	const handleMapPress = useCallback(() => {
		bottomSheetRef.current?.close();
	}, []);

	const handleBottomSheetClose = useCallback(() => {
		setSelectedPeak(null);
	}, []);

	const handleViewDetails = useCallback((slug: string) => {
		bottomSheetRef.current?.close();
		router.push(`/peaks/${slug}`);
	}, []);

	const handleToggleMapType = useCallback(() => {
		setMapType((prev) => (prev === 'standard' ? 'hybrid' : 'standard'));
	}, []);

	const handleLocateUser = useCallback(async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') return;

		setShowsUserLocation(true);
		const location = await Location.getCurrentPositionAsync({});
		mapRef.current?.animateToRegion(
			{
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.5,
				longitudeDelta: 0.5,
			},
			500
		);
	}, []);

	if (loading) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<LoadingState message="Loading map..." />
			</View>
		);
	}

	if (error && peaks.length === 0) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}>
				<ErrorState message={error} onRetry={loadPeaks} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<MapView
				ref={mapRef}
				style={StyleSheet.absoluteFill}
				initialRegion={COLORADO_14ERS_REGION}
				mapType={mapType}
				showsUserLocation={showsUserLocation}
				showsCompass
				showsScale
				rotateEnabled={false}
				onPress={handleMapPress}>
				{peaks.map((peak) => (
					<Marker
						key={peak.id}
						coordinate={{
							latitude: peak.latitude,
							longitude: peak.longitude,
						}}
						title={peak.name}
						pinColor={getMarkerColor(peak.standard_route?.difficulty_class)}
						onPress={() => handleMarkerPress(peak)}
					/>
				))}
			</MapView>

			{/* Floating controls */}
			<View
				style={{
					position: 'absolute',
					top: insets.top + 12,
					right: 12,
					gap: 10,
				}}>
				{/* Map type toggle */}
				<Pressable
					onPress={handleToggleMapType}
					style={({ pressed }) => ({
						width: 44,
						height: 44,
						borderRadius: 10,
						backgroundColor: pressed ? colors.light.bgSecondary : colors.light.bgPrimary,
						alignItems: 'center',
						justifyContent: 'center',
						...shadows.card,
					})}>
					<SymbolView
						name={
							mapType === 'standard'
								? { ios: 'globe.americas', android: 'public', web: 'public' }
								: { ios: 'map', android: 'map', web: 'map' }
						}
						tintColor={colors.light.textSecondary}
						size={22}
					/>
				</Pressable>

				{/* Current location */}
				<Pressable
					onPress={handleLocateUser}
					style={({ pressed }) => ({
						width: 44,
						height: 44,
						borderRadius: 10,
						backgroundColor: pressed ? colors.light.bgSecondary : colors.light.bgPrimary,
						alignItems: 'center',
						justifyContent: 'center',
						...shadows.card,
					})}>
					<SymbolView
						name={{ ios: 'location', android: 'my_location', web: 'my_location' }}
						tintColor={colors.light.textSecondary}
						size={22}
					/>
				</Pressable>
			</View>

			<PeakBottomSheet
				ref={bottomSheetRef}
				peak={selectedPeak}
				onClose={handleBottomSheetClose}
				onViewDetails={handleViewDetails}
			/>
		</View>
	);
}
