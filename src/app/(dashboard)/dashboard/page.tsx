'use client';

import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Button, Space, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  TrophyOutlined,
  BookOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useJWTAuth();

  // Mock data for dashboard
  const statsData = [
    {
      title: 'Total Users',
      value: 1248,
      icon: <UserOutlined className="text-blue-500" />,
      change: 12.5,
      color: '#1890ff',
    },
    {
      title: 'Active Coaches',
      value: 89,
      icon: <TeamOutlined className="text-green-500" />,
      change: 8.2,
      color: '#52c41a',
    },
    {
      title: 'Video Lessons',
      value: 156,
      icon: <VideoCameraOutlined className="text-purple-500" />,
      change: -2.1,
      color: '#722ed1',
    },
    {
      title: 'Monthly Revenue',
      value: 45680,
      prefix: '$',
      icon: <DollarOutlined className="text-orange-500" />,
      change: 15.3,
      color: '#fa8c16',
    },
  ];

  const recentActivities = [
    {
      key: '1',
      user: 'John Doe',
      action: 'Completed lesson',
      lesson: 'Basic Forehand Technique',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      key: '2',
      user: 'Sarah Wilson',
      action: 'Booked session',
      lesson: 'Advanced Strategy with Coach Mike',
      time: '15 minutes ago',
      status: 'processing',
    },
    {
      key: '3',
      user: 'Mike Johnson',
      action: 'Uploaded video',
      lesson: 'Swing Analysis Submission',
      time: '1 hour ago',
      status: 'success',
    },
    {
      key: '4',
      user: 'Emily Brown',
      action: 'Failed payment',
      lesson: 'Premium Subscription',
      time: '2 hours ago',
      status: 'error',
    },
  ];

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Lesson/Content',
      dataIndex: 'lesson',
      key: 'lesson',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: 'Success' },
          processing: { color: 'blue', text: 'Processing' },
          error: { color: 'red', text: 'Error' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <Title level={2} className="text-white mb-2">
          Welcome back, {user?.name || 'Admin'}! 👋
        </Title>
        <Text className="text-blue-100">
          Here&apos;s what&apos;s happening with your Pickleball Learning Platform today.
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm">{stat.title}</Text>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.prefix}{stat.value.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-2">
                    {stat.change > 0 ? (
                      <ArrowUpOutlined className="text-green-500 mr-1" />
                    ) : (
                      <ArrowDownOutlined className="text-red-500 mr-1" />
                    )}
                    <Text
                      className={`text-sm ${
                        stat.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {Math.abs(stat.change)}%
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">vs last month</Text>
                  </div>
                </div>
                <div className="text-3xl" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts and Analytics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Platform Performance" className="h-full">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text>User Engagement</Text>
                  <Text strong>78%</Text>
                </div>
                <Progress percent={78} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text>AI Analysis Accuracy</Text>
                  <Text strong>92%</Text>
                </div>
                <Progress percent={92} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text>Content Completion Rate</Text>
                  <Text strong>65%</Text>
                </div>
                <Progress percent={65} strokeColor="#fa8c16" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick Actions" className="h-full">
            <Space direction="vertical" className="w-full">
              <Button type="primary" block icon={<UserOutlined />}>
                Verify New Users
              </Button>
              <Button block icon={<TeamOutlined />}>
                Review Coach Applications
              </Button>
              <Button block icon={<BookOutlined />}>
                Manage Content
              </Button>
              <Button block icon={<TrophyOutlined />}>
                View Reports
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="Recent Activities" extra={<Button type="link">View All</Button>}>
        <Table
          dataSource={recentActivities}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
}
  