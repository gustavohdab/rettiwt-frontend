import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twitter Clone',
  description: 'A Twitter clone built with Next.js and React',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-4xl w-full mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-blue-500 mb-6">
            Twitter Clone
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Connect with friends and the world around you with our Twitter clone
            built using the latest Next.js 15 and React 19 features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition duration-200 text-center"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-blue-500 border border-blue-500 rounded-full font-bold text-lg hover:bg-blue-50 transition duration-200 text-center"
            >
              Log In
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-blue-500 rounded-xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Real-time tweet updates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Follow your favorite accounts
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Engage with likes and retweets
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Personalized timeline
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
