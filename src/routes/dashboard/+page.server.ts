import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { confessions } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const db = getDb(platform!.env.DB);

	const userConfessions = await db
		.select()
		.from(confessions)
		.where(eq(confessions.creatorId, locals.user.id))
		.orderBy(desc(confessions.createdAt))
		.all();

	return {
		confessions: userConfessions
	};
};
