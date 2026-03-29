import { View, Text, Pressable } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import type { PeakImageWithUrl } from '@saltgoat/shared/types/helpers';

interface ImageGalleryViewerProps {
	images: PeakImageWithUrl[];
	visible: boolean;
	initialIndex: number;
	onClose: () => void;
}

export function ImageGalleryViewer({
	images,
	visible,
	initialIndex,
	onClose,
}: ImageGalleryViewerProps) {
	const imageUrls = images.map((img) => ({ uri: img.url }));

	return (
		<ImageViewing
			images={imageUrls}
			imageIndex={initialIndex}
			visible={visible}
			onRequestClose={onClose}
			swipeToCloseEnabled
			doubleTapToZoomEnabled
			HeaderComponent={({ imageIndex }) => (
				<View style={{
					paddingTop: 54,
					paddingHorizontal: 20,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
					<Text style={{
						fontFamily: 'Inter-Medium',
						fontSize: 15,
						color: '#ffffff',
					}}>
						{imageIndex + 1} of {images.length}
					</Text>
					<Pressable onPress={onClose} hitSlop={12}>
						<Text style={{
							fontFamily: 'Inter-SemiBold',
							fontSize: 16,
							color: '#ffffff',
						}}>
							Done
						</Text>
					</Pressable>
				</View>
			)}
			FooterComponent={({ imageIndex }) => {
				const image = images[imageIndex];
				if (!image?.caption && !image?.category) return null;
				return (
					<View style={{
						paddingHorizontal: 20,
						paddingBottom: 40,
						gap: 4,
					}}>
						{image.category && (
							<View style={{
								alignSelf: 'flex-start',
								paddingHorizontal: 10,
								paddingVertical: 4,
								borderRadius: 6,
								backgroundColor: 'rgba(200,165,92,0.8)',
							}}>
								<Text style={{
									fontFamily: 'Inter-Medium',
									fontSize: 12,
									color: '#ffffff',
								}}>
									{image.category}
								</Text>
							</View>
						)}
						{image.caption && (
							<Text style={{
								fontFamily: 'Inter',
								fontSize: 14,
								color: '#ffffff',
								textShadowColor: 'rgba(0,0,0,0.5)',
								textShadowOffset: { width: 0, height: 1 },
								textShadowRadius: 3,
							}}>
								{image.caption}
							</Text>
						)}
						{image.uploader?.display_name && (
							<Text style={{
								fontFamily: 'Inter',
								fontSize: 12,
								color: 'rgba(255,255,255,0.7)',
							}}>
								Photo by {image.uploader.display_name}
							</Text>
						)}
					</View>
				);
			}}
		/>
	);
}
