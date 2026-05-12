# ⚡ TradeDex

> A modern Pokémon TCG trading platform connecting collectors worldwide.

**TradeDex is NOT a marketplace. It does NOT process payments.** It only helps collectors find and organize trades with each other.

---

## ⚠️ Legal Disclaimer

TradeDex is a connection platform only. We do not process payments, authenticate cards, guarantee trades, or act as an intermediary. All trades are arranged privately between users at their own risk. TradeDex assumes no liability for lost, damaged, or counterfeit cards.

---

## 📦 Monorepo Structure

```
TradeDex/
├── apps/
│   ├── web/                  # Next.js 16 App Router (TypeScript + Tailwind)
│   └── mobile/               # Expo React Native (TypeScript + Expo Router)
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── utils/                # Shared utilities (date, labels, validation)
│   └── config/               # Shared constants & configuration
├── supabase/
│   └── migrations/           # PostgreSQL schema migrations
├── turbo.json                # Turborepo config
└── pnpm-workspace.yaml       # pnpm workspaces
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

**Web app** (`apps/web/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
POKEMON_TCG_API_KEY=your-pokemon-tcg-api-key   # Optional, but recommended
```

**Mobile app** (`apps/mobile/.env.local`):
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_POKEMON_TCG_API_KEY=your-pokemon-tcg-api-key
```

### 3. Run the Supabase migrations

In your Supabase project's SQL editor, run the migrations in order:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_storage.sql`

### 4. Start development

```bash
# Start both web and mobile
pnpm dev

# Start web only
pnpm --filter @tradedex/web dev

# Start mobile only
pnpm --filter @tradedex/mobile start
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm |
| Web | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Mobile | Expo 54 + React Native + Expo Router |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| State | Zustand + TanStack Query |
| Cards API | [Pokémon TCG API](https://pokemontcg.io) |

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (username, bio, location, rating) |
| `user_cards` | Cards in a user's collection (with status, condition, language) |
| `conversations` | One-to-one chat conversations |
| `messages` | Chat messages with Realtime support |
| `reviews` | Positive/negative/neutral reviews between traders |
| `reports` | User reports for moderation |

All tables have Row Level Security (RLS) enabled.

---

## ✨ Features

### MVP
- ✅ Email/password authentication + OAuth support
- ✅ Public user profiles
- ✅ Pokémon TCG card search (via pokemontcg.io)
- ✅ Collection management (For Trade / Wanted / Collection)
- ✅ Trade matching system
- ✅ Real-time chat (Supabase Realtime)
- ✅ Reviews (positive / negative / neutral)
- ✅ User reporting
- ✅ Dark mode
- ✅ Responsive web design
- ✅ Cross-platform mobile app (iOS + Android)

---

## 📱 Mobile App

Built with Expo Router for file-based routing:

```
apps/mobile/app/
├── _layout.tsx          # Root layout (auth listener)
├── (tabs)/
│   ├── _layout.tsx      # Tab bar
│   ├── index.tsx        # Home
│   ├── search.tsx       # Card search
│   ├── trade.tsx        # Trade matching
│   ├── messages.tsx     # Conversations
│   └── profile.tsx      # User profile
├── auth/
│   ├── login.tsx
│   └── register.tsx
├── cards/[id].tsx
└── profile/[username].tsx
```

---

## 🌐 Web App

Built with Next.js App Router:

```
apps/web/src/app/
├── page.tsx             # Landing page
├── auth/login/          # Sign in
├── auth/register/       # Create account
├── auth/callback/       # OAuth callback
├── cards/               # Card search
├── cards/[id]/          # Card detail
├── profile/[username]/  # User profile
├── trade/               # Trade matching
├── chat/                # Conversations
└── onboarding/          # New user onboarding
```

---

## 🔧 Development

```bash
pnpm build          # Build all packages
pnpm lint           # Lint all packages
pnpm type-check     # TypeScript check all packages
```

---

*Pokémon and all related names are trademarks of Nintendo, Game Freak, and The Pokémon Company. TradeDex is not affiliated with or endorsed by these companies.*
