import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDb } from '$lib/server/db';
import { confessions } from '$lib/server/schema';
import { generateId, randomSlug } from '$lib/utils';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await event.request.formData();
		const questionText = formData.get('questionText') as string;
		const crushName = formData.get('crushName') as string;
		const title = formData.get('title') as string;
		const noOptionsJson = formData.get('noOptions') as string;
		const extraMessage = formData.get('extraMessage') as string;
		const themeColor = formData.get('themeColor') as string;
		const photo = formData.get('photo') as File | null;

		// Validation
		if (!questionText || !crushName || !title) {
			return fail(400, { error: 'Please fill in the question, crush name, and title! 💕' });
		}

		let noOptions: string[];
		try {
			noOptions = JSON.parse(noOptionsJson || '[]');
		} catch {
			noOptions = [];
		}

		if (noOptions.length < 3) {
			return fail(400, { error: 'Please select at least 3 "No" options for maximum fun! 😊' });
		}

		const db = getDb(event.platform!.env.DB);
		const confessionId = generateId();
		const slug = randomSlug();

		// Handle photo upload
		let photoUrl = '';
		if (photo && photo.size > 0) {
			try {
				const { uploadPhoto } = await import('$lib/server/storage');
				const result = await uploadPhoto(
					event.platform!.env as any,
					photo,
					slug
				);
				if (result.error) {
					return fail(400, { error: result.error });
				}
				photoUrl = result.url;
			} catch (err) {
				console.error('Photo upload error:', err);
				// Continue without photo
			}
		}

		// Insert confession
		await db.insert(confessions).values({
			id: confessionId,
			creatorId: event.locals.user.id,
			uniqueSlug: slug,
			title,
			questionText,
			crushName,
			noOptions: JSON.stringify(noOptions),
			photoUrl,
			extraMessage: extraMessage || '',
			themeColor: themeColor || '#fce4ec',
			createdAt: new Date().toISOString()
		});

		throw redirect(303, `/dashboard?created=${slug}`);
	}
};
