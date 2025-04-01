import UserList from "@/components/profile/UserList";
import { getUserFollowing } from "@/lib/actions/user-data.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserService from "@/lib/api/services/user.service";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { User } from "@/types/models";

interface FollowingPageProps {
    params: Promise<{
        username: string;
    }>;
}

export async function generateMetadata({ params }: FollowingPageProps): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `People @${username} follows | Twitter Clone`,
        description: `People who @${username} follows on Twitter Clone`,
    };
}

export default async function FollowingPage({ params }: FollowingPageProps) {
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

        // Get following
        const followingResponse = await getUserFollowing(username);

        if (followingResponse.status === "error") {
            return (
                <UserList
                    users={[]}
                    listType="following"
                    username={username}
                    error={followingResponse.message || "Failed to load following"}
                    currentUser={currentUser as User}
                />
            );
        }

        // Safely access following data
        const following =
            'data' in followingResponse &&
                followingResponse.data &&
                'following' in followingResponse.data
                ? followingResponse.data.following
                : [];

        return (
            <UserList
                users={following}
                listType="following"
                username={username}
                currentUser={currentUser as User}
            />
        );
    } catch (error) {
        console.error("Error loading following:", error);
        return (
            <UserList
                users={[]}
                listType="following"
                username={username}
                error="An unexpected error occurred"
                currentUser={null}
            />
        );
    }
} 