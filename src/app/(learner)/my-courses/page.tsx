'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Button, Progress, Typography, List, Avatar, Tag } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const MyCoursesPage = () => {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const myCourses = [
    {
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
    },
    {
      id: 2,
      title: 'Chiến thuật đôi',
      instructor: 'Coach Lan',
      progress: 30,
      status: 'Đang học',
      nextLesson: 'Buổi 3: Phối hợp đôi',
      totalLessons: 6,
      completedLessons: 2,
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      courseType: 'group',
      level: 'Trung cấp',
      duration: '6 tuần',
    },
    {
      id: 3,
      title: 'Luyện tập nâng cao',
      instructor: 'Coach Hùng',
      progress: 100,
      status: 'Hoàn thành',
      nextLesson: 'Đã hoàn thành',
      totalLessons: 4,
      completedLessons: 4,
      startDate: '2023-12-01',
      endDate: '2023-12-29',
      courseType: 'individual',
      level: 'Nâng cao',
      duration: '4 tuần',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang học':
        return 'blue';
      case 'Hoàn thành':
        return 'green';
      case 'Chưa bắt đầu':
        return 'default';
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

  if (selectedCourse) {
    return (
      <div>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Title level={2}>Chi tiết khóa học</Title>
          <Button onClick={() => setSelectedCourse(null)}>Quay lại</Button>
        </div>

        <Card>
          <Card.Meta
            title={selectedCourse.title}
            description={
              <div>
                <Text type="secondary">Giảng viên: {selectedCourse.instructor}</Text>
                <br />
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Tag color={getStatusColor(selectedCourse.status)}>{selectedCourse.status}</Tag>
                  <Tag color={getTypeColor(selectedCourse.courseType)}>
                    {selectedCourse.courseType === 'individual' ? 'Cá nhân' : 'Nhóm'}
                  </Tag>
                  <Tag color={getLevelColor(selectedCourse.level)}>{selectedCourse.level}</Tag>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Text strong>Tiến độ: {selectedCourse.progress}%</Text>
                  <Progress percent={selectedCourse.progress} style={{ marginTop: 4 }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <Text type="secondary">
                    {selectedCourse.status === 'Đang học'
                      ? `Bài tiếp theo: ${selectedCourse.nextLesson}`
                      : selectedCourse.nextLesson}
                  </Text>
                </div>
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                  {selectedCourse.startDate} - {selectedCourse.endDate}
                </div>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Khóa học của tôi</Title>

      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                {myCourses.length}
              </div>
              <div style={{ color: '#666' }}>Tổng khóa học</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {myCourses.filter((c) => c.status === 'Hoàn thành').length}
              </div>
              <div style={{ color: '#666' }}>Đã hoàn thành</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                {myCourses.filter((c) => c.status === 'Đang học').length}
              </div>
              <div style={{ color: '#666' }}>Đang học</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Courses List */}
      <Row gutter={[24, 24]}>
        {myCourses.map((course) => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
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
                  icon={<PlayCircleOutlined />}
                  onClick={() => setSelectedCourse(course)}
                >
                  Xem chi tiết
                </Button>,
              ]}
            >
              <Card.Meta
                title={course.title}
                description={
                  <div>
                    <Text type="secondary">Giảng viên: {course.instructor}</Text>
                    <br />

                    {/* Status and Type Badges */}
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Tag color={getStatusColor(course.status)}>{course.status}</Tag>
                      <Tag color={getTypeColor(course.courseType)}>
                        {course.courseType === 'individual' ? 'Cá nhân' : 'Nhóm'}
                      </Tag>
                      <Tag color={getLevelColor(course.level)}>{course.level}</Tag>
                    </div>

                    {/* Progress */}
                    <div style={{ marginTop: 12 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                        }}
                      >
                        <Text strong>Tiến độ: {course.progress}%</Text>
                        <Text type="secondary">
                          {course.completedLessons}/{course.totalLessons} bài học
                        </Text>
                      </div>
                      <Progress percent={course.progress} size="small" />
                    </div>

                    {/* Next Lesson */}
                    <div style={{ marginTop: 12 }}>
                      <Text type="secondary">
                        {course.status === 'Đang học'
                          ? `Bài tiếp theo: ${course.nextLesson}`
                          : course.nextLesson}
                      </Text>
                    </div>

                    {/* Date Range */}
                    <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                      {course.startDate} - {course.endDate}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activity */}
      <Card title="Hoạt động gần đây" style={{ marginTop: 24 }}>
        <List
          dataSource={[
            {
              title: 'Hoàn thành bài 6: Kỹ thuật cơ bản Pickleball',
              time: '2 giờ trước',
              type: 'completed',
            },
            {
              title: 'Bắt đầu bài 3: Chiến thuật đôi',
              time: '1 ngày trước',
              type: 'started',
            },
            {
              title: 'Nhận chứng chỉ: Luyện tập nâng cao',
              time: '3 ngày trước',
              type: 'certificate',
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={
                      item.type === 'completed' ? (
                        <CheckCircleOutlined />
                      ) : item.type === 'started' ? (
                        <PlayCircleOutlined />
                      ) : (
                        <TrophyOutlined />
                      )
                    }
                    style={{
                      backgroundColor:
                        item.type === 'completed'
                          ? '#52c41a'
                          : item.type === 'started'
                            ? '#1890ff'
                            : '#faad14',
                    }}
                  />
                }
                title={item.title}
                description={item.time}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default MyCoursesPage;
