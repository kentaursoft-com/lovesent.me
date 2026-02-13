// ===== Server Hooks: Auth middleware =====
import { getUserFromRequest } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Extract user from JWT cookie on every request
	event.locals.user = await getUserFromRequest(event);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			// Inject theme from cookie if present
			const theme = event.cookies.get('lovesent_theme') || 'valentine';
			return html.replace('data-theme="valentine"', `data-theme="${theme}"`);
		}
	});

	return response;
};
