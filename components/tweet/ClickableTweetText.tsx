'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface ClickableTweetTextProps {
    content: string;
}

export default function ClickableTweetText({ content }: ClickableTweetTextProps): ReactNode {
    // No content, return nothing
    if (!content) return null;

    // Use the same Unicode-aware regex as the backend
    const hashtagRegex = /#([\p{L}\p{N}_]+)/gu;
    const mentionRegex = /@([\p{L}\p{N}_]+)/gu;

    // Create a combined regex to match both hashtags and mentions
    const combinedRegex = /(#|@)([\p{L}\p{N}_]+)/gu;

    // Split content by matches and create an array of text and clickable links
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(content)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
        }

        // Determine if it's a hashtag or mention
        const prefix = match[1]; // # or @
        const value = match[2]; // The captured text after # or @
        const fullMatch = match[0]; // The full match (with # or @)

        if (prefix === '#') {
            // Handle hashtag
            parts.push(
                <Link
                    key={`hashtag-${value}-${match.index}`}
                    href={`/hashtag/${encodeURIComponent(value)}`}
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent card navigation
                >
                    {fullMatch}
                </Link>
            );
        } else if (prefix === '@') {
            // Handle mention
            parts.push(
                <Link
                    key={`mention-${value}-${match.index}`}
                    href={`/profile/${encodeURIComponent(value)}`}
                    className="text-purple-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent card navigation
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