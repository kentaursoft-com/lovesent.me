// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			user: {
				id: string;
				email: string;
			} | null;
		}
		interface Platform {
			env: {
				DB: D1Database;
				PHOTOS_BUCKET: R2Bucket;
				JWT_SECRET: string;
				RESEND_API_KEY: string;
				BACKBLAZE_KEY_ID?: string;
				BACKBLAZE_APP_KEY?: string;
				BACKBLAZE_BUCKET_NAME?: string;
				USE_BACKBLAZE?: string;
				R2_PUBLIC_URL?: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
