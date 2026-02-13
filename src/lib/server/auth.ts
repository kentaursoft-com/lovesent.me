import { SignJWT, jwtVerify } from 'jose';
import type { RequestEvent } from '@sveltejs/kit';

const COOKIE_NAME = 'lovesent_session';
const TOKEN_EXPIRY = '7d';

// ===== Password Hashing with Web Crypto (Cloudflare Workers compatible) =====
// Using PBKDF2 since it's available in Workers runtime
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);
	const hashArray = new Uint8Array(hash);
	const saltHex = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	const hashHex = Array.from(hashArray)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [saltHex, storedHashHex] = stored.split(':');
	const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));
	const encoder = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);
	const hashHex = Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return hashHex === storedHashHex;
}

// ===== JWT Token Management =====
function getSecret(jwtSecret: string) {
	return new TextEncoder().encode(jwtSecret);
}

export async function createToken(
	userId: string,
	email: string,
	jwtSecret: string
): Promise<string> {
	return new SignJWT({ sub: userId, email })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setIssuer('lovesent')
		.setExpirationTime(TOKEN_EXPIRY)
		.sign(getSecret(jwtSecret));
}

export async function verifyToken(
	token: string,
	jwtSecret: string
): Promise<{ sub: string; email: string } | null> {
	try {
		const { payload } = await jwtVerify(token, getSecret(jwtSecret), {
			issuer: 'lovesent'
		});
		return payload as { sub: string; email: string };
	} catch {
		return null;
	}
}

// ===== Cookie Helpers =====
export function setSessionCookie(event: RequestEvent, token: string) {
	event.cookies.set(COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export function clearSessionCookie(event: RequestEvent) {
	event.cookies.delete(COOKIE_NAME, { path: '/' });
}

export function getSessionToken(event: RequestEvent): string | undefined {
	return event.cookies.get(COOKIE_NAME);
}

// ===== Get User from Request =====
export async function getUserFromRequest(
	event: RequestEvent
): Promise<{ id: string; email: string } | null> {
	const token = getSessionToken(event);
	if (!token) return null;

	const jwtSecret = event.platform?.env?.JWT_SECRET || 'dev-secret';
	const payload = await verifyToken(token, jwtSecret);

	if (!payload) return null;
	return { id: payload.sub, email: payload.email };
}
