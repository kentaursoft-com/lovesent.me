// ===== Storage Module for Backblaze B2 =====
// Handles photo uploads for confession pages

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

interface StorageEnv {
	BACKBLAZE_KEY_ID?: string;
	BACKBLAZE_APP_KEY?: string;
	BACKBLAZE_BUCKET_NAME?: string;
}

// Allowed image types and max size (5MB)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export function validateImage(file: File): { valid: boolean; error?: string } {
	if (!ALLOWED_TYPES.includes(file.type)) {
		return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed 📸' };
	}
	if (file.size > MAX_SIZE) {
		return { valid: false, error: 'Image must be smaller than 5MB 💕' };
	}
	return { valid: true };
}

// Upload to Backblaze B2 via S3-compatible API
export async function uploadToBackblaze(
	env: StorageEnv,
	key: string,
	data: ArrayBuffer,
	contentType: string
): Promise<string> {
	const s3 = new S3Client({
		region: 'us-west-000',
		endpoint: 'https://s3.us-west-000.backblazeb2.com',
		credentials: {
			accessKeyId: env.BACKBLAZE_KEY_ID || '',
			secretAccessKey: env.BACKBLAZE_APP_KEY || ''
		}
	});

	const bucketName = env.BACKBLAZE_BUCKET_NAME || 'lovesent-photos';

	await s3.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: new Uint8Array(data),
			ContentType: contentType
		})
	);

	return `https://f000.backblazeb2.com/file/${bucketName}/${key}`;
}

// Upload a photo for a confession page
export async function uploadPhoto(
	env: StorageEnv,
	file: File,
	slug: string
): Promise<{ url: string; error?: string }> {
	// Validate the image
	const validation = validateImage(file);
	if (!validation.valid) {
		return { url: '', error: validation.error };
	}

	const extension = file.name.split('.').pop() || 'jpg';
	const key = `confessions/${slug}/photo.${extension}`;
	const data = await file.arrayBuffer();

	try {
		const url = await uploadToBackblaze(env, key, data, file.type);
		return { url };
	} catch (err) {
		console.error('Upload error:', err);
		return { url: '', error: 'Failed to upload photo. Please try again! 😢' };
	}
}
