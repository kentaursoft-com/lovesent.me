# Love Sent 💖

> Send heartfelt confessions that can't be ignored! 😍

**Love Sent** is a romantic confession platform where you create personalized, interactive proposal pages with playful "No" buttons that are impossible to click seriously, and "Yes" triggers celebratory confetti explosions + email notifications.

🌐 **Live:** [lovesent.me](https://lovesent.me)

---

## ✨ Features

- 💌 **Custom Confession Pages** — Write your own question, add photos, personalize everything
- 😏 **Playful No Buttons** — The "No" button runs away, shrinks, and changes text!
- 🎉 **Confetti Celebrations** — Heart-shaped confetti explosions when they say Yes!
- 📧 **Email Notifications** — Get notified instantly when your crush accepts
- 📱 **Social Sharing** — Share on Twitter, WhatsApp, Facebook, Telegram & more
- 📸 **Screenshot Capture** — Save the happy moment as a PNG image
- 🎨 **Custom Themes** — Choose pastel colors for your confession page
- ♿ **Accessible** — ARIA labels, keyboard navigation, high contrast mode
- 📱 **Responsive** — Beautiful on mobile, tablet, and desktop
- ⚡ **Blazing Fast** — Edge-deployed on Cloudflare for <100ms TTFB globally

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit (SSR + SPA) |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| File Storage | Cloudflare R2 / Backblaze B2 |
| Auth | JWT (jose) + PBKDF2 password hashing |
| Email | Resend.com API |
| Animations | canvas-confetti + CSS animations |
| Deployment | Cloudflare Pages |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+
- Cloudflare account with D1 + R2 configured
- (Optional) Resend.com API key for email notifications

### Installation

```bash
# Clone the repository
git clone https://github.com/kentaursoft-com/lovesent.co.git
cd lovesent.co

# Install dependencies
npm install
```

### Database Setup

```bash
# Apply D1 migrations (local development)
npx wrangler d1 execute lovesent-db --local --file=drizzle/0000_initial.sql

# Apply D1 migrations (production)
npx wrangler d1 execute lovesent-db --remote --file=drizzle/0000_initial.sql
```

### Development

```bash
# Start dev server
npm run dev

# Type checking
npm run check
```

### Deploy to Cloudflare Pages

```bash
# Build the project
npm run build

# Deploy via Wrangler
npx wrangler pages deploy .svelte-kit/cloudflare
```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments on push to `main`.

## 📁 Project Structure

```
lovesent.co/
├── src/
│   ├── app.html              # Base HTML template with Google Fonts
│   ├── app.css               # Global styles, animations, floating hearts
│   ├── app.d.ts              # TypeScript declarations (Cloudflare bindings)
│   ├── hooks.server.ts       # Auth middleware (JWT verification)
│   ├── lib/
│   │   ├── server/
│   │   │   ├── auth.ts       # Password hashing, JWT tokens, cookies
│   │   │   ├── db.ts         # Drizzle ORM instance
│   │   │   ├── email.ts      # Resend email notifications
│   │   │   ├── schema.ts     # Database schema (users, confessions)
│   │   │   └── storage.ts    # R2/Backblaze photo uploads
│   │   ├── stores.ts         # Svelte stores (wizard, toasts, theme)
│   │   └── utils.ts          # Helpers, quotes, share URLs, no-options
│   └── routes/
│       ├── +layout.svelte    # Global layout (navbar, floating hearts, toasts)
│       ├── +layout.server.ts # Auth check on every page load
│       ├── +page.svelte      # Landing page (hero, features, how-it-works)
│       ├── +error.svelte     # Cute 404 page
│       ├── signup/            # Sign up flow
│       ├── login/             # Login flow
│       ├── logout/            # Logout action
│       ├── dashboard/         # Protected dashboard (list confessions)
│       ├── create/            # 6-step confession wizard
│       ├── confess/[slug]/    # Public confession page (the magic!)
│       └── api/
│           ├── accept/[slug]/ # Accept confession API
│           └── confessions/   # Confession data API
├── drizzle/
│   └── 0000_initial.sql      # Database migration
├── static/
│   └── favicon.svg           # Heart-shaped favicon
├── wrangler.toml              # Cloudflare Workers/Pages config
├── drizzle.config.ts          # Drizzle ORM configuration
├── svelte.config.js           # SvelteKit + Cloudflare adapter
└── vite.config.ts             # Vite + Tailwind CSS plugin
```

## ⚙️ Environment Variables

Set these in your Cloudflare Pages dashboard under **Settings > Environment Variables**:

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `RESEND_API_KEY` | Resend.com API key for emails | Optional |
| `USE_BACKBLAZE` | `true` to use Backblaze B2 instead of R2 | Optional |
| `BACKBLAZE_KEY_ID` | Backblaze B2 key ID | If using B2 |
| `BACKBLAZE_APP_KEY` | Backblaze B2 application key | If using B2 |
| `BACKBLAZE_BUCKET_NAME` | Backblaze bucket name | If using B2 |
| `R2_PUBLIC_URL` | Public URL for R2 bucket | Optional |

## 🎨 Cloudflare Bindings

In your Cloudflare Pages project settings, add these bindings:

- **D1 Database:** Binding name `DB`, select your `lovesent-db` database
- **R2 Bucket:** Binding name `PHOTOS_BUCKET`, select your `lovesent-photos` bucket

## 💕 User Flow

1. **Sign Up** → Create account with email/password
2. **Create Confession** → 6-step wizard (question, crush name, title, No texts, photo, extras)
3. **Share Link** → Copy the unique `/confess/[slug]` link and send to your crush
4. **Crush Interacts** → They try to click No, but it runs away! Yes button grows bigger!
5. **Celebration** → Confetti explosion, overlay, screenshot option
6. **Notification** → Creator gets email: "[Crush] said YES! 💖"

## 🔒 Security

- Passwords hashed with PBKDF2 (100,000 iterations, SHA-256)
- JWT tokens with HS256, httpOnly + secure + sameSite cookies
- Input sanitization on all user content
- CSRF protection via SvelteKit form actions
- File upload validation (type + size limits)

## 📄 License

MIT © 2026 Kentaur Soft Inc.

---

Made with 💖 by the Love Sent team. Every love story is beautiful, but yours will be legendary! 🌹
