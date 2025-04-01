import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchInput from '../search/SearchInput';

// This is a Server Component - it can fetch data directly
export default async function RightSidebar() {
    // In a real app, we would fetch trending topics and suggested users from the server
    const trendingTopics = [
        { id: 1, name: 'Programming', tweetCount: '125K' },
        { id: 2, name: 'JavaScript', tweetCount: '89K' },
        { id: 3, name: 'React', tweetCount: '65K' },
        { id: 4, name: 'NextJS', tweetCount: '42K' },
        { id: 5, name: 'TypeScript', tweetCount: '35K' },
    ];

    const suggestedUsers = [
        { id: 1, name: 'Jane Smith', username: 'janesmith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, name: 'John Doe', username: 'johndoe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { id: 3, name: 'Alice Johnson', username: 'alicej', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    ];

    return (
        <div className="hidden lg:block w-[350px] h-screen overflow-y-auto px-4 py-4 sticky top-0">
            {/* Search Bar */}
            <div className="relative mb-6">
                <SearchInput />
            </div>

            {/* Trends */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
                <h2 className="text-xl font-bold px-4 pt-3 pb-2">Trends for you</h2>
                <div>
                    {trendingTopics.map((topic) => (
                        <div
                            key={topic.id}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer"
                        >
                            <div className="text-xs text-gray-500">Trending</div>
                            <div className="font-bold">#{topic.name}</div>
                            <div className="text-xs text-gray-500">{topic.tweetCount} Tweets</div>
                        </div>
                    ))}
                </div>
                <div className="px-4 py-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer rounded-b-xl">
                    Show more
                </div>
            </div>

            {/* Who to follow */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h2 className="text-xl font-bold px-4 pt-3 pb-2">Who to follow</h2>
                <div>
                    {suggestedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer flex items-center"
                        >
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{user.name}</div>
                                <div className="text-gray-500 truncate">@{user.username}</div>
                            </div>
                            <button className="bg-black text-white dark:bg-white dark:text-black rounded-full px-4 py-1 font-bold text-sm">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
                <div className="px-4 py-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer rounded-b-xl">
                    Show more
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 px-4 text-xs text-gray-500">
                <span className="mr-2 hover:underline cursor-pointer">Terms of Service</span>
                <span className="mr-2 hover:underline cursor-pointer">Privacy Policy</span>
                <span className="mr-2 hover:underline cursor-pointer">Cookie Policy</span>
                <span className="mr-2 hover:underline cursor-pointer">Accessibility</span>
                <span className="mr-2 hover:underline cursor-pointer">Ads info</span>
                <span className="hover:underline cursor-pointer">More</span>
                <div className="mt-1">© 2023 Twitter Clone</div>
            </div>
        </div>
    );
} 