"use client";

import Header from "@/components/layout/Header";
import TweetComposer from "@/components/tweet/TweetComposer";
import { getTweetForQuote } from "@/lib/actions/tweet.actions";
import type { Tweet } from "@/types/models";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Inner component to access searchParams
function ComposePageContent() {
    const searchParams = useSearchParams();
    const quoteTweetId = searchParams.get('quote');
    const [quotedTweetData, setQuotedTweetData] = useState<Tweet | null>(null);
    const [isLoadingQuote, setIsLoadingQuote] = useState(false);
    const [errorQuote, setErrorQuote] = useState<string | null>(null);

    useEffect(() => {
        if (quoteTweetId) {
            setIsLoadingQuote(true);
            setErrorQuote(null);
            getTweetForQuote(quoteTweetId)
                .then(result => {
                    if (result.success && result.data) {
                        setQuotedTweetData(result.data);
                    } else {
                        setErrorQuote(result.error || "Failed to load tweet to quote.");
                    }
                })
                .catch(err => {
                    console.error("Error fetching quote tweet:", err);
                    setErrorQuote("An error occurred while loading the tweet.");
                })
                .finally(() => {
                    setIsLoadingQuote(false);
                });
        }
    }, [quoteTweetId]);

    return (
        <div>
            <Header title="Compose Tweet" showBackButton={true} />

            {/* TODO: Add Loading state for quote tweet fetch */}
            {isLoadingQuote && (
                <div className="p-4 text-center text-gray-500">Loading quoted tweet...</div>
            )}
            {/* TODO: Add Error state for quote tweet fetch */}
            {errorQuote && (
                <div className="p-4 text-red-500">Error: {errorQuote}</div>
            )}

            {/* Render composer, passing quote data if available */}
            {/* The composer itself will handle rendering the quote preview */}
            <TweetComposer
                placeholder="What's happening?"
                quotedTweetData={quotedTweetData ?? undefined} // Pass undefined if null
            />
        </div>
    );
}

// Main page component wraps the content in Suspense for searchParams
export default function ComposeTweetPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}> {/* Add better fallback */}
            <ComposePageContent />
        </Suspense>
    );
} 