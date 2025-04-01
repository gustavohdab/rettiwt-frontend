export default function DashboardLoading() {
    return (
        <div className="w-full h-screen animate-pulse bg-gradient-to-b from-gray-900/20 to-gray-800/20">
            <div className="max-w-2xl mx-auto pt-16">
                <div className="h-8 w-32 bg-gray-800/30 rounded mb-8 mx-auto"></div>
                <div className="space-y-6 px-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-800/30 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
} 