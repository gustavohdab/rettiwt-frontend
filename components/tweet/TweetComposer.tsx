'use client';

import { createTweet } from '@/lib/actions/tweet.actions';
import { uploadTweetMedia } from '@/lib/actions/upload.actions';
import { getCurrentUser } from '@/lib/actions/user-data.actions';
import { searchUsersForMention } from '@/lib/actions/user.actions';
import getImageUrl from '@/lib/utils/getImageUrl';
import { SuggestedUser, Tweet, TweetComposerProps } from '@/types';
import { User } from '@/types/models';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import MentionSuggestions from './MentionSuggestions';
import QuotedTweetPreview from './QuotedTweetPreview';

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

interface ExtendedTweetComposerProps extends TweetComposerProps {
    quotedTweetData?: Tweet | null;
}

export default function TweetComposer({ placeholder = "What's happening?", parentId, onSuccess, quotedTweetData = null }: ExtendedTweetComposerProps) {
    const { data: session } = useSession();
    const [isPending, startTransition] = useTransition();
    const [content, setContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedImagesPreview, setSelectedImagesPreview] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    // State for mention suggestions
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    // Debounced function to fetch suggestions
    const debouncedFetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (!query) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            setSuggestionsLoading(true);
            try {
                const results = await searchUsersForMention(query);
                setSuggestions(results);
                setShowSuggestions(true); // Show suggestions when results are ready
                setActiveSuggestionIndex(-1); // Reset selection
            } catch (error) {
                console.error("Error fetching mention suggestions:", error);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setSuggestionsLoading(false);
            }
        }, 300), // 300ms debounce delay
        [] // No dependencies for the debounced function itself
    );

    // Handler for textarea changes
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);

        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        const mentionMatch = textBeforeCursor.match(/@(\w+)$/);

        if (mentionMatch) {
            const query = mentionMatch[1];
            setMentionQuery(query);
            // Trigger debounced fetch
            debouncedFetchSuggestions(query);
            // TODO: Calculate position based on cursor
            // For now, just shows it below
            setShowSuggestions(true);
        } else {
            setMentionQuery(null);
            setShowSuggestions(false);
        }
    };

    // Handle selection from dropdown (will be passed to MentionSuggestions)
    const handleMentionSelect = (username: string) => {
        if (!textareaRef.current) return;

        const currentContent = content;
        const cursorPos = textareaRef.current.selectionStart;
        const textBeforeCursor = currentContent.substring(0, cursorPos);
        const mentionStartPos = textBeforeCursor.lastIndexOf('@');

        if (mentionStartPos === -1) return; // Should not happen if called correctly

        const textAfterCursor = currentContent.substring(cursorPos);

        const newContent =
            currentContent.substring(0, mentionStartPos) + // Text before @
            `@${username} ` + // Inserted mention + space
            textAfterCursor; // Text after the original query

        setContent(newContent);
        setShowSuggestions(false);
        setMentionQuery(null);
        setSuggestions([]);

        // Focus and set cursor position after the inserted mention
        setTimeout(() => {
            textareaRef.current?.focus();
            const newCursorPos = mentionStartPos + username.length + 2; // After @username 
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    // Handle keyboard navigation in suggestions
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showSuggestions && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex(prev =>
                    prev > 0 ? prev - 1 : 0 // Prevent going below 0 if already at top
                );
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                    e.preventDefault();
                    handleMentionSelect(suggestions[activeSuggestionIndex].username);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowSuggestions(false);
                setMentionQuery(null);
                setSuggestions([]);
            }
        }
    };

    // Fetch the current user data from the server
    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user) {
                setIsLoading(true);
                try {
                    const result = await getCurrentUser();
                    if (result.success && result.data) {
                        setUserData(result.data);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUserData(null);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [session?.user]);

    // Use userData if available, otherwise fall back to session data
    const name = userData?.name || session?.user?.name;
    const image = userData?.avatar || session?.user?.image;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newSelectedImages = [...selectedImages, ...filesArray].slice(0, 4); // Limit to 4 images
            setSelectedImages(newSelectedImages);

            // Create preview URLs
            const newPreviewUrls = newSelectedImages.map(file => URL.createObjectURL(file));
            setSelectedImagesPreview(newPreviewUrls);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        const newPreviews = [...selectedImagesPreview];

        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(newPreviews[index]);

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setSelectedImages(newImages);
        setSelectedImagesPreview(newPreviews);
    };

    const handleTweetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!content.trim() && selectedImages.length === 0) return;
        if (isPending || isUploading) return;

        let uploadedImageUrls: string[] = [];

        // Handle image uploads if there are any
        if (selectedImages.length > 0) {
            setIsUploading(true);

            try {
                // Create FormData to send files
                const formData = new FormData();
                selectedImages.forEach(file => {
                    formData.append('media', file);
                });

                // Upload the media files
                const uploadResult = await uploadTweetMedia(formData);

                if (!uploadResult.success) {
                    setError(uploadResult.error || 'Failed to upload media');
                    setIsUploading(false);
                    return;
                }

                // Save the uploaded media URLs
                uploadedImageUrls = uploadResult.urls || [];
            } catch (err) {
                console.error('Error uploading media:', err);
                setError('Failed to upload images. Please try again.');
                setIsUploading(false);
                return;
            }

            setIsUploading(false);
        }

        // Use Server Action to create tweet
        startTransition(() => {
            createTweet({
                content,
                images: uploadedImageUrls,
                parentId,
                quotedTweetId: quotedTweetData?._id || undefined
            }).then((result) => {
                if (result.error) {
                    setError(result.error);
                    return;
                }

                // Reset form state
                setContent('');
                setSelectedImages([]);
                setSelectedImagesPreview([]);
                setError(null);

                // Revoke all object URLs to prevent memory leaks
                selectedImagesPreview.forEach(url => URL.revokeObjectURL(url));

                // Call onSuccess callback if provided (this will handle adding the tweet to the timeline)
                if (onSuccess && result.data) {
                    onSuccess(result.data);
                }

                // Maybe navigate away after successful quote
                if (quotedTweetData && result.data) {
                    // Example: go to the new tweet's page or feed
                    // router.push(`/tweet/${result.data._id}`);
                    // router.push('/feed'); 
                }
            });
        });
    };

    const remainingChars = 280 - content.length;
    const isOverLimit = remainingChars < 0;
    const isDisabled = isOverLimit || (!content.trim() && selectedImages.length === 0) || isPending || isUploading;

    if (!session?.user) {
        return null;
    }

    return (
        <form onSubmit={handleTweetSubmit} className="p-4">
            <div className="flex">
                {/* User avatar */}
                <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                        {image ? (
                            <Image
                                src={getImageUrl(image)}
                                alt={name || 'User'}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm font-medium">
                                {name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tweet input area */}
                <div className="flex-1 min-w-0">
                    {/* Text area */}
                    <div className="relative">
                        <textarea
                            placeholder={placeholder}
                            value={content}
                            onChange={handleContentChange}
                            onKeyDown={handleKeyDown}
                            className="w-full border-0 focus:ring-0 text-lg placeholder-gray-500 tracking-wide min-h-[100px] bg-transparent resize-none"
                            maxLength={290}
                            ref={textareaRef}
                        />
                        {/* Mention Suggestions Dropdown (MOVED HERE) */}
                        {showSuggestions && (
                            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                <MentionSuggestions
                                    suggestions={suggestions}
                                    loading={suggestionsLoading}
                                    onSelect={handleMentionSelect}
                                    activeIndex={activeSuggestionIndex}
                                />
                            </div>
                        )}
                    </div>

                    {/* Render Quoted Tweet Preview if data exists */}
                    {quotedTweetData && (
                        <div className="mt-3 mb-3 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <QuotedTweetPreview tweet={quotedTweetData} />
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="mb-3 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Image previews */}
                    {selectedImagesPreview.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {selectedImagesPreview.map((preview, index) => (
                                <div key={index} className="relative rounded-xl overflow-hidden">
                                    <Image
                                        src={preview}
                                        alt={`Selected image ${index + 1}`}
                                        width={280}
                                        height={140}
                                        className="object-cover w-full h-32"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full p-1"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <div className="flex space-x-2">
                            {/* Image upload button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-[var(--accent)] rounded-full hover:bg-[#1a1a1a]"
                                disabled={selectedImages.length >= 4}
                            >
                                <PhotoIcon className="h-5 w-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                                disabled={selectedImages.length >= 4}
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Character counter */}
                            <span className={`text-sm ${remainingChars <= 20
                                ? remainingChars <= 0
                                    ? 'text-red-500'
                                    : 'text-yellow-500'
                                : 'text-[var(--secondary)]'
                                }`}>
                                {remainingChars}
                            </span>

                            {/* Tweet button */}
                            <button
                                type="submit"
                                disabled={isDisabled}
                                className={`bg-white text-black rounded-full px-5 py-2 font-bold hover:bg-opacity-90 transition duration-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isPending || isUploading ? 'Posting...' : 'Tweet'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
} 