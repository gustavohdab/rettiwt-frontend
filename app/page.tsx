import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rettiwt",
  description: "A Twitter clone built with Next.js and React",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="max-w-lg w-full mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">Rettiwt</h1>
        <p className="text-xl mb-8">
          Connect with friends and the world around you with Rettiwt
        </p>
        <div className="space-y-4">
          <Link href="/login" className="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200">
            Log In
          </Link>
          <Link href="/register" className="w-full block text-center bg-black border border-gray-700 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-md transition duration-200">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
