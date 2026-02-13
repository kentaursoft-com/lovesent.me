import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ===== Users Table =====
export const users = sqliteTable('users', {
	id: text('id').primaryKey(), // UUID
	email: text('email').notNull().unique(),
	hashedPassword: text('hashed_password').notNull(),
	displayName: text('display_name'),
	createdAt: text('created_at').notNull().default(new Date().toISOString())
});

// ===== Confessions Table =====
export const confessions = sqliteTable('confessions', {
	id: text('id').primaryKey(), // UUID
	creatorId: text('creator_id')
		.notNull()
		.references(() => users.id),
	uniqueSlug: text('unique_slug').notNull().unique(),
	title: text('title').notNull(),
	questionText: text('question_text').notNull(),
	crushName: text('crush_name').notNull(),
	noOptions: text('no_options').notNull(), // JSON array of strings
	photoUrl: text('photo_url'),
	extraMessage: text('extra_message'),
	themeColor: text('theme_color').default('#fce4ec'),
	accepted: integer('accepted', { mode: 'boolean' }).default(false),
	acceptedAt: text('accepted_at'),
	views: integer('views').default(0),
	createdAt: text('created_at').notNull().default(new Date().toISOString())
});

// ===== Analytics Table =====
export const analytics = sqliteTable('analytics', {
	id: text('id').primaryKey(),
	confessionSlug: text('confession_slug')
		.notNull()
		.references(() => confessions.uniqueSlug),
	event: text('event').notNull(), // 'view' | 'no_click' | 'yes_click'
	timestamp: text('timestamp').notNull().default(new Date().toISOString())
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Confession = typeof confessions.$inferSelect;
export type NewConfession = typeof confessions.$inferInsert;
