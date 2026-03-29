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

export default function SignupScreen() {
  const { signUpWithEmail, signInWithGoogle, signInWithApple, authError, clearError } =
    useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const passwordError =
    confirmPassword && password !== confirmPassword ? 'Passwords do not match' : null;
  const passwordTooShort = password.length > 0 && password.length < 6;

  const handleSignUp = async () => {
    if (!email.trim() || !password || password !== confirmPassword) return;
    setLoading(true);
    clearError();
    const { success, needsConfirmation } = await signUpWithEmail(email.trim(), password);
    setLoading(false);
    if (success && needsConfirmation) {
      setConfirmationSent(true);
    } else if (success) {
      router.back();
    }
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
  const canSubmit = email.trim() && password.length >= 6 && password === confirmPassword && !isLoading;

  if (confirmationSent) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.mountain.navy,
          padding: 32,
        }}>
        <Text
          style={{
            fontFamily: 'InstrumentSerif',
            fontSize: 28,
            color: colors.accent.default,
            textAlign: 'center',
            marginBottom: 16,
          }}>
          Check your email
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 16,
            color: colors.dark.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
          }}>
          We sent a confirmation link to{'\n'}
          <Text style={{ fontFamily: 'Inter-SemiBold', color: '#ffffff' }}>{email}</Text>
        </Text>
        <Pressable
          onPress={() => router.replace('/(auth)/login')}
          style={{
            marginTop: 32,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
          }}>
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: '#ffffff' }}>
            Back to Sign In
          </Text>
        </Pressable>
      </View>
    );
  }

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
          Create your account
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

        {/* Email */}
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

        {/* Password */}
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.dark.textSecondary, marginBottom: 6 }}>
          Password
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Minimum 6 characters"
          placeholderTextColor={colors.dark.textMuted}
          secureTextEntry
          textContentType="newPassword"
          editable={!isLoading}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: 14,
            fontFamily: 'Inter',
            fontSize: 16,
            color: '#ffffff',
            marginBottom: passwordTooShort ? 4 : 12,
          }}
        />
        {passwordTooShort && (
          <Text style={{ fontFamily: 'Inter', fontSize: 12, color: '#fca5a5', marginBottom: 12 }}>
            Password must be at least 6 characters
          </Text>
        )}

        {/* Confirm password */}
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.dark.textSecondary, marginBottom: 6 }}>
          Confirm Password
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter your password"
          placeholderTextColor={colors.dark.textMuted}
          secureTextEntry
          textContentType="newPassword"
          editable={!isLoading}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: 14,
            fontFamily: 'Inter',
            fontSize: 16,
            color: '#ffffff',
            marginBottom: passwordError ? 4 : 20,
          }}
        />
        {passwordError && (
          <Text style={{ fontFamily: 'Inter', fontSize: 12, color: '#fca5a5', marginBottom: 20 }}>
            {passwordError}
          </Text>
        )}

        {/* Create account button */}
        <Pressable
          onPress={handleSignUp}
          disabled={!canSubmit}
          style={({ pressed }) => ({
            backgroundColor: !canSubmit
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
              Create Account
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

        {/* Google */}
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

        {/* Apple (iOS only) */}
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

        {/* Sign in link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          <Text style={{ fontFamily: 'Inter', fontSize: 14, color: colors.dark.textMuted }}>
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')} disabled={isLoading}>
            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: colors.accent.default }}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
