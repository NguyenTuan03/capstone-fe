'use client';

import React, { useState } from 'react';
import { Card, Button, Typography, Tag, Progress, List, Avatar, Badge, Space, Upload } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  UploadOutlined,
  BookOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { use } from 'react';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const SessionDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isInVideoConference, setIsInVideoConference] = useState(false);

  // Use the same data structure as course-detail
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
      status: 'upcoming',
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

  // Find the course and generate sessions
  const course = courses[0]; // Use first course for demo
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

  // Find the specific session by ID
  const session = sessions.find((s) => s.id === id);

  // If not found by exact ID, try to find by partial match
  const fallbackSession = session || sessions.find((s) => s.id.includes(id)) || sessions[0];

  // Debug logging
  console.log('Session ID from params:', id);
  console.log('All sessions:', sessions);
  console.log('Found session:', session);
  console.log('Using fallback session:', fallbackSession);

  // Use fallback session
  const currentSession = fallbackSession;

  const hasAttendedSession = (sessionId: string) => {
    // Mock function - in real app, this would check actual attendance
    return sessionId.includes('0') || sessionId.includes('1'); // Assume attended first 4 sessions
  };

  const hasSubmittedAssignment = () => {
    // Mock function - in real app, this would check actual submissions
    return false;
  };
  const joinVideoConference = (sessionId: string) => {
    setIsInVideoConference(true);
    // In real app, this would join actual video conference
    console.log('Joining video conference for session:', sessionId);
  };

  const leaveVideoConference = () => {
    setIsInVideoConference(false);
    // In real app, this would leave video conference
    console.log('Leaving video conference');
  };

  const markAttendance = (sessionId: string) => {
    // In real app, this would mark attendance
    console.log('Marking attendance for session:', sessionId);
  };

  const sessionHasAttended = hasAttendedSession(currentSession.id);

  if (selectedAssignment) {
    // Redirect to assignment detail
    router.push(`/my-courses/assignment-detail/${selectedAssignment.id}`);
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
          {currentSession.title}
        </Title>
      </div>

      {/* Session Info */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text type="secondary">{currentSession.location}</Text>
          <div style={{ display: 'flex', gap: 8 }}>
            {sessionHasAttended && <Badge color="green" text="Đã tham dự" />}
            <Tag color={currentSession.status === 'completed' ? 'green' : 'blue'}>
              {currentSession.status === 'completed' ? 'Đã hoàn thành' : 'Sắp tới'}
            </Tag>
          </div>
        </div>
        <Text type="secondary">Ngày học: {currentSession.date}</Text>
      </Card>

      {/* Video Conference and Actions */}
      {currentSession.status === 'upcoming' && (
        <Card
          style={{
            marginBottom: 24,
            border: '1px solid #1890ff',
            backgroundColor: '#e6f7ff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  padding: '8px',
                  backgroundColor: '#1890ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VideoCameraOutlined style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  Học trực tuyến
                </Title>
                <Text type="secondary">Tham gia buổi học qua video conference</Text>
              </div>
            </div>
          </div>

          {!isInVideoConference ? (
            <Button
              type="primary"
              size="large"
              icon={<PhoneOutlined />}
              onClick={() => joinVideoConference(currentSession.id)}
              style={{ width: '100%' }}
            >
              Tham gia video conference
            </Button>
          ) : (
            <div>
              <div
                style={{
                  backgroundColor: '#e6f7ff',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '12px',
                }}
              >
                <VideoCameraOutlined
                  style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }}
                />
                <div style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                  Đang trong cuộc họp
                </div>
                <Text type="secondary">Video conference đang diễn ra</Text>
              </div>
              <Button
                danger
                size="large"
                icon={<PhoneOutlined />}
                onClick={leaveVideoConference}
                style={{ width: '100%' }}
              >
                Rời khỏi cuộc họp
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Attendance Status for Past Sessions */}
      {currentSession.status === 'completed' && !sessionHasAttended && (
        <Card
          style={{
            marginBottom: 24,
            border: '1px solid #faad14',
            backgroundColor: '#fffbe6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  padding: '8px',
                  backgroundColor: '#faad14',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarOutlined style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                  Buổi học đã qua
                </Title>
                <Text type="secondary">Đánh dấu lại nếu bạn đã tham dự</Text>
              </div>
            </div>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => markAttendance(currentSession.id)}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            >
              Đã tham dự
            </Button>
          </div>
        </Card>
      )}

      {/* Assignments */}
      {currentSession.assignments.length > 0 && (
        <Card title="Bài tập & hoạt động">
          <List
            dataSource={currentSession.assignments}
            renderItem={(assignment: any) => {
              const hasSubmitted = hasSubmittedAssignment();

              return (
                <List.Item
                  style={{
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          backgroundColor:
                            assignment.type === 'quiz'
                              ? '#e6f7ff'
                              : assignment.type === 'video'
                                ? '#f9f0ff'
                                : '#f6ffed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {assignment.type === 'quiz' && (
                          <BookOutlined style={{ color: '#1890ff' }} />
                        )}
                        {assignment.type === 'video' && (
                          <VideoCameraOutlined style={{ color: '#722ed1' }} />
                        )}
                        {assignment.type === 'exercise' && (
                          <TrophyOutlined style={{ color: '#52c41a' }} />
                        )}
                      </div>
                    }
                    title={assignment.title}
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <Text type="secondary">{assignment.description}</Text>
                        </div>

                        {assignment.completed ? (
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              <Badge color="green" text="Hoàn thành" />
                              {assignment.score && (
                                <Text strong style={{ color: '#1890ff' }}>
                                  {assignment.score}/{assignment.questions * 10} điểm
                                </Text>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              <Badge color="orange" text="Chưa hoàn thành" />
                            </div>

                            <div style={{ display: 'flex', gap: 8 }}>
                              {assignment.type === 'quiz' && (
                                <Button
                                  type="primary"
                                  icon={<BookOutlined />}
                                  onClick={() => setSelectedAssignment(assignment)}
                                >
                                  {hasSubmitted ? 'Xem lại quiz' : 'Làm quiz'}
                                </Button>
                              )}
                              {assignment.type === 'video' && (
                                <Button
                                  type="primary"
                                  icon={<UploadOutlined />}
                                  onClick={() => setSelectedAssignment(assignment)}
                                  style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                                >
                                  {hasSubmitted ? 'Cập nhật video' : 'Tải video'}
                                </Button>
                              )}
                              {assignment.type === 'exercise' && (
                                <Button
                                  type="primary"
                                  icon={<UploadOutlined />}
                                  onClick={() => setSelectedAssignment(assignment)}
                                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                >
                                  {hasSubmitted ? 'Cập nhật bài' : 'Nộp bài'}
                                </Button>
                              )}
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
      )}

      {currentSession.assignments.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">
              {currentSession.status === 'completed'
                ? 'Buổi học này chưa có bài tập nào được giao.'
                : 'Bài tập sẽ được giao sau khi buổi học kết thúc.'}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SessionDetailPage;
