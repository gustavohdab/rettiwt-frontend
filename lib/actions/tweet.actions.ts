"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TweetService from "@/lib/api/services/tweet.service";
import type {
    CreateTweetParams,
    TweetActionResponse,
    LikeActionResponse,
    RetweetActionResponse,
    Tweet,
    Media,
    ReplyActionParams,
} from "@/types";

// Helper function to determine media type based on URL
function determineMediaType(url: string): "image" | "video" | "gif" {
    const extension = url.split(".").pop()?.toLowerCase();

    if (extension === "mp4" || extension === "mov" || extension === "webm") {
        return "video";
    } else if (extension === "gif") {
        return "gif";
    } else {
        return "image"; // Default to image for all other types
    }
}

export async function createTweet(
    params: CreateTweetParams
): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        // Convert image URLs to the Media format expected by the backend
        const media: Media[] = params.images
            ? params.images.map((url) => ({
                  type: determineMediaType(url),
                  url: url,
                  altText: "",
              }))
            : [];

        const response = await TweetService.createTweet(
            {
                content: params.content,
                media: media,
                inReplyToId: params.parentId,
            },
            session?.accessToken
        );

        revalidatePath("/feed");

        if (params.parentId) {
            // If this is a reply, revalidate the parent tweet page too
            revalidatePath(`/tweet/${params.parentId}`);
        }

        if (response.status === "success" && response.data?.tweet) {
            return { success: true, data: response.data.tweet };
        } else {
            return { error: response.message || "Failed to create tweet" };
        }
    } catch (error) {
        console.error("Error creating tweet:", error);
        return { error: "Failed to create tweet" };
    }
}

export async function deleteTweet(id: string): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const response = await TweetService.deleteTweet(
            id,
            session?.accessToken
        );

        revalidatePath("/feed");
        revalidatePath(`/tweet/${id}`);
        revalidatePath(`/profile`);

        if (response.status === "success") {
            return { success: true };
        } else {
            return { error: response.message || "Failed to delete tweet" };
        }
    } catch (error) {
        console.error("Error deleting tweet:", error);
        return { error: "Failed to delete tweet" };
    }
}

export async function likeTweet(tweetId: string): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const response = await TweetService.likeTweet(
            tweetId,
            session?.accessToken
        );

        // Revalidate relevant paths
        revalidatePath(`/tweet/${tweetId}`);
        revalidatePath("/feed");

        if (response.status === "success" && response.data?.tweet) {
            return { success: true, data: response.data.tweet };
        } else {
            return { error: response.message || "Failed to like tweet" };
        }
    } catch (error) {
        console.error("Error liking tweet:", error);
        return { error: "Failed to like tweet" };
    }
}

export async function unlikeTweet(
    tweetId: string
): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const response = await TweetService.unlikeTweet(
            tweetId,
            session?.accessToken
        );

        // Revalidate relevant paths
        revalidatePath(`/tweet/${tweetId}`);
        revalidatePath("/feed");

        if (response.status === "success" && response.data?.tweet) {
            return { success: true, data: response.data.tweet };
        } else {
            return { error: response.message || "Failed to unlike tweet" };
        }
    } catch (error) {
        console.error("Error unliking tweet:", error);
        return { error: "Failed to unlike tweet" };
    }
}

export async function retweetTweet(
    tweetId: string
): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const response = await TweetService.retweetTweet(
            tweetId,
            session?.accessToken
        );

        // Revalidate relevant paths
        revalidatePath(`/tweet/${tweetId}`);
        revalidatePath("/feed");

        if (response.status === "success" && response.data?.tweet) {
            return { success: true, data: response.data.tweet };
        } else {
            return { error: response.message || "Failed to retweet tweet" };
        }
    } catch (error) {
        console.error("Error retweeting tweet:", error);
        return { error: "Failed to retweet tweet" };
    }
}

export async function unretweetTweet(
    tweetId: string
): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const response = await TweetService.unretweetTweet(
            tweetId,
            session?.accessToken
        );

        // Revalidate relevant paths
        revalidatePath(`/tweet/${tweetId}`);
        revalidatePath("/feed");

        if (response.status === "success" && response.data?.tweet) {
            return { success: true, data: response.data.tweet };
        } else {
            return { error: response.message || "Failed to unretweet tweet" };
        }
    } catch (error) {
        console.error("Error unretweeting tweet:", error);
        return { error: "Failed to unretweet tweet" };
    }
}

export async function createReply(
    params: ReplyActionParams
): Promise<TweetActionResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        // Convert image URLs to the Media format expected by the backend
        const media: Media[] = params.images
            ? params.images.map((url) => ({
                  type: determineMediaType(url),
                  url: url,
                  altText: "",
              }))
            : [];

        // Use the existing createTweet service method with inReplyToId
        const response = await TweetService.createTweet(
            {
                content: params.content,
                media: media,
                inReplyToId: params.parentId,
            },
            session?.accessToken
        );

        // Revalidate the tweet detail page to show the new reply
        revalidatePath(`/tweet/${params.parentId}`);

        // Also revalidate the feed
        revalidatePath("/feed");

        if (response.status === "success" && response.data?.tweet) {
            return { success: true, data: response.data.tweet };
        } else {
            return { error: response.message || "Failed to create reply" };
        }
    } catch (error) {
        console.error("Error creating reply:", error);
        return { error: "Failed to create reply" };
    }
}
