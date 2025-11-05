'use client';

import React, { useState } from 'react';
import { Card, Button, Typography, Tag, Progress, List, Avatar, Badge } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;

const CourseDetailPage = () => {
  const router = useRouter();
  const { isAuthorized, isChecking } = useRoleGuard(['LEARNER'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    COACH: '/summary',
  });
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Mock data - in real app, this would come from props or API
  const courses = [
    {
      id: 1,
      title: 'Cơ bản Pickleball cho người mới bắt đầu',
      coach: 'Huấn luyện viên Nguyễn Văn A',
      rating: 4.8,
      reviews: 124,
      price: '500.000 VNĐ',
      duration: '4 tuần',
      level: 'Cơ bản',
      image:
        'https://cdn.britannica.com/25/236225-050-59A4051E/woman-daughter-doubles-pickleball.jpg',
      location: 'Sân Pickleball Quận 3',
      courseType: 'individual',
      startDate: '2025-01-15',
      endDate: '2025-02-12',
      status: 'upcoming', // 'upcoming', 'ongoing', 'completed'
      weeklySchedule: [
        { day: 'Thứ 3', time: '19:00-20:30', sessions: 4 },
        { day: 'Thứ 5', time: '19:00-20:30', sessions: 4 },
      ],
      totalSessions: 8,
      availableSlots: 3,
    },
    {
      id: 2,
      title: 'Nâng cao kỹ thuật giao bóng',
      coach: 'Huấn luyện viên Trần Thị B',
      rating: 4.9,
      reviews: 89,
      price: '1.200.000 VNĐ',
      duration: '3 tuần',
      level: 'Trung cấp',
      image:
        'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2024/07/1200/675/pickleball-paddle-court.jpg?ve=1&tl=1',
      location: 'Sân Pickleball Quận 1',
      courseType: 'group',
      maxGroupSize: 4,
      currentEnrollment: 2,
      startDate: '2025-01-08',
      endDate: '2025-01-29',
      status: 'ongoing',
      weeklySchedule: [
        { day: 'Thứ 2', time: '18:00-19:30', sessions: 3 },
        { day: 'Thứ 6', time: '18:00-19:30', sessions: 3 },
      ],
      totalSessions: 6,
      availableSlots: 2,
    },
    {
      id: 3,
      title: 'Chiến thuật thi đấu đôi',
      coach: 'Huấn luyện viên Lê Văn C',
      rating: 4.7,
      reviews: 56,
      price: '900.000 VNĐ',
      duration: '2 tuần',
      level: 'Nâng cao',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4StMq4jMrFoO5JU3dNwnlckEdorqhSmoaUw&s',
      location: 'Sân Pickleball Quận 7',
      courseType: 'group',
      maxGroupSize: 4,
      currentEnrollment: 3,
      startDate: '2025-01-20',
      endDate: '2025-02-02',
      status: 'upcoming',
      weeklySchedule: [
        { day: 'Thứ 7', time: '15:00-17:00', sessions: 2 },
        { day: 'Chủ nhật', time: '15:00-17:00', sessions: 2 },
      ],
      totalSessions: 4,
      availableSlots: 1,
    },
    {
      id: 4,
      title: 'Kỹ thuật cá nhân chuyên sâu',
      coach: 'Huấn luyện viên Phạm Thị D',
      rating: 4.9,
      reviews: 203,
      price: '1.000.000 VNĐ',
      duration: '6 tuần',
      level: 'Nâng cao',
      image:
        'https://cdn.britannica.com/25/236225-050-59A4051E/woman-daughter-doubles-pickleball.jpg',
      location: 'Sân Pickleball Quận 10',
      courseType: 'individual',
      startDate: '2025-01-10',
      endDate: '2025-02-21',
      status: 'ongoing',
      weeklySchedule: [
        { day: 'Thứ 4', time: '17:00-18:30', sessions: 6 },
        { day: 'Thứ 7', time: '10:00-11:30', sessions: 6 },
      ],
      totalSessions: 12,
      availableSlots: 1,
    },
    {
      id: 5,
      title: 'Pickleball cho trẻ em',
      coach: 'Huấn luyện viên Hoàng Thị E',
      rating: 4.6,
      reviews: 45,
      price: '400.000 VNĐ',
      duration: '4 tuần',
      level: 'Cơ bản',
      image:
        'https://cdn.britannica.com/25/236225-050-59A4051E/woman-daughter-doubles-pickleball.jpg',
      location: 'Sân Pickleball Quận 5',
      courseType: 'group',
      maxGroupSize: 6,
      currentEnrollment: 4,
      startDate: '2025-02-01',
      endDate: '2025-02-29',
      status: 'upcoming',
      weeklySchedule: [{ day: 'Thứ 7', time: '09:00-10:30', sessions: 4 }],
      totalSessions: 4,
      availableSlots: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'upcoming':
        return 'processing';
      case 'in-progress':
        return 'warning';
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

  // Select the first course for demo purposes
  const course = courses[0];

  // Generate sessions from weeklySchedule
  let sessionCounter = 1;
  const sessions = course.weeklySchedule.flatMap((schedule, weekIndex) =>
    Array.from({ length: schedule.sessions }, (_, sessionIndex) => {
      const sessionId = `${course.id}-${weekIndex}-${sessionIndex + 1}`;
      const sessionNumber = sessionCounter++;
      return {
        id: sessionId,
        title: `Buổi ${sessionNumber}: ${schedule.day}`,
        date: new Date(Date.now() + (weekIndex * 7 + sessionIndex) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        status: sessionNumber <= 4 ? 'completed' : 'upcoming',
        location: course.location,
        assignments:
          sessionNumber <= 4
            ? [
                {
                  id: `${course.id}-${weekIndex}-${sessionIndex + 1}-1`,
                  title: 'Quiz kiến thức',
                  type: 'quiz',
                  completed: true,
                  score: 85,
                  questions: 10,
                },
              ]
            : [],
      };
    }),
  );

  const hasAttendedSession = (sessionId: string) => {
    // Mock function - in real app, this would check actual attendance
    return sessionId.includes('0') || sessionId.includes('1'); // Assume attended first 4 sessions
  };

  // Debug logging
  console.log('Course:', course);
  console.log('Sessions:', sessions);

  if (selectedSession) {
    // Redirect to session detail
    console.log('Navigating to session:', selectedSession.id);
    router.push(`/my-courses/session-detail/${selectedSession.id}`);
    return null;
  }

  // Fallback if no course data
  if (!course) {
    return (
      <div>
        <Title level={2}>Không tìm thấy khóa học</Title>
        <Button onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Quay lại
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          {course.title}
        </Title>
      </div>

      {/* Course Info */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div>
            <Text type="secondary">Giảng viên: {course.coach}</Text>
            <br />
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag color={getTypeColor(course.courseType)}>
                {course.courseType === 'individual' ? 'Học cá nhân' : 'Học nhóm'}
              </Tag>
              <Tag color="blue">{course.level}</Tag>
              <Tag color={getStatusColor(course.status)}>
                {course.status === 'upcoming'
                  ? 'Sắp diễn ra'
                  : course.status === 'ongoing'
                    ? 'Đang diễn ra'
                    : 'Hoàn thành'}
              </Tag>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
              {course.totalSessions}
            </div>
            <Text type="secondary">Buổi học</Text>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            {course.startDate} - {course.endDate}
          </Text>
          <Text type="secondary">Địa điểm: {course.location}</Text>
        </div>

        <div style={{ marginTop: 12 }}>
          <Text strong>Lịch học:</Text>
          <div style={{ marginTop: 8 }}>
            {course.weeklySchedule.map((schedule, index) => (
              <div key={index} style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
                {schedule.day}: {schedule.time} ({schedule.sessions} buổi)
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sessions List */}
      <Card title="Các buổi học">
        <List
          dataSource={sessions}
          renderItem={(session: any) => {
            const sessionHasAttended = hasAttendedSession(session.id);
            return (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  border:
                    session.status === 'completed'
                      ? '1px solid #52c41a'
                      : session.status === 'upcoming'
                        ? '1px solid #1890ff'
                        : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  backgroundColor:
                    session.status === 'completed'
                      ? '#f6ffed'
                      : session.status === 'upcoming'
                        ? '#e6f7ff'
                        : '#fafafa',
                }}
                onClick={() => {
                  console.log('Clicked session:', session);
                  setSelectedSession(session as any);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={sessionHasAttended ? <CheckCircleOutlined /> : <CalendarOutlined />}
                      style={{
                        backgroundColor: sessionHasAttended
                          ? '#52c41a'
                          : session.status === 'upcoming'
                            ? '#1890ff'
                            : '#d9d9d9',
                      }}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong>{session.title}</Text>
                      {sessionHasAttended && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Text type="secondary">{session.location}</Text>
                      </div>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
                      >
                        <Text type="secondary">{session.date}</Text>
                        {sessionHasAttended && <Badge color="green" text="Đã tham dự" />}
                        {session.status === 'completed' && !sessionHasAttended && (
                          <Badge color="green" text="Hoàn thành" />
                        )}
                        {session.status === 'upcoming' && <Badge color="blue" text="Sắp tới" />}
                      </div>

                      {/* Assignment Summary */}
                      {session.assignments.length > 0 && (
                        <div
                          style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text type="secondary">Bài tập:</Text>
                            <Text strong>
                              {session.assignments.filter((a: any) => a.completed).length}/
                              {session.assignments.length} hoàn thành
                            </Text>
                            {session.assignments.filter((a: any) => a.completed).length <
                              session.assignments.length && <Text type="secondary">• Cần làm</Text>}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>
      <Card title="Các buổi học">
        <List
          dataSource={sessions}
          renderItem={(session: any) => {
            const sessionHasAttended = hasAttendedSession(session.id);
            return (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  border:
                    session.status === 'completed'
                      ? '1px solid #52c41a'
                      : session.status === 'upcoming'
                        ? '1px solid #1890ff'
                        : '1px solid #d9d9d9',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  backgroundColor:
                    session.status === 'completed'
                      ? '#f6ffed'
                      : session.status === 'upcoming'
                        ? '#e6f7ff'
                        : '#fafafa',
                }}
                onClick={() => setSelectedSession(session)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={sessionHasAttended ? <CheckCircleOutlined /> : <CalendarOutlined />}
                      style={{
                        backgroundColor: sessionHasAttended
                          ? '#52c41a'
                          : session.status === 'upcoming'
                            ? '#1890ff'
                            : '#d9d9d9',
                      }}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong>{session.title}</Text>
                      {sessionHasAttended && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Text type="secondary">{session.location}</Text>
                      </div>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
                      >
                        <Text type="secondary">{session.date}</Text>
                        {sessionHasAttended && <Badge color="green" text="Đã tham dự" />}
                        {session.status === 'completed' && !sessionHasAttended && (
                          <Badge color="green" text="Hoàn thành" />
                        )}
                        {session.status === 'upcoming' && <Badge color="blue" text="Sắp tới" />}
                      </div>

                      {/* Assignment Summary */}
                      {session.assignments.length > 0 && (
                        <div
                          style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text type="secondary">Bài tập:</Text>
                            <Text strong>
                              {session.assignments.filter((a: any) => a.completed).length}/
                              {session.assignments.length} hoàn thành
                            </Text>
                            {session.assignments.filter((a: any) => a.completed).length <
                              session.assignments.length && <Text type="secondary">• Cần làm</Text>}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default CourseDetailPage;
