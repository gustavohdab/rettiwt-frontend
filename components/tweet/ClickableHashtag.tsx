'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ClickableContentProps {
    content: string;
}

// Renamed conceptually to handle both hashtags and mentions
export default function ClickableHashtag({ content }: ClickableContentProps): ReactNode {
    // Combined regex for hashtags (group 1 & 2) and mentions (group 3 & 4)
    // Hashtag: # followed by Unicode letters/numbers or underscore
    // Mention: @ followed by basic alphanumeric or underscore
    const pattern = /(#([\p{L}\p{N}_]+))|(@([a-zA-Z0-9_]+))/gu;

    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(content)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
        }

        const fullMatch = match[0];
        const hashtagContent = match[2]; // Content of hashtag (#hashtag)
        const mentionContent = match[4]; // Content of mention (@mention)

        if (hashtagContent) {
            // Add the hashtag as a link
            parts.push(
                <Link
                    key={`${hashtagContent}-${match.index}`}
                    href={`/hashtag/${encodeURIComponent(hashtagContent)}`}
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {fullMatch}
                </Link>
            );
        } else if (mentionContent) {
            // Add the mention as a link
            parts.push(
                <Link
                    key={`${mentionContent}-${match.index}`}
                    href={`/${mentionContent}`} // No encodeURIComponent needed for this username regex
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    {fullMatch}
                </Link>
            );
        }

        lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining text
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
    }

    return <>{parts}</>;
} 