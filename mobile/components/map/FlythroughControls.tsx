import { View, Text, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface Props {
  playing: boolean;
  speed: number;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEEDS = [0.5, 1, 2];

export function FlythroughControls({
  playing,
  speed,
  progress,
  onPlay,
  onPause,
  onStop,
  onSpeedChange,
}: Props) {
  function cycleSpeed() {
    const idx = SPEEDS.indexOf(speed);
    onSpeedChange(SPEEDS[(idx + 1) % SPEEDS.length]);
  }

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
    }}>
      <Pressable
        onPress={playing ? onPause : onPlay}
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        accessibilityLabel={playing ? 'Pause flythrough' : 'Resume flythrough'}
      >
        <SymbolView
          name={playing ? 'pause.fill' : 'play.fill'}
          size={20}
          tintColor="#ffffff"
        />
      </Pressable>

      <View style={{
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <View style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: colors.accent.default,
          borderRadius: 3,
        }} />
      </View>

      <Pressable
        onPress={cycleSpeed}
        style={{
          minWidth: 44,
          height: 44,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 8,
        }}
        accessibilityLabel="Change speed"
      >
        <Text style={{
          fontFamily: 'Inter-SemiBold',
          fontSize: 13,
          color: '#ffffff',
        }}>
          {speed}x
        </Text>
      </Pressable>

      <Pressable
        onPress={onStop}
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        accessibilityLabel="Stop flythrough"
      >
        <SymbolView
          name="xmark"
          size={20}
          tintColor="#ffffff"
        />
      </Pressable>
    </View>
  );
}
