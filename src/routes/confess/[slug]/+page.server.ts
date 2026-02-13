import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { confessions } from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = getDb(platform!.env.DB);

	const confession = await db
		.select()
		.from(confessions)
		.where(eq(confessions.uniqueSlug, params.slug))
		.get();

	if (!confession) {
		throw error(404, 'This love letter seems lost in the mail! 💔 Create your own at lovesent.me');
	}

	// Increment view count (fire and forget)
	try {
		await db
			.update(confessions)
			.set({ views: sql`${confessions.views} + 1` })
			.where(eq(confessions.uniqueSlug, params.slug));
	} catch {
		// Non-critical, don't fail the page load
	}

	return {
		confession: {
			...confession,
			noOptions: JSON.parse(confession.noOptions || '[]') as string[]
		}
	};
};
