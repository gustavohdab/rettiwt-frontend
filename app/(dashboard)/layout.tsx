import AppShell from "@/components/layout/AppShell";
import RightSidebar from "@/components/layout/RightSidebar";
import Sidebar from "@/components/layout/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rettiwt",
    description: "A Twitter clone built with Next.js and React",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppShell>
            <div className="flex max-w-7xl mx-auto w-full bg-[var(--background)] text-[var(--foreground)]">
                {/* Left Sidebar - Hidden on mobile */}
                <aside className="hidden lg:block w-[280px] flex-shrink-0">
                    <Sidebar />
                </aside>

                {/* Main Content - Responsive width */}
                <main className="flex-1 border-x border-gray-800">
                    <div className="max-w-2xl mx-auto w-full">{children}</div>
                </main>

                {/* Right Sidebar - Hidden on mobile */}
                <aside className="hidden xl:block w-[280px] flex-shrink-0">
                    <RightSidebar />
                </aside>
            </div>
        </AppShell>
    );
}
