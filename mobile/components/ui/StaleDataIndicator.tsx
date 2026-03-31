import { Text } from 'react-native';
import { colors } from '@/lib/theme/colors';

interface StaleDataIndicatorProps {
  cachedAt: number | null;
}

function formatAge(cachedAt: number): string {
  const ageMs = Date.now() - cachedAt;
  const minutes = Math.floor(ageMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function StaleDataIndicator({ cachedAt }: StaleDataIndicatorProps) {
  if (!cachedAt) return null;

  return (
    <Text
      style={{
        fontFamily: 'Inter',
        fontSize: 11,
        color: colors.light.textMuted,
        marginBottom: 4,
      }}>
      Updated {formatAge(cachedAt)}
    </Text>
  );
}
