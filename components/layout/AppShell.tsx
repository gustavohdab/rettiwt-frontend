'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import { useSession } from 'next-auth/react';

interface AppShellProps {
    children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // If not authenticated, just render children (auth pages handle their own layout)
    if (!session) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Desktop sidebar - hidden on mobile */}
            <div className="fixed top-0 left-0 hidden md:flex h-screen w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <Sidebar />
            </div>

            {/* Mobile navigation - fixed at bottom on mobile */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-10">
                <Navigation isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
            </div>

            {/* Main content - with padding to accommodate the sidebar on desktop and navigation on mobile */}
            <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    {children}
                </div>
            </main>

            {/* Mobile menu backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
} 