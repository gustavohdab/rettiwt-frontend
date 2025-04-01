# Twitter Clone Frontend (Next.js)

This is the frontend application for the Twitter Clone project, built with Next.js 15, React 19, Tailwind CSS, and TypeScript. It interacts with the [backend API](../backend/README.md) to provide a Twitter-like user experience.

## Features

-   User Authentication (Login/Register) via NextAuth.js
-   View user timelines, profiles, and individual tweets
-   Create, like, reply to, and retweet tweets
-   Follow/unfollow users
-   Search for users, tweets, and hashtags
-   Update user profiles (avatar, header, bio)
-   Bookmark tweets
-   View trends and follow suggestions
-   Optimistic UI updates for actions like following/liking (using React 19 `useOptimistic`)

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) 15 (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [React](https://react.dev/) 19
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **State Management**: React Context / Server Components / `useOptimistic`
-   **Data Fetching**: React Server Components / `fetch` / Axios
-   **Forms**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)
-   **Linting**: ESLint
-   **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

-   Node.js (Version specified in `.nvmrc` or compatible with Next.js 15, e.g., 18+)
-   npm or yarn or pnpm
-   A running instance of the [backend API](../backend/README.md)

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

-   `NEXTAUTH_URL`: The base URL of your application when running locally.
-   `NEXTAUTH_SECRET`: A random string
-   `NEXT_PUBLIC_API_URL`: The full URL to your **locally running backend API** (e.g., `http://localhost:5000/api`). The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser.
-   `NEXT_PUBLIC_API_URL_MEDIA`: The full URL to your **locally running backend API** (e.g., `http://localhost:5000`). The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser.

**Example `.env.local**:\*\*

```env
# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated_secret_string_here

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_URL_MEDIA=http://localhost:5000
```

### Running Locally

Start the development server (with Turbopack):

```bash
npm run dev
# or yarn dev / pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or the specified port) in your browser.

## Deployment (Vercel)

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Import Project:** Connect your Git repository to Vercel and import the project. Ensure Vercel uses the `frontend` directory as the Root Directory. Vercel will automatically detect Next.js and configure the build settings.
2.  **Configure Environment Variables:** In the Vercel project settings ("Settings" > "Environment Variables"), add the following variables (use the "Secret" type for `NEXTAUTH_SECRET`):
    -   `NEXTAUTH_URL`: The **production URL** of your frontend deployment (e.g., `https://your-app-name.vercel.app`). Vercel often sets `VERCEL_URL`, but setting this explicitly is recommended for NextAuth.
    -   `NEXTAUTH_SECRET`: A **strong, unique secret** (different from your local one is recommended). Generate a new one for production.
    -   `NEXT_PUBLIC_API_URL`: The **publicly accessible URL** of your deployed backend API (e.g., `https://your-backend-domain.railway.app/api`).
3.  **Update `next.config.ts`:** Ensure the `images.remotePatterns` in `next.config.ts` includes the hostname of your deployed backend API to allow image optimization for uploaded user content.
4.  **Deploy:** Push your code to the connected Git branch (e.g., `main`) or trigger a manual deployment in Vercel.

## Project Structure (Brief Overview)

-   `app/`: Contains the core application routes, pages, layouts, and components following the Next.js App Router structure.
-   `components/`: Shared UI components used across the application (buttons, modals, etc.).
-   `lib/`: Utility functions, API service wrappers, constants, etc.
-   `public/`: Static assets accessible directly via the root URL.
-   `types/`: Shared TypeScript type definitions.
-   `middleware.ts`: Next.js middleware for handling route protection or modifications.
-   `next.config.ts`: Next.js configuration file.

## License

(Specify your license here, e.g., MIT)
