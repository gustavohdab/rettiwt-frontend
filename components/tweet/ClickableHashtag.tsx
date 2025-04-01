'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ClickableHashtagProps {
    content: string;
}

export default function ClickableHashtag({ content }: ClickableHashtagProps): ReactNode {
    // Regex to find hashtags in the content
    const hashtagRegex = /#(\w+)/g;

    // Split content by hashtags and create an array of text and hashtag links
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = hashtagRegex.exec(content)) !== null) {
        // Add text before the hashtag
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
        }

        // Add the hashtag as a link
        const hashtag = match[1];
        parts.push(
            <Link
                key={`${hashtag}-${match.index}`}
                href={`/hashtag/${hashtag}`}
                className="text-blue-500 hover:underline"
                onClick={(e) => e.stopPropagation()}
            >
                #{hashtag}
            </Link>
        );

        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }

    return <>{parts}</>;
} 