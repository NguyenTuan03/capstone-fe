'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, List, Avatar, Tag, Space } from 'antd';

import {
  TrophyOutlined,
  UserOutlined,
  StarOutlined,
  FireOutlined,
  RiseOutlined,
  HeartOutlined,
} from '@ant-design/icons';

import AchievementApiService from '@/services/achievementApi';
import { AchievementAnalytics } from '@/types/achievement';

const { Title, Text } = Typography;

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AchievementAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await AchievementApiService.getAchievementAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!analytics) {
    return <Card loading={loading} style={{ minHeight: '400px' }} />;
  }

  return (
    <div>
      {/* Overview Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Achievements"
              value={analytics.overview.totalAchievements}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Unlocks"
              value={analytics.overview.totalUnlocks}
              prefix={<StarOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tỷ lệ tiến độ TB"
              value={analytics.overview.averageProgressRate}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Điểm động lực"
              value={analytics.overview.engagementScore}
              precision={1}
              suffix="/10"
              prefix={<HeartOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Category Breakdown */}
        <Col xs={24} lg={12}>
          <Card title="Phân tích theo danh mục" style={{ height: '400px' }}>
            <div style={{ height: '320px', overflowY: 'auto' }}>
              {analytics.categoryBreakdown.map((category, index) => (
                <div key={category.category} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <Text strong>{category.category}</Text>
                    <Text>{category.count} achievements</Text>
                  </div>
                  <Progress
                    percent={category.averageUnlockRate}
                    strokeColor={category.color}
                    showInfo={false}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    <span>{category.totalUnlocks.toLocaleString()} unlocks</span>
                    <span>Engagement: {category.engagementScore}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Rarity Analytics */}
        <Col xs={24} lg={12}>
          <Card title="Phân tích theo độ hiếm" style={{ height: '400px' }}>
            <div style={{ height: '320px', overflowY: 'auto' }}>
              {analytics.rarityAnalytics.map((rarity, index) => (
                <div key={rarity.rarity} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <Space>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: rarity.color,
                        }}
                      />
                      <Text strong>{rarity.rarity}</Text>
                    </Space>
                    <Text>{rarity.count} achievements</Text>
                  </div>
                  <Progress
                    percent={rarity.averageUnlockRate}
                    strokeColor={rarity.color}
                    showInfo={false}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    <span>Unlock rate: {rarity.averageUnlockRate.toFixed(1)}%</span>
                    <span>{rarity.totalPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* User Engagement */}
        <Col xs={24} lg={12}>
          <Card title="Tương tác người dùng" style={{ height: '300px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Users hoạt động"
                  value={analytics.userEngagement.totalActiveUsers}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Có achievements"
                  value={analytics.userEngagement.usersWithAchievements}
                  prefix={<TrophyOutlined />}
                />
              </Col>
            </Row>
            <div style={{ marginTop: '16px' }}>
              <Text>
                TB achievements/user:{' '}
                <Text strong>{analytics.userEngagement.averageAchievementsPerUser}</Text>
              </Text>
              <br />
              <Text>
                Tỷ lệ giữ chân: <Text strong>{analytics.userEngagement.retentionRate}%</Text>
              </Text>
              <br />
              <Text>
                Điểm động lực: <Text strong>{analytics.userEngagement.motivationScore}/10</Text>
              </Text>
            </div>
          </Card>
        </Col>

        {/* Top Performers */}
        <Col xs={24} lg={12}>
          <Card title="Top Performers" style={{ height: '300px' }}>
            <List
              size="small"
              dataSource={analytics.topPerformers}
              renderItem={(performer) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={performer.userAvatar} />}
                    title={
                      <Space>
                        <span>#{performer.rank}</span>
                        <span>{performer.userName}</span>
                      </Space>
                    }
                    description={
                      <div>
                        <Space size="small">
                          <Tag color="gold">{performer.totalAchievements} achievements</Tag>
                          <Tag color="blue">{performer.totalPoints} pts</Tag>
                          <Tag color="purple">{performer.rareAchievements} rare</Tag>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
