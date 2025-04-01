'use client';

import { useState, useRef, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { createReply } from '@/lib/actions/tweet.actions';
import { uploadTweetMedia } from '@/lib/actions/upload.actions';
import type { Tweet } from '@/types';

interface ReplyComposerProps {
    parentTweet: Tweet;
    onSuccess?: (tweet: Tweet) => void;
    autoFocus?: boolean;
}

export default function ReplyComposer({ parentTweet, onSuccess, autoFocus = false }: ReplyComposerProps) {
    const { data: session } = useSession();
    const [isPending, startTransition] = useTransition();
    const [content, setContent] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedImagesPreview, setSelectedImagesPreview] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto focus the textarea if needed
    if (autoFocus && textareaRef.current) {
        textareaRef.current.focus();
    }

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

    const handleReplySubmit = async (e: React.FormEvent) => {
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

        // Use Server Action to create reply
        startTransition(() => {
            createReply({
                content,
                parentId: parentTweet._id,
                images: uploadedImageUrls
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

                // Call onSuccess callback if provided
                if (onSuccess && result.data) {
                    onSuccess(result.data);
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
        <form onSubmit={handleReplySubmit} className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex">
                {/* User avatar */}
                <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm font-medium">
                                {session.user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    {/* Reply to indicator */}
                    <div className="text-sm text-gray-500 mb-2">
                        Replying to <span className="text-blue-500">@{parentTweet.author.username}</span>
                    </div>

                    {/* Text area */}
                    <textarea
                        ref={textareaRef}
                        placeholder="Tweet your reply"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border-0 focus:ring-0 text-lg placeholder-gray-500 tracking-wide min-h-[80px] bg-transparent resize-none"
                        maxLength={290} // Allow a bit extra to show the counter going negative
                    />

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
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-1">
                            {/* Image upload button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-blue-500 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
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
                                : 'text-gray-500'
                                }`}>
                                {remainingChars}
                            </span>

                            {/* Reply button */}
                            <button
                                type="submit"
                                disabled={isDisabled}
                                className={`bg-blue-500 text-white rounded-full px-4 py-1.5 font-bold hover:bg-blue-600 transition duration-200 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isPending || isUploading ? 'Posting...' : 'Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
} 