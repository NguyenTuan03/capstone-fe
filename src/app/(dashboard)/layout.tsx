'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

import Header from '@/modules/auth/header';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Sider, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: <IntlMessages id="menu.dashboard" />,
      },
      { key: '/users', icon: <UserOutlined />, label: <IntlMessages id="menu.users" /> },
      { key: '/coaches', icon: <TeamOutlined />, label: <IntlMessages id="menu.coaches" /> },
      { key: '/sessions', icon: <CalendarOutlined />, label: <IntlMessages id="menu.sessions" /> },
      { key: '/content', icon: <BookOutlined />, label: <IntlMessages id="menu.content" /> },
      {
        key: '/analytics',
        icon: <BarChartOutlined />,
        label: <IntlMessages id="menu.analytics" />,
      },
      { key: '/settings', icon: <DollarOutlined />, label: <IntlMessages id="menu.settings" /> },
    ],
    [],
  );

  const savedOpenKeys =
    typeof window !== 'undefined' ? localStorage.getItem('admin_open_keys') || '[]' : '[]';
  const [openKeys, setOpenKeys] = useState<string[]>(JSON.parse(savedOpenKeys));

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
    const titleIds: { [key: string]: string } = {
      dashboard: 'breadcrumb.dashboard',
      users: 'breadcrumb.users',
      coaches: 'breadcrumb.coaches',
      sessions: 'breadcrumb.sessions',
      content: 'breadcrumb.content',
      analytics: 'breadcrumb.analytics',
      settings: 'breadcrumb.settings',
      transactions: 'breadcrumb.transactions',
    };
    return titleIds[segment] ? <IntlMessages id={titleIds[segment]} /> : segment;
  };

  return (
    <Layout className="min-h-screen" style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        defaultCollapsed={false}
        width={240}
        className="!bg-white border-r border-gray-200"
        style={{ minHeight: '100vh' }}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">PL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-800">PICKLE-LEARN</span>
              <span className="text-xs text-gray-500">Admin Portal</span>
            </div>
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
        />
      </Sider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content
          className="py-4"
          style={{
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#f5f5f5',
            marginLeft: '0',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <div className="mb-4">
            <Breadcrumb>
              <Breadcrumb.Item key="home">
                <IntlMessages id="breadcrumb.admin" />
              </Breadcrumb.Item>
              {segments.map((seg, idx) => (
                <Breadcrumb.Item key={`${seg}-${idx}`}>{getPageTitle(seg)}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div
            className="bg-white rounded-lg shadow p-6"
            style={{ minHeight: 'calc(100vh - 140px)' }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

/*
// ORIGINAL AUTH LOGIC (commented out for UI development)

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
