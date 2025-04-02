'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SocketProvider } from '../context/SocketProvider'; // Adjust path as needed

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Application providers wrapper
 */
export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <SocketProvider>
                {children}
            </SocketProvider>
        </SessionProvider>
    );
} 