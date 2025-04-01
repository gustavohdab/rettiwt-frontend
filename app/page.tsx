import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "A Twitter clone built with Next.js and React",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-6">Twitter Clone</h1>
          <p className="text-xl mb-8">
            Connect with friends and the world around you with our Twitter clone
            built using the latest Next.js 15 and React 19 features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link href="/login" className="btn btn-outline">
              Log In
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md bg-[var(--background)] rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-3 text-[var(--secondary)]">
              <li className="flex items-center">
                <span className="mr-2 text-[var(--accent)]">✓</span>
                Real-time tweet updates
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-[var(--accent)]">✓</span>
                Follow your favorite accounts
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-[var(--accent)]">✓</span>
                Engage with likes and retweets
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-[var(--accent)]">✓</span>
                Personalized timeline
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
