import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Create Drizzle instance from Cloudflare D1 binding
export function getDb(d1: D1Database) {
	return drizzle(d1, { schema });
}

export type Database = ReturnType<typeof getDb>;
