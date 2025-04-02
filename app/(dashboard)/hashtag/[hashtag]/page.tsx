import HashtagPage from "@/components/trends/HashtagPage";
import { Metadata } from "next";

type Props = {
    params: Promise<{
        hashtag: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { hashtag } = await params;
    return {
        title: `#${hashtag} | Rettiwt`,
        description: `Explore tweets with the hashtag #${hashtag}`,
    };
}

export default async function HashtagPageRoute({ params }: Props) {
    const { hashtag } = await params;
    const decodedHashtag = decodeURIComponent(hashtag);

    return (
        <div className="space-y-4">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-2xl font-bold">#{decodedHashtag}</h1>
            </header>
            <section>
                <HashtagPage hashtag={hashtag} />
            </section>
        </div>
    );
}
