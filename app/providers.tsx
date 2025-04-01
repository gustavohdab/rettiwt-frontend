'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Application providers wrapper
 */
export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
} 