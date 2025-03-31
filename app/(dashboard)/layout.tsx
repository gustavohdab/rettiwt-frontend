import AppShell from '@/components/layout/AppShell';
import RightSidebar from '@/components/layout/RightSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Twitter Clone',
    description: 'A Twitter clone built with Next.js and React',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppShell>
            <div className="flex">
                {/* Main content area */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Right sidebar */}
                <RightSidebar />
            </div>
        </AppShell>
    );
} 