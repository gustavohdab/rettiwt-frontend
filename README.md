# Twitter Clone Frontend (Next.js)

This is the frontend application for the Twitter Clone project, built with Next.js 15, React 19, Tailwind CSS, TypeScript, and Socket.IO Client. It consumes the [backend API](../backend/README.md) and connects to its WebSocket server to provide a modern, real-time Twitter-like user experience.

## Features

-   User Authentication (Login/Register) via NextAuth.js
-   Timeline View with Infinite Scrolling
-   Tweet Composition (Text, potentially media - check backend)
-   Tweet Interactions (Like, Retweet, Reply, Quote Tweet) with Optimistic UI Updates
-   Tweet Detail View with Threaded Replies
-   User Profiles (View, Follow/Unfollow, Edit with Image Uploads)
-   Bookmark Management (Save/View Bookmarked Tweets)
-   Search (Users, Tweets, Hashtags) with Recent Searches
-   Explore Page with Trending Hashtags and "Who to Follow" Suggestions
-   Clickable Hashtags
-   Real-time Updates:
    -   Timeline auto-updates with new tweets
    -   Follow/Unfollow status reflects instantly across components (e.g., profile buttons, suggestion list)
-   Responsive Design (Desktop & Mobile)
-   Server Components & Server Actions for Data Fetching/Mutations

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://react.dev/) 19
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.x
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/) 4.x
-   **Data Fetching/Mutations**: Next.js Server Actions
-   **Real-time**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
-   **State Management**: React `useState`, `useReducer`, `useOptimistic`, Context API (`SocketContext`)
-   **Forms**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)
-   **Date/Time**: `date-fns`, `react-timeago`
-   **Icons**: `@heroicons/react`
-   **Animation**: `framer-motion`
-   **HTTP Client**: `axios` (potentially used within Server Actions or API services)
-   **Linting/Formatting**: ESLint, Prettier
-   **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

-   Node.js (v18 or later, matching the backend)
-   npm or yarn or pnpm
-   A running instance of the [backend API & WebSocket server](../backend/README.md)

### Installation

