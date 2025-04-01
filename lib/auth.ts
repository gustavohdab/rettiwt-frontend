import AuthService from "@/lib/api/services/auth.service";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                usernameOrEmail: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.usernameOrEmail || !credentials?.password) {
                    return null;
                }

                try {
                    const result = await AuthService.login({
                        usernameOrEmail: credentials.usernameOrEmail,
                        password: credentials.password,
                    });

                    if (result.status === "success" && result.data) {
                        // Return the user object and tokens without duplicating properties
                        return {
                            id: result.data.user._id,
                            name: result.data.user.name,
                            email: result.data.user.email,
                            image: result.data.user.avatar,
                            username: result.data.user.username,
                            accessToken: result.data.tokens.access,
                            refreshToken: result.data.tokens.refresh,
                            bio: result.data.user.bio,
                            verified: result.data.user.verified,
                        };
                    }

                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    username: user.username,
                    id: user.id,
                };
            }

            // Return previous token if the access token has not expired yet
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    username: token.username as string,
                    id: token.id as string,
                };
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
