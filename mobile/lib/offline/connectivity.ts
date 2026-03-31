import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export interface ConnectivityState {
  isOnline: boolean;
  connectionType: string | null;
}

export function useConnectivity(): ConnectivityState {
  const [state, setState] = useState<ConnectivityState>({
    isOnline: true,
    connectionType: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState: NetInfoState) => {
      setState({
        isOnline: netState.isConnected ?? true,
        connectionType: netState.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return state;
}
