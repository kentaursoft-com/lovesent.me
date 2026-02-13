import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { hashPassword, createToken, setSessionCookie } from '$lib/server/auth';
import { isValidEmail, generateId } from '$lib/utils';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = (formData.get('email') as string)?.trim().toLowerCase();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Validation
		if (!email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required, lovebird! 💕' });
		}

		if (!isValidEmail(email)) {
			return fail(400, { error: 'Please enter a valid email address 💌' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters — make it strong! 💪' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: "Passwords don't match! Try again with love 💕" });
		}

		const db = getDb(event.platform!.env.DB);

		// Check if email already exists
		const existing = await db.select().from(users).where(eq(users.email, email)).get();
		if (existing) {
			return fail(400, { error: 'That email is already spreading love! Try logging in ❤️' });
		}

		// Create user
		const userId = generateId();
		const hashedPassword = await hashPassword(password);

		await db.insert(users).values({
			id: userId,
			email,
			hashedPassword,
			createdAt: new Date().toISOString()
		});

		// Create session token
		const jwtSecret = event.platform!.env.JWT_SECRET || 'dev-secret';
		const token = await createToken(userId, email, jwtSecret);
		setSessionCookie(event, token);

		throw redirect(303, '/dashboard');
	}
};
