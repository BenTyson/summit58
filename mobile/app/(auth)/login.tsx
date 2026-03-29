import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';

export default function LoginScreen() {
  const { signInWithEmail, signInWithGoogle, signInWithApple, authError, clearError } =
    useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    clearError();
    const success = await signInWithEmail(email.trim(), password);
    setLoading(false);
    if (success) router.back();
  };

  const handleGoogle = async () => {
    setOauthLoading('google');
    clearError();
    const success = await signInWithGoogle();
    setOauthLoading(null);
    if (success) router.back();
  };

  const handleApple = async () => {
    setOauthLoading('apple');
    clearError();
    const success = await signInWithApple();
    setOauthLoading(null);
    if (success) router.back();
  };

  const isLoading = loading || oauthLoading !== null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.mountain.navy }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 32,
        }}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Text
          style={{
            fontFamily: 'InstrumentSerif',
            fontSize: 40,
            color: colors.accent.default,
            textAlign: 'center',
          }}>
          SaltGoat
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 16,
            color: colors.dark.textMuted,
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 32,
          }}>
          Sign in to track your 14ers
        </Text>

        {/* Error */}
        {authError && (
          <View
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}>
            <Text style={{ fontFamily: 'Inter', fontSize: 14, color: '#fca5a5' }}>
              {authError}
            </Text>
          </View>
        )}

        {/* Email input */}
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.dark.textSecondary, marginBottom: 6 }}>
          Email
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.dark.textMuted}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          editable={!isLoading}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: 14,
            fontFamily: 'Inter',
            fontSize: 16,
            color: '#ffffff',
            marginBottom: 12,
          }}
        />

        {/* Password input */}
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.dark.textSecondary, marginBottom: 6 }}>
          Password
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor={colors.dark.textMuted}
          secureTextEntry
          textContentType="password"
          editable={!isLoading}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: 14,
            fontFamily: 'Inter',
            fontSize: 16,
            color: '#ffffff',
            marginBottom: 8,
          }}
        />

        {/* Forgot password */}
        <Pressable onPress={() => router.push('/(auth)/reset-password')} disabled={isLoading}>
          <Text
            style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: colors.accent.default,
              textAlign: 'right',
              marginBottom: 20,
            }}>
            Forgot password?
          </Text>
        </Pressable>

        {/* Sign in button */}
        <Pressable
          onPress={handleEmailSignIn}
          disabled={isLoading || !email.trim() || !password}
          style={({ pressed }) => ({
            backgroundColor: isLoading || !email.trim() || !password
              ? colors.accent.muted
              : pressed
                ? colors.accent.light
                : colors.accent.default,
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 24,
          })}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
              Sign In
            </Text>
          )}
        </Pressable>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Text style={{ fontFamily: 'Inter', fontSize: 13, color: colors.dark.textMuted, paddingHorizontal: 16 }}>
            or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
        </View>

        {/* Google Sign In */}
        <Pressable
          onPress={handleGoogle}
          disabled={isLoading}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#e8e8e8' : '#ffffff',
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 12,
            opacity: isLoading ? 0.5 : 1,
          })}>
          {oauthLoading === 'google' ? (
            <ActivityIndicator color={colors.mountain.navy} />
          ) : (
            <>
              <Text style={{ fontSize: 18 }}>G</Text>
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 16, color: '#1f1f1f' }}>
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>

        {/* Apple Sign In (iOS only) */}
        {Platform.OS === 'ios' && (
          <Pressable
            onPress={handleApple}
            disabled={isLoading}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#333333' : '#000000',
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 24,
              opacity: isLoading ? 0.5 : 1,
            })}>
            {oauthLoading === 'apple' ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={{ fontSize: 18, color: '#ffffff' }}></Text>
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: 16, color: '#ffffff' }}>
                  Sign in with Apple
                </Text>
              </>
            )}
          </Pressable>
        )}

        {/* Create account link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.dark.textMuted }}>
            Don't have an account?
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/signup')} disabled={isLoading}>
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: colors.accent.default }}>
              Create one
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
