import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TweetService from '@/lib/api/services/tweet.service';
import TimelineWithComposer from '@/components/feed/TimelineWithComposer';
import type { Tweet } from '@/types';

// This is a Server Component that fetches the initial data
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
        // Fetch the initial timeline data from the API
        // By default, we don't include replies in the initial load
        const timelineResponse = await TweetService.getTimeline(1, 10, session?.accessToken, false);

        if (timelineResponse.status !== 'success' || !timelineResponse.data) {
            return (
                <div className="p-4 text-center text-gray-500">
                    Failed to load tweets. Please try again later.
                </div>
            );
        }

        const { tweets, pagination } = timelineResponse.data;

        // Pass the data to the client component that will handle both tweet creation and timeline
        return (
            <TimelineWithComposer
                initialTweets={tweets}
                initialPagination={pagination}
                currentUserId={session.user.id}
            />
        );
    } catch (error) {
        console.error('Error loading timeline:', error);
        return (
            <div className="p-4 text-center text-gray-500">
                An error occurred while loading tweets. Please try again later.
            </div>
        );
    }
} 