import type { Metadata } from "next";
import PopularTweets from "@/components/trends/PopularTweets";

export const metadata: Metadata = {
    title: "Explore | Twitter Clone",
    description: "Discover what's happening on Twitter right now",
};

export default function ExplorePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <PopularTweets />
        </div>
    );
} 