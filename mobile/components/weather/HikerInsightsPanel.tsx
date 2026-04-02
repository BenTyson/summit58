import { View, Text } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { HikerInsightCard } from './HikerInsightCard';
import type { HikerInsight } from '@/lib/types/api';

interface HikerInsightsPanelProps {
  insights: HikerInsight[];
}

export function HikerInsightsPanel({ insights }: HikerInsightsPanelProps) {
  if (insights.length === 0) return null;

  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 15,
          color: colors.light.textPrimary,
        }}
      >
        Hiker Insights
      </Text>
      {insights.map((insight, i) => (
        <HikerInsightCard key={`${insight.type}-${i}`} insight={insight} />
      ))}
    </View>
  );
}
