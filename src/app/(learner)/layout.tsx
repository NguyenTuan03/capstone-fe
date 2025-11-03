'use client';

import React from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  RobotOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => router.push('/home'),
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Khóa học',
      onClick: () => router.push('/courses'),
    },
    {
      key: 'my-courses',
      icon: <FileTextOutlined />,
      label: 'Của tôi',
      onClick: () => router.push('/my-courses'),
    },
    {
      key: 'ai',
      icon: <RobotOutlined />,
      label: 'AI',
      onClick: () => router.push('/ai'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Cá nhân',
      onClick: () => router.push('/profile'),
    },
  ];

  const userMenuItems = [
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
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        try {
          if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
          }
        } catch {}
        router.push('/signin');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>🏓 Pickleball Learning</h2>
        </div>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text" icon={<UserOutlined />}>
            Learner
          </Button>
        </Dropdown>
      </Header>

      <Layout>
        <Sider
          width={250}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['home']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>

        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#f5f5f5',
              borderRadius: '8px',
              padding: '24px',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
