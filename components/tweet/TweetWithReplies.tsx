import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RepliesList from '@/components/tweet/RepliesList';
import ReplyComposer from '@/components/tweet/ReplyComposer';
import TweetDetail from '@/components/tweet/TweetDetail';
import TweetService from '@/lib/api/services/tweet.service';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import BackButton from '../shared/BackButton';

interface TweetWithRepliesProps {
    tweetId: string;
}

export default async function TweetWithReplies({ tweetId }: TweetWithRepliesProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    try {
        // Fetch the tweet and its replies
        const response = await TweetService.getTweetThread(tweetId, 1, 10, session?.accessToken);

        if (response.status !== 'success' || !response.data) {
            return (
                <div className="p-4 text-center text-gray-500">
                    <p className="mb-2 font-medium">Tweet not found</p>
                    <p>The tweet you're looking for doesn't exist or has been deleted.</p>
                    <Link href="/feed" className="text-blue-500 hover:underline mt-4 inline-block">
                        Return to home
                    </Link>
                </div>
            );
        }

        const { tweet, parentTweet, replies, pagination } = response.data;

        return (
            <div>
                {/* Header with back button */}
                <BackButton title="Tweet" />

                {/* Parent tweet if this is a reply */}
                {parentTweet && (
                    <div className="opacity-80 border-b border-gray-200 dark:border-gray-800">
                        <TweetDetail
                            tweet={parentTweet}
                            currentUserId={session.user.id}
                        />
                    </div>
                )}

                {/* Main tweet detail */}
                <TweetDetail
                    tweet={tweet}
                    currentUserId={session.user.id}
                />

                {/* Reply composer */}
                <ReplyComposer
                    parentTweet={tweet}
                />

                {/* Replies section header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="font-bold text-lg">Replies</h2>
                </div>

                {/* List of replies */}
                <RepliesList
                    replies={replies}
                    currentUserId={session.user.id}
                />

                {/* Load more replies button */}
                {pagination.page < pagination.pages && (
                    <div className="p-4 flex justify-center">
                        <button className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 px-4 py-2 rounded-full">
                            Show more replies
                        </button>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error fetching tweet thread:', error);
        return (
            <div className="p-4 text-center text-gray-500">
                <p className="mb-2 font-medium">Something went wrong</p>
                <p>We couldn't load this tweet. Please try again later.</p>
                <Link href="/feed" className="text-blue-500 hover:underline mt-4 inline-block">
                    Return to home
                </Link>
            </div>
        );
    }
} 