import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import UserService from "@/lib/api/services/user.service";
import TweetService from "@/lib/api/services/tweet.service";
import UserMediaList from "@/components/profile/UserMediaList";
interface ProfileMediaPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function ProfileMediaPage({ params }: ProfileMediaPageProps) {
    const { username } = await params;

    // Fetch the user profile
    const userResponse = await UserService.getUserProfile(username);

    if (userResponse.status !== "success" || !userResponse.data) {
        notFound();
    }

    const user = userResponse.data.user;

    // Get current authenticated user for checking follow status
    const session = await getServerSession(authOptions);
    const currentUserResponse = await UserService.getCurrentUser(session?.accessToken);

    let isFollowing = false;
    if (currentUserResponse.status === "success" && currentUserResponse.data) {
        const currentUser = currentUserResponse.data.user;
        // Check if current user follows this profile
        if (Array.isArray(currentUser.following)) {
            isFollowing = currentUser.following.some((followedUser) =>
                typeof followedUser === "string"
                    ? followedUser === user._id
                    : followedUser._id === user._id
            );
        }
    }

    // Fetch initial media tweets for the user
    const mediaResponse = await TweetService.getUserMediaTweets(username, 1);
    const initialMediaTweets =
        mediaResponse.status === "success" && mediaResponse.data
            ? mediaResponse.data.tweets
            : [];
    const pagination =
        mediaResponse.status === "success" && mediaResponse.data
            ? mediaResponse.data.pagination
            : undefined;

    return (
        <div>
            <ProfileHeader user={user} isFollowing={isFollowing} />
            <ProfileTabs username={username} activeTab="media" />
            <UserMediaList
                username={username}
                initialMediaTweets={initialMediaTweets}
                pagination={pagination}
            />
        </div>
    );
} 