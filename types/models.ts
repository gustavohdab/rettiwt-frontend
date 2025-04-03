// UI Models
// These are the types used throughout the frontend application
// They are derived from API types but adapted for UI requirements

import type {
    Media as ApiMedia,
    TimelineResponse as ApiTimelineResponse,
    Tweet as ApiTweet,
    User as ApiUser,
    PaginationInfo,
} from "./api";

import * as ApiTypes from "./api";

// User model for UI
export interface User extends Omit<ApiUser, "following" | "followers"> {
    following: User[];
    followers: User[];
}

// Media model for UI
export type Media = ApiMedia;

// Tweet model for UI
export interface Tweet
    extends Omit<
        ApiTweet,
        | "author"
        | "likes"
        | "retweets"
        | "quotedTweet"
        | "inReplyTo"
        | "mentions"
    > {
    author: User;
    likes: User[];
    retweets: User[];
    quotedTweet?: Tweet;
    inReplyTo?: Tweet;
    mentions: User[];
    // UI specific properties
    liked?: boolean;
    retweeted?: boolean;
    isRetweet?: boolean;
    originalTweet?: Tweet;
    retweetedBy?: User;
    bookmarked?: boolean;
}

// Timeline response for UI
export interface TimelineResponse {
    tweets: Tweet[];
    pagination: PaginationInfo;
}

// Tweet thread response for UI
export interface TweetThreadResponse {
    tweet: Tweet;
    parentTweet?: Tweet;
    replies: Tweet[];
    pagination: PaginationInfo;
}

// Notification Model (for UI)
export interface Notification {
    _id: string;
    recipient: string;
    sender: {
        _id: string;
        username: string;
        name: string;
        avatar: string;
    };
    type: ApiTypes.NotificationType;
    tweetId?: string;
    tweetSnippet?: string;
    read: boolean;
    createdAt: string; // Keep as string for simplicity, format in UI
}

export interface NotificationPaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
    unreadCount: number;
}

// Type guard to check if an object is a User (not a string ID)
export function isUser(obj: any): obj is User {
    return obj && typeof obj !== "string" && typeof obj._id === "string";
}

// Helper function to normalize a user from API to UI model
export function normalizeUser(user: ApiUser | string): User {
    if (typeof user === "string") {
        // Return a partial user object with just the ID
        // This should be used only in emergency fallback situations
        return {
            _id: user,
            username: "unknown",
            name: "Unknown User",
            email: "",
            bio: "",
            avatar: "",
            headerImage: "",
            location: "",
            website: "",
            following: [],
            followers: [],
            verified: false,
            createdAt: "",
            updatedAt: "",
        };
    }

    return {
        ...user,
        following: Array.isArray(user.following)
            ? user.following.map((u) => normalizeUser(u))
            : [],
        followers: Array.isArray(user.followers)
            ? user.followers.map((u) => normalizeUser(u))
            : [],
    };
}

// Helper function to normalize a tweet from API to UI model
export function normalizeTweet(tweet: ApiTweet): Tweet {
    const author = normalizeUser(tweet.author);

    const likes = Array.isArray(tweet.likes)
        ? tweet.likes.map((u) => normalizeUser(u))
        : [];

    const retweets = Array.isArray(tweet.retweets)
        ? tweet.retweets.map((u) => normalizeUser(u))
        : [];

    const mentions = Array.isArray(tweet.mentions)
        ? tweet.mentions.map((u) => normalizeUser(u))
        : [];

    // Handle nested tweets (quoted or reply)
    const quotedTweet = tweet.quotedTweet
        ? typeof tweet.quotedTweet === "string"
            ? undefined // Skip if just an ID
            : normalizeTweet(tweet.quotedTweet)
        : undefined;

    const inReplyTo = tweet.inReplyTo
        ? typeof tweet.inReplyTo === "string"
            ? undefined // Skip if just an ID
            : normalizeTweet(tweet.inReplyTo)
        : undefined;

    return {
        ...tweet,
        author,
        likes,
        retweets,
        mentions,
        quotedTweet,
        inReplyTo,
    };
}

// Helper function to normalize timeline response
export function normalizeTimelineResponse(
    response: ApiTimelineResponse
): TimelineResponse {
    return {
        tweets: response.tweets.map(normalizeTweet),
        pagination: response.pagination,
    };
}

export interface TrendingHashtag {
    hashtag: string;
    count: number;
    tweetCount: number;
    engagementScore: number;
}

export interface RecommendedUser extends User {
    isFollowing?: boolean;
}

// Type for user mention suggestions
export interface SuggestedUser {
    _id: string;
    username: string;
    name: string;
    avatar: string;
}

export function normalizeHashtagTweets(data: ApiTypes.HashtagTweetsResponse): {
    hashtag: string;
    tweets: Tweet[];
    pagination: PaginationInfo;
} {
    return {
        hashtag: data.hashtag,
        tweets: data.tweets.map(normalizeTweet),
        pagination: data.pagination,
    };
}

export function normalizeTrendingHashtags(data: ApiTypes.TrendingResponse): {
    trendingHashtags: TrendingHashtag[];
} {
    return {
        trendingHashtags: data.trendingHashtags.map(
            (hashtag: ApiTypes.TrendingHashtag) => ({
                ...hashtag,
            })
        ),
    };
}

export function normalizePopularTweets(data: ApiTypes.PopularTweetsResponse): {
    tweets: Tweet[];
    pagination: PaginationInfo;
} {
    return {
        tweets: data.tweets.map(normalizeTweet),
        pagination: data.pagination,
    };
}

export function normalizeRecommendedUsers(
    data: ApiTypes.RecommendedUsersResponse
): {
    users: RecommendedUser[];
} {
    return {
        users: data.users.map(normalizeUser) as RecommendedUser[],
    };
}

export function normalizeNotification(
    apiNotification: ApiTypes.Notification
): Notification {
    return {
        _id: apiNotification._id,
        recipient: apiNotification.recipient,
        sender: {
            _id: apiNotification.sender._id,
            username: apiNotification.sender.username,
            name: apiNotification.sender.name,
            avatar: apiNotification.sender.avatar, // Assumes avatar is already a path or URL
        },
        type: apiNotification.type,
        tweetId: apiNotification.tweet,
        tweetSnippet: apiNotification.tweetSnippet,
        read: apiNotification.read,
        createdAt: apiNotification.createdAt,
    };
}
