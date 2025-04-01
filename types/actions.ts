// Action Types
// These types are used for server actions and their responses

import type { Tweet, User, Media } from "./models";

// Tweet creation
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

// Tweet interactions
export interface LikeActionResponse {
    success?: boolean;
    error?: string;
}

export interface RetweetActionResponse {
    success?: boolean;
    error?: string;
}

// Media upload
export interface UploadResponse {
    success?: boolean;
    error?: string;
    urls?: string[];
}

// Profile actions
export interface UpdateProfileParams {
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar?: string;
    headerImage?: string;
}

export interface ProfileActionResponse {
    success?: boolean;
    error?: string;
    user?: User;
}

// Reply action params
export interface ReplyActionParams {
    content: string;
    parentId: string;
    images?: string[];
}
