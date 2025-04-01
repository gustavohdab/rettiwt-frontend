'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Navigation from './Navigation';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AppShellProps {
    children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Show consistent loading layout to prevent shift
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // If not authenticated, just render children (auth pages handle their own layout)
    if (!session) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {/* Mobile navigation - fixed at bottom on mobile */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[var(--background)] border-t border-gray-800 z-10">
                <Navigation isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
            </div>

            {/* Main content - with responsive padding and width */}
            <main className="min-h-screen pb-16 md:pb-0">
                <div className="w-full mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
                    <div className="max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-[100rem] mx-auto">
                        {children}
                    </div>
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