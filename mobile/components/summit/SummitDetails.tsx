import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';

interface SummitDetailsProps {
	notes: string;
	onNotesChange: (notes: string) => void;
	startTime: string;
	onStartTimeChange: (time: string) => void;
	summitTime: string;
	onSummitTimeChange: (time: string) => void;
	partySize: string;
	onPartySizeChange: (size: string) => void;
}

export function SummitDetails({
	notes,
	onNotesChange,
	startTime,
	onStartTimeChange,
	summitTime,
	onSummitTimeChange,
	partySize,
	onPartySizeChange,
}: SummitDetailsProps) {
	const [expanded, setExpanded] = useState(false);

	return (
		<View>
			<Pressable
				onPress={() => setExpanded(!expanded)}
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					gap: 6,
					paddingVertical: 8,
				}}>
				<SymbolView
					name={
						expanded
							? { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }
							: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }
					}
					tintColor={colors.accent.default}
					size={16}
				/>
				<Text
					style={{
						fontFamily: 'Inter-Medium',
						fontSize: 14,
						color: colors.accent.default,
					}}>
					{expanded ? 'Hide Details' : 'Add Details'}
				</Text>
			</Pressable>

			{expanded && (
				<View style={{ gap: 16, paddingTop: 8 }}>
					{/* Notes */}
					<View style={{ gap: 6 }}>
						<Text style={labelStyle}>Notes</Text>
						<TextInput
							style={inputStyle}
							placeholder="How was the hike?"
							placeholderTextColor={colors.light.textMuted}
							value={notes}
							onChangeText={onNotesChange}
							multiline
							numberOfLines={3}
							textAlignVertical="top"
						/>
					</View>

					{/* Times row */}
					<View style={{ flexDirection: 'row', gap: 12 }}>
						<View style={{ flex: 1, gap: 6 }}>
							<Text style={labelStyle}>Start Time</Text>
							<TextInput
								style={inputStyle}
								placeholder="5:30 AM"
								placeholderTextColor={colors.light.textMuted}
								value={startTime}
								onChangeText={onStartTimeChange}
							/>
						</View>
						<View style={{ flex: 1, gap: 6 }}>
							<Text style={labelStyle}>Summit Time</Text>
							<TextInput
								style={inputStyle}
								placeholder="10:00 AM"
								placeholderTextColor={colors.light.textMuted}
								value={summitTime}
								onChangeText={onSummitTimeChange}
							/>
						</View>
					</View>

					{/* Party size */}
					<View style={{ gap: 6 }}>
						<Text style={labelStyle}>Party Size</Text>
						<TextInput
							style={[inputStyle, { width: 80 }]}
							placeholder="1"
							placeholderTextColor={colors.light.textMuted}
							value={partySize}
							onChangeText={onPartySizeChange}
							keyboardType="number-pad"
						/>
					</View>
				</View>
			)}
		</View>
	);
}

const labelStyle = {
	fontFamily: 'Inter-Medium',
	fontSize: 14,
	color: colors.light.textSecondary,
} as const;

const inputStyle = {
	fontFamily: 'Inter',
	fontSize: 15,
	color: colors.light.textPrimary,
	backgroundColor: colors.light.bgSecondary,
	borderRadius: 10,
	borderWidth: 1,
	borderColor: colors.light.border,
	paddingHorizontal: 12,
	paddingVertical: 10,
} as const;
