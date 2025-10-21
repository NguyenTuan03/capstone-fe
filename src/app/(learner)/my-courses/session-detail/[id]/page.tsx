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

  // Mock data - in real app, this would come from API based on params.id
  const session = {
    id: parseInt(id),
    title: 'Buổi 5: Kỹ thuật serve',
    date: '2024-02-12',
    status: 'upcoming',
    location: 'Sân Pickleball Quận 1',
    instructor: 'Coach Minh',
    assignments: [
      {
        id: 1,
        title: 'Quiz kiến thức serve',
        type: 'quiz',
        description: 'Làm bài quiz về kỹ thuật serve cơ bản',
        completed: false,
        questions: 10,
        timeLimit: 30, // minutes
      },
      {
        id: 2,
        title: 'Video thực hành serve',
        type: 'video',
        description: 'Quay video thực hành kỹ thuật serve',
        completed: false,
        maxDuration: 5, // minutes
      },
      {
        id: 3,
        title: 'Bài tập serve',
        type: 'exercise',
        description: 'Thực hành serve 50 lần và ghi chú',
        completed: false,
      },
    ],
  };

  const hasAttendedSession = (sessionId: number) => {
    // Mock function - in real app, this would check actual attendance
    return sessionId <= 4; // Assume attended first 4 sessions
  };

  const hasSubmittedAssignment = (assignmentId: number) => {
    // Mock function - in real app, this would check actual submissions
    return false;
  };

  const getSubmission = (assignmentId: number) => {
    // Mock function - in real app, this would get actual submission
    return null;
  };

  const joinVideoConference = (sessionId: number) => {
    setIsInVideoConference(true);
    // In real app, this would join actual video conference
    console.log('Joining video conference for session:', sessionId);
  };

  const leaveVideoConference = () => {
    setIsInVideoConference(false);
    // In real app, this would leave video conference
    console.log('Leaving video conference');
  };

  const markAttendance = (sessionId: number) => {
    // In real app, this would mark attendance
    console.log('Marking attendance for session:', sessionId);
  };

  const sessionHasAttended = hasAttendedSession(session.id);

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
          {session.title}
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
          <Text type="secondary">{session.location}</Text>
          <div style={{ display: 'flex', gap: 8 }}>
            {sessionHasAttended && <Badge color="green" text="Đã tham dự" />}
            <Tag color={session.status === 'completed' ? 'green' : 'blue'}>
              {session.status === 'completed' ? 'Đã hoàn thành' : 'Sắp tới'}
            </Tag>
          </div>
        </div>
        <Text type="secondary">Ngày học: {session.date}</Text>
      </Card>

      {/* Video Conference and Actions */}
      {session.status === 'upcoming' && (
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
              onClick={() => joinVideoConference(session.id)}
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
      {session.status === 'completed' && !sessionHasAttended && (
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
              onClick={() => markAttendance(session.id)}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            >
              Đã tham dự
            </Button>
          </div>
        </Card>
      )}

      {/* Assignments */}
      {session.assignments.length > 0 && (
        <Card title="Bài tập & hoạt động">
          <List
            dataSource={session.assignments}
            renderItem={(assignment: any) => {
              const hasSubmitted = hasSubmittedAssignment(assignment.id);
              const submission = getSubmission(assignment.id);

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

      {session.assignments.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text type="secondary">
              {session.status === 'completed'
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
