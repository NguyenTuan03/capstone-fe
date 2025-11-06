'use client';

import React from 'react';
import { Card, Button, Avatar, Badge, Row, Col, Typography, Space } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  StarOutlined,
  CalendarOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  PlusOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;

const CoachOverview = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  const todaySessions = [
    {
      id: 1,
      title: 'Pickleball cơ bản',
      time: '14:00 - 15:00',
      students: 4,
      avatar: 'NVA',
      color: '#10b981',
      hasOnline: true,
    },
    {
      id: 2,
      title: 'Kỹ thuật nâng cao',
      time: '16:00 - 17:00',
      students: 2,
      avatar: 'TTB',
      color: '#10b981',
      hasOnline: false,
    },
  ];

  const stats = [
    {
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      label: 'Tổng học viên',
      value: '45',
      change: '+8%',
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      icon: <BookOutlined style={{ fontSize: 24 }} />,
      label: 'Khóa học đang có',
      value: '8',
      change: '+2',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      icon: <DollarOutlined style={{ fontSize: 24 }} />,
      label: 'Thu nhập tháng này',
      value: '15.5M',
      change: '+12%',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      icon: <StarOutlined style={{ fontSize: 24 }} />,
      label: 'Đánh giá TB',
      value: '4.8/5',
      change: '+0.2',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
  ];

  const quickStats = [
    { label: 'Tuần này', value: '12 buổi học' },
    { label: 'Doanh thu', value: '8.5M VND', highlight: true },
    { label: 'Học viên mới', value: '+5', highlight: true },
  ];

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={3} style={{ marginBottom: 24, marginTop: 0 }}>
        Tổng quan
      </Title>

      {/* Welcome Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #3b82f6 100%)',
          border: 'none',
          marginBottom: 24,
          borderRadius: 12,
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: 'white', marginBottom: 8, marginTop: 0 }}>
              Chào mừng trở lại, Lại Đức Hùng! 👋
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              Hôm nay bạn có 2 buổi học đang chờ
            </Text>
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <Badge status="success" />
              <Text style={{ color: 'white' }}>Đang hoạt động</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 8 }}>
                Thứ Năm, 23 tháng 10, 2025
              </Text>
            </div>
          </Col>
          <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: 12,
                minWidth: 180,
                textAlign: 'center',
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <Title level={1} style={{ color: 'white', margin: 0, fontSize: 48 }}>
                4.8
              </Title>
              <Text style={{ color: 'white', fontSize: 14 }}>Đánh giá trung bình</Text>
              <div style={{ marginTop: 8 }}>
                <Text style={{ color: '#ffd700', fontSize: 18 }}>⭐⭐⭐⭐☆</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: '20px' } }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <Badge
                    count={stat.change}
                    style={{
                      background: '#d1fae5',
                      color: '#059669',
                      fontWeight: 500,
                      border: 'none',
                    }}
                  />
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {stat.label}
                  </Text>
                  <Title level={2} style={{ margin: '4px 0 0 0' }}>
                    {stat.value}
                  </Title>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Row */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Schedule */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarOutlined style={{ color: '#10b981' }} />
                <span>Lịch dạy hôm nay</span>
                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                  2 buổi học
                </Text>
              </div>
            }
            extra={
              <Button type="link" style={{ color: '#10b981', padding: 0 }}>
                Xem tất cả <ArrowRightOutlined />
              </Button>
            }
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: 8,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 250px' }}
                  >
                    <Badge dot status="success">
                      <Avatar size={48} style={{ background: session.color, fontWeight: 'bold' }}>
                        {session.avatar}
                      </Avatar>
                    </Badge>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {session.title}
                      </Title>
                      <Space size={16} style={{ marginTop: 4, flexWrap: 'wrap' }}>
                        <Text type="secondary">
                          <CalendarOutlined /> {session.time}
                        </Text>
                        <Text type="secondary">
                          <TeamOutlined /> {session.students} người
                        </Text>
                      </Space>
                    </div>
                  </div>
                  <Space wrap>
                    {session.hasOnline && (
                      <Button
                        type="primary"
                        icon={<VideoCameraOutlined />}
                        style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
                      >
                        Vào lớp
                      </Button>
                    )}
                    <Button>Chi tiết</Button>
                  </Space>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Right Column - Quick Actions */}
        <Col xs={24} lg={10}>
          {/* Quick Stats */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ArrowUpOutlined style={{ color: '#3b82f6' }} />
                <span>Thống kê nhanh</span>
              </div>
            }
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginBottom: 16 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                  }}
                >
                  <Text type="secondary">{stat.label}</Text>
                  <Text
                    strong
                    style={{
                      fontSize: 16,
                      color: stat.highlight ? '#10b981' : '#000',
                    }}
                  >
                    {stat.value}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>

          {/* Quick Actions */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span>
                <span>Thao tác nhanh</span>
              </div>
            }
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                block
                style={{
                  height: 48,
                  background: '#059669',
                  borderColor: '#059669',
                  fontWeight: 500,
                }}
              >
                Tạo khóa học mới
              </Button>
              <Button
                icon={<FileTextOutlined />}
                size="large"
                block
                style={{ height: 48, fontWeight: 500 }}
              >
                Quản lý nội dung
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CoachOverview;
