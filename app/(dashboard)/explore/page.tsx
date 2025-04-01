import type { Metadata } from "next";
import PopularTweets from "@/components/trends/PopularTweets";

export const metadata: Metadata = {
    title: "Explore | Rettiwt",
    description: "Discover what's happening on Rettiwt right now",
};

export default function ExplorePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <PopularTweets />
        </div>
    );
} 