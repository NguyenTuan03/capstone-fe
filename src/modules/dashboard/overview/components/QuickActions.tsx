'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Typography, message } from 'antd';

import {
  UserAddOutlined,
  WarningOutlined,
  BookOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { useRouter } from 'next/navigation';
import { QuickAction } from '@/types/dashboard';
import { DashboardApiService } from '@/services/dashboardApi';

const { Text } = Typography;

const QuickActions: React.FC = () => {
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadQuickActions = async () => {
    setLoading(true);
    try {
      const response = await DashboardApiService.getQuickActions();
      if (response.success) {
        setActions(response.data);
      }
    } catch {
      message.error('Không thể tải quick actions');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const iconMap = {
      UserAddOutlined: <UserAddOutlined />,
      WarningOutlined: <WarningOutlined />,
      BookOutlined: <BookOutlined />,
      TeamOutlined: <TeamOutlined />,
      BarChartOutlined: <BarChartOutlined />,
      SettingOutlined: <SettingOutlined />,
    };
    return iconMap[iconName as keyof typeof iconMap] || <BookOutlined />;
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.enabled) {
      router.push(action.url);
    }
  };

  useEffect(() => {
    loadQuickActions();
  }, []);

  return (
    <Card title="Thao tác nhanh" size="small" loading={loading}>
      <Row gutter={[12, 12]}>
        {actions.map((action) => (
          <Col xs={12} sm={8} md={12} lg={8} key={action.id}>
            <Button
              block
              size="large"
              style={{
                height: 'auto',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                borderColor: action.color,
                color: action.enabled ? action.color : '#ccc',
                cursor: action.enabled ? 'pointer' : 'not-allowed',
              }}
              onClick={() => handleActionClick(action)}
              disabled={!action.enabled}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '24px', color: action.enabled ? action.color : '#ccc' }}>
                  {getIcon(action.icon)}
                </div>
                {action.count && action.count > 0 && (
                  <Badge
                    count={action.count}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-12px',
                      fontSize: '10px',
                    }}
                  />
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text
                  strong
                  style={{
                    fontSize: '12px',
                    color: action.enabled ? 'inherit' : '#ccc',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  {action.title}
                </Text>
                <Text
                  style={{
                    fontSize: '10px',
                    color: action.enabled ? '#666' : '#ccc',
                    lineHeight: '1.2',
                  }}
                >
                  {action.description}
                </Text>
              </div>
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;
