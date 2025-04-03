import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is public
    if (publicPaths.some((path) => path === pathname)) {
        return NextResponse.next();
    }

    // For API routes, let the API handle authentication
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    // Check if user is authenticated
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Redirect to login if not authenticated
    if (!token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", encodeURI(pathname));
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
// Specify which routes this middleware applies to
export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. .*\\..* (files with extensions, e.g. favicon.ico)
         * 4. /login and /register are handled inside the middleware
         */
        "/((?!_next|.*\\..*).+)",
    ],
};
