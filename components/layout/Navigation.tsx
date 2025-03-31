'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    BellIcon,
    EnvelopeIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    MagnifyingGlassIcon as MagnifyingGlassIconSolid,
    BellIcon as BellIconSolid,
    EnvelopeIcon as EnvelopeIconSolid,
    UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

interface NavigationProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Navigation({ isOpen, setIsOpen }: NavigationProps) {
    const pathname = usePathname();

    const navigationItems = [
        { name: 'Home', href: '/feed', icon: HomeIcon, activeIcon: HomeIconSolid },
        { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, activeIcon: MagnifyingGlassIconSolid },
        { name: 'Notifications', href: '/notifications', icon: BellIcon, activeIcon: BellIconSolid },
        { name: 'Messages', href: '/messages', icon: EnvelopeIcon, activeIcon: EnvelopeIconSolid },
        { name: 'Profile', href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
    ];

    return (
        <nav className="flex justify-around items-center py-3">
            {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center ${isActive ? 'text-blue-500' : 'text-gray-500'
                            }`}
                    >
                        <Icon className="w-6 h-6" aria-hidden="true" />
                        <span className="mt-1 text-xs">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
} 