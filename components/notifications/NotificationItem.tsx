"use client";

import { cn } from "@/lib/utils";
import getImageUrl from "@/lib/utils/getImageUrl";
import { Notification } from "@/types/models";
import {
    ArrowPathRoundedSquareIcon,
    AtSymbolIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    CheckCircleIcon,
    HeartIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';
import Image from "next/image"; // Use Next.js Image for optimization
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Import useRouter
import TimeAgo from "react-timeago";

interface NotificationItemProps {
    notification: Notification;
    onMarkRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
    const router = useRouter(); // Get router instance

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case "like":
                return <HeartIcon className="h-5 w-5 text-pink-500" />;
            case "reply":
                return <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-blue-500" />;
            case "follow":
                return <UserPlusIcon className="h-5 w-5 text-green-500" />;
            case "mention":
                return <AtSymbolIcon className="h-5 w-5 text-purple-500" />;
            case "retweet": // Using ArrowPathRoundedSquareIcon for retweet/quote
            case "quote":
                return <ArrowPathRoundedSquareIcon className="h-5 w-5 text-emerald-500" />;
            default:
                return null;
        }
    };

    const getNotificationText = (notification: Notification): React.ReactNode => {
        // Use a span with onClick for inner navigation
        const SenderName = (
            <span
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent outer link activation
                    router.push(`/profile/${notification.sender.username}`);
                }}
            >
                {notification.sender.name}
            </span>
        );

        switch (notification.type) {
            case "like":
                return <>{SenderName} liked your tweet.</>;
            case "reply":
                return <>{SenderName} replied to your tweet.</>;
            case "follow":
                return <>{SenderName} started following you.</>;
            case "mention":
                return <>{SenderName} mentioned you in a tweet.</>;
            case "retweet":
                return <>{SenderName} retweeted your tweet.</>;
            case "quote":
                return <>{SenderName} quoted your tweet.</>;
            default:
                return "Unknown notification type.";
        }
    };

    const getNotificationLink = (notification: Notification): string => {
        switch (notification.type) {
            case "like":
            case "reply":
            case "mention":
            case "retweet":
            case "quote":
                return notification.tweetId ? `/tweet/${notification.tweetId}` : '#';
            case "follow":
                return `/${notification.sender.username}`;
            default:
                return '#';
        }
    };

    const handleNotificationClick = () => {
        // No longer marks as read here - navigation only
        // if (!notification.read) {
        //     onMarkRead(notification._id);
        // }
    };

    const handleMarkReadClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // IMPORTANT: Prevent Link navigation
        e.preventDefault(); // Prevent default link behavior just in case
        onMarkRead(notification._id);
    };

    const notificationIcon = getNotificationIcon(notification.type);
    const notificationText = getNotificationText(notification);
    const notificationLink = getNotificationLink(notification);
    const senderInitial = notification.sender.name?.charAt(0).toUpperCase() || "?";

    return (
        <Link href={notificationLink} onClick={handleNotificationClick} className="block w-full">
            <div
                className={cn(
                    "flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                    !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                )}
            >
                {/* Icon Positioned First */}
                <div className="flex-shrink-0 w-6 h-full flex items-center justify-center pt-1">
                    {notificationIcon}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {notification.sender.avatar ? (
                        <Image
                            src={getImageUrl(notification.sender.avatar)}
                            alt={notification.sender.name}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{senderInitial}</span>
                    )}
                </div>

                {/* Text Content */}
                <div className="flex-1 text-sm">
                    <div className={cn(
                        "mb-1 text-gray-800 dark:text-gray-100",
                        !notification.read && "font-semibold"
                    )}>
                        {notificationText}
                    </div>

                    {notification.tweetSnippet && (
                        <p className="mb-1 pl-2 border-l-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 italic text-xs">
                            {notification.tweetSnippet}
                        </p>
                    )}

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        <TimeAgo
                            date={notification.createdAt}
                        />
                    </span>
                </div>

                {/* Explicit Mark Read Button OR Unread Dot */}
                <div className="ml-auto flex items-center self-start pt-1"> {/* Container for dot/button */}
                    {!notification.read ? (
                        <button
                            type="button"
                            onClick={handleMarkReadClick}
                            className="p-1 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                            aria-label="Mark as read"
                            title="Mark as read"
                        >
                            <CheckCircleIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        // Optionally show a persistent faded checkmark or nothing when read
                        // <CheckCircleIcon className="h-5 w-5 text-gray-300 dark:text-gray-600" /> 
                        null // Keep it clean, remove dot if read
                    )}
                    {/* Removed the blue dot as the button serves the purpose */}
                    {/* {!notification.read && (
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 self-center ml-1"></div>
                    )} */}
                </div>
            </div>
        </Link>
    );
} 