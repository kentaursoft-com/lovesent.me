// ===== Storage Module for R2 & Backblaze B2 =====
// Handles photo uploads for confession pages

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

interface StorageEnv {
	PHOTOS_BUCKET: R2Bucket;
	R2_PUBLIC_URL?: string;
	USE_BACKBLAZE?: string;
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

// Upload to Cloudflare R2 (primary)
export async function uploadToR2(
	bucket: R2Bucket,
	key: string,
	data: ArrayBuffer,
	contentType: string
): Promise<string> {
	await bucket.put(key, data, {
		httpMetadata: { contentType }
	});
	return key;
}

// Upload to Backblaze B2 (alternative/backup)
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

	await s3.send(
		new PutObjectCommand({
			Bucket: env.BACKBLAZE_BUCKET_NAME || 'lovesent-photos',
			Key: key,
			Body: new Uint8Array(data),
			ContentType: contentType
		})
	);

	return `https://f000.backblazeb2.com/file/${env.BACKBLAZE_BUCKET_NAME}/${key}`;
}

// Unified upload function — picks R2 or Backblaze based on env config
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
		if (env.USE_BACKBLAZE === 'true') {
			// Use Backblaze B2
			const url = await uploadToBackblaze(env, key, data, file.type);
			return { url };
		} else {
			// Use Cloudflare R2 (default)
			await uploadToR2(env.PHOTOS_BUCKET, key, data, file.type);
			const publicUrl = env.R2_PUBLIC_URL || '';
			return { url: `${publicUrl}/${key}` };
		}
	} catch (err) {
		console.error('Upload error:', err);
		return { url: '', error: 'Failed to upload photo. Please try again! 😢' };
	}
}
