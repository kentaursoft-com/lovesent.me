import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { verifyPassword, createToken, setSessionCookie } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required! 💕' });
		}

		const db = getDb(event.platform!.env.DB);

		// Find user
		const user = await db.select().from(users).where(eq(users.email, email)).get();
		if (!user) {
			return fail(400, { error: 'No account found with that email 😢 Try signing up!' });
		}

		// Verify password
		const valid = await verifyPassword(password, user.hashedPassword);
		if (!valid) {
			return fail(400, { error: 'Wrong password! Give it another try 💪' });
		}

		// Create session
		const jwtSecret = event.platform!.env.JWT_SECRET || 'dev-secret';
		const token = await createToken(user.id, user.email, jwtSecret);
		setSessionCookie(event, token);

		throw redirect(303, '/dashboard');
	}
};
