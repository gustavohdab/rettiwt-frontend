import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function FollowingLoading() {
    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                    <ArrowLeftIcon className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">Following</h1>
            </div>
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    );
} 