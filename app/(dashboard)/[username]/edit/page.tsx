import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UserService from "@/lib/api/services/user.service";
import EditProfileForm from "@/components/profile/EditProfileForm";

export default async function EditProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect("/login");
    }

    // Await the params to get username
    const { username } = await params;

    // Only allow users to edit their own profile
    if (session.user.username !== username) {
        return redirect(`/${username}`);
    }

    // Fetch current user's profile data
    const response = await UserService.getUserProfile(username);

    if (response.status !== "success" || !response.data?.user) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-xl font-bold">Error</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {response.message || "Failed to load profile data"}
                </p>
            </div>
        );
    }

    const user = response.data.user;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                <h1 className="text-xl font-bold">Edit profile</h1>
            </div>
            <EditProfileForm user={user} />
        </div>
    );
}