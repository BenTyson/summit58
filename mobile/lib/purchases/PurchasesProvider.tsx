import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { useSession } from '@/lib/auth/AuthProvider';

const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? '';
const REVENUECAT_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? '';
const PRO_ENTITLEMENT = 'SaltGoat Pro';

interface PurchasesContextType {
  isPro: boolean;
  offerings: PurchasesOfferings | null;
  loading: boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  manageSubscription: () => void;
}

const PurchasesContext = createContext<PurchasesContextType>({
  isPro: false,
  offerings: null,
  loading: true,
  purchase: async () => false,
  restorePurchases: async () => false,
  manageSubscription: () => {},
});

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [isPro, setIsPro] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  // Configure RevenueCat SDK on mount
  useEffect(() => {
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
    if (!apiKey) {
      setLoading(false);
      return;
    }

    Purchases.setLogLevel(LOG_LEVEL.WARN);
    Purchases.configure({ apiKey });
    setConfigured(true);
  }, []);

  // Identify user when auth state changes
  useEffect(() => {
    if (!configured) return;

    if (user) {
      Purchases.logIn(user.id).then(({ customerInfo }) => {
        updateProStatus(customerInfo);
      });
    } else {
      Purchases.logOut().catch(() => {});
      setIsPro(false);
    }
  }, [user, configured]);

  // Fetch offerings once configured
  useEffect(() => {
    if (!configured) return;

    Purchases.getOfferings()
      .then((o) => setOfferings(o))
      .finally(() => setLoading(false));
  }, [configured]);

  // Listen for customer info changes (renewals, expirations, etc.)
  useEffect(() => {
    if (!configured) return;

    const listener = (info: CustomerInfo) => updateProStatus(info);
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => { Purchases.removeCustomerInfoUpdateListener(listener); };
  }, [configured]);

  function updateProStatus(info: CustomerInfo) {
    setIsPro(info.entitlements.active[PRO_ENTITLEMENT] !== undefined);
  }

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const active = customerInfo.entitlements.active[PRO_ENTITLEMENT] !== undefined;
      setIsPro(active);
      return active;
    } catch (e: any) {
      if (e.userCancelled) return false;
      Alert.alert('Purchase Failed', e.message ?? 'Something went wrong. Please try again.');
      return false;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      const info = await Purchases.restorePurchases();
      const active = info.entitlements.active[PRO_ENTITLEMENT] !== undefined;
      setIsPro(active);
      if (active) {
        Alert.alert('Restored', 'Your Pro subscription has been restored.');
      } else {
        Alert.alert('No Subscription Found', 'No active subscription was found for this account.');
      }
      return active;
    } catch (e: any) {
      Alert.alert('Restore Failed', e.message ?? 'Could not restore purchases.');
      return false;
    }
  }, []);

  const manageSubscription = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL('https://play.google.com/store/account/subscriptions');
    }
  }, []);

  return (
    <PurchasesContext.Provider
      value={{ isPro, offerings, loading, purchase, restorePurchases, manageSubscription }}>
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases() {
  return useContext(PurchasesContext);
}
