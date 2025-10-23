'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

import Header from '@/modules/auth/header';

const { Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
      },
      { key: '/users', icon: <UserOutlined />, label: 'Người dùng' },
      { key: '/coaches', icon: <TeamOutlined />, label: 'Huấn luyện viên' },
      {
        key: '/achievements',
        icon: <TrophyOutlined />,
        label: 'Thành tựu',
      },
      { key: '/quality', icon: <StarOutlined />, label: 'Giám sát chất lượng' },
      { key: '/sessions', icon: <CalendarOutlined />, label: 'Quản lý buổi học' },
      {
        key: '/course-verification',
        icon: <CheckCircleOutlined />,
        label: 'Xác minh khóa học',
      },
      {
        key: '/statistics',
        icon: <BarChartOutlined />,
        label: 'Thống kê',
      },
    ],
    [],
  );

  const savedOpenKeys =
    typeof window !== 'undefined' ? localStorage.getItem('admin_open_keys') || '[]' : '[]';
  const [openKeys, setOpenKeys] = useState<string[]>(JSON.parse(savedOpenKeys));
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('admin_open_keys', JSON.stringify(openKeys));
    } catch {}
  }, [openKeys]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (typeof key === 'string') {
      router.push(key);
    }
  };

  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const getPageTitle = (segment: string) => {
    const titleMap: { [key: string]: string } = {
      dashboard: 'Tổng quan',
      users: 'Người dùng',
      coaches: 'Huấn luyện viên',
      achievements: 'Thành tựu',
      quality: 'Giám sát chất lượng',
      sessions: 'Quản lý buổi học',
      'course-verification': 'Xác minh khóa học',
      statistics: 'Thống kê',
    };
    return titleMap[segment] || segment;
  };

  return (
    <Layout className="min-h-screen" style={{ minHeight: '100vh' }}>
      <Sider
        collapsed={collapsed}
        defaultCollapsed={false}
        width={240}
        collapsedWidth={80}
        className="!bg-white border-r border-gray-200"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 100,
        }}
        trigger={null}
      >
        <div className="h-12 flex items-center justify-center border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">PICKLE-LEARN</span>
                <span className="text-xs text-gray-500">Admin Portal</span>
              </div>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname === '/' ? '/dashboard' : pathname.split('?')[0]]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys as string[])}
          items={items}
          onClick={handleMenuClick}
          className="!border-r-0"
          style={{ flex: 1 }}
        />

        {/* Custom Collapse Button */}
        <div
          className="h-12 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            backgroundColor: 'transparent',
          }}
        >
          {collapsed ? (
            <RightOutlined
              style={{
                fontSize: '14px',
                color: '#666',
                transition: 'all 0.2s ease',
              }}
            />
          ) : (
            <LeftOutlined
              style={{
                fontSize: '14px',
                color: '#666',
                transition: 'all 0.2s ease',
              }}
            />
          )}
        </div>
      </Sider>
      <Layout
        style={{
          minHeight: '100vh',
          marginLeft: collapsed ? '80px' : '240px',
          transition: 'margin-left 0.2s ease',
        }}
      >
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? '80px' : '240px',
            zIndex: 99,
            transition: 'left 0.2s ease',
            borderLeft: 'none',
            borderRight: 'none',
          }}
        >
          <Header />
        </div>
        <Content
          style={{
            height: 'calc(100vh - 48px)',
            backgroundColor: '#f5f5f5',
            marginTop: '48px',
            padding: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            className="bg-white rounded-lg shadow"
            style={{
              height: 'calc(100vh - 96px)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '24px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {children}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

/*
// AUTHENTICATION DISABLED FOR UI DEVELOPMENT
// TO ENABLE: Uncomment the auth logic below and comment out current layout

'use client';

import AppLoader from '@/@crema/components/AppLoader';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import Header from '@/modules/auth/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useJWTAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AppLoader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
*/
