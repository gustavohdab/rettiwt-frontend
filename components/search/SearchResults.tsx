'use client';

import Link from 'next/link';
import { SearchResults as SearchResultsType } from '@/lib/api/services/search.service';
import TweetCard from '@/components/tweet/TweetCard';
import UserCard from '@/components/user/UserCard';
import { ApiTypes } from '@/types';

interface SearchResultsProps {
    results: SearchResultsType;
    type: 'users' | 'tweets' | 'all';
    query: string;
    page: number;
    pagination: ApiTypes.PaginationInfo;
    currentUserId?: string;
}

export default function SearchResults({
    results,
    type,
    query,
    page,
    pagination,
    currentUserId
}: SearchResultsProps) {
    const hasResults = (results.users && results.users.length > 0) ||
        (results.tweets && results.tweets.length > 0);

    if (!hasResults) {
        return (
            <div className="text-center py-10">
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    No results found for "{query}"
                </p>
                <p className="text-gray-500 mt-2">
                    Try searching for something else
                </p>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {/* Users section */}
            {(type === 'users' || type === 'all') && results.users && results.users.length > 0 && (
                <div className="mb-8">
                    {type === 'all' && (
                        <h2 className="text-xl font-bold mb-4">Users</h2>
                    )}
                    <div className="space-y-4">
                        {results.users.map(user => (
                            <UserCard
                                key={user._id}
                                user={user}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                    {type === 'all' && results.counts && results.counts.users > results.users.length && (
                        <div className="mt-4 text-center">
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}&type=users`}
                                className="text-blue-500 hover:underline"
                            >
                                View all users
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Tweets section */}
            {(type === 'tweets' || type === 'all') && results.tweets && results.tweets.length > 0 && (
                <div>
                    {type === 'all' && (
                        <h2 className="text-xl font-bold mb-4">Tweets</h2>
                    )}
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {results.tweets.map(tweet => (
                            <TweetCard
                                key={tweet._id}
                                tweet={tweet}
                                currentUserId={currentUserId || ''}
                                withBorder={false}
                            />
                        ))}
                    </div>
                    {type === 'all' && results.counts && results.counts.tweets > results.tweets.length && (
                        <div className="mt-4 text-center">
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}&type=tweets`}
                                className="text-blue-500 hover:underline"
                            >
                                View all tweets
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination for specific types */}
            {type !== 'all' && pagination.pages > 1 && (
                <div className="mt-6 flex justify-center">
                    {page > 1 && (
                        <Link
                            href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${page - 1}`}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md mr-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Previous
                        </Link>
                    )}
                    {page < pagination.pages && (
                        <Link
                            href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${page + 1}`}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
