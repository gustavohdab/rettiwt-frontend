"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileTabsProps {
    username: string;
    tweetCount?: number;
    activeTab?: string;
}

export default function ProfileTabs({ username, tweetCount = 0, activeTab }: ProfileTabsProps) {
    const pathname = usePathname();

    const tabs = [
        {
            name: "Tweets",
            href: `/${username}`,
            count: tweetCount,
            id: "tweets",
            active: activeTab ? activeTab === "tweets" : pathname === `/${username}`,
        },
        {
            name: "Replies",
            href: `/${username}/with_replies`,
            id: "replies",
            active: activeTab ? activeTab === "replies" : pathname === `/${username}/with_replies`,
        },
        {
            name: "Media",
            href: `/${username}/media`,
            id: "media",
            active: activeTab ? activeTab === "media" : pathname === `/${username}/media`,
        },
        {
            name: "Likes",
            href: `/${username}/likes`,
            id: "likes",
            active: activeTab ? activeTab === "likes" : pathname === `/${username}/likes`,
        },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`flex-1 flex flex-col items-center py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative ${tab.active
                            ? "font-semibold text-black dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            <span>{tab.name}</span>
                            {tab.count !== undefined && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {tab.count > 0 ? tab.count : ""}
                                </span>
                            )}
                        </div>
                        {tab.active && (
                            <div className="absolute bottom-0 h-1 w-12 bg-blue-500 rounded-full" />
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
} 