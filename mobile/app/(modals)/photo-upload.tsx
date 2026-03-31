import { useState, useCallback } from 'react';
import {
	View, Text, TextInput, ScrollView, Pressable, Image,
	Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/lib/theme/colors';
import { useSession } from '@/lib/auth/AuthProvider';
import { pickImage, optimizeImage, uploadImageWithProgress } from '@/lib/imageUpload';
import { useOffline } from '@/lib/offline/OfflineProvider';
import { useSync } from '@/lib/offline/SyncProvider';
import { enqueuePhoto } from '@/lib/offline/photoQueue';
import { PHOTO_CATEGORIES } from '@saltgoat/shared/data/categories';

export default function PhotoUploadModal() {
	const { peakName, slug } = useLocalSearchParams<{
		peakId: string;
		peakName: string;
		slug: string;
	}>();
	const { user } = useSession();
	const { isOnline } = useOffline();
	const { refreshPendingCount } = useSync();

	const [imageUri, setImageUri] = useState<string | null>(null);
	const [imageWidth, setImageWidth] = useState(0);
	const [imageHeight, setImageHeight] = useState(0);
	const [caption, setCaption] = useState('');
	const [category, setCategory] = useState<string | null>(null);
	const [isPrivate, setIsPrivate] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [loading, setLoading] = useState(false);

	const handlePickImage = useCallback(async (source: 'camera' | 'library') => {
		const asset = await pickImage(source);
		if (asset) {
			setImageUri(asset.uri);
			setImageWidth(asset.width);
			setImageHeight(asset.height);
		}
	}, []);

	const handleSubmit = useCallback(async () => {
		if (!user || !slug || !imageUri) return;

		setLoading(true);
		setUploadProgress(0);

		try {
			const optimized = await optimizeImage(imageUri, imageWidth, imageHeight);

			if (!isOnline) {
				await enqueuePhoto({
					slug,
					optimizedUri: optimized.uri,
					caption: caption.trim() || undefined,
					category: category ?? undefined,
					isPrivate,
				});
				await refreshPendingCount();
				Alert.alert(
					'Saved for Later',
					'Your photo will upload when you\'re back online.',
					[{ text: 'OK', onPress: () => router.back() }]
				);
				return;
			}

			await uploadImageWithProgress({
				slug,
				imageUri: optimized.uri,
				caption: caption.trim() || undefined,
				category: category ?? undefined,
				isPrivate,
				onProgress: setUploadProgress,
			});

			router.back();
		} catch (e) {
			Alert.alert('Upload Failed', e instanceof Error ? e.message : 'Please try again.');
		} finally {
			setLoading(false);
		}
	}, [user, slug, imageUri, imageWidth, imageHeight, caption, category, isPrivate, isOnline, refreshPendingCount]);

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: colors.light.bgPrimary }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
				{peakName && (
					<Text style={{
						fontFamily: 'InstrumentSerif',
						fontSize: 22,
						color: colors.light.textPrimary,
						textAlign: 'center',
					}}>
						{peakName}
					</Text>
				)}

				{/* Image Selection / Preview */}
				{imageUri ? (
					<View style={{ gap: 8 }}>
						<Image
							source={{ uri: imageUri }}
							style={{
								width: '100%',
								aspectRatio: imageWidth / imageHeight || 1,
								maxHeight: 300,
								borderRadius: 12,
							}}
							resizeMode="cover"
						/>
						<Pressable
							onPress={() => setImageUri(null)}
							style={{
								alignSelf: 'center',
								paddingHorizontal: 16,
								paddingVertical: 8,
								borderRadius: 8,
								backgroundColor: colors.light.bgSecondary,
							}}
						>
							<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.light.textSecondary }}>
								Change Photo
							</Text>
						</Pressable>
					</View>
				) : (
					<View style={{ flexDirection: 'row', gap: 12 }}>
						<Pressable
							onPress={() => handlePickImage('camera')}
							style={{
								flex: 1,
								height: 120,
								borderRadius: 12,
								borderWidth: 1,
								borderColor: colors.light.border,
								borderStyle: 'dashed',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 8,
								backgroundColor: colors.light.bgSecondary,
							}}
						>
							<SymbolView
								name="camera.fill"
								size={28}
								tintColor={colors.accent.default}
							/>
							<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.light.textPrimary }}>
								Camera
							</Text>
						</Pressable>
						<Pressable
							onPress={() => handlePickImage('library')}
							style={{
								flex: 1,
								height: 120,
								borderRadius: 12,
								borderWidth: 1,
								borderColor: colors.light.border,
								borderStyle: 'dashed',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 8,
								backgroundColor: colors.light.bgSecondary,
							}}
						>
							<SymbolView
								name="photo.on.rectangle"
								size={28}
								tintColor={colors.accent.default}
							/>
							<Text style={{ fontFamily: 'Inter-Medium', fontSize: 14, color: colors.light.textPrimary }}>
								Photo Library
							</Text>
						</Pressable>
					</View>
				)}

				{/* Caption */}
				{imageUri && (
					<>
						<View style={{ gap: 6 }}>
							<Text style={labelStyle}>Caption (optional)</Text>
							<TextInput
								style={[inputStyle, { minHeight: 70, textAlignVertical: 'top' }]}
								placeholder="Describe the photo..."
								placeholderTextColor={colors.light.textMuted}
								value={caption}
								onChangeText={setCaption}
								multiline
								numberOfLines={3}
							/>
						</View>

						{/* Category */}
						<View style={{ gap: 8 }}>
							<Text style={labelStyle}>Category (optional)</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
								{PHOTO_CATEGORIES.map((cat) => {
									const active = category === cat;
									return (
										<Pressable
											key={cat}
											onPress={() => setCategory(active ? null : cat)}
											style={{
												paddingHorizontal: 14,
												paddingVertical: 8,
												borderRadius: 10,
												backgroundColor: active ? colors.accent.default : colors.light.bgSecondary,
												borderWidth: 1,
												borderColor: active ? colors.accent.default : colors.light.border,
											}}
										>
											<Text style={{
												fontFamily: 'Inter-Medium',
												fontSize: 14,
												color: active ? '#ffffff' : colors.light.textPrimary,
											}}>
												{cat}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>

						{/* Private Toggle */}
						<Pressable
							onPress={() => setIsPrivate(!isPrivate)}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 10,
								paddingVertical: 4,
							}}
						>
							<View style={{
								width: 22,
								height: 22,
								borderRadius: 6,
								borderWidth: 1.5,
								borderColor: isPrivate ? colors.accent.default : colors.light.border,
								backgroundColor: isPrivate ? colors.accent.default : 'transparent',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
								{isPrivate && (
									<SymbolView name="checkmark" size={14} tintColor="#ffffff" />
								)}
							</View>
							<Text style={{ fontFamily: 'Inter', fontSize: 15, color: colors.light.textPrimary }}>
								Private (only visible to you)
							</Text>
						</Pressable>

						{/* Progress Bar */}
						{loading && (
							<View style={{ gap: 6 }}>
								<View style={{
									height: 6,
									borderRadius: 3,
									backgroundColor: colors.light.bgTertiary,
									overflow: 'hidden',
								}}>
									<View style={{
										height: '100%',
										width: `${Math.round(uploadProgress * 100)}%`,
										backgroundColor: colors.accent.default,
										borderRadius: 3,
									}} />
								</View>
								<Text style={{
									fontFamily: 'Inter', fontSize: 13,
									color: colors.light.textMuted, textAlign: 'center',
								}}>
									{uploadProgress < 1
										? `Uploading... ${Math.round(uploadProgress * 100)}%`
										: 'Processing...'}
								</Text>
							</View>
						)}

						{/* Submit */}
						<Pressable
							onPress={handleSubmit}
							disabled={loading}
							style={{
								height: 52,
								borderRadius: 12,
								backgroundColor: loading ? colors.light.bgTertiary : colors.accent.default,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 8,
							}}
						>
							{loading ? (
								<ActivityIndicator color="#ffffff" />
							) : (
								<Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#ffffff' }}>
									Upload Photo
								</Text>
							)}
						</Pressable>
					</>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
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
