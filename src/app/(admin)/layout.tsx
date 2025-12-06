'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Spin, Empty, message } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  TrophyOutlined,
  BarChartOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import jwtAxios from '@/@crema/services/jwt-auth';
import { useWebSocket } from '@/@crema/hooks/useWebSocket';
import type { Notification as NotificationType } from '@/types/notification';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchNotifications = useCallback(async () => {
    setNotificationLoading(true);
    try {
      const response = await jwtAxios.get('/notifications', {
        params: {
          page: 1,
          pageSize: 10,
          filter: 'user.id_eq_1',
        },
      });
      setNotifications(response.data?.items || []);
    } catch (error) {
      message.error('Không thể tải thông báo');
    } finally {
      setNotificationLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // WebSocket connection for real-time notifications
  const { isConnected, markAsRead: markNotificationAsReadSocket } = useWebSocket({
    onNotification: (notification: NotificationType) => {
      // Add new notification to the beginning of the list
      setNotifications((prev) => {
        // Check if notification already exists to avoid duplicates
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;
        // Show a subtle notification toast
        message.info({
          content: (
            <div>
              <div className="font-semibold">{notification.title}</div>
              <div className="text-sm text-gray-600 mt-1">{notification.body}</div>
            </div>
          ),
          duration: 4,
          icon: <BellOutlined />,
        });
        return [notification, ...prev];
      });
    },
    onConnect: () => {},
    onDisconnect: (reason) => {
      if (reason === 'io server disconnect') {
        message.warning('Mất kết nối với server. Đang thử kết nối lại...');
      }
    },
    onError: (error) => {
      // Don't show error message for every connection attempt to avoid spam
    },
    enabled: true,
  });

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const handleNotificationClick = async (notification: NotificationType) => {
    setNotificationDropdownOpen(false);

    // Update local state immediately for better UX
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    );

    // Mark as read via API
    try {
      await jwtAxios.put(`/notifications/${notification.id}/read`);
    } catch (error) {
      // Revert local state on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: false } : n)),
      );
      message.error('Không thể đánh dấu thông báo đã đọc');
    }

    // Emit socket event to mark as read (if connected)
    if (isConnected) {
      markNotificationAsReadSocket(notification.id);
    }

    // Navigate if needed
    if (notification.navigateTo) {
      router.push(notification.navigateTo);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await jwtAxios.put('/notifications/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      message.success('Đã đánh dấu tất cả thông báo đã đọc');
    } catch (error) {
      message.error('Không thể đánh dấu tất cả thông báo đã đọc');
    }
  };

  const notificationDropdown = (
    <div className="w-96 max-h-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
      <div className="px-5 py-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="text-base font-bold text-white">Thông báo</div>
              {isConnected ? (
                <span
                  className="w-2 h-2 bg-green-300 rounded-full animate-pulse"
                  title="Đã kết nối"
                />
              ) : (
                <span className="w-2 h-2 bg-red-300 rounded-full" title="Chưa kết nối" />
              )}
            </div>
            <div className="text-xs text-blue-50">{unreadCount} chưa đọc</div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                type="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                className="text-white hover:bg-white/20 text-xs"
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
            <Badge count={unreadCount} showZero={false} />
          </div>
        </div>
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {notificationLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12">
            <Empty description="Không có thông báo" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-5 py-4 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.isRead
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                          : 'bg-gray-200'
                      }`}
                    >
                      <BellOutlined
                        className={!notification.isRead ? 'text-white' : 'text-gray-500'}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm text-gray-900 line-clamp-1">
                        {notification.title}
                      </div>
                      {!notification.isRead && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.body}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Người dùng',
    },
    {
      key: '/coaches',
      icon: <TeamOutlined />,
      label: 'Huấn luyện viên',
    },
    {
      key: '/curriculum',
      icon: <BookOutlined />,
      label: 'Khóa học',
    },
    {
      key: '/achievements',
      icon: <TrophyOutlined />,
      label: 'Thành tựu',
    },
    {
      key: '/configurations',
      icon: <ControlOutlined />,
      label: 'Cấu hình',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: 'Thống kê',
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('remember');
          localStorage.removeItem('refresh_token');
        }
      } catch {}
      router.push('/signin');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const getSelectedKey = () => {
    if (pathname.includes('/dashboard')) return '/dashboard';
    if (pathname.includes('/users')) return '/users';
    if (pathname.includes('/coaches')) return '/coaches';
    if (pathname.includes('/curriculum')) return '/curriculum';
    if (pathname.includes('/achievements')) return '/achievements';
    if (pathname.includes('/configurations')) return '/configurations';
    if (pathname.includes('/statistics')) return '/statistics';
    return '/dashboard';
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-gradient-to-b !from-slate-900 !to-slate-800 shadow-2xl"
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-slate-700/50">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">🏓</span>
              </div>
              <div>
                <span className="font-bold text-lg text-white block leading-tight">
                  Pickle Learn
                </span>
                <span className="text-xs text-slate-400">Admin Panel</span>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-bold text-xl">🏓</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="border-r-0 mt-6 px-4 !bg-transparent"
          style={{
            border: 'none',
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 260 }}>
        {/* Header */}
        <Header className="!bg-white/80 backdrop-blur-xl !px-8 flex items-center justify-between shadow-sm sticky top-0 z-10 border-b border-gray-100">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-10 h-10 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all"
          />

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              popupRender={() => notificationDropdown}
              open={notificationDropdownOpen}
              onOpenChange={setNotificationDropdownOpen}
            >
              <div className="relative">
                <Button
                  type="text"
                  icon={<BellOutlined className="text-lg" />}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all relative"
                  title={isConnected ? 'Đã kết nối WebSocket' : 'Chưa kết nối WebSocket'}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {/* WebSocket connection indicator */}
                <span
                  className={`absolute bottom-1 right-1 top-[25%] w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  title={isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
                />
              </div>
            </Dropdown>

            {/* User Profile */}
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-purple-100">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="!bg-gradient-to-br !from-blue-500 !to-purple-600 shadow-lg"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">admin@example.com</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-[calc(100vh-64px)]">
          {children}
        </Content>
      </Layout>

      <style jsx global>{`
        /* Sidebar Menu Styles */
        .ant-menu-inline.ant-menu-root .ant-menu-item {
          margin: 6px 0 !important;
          border-radius: 12px !important;
          height: 48px !important;
          line-height: 48px !important;
          padding-left: 20px !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-weight: 500;
          transition: all 0.3s ease !important;
        }

        .ant-menu-inline.ant-menu-root .ant-menu-item:hover {
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(139, 92, 246, 0.15) 100%
          ) !important;
          color: #fff !important;
          transform: translateX(4px);
        }

        .ant-menu-inline.ant-menu-root .ant-menu-item-selected {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          color: #fff !important;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transform: translateX(4px);
        }

        .ant-menu-inline.ant-menu-root .ant-menu-item-selected .anticon {
          color: #fff !important;
        }

        .ant-menu-inline.ant-menu-root .ant-menu-item .anticon {
          font-size: 20px;
          margin-right: 12px;
        }

        /* Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* Backdrop Blur Support */
        @supports (backdrop-filter: blur(20px)) {
          .backdrop-blur-xl {
            backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </Layout>
  );
}
