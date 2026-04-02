import { View, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import type { HikerInsight } from '@/lib/types/api';

const SEVERITY_STYLES: Record<
  HikerInsight['severity'],
  { bg: string; border: string; text: string; icon: string }
> = {
  info: {
    bg: '#EBF8FF',
    border: '#90CDF4',
    text: '#2B6CB0',
    icon: 'info.circle.fill',
  },
  caution: {
    bg: '#FFFFF0',
    border: '#F6E05E',
    text: '#975A16',
    icon: 'exclamationmark.triangle.fill',
  },
  warning: {
    bg: '#FFFAF0',
    border: '#FBD38D',
    text: '#C05621',
    icon: 'exclamationmark.triangle.fill',
  },
  danger: {
    bg: '#FFF5F5',
    border: '#FC8181',
    text: '#C53030',
    icon: 'xmark.octagon.fill',
  },
};

interface HikerInsightCardProps {
  insight: HikerInsight;
}

export function HikerInsightCard({ insight }: HikerInsightCardProps) {
  const style = SEVERITY_STYLES[insight.severity];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: style.bg,
        borderRadius: 10,
        padding: 12,
        gap: 10,
        borderLeftWidth: 3,
        borderLeftColor: style.border,
      }}
    >
      <SymbolView
        name={style.icon as any}
        size={18}
        tintColor={style.text}
        style={{ width: 18, height: 18, marginTop: 1 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: 'Inter-SemiBold',
            fontSize: 14,
            color: style.text,
          }}
        >
          {insight.title}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 13,
            color: style.text,
            opacity: 0.85,
            marginTop: 2,
            lineHeight: 18,
          }}
        >
          {insight.description}
        </Text>
      </View>
    </View>
  );
}
