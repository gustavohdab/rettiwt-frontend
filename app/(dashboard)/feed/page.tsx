import TweetList from '@/components/tweet/TweetList';
import Header from '@/components/layout/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home / Rettiwt',
    description: 'See what\'s happening in the world right now',
};

export default function FeedPage() {
    return (
        <>
            <Header title="Home" showSearch={false} />
            <TweetList />
        </>
    );
} 