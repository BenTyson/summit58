import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { AppState } from 'react-native';
import { useOffline } from './OfflineProvider';
import { processOutbox, getPendingCount, type SyncResult } from './syncEngine';

interface SyncContextValue {
  pendingCount: number;
  syncing: boolean;
  lastSyncResult: SyncResult | null;
  triggerSync: () => Promise<SyncResult | null>;
  refreshPendingCount: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue>({
  pendingCount: 0,
  syncing: false,
  lastSyncResult: null,
  triggerSync: async () => null,
  refreshPendingCount: async () => {},
});

export function useSync() {
  return useContext(SyncContext);
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const { isOnline, dbReady } = useOffline();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const syncingRef = useRef(false);
  const wasOffline = useRef(false);

  const refreshPendingCount = useCallback(async () => {
    if (!dbReady) return;
    const count = await getPendingCount();
    setPendingCount(count);
  }, [dbReady]);

  const triggerSync = useCallback(async (): Promise<SyncResult | null> => {
    if (syncingRef.current || !isOnline || !dbReady) return null;

    const count = await getPendingCount();
    if (count === 0) return null;

    syncingRef.current = true;
    setSyncing(true);

    try {
      const result = await processOutbox();
      setLastSyncResult(result);
      await refreshPendingCount();
      return result;
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [isOnline, dbReady, refreshPendingCount]);

  // Sync when coming back online
  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    if (wasOffline.current && dbReady) {
      wasOffline.current = false;
      triggerSync();
    }
  }, [isOnline, dbReady, triggerSync]);

  // Sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isOnline && dbReady) {
        triggerSync();
      }
    });
    return () => subscription.remove();
  }, [isOnline, dbReady, triggerSync]);

  // Initial pending count
  useEffect(() => {
    if (dbReady) refreshPendingCount();
  }, [dbReady, refreshPendingCount]);

  return (
    <SyncContext.Provider
      value={{ pendingCount, syncing, lastSyncResult, triggerSync, refreshPendingCount }}>
      {children}
    </SyncContext.Provider>
  );
}
