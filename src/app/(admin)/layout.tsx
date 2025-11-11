'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
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
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Quản lý User',
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
      key: '/course-verification',
      icon: <FileTextOutlined />,
      label: 'Nội dung',
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
    if (pathname.includes('/course-verification')) return '/course-verification';
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
        className="!bg-white shadow-lg"
        width={250}
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
        <div className="h-16 flex items-center justify-center px-6 border-b">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="border-r-0 mt-4 px-3"
          style={{
            border: 'none',
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        {/* Header */}
        <Header className="!bg-white !px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-12 h-12"
          />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined className="text-lg" />}
                className="w-12 h-12 flex items-center justify-center"
              />
            </Badge>

            {/* User Profile */}
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-lg">
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-pink-500 to-purple-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">Admin User</div>
                  <div className="text-xs text-gray-400">admin@example.com</div>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>

      <style jsx global>{`
        .ant-menu-item {
          margin: 4px 0 !important;
          border-radius: 8px !important;
          height: 44px !important;
          line-height: 44px !important;
        }

        .ant-menu-item:hover {
          background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%) !important;
          color: #ec4899 !important;
        }

        .ant-menu-item-selected {
          background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%) !important;
          color: #fff !important;
        }

        .ant-menu-item-selected .anticon {
          color: #fff !important;
        }

        .ant-menu-item .anticon {
          font-size: 18px;
        }
      `}</style>
    </Layout>
  );
}
