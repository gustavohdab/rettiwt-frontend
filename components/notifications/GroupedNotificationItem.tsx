"use client";

import { cn } from "@/lib/utils";
import getImageUrl from "@/lib/utils/getImageUrl";
import { Notification } from "@/types/models";
import { CheckCircleIcon, HeartIcon } from '@heroicons/react/24/outline';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import TimeAgo from "react-timeago";

// Define the structure for grouped data (exported for use in NotificationsPage)
export interface GroupedNotification {
    type: 'grouped-like'; // Can add other types like 'grouped-follow' later
    tweetId: string;
    senders: Notification['sender'][]; // Array of sender objects
    mostRecentDate: string;
    read: boolean;
    notificationIds: string[]; // Keep track of original notification IDs
    tweetSnippet?: string;
}

interface GroupedNotificationItemProps {
    group: GroupedNotification;
    onMarkRead: (ids: string[]) => void; // Callback takes array of IDs
}

export default function GroupedNotificationItem({ group, onMarkRead }: GroupedNotificationItemProps) {
    const router = useRouter();
    const { senders, tweetId, mostRecentDate, read, notificationIds, tweetSnippet } = group;

    // Determine text: "UserA, UserB and X others liked..."
    const getGroupedText = () => {
        const names = senders.map(s => (
            <span
                key={s._id}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${s.username}`);
                }}
            >
                {s.name}
            </span>
        ));

        let text: React.ReactNode;
        if (names.length === 1) {
            text = <>{names[0]} liked your tweet.</>;
        } else if (names.length === 2) {
            text = <>{names[0]} and {names[1]} liked your tweet.</>;
        } else {
            const othersCount = names.length - 2;
            text = <>{names[0]}, {names[1]} and {othersCount} other{othersCount > 1 ? 's' : ''} liked your tweet.</>;
        }
        return text;
    };

    const handleGroupClick = () => {
        // No longer marks as read here - navigation only
        // if (!read) {
        //     onMarkRead(notificationIds);
        // }
        router.push(`/tweet/${tweetId}`);
    };

    const handleMarkGroupReadClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // IMPORTANT: Prevent outer div click/navigation
        e.preventDefault();
        onMarkRead(notificationIds); // Pass all IDs
    };

    // Use first sender's avatar and initial for display purposes
    const displaySender = senders[0];
    const displayInitial = displaySender?.name?.charAt(0).toUpperCase() || "?";
    const groupedText = getGroupedText();

    return (
        // Use a div instead of Link, handle navigation in onClick
        <div onClick={handleGroupClick} className="block w-full cursor-pointer">
            <div
                className={cn(
                    "relative flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                    !read && "bg-blue-50 dark:bg-blue-900/20"
                )}
            >
                {/* Like Icon instead of user avatar */}
                <div className="absolute left-8 top-8 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-0.5 rounded-full">
                    <HeartIcon className="h-5 w-5 text-pink-500" />
                </div>

                {/* Display avatar stack or first avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {displaySender?.avatar ? (
                        <Image
                            src={getImageUrl(displaySender.avatar)}
                            alt={displaySender.name}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{displayInitial}</span>
                    )}
                    {/* TODO: Could implement an avatar stack here for multiple senders */}
                </div>
                <div className="flex-1 text-sm">
                    <div className={cn(
                        "mb-1 text-gray-800 dark:text-gray-100",
                        !read && "font-semibold"
                    )}>
                        {groupedText}
                    </div>

                    {tweetSnippet && (
                        <p className="mb-1 pl-2 border-l-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 italic text-xs">
                            {tweetSnippet}
                        </p>
                    )}

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        <TimeAgo date={mostRecentDate} />
                    </span>
                </div>

                {/* Explicit Mark Read Button OR Unread Dot for Group */}
                <div className="ml-auto flex items-center self-start pt-1">
                    {!read ? (
                        <button
                            type="button"
                            onClick={handleMarkGroupReadClick}
                            className="p-1 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                            aria-label="Mark group as read"
                            title="Mark group as read"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        null // Keep it clean
                    )}
                </div>
            </div>
        </div>
    );
} 