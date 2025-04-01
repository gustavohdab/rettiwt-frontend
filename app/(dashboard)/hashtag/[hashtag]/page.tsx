import { Metadata } from "next";
import TrendingHashtags from "@/components/trends/TrendingHashtags";
import WhoToFollow from "@/components/trends/WhoToFollow";
import HashtagPage from "@/components/trends/HashtagPage";

type Props = {
    params: {
        hashtag: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `#${params.hashtag} | Twitter Clone`,
        description: `Explore tweets with the hashtag #${params.hashtag}`,
    };
}

export default function HashtagPageRoute({ params }: Props) {
    const { hashtag } = params;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-2xl font-bold">#{hashtag}</h1>
                </div>
                <HashtagPage hashtag={hashtag} />
            </div>
            <div className="space-y-4">
                <TrendingHashtags />
                <WhoToFollow />
            </div>
        </div>
    );
} 