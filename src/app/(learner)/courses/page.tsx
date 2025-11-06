'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Button, Tag, Typography, Input, Select, Badge } from 'antd';
import {
  SearchOutlined,
  StarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CoursesPage = () => {
  const router = useRouter();
  const { isAuthorized, isChecking } = useRoleGuard(['LEARNER'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    COACH: '/summary',
  });
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Kỹ thuật cơ bản Pickleball',
      coach: 'Coach Minh',
      rating: 4.8,
      reviews: 125,
      duration: '8 tuần',
      level: 'Cơ bản',
      status: 'upcoming',
      courseType: 'individual',
      price: 'Miễn phí',
      location: 'Sân Pickleball Quận 1',
      startDate: '15/02/2024',
      endDate: '15/04/2024',
      totalSessions: 16,
      image: '/assets/images/pickleball.jpg',
      weeklySchedule: [
        { day: 'Thứ 2', time: '18:00-19:30', sessions: 1 },
        { day: 'Thứ 4', time: '18:00-19:30', sessions: 1 },
        { day: 'Thứ 6', time: '18:00-19:30', sessions: 1 },
      ],
    },
    {
      id: 2,
      title: 'Chiến thuật đôi nâng cao',
      coach: 'Coach Lan',
      rating: 4.9,
      reviews: 89,
      duration: '6 tuần',
      level: 'Nâng cao',
      status: 'ongoing',
      courseType: 'group',
      price: '299,000 VNĐ',
      location: 'Sân Pickleball Quận 3',
      startDate: '01/02/2024',
      endDate: '15/03/2024',
      totalSessions: 12,
      currentEnrollment: 6,
      maxGroupSize: 8,
      availableSlots: 2,
      image: '/assets/images/pickleball.jpg',
      weeklySchedule: [
        { day: 'Thứ 3', time: '19:00-20:30', sessions: 1 },
        { day: 'Thứ 5', time: '19:00-20:30', sessions: 1 },
        { day: 'Chủ nhật', time: '09:00-10:30', sessions: 1 },
      ],
    },
    {
      id: 3,
      title: 'Luyện tập thể lực cho Pickleball',
      coach: 'Coach Hùng',
      rating: 4.7,
      reviews: 65,
      duration: '4 tuần',
      level: 'Trung cấp',
      status: 'upcoming',
      courseType: 'group',
      price: '199,000 VNĐ',
      location: 'Sân Pickleball Quận 7',
      startDate: '20/02/2024',
      endDate: '20/03/2024',
      totalSessions: 8,
      currentEnrollment: 4,
      maxGroupSize: 6,
      availableSlots: 2,
      image: '/assets/images/pickleball.jpg',
      weeklySchedule: [
        { day: 'Thứ 2', time: '17:00-18:30', sessions: 1 },
        { day: 'Thứ 4', time: '17:00-18:30', sessions: 1 },
      ],
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const typeMatch = selectedTypeFilter === 'all' || course.courseType === selectedTypeFilter;
    const levelMatch = selectedLevelFilter === 'all' || course.level === selectedLevelFilter;
    const statusMatch = selectedStatusFilter === 'all' || course.status === selectedStatusFilter;
    return typeMatch && levelMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'blue';
      case 'ongoing':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual':
        return 'green';
      case 'group':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Cơ bản':
        return 'green';
      case 'Trung cấp':
        return 'blue';
      case 'Nâng cao':
        return 'red';
      default:
        return 'default';
    }
  };

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div>
      <Title level={2}>Khóa học Pickleball</Title>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Search placeholder="Tìm kiếm khóa học..." prefix={<SearchOutlined />} size="large" />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              size="large"
              value={selectedStatusFilter}
              onChange={setSelectedStatusFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="upcoming">Sắp diễn ra</Option>
              <Option value="ongoing">Đang diễn ra</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Loại hình"
              style={{ width: '100%' }}
              size="large"
              value={selectedTypeFilter}
              onChange={setSelectedTypeFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="individual">Cá nhân</Option>
              <Option value="group">Nhóm</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trình độ"
              style={{ width: '100%' }}
              size="large"
              value={selectedLevelFilter}
              onChange={setSelectedLevelFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="Cơ bản">Cơ bản</Option>
              <Option value="Trung cấp">Trung cấp</Option>
              <Option value="Nâng cao">Nâng cao</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Courses List */}
      <Row gutter={[24, 24]}>
        {filteredCourses.map((course) => (
          <Col xs={24} lg={12} xl={8} key={course.id}>
            <Card
              hoverable
              cover={
                <div
                  style={{
                    height: 200,
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text type="secondary">Hình ảnh khóa học</Text>
                </div>
              }
              actions={[
                <Button
                  key={course.id}
                  type="primary"
                  icon={course.courseType === 'individual' ? <UserOutlined /> : <TeamOutlined />}
                  style={{
                    backgroundColor: course.courseType === 'individual' ? '#52c41a' : '#722ed1',
                    borderColor: course.courseType === 'individual' ? '#52c41a' : '#722ed1',
                  }}
                  onClick={() => router.push('/payment')}
                >
                  {course.courseType === 'individual' ? 'Đăng ký cá nhân' : 'Đăng ký'}
                </Button>,
              ]}
            >
              <Card.Meta
                title={course.title}
                description={
                  <div>
                    <Text type="secondary">Giảng viên: {course.coach}</Text>
                    <br />

                    {/* Rating and Duration */}
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <StarOutlined style={{ color: '#faad14' }} />
                        <Text strong>{course.rating}</Text>
                        <Text type="secondary">({course.reviews} đánh giá)</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ClockCircleOutlined style={{ color: '#666' }} />
                        <Text type="secondary">{course.duration}</Text>
                      </div>
                    </div>

                    {/* Location */}
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <EnvironmentOutlined style={{ color: '#666' }} />
                      <Text type="secondary">{course.location}</Text>
                    </div>

                    {/* Status and Type Badges */}
                    <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Badge
                        color={getStatusColor(course.status)}
                        text={course.status === 'upcoming' ? 'Sắp diễn ra' : 'Đang diễn ra'}
                      />
                      <Badge
                        color={getTypeColor(course.courseType)}
                        text={course.courseType === 'individual' ? 'Cá nhân' : 'Nhóm'}
                      />
                      <Tag color={getLevelColor(course.level)}>{course.level}</Tag>
                    </div>

                    {/* Date Range */}
                    <div style={{ marginTop: 12 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}
                      >
                        <CalendarOutlined style={{ color: '#666' }} />
                        <Text type="secondary">
                          {course.startDate} - {course.endDate}
                        </Text>
                      </div>
                      <Text type="secondary">{course.totalSessions} buổi học</Text>
                    </div>

                    {/* Weekly Schedule */}
                    <div style={{ marginTop: 12 }}>
                      <Text strong style={{ fontSize: 12 }}>
                        Lịch học:
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        {course.weeklySchedule.map((schedule, index) => (
                          <div key={index} style={{ fontSize: 12, color: '#666' }}>
                            {schedule.day}: {schedule.time}
                            {course.courseType === 'group' && ` (${schedule.sessions} buổi)`}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div style={{ marginTop: 12 }}>
                      {course.courseType === 'individual' ? (
                        <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                          {course.price}
                        </Text>
                      ) : (
                        <div>
                          <Text strong style={{ color: '#722ed1', fontSize: 16 }}>
                            {course.price}/người
                          </Text>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                            {course.currentEnrollment}/{course.maxGroupSize} học viên • Còn{' '}
                            {course.availableSlots} chỗ
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CoursesPage;
