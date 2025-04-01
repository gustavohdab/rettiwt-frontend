'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/actions/user-data.actions';
import { User } from '@/types/models';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    UserIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    UserIcon as UserIconSolid,
    BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid';

interface NavigationProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Navigation({ isOpen, setIsOpen }: NavigationProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the current user data from the server
    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user) {
                setIsLoading(true);
                try {
                    const result = await getCurrentUser();
                    if (result.success && result.data) {
                        setUserData(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUserData(null);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [session?.user]);

    // Use userData if available, otherwise fall back to session data
    const username = userData?.username || session?.user?.username;

    // Reduced navigation items for mobile to avoid overcrowding
    const navigationItems = [
        { name: 'Home', href: '/feed', icon: HomeIcon, activeIcon: HomeIconSolid },
        { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassIconSolid },
        { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, activeIcon: BookmarkIconSolid },
        {
            name: 'Profile',
            href: username ? `/${username}` : '/profile',
            icon: UserIcon,
            activeIcon: UserIconSolid
        },
    ];

    // Check if we're on a profile page
    const isProfileActive = username && pathname === `/${username}`;

    return (
        <nav className="flex justify-around items-center py-3 px-1 sm:px-4">
            {navigationItems.map((item) => {
                const isActive = item.name === 'Profile'
                    ? isProfileActive
                    : pathname === item.href;
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