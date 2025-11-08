'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Button, Spin, Timeline } from 'antd';

import { TeamOutlined, ClockCircleOutlined } from '@ant-design/icons';

// import DashboardApiService from '@/services/dashboardApi';
// import { DashboardStats, DashboardFilters } from '@/types/dashboard';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Text, Title } = Typography;

export default function DashboardPage() {
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });
  // const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const [filters] = useState<DashboardFilters>({
  //   dateRange: ['2024-11-01', '2024-12-31'],
  //   userType: 'all',
  //   sessionType: 'all',
  // });

  useEffect(() => {
    // TODO: replace with real fetch that sets loading when data is ready
    setLoading(false);
  }, []);
  if (isChecking) {
    return <div>Loading...</div>;
  }
  if (!isAuthorized) {
    return <div>Unauthorized</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  const recentActivities = [
    {
      color: 'blue',
      title: 'HLV Nguyễn Văn A đăng video mới',
      time: '2 giờ trước',
    },
    {
      color: 'green',
      title: 'HLV Trần Thị B được duyệt chứng chỉ',
      time: '5 giờ trước',
    },
    {
      color: 'orange',
      title: '3 HLV mới chờ duyệt hồ sơ',
      time: '1 ngày trước',
    },
  ];

  const pendingItems = [
    {
      title: '5 nội dung chờ duyệt',
      subtitle: 'Cần xem xét trong 24h',
      icon: <ClockCircleOutlined className="text-orange-500 text-xl" />,
      bgColor: '#fff7e6',
    },
    {
      title: '2 HLV chờ duyệt',
      subtitle: 'Hồ sơ mới đăng ký',
      icon: <TeamOutlined className="text-blue-500 text-xl" />,
      bgColor: '#e6f7ff',
    },
  ];

  return (
    <div>
      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div>
                <Title level={4} className="!mb-1">
                  Hoạt động gần đây
                </Title>
                <Text type="secondary" className="text-sm">
                  Các hoạt động mới nhất trên nền tảng
                </Text>
              </div>
            }
            bordered={false}
            className="rounded-lg shadow-sm"
            bodyStyle={{ paddingTop: 24 }}
          >
            <Timeline
              items={recentActivities.map((activity) => ({
                dot:
                  activity.color === 'blue' ? (
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  ) : activity.color === 'green' ? (
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                  ),
                children: (
                  <div>
                    <Text strong className="text-base block mb-1">
                      {activity.title}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      {activity.time}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Pending Items */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div>
                <Title level={4} className="!mb-1">
                  Nội dung cần chú ý
                </Title>
                <Text type="secondary" className="text-sm">
                  Các nội dung cần xem xét
                </Text>
              </div>
            }
            bordered={false}
            className="rounded-lg shadow-sm"
            bodyStyle={{ paddingTop: 24 }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {pendingItems.map((item, index) => (
                <Card
                  key={index}
                  className="rounded-lg border border-gray-200"
                  style={{ backgroundColor: item.bgColor }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="flex justify-between items-center">
                    <Space size="middle">
                      {item.icon}
                      <div>
                        <Text strong className="text-base block">
                          {item.title}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {item.subtitle}
                        </Text>
                      </div>
                    </Space>
                    <Button type="primary" className="bg-black hover:bg-gray-800 border-black">
                      Xem ngay
                    </Button>
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
