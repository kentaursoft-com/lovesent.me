import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { confessions, users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { sendAcceptanceEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ params, platform }) => {
	const db = getDb(platform!.env.DB);

	// Find the confession
	const confession = await db
		.select()
		.from(confessions)
		.where(eq(confessions.uniqueSlug, params.slug))
		.get();

	if (!confession) {
		throw error(404, 'Confession not found 💔');
	}

	if (confession.accepted) {
		return json({ message: 'Already accepted! 💖', alreadyAccepted: true });
	}

	// Update accepted status
	const now = new Date().toISOString();
	await db
		.update(confessions)
		.set({ accepted: true, acceptedAt: now })
		.where(eq(confessions.uniqueSlug, params.slug));

	// Find the creator to send notification email
	try {
		const creator = await db
			.select()
			.from(users)
			.where(eq(users.id, confession.creatorId))
			.get();

		if (creator) {
			await sendAcceptanceEmail({
				to: creator.email,
				crushName: confession.crushName,
				title: confession.title,
				slug: confession.uniqueSlug,
				apiKey: platform!.env.RESEND_API_KEY || ''
			});
		}
	} catch (err) {
		console.error('Failed to send notification email:', err);
		// Don't fail the acceptance — email is nice-to-have
	}

	return json({
		success: true,
		message: `${confession.crushName} said YES! 💖🎉`,
		acceptedAt: now
	});
};
