// Client-Side Types
// These types are used specifically for client components and hooks

import type { Tweet, User } from "./models";

// Optimistic update types
export type OptimisticTweetUpdate = Partial<Tweet>;

export interface TweetOptimisticState {
    isLiked: boolean;
    likeCount: number;
    isRetweeted: boolean;
    retweetCount: number;
}

// Hook parameter types
export interface UseTweetParams {
    id: string;
    initialData?: Tweet;
}

export interface UseTimelineParams {
    page?: number;
    limit?: number;
    initialData?: Tweet[];
}

export interface UseUserTweetsParams {
    username: string;
    page?: number;
    limit?: number;
}

// Handlers for tweet interactions
export interface TweetActionHandlers {
    handleLike: () => Promise<void>;
    handleRetweet: () => Promise<void>;
    handleReply: () => void;
    handleDelete?: () => Promise<void>;
}

// Component Props
export interface TweetCardProps {
    tweet: Tweet;
    currentUserId: string;
    withBorder?: boolean;
}

export interface TweetComposerProps {
    placeholder?: string;
    parentId?: string;
    onSuccess?: (tweet: Tweet) => void;
}

export interface UserProfileProps {
    user: User;
    currentUserId?: string;
}
