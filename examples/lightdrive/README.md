# LightDrive

Self-hosted cloud storage with file sharing, previews, and analytics.

Built with [SvelteKit](https://kit.svelte.dev/), [Prisma](https://www.prisma.io/), and [FlewUI](https://github.com/lbirkert/FlewUi).

## Quick Start

```bash
chmod +x setup.sh
./setup.sh
bun run dev
```

## Manual Setup

```bash
cp .env.example .env     # Configure DATABASE_URL etc.
bun install
bunx prisma db push      # Create database schema
bun run dev
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Marketing landing page |
| `/drive/{userId}` | Personal drive |
| `/drive/{shareToken}` | Shared drive (via share link) |
| `/auth` | Sign in / Sign up |
| `/account` | Account settings |
| `/account/shares` | Manage share links |
| `/dashboard` | Usage analytics |
| `/api-docs` | REST API reference |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database path |

## Tech Stack

- **Runtime:** Bun
- **Framework:** SvelteKit (Svelte 5)
- **Database:** SQLite via Prisma + libSQL
- **Auth:** Argon2 password hashing, HTTP-only session cookies
- **UI:** FlewUI component library
- **Icons:** Lucide
