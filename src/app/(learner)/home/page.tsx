'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Avatar, Typography, Button } from 'antd';
import {
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  StarOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;

const HomePage = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['LEARNER'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    COACH: '/summary',
  });
  // Mock data
  const stats = {
    totalCourses: 12,
    completedCourses: 8,
    achievements: 15,
    studyTime: 45, // hours
  };

  const recentCourses = [
    {
      title: 'Kỹ thuật cơ bản Pickleball',
      progress: 75,
      instructor: 'Coach Minh',
      nextLesson: 'Buổi 5: Kỹ thuật serve',
    },
    {
      title: 'Chiến thuật đôi',
      progress: 30,
      instructor: 'Coach Lan',
      nextLesson: 'Buổi 3: Phối hợp đôi',
    },
    {
      title: 'Luyện tập nâng cao',
      progress: 90,
      instructor: 'Coach Hùng',
      nextLesson: 'Buổi 8: Kỹ thuật smash',
    },
  ];

  const achievements = [
    { title: 'Hoàn thành khóa cơ bản', icon: '🏆', date: '2024-01-15' },
    { title: 'Học viên tích cực', icon: '⭐', date: '2024-01-10' },
    { title: 'Tham gia 10 buổi học', icon: '📚', date: '2024-01-05' },
  ];

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div>
      <Title level={2}>Chào mừng trở lại, Learner! 👋</Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng khóa học"
              value={stats.totalCourses}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={stats.completedCourses}
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thành tích"
              value={stats.achievements}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thời gian học"
              value={stats.studyTime}
              suffix="giờ"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Recent Courses */}
        <Col xs={24} lg={16}>
          <Card title="Khóa học đang học" extra={<Button type="link">Xem tất cả</Button>}>
            <List
              dataSource={recentCourses}
              renderItem={(course) => (
                <List.Item
                  actions={[
                    <Button key={course.title} type="primary" icon={<PlayCircleOutlined />}>
                      Tiếp tục
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<BookOutlined />} />}
                    title={course.title}
                    description={
                      <div>
                        <Text type="secondary">Giảng viên: {course.instructor}</Text>
                        <br />
                        <Text type="secondary">Bài tiếp theo: {course.nextLesson}</Text>
                        <br />
                        <Progress percent={course.progress} size="small" />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Achievements */}
        <Col xs={24} lg={8}>
          <Card title="Thành tích gần đây">
            <List
              dataSource={achievements}
              renderItem={(achievement) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<span style={{ fontSize: '24px' }}>{achievement.icon}</span>}
                    title={achievement.title}
                    description={achievement.date}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
