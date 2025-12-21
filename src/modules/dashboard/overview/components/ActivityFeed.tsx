'use client';

import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Typography, Tag, Space, Button, Timeline, message } from 'antd';

import {
  UserOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { ActivityFeedItem, SystemAlert } from '@/types/dashboard';
import { DashboardApiService } from '@/services/dashboardApi';

const { Text } = Typography;

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivityFeed = async () => {
    setLoading(true);
    try {
      const response = await DashboardApiService.getActivityFeed(10);
      if (response.success) {
        setActivities(response.data.activities);
        setAlerts(response.data.alerts);
      }
    } catch {
      message.error('Không thể tải activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const iconMap = {
      user_registration: <UserOutlined style={{ color: '#52c41a' }} />,
      session_completed: <VideoCameraOutlined style={{ color: '#1890ff' }} />,
      payment_received: <DollarOutlined style={{ color: '#faad14' }} />,
      coach_verified: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      report_submitted: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      course_approved: <CheckCircleOutlined style={{ color: '#722ed1' }} />,
    };
    return iconMap[type as keyof typeof iconMap] || <InfoCircleOutlined />;
  };

  const getAlertIcon = (type: string) => {
    const iconMap = {
      warning: <WarningOutlined style={{ color: '#faad14' }} />,
      error: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    };
    return iconMap[type as keyof typeof iconMap] || <InfoCircleOutlined />;
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const response = await DashboardApiService.dismissAlert(alertId);
      if (response.success) {
        setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        message.success('Đã ẩn thông báo');
      }
    } catch {
      message.error('Không thể ẩn thông báo');
    }
  };

  useEffect(() => {
    loadActivityFeed();
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* System Alerts */}
      {alerts.length > 0 && (
        <Card
          title="Cảnh báo hệ thống"
          size="small"
          extra={
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={loadActivityFeed}
              loading={loading}
            />
          }
        >
          <List
            size="small"
            dataSource={alerts}
            renderItem={(alert) => (
              <List.Item
                actions={[
                  <Button
                    key="dismiss"
                    type="text"
                    size="small"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Ẩn
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={getAlertIcon(alert.type)}
                  title={
                    <Space>
                      <span style={{ fontSize: '13px' }}>{alert.title}</span>
                      <Tag
                        color={
                          alert.priority === 'high'
                            ? 'red'
                            : alert.priority === 'medium'
                              ? 'orange'
                              : 'blue'
                        }
                      >
                        {alert.priority}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text style={{ fontSize: '12px' }}>{alert.message}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>
                        {DashboardApiService.getTimeAgo(alert.timestamp)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Recent Activities */}
      <Card
        title="Hoạt động gần đây"
        size="small"
        extra={
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={loadActivityFeed}
            loading={loading}
          />
        }
      >
        <Timeline
          items={activities.map((activity) => ({
            color:
              activity.priority === 'high'
                ? 'red'
                : activity.priority === 'medium'
                  ? 'blue'
                  : 'green',
            dot: getActivityIcon(activity.type),
            children: (
              <div key={activity.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '13px' }}>
                      {activity.title}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '12px' }}>{activity.description}</Text>
                    {activity.user && (
                      <div style={{ marginTop: '4px' }}>
                        <Space size="small">
                          <Avatar src={activity.user.avatar} icon={<UserOutlined />} size="small" />
                          <Text style={{ fontSize: '11px' }}>{activity.user.name}</Text>
                        </Space>
                      </div>
                    )}
                  </div>
                  <div style={{ marginLeft: '8px', textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {DashboardApiService.getTimeAgo(activity.timestamp)}
                    </Text>
                    {activity.status && (
                      <div style={{ marginTop: '2px' }}>
                        <Tag
                          color={
                            activity.status === 'completed'
                              ? 'success'
                              : activity.status === 'pending'
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {activity.status}
                        </Tag>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          }))}
        />
      </Card>
    </Space>
  );
};

export default ActivityFeed;
