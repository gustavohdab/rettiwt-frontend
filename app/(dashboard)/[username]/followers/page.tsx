import UserList from "@/components/profile/UserList";
import { getUserFollowers } from "@/lib/actions/user-data.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserService from "@/lib/api/services/user.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { User } from "@/types/models";

interface FollowersPageProps {
    params: Promise<{
        username: string;
    }>;
}

export async function generateMetadata({ params }: FollowersPageProps): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `People following @${username} | Twitter Clone`,
        description: `People who follow @${username} on Twitter Clone`,
    };
}

export default async function FollowersPage({ params }: FollowersPageProps) {
    const { username } = await params;

    try {
        // Verify user exists
        const userResponse = await UserService.getUserProfile(username);

        if (userResponse.status !== "success" || !userResponse.data) {
            return notFound();
        }

        // Get current user for follow status checking
        const session = await getServerSession(authOptions);
        const currentUserResponse = await UserService.getCurrentUser(session?.accessToken);
        const currentUser = currentUserResponse.status === "success" && currentUserResponse.data
            ? currentUserResponse.data.user
            : null;

        // Get followers
        const followersResponse = await getUserFollowers(username);

        if (followersResponse.status === "error") {
            return (
                <UserList
                    users={[]}
                    listType="followers"
                    username={username}
                    error={followersResponse.message || "Failed to load followers"}
                    currentUser={currentUser as User}
                />
            );
        }

        // Safely access followers data
        const followers =
            'data' in followersResponse &&
                followersResponse.data &&
                'followers' in followersResponse.data
                ? followersResponse.data.followers
                : [];

        return (
            <UserList
                users={followers}
                listType="followers"
                username={username}
                currentUser={currentUser as User}
            />
        );
    } catch (error) {
        console.error("Error loading followers:", error);
        return (
            <UserList
                users={[]}
                listType="followers"
                username={username}
                error="An unexpected error occurred"
                currentUser={null}
            />
        );
    }
} 