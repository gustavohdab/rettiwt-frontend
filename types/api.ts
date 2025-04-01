// API Types
// This file contains types that match exactly what the backend API returns
// DO NOT modify these types unless the backend API changes

// Common API Response structure
export interface ApiResponse<T> {
    status: "success" | "error";
    data?: T;
    message?: string;
}

// Pagination info returned by API
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// User-related types
export interface User {
    _id: string;
    username: string;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    headerImage: string;
    location: string;
    website: string;
    following: User[] | string[];
    followers: User[] | string[];
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    tweetCount?: number;
}

// Authentication types
export interface AuthResponse {
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    name: string;
}

// Tweet-related types
export interface Tweet {
    _id: string;
    content: string;
    author: User | string;
    media: Media[];
    likes: User[] | string[];
    retweets: User[] | string[];
    quotedTweet?: Tweet | string;
    inReplyTo?: Tweet | string;
    engagementCount: {
        likes: number;
        retweets: number;
        replies: number;
        quotes: number;
    };
    hashtags: string[];
    mentions: User[] | string[];
    createdAt: string;
    updatedAt: string;
}

export interface Media {
    type: "image" | "video" | "gif";
    url: string;
    altText?: string;
}

export interface CreateTweetRequest {
    content: string;
    media?: Media[];
    quotedTweetId?: string;
    inReplyToId?: string;
}

// Timeline responses
export interface TimelineResponse {
    tweets: Tweet[];
    pagination: PaginationInfo;
}

// Profile update
export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
}

// Search types
export interface SearchRequest {
    query: string;
    type?: "tweet" | "user" | "hashtag";
    page?: number;
    limit?: number;
}

export interface SearchResponse {
    tweets?: Tweet[];
    users?: User[];
    hashtags?: string[];
    pagination: PaginationInfo;
}

// Thread response from API
export interface TweetThreadResponse {
    tweet: Tweet;
    parentTweet?: Tweet;
    replies: Tweet[];
    pagination: PaginationInfo;
}

export interface TrendingHashtag {
    hashtag: string;
    count: number;
    tweetCount: number;
    engagementScore: number;
}

export interface TrendingResponse {
    trendingHashtags: TrendingHashtag[];
}

export interface PopularTweetsResponse {
    tweets: Tweet[];
    pagination: PaginationInfo;
}

export interface HashtagTweetsResponse {
    hashtag: string;
    tweets: Tweet[];
    pagination: PaginationInfo;
}

export interface RecommendedUsersResponse {
    users: User[];
}
