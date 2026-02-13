import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { clearSessionCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		clearSessionCookie(event);
		throw redirect(303, '/');
	}
};
