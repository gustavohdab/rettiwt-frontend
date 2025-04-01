'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import TweetComposer from '../tweet/TweetComposer';

interface TweetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function TweetModal({ isOpen, onClose, onSuccess }: TweetModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Prevent scrolling when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle successful tweet submission
    const handleSuccess = () => {
        onClose();
        if (onSuccess) {
            onSuccess();
        }
    };

    if (!isOpen || !mounted) return null;

    // Use portal to render at the root level, outside of any stacking contexts
    return createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
            style={{ zIndex: 2147483647 }} // Use max possible z-index
        >
            <div className="bg-[var(--background)] rounded-xl w-full max-w-lg relative m-4">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:bg-gray-800 hover:text-white"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <div className="p-4">
                    <TweetComposer onSuccess={handleSuccess} />
                </div>
            </div>
        </div>,
        document.body
    );
} 