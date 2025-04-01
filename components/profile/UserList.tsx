import { User } from "@/types/models";
import UserCard from "@/components/user/UserCard";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface UserListProps {
    users: User[];
    listType: "followers" | "following";
    username: string;
    isLoading?: boolean;
    error?: string;
    currentUser?: User | null;
}

export default function UserList({
    users,
    listType,
    username,
    isLoading = false,
    error,
    currentUser,
}: UserListProps) {
    const title = listType === "followers" ? "Followers" : "Following";

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <Link href={`/${username}`} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                    <Link href={`/${username}`} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
                <div className="p-4 text-center text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <Link href={`/${username}`} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">{title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">@{username}</p>
                    </div>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    {listType === "followers"
                        ? "This account doesn't have any followers yet."
                        : "This account isn't following anyone."}
                </div>
            ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            currentUserId={currentUser?._id}
                            showFollowButton={true}
                            isFollowing={currentUser?.following?.some(f => f._id === user._id) || false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 