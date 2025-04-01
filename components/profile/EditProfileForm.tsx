"use client";

import { User } from "@/types/models";
import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { updateProfile } from "@/lib/actions/user.actions";
import { uploadAvatar, uploadProfileHeader } from "@/lib/actions/upload.actions";
import { useRouter } from "next/navigation";
import getImageUrl from "@/lib/utils/getImageUrl";
import { useSession } from "next-auth/react";

interface EditProfileFormProps {
    user: User;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
    const router = useRouter();
    const { update: updateSession } = useSession();
    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
    });

    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [previewHeader, setPreviewHeader] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const headerInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        avatarInputRef.current?.click();
    };

    const handleHeaderClick = () => {
        headerInputRef.current?.click();
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleHeaderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewHeader(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            // Handle image uploads first
            if (avatarInputRef.current?.files?.length) {
                const avatarFormData = new FormData();
                avatarFormData.append("avatar", avatarInputRef.current.files[0]);
                const uploadResult = await uploadAvatar(avatarFormData);

                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || "Failed to upload avatar");
                }
            }

            if (headerInputRef.current?.files?.length) {
                const headerFormData = new FormData();
                headerFormData.append("header", headerInputRef.current.files[0]);
                const uploadResult = await uploadProfileHeader(headerFormData);

                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || "Failed to upload header image");
                }
            }

            // Update profile info separately
            const updateResult = await updateProfile(formData);

            if (!updateResult.success) {
                throw new Error(updateResult.error || "Failed to update profile");
            }

            // Update session to refresh user data in the UI (including sidebar)
            await updateSession();

            setSuccess(true);
            // Navigate back to profile page after successful update
            setTimeout(() => {
                router.push(`/${user.username}`);
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {/* Header image upload */}
            <div className="mb-6">
                <div
                    className="h-48 bg-blue-100 dark:bg-blue-900 relative cursor-pointer"
                    onClick={handleHeaderClick}
                >
                    {(previewHeader || user.headerImage) && (
                        <Image
                            src={previewHeader || getImageUrl(user.headerImage)}
                            alt="Header preview"
                            fill
                            className="object-cover"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">Change header image</span>
                    </div>
                    <input
                        ref={headerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHeaderChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Avatar upload */}
            <div className="mb-6 relative">
                <div
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-black cursor-pointer absolute -top-16 left-4"
                    onClick={handleAvatarClick}
                >
                    <Image
                        src={previewAvatar || getImageUrl(user.avatar)}
                        alt="Avatar preview"
                        width={128}
                        height={128}
                        className="rounded-full h-32 w-32 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                        <span className="text-white font-medium">Change</span>
                    </div>
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Add margin to account for the avatar positioning */}
            <div className="mt-16">
                {/* Name input */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black"
                        maxLength={50}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50</p>
                </div>

                {/* Bio input */}
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black"
                        rows={3}
                        maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/160</p>
                </div>

                {/* Location input */}
                <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black"
                        maxLength={30}
                    />
                </div>

                {/* Website input */}
                <div className="mb-6">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                    </label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-black"
                    />
                </div>

                {/* Status messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                        Profile updated successfully!
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.push(`/${user.username}`)}
                        className="px-4 py-2 mr-2 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </form>
    );
} 