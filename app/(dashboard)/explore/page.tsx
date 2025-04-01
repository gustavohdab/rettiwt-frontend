import type { Metadata } from "next";
import TrendingHashtags from "@/components/trends/TrendingHashtags";
import PopularTweets from "@/components/trends/PopularTweets";
import WhoToFollow from "@/components/trends/WhoToFollow";

export const metadata: Metadata = {
    title: "Explore | Twitter Clone",
    description: "Discover what's happening on Twitter right now",
};

export default function ExplorePage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
                <PopularTweets />
            </div>
            <div className="space-y-4">
                <TrendingHashtags />
                <WhoToFollow />
            </div>
        </div>
    );
} 