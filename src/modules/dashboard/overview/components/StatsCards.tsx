'use client';

import React from 'react';
import { Row, Col, Card, Statistic, Typography, Progress, Tag, Avatar, Space } from 'antd';

import {
  UserOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import { DashboardStats } from '@/types/dashboard';
import { DashboardApiService } from '@/services/dashboardApi';

const { Text } = Typography;

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  // Get trend indicator component
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    } else if (trend === 'down') {
      return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
    }
    return null;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '#52c41a';
      case 'down':
        return '#ff4d4f';
      default:
        return '#666';
    }
  };

  // Calculate trends
  const userTrend = DashboardApiService.getTrendIndicator(
    stats.users.total,
    stats.users.total - stats.users.newThisMonth,
  );

  const revenueTrend = DashboardApiService.getTrendIndicator(
    stats.revenue.totalThisMonth,
    stats.revenue.totalLastMonth,
  );

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Main Stats Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Total Users */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.users.total}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  <Space>
                    {getTrendIcon(userTrend.trend, userTrend.percentage)}
                    <Text
                      style={{
                        color: getTrendColor(userTrend.trend),
                        fontSize: '12px',
                      }}
                    >
                      {DashboardApiService.formatPercentage(userTrend.percentage)}
                    </Text>
                  </Space>
                </div>
              }
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Hoạt động: {DashboardApiService.formatNumber(stats.users.active)}(
                {DashboardApiService.formatPercentage(stats.users.activeRate)})
              </Text>
              <Progress
                percent={stats.users.activeRate}
                showInfo={false}
                strokeColor="#52c41a"
                size="small"
                style={{ marginTop: 4 }}
              />
            </div>
          </Card>
        </Col>

        {/* Total Coaches */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Huấn luyện viên"
              value={stats.coaches.verified}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  <Tag color="orange">{stats.coaches.pending} chờ duyệt</Tag>
                </div>
              }
            />
            <div style={{ marginTop: 12 }}>
              <Space size="small">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Đánh giá TB:
                </Text>
                <Text strong style={{ fontSize: '12px', color: '#faad14' }}>
                  {stats.coaches.averageRating}/5
                </Text>
              </Space>
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  Tổng sessions: {DashboardApiService.formatNumber(stats.coaches.totalSessions)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Sessions This Month */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sessions tháng này"
              value={stats.sessions.totalThisMonth}
              prefix={<VideoCameraOutlined style={{ color: '#722ed1' }} />}
              suffix={
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ fontSize: '12px', color: '#52c41a' }}>
                      {DashboardApiService.formatPercentage(stats.sessions.completionRate)}
                    </Text>
                  </Space>
                </div>
              }
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Hoàn thành: {DashboardApiService.formatNumber(stats.sessions.completedThisMonth)}
              </Text>
              <Progress
                percent={stats.sessions.completionRate}
                showInfo={false}
                strokeColor="#722ed1"
                size="small"
                style={{ marginTop: 4 }}
              />
            </div>
          </Card>
        </Col>

        {/* Revenue This Month */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng này"
              value={stats.revenue.totalThisMonth}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              formatter={(value) => DashboardApiService.formatCurrency(Number(value))}
              suffix={
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  <Space>
                    {getTrendIcon(revenueTrend.trend, revenueTrend.percentage)}
                    <Text
                      style={{
                        color: getTrendColor(revenueTrend.trend),
                        fontSize: '12px',
                      }}
                    >
                      {DashboardApiService.formatPercentage(revenueTrend.percentage)}
                    </Text>
                  </Space>
                </div>
              }
            />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                TB/session: {DashboardApiService.formatCurrency(stats.revenue.averagePerSession)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats Row */}
      <Row gutter={[24, 24]}>
        {/* Content Stats */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Nội dung học tập" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Chương"
                  value={stats.content.totalChapters}
                  prefix={<BookOutlined style={{ color: '#1890ff', fontSize: '16px' }} />}
                  valueStyle={{ fontSize: '20px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Bài học"
                  value={stats.content.totalLessons}
                  prefix={<BookOutlined style={{ color: '#52c41a', fontSize: '16px' }} />}
                  valueStyle={{ fontSize: '20px' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Quiz"
                  value={stats.content.totalQuizzes}
                  prefix={<BookOutlined style={{ color: '#faad14', fontSize: '16px' }} />}
                  valueStyle={{ fontSize: '20px' }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Tỷ lệ hoàn thành TB:{' '}
                {DashboardApiService.formatPercentage(stats.content.averageCompletionRate)}
              </Text>
            </div>
          </Card>
        </Col>

        {/* Top Coaches */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Top Huấn luyện viên" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              {stats.coaches.topPerformers.slice(0, 3).map((coach) => (
                <div
                  key={coach.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Space>
                    <Avatar src={coach.avatar} icon={<UserOutlined />} size="small" />
                    <div>
                      <Text strong style={{ fontSize: '13px' }}>
                        {coach.name}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {coach.specialization}
                      </Text>
                    </div>
                  </Space>
                  <div style={{ textAlign: 'right' }}>
                    <div>
                      <Text strong style={{ fontSize: '12px', color: '#faad14' }}>
                        {coach.rating}⭐
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {coach.sessionsCount} sessions
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* System Health */}
        <Col xs={24} sm={12} lg={8}>
          <Card title="Tình trạng hệ thống" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: '12px' }}>Sức khỏe hệ thống</Text>
                  <Text strong style={{ fontSize: '12px' }}>
                    {DashboardApiService.formatPercentage(stats.system.systemHealth)}
                  </Text>
                </div>
                <Progress
                  percent={stats.system.systemHealth}
                  showInfo={false}
                  strokeColor={stats.system.systemHealth > 95 ? '#52c41a' : '#faad14'}
                  size="small"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: '12px' }}>Uptime</Text>
                  <Text strong style={{ fontSize: '12px' }}>
                    {DashboardApiService.formatPercentage(stats.system.uptime)}
                  </Text>
                </div>
                <Progress
                  percent={stats.system.uptime}
                  showInfo={false}
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>

              <Row gutter={8}>
                <Col span={12}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                    }}
                  >
                    <Text strong style={{ fontSize: '14px', color: '#ff4d4f' }}>
                      {stats.system.pendingApprovals}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '10px' }}>Chờ duyệt</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                    }}
                  >
                    <Text strong style={{ fontSize: '14px', color: '#faad14' }}>
                      {stats.system.activeReports}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '10px' }}>Báo cáo</Text>
                  </div>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsCards;
