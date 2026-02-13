-- Love Sent Database Schema 💖
-- Initial migration for Cloudflare D1

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  hashed_password TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS confessions (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(id),
  unique_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  question_text TEXT NOT NULL,
  crush_name TEXT NOT NULL,
  no_options TEXT NOT NULL,
  photo_url TEXT,
  extra_message TEXT,
  theme_color TEXT DEFAULT '#fce4ec',
  accepted INTEGER DEFAULT 0,
  accepted_at TEXT,
  views INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  confession_slug TEXT NOT NULL REFERENCES confessions(unique_slug),
  event TEXT NOT NULL,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_confessions_creator ON confessions(creator_id);
CREATE INDEX IF NOT EXISTS idx_confessions_slug ON confessions(unique_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_slug ON analytics(confession_slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
