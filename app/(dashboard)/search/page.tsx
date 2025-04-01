import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Suspense } from 'react';
import SearchService from '@/lib/api/services/search.service';
import SearchTabs from '@/components/search/SearchTabs';
import SearchResults from '@/components/search/SearchResults';
import SearchInput from '@/components/search/SearchInput';
import { Metadata } from 'next';

interface SearchPageProps {
    searchParams: {
        q?: string;
        type?: 'users' | 'tweets' | 'all';
        page?: string;
    };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
    return {
        title: searchParams.q
            ? `${searchParams.q} - Search / Twitter Clone`
            : 'Search / Twitter Clone',
        description: 'Search for users and tweets',
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const session = await getServerSession(authOptions);
    const query = searchParams.q || '';
    const type = (searchParams.type as 'users' | 'tweets' | 'all') || 'all';
    const page = parseInt(searchParams.page || '1');
    const limit = 10;

    if (!query) {
        return (
            <div className="max-w-2xl mx-auto p-4">
                <div className="mb-4">
                    <SearchInput />
                </div>
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-xl font-semibold">
                        Search for users or tweets
                    </p>
                </div>
            </div>
        );
    }

    const response = await SearchService.search(
        query,
        type,
        page,
        limit,
        session?.accessToken
    );

    const { results, pagination } = response.status === 'success' && response.data
        ? response.data
        : { results: {}, pagination: { page: 1, limit: 10, total: 0, pages: 0 } };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-4">
                <SearchInput initialQuery={query} />
            </div>

            <SearchTabs
                query={query}
                activeType={type}
                counts={results.counts}
            />

            <Suspense fallback={<div>Loading results...</div>}>
                <SearchResults
                    results={results}
                    type={type}
                    page={page}
                    query={query}
                    pagination={pagination}
                    currentUserId={session?.user?.id}
                />
            </Suspense>
        </div>
    );
}
