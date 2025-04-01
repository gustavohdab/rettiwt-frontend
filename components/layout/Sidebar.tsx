'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    EnvelopeIcon,
    UserIcon,
    BookmarkIcon,
    EllipsisHorizontalCircleIcon,
    ArrowLeftOnRectangleIcon,
    HashtagIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    HashtagIcon as HashtagIconSolid,
    UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

// Define navigation items without Profile (we'll add it dynamically)
const navigationItems = [
    { name: 'Home', href: '/feed', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Explore', href: '/explore', icon: HashtagIcon, activeIcon: HashtagIconSolid },
    { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassIconSolid },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
    { name: 'Messages', href: '/messages', icon: EnvelopeIcon },
    { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
    { name: 'More', href: '/more', icon: EllipsisHorizontalCircleIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const username = session?.user?.username;

    // Create all navigation items including profile with dynamic path
    const allNavigationItems = [
        ...navigationItems,
        {
            name: 'Profile',
            href: username ? `/${username}` : '/profile',
            icon: UserIcon,
            activeIcon: UserIconSolid
        },
    ];

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    // Check if we're on a profile page
    const isProfileActive = username && pathname === `/${username}`;

    return (
        <div className="hidden lg:block w-[350px] h-screen overflow-y-auto px-4 py-4 sticky top-0">
            <div className="space-y-2 px-3">
                {/* Logo */}
                <Link href="/feed" className="flex items-center mb-6 px-2">
                    <svg
                        className="w-8 h-8 lg:w-9 lg:h-9 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                    </svg>
                    <span className="ml-2 text-xl lg:text-2xl font-bold">Twitter</span>
                </Link>

                {/* Navigation Links */}
                <nav className="space-y-1">
                    {allNavigationItems.map((item) => {
                        const isActive = item.name === 'Profile' ? isProfileActive : pathname === item.href;
                        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-2 py-2.5 md:py-2 lg:py-3 text-base lg:text-lg font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-900 dark:text-gray-100'
                                    }`}
                            >
                                <Icon className="w-6 h-6 lg:w-7 lg:h-7 mr-4" aria-hidden="true" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Tweet Button */}
                <button
                    type="button"
                    className="mt-6 w-full bg-blue-500 text-white px-4 py-3 lg:py-4 rounded-full font-bold hover:bg-blue-600 transition duration-200"
                >
                    Tweet
                </button>
            </div>

            {/* User Profile */}
            {session?.user && (
                <div className="px-3 mt-auto">
                    <Link href={username ? `/${username}` : '/profile'}>
                        <div className="flex items-center p-2 lg:p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full"
                                        />
                                    ) : (
                                        <UserIcon className="w-6 h-6 lg:w-7 lg:h-7 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white truncate">
                                    {session.user.name}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">
                                    @{session.user.username || 'user'}
                                </p>
                            </div>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleSignOut();
                            }} className="p-1 lg:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                            </button>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
} 