'use client';

import React, { useState } from 'react';
import { Card, Button, Typography, Tag, Progress, List, Avatar, Badge } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const CourseDetailPage = () => {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Mock data - in real app, this would come from props or API
  const course = {
    id: 1,
    title: 'Kỹ thuật cơ bản Pickleball',
    instructor: 'Coach Minh',
    progress: 75,
    status: 'Đang học',
    nextLesson: 'Buổi 5: Kỹ thuật serve',
    totalLessons: 8,
    completedLessons: 6,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    courseType: 'individual',
    level: 'Cơ bản',
    duration: '8 tuần',
    sessions: [
      {
        id: 1,
        title: 'Buổi 1: Giới thiệu Pickleball',
        date: '2024-01-15',
        status: 'completed',
        location: 'Sân Pickleball Quận 1',
        assignments: [
          {
            id: 1,
            title: 'Quiz kiến thức cơ bản',
            type: 'quiz',
            completed: true,
            score: 85,
            questions: 10,
          },
        ],
      },
      {
        id: 2,
        title: 'Buổi 2: Kỹ thuật cầm vợt',
        date: '2024-01-22',
        status: 'completed',
        location: 'Sân Pickleball Quận 1',
        assignments: [
          {
            id: 2,
            title: 'Video thực hành cầm vợt',
            type: 'video',
            completed: true,
          },
        ],
      },
      {
        id: 3,
        title: 'Buổi 3: Kỹ thuật forehand',
        date: '2024-01-29',
        status: 'completed',
        location: 'Sân Pickleball Quận 1',
        assignments: [],
      },
      {
        id: 4,
        title: 'Buổi 4: Kỹ thuật backhand',
        date: '2024-02-05',
        status: 'completed',
        location: 'Sân Pickleball Quận 1',
        assignments: [],
      },
      {
        id: 5,
        title: 'Buổi 5: Kỹ thuật serve',
        date: '2024-02-12',
        status: 'upcoming',
        location: 'Sân Pickleball Quận 1',
        assignments: [],
      },
    ],
  };

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

  const hasAttendedSession = (sessionId: number) => {
    // Mock function - in real app, this would check actual attendance
    return sessionId <= 4; // Assume attended first 4 sessions
  };

  if (selectedSession) {
    // Redirect to session detail
    router.push(`/my-courses/session-detail/${selectedSession.id}`);
    return null;
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
            <Text type="secondary">Giảng viên: {course.instructor}</Text>
            <br />
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Tag color={getTypeColor(course.courseType)}>
                {course.courseType === 'individual' ? 'Học cá nhân' : 'Học nhóm'}
              </Tag>
              <Tag color="blue">{course.level}</Tag>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
              {course.progress}%
            </div>
            <Text type="secondary">Hoàn thành</Text>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            {course.completedLessons}/{course.totalLessons} buổi học
          </Text>
          <Text type="secondary">Cập nhật: hôm nay</Text>
        </div>

        <div style={{ marginTop: 12 }}>
          <Progress percent={course.progress} />
        </div>
      </Card>

      {/* Sessions List */}
      <Card title="Các buổi học">
        <List
          dataSource={course.sessions}
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
                onClick={() => setSelectedSession(session as any)}
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
