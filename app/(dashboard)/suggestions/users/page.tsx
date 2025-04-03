import FollowButton from "@/components/profile/FollowButton";
import { getPaginatedUserSuggestions } from "@/lib/actions/user.actions";
import getImageUrl from "@/lib/utils/getImageUrl";
import { normalizeUser } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Defina os props, forçando searchParams como Promise<any>
interface WhoToFollowPageProps {
    searchParams: Promise<any>;
}

export const metadata: Metadata = {
    title: "Who to follow",
    description: "Discover interesting people to follow.",
};

const WhoToFollowPage = async ({ searchParams }: WhoToFollowPageProps) => {
    // Se searchParams não for uma promise (por segurança), envolve-o com Promise.resolve
    const spPromise = searchParams instanceof Promise ? searchParams : Promise.resolve(searchParams);
    const spResolved = await spPromise;

    // Se spResolved for iterável (por exemplo, uma instância de URLSearchParams), converta-o para objeto
    const params =
        spResolved && typeof spResolved.get === "function"
            ? Object.fromEntries(spResolved)
            : spResolved;

    const page = parseInt(params["page"]?.toString() || "1");
    const limit = 10;

    const result = await getPaginatedUserSuggestions(page, limit);

    if (!result.success) {
        console.error("Failed to load suggestions:", result.error);
        return <div className="p-4">Failed to load suggestions. Please try again later.</div>;
    }

    const { items: apiUsers, pagination } = result.data;
    const users = apiUsers.map(normalizeUser);

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
                <ul className="divide-y divide-border">
                    {users.map((user) => (
                        <li
                            key={user._id}
                            className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                        >
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
                                        <h3 className="font-semibold text-sm truncate">
                                            {user.name}
                                        </h3>
                                        <p className="text-muted-foreground text-xs truncate">
                                            @{user.username}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <FollowButton
                                    userId={user._id}
                                    username={user.username}
                                    initialFollowing={false}
                                    size="sm"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {pagination.pages > 1 && (
                <div className="flex justify-between items-center p-4 mt-4 border-t border-border">
                    {/* ... pagination links ... */}
                </div>
            )}
        </div>
    );
};

export default WhoToFollowPage;
