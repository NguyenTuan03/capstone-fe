'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Card } from 'antd';

export default function AdminTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname.includes('/dashboard')) return 'overview';
    if (pathname.includes('/coaches')) return 'coaches';
    if (pathname.includes('/course-verification')) return 'content';
    if (pathname.includes('/curriculum')) return 'courses';
    if (pathname.includes('/statistics')) return 'statistics';
    if (pathname.includes('/users')) return 'users';
    if (pathname.includes('/achievements')) return 'achievements';
    return 'overview';
  };

  return (
    <Card
      className="mb-8"
      bodyStyle={{ padding: '8px 16px' }}
      style={{
        borderRadius: '8px',
        background: 'linear-gradient(to right, #fff5f0, #fff0f5)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #ffe8e8',
      }}
    >
      <div className="flex justify-center">
        <Tabs
          activeKey={getActiveKey()}
          onChange={(key) => {
            const routes: { [key: string]: string } = {
              overview: '/dashboard',
              coaches: '/coaches',
              content: '/course-verification',
              courses: '/curriculum',
              statistics: '/statistics',
              users: '/users',
              achievements: '/achievements',
            };
            router.push(routes[key]);
          }}
          size="middle"
          className="admin-tabs-centered"
          items={[
            { key: 'overview', label: 'Tổng quan' },
            { key: 'users', label: 'Người dùng' },
            { key: 'coaches', label: 'Quản lý Huấn luyện viên' },
            { key: 'courses', label: 'Quản lý Khóa học' },
            { key: 'content', label: 'Quản lý Nội dung' },
            { key: 'achievements', label: 'Quản lý Thành tựu' },
            { key: 'statistics', label: 'Thống kê' },
          ]}
        />
      </div>
    </Card>
  );
}
