'use client';

import { EventEmitter } from 'events';
import { createContext, useContext } from 'react';
import { type Socket } from 'socket.io-client';

interface ISocketContext {
    socket: Socket | null;
    isConnected: boolean;
    emitter: EventEmitter | null;
}

// Create a default emitter instance
// Note: Ensure 'events' polyfill/bundler handles this correctly in browser
const defaultEmitter = typeof window !== 'undefined' ? new EventEmitter() : null;

export const SocketContext = createContext<ISocketContext>({
    socket: null,
    isConnected: false,
    emitter: defaultEmitter,
});

export const useSocket = (): ISocketContext => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}; 