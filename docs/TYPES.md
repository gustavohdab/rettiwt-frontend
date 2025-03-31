# Twitter Clone - Type System Guide

This project uses a centralized type system to ensure consistency, enhance type safety, and properly support Next.js server and client components.

## Type System Architecture

The type system is organized into several layers:

```
twitter-clone/
├── types/
│   ├── api.ts          # Raw API types matching backend exactly
│   ├── models.ts       # Refined frontend models for UI use
│   ├── actions.ts      # Types for server actions
│   ├── client.ts       # Client-specific types (for useOptimistic etc.)
│   └── index.ts        # Re-exports for convenience
```

## Type Categories

### API Types (`/types/api.ts`)

These types **exactly** match the structure of data returned from the backend API. They include union types like `User | string` which reflect the backend's ability to return either populated objects or just IDs.

```typescript
// Example API type
export interface Tweet {
    _id: string;
    content: string;
    author: User | string; // Can be either a User object or a string ID
    // ...
}
```

**DO NOT modify these types unless the backend API changes.**

### UI Models (`/types/models.ts`)

These are refined types suitable for use throughout the frontend, especially in UI components. They resolve ambiguities like the `string | Object` unions found in API types.

```typescript
// Example UI model
export interface Tweet extends Omit<ApiTweet, "author" | "likes"> {
    author: User; // Always a User object in the UI
    likes: User[]; // Always an array of User objects
    // Additional UI-specific properties
    liked?: boolean;
}
```

This layer also provides utility functions to transform API types to UI models:

-   `normalizeUser`: Converts API User to UI User
-   `normalizeTweet`: Converts API Tweet to UI Tweet
-   `normalizeTimelineResponse`: Converts API TimelineResponse to UI TimelineResponse

### Server Action Types (`/types/actions.ts`)

These types are specifically for server actions (request params and responses).

```typescript
// Example action types
export interface CreateTweetParams {
    content: string;
    images?: string[];
    parentId?: string;
}

export interface TweetActionResponse {
    success?: boolean;
    error?: string;
    data?: Tweet;
}
```

### Client Types (`/types/client.ts`)

These types are used for client components and hooks, particularly those involving optimistic updates.

```typescript
// Example client types
export interface TweetOptimisticState {
    isLiked: boolean;
    likeCount: number;
    isRetweeted: boolean;
    retweetCount: number;
}

export interface TweetCardProps {
    tweet: Tweet;
    currentUserId: string;
    withBorder?: boolean;
}
```

## Usage Guidelines

### Importing Types

Always import types from the central `/types` directory:

```typescript
// GOOD
import { Tweet, User, TweetCardProps } from "@/types";

// BAD
import { Tweet } from "@/lib/api/types";
```

For API types that might conflict with UI models, use the namespace:

```typescript
import { ApiTypes, Tweet } from "@/types";

// Now you can use both
const apiTweet: ApiTypes.Tweet = {
    /* ... */
};
const uiTweet: Tweet = {
    /* ... */
};
```

### React Server Components (RSC)

-   In server components, you can safely import and use all types
-   In client components, you should primarily use types from `models.ts` and `client.ts`

### API Services

API services should:

1. Accept and return API types as parameters
2. Transform API responses to UI models using the normalization functions
3. Include proper error handling

Example:

```typescript
// In an API service
async getTweet(id: string): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> {
    try {
        const response = await api.get<ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>>(
            `/tweets/${id}`
        );

        // Transform to UI model
        if (response.data.status === "success" && response.data.data?.tweet) {
            return {
                status: "success",
                data: {
                    tweet: normalizeTweet(response.data.data.tweet)
                }
            };
        }

        return response.data as any;
    } catch (error) {
        // Error handling
    }
}
```

### Optimistic Updates

For optimistic updates, use the `useOptimistic` hook with types from `client.ts`:

```typescript
import { useOptimistic } from "react";
import { Tweet, OptimisticTweetUpdate } from "@/types";

// In a client component
const [optimisticTweet, addOptimisticTweet] = useOptimistic<
    Tweet,
    OptimisticTweetUpdate
>(tweet, (state, update) => ({
    ...state,
    ...update,
}));
```

## ESLint Rules

We enforce type consistency with custom ESLint rules that prevent defining core entity types (User, Tweet, etc.) in component files.

## Type Transformation Flow

```
API Response → API Types → Normalization → UI Models → Components
```

This ensures a clean data flow with proper type safety throughout the application.

## Best Practices

1. **Never define domain entity types in component files**
2. **Always use the normalization functions when consuming API data**
3. **Keep API types synchronized with the backend**
4. **Use correct import paths from the central types directory**
5. **Leverage TypeScript features like type guards and discriminated unions**
