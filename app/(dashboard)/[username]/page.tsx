import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import UserTweetList from "@/components/profile/UserTweetList";
import TweetService from "@/lib/api/services/tweet.service";
import UserService from "@/lib/api/services/user.service";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

// Dynamically generate metadata for the profile page
export async function generateMetadata({
    params,
}: ProfilePageProps): Promise<Metadata> {
    const { username } = await params;
    const userResponse = await UserService.getUserProfile(username);

    if (userResponse.status !== "success" || !userResponse.data?.user) {
        return {
            title: "User not found",
        };
    }

    const { user } = userResponse.data;

    return {
        title: `${user.name} (@${user.username}) | Twitter Clone`,
        description: user.bio || `Check out ${user.name}'s profile on Twitter Clone`,
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;

    // Fetch the user profile
    const userResponse = await UserService.getUserProfile(username);

    if (userResponse.status !== "success" || !userResponse.data) {
        notFound();
    }

    const user = userResponse.data.user;
    const tweetCount = userResponse.data.tweetCount || 0;

    // Get current authenticated user for checking follow status
    const session = await getServerSession(authOptions);
    const currentUserResponse = await UserService.getCurrentUser(session?.accessToken);

    let isFollowing = false;
    let isCurrentUser = false;

    if (currentUserResponse.status === "success" && currentUserResponse.data) {
        const currentUser = currentUserResponse.data.user;
        isCurrentUser = currentUser._id === user._id;

        // Check if current user follows this profile
        if (Array.isArray(currentUser.following)) {
            isFollowing = currentUser.following.some((followedUser) =>
                typeof followedUser === "string"
                    ? followedUser === user._id
                    : followedUser._id === user._id
            );
        }
    }

    // Fetch initial tweets for the user
    const tweetsResponse = await TweetService.getUserTweets(username, 1);
    const initialTweets =
        tweetsResponse.status === "success" && tweetsResponse.data
            ? tweetsResponse.data.tweets
            : [];
    const pagination =
        tweetsResponse.status === "success" && tweetsResponse.data
            ? tweetsResponse.data.pagination
            : undefined;

    return (
        <div>
            <ProfileHeader
                user={user}
                isFollowing={isFollowing}
                isCurrentUser={isCurrentUser}
                tweetCount={tweetCount}
            />
            <ProfileTabs
                username={username}
                tweetCount={tweetCount}
                activeTab="tweets"
            />
            <UserTweetList
                username={username}
                initialTweets={initialTweets}
                pagination={pagination}
            />
        </div>
    );
} 