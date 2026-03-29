import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import type { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../supabase';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  authError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<{ success: boolean; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithApple: () => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  authError: null,
  signInWithEmail: async () => false,
  signUpWithEmail: async () => ({ success: false, needsConfirmation: false }),
  signInWithGoogle: async () => false,
  signInWithApple: async () => false,
  signOut: async () => {},
  resetPassword: async () => false,
  clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    const redirectTo = Linking.createURL('/auth/callback');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setAuthError(error.message);
      return { success: false, needsConfirmation: false };
    }
    // If user exists but identities is empty, email already taken
    if (data.user && data.user.identities?.length === 0) {
      setAuthError('An account with this email already exists.');
      return { success: false, needsConfirmation: false };
    }
    // Supabase returns a session if email confirmation is disabled,
    // otherwise the user needs to confirm their email
    const needsConfirmation = !data.session;
    return { success: true, needsConfirmation };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setAuthError(null);
    const redirectTo = Linking.createURL('/auth/callback');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error || !data.url) {
      setAuthError(error?.message ?? 'Failed to start Google sign-in');
      return false;
    }
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === 'success' && result.url) {
      // Extract tokens from the URL fragment and set the session
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          setAuthError(sessionError.message);
          return false;
        }
        return true;
      }
    }
    return false;
  }, []);

  const signInWithApple = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'ios') {
      setAuthError('Apple Sign In is only available on iOS');
      return false;
    }
    setAuthError(null);
    try {
      const AppleAuthentication = require('expo-apple-authentication');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        setAuthError('No identity token received from Apple');
        return false;
      }
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });
      if (error) {
        setAuthError(error.message);
        return false;
      }
      return true;
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') return false;
      setAuthError(e.message ?? 'Apple Sign In failed');
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setAuthError(null);
    const redirectTo = Linking.createURL('/auth/callback');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setAuthError(error.message);
      return false;
    }
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        authError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        signOut,
        resetPassword,
        clearError,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}
