import FollowButton from "@/components/profile/FollowButton"; // Import FollowButton
import { getPaginatedUserSuggestions } from "@/lib/actions/user.actions";
import getImageUrl from "@/lib/utils/getImageUrl"; // Import if UserCard doesn't handle image URL
import { normalizeUser } from "@/types";
import { Metadata } from "next";
import Image from "next/image"; // Import if UserCard doesn't handle image
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Who to follow",
    description: "Discover interesting people to follow.",
};

interface WhoToFollowPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const WhoToFollowPage = async ({ searchParams }: WhoToFollowPageProps) => {
    const page = parseInt(searchParams?.["page"]?.toString() || "1");
    const limit = 10;

    const result = await getPaginatedUserSuggestions(page, limit);

    if (!result.success) {
        console.error("Failed to load suggestions:", result.error);
        return <div className="p-4">Failed to load suggestions. Please try again later.</div>;
    }

    const { items: apiUsers, pagination } = result.data;
    const users = apiUsers.map(normalizeUser);
    const hasNextPage = page < pagination.pages;
    const hasPrevPage = page > 1;

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold p-4 border-b border-border">
                Who to follow
            </h1>

            {users.length === 0 && page === 1 ? (
                <div className="text-center p-8 text-muted-foreground">
                    No new people to suggest right now.
                </div>
            ) : (
                // Use a list structure for better semantics
                <ul className="divide-y divide-border">
                    {users.map((user) => (
                        <li key={user._id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                            {/* Option 1: If UserCard ONLY displays info and no button */}
                            {/* <UserCard user={user} /> */}

                            {/* Option 2: Replicate structure similar to WhoToFollow sidebar component */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Link href={`/${user.username}`} className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full overflow-hidden">
                                        <Image
                                            src={getImageUrl(user.avatar)}
                                            alt={user.name || user.username}
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/${user.username}`} className="hover:underline">
                                        <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                                        <p className="text-muted-foreground text-xs truncate">@{user.username}</p>
                                    </Link>
                                    {/* Optional: Add bio here if needed */}
                                    {/* <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p> */}
                                </div>
                            </div>

                            {/* Add the FollowButton explicitly */}
                            <div className="ml-4 flex-shrink-0">
                                <FollowButton
                                    userId={user._id}
                                    username={user.username}
                                    // Backend doesn't return follow status for suggestions yet,
                                    // so rely on button's internal logic after initial render.
                                    initialFollowing={false}
                                    size="sm"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Simple Inline Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-between items-center p-4 mt-4 border-t border-border">
                    {/* ... pagination links ... */}
                </div>
            )}
        </div>
    );
};

export default WhoToFollowPage;