1.  Clone the repository (if you haven't already).
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or yarn install / pnpm install
    ```
4.  Set up environment variables (see below).

### Environment Variables

Create a `.env.local` file in the `frontend` root directory by copying the example file:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

-   `NEXTAUTH_URL`: The base URL of your frontend application when running locally (e.g., `http://localhost:3000`).
-   `NEXTAUTH_SECRET`: A random secret string used to encrypt the NextAuth.js JWT. Generate one using `openssl rand -base64 32` or a similar method.
-   `NEXT_PUBLIC_API_URL`: The **full base URL** for the REST API of your **locally running backend** (e.g., `http://localhost:5000/api`). The `NEXT_PUBLIC_` prefix makes this available client-side.
-   `NEXT_PUBLIC_SOCKET_URL`: The **full base URL** for the WebSocket server of your **locally running backend** (e.g., `http://localhost:5000`). This should be the base URL, not including `/api`. The `NEXT_PUBLIC_` prefix makes this available client-side.

**Example `.env.local`:**

```env
# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_strong_random_secret_here

# Backend URLs
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

_Self-Note: The original README mentioned `NEXT_PUBLIC_API_URL_MEDIA`. Check if this is still needed or if media URLs are constructed differently now. Assuming base API URL is sufficient for now._

### Running Locally

Start the development server (using Next.js default, potentially with Turbopack if `dev` script uses `--turbopack`):

```bash
npm run dev
# or yarn dev / pnpm dev
```

Open `http://localhost:3000` (or the specified `NEXTAUTH_URL` port) in your browser.

## Key Architectural Concepts

-   **App Router**: Leverages Next.js App Router for file-based routing, layouts, and server/client component architecture.
-   **Server Components**: Used for primary data fetching on the server, reducing client-side JavaScript.
-   **Client Components**: Handle interactivity, state management, and lifecycle effects (e.g., WebSocket connections).
-   **Server Actions**: Used for all data mutations (creating tweets, following users, etc.) and some data fetching initiated from client components. Provides type safety and simplifies data flow.
-   **Optimistic UI**: React 19's `useOptimistic` hook is used for instant feedback on actions like liking or following, before server confirmation.
-   **WebSocket Integration**: A `SocketProvider` context manages the Socket.IO connection lifecycle and authentication. An internal event emitter (`SocketContext`) decouples raw socket events from component updates, allowing components to subscribe to specific application-level events (e.g., `new-tweet`, `user-followed`).
-   **Type System**: Relies on shared types (potentially in `/types` or a shared workspace package) to ensure consistency between frontend and backend, especially for API responses and UI models.

## Deployment (Vercel)

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Import Project:** Connect your Git repository to Vercel and import the project. Ensure Vercel uses the `frontend` directory as the **Root Directory**.
2.  **Configure Build Settings:** Vercel should automatically detect Next.js. No special build command is usually needed (`next build` is default).
3.  **Configure Environment Variables:** In the Vercel project settings ("Settings" > "Environment Variables"), add the following variables (use the "Secret" type for `NEXTAUTH_SECRET`):
    -   `NEXTAUTH_URL`: The **production URL** of your frontend deployment (e.g., `https://your-app-name.vercel.app`). Vercel usually provides `VERCEL_URL`, but setting this explicitly is safer for NextAuth.
    -   `NEXTAUTH_SECRET`: A **strong, unique secret** (generate a new one for production).
    -   `NEXT_PUBLIC_API_URL`: The **publicly accessible URL** of your deployed backend API (e.g., `https://your-backend-domain.com/api`).
    -   `NEXT_PUBLIC_SOCKET_URL`: The **publicly accessible URL** of your deployed backend WebSocket server (e.g., `https://your-backend-domain.com`). Ensure WebSocket connections (wss://) are supported and configured correctly on your backend deployment/load balancer.
4.  **Update `next.config.mjs` (if needed):** Ensure the `images.remotePatterns` includes the hostname(s) of your deployed backend API if it serves user-uploaded images directly, allowing Next.js Image Optimization.
5.  **Deploy:** Push your code to the connected Git branch (e.g., `main`) or trigger a manual deployment in Vercel.

## Project Structure Overview

-   `app/`: Core application structure (App Router).
    -   `(auth)/`: Routes related to authentication (Login, Register).
    -   `(dashboard)/`: Main application routes requiring authentication (Timeline, Profile, Settings, etc.).
        -   `layout.tsx`: Main application shell (sidebar, etc.).
        -   `page.tsx`: Home timeline page.
        -   `[username]/`: User profile pages.
        -   `status/[id]/`: Tweet detail pages.
        -   `explore/`: Explore page.
        -   `bookmarks/`: Bookmarks page.
        -   `settings/`: User settings pages.
    -   `api/auth/[...nextauth]/`: NextAuth.js API route.
    -   `layout.tsx`: Root layout.
    -   `global.css`: Global styles (Tailwind base, etc.).
-   `components/`: Reusable UI components (organized by feature or type).
    -   `auth/`: Authentication related components.
    -   `profile/`: Profile related components.
    -   `search/`: Search components.
    -   `timeline/`: Timeline/Tweet related components.
    -   `ui/`: Generic UI elements (Button, Modal, Input - potentially from a library like shadcn/ui later).
-   `lib/`: Utility functions, Server Actions, API service wrappers, constants, hooks.
    -   `actions/`: Server Actions (e.g., `tweet.actions.ts`, `user.actions.ts`).
    -   `api/`: API service layer (e.g., `user.service.ts` - might be minimal if Server Actions directly call backend).
    -   `hooks/`: Custom React hooks (e.g., `useSocket`, `useRecommendedUsers`).
    -   `utils/`: General utility functions.
-   `context/`: React Context providers (e.g., `SocketProvider.tsx`).
-   `public/`: Static assets.
-   `types/`: Shared TypeScript definitions.
-   `middleware.ts`: Next.js middleware (e.g., for route protection).
-   `next.config.mjs`: Next.js configuration.
-   `tailwind.config.ts`: Tailwind CSS configuration.
-   `tsconfig.json`: TypeScript configuration.
-   `package.json`: Dependencies and scripts.

## License

MIT
