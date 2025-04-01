'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    EnvelopeIcon,
    UserIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    BellIcon as BellIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    UserIcon as UserIconSolid,
    BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

interface NavigationProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Navigation({ isOpen, setIsOpen }: NavigationProps) {
    const pathname = usePathname();

    // Reduced navigation items for mobile to avoid overcrowding
    const navigationItems = [
        { name: 'Home', href: '/feed', icon: HomeIcon, activeIcon: HomeIconSolid },
        { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassIconSolid },
        { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, activeIcon: BookmarkIconSolid },
        { name: 'Profile', href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
    ];

    return (
        <nav className="flex justify-around items-center py-3 px-1 sm:px-4">
            {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center px-2 py-1 sm:py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'text-blue-500' : 'text-gray-500'}`}
                    >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
                        <span className="mt-1 text-xs sm:text-sm font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
} 