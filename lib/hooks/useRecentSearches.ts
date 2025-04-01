"use client";

import { useState, useEffect } from "react";

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = "recentSearches";

/**
 * Custom hook for managing recent searches in localStorage
 * @returns Object with recent searches array and methods to add/clear searches
 */
export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        // Load from localStorage on component mount
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing recent searches", e);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    /**
     * Add a search query to recent searches
     * @param query The search query to add
     */
    const addRecentSearch = (query: string) => {
        if (!query?.trim()) return;

        setRecentSearches((prev) => {
            // Remove if exists already
            const filtered = prev.filter(
                (s) => s.toLowerCase() !== query.toLowerCase()
            );
            // Add to beginning and limit to max items
            const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

            // Save to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Error storing recent searches", e);
            }

            return updated;
        });
    };

    /**
     * Clear all recent searches
     */
    const clearRecentSearches = () => {
        localStorage.removeItem(STORAGE_KEY);
        setRecentSearches([]);
    };

    /**
     * Remove a specific search query from recent searches
     * @param query The search query to remove
     */
    const removeRecentSearch = (query: string) => {
        setRecentSearches((prev) => {
            const updated = prev.filter((s) => s !== query);

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Error storing recent searches", e);
            }

            return updated;
        });
    };

    return {
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        removeRecentSearch,
    };
}
