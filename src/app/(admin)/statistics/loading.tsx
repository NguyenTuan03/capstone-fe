'use client';

import React from 'react';
import { Card, Skeleton, Row, Col, Spin } from 'antd';

export default function StatisticsLoading() {
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Skeleton.Input style={{ width: 300, height: 32 }} active />
        <br />
        <Skeleton.Input style={{ width: 200, height: 16, marginTop: 8 }} active />
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </Card>

      {/* 3D Charts Loading */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="📈 Tăng trưởng người dùng 3D" style={{ height: 500 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                flexDirection: 'column',
              }}
            >
              <Spin size="large" />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <div>Đang khởi tạo 3D Engine...</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                  Three.js + React Three Fiber
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="🍩 Phân bố thiết bị 3D" style={{ height: 500 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                flexDirection: 'column',
              }}
            >
              <Spin size="large" />
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <div>Đang tải 3D Donut Chart...</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: 4 }}>
                  Interactive 3D Visualization
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
