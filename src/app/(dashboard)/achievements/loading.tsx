import React from 'react';
import { Card, Skeleton, Row, Col } from 'antd';

export default function AchievementsLoading() {
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Skeleton.Input style={{ width: 200, height: 32 }} active />
        <br />
        <Skeleton.Input style={{ width: 400, height: 16, marginTop: 8 }} active />
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} md={6} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    </div>
  );
}
