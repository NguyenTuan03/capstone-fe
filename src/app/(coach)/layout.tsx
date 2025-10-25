'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Rate, Badge, Tooltip } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
  LineChartOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const CoachLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get current selected key from pathname
  const getSelectedKey = () => {
    if (pathname === '/coach' || pathname === '/coach/summary') return 'overview';
    return pathname.split('/').pop() || 'overview';
  };

  const menuItems = [
    {
      key: 'overview',
      icon: <LineChartOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch dạy',
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: 'Học viên',
    },
    {
      key: 'course-manage',
      icon: <BookOutlined />,
      label: 'Khóa học',
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Phân tích học viên',
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: 'Kho nội dung',
    },
    {
      key: 'video-conference',
      icon: <VideoCameraOutlined />,
      label: 'Video Conference',
    },
    {
      key: 'income',
      icon: <DollarOutlined />,
      label: 'Thu nhập',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        collapsedWidth={80}
        trigger={null}
        style={{
          background: '#059669',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? '20px 0' : '20px 24px',
            textAlign: 'center',
            color: 'white',
            fontSize: collapsed ? '18px' : '22px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
            background: 'rgba(0,0,0,0.1)',
          }}
        >
          {collapsed ? 'PL' : 'PICKLE-LEARN'}
        </div>

        {/* Profile Section */}
        {!collapsed && (
          <div
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
              <Avatar
                size={72}
                style={{
                  backgroundColor: '#10b981',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  border: '3px solid rgba(255,255,255,0.3)',
                }}
              >
                LDH
              </Avatar>
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid white',
                }}
              />
            </div>
            <div
              style={{ color: 'white', fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}
            >
              Lại Đức Hùng
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '13px',
                marginBottom: '10px',
                background: 'rgba(255,255,255,0.1)',
                padding: '4px 12px',
                borderRadius: '12px',
                display: 'inline-block',
              }}
            >
              Huấn luyện viên Pro
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <Rate disabled defaultValue={4.8} style={{ fontSize: '14px' }} allowHalf />
            </div>
            <div
              style={{
                color: '#ffd700',
                fontSize: '15px',
                fontWeight: '600',
                marginTop: '6px',
              }}
            >
              ⭐ 4.8/5
            </div>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              padding: '24px 0',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Tooltip title="Lại Đức Hùng - 4.8/5" placement="right">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={48}
                  style={{
                    backgroundColor: '#10b981',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  LDH
                </Avatar>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid #059669',
                  }}
                />
              </div>
            </Tooltip>
          </div>
        )}

        {/* Menu */}
        <Menu
          theme="dark"
          selectedKeys={[getSelectedKey()]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => {
            if (key === 'overview') {
              router.push('/summary');
            } else {
              router.push(`${key}`);
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            marginTop: '8px',
            paddingBottom: '80px',
          }}
          className="coach-sidebar-menu"
        />

        {/* Collapse Button */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              background: 'rgba(255,255,255,0.1)',
              width: collapsed ? '48px' : 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            {collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <>
                <MenuFoldOutlined style={{ marginRight: '8px' }} />
                {!collapsed && <span style={{ fontSize: '14px' }}>Thu gọn</span>}
              </>
            )}
          </div>
        </div>

        <style jsx global>{`
          .coach-sidebar-menu .ant-menu-item {
            margin: 4px 12px !important;
            border-radius: 8px !important;
            height: 44px !important;
            line-height: 44px !important;
            transition: all 0.2s !important;
          }

          .coach-sidebar-menu .ant-menu-item:hover {
            background: rgba(255, 255, 255, 0.15) !important;
          }

          .coach-sidebar-menu .ant-menu-item-selected {
            background: rgba(255, 255, 255, 0.2) !important;
            font-weight: 500 !important;
          }

          .coach-sidebar-menu .ant-menu-item-selected::after {
            display: none !important;
          }

          .coach-sidebar-menu .ant-menu-item .anticon {
            font-size: 18px !important;
          }
        `}</style>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
        {/* Header */}
        <div
          style={{
            background: 'white',
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Badge count={3} offset={[-5, 5]}>
            <div
              style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <BellOutlined style={{ fontSize: '20px' }} />
            </div>
          </Badge>
        </div>

        <Content
          style={{
            margin: 0,
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CoachLayout;
