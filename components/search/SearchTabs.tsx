'use client';

import Link from 'next/link';
import { SearchResults } from '@/lib/api/services/search.service';

interface SearchTabsProps {
    query: string;
    activeType: 'users' | 'tweets' | 'all';
    counts?: SearchResults['counts'];
}

export default function SearchTabs({ query, activeType, counts }: SearchTabsProps) {
    const tabs = [
        { id: 'all', label: 'All', count: counts?.total || 0 },
        { id: 'users', label: 'Users', count: counts?.users || 0 },
        { id: 'tweets', label: 'Tweets', count: counts?.tweets || 0 },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={`/search?q=${encodeURIComponent(query)}&type=${tab.id}`}
                        className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${activeType === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-1 text-xs text-gray-500">
                                {tab.count}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
