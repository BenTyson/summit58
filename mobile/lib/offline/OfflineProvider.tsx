import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getDatabase } from './database';
import { useConnectivity, type ConnectivityState } from './connectivity';

interface OfflineContextValue extends ConnectivityState {
  dbReady: boolean;
}

const OfflineContext = createContext<OfflineContextValue>({
  isOnline: true,
  connectionType: null,
  dbReady: false,
});

export function useOffline() {
  return useContext(OfflineContext);
}

export function OfflineProvider({ children }: { children: ReactNode }) {
  const connectivity = useConnectivity();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    getDatabase()
      .then(() => setDbReady(true))
      .catch((e) => {
        console.error('Failed to initialize offline database:', e);
        // App still works without cache — just no offline support
        setDbReady(true);
      });
  }, []);

  return (
    <OfflineContext.Provider value={{ ...connectivity, dbReady }}>
      {children}
    </OfflineContext.Provider>
  );
}
