'use client';

import ClickableHashtag from './ClickableHashtag';

interface TweetContentProps {
    content: string;
}

export default function TweetContent({ content }: TweetContentProps) {
    return (
        <div className="whitespace-pre-wrap break-words text-base sm:text-lg leading-relaxed">
            <ClickableHashtag content={content} />
        </div>
    );
} 