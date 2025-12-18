'use client';

import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { DashboardStats } from '@/types/dashboard';

const { Text } = Typography;

interface ChartsSectionProps {
  stats: DashboardStats;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ stats: _stats }) => {
  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
      <Col xs={24} lg={12}>
        <Card title="Xu hướng người dùng" style={{ height: '400px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
            }}
          >
            <Text type="secondary">User Growth Chart sẽ được implement với ECharts</Text>
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Hoạt động Sessions" style={{ height: '400px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
            }}
          >
            <Text type="secondary">Session Activity Chart sẽ được implement với ECharts</Text>
          </div>
        </Card>
      </Col>

      <Col xs={24}>
        <Card title="Xu hướng doanh thu" style={{ height: '350px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '250px',
            }}
          >
            <Text type="secondary">Revenue Trend Chart sẽ được implement với ECharts</Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChartsSection;
