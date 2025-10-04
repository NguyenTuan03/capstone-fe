'use client';

import React from 'react';
import { Card, Progress, Row, Col, Typography, Space } from 'antd';
import { DeviceData } from '@/types/statistics';

const { Title, Text } = Typography;

interface UserDistributionChartProps {
  data: DeviceData[];
  title?: string;
}

const UserDistributionChart: React.FC<UserDistributionChartProps> = ({
  data = [],
  title = 'Phân bổ người dùng theo thiết bị',
}) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const getColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'desktop':
        return '#1890ff';
      case 'mobile':
        return '#52c41a';
      case 'tablet':
        return '#fa8c16';
      default:
        return '#722ed1';
    }
  };

  return (
    <Card title={title} className="chieu-cao-day">
      <Space direction="vertical" size="large" className="rong-day">
        {data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={index}>
              <Row justify="space-between" align="middle" className="margin-duoi-2">
                <Col>
                  <Text strong>{item.type}</Text>
                </Col>
                <Col>
                  <Text>
                    {item.count} ({percentage}%)
                  </Text>
                </Col>
              </Row>
              <Progress
                percent={percentage}
                strokeColor={getColor(item.type)}
                showInfo={false}
                size="small"
              />
            </div>
          );
        })}
      </Space>
    </Card>
  );
};

export default UserDistributionChart;
