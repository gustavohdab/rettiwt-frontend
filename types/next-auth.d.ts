import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Extend the default session type
     */
    interface Session {
        accessToken?: string;
        refreshToken?: string;
        user: {
            id: string;
            username: string;
        } & DefaultSession["user"];
    }

    /**
     * Extend the default user type
     */
    interface User extends DefaultUser {
        username?: string;
        accessToken?: string;
        refreshToken?: string;
    }
}

declare module "next-auth/jwt" {
    /**
     * Extend the JWT type
     */
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        username?: string;
        id?: string;
    }
}
