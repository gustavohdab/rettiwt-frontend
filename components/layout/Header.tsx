'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import SearchInput from '@/components/search/SearchInput';
import BackButton from '@/components/shared/BackButton';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    showSearch?: boolean;
}

export default function Header({ title, showBackButton = false, showSearch = true }: HeaderProps) {
    const pathname = usePathname();

    // Don't show search on the search page itself
    const shouldShowSearch = showSearch && !pathname?.startsWith('/search');

    return (
        <header className="sticky top-0 z-10 bg-[var(--background)] bg-opacity-90 backdrop-blur-sm border-b border-gray-800 px-5 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {showBackButton && (
                        <button onClick={() => window.history.back()} className="mr-5 p-1.5 rounded-full hover:bg-gray-800 transition-colors">
                            <ArrowLeftIcon className="h-5 w-5 text-[var(--secondary)]" />
                        </button>
                    )}
                    {title && (
                        <h1 className="text-xl font-bold text-[var(--foreground)]">{title}</h1>
                    )}
                </div>

                {shouldShowSearch && (
                    <div className="hidden md:block flex-1 max-w-md mx-auto">
                        <SearchInput showRecentSearches={false} />
                    </div>
                )}
            </div>
        </header>
    );
}
