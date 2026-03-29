import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';

export default function ResetPasswordScreen() {
  const { resetPassword, authError, clearError } = useSession();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return;
    setLoading(true);
    clearError();
    const success = await resetPassword(email.trim());
    setLoading(false);
    if (success) setSent(true);
  };

  if (sent) {
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
          We sent a password reset link to{'\n'}
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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 32,
        }}>
        {/* Header */}
        <Text
          style={{
            fontFamily: 'InstrumentSerif',
            fontSize: 32,
            color: colors.accent.default,
            textAlign: 'center',
            marginBottom: 8,
          }}>
          Reset Password
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 15,
            color: colors.dark.textMuted,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 22,
          }}>
          Enter your email and we'll send you a link to reset your password.
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
          editable={!loading}
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: 14,
            fontFamily: 'Inter',
            fontSize: 16,
            color: '#ffffff',
            marginBottom: 20,
          }}
        />

        {/* Send reset link */}
        <Pressable
          onPress={handleReset}
          disabled={loading || !email.trim()}
          style={({ pressed }) => ({
            backgroundColor: loading || !email.trim()
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
              Send Reset Link
            </Text>
          )}
        </Pressable>

        {/* Back to sign in */}
        <Pressable onPress={() => router.back()} disabled={loading}>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 14,
              color: colors.accent.default,
              textAlign: 'center',
            }}>
            Back to Sign In
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
