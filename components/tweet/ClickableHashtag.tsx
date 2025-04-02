'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ClickableHashtagProps {
    content: string;
}

export default function ClickableHashtag({ content }: ClickableHashtagProps): ReactNode {
    // Use the same Unicode-aware regex as the backend
    const hashtagRegex = /#([\p{L}\p{N}_]+)/gu;

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
        const hashtag = match[1]; // The captured group (without #)
        const fullMatch = match[0]; // The full match (with #)

        parts.push(
            <Link
                key={`${hashtag}-${match.index}`}
                // Encode the hashtag for the URL
                href={`/hashtag/${encodeURIComponent(hashtag)}`}
                className="text-blue-500 hover:underline"
                onClick={(e) => e.stopPropagation()} // Prevent card navigation
            >
                {/* Display the full match (e.g., #teste_produção) */}
                {fullMatch}
            </Link>
        );

        lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining text
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }

    return <>{parts}</>;
} 