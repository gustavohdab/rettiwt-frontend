import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TweetService from '@/lib/api/services/tweet.service';
import TweetCard from '@/components/tweet/TweetCard';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import BackButton from '@/components/shared/BackButton';

export const metadata: Metadata = {
    title: 'Bookmarks / Twitter Clone',
    description: 'Your bookmarked tweets',
};

export default async function BookmarksPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    try {
        const response = await TweetService.getBookmarks(1, 20, session?.accessToken);

        console.log(response);

        if (response.status !== 'success' || !response.data) {
            return (
                <div className="p-4 text-center text-gray-500">
                    <p className="mb-2 font-medium">Could not load bookmarks</p>
                    <p>Please try again later.</p>
                </div>
            );
        }

        const { bookmarks, pagination } = response.data;

        return (
            <div>
                <BackButton title="Bookmarks" />

                {bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                        <BookmarkIcon className="h-12 w-12 mb-4" />
                        <p className="text-2xl font-bold mb-2">Save Tweets for later</p>
                        <p className="text-gray-500 max-w-md">
                            Don't let the good ones fly away! Bookmark Tweets to easily find them again in the future.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {bookmarks.map((tweet) => (
                            <TweetCard
                                key={tweet._id}
                                tweet={{
                                    ...tweet,
                                    bookmarked: true, // All tweets on this page are bookmarked
                                }}
                                currentUserId={session.user.id}
                                withBorder={true}
                            />
                        ))}
                    </div>
                )}

                {pagination.page < pagination.pages && (
                    <div className="p-4 text-center">
                        <Link
                            href={`/bookmarks?page=${pagination.page + 1}`}
                            className="text-blue-500 hover:underline"
                        >
                            Load more
                        </Link>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error loading bookmarks:', error);
        return (
            <div className="p-4 text-center text-gray-500">
                <p className="mb-2 font-medium">Error loading bookmarks</p>
                <p>Please try again later.</p>
            </div>
        );
    }
} 