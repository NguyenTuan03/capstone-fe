'use client';

import React, { useState, useEffect } from 'react';
import { Card, Timeline, Avatar, Tag, Typography, Space, Row, Col, List, Button } from 'antd';

import {
  TrophyOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import AchievementApiService from '@/services/achievementApi';
import { AchievementActivity, RecentUnlock } from '@/types/achievement';

const { Text, Title } = Typography;

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<AchievementActivity[]>([]);
  const [recentUnlocks, setRecentUnlocks] = useState<RecentUnlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      const [activitiesData, unlocksData] = await Promise.all([
        AchievementApiService.getAchievementActivities(20),
        AchievementApiService.getRecentUnlocks(10),
      ]);
      setActivities(activitiesData);
      setRecentUnlocks(unlocksData);
    } catch (error) {
      console.error('Failed to load activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'updated':
        return <EditOutlined style={{ color: '#1890ff' }} />;
      case 'unlocked':
        return <TrophyOutlined style={{ color: '#faad14' }} />;
      case 'archived':
        return <DeleteOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#666' }} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created':
        return '#52c41a';
      case 'updated':
        return '#1890ff';
      case 'unlocked':
        return '#faad14';
      case 'archived':
        return '#ff4d4f';
      default:
        return '#666';
    }
  };

  const getActivityDescription = (activity: AchievementActivity) => {
    switch (activity.type) {
      case 'created':
        return (
          <div>
            <Text strong>{activity.details.createdBy}</Text> đã tạo achievement mới{' '}
            <Text strong>&quot;{activity.achievementName}&quot;</Text>
            <div style={{ marginTop: '4px' }}>
              <Tag color={AchievementApiService.getCategoryColor(activity.details.category)}>
                {activity.details.category}
              </Tag>
              <Tag color={AchievementApiService.getRarityColor(activity.details.rarity)}>
                {activity.details.rarity}
              </Tag>
            </div>
          </div>
        );
      case 'updated':
        return (
          <div>
            <Text strong>{activity.details.updatedBy}</Text> đã cập nhật achievement{' '}
            <Text strong>&quot;{activity.achievementName}&quot;</Text>
            {activity.details.changes && (
              <div style={{ marginTop: '4px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Thay đổi: {activity.details.changes.join(', ')}
                </Text>
              </div>
            )}
          </div>
        );
      case 'unlocked':
        return (
          <div>
            <Text strong>{activity.userName}</Text> đã unlock achievement{' '}
            <Text strong>&quot;{activity.achievementName}&quot;</Text>
            <div style={{ marginTop: '4px' }}>
              <Tag color="gold">+{activity.details.pointsEarned} pts</Tag>
              <Tag color={AchievementApiService.getRarityColor(activity.details.rarity)}>
                {activity.details.rarity}
              </Tag>
            </div>
          </div>
        );
      case 'archived':
        return (
          <div>
            Achievement <Text strong>&quot;{activity.achievementName}&quot;</Text> đã được lưu trữ
          </div>
        );
      default:
        return <Text>Hoạt động không xác định</Text>;
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* Recent Activities */}
        <Col xs={24} lg={14}>
          <Card
            title="Hoạt động gần đây"
            extra={
              <Button size="small" onClick={loadActivityData}>
                Làm mới
              </Button>
            }
            style={{ height: '600px' }}
          >
            <div style={{ height: '520px', overflowY: 'auto' }}>
              <Timeline>
                {activities.map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    dot={getActivityIcon(activity.type)}
                    color={getActivityColor(activity.type)}
                  >
                    <div style={{ marginBottom: '8px' }}>{getActivityDescription(activity)}</div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {AchievementApiService.getTimeAgo(activity.timestamp)}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </Card>
        </Col>

        {/* Recent Unlocks */}
        <Col xs={24} lg={10}>
          <Card title="Achievements mới unlock" style={{ height: '600px' }}>
            <div style={{ height: '520px', overflowY: 'auto' }}>
              <List
                dataSource={recentUnlocks}
                renderItem={(unlock) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={
                        <div style={{ position: 'relative' }}>
                          <Avatar src={unlock.userAvatar} size="large">
                            {unlock.userName.charAt(0)}
                          </Avatar>
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              fontSize: '16px',
                            }}
                          >
                            {unlock.achievementIcon}
                          </div>
                        </div>
                      }
                      title={
                        <div>
                          <Text strong>{unlock.userName}</Text>
                          <div style={{ marginTop: '2px' }}>
                            <Tag
                              color={AchievementApiService.getRarityColor(unlock.achievementRarity)}
                            >
                              {unlock.achievementName}
                            </Tag>
                          </div>
                        </div>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {AchievementApiService.getTimeAgo(unlock.unlockedAt)}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ActivityFeed;
