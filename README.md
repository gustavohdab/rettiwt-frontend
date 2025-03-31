# Twitter Clone

A modern Twitter clone built with Next.js 15 and React 19, showcasing the latest features and best practices.

## Features

-   Server Components for data-heavy views
-   Real-time updates for timeline and notifications
-   Mobile-first responsive design
-   Authentication with Next Auth
-   MongoDB for database with Mongoose
-   Clean component architecture

## Tech Stack

### Frontend

-   Next.js 15
-   React 19
-   TypeScript
-   Tailwind CSS
-   React Query
-   Framer Motion

### Backend

-   Next.js API Routes
-   MongoDB
-   Authentication with JWT
-   WebSockets for real-time updates

## Project Structure

The project follows a feature-based directory structure using the Next.js App Router:

```
twitter-clone/
├── lib/
│   ├── api/
│   │   ├── axios.ts                 # Base axios config
│   │   ├── types.ts                 # API response types
│   │   └── services/
│   │       ├── auth.service.ts      # Auth endpoints
│   │       ├── tweet.service.ts     # Tweet endpoints
│   │       └── user.service.ts      # User endpoints
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth hook
│   │   ├── useTweets.ts             # Tweet data hook
│   │   └── useUsers.ts              # User data hook
│   └── context/
│       └── AuthContext.tsx          # Auth state management
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx            # Login form (Client)
│   │   └── RegisterForm.tsx         # Registration form (Client)
│   ├── tweet/
│   │   ├── TweetForm.tsx            # Create tweet (Client)
│   │   ├── TweetList.tsx            # List of tweets (Server)
│   │   └── TweetCard.tsx            # Tweet display (Client)
│   └── layout/
│       ├── AppShell.tsx             # Main layout wrapper
│       └── Navbar.tsx               # Navigation bar (Client)
└── app/
    ├── providers.tsx                # All context providers
    ├── (auth)/                      # Auth route group
    │   ├── login/page.tsx           # Login page
    │   └── register/page.tsx        # Register page
    ├── feed/
    │   └── page.tsx                 # Timeline (Server Component)
    └── [username]/
        └── page.tsx                 # User profile (Server Component)
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
    - Copy `.env.example` to `.env.local` and fill in the values
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

This project uses a milestone-based development approach:

1. Project Setup & Authentication
2. User Profiles
3. Tweet Creation & Timeline
4. Interactions (likes, retweets, replies)
5. Search & Discovery
6. Notifications & Real-time
7. Direct Messages

## License

MIT
