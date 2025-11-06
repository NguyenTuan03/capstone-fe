'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Avatar,
  Tag,
  List,
  Progress,
  Form,
  Input,
  Select,
  Upload,
  Space,
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TrophyOutlined,
  SettingOutlined,
  BookOutlined,
  CameraOutlined,
  EditOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;
const { Option } = Select;

const ProfilePage = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['LEARNER'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    COACH: '/summary',
  });
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const userStats = {
    totalCourses: 12,
    completedCourses: 8,
    achievements: 15,
    studyTime: 45, // hours
    level: 'Trung cấp',
  };

  const achievements = [
    {
      id: 1,
      title: 'Hoàn thành khóa cơ bản',
      icon: '🏆',
      unlocked: true,
      unlockedDate: '2024-01-15',
      description: 'Hoàn thành khóa học cơ bản đầu tiên',
    },
    {
      id: 2,
      title: 'Học viên tích cực',
      icon: '⭐',
      unlocked: true,
      unlockedDate: '2024-01-10',
      description: 'Tham gia 10 buổi học liên tiếp',
    },
    {
      id: 3,
      title: 'Tham gia 10 buổi học',
      icon: '📚',
      unlocked: true,
      unlockedDate: '2024-01-05',
      description: 'Tham gia đủ 10 buổi học',
    },
    {
      id: 4,
      title: 'Chuyên gia Pickleball',
      icon: '🎯',
      unlocked: false,
      progress: 7,
      target: 10,
      description: 'Hoàn thành 10 khóa học nâng cao',
    },
    {
      id: 5,
      title: 'Thành tích xuất sắc',
      icon: '💎',
      unlocked: false,
      progress: 0,
      target: 5,
      description: 'Đạt điểm A+ trong 5 khóa học',
    },
  ];

  const onFinish = (values: any) => {
    console.log('Profile updated:', values);
    setEditing(false);
  };

  const getAchievementStatus = (achievement: any) => {
    if (achievement.unlocked) return 'unlocked';
    if (achievement.progress > 0) return 'in-progress';
    return 'locked';
  };

  const getAchievementColor = (status: string) => {
    switch (status) {
      case 'unlocked':
        return '#52c41a';
      case 'in-progress':
        return '#1890ff';
      case 'locked':
        return '#d9d9d9';
      default:
        return '#d9d9d9';
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
      <Title level={2}>Thông tin cá nhân</Title>

      <Row gutter={[24, 24]}>
        {/* Profile Info */}
        <Col xs={24} lg={8}>
          <Card title="Ảnh đại diện">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Avatar size={120} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
              <div>
                <Button icon={<CameraOutlined />} style={{ marginTop: 8 }}>
                  Thay đổi ảnh
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Thống kê học tập" style={{ marginTop: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>12</div>
              <div style={{ color: '#666' }}>Khóa học đã tham gia</div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>8</div>
              <div style={{ color: '#666' }}>Khóa học đã hoàn thành</div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>45</div>
              <div style={{ color: '#666' }}>Giờ học</div>
            </div>
          </Card>
        </Col>

        {/* Profile Form */}
        <Col xs={24} lg={16}>
          <Card
            title="Chỉnh sửa thông tin"
            extra={
              <Button
                type={editing ? 'default' : 'primary'}
                icon={<EditOutlined />}
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Hủy' : 'Chỉnh sửa'}
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={!editing}
              initialValues={{
                name: 'Lâm Tiên Hưng',
                email: 'lamtienhung@email.com',
                phone: '0123456789',
                gender: 'male',
                level: 'intermediate',
                experience: '1-2 năm',
                studentId: 'SE170216',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Mã sinh viên"
                    name="studentId"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Select>
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Trình độ hiện tại"
                    name="level"
                    rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
                  >
                    <Select>
                      <Option value="beginner">Cơ bản</Option>
                      <Option value="intermediate">Trung cấp</Option>
                      <Option value="advanced">Nâng cao</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Mục tiêu học tập" name="goals">
                <Input.TextArea rows={3} placeholder="Mô tả mục tiêu học tập của bạn..." />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                      Cập nhật thông tin
                    </Button>
                    <Button onClick={() => setEditing(false)}>Hủy</Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Achievements */}
      <Card title="Thành tựu đã đạt được" style={{ marginTop: 24 }}>
        {/* Achievement Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {achievements.filter((a) => a.unlocked).length}
                </div>
                <div style={{ color: '#666' }}>Đã mở khóa</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {achievements.filter((a) => !a.unlocked && a.progress && a.progress > 0).length}
                </div>
                <div style={{ color: '#666' }}>Đang tiến bộ</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#666' }}>
                  {achievements.length}
                </div>
                <div style={{ color: '#666' }}>Tổng cộng</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Achievements List */}
        <Row gutter={[16, 16]}>
          {achievements.map((achievement) => {
            const status = getAchievementStatus(achievement);
            return (
              <Col xs={24} sm={12} lg={8} key={achievement.id}>
                <Card
                  size="small"
                  style={{
                    opacity: status === 'locked' ? 0.6 : 1,
                    border: status === 'unlocked' ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{achievement.icon}</div>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{achievement.title}</div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                      {achievement.description}
                    </div>

                    {status === 'unlocked' && (
                      <Tag color="green" style={{ fontSize: 10 }}>
                        <CheckCircleOutlined /> Đã mở khóa
                      </Tag>
                    )}

                    {status === 'in-progress' && (
                      <div>
                        <Progress
                          percent={Math.round(
                            (achievement.progress && achievement.target
                              ? achievement.progress / achievement.target
                              : 0) * 100,
                          )}
                          size="small"
                          style={{ marginBottom: 4 }}
                        />
                        <Text type="secondary" style={{ fontSize: 10 }}>
                          {achievement.progress}/{achievement.target}
                        </Text>
                      </div>
                    )}

                    {status === 'locked' && (
                      <Tag color="default" style={{ fontSize: 10 }}>
                        🔒 Chưa mở khóa
                      </Tag>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12}>
          <Card hoverable>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CalendarOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
              <div>Lịch học</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card hoverable>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <TrophyOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 8 }} />
              <div>Thành tựu</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Sign Out */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button type="primary" danger icon={<LogoutOutlined />} size="large">
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
