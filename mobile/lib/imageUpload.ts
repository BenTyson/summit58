import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { supabase } from './supabase';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL!;

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;

/** Launch image picker (camera or library). Returns the selected asset or null if cancelled. */
export async function pickImage(
	source: 'camera' | 'library'
): Promise<ImagePicker.ImagePickerAsset | null> {
	const launch =
		source === 'camera'
			? ImagePicker.launchCameraAsync
			: ImagePicker.launchImageLibraryAsync;

	const result = await launch({
		mediaTypes: ['images'],
		allowsEditing: true,
		quality: 1,
		exif: false,
	});

	if (result.canceled || !result.assets?.[0]) return null;
	return result.assets[0];
}

/** Resize image to fit within 1600x1200 and compress as JPEG. */
export async function optimizeImage(
	uri: string,
	width: number,
	height: number
): Promise<{ uri: string; width: number; height: number }> {
	const needsResize = width > MAX_WIDTH || height > MAX_HEIGHT;

	const ctx = ImageManipulator.manipulate(uri);

	if (needsResize) {
		const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
		const newWidth = Math.round(width * scale);
		const newHeight = Math.round(height * scale);
		ctx.resize({ width: newWidth, height: newHeight });
	}

	const imageRef = await ctx.renderAsync();
	const result = await imageRef.saveAsync({
		compress: 0.8,
		format: SaveFormat.JPEG,
	});

	return {
		uri: result.uri,
		width: needsResize ? Math.round(width * Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)) : width,
		height: needsResize ? Math.round(height * Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)) : height,
	};
}

export interface UploadParams {
	slug: string;
	imageUri: string;
	caption?: string;
	category?: string;
	isPrivate?: boolean;
	onProgress?: (progress: number) => void;
}

export interface UploadResult {
	image: {
		id: string;
		peak_id: string;
		storage_path: string;
		caption: string | null;
		category: string | null;
	};
	url: string;
}

/** Upload image with progress tracking via XMLHttpRequest. */
export async function uploadImageWithProgress(params: UploadParams): Promise<UploadResult> {
	const { slug, imageUri, caption, category, isPrivate, onProgress } = params;

	const token = await getAuthToken();
	if (!token) throw new Error('Not authenticated');

	const formData = new FormData();
	formData.append('file', {
		uri: imageUri,
		name: `photo-${Date.now()}.jpg`,
		type: 'image/jpeg',
	} as any);

	if (caption) formData.append('caption', caption);
	if (category) formData.append('category', category);
	if (isPrivate) formData.append('is_private', 'true');

	return new Promise<UploadResult>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', `${API_BASE}/api/v1/peaks/${slug}/images`);
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && onProgress) {
				onProgress(event.loaded / event.total);
			}
		};

		xhr.onload = () => {
			if (xhr.status === 201) {
				try {
					resolve(JSON.parse(xhr.responseText));
				} catch {
					reject(new Error('Invalid response'));
				}
			} else if (xhr.status === 401) {
				// Try token refresh and retry once
				retryWithRefresh(params).then(resolve).catch(reject);
			} else {
				reject(new Error(`Upload failed (${xhr.status})`));
			}
		};

		xhr.onerror = () => reject(new Error('Network error'));
		xhr.ontimeout = () => reject(new Error('Upload timed out'));
		xhr.timeout = 60000;

		xhr.send(formData);
	});
}

async function getAuthToken(): Promise<string | null> {
	const { data: { session } } = await supabase.auth.getSession();
	return session?.access_token ?? null;
}

async function retryWithRefresh(params: UploadParams): Promise<UploadResult> {
	const { data } = await supabase.auth.refreshSession();
	const token = data.session?.access_token;
	if (!token) throw new Error('Authentication expired');

	const { slug, imageUri, caption, category, isPrivate, onProgress } = params;

	const formData = new FormData();
	formData.append('file', {
		uri: imageUri,
		name: `photo-${Date.now()}.jpg`,
		type: 'image/jpeg',
	} as any);

	if (caption) formData.append('caption', caption);
	if (category) formData.append('category', category);
	if (isPrivate) formData.append('is_private', 'true');

	return new Promise<UploadResult>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', `${API_BASE}/api/v1/peaks/${slug}/images`);
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && onProgress) {
				onProgress(event.loaded / event.total);
			}
		};

		xhr.onload = () => {
			if (xhr.status === 201) {
				try {
					resolve(JSON.parse(xhr.responseText));
				} catch {
					reject(new Error('Invalid response'));
				}
			} else {
				reject(new Error(`Upload failed after retry (${xhr.status})`));
			}
		};

		xhr.onerror = () => reject(new Error('Network error'));
		xhr.ontimeout = () => reject(new Error('Upload timed out'));
		xhr.timeout = 60000;

		xhr.send(formData);
	});
}
