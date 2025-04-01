import { Suspense } from 'react';
import TweetWithReplies from '@/components/tweet/TweetWithReplies';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tweet / Twitter Clone',
    description: 'View and reply to this tweet',
};

interface TweetPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TweetPage({ params }: TweetPageProps) {
    const { id } = await params;

    return (
        <div>
            <Suspense fallback={
                <div className="p-4 flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            }>
                <TweetWithReplies tweetId={id} />
            </Suspense>
        </div>
    );
} 