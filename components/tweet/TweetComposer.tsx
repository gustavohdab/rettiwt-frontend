'use client';

import { createTweet } from '@/lib/actions/tweet.actions';
import { uploadTweetMedia } from '@/lib/actions/upload.actions';
import { getCurrentUser } from '@/lib/actions/user-data.actions';
import getImageUrl from '@/lib/utils/getImageUrl';
import { TweetComposerProps } from '@/types';
import { User } from '@/types/models';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition, useEffect } from 'react';

export default function TweetComposer({ placeholder = "What's happening?", parentId, onSuccess }: TweetComposerProps = {}) {
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
    const router = useRouter();

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
                parentId
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

                // Don't need to refresh the page since we'll handle the update with onSuccess
                // router.refresh();
            });
        });
    };

    const remainingChars = 280 - content.length;
    const isOverLimit = remainingChars < 0;
    const isDisabled = isOverLimit || (!content.trim() && selectedImages.length === 0) || isPending || isUploading;

    // Add this new function for highlighting hashtags
    const renderContentWithHighlightedHashtags = () => {
        if (!content) return null;

        const words = content.split(/\b/);
        return words.map((word, index) => {
            if (word.startsWith('#') && word.length > 1) {
                return (
                    <span key={index} className="text-blue-500">
                        {word}
                    </span>
                );
            }
            return <span key={index}>{word}</span>;
        });
    };

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
                        <div className="pointer-events-none absolute inset-0 opacity-0">
                            {renderContentWithHighlightedHashtags()}
                        </div>
                        <textarea
                            placeholder={placeholder}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border-0 focus:ring-0 text-lg placeholder-gray-500 tracking-wide min-h-[100px] bg-transparent resize-none"
                            maxLength={290}
                        />
                    </div>

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