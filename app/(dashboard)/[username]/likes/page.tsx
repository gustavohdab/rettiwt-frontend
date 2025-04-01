import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import UserLikesList from "@/components/profile/UserLikesList";
import TweetService from "@/lib/api/services/tweet.service";
import UserService from "@/lib/api/services/user.service";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface ProfileLikesPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function ProfileLikesPage({
    params,
}: ProfileLikesPageProps) {
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

    // Fetch initial likes for the user
    const likesResponse = await TweetService.getUserLikedTweets(username, 1);
    const initialLikes =
        likesResponse.status === "success" && likesResponse.data
            ? likesResponse.data.tweets
            : [];
    const pagination =
        likesResponse.status === "success" && likesResponse.data
            ? likesResponse.data.pagination
            : undefined;

    return (
        <div>
            <ProfileHeader user={user} isFollowing={isFollowing} />
            <ProfileTabs username={username} activeTab="likes" />
            <UserLikesList
                username={username}
                initialLikes={initialLikes}
                pagination={pagination}
            />
        </div>
    );
} 