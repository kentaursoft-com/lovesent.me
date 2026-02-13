import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { confessions } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, platform }) => {
	const db = getDb(platform!.env.DB);

	const confession = await db
		.select()
		.from(confessions)
		.where(eq(confessions.uniqueSlug, params.slug))
		.get();

	if (!confession) {
		throw error(404, 'This love letter seems lost in the mail! 💔');
	}

	return json({
		...confession,
		noOptions: JSON.parse(confession.noOptions || '[]')
	});
};
