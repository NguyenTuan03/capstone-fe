'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { TOKEN_KEY } from '@/@crema/constants/AppConst';
import type { Notification } from '@/types/notification';
import toast, { Toast } from 'react-hot-toast';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  markNotificationAsRead: (notificationId: number) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  markNotificationAsRead: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const SocketProvider = ({ children, enabled = true }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState<Notification[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getApiUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    // Remove trailing slashes
    apiUrl = apiUrl.replace(/\/+$/, '');

    // Remove ALL API-related paths for socket connection
    apiUrl = apiUrl.replace(/\/api\/v\d+(\/|$)/, '');
    apiUrl = apiUrl.replace(/\/api(\/|$)/, '');

    // Final cleanup
    apiUrl = apiUrl.replace(/\/+$/, '');

    if (!apiUrl) {
      console.error('[SocketContext] NEXT_PUBLIC_API_URL is empty after processing');
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

  // Process notification queue - similar to mobile app
  useEffect(() => {
    if (notificationQueue.length === 0 || isProcessingQueue || !enabled) return;

    const processNextNotification = async () => {
      setIsProcessingQueue(true);
      const notification = notificationQueue[0];

      // Get icon based on notification type
      const getIcon = () => {
        switch (notification.type) {
          case 'SUCCESS':
            return <CheckCircleOutlined className="text-green-500 text-lg" />;
          case 'ERROR':
            return <CloseCircleOutlined className="text-red-500 text-lg" />;
          case 'INFO':
          default:
            return <InfoCircleOutlined className="text-blue-500 text-lg" />;
        }
      };

      // Show beautiful toast notification with react-hot-toast
      toast(
        (t: Toast) => (
          <div
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => {
              toast.dismiss(t.id);
              if (notification.navigateTo && typeof window !== 'undefined') {
                window.location.href = notification.navigateTo;
              }
            }}
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                {notification.title}
              </div>
              <div className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.body}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ),
        {
          duration: 5000,
          position: 'top-right',
          style: {
            padding: '16px',
            minWidth: '320px',
            maxWidth: '420px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
          },
          className: 'notification-toast',
          // Don't use default icon since we render custom icon in JSX
        },
      );

      // Wait before processing next notification (similar to mobile app)
      await new Promise((resolve) => setTimeout(resolve, 3500));

      setNotificationQueue((prev) => prev.slice(1));
      setIsProcessingQueue(false);
    };

    processNextNotification();
  }, [notificationQueue, isProcessingQueue, enabled]);

  // Initialize socket connection
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      // Cleanup if disabled
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setNotificationQueue([]);
      setIsProcessingQueue(false);
      return;
    }

    const token = getToken();
    if (!token) {
      // No token available, disconnect if connected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const apiUrl = getApiUrl();
    if (!apiUrl) {
      console.error('[SocketContext] API URL not configured');
      return;
    }

    // Don't create new connection if one exists and is connected
    if (socketRef.current?.connected) {
      return;
    }

    // Disconnect existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Build socket URL with namespace /ws
    const baseUrl = apiUrl
      .replace(/\/+$/, '')
      .replace(/\/ws\/?$/, '')
      .replace(/\/api$/, '');
    const socketUrl = `${baseUrl}/ws`;

    // Create new socket connection
    const newSocket = io(socketUrl, {
      query: {
        accessToken: token,
      },
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: false,
    });

    socketRef.current = newSocket;

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);

      // Auto-reconnect on unexpected disconnects
      if (reason === 'io server disconnect') {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (enabled && getToken()) {
            // Trigger reconnection by updating state
            setSocket((prev) => {
              if (prev && !prev.connected) {
                prev.connect();
              }
              return prev;
            });
          }
        }, 2000);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('[SocketContext] Connection error:', err);
      setIsConnected(false);
    });

    newSocket.on('reconnect', () => {
      setIsConnected(true);
    });

    // Listen for notifications - add to queue instead of showing immediately
    newSocket.on('notification.send', (notification: Notification) => {
      // Add to queue instead of showing immediately (similar to mobile app)
      setNotificationQueue((prev) => {
        // Check if notification already exists to avoid duplicates
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        return [...prev, notification];
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [enabled, getToken, getApiUrl]);

  const markNotificationAsRead = useCallback(
    (notificationId: number) => {
      if (!notificationId || typeof notificationId !== 'number') {
        console.warn('[SocketContext] Invalid notification ID:', notificationId);
        return;
      }
      if (socket && isConnected) {
        socket.emit('notification.read', notificationId);
      }
    },
    [socket, isConnected],
  );

  return (
    <SocketContext.Provider value={{ socket, isConnected, markNotificationAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};
