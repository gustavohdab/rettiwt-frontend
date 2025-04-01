import TweetCard from '@/components/tweet/TweetCard';
import type { Tweet } from '@/types';

interface RepliesListProps {
    replies: Tweet[];
    currentUserId: string;
}

export default function RepliesList({ replies, currentUserId }: RepliesListProps) {
    if (replies.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p className="mb-2 font-medium">No replies yet</p>
                <p>Be the first to reply to this tweet!</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {replies.map((reply) => (
                <TweetCard
                    key={reply._id}
                    tweet={reply}
                    currentUserId={currentUserId}
                    withBorder={true}
                />
            ))}
        </div>
    );
} 