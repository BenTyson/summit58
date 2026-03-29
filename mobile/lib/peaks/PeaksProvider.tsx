import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import type { PeaksListResponse } from '@/lib/types/api';
import type { PeakWithStandardRoute } from '@saltgoat/shared/types/helpers';

interface PeaksContextValue {
	peaks: PeakWithStandardRoute[];
	summitedPeakIds: Set<string>;
	loading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
}

const PeaksContext = createContext<PeaksContextValue>({
	peaks: [],
	summitedPeakIds: new Set(),
	loading: true,
	error: null,
	refresh: async () => {},
});

export function usePeaks() {
	return useContext(PeaksContext);
}

export function PeaksProvider({ children }: { children: ReactNode }) {
	const [peaks, setPeaks] = useState<PeakWithStandardRoute[]>([]);
	const [summitedPeakIds, setSummitedPeakIds] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadPeaks = useCallback(async () => {
		try {
			setError(null);
			const data = await apiFetch<PeaksListResponse>('/api/v1/peaks');
			setPeaks(data.peaks);
			setSummitedPeakIds(new Set(data.summitedPeakIds));
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Failed to load peaks');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPeaks();
	}, [loadPeaks]);

	const refresh = useCallback(async () => {
		await loadPeaks();
	}, [loadPeaks]);

	return (
		<PeaksContext.Provider value={{ peaks, summitedPeakIds, loading, error, refresh }}>
			{children}
		</PeaksContext.Provider>
	);
}
