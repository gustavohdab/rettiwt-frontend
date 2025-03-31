import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TweetService from '@/lib/api/services/tweet.service';
import TweetCard from './TweetCard';
import type { Tweet } from '@/types';

// This is intentionally a Server Component to fetch data on the server
export default async function TweetList() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return (
            <div className="p-4 text-center text-gray-500">
                Please sign in to view your timeline.
            </div>
        );
    }

    try {
        // Fetch the timeline from the API
        const timelineResponse = await TweetService.getTimeline(1, 20, session?.accessToken); // Start with page 1, limit 20

        if (timelineResponse.status !== 'success' || !timelineResponse.data) {
            return (
                <div className="p-4 text-center text-gray-500">
                    Failed to load tweets. Please try again later.
                </div>
            );
        }

        const { tweets } = timelineResponse.data;

        if (!tweets || tweets.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500 border-b border-gray-200 dark:border-gray-800">
                    <p className="mb-2 font-medium">Welcome to your timeline!</p>
                    <p>When you follow people, their tweets will show up here.</p>
                </div>
            );
        }

        return (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {tweets.map((tweet: Tweet) => (
                    <TweetCard
                        key={tweet._id}
                        currentUserId={session.user.id}
                        tweet={tweet}
                        withBorder={true}
                    />
                ))}
            </div>
        );
    } catch (error) {
        console.error('Error fetching timeline:', error);

        return (
            <div className="p-4 text-center text-gray-500">
                An error occurred while loading tweets. Please try again later.
            </div>
        );
    }
} 