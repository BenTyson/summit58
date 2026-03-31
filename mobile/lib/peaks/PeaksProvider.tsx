import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { cachedApiFetch } from '@/lib/offline/cache';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { runPrefetchIfNeeded } from '@/lib/offline/prefetch';
import { CACHE_TIERS } from '@/lib/offline/types';
import type { PeaksListResponse } from '@/lib/types/api';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

interface PeaksContextValue {
	peaks: PeakWithStandardRoute[];
	summitedPeakIds: Set<string>;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
	addOptimisticSummit: (peakId: string) => void;
}

const PeaksContext = createContext<PeaksContextValue>({
	peaks: [],
	summitedPeakIds: new Set(),
	loading: true,
	error: null,
	refresh: async () => {},
	addOptimisticSummit: () => {},
});

export function usePeaks() {
	return useContext(PeaksContext);
}

export function PeaksProvider({ children }: { children: ReactNode }) {
	const [peaks, setPeaks] = useState<PeakWithStandardRoute[]>([]);
	const [summitedPeakIds, setSummitedPeakIds] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isOnline, dbReady } = useOffline();
	const prefetchStarted = useRef(false);

	const loadPeaks = useCallback(async () => {
		try {
			setError(null);
			const { data, fromCache } = await cachedApiFetch<PeaksListResponse>(
				'/api/v1/peaks',
				{
					cache: CACHE_TIERS.STATIC,
					onRefresh: (fresh) => {
						const refreshed = fresh as PeaksListResponse;
						setPeaks(refreshed.peaks);
						setSummitedPeakIds(new Set(refreshed.summitedPeakIds));
					},
				},
				isOnline
			);
			setPeaks(data.peaks);
			setSummitedPeakIds(new Set(data.summitedPeakIds));

			// Trigger background prefetch of all peak details + images (once per app launch, online only)
			if (isOnline && !fromCache && !prefetchStarted.current) {
				prefetchStarted.current = true;
				runPrefetchIfNeeded(data.peaks).catch(() => {});
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load peaks');
		} finally {
			setLoading(false);
		}
	}, [isOnline]);

	useEffect(() => {
		if (dbReady) {
			loadPeaks();
		}
	}, [dbReady, loadPeaks]);

	const refresh = useCallback(async () => {
		await loadPeaks();
	}, [loadPeaks]);

	const addOptimisticSummit = useCallback((peakId: string) => {
		setSummitedPeakIds((prev) => new Set(prev).add(peakId));
	}, []);

	return (
		<PeaksContext.Provider value={{ peaks, summitedPeakIds, loading, error, refresh, addOptimisticSummit }}>
			{children}
		</PeaksContext.Provider>
	);
}
