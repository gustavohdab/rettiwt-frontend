'use client';

import SearchInput from '../search/SearchInput';
import TrendingHashtags from '../trends/TrendingHashtags';
import WhoToFollow from '../trends/WhoToFollow';

// This is a Server Component - it can fetch data directly
export default function RightSidebar() {
    return (
        <div className="hidden lg:block w-[350px] h-screen overflow-y-auto px-4 py-4 sticky top-0">
            {/* Search Bar */}
            <div className="relative mb-6">
                <SearchInput />
            </div>

            {/* Trends - using the dynamic API component */}
            <div className="mb-4">
                <TrendingHashtags />
            </div>

            {/* Who to follow - using the dynamic API component */}
            <div>
                <WhoToFollow />
            </div>

            {/* Footer */}
            <div className="mt-4 px-4 text-xs text-gray-500">
                <span className="mr-2 hover:underline cursor-pointer">Terms of Service</span>
                <span className="mr-2 hover:underline cursor-pointer">Privacy Policy</span>
                <span className="mr-2 hover:underline cursor-pointer">Cookie Policy</span>
                <span className="mr-2 hover:underline cursor-pointer">Accessibility</span>
                <span className="mr-2 hover:underline cursor-pointer">Ads info</span>
                <span className="hover:underline cursor-pointer">More</span>
                <div className="mt-1">© 2023 Twitter Clone</div>
            </div>
        </div>
    );
} 