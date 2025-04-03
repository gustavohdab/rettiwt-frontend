'use client';

import * as ApiTypes from "@/types/api"; // Import API types for notification payload
import { TrendingHashtag, Tweet } from "@/types/models";
import { EventEmitter } from 'events';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { SocketContext } from './SocketContext';

interface SocketProviderProps {
    children: React.ReactNode;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const emitterRef = useRef<EventEmitter | null>(null);
    const currentUserId = session?.user?.id;

    if (typeof window !== 'undefined' && !emitterRef.current) {
        emitterRef.current = new EventEmitter();
    }

    useEffect(() => {
        let newSocket: Socket | null = null;

        if (status === 'authenticated' && session?.accessToken && currentUserId) {
            console.log('Attempting Socket.IO connection...');
            newSocket = io(SOCKET_URL, {
                auth: {
                    token: session.accessToken,
                },
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            newSocket.on('connect', () => {
                console.log('Socket.IO Connected:', newSocket?.id);
                setIsConnected(true);
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Socket.IO Disconnected:', reason);
                setIsConnected(false);
                if (reason === 'io server disconnect') {
                    console.warn('Server disconnected the socket. Possible auth issue?');
                }
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket.IO Connection Error:', error.message);
            });

            const handleUserFollow = (data: { followedUserId: string; followerUserId: string }) => {
                console.log('Socket Event Received: user:follow', data);
                emitterRef.current?.emit('recommendations:remove', { userId: data.followedUserId });
                emitterRef.current?.emit('followStatusChanged', { targetUserId: data.followedUserId, isFollowing: true });
            };

            // Define type for the expected user data subset
            type UnfollowedUserData = {
                _id: string;
                username: string;
                name: string;
                avatar: string;
            };

            const handleUserUnfollow = (data: {
                unfollowedUserId: string;
                unfollowerUserId: string;
                unfollowedUserData: UnfollowedUserData; // Expect user data
            }) => {
                console.log('Socket Event Received: user:unfollow', data);
                // Emit event to add user back to recommendations client-side
                if (data.unfollowedUserData) {
                    emitterRef.current?.emit('recommendations:add', { user: data.unfollowedUserData });
                } else {
                    // Fallback to refetch if data is missing (shouldn't happen)
                    console.warn('Unfollow event missing user data, falling back to refetch');
                    emitterRef.current?.emit('recommendations:refetch');
                }
                emitterRef.current?.emit('followStatusChanged', { targetUserId: data.unfollowedUserId, isFollowing: false });
            };

            const handleNewTweet = (data: { tweet: Tweet }) => {
                console.log('Socket Event Received: tweet:new', data);
                if (data?.tweet?.author?._id !== currentUserId) {
                    console.log('New tweet is from another user, emitting internal event.');
                    emitterRef.current?.emit('newTweetReceived', data.tweet);
                } else {
                    console.log('New tweet is from the current user, ignoring for real-time update.');
                }
            };

            const handleTrendsUpdate = (data: { trendingHashtags: TrendingHashtag[] }) => {
                console.log('Socket Event Received: trends:update', data);
                emitterRef.current?.emit('trends:update', data.trendingHashtags);
            };

            // --- Add Handler for New Notifications ---
            const handleNewNotification = (data: ApiTypes.Notification) => {
                console.log('Socket Event Received: notification:new', data);
                // Forward the event via the internal emitter
                emitterRef.current?.emit('notification:new', data);
            };
            // -----------------------------------------

            // --- Register Listeners ---
            newSocket.on('user:follow', handleUserFollow);
            newSocket.on('user:unfollow', handleUserUnfollow);
            newSocket.on('tweet:new', handleNewTweet);
            newSocket.on('trends:update', handleTrendsUpdate);
            newSocket.on('notification:new', handleNewNotification); // Listen for the event
            // -------------------------

            setSocket(newSocket);
        }

        return () => {
            if (socket) {
                console.log('Disconnecting Socket.IO...');
                socket.off('user:follow');
                socket.off('user:unfollow');
                socket.off('tweet:new');
                socket.off('trends:update');
                socket.off('notification:new'); // Unregister listener
                socket.off('connect');
                socket.off('disconnect');
                socket.off('connect_error');
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        };
    }, [status, session?.accessToken, router, currentUserId]);

    const contextValue = useMemo(() => ({
        socket,
        isConnected,
        emitter: emitterRef.current,
    }), [socket, isConnected]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}; 