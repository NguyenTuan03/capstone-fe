'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { TOKEN_KEY } from '@/@crema/constants/AppConst';
import type { Notification } from '@/types/notification';

export type NotificationData = Notification;

interface UseWebSocketOptions {
  onNotification?: (notification: NotificationData) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  markAsRead: (notificationId: number) => void;
  reconnect: () => void;
  disconnect: () => void;
}

/**
 * Custom hook for managing WebSocket connection to receive real-time notifications
 *
 * @param options - Configuration options for the WebSocket connection
 * @returns WebSocket connection state and methods
 */
export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const { onNotification, onConnect, onDisconnect, onError, enabled = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getApiUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Remove trailing slashes
    apiUrl = apiUrl.replace(/\/+$/, '');

    // IMPORTANT: Remove ALL API-related paths for socket connection
    // Socket.io connects directly to the base server URL, not through API routes
    // Remove patterns like:
    // - /api/v1
    // - /api/v2
    // - /api (standalone)
    // Order matters: remove /api/v1 first, then /api
    apiUrl = apiUrl.replace(/\/api\/v\d+(\/|$)/, ''); // Remove /api/v1, /api/v2, etc. (with or without trailing slash)
    apiUrl = apiUrl.replace(/\/api(\/|$)/, ''); // Remove standalone /api (with or without trailing slash)

    // Final cleanup: remove any trailing slashes again
    apiUrl = apiUrl.replace(/\/+$/, '');

    // Ensure we have a valid URL
    if (!apiUrl) {
      console.error('[useWebSocket] NEXT_PUBLIC_API_URL is empty after processing');
      return '';
    }

    return apiUrl;
  }, []);

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem(TOKEN_KEY) ||
      sessionStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')
    );
  }, []);

  const connect = useCallback(() => {
    if (typeof window === 'undefined' || !enabled) return;

    // Don't create a new connection if one already exists and is connected
    if (socketRef.current?.connected) {
      return;
    }

    // If socket exists but not connected, disconnect it first
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const token = getToken();
    if (!token) {
      console.warn('[useWebSocket] No access token found for socket connection');
      setError(new Error('No access token available'));
      return;
    }

    const apiUrl = getApiUrl();
    if (!apiUrl) {
      console.error('[useWebSocket] NEXT_PUBLIC_API_URL is not set');
      setError(new Error('API URL not configured'));
      return;
    }

    setIsConnecting(true);
    setError(null);

    // For NestJS WebSocketGateway with namespace '/ws':
    // - Socket.io client should connect to: baseUrl/ws
    // - Socket.io will automatically parse the namespace from the URL
    // - The actual connection will be to: baseUrl/socket.io/?EIO=4&transport=websocket
    // - With namespace query parameter: /ws

    // Ensure base URL doesn't have trailing slash or /ws already
    // Also remove /api if it's still there (should have been removed in getApiUrl, but double-check)
    let baseUrl = apiUrl.replace(/\/+$/, '').replace(/\/ws\/?$/, '');
    baseUrl = baseUrl.replace(/\/api$/, ''); // Remove /api if still present

    // Build socket URL with namespace - socket.io will parse /ws as namespace
    // IMPORTANT: For socket.io-client, when you use io('http://example.com/ws'),
    // it will parse the namespace from the URL path
    // The URL should be: https://domain.com/ws (NOT https://domain.com/api/ws)
    const socketUrl = `${baseUrl}/ws`;

    // Connect to socket with namespace /ws
    // Socket.io client will automatically:
    // 1. Parse base URL: baseUrl
    // 2. Parse namespace: /ws from the URL path
    // 3. Connect to: baseUrl/socket.io/?EIO=4&transport=websocket
    // 4. With namespace in the connection path
    const socket = io(socketUrl, {
      query: {
        accessToken: token,
      },
      // Socket.io default path - NestJS uses this by default
      path: '/socket.io/',
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
      // Connection options
      upgrade: true,
      rememberUpgrade: false,
    });

    socketRef.current = socket;

    // Add debug listeners to see what's happening
    if (process.env.NODE_ENV === 'development') {
      socket.on(
        'connect_error',
        (err: Error & { type?: string; description?: string; context?: any }) => {
          console.error('[useWebSocket] Connection error details:', {
            message: err.message,
            type: err.type,
            description: err.description,
            context: err.context,
          });
        },
      );
    }

    // Listen for notification.send event
    socket.on('notification.send', (data: NotificationData) => {
      onNotification?.(data);
    });

    // Handle connection events
    socket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setIsConnecting(false);
      onDisconnect?.(reason);

      // Auto-reconnect on unexpected disconnects (not manual disconnect)
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          if (enabled && getToken()) {
            connect();
          }
        }, 2000);
      }
    });

    socket.on('connect_error', (err: Error) => {
      setIsConnecting(false);
      setIsConnected(false);
      setError(err);
      onError?.(err);
    });

    socket.on('reconnect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socket.on('reconnect_attempt', () => {
      setIsConnecting(true);
    });

    socket.on('reconnect_error', (err: Error) => {
      setError(err);
    });

    socket.on('reconnect_failed', () => {
      setIsConnecting(false);
      setError(new Error('Failed to reconnect to WebSocket server'));
    });
  }, [enabled, getToken, getApiUrl, onNotification, onConnect, onDisconnect, onError]);

  const markAsRead = useCallback((notificationId: number) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('notification.read', notificationId);
    } else {
      console.warn('[useWebSocket] Socket not connected, cannot mark notification as read');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    // Small delay before reconnecting to ensure cleanup
    setTimeout(() => {
      connect();
    }, 100);
  }, [connect, disconnect]);

  // Setup connection on mount and when enabled changes
  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }

    // Only connect if not already connected
    if (!socketRef.current || !socketRef.current.connected) {
      connect();
    }

    // Cleanup on unmount or when enabled becomes false
    return () => {
      if (!enabled) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Only depend on enabled, not on connect/disconnect to avoid re-connections

  // Reconnect when token changes (but only if we have a token and socket is not connected)
  useEffect(() => {
    if (!enabled) return;

    const token = getToken();
    // Only reconnect if we have a token and socket exists but is not connected
    // This prevents unnecessary reconnections on every render
    if (token && socketRef.current && !socketRef.current.connected && !isConnecting) {
      const timeoutId = setTimeout(() => {
        if (socketRef.current && !socketRef.current.connected) {
          reconnect();
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isConnecting]); // Only depend on enabled and isConnecting

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    error,
    markAsRead,
    reconnect,
    disconnect,
  };
};
