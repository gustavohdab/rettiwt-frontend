"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TweetService from "@/lib/api/services/tweet.service";
import { ApiTypes } from "@/types";
import { revalidatePath } from "next/cache";

export async function getTimeline(page = 1, limit = 10) {
    try {
        const session = await getServerSession(authOptions);

        const response = await TweetService.getTimeline(
            page,
            limit,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error("Error getting timeline:", error);
        return {
            status: "error",
            message: "Failed to load timeline",
        };
    }
}

export async function getUserTweets(username: string, page = 1, limit = 10) {
    try {
        const session = await getServerSession(authOptions);

        const response = await TweetService.getUserTweets(
            username,
            page,
            limit,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error(`Error getting tweets for user ${username}:`, error);
        return {
            status: "error",
            message: "Failed to load tweets",
        };
    }
}

export async function getUserReplies(username: string, page = 1, limit = 10) {
    try {
        const session = await getServerSession(authOptions);

        const response = await TweetService.getUserReplies(
            username,
            page,
            limit,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error(`Error getting replies for user ${username}:`, error);
        return {
            status: "error",
            message: "Failed to load replies",
        };
    }
}

export async function getUserMediaTweets(
    username: string,
    page = 1,
    limit = 10
) {
    try {
        const session = await getServerSession(authOptions);

        const response = await TweetService.getUserMediaTweets(
            username,
            page,
            limit,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error(
            `Error getting media tweets for user ${username}:`,
            error
        );
        return {
            status: "error",
            message: "Failed to load media tweets",
        };
    }
}

export async function getUserLikedTweets(
    username: string,
    page = 1,
    limit = 10
) {
    try {
        const session = await getServerSession(authOptions);

        const response = await TweetService.getUserLikedTweets(
            username,
            page,
            limit,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error(
            `Error getting liked tweets for user ${username}:`,
            error
        );
        return {
            status: "error",
            message: "Failed to load liked tweets",
        };
    }
}

export async function getTweet(id: string) {
    try {
        const session = await getServerSession(authOptions);

        const response = await TweetService.getTweet(id, session?.accessToken);

        return response;
    } catch (error) {
        console.error(`Error getting tweet ${id}:`, error);
        return {
            status: "error",
            message: "Failed to load tweet",
        };
    }
}
