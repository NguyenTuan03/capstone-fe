'use client';
import React, { useState } from 'react';
import { Card, Tabs, Avatar, Button, Tag, Input, Badge, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  BellOutlined,
  StarFilled,
  TeamOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const SettingsPage = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Lại Đức Hùng',
    email: 'Hungld5@fe.edu.vn',
    phone: '0976710580',
    newPassword: '',
    confirmPassword: '',
  });

  const stats = [
    {
      title: 'Đánh giá',
      value: '4.8',
      icon: <StarFilled style={{ color: '#52c41a' }} />,
      color: '#e6f7ff',
    },
    {
      title: 'Học viên',
      value: '156',
      icon: <TeamOutlined style={{ color: '#1890ff' }} />,
      color: '#e6f4ff',
    },
    {
      title: 'Buổi học',
      value: '1248',
      icon: <ClockCircleOutlined style={{ color: '#722ed1' }} />,
      color: '#f9f0ff',
    },
    {
      title: 'Kinh nghiệm',
      value: '5+',
      icon: <TrophyOutlined style={{ color: '#fa8c16' }} />,
      color: '#fff7e6',
    },
  ];

  const specialties = ['Kỹ thuật cơ bản', 'Kỹ thuật nâng cao', 'Chiến thuật đối', 'Tâm lý thi đấu'];

  const certifications = [
    {
      title: 'Pickleball Professional Certification',
      org: 'International Pickleball Federation',
      date: '2021-06-15',
    },
    {
      title: 'Sports Coaching License',
      org: 'Vietnam Sports Administration',
      date: '2020-12-20',
    },
  ];

  const awards = [
    {
      title: 'Best Coach of the Year 2023',
      org: 'Vietnam Pickleball Association',
      year: '2023',
    },
    {
      title: 'Excellence in Teaching Award',
      org: 'Sports Federation',
      year: '2022',
    },
  ];

  const achievements = [
    {
      title: 'Đào tạo 100+ học viên',
      desc: 'Đã đào tạo thành công hơn 100 học viên từ cơ bản đến nâng cao',
      year: '2023',
    },
    {
      title: 'Vô địch giải đấu HLV',
      desc: 'Giải nhất giải đấu Pickleball các HLV quốc gia',
      year: '2022',
    },
  ];

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    // Handle save logic here
  };

  const handleCancel = () => {
    setFormData({
      name: 'Lại Đức Hùng',
      email: 'Hungld5@fe.edu.vn',
      phone: '0976710580',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const ProfileTab = () => (
    <div style={{ padding: '24px' }}>
      {/* Profile Header */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '24px' }}>Lại Đức Hùng</h2>
                <p style={{ margin: '4px 0', color: '#666' }}>
                  Huấn luyện viên Pickleball chuyên nghiệp
                </p>
              </div>
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <span>
                <EnvironmentOutlined /> TP. Hồ Chí Minh
              </span>
              <span>
                <CalendarOutlined /> Tham gia: 2020-03-15
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Row gutter={16} style={{ marginTop: '24px' }}>
          {stats.map((stat, index) => (
            <Col span={6} key={index}>
              <Card style={{ backgroundColor: stat.color, border: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ fontSize: '28px', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Introduction */}
        <div style={{ marginTop: '24px' }}>
          <h3>Giới thiệu</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            HLV chuyên nghiệp với 10 năm kinh nghiệm đào tạo Pickleball. Tập trung vào kỹ thuật cơ
            bản và chiến thuật thi đấu cho học viên mọi trình độ.
          </p>
        </div>
      </Card>

      {/* Specialties */}
      <Card title="Chuyên môn" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {specialties.map((specialty, index) => (
            <Tag key={index} color="blue" style={{ padding: '4px 12px', fontSize: '14px' }}>
              {specialty}
            </Tag>
          ))}
        </div>
      </Card>

      {/* Teaching Methods */}
      <Card title="Phương pháp dạy" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <CheckCircleFilled style={{ color: '#52c41a', marginRight: '8px' }} />
            Dạy học hiệu quả cho học viên
          </div>
          <div>
            <CheckCircleFilled style={{ color: '#52c41a', marginRight: '8px' }} />
            Thực hành nhiều
          </div>
          <div>
            <CheckCircleFilled style={{ color: '#52c41a', marginRight: '8px' }} />1 kèm 1
          </div>
        </div>
      </Card>

      {/* Certifications */}
      <Card title="Chứng chỉ" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          {certifications.map((cert, index) => (
            <Col span={12} key={index}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: '150px',
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrophyOutlined style={{ fontSize: '48px', color: '#999' }} />
                  </div>
                }
              >
                <Card.Meta
                  title={cert.title}
                  description={
                    <div>
                      <div>{cert.org}</div>
                      <div style={{ marginTop: '4px', color: '#999' }}>{cert.date}</div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Awards */}
      <Card title="Giải thưởng" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          {awards.map((award, index) => (
            <Col span={12} key={index}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: '150px',
                      background: '#fff7e6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrophyOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
                  </div>
                }
              >
                <Card.Meta
                  title={award.title}
                  description={
                    <div>
                      <div>{award.org}</div>
                      <div style={{ marginTop: '4px', color: '#999' }}>{award.year}</div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Notable Achievements */}
      <Card title="Thành tựu nổi bật">
        <Row gutter={16}>
          {achievements.map((achievement, index) => (
            <Col span={12} key={index}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      height: '150px',
                      background: '#e6f7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StarFilled style={{ fontSize: '48px', color: '#1890ff' }} />
                  </div>
                }
              >
                <Card.Meta
                  title={achievement.title}
                  description={
                    <div>
                      <div>{achievement.desc}</div>
                      <div style={{ marginTop: '4px', color: '#999' }}>{achievement.year}</div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );

  const AccountSettingsTab = () => (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <Card title="Cài đặt tài khoản">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Họ và tên
            </label>
            <Input
              size="large"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Email
            </label>
            <Input
              size="large"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Số điện thoại
            </label>
            <Input
              size="large"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Mật khẩu mới
            </label>
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Xác nhận mật khẩu
            </label>
            <Input.Password
              size="large"
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <Button type="primary" size="large" style={{ flex: 1 }} onClick={handleSave}>
              Lưu thay đổi
            </Button>
            <Button size="large" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined /> Hồ sơ huấn luyện viên
        </span>
      ),
      children: <ProfileTab />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <EditOutlined /> Cài đặt tài khoản
        </span>
      ),
      children: <AccountSettingsTab />,
    },
  ];

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Content */}
      <div style={{ padding: '24px 48px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
      </div>
    </div>
  );
};

export default SettingsPage;
