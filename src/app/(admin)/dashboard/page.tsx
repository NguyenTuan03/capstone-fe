'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Progress } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

const { Title } = Typography;

// ✅ Mock data theo API structure
const mockDashboardData = {
  statusCode: 200,
  message: 'Success',
  metadata: {
    totalUsers: {
      total: 11,
      percentageChange: 20,
    },
    coaches: {
      total: 7,
      percentageChange: 150,
      verified: 5,
      pending: 0,
    },
    learners: {
      total: 2,
      percentageChange: -50,
    },
    courses: {
      total: 0,
      completed: 0,
      ongoing: 0,
      cancelled: 0,
    },
    averageFeedback: {
      total: 0,
      percentageChange: 0,
    },
    systemReports: {
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    courseStatusChart: [
      {
        status: 'COMPLETED',
        count: 0,
      },
      {
        status: 'ON_GOING',
        count: 0,
      },
      {
        status: 'CANCELLED',
        count: 0,
      },
      {
        status: 'APPROVED',
        count: 0,
      },
      {
        status: 'READY_OPENED',
        count: 0,
      },
      {
        status: 'PENDING_APPROVAL',
        count: 0,
      },
    ],
    feedbackDistributionChart: [
      {
        rating: 1,
        count: 0,
        percentage: 0,
      },
      {
        rating: 2,
        count: 0,
        percentage: 0,
      },
      {
        rating: 3,
        count: 0,
        percentage: 0,
      },
      {
        rating: 4,
        count: 0,
        percentage: 0,
      },
      {
        rating: 5,
        count: 0,
        percentage: 0,
      },
    ],
  },
};

// ✅ Format số
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// ✅ Màu sắc cho các trạng thái course
const COURSE_STATUS_COLORS: { [key: string]: string } = {
  COMPLETED: '#52c41a',
  ON_GOING: '#1890ff',
  CANCELLED: '#ff4d4f',
  APPROVED: '#87d068',
  READY_OPENED: '#faad14',
  PENDING_APPROVAL: '#d46b08',
};

// ✅ Màu sắc cho rating
const RATING_COLORS = ['#ff4d4f', '#ff7a45', '#faad14', '#a0d911', '#52c41a'];

// ✅ Tên hiển thị cho trạng thái course
const getCourseStatusName = (status: string) => {
  const statusMap: { [key: string]: string } = {
    COMPLETED: 'Đã hoàn thành',
    ON_GOING: 'Đang diễn ra',
    CANCELLED: 'Đã hủy',
    APPROVED: 'Đã duyệt',
    READY_OPENED: 'Sẵn sàng mở',
    PENDING_APPROVAL: 'Chờ duyệt',
  };
  return statusMap[status] || status;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [data] = useState(mockDashboardData.metadata);

  // ✅ Mock API call
  const fetchData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>📊 Tổng Quan Hệ Thống</Title>
      </div>

      {/* A. 6 Thẻ Thống Kê Nhanh - Cùng kích thước */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Thẻ 1: Tổng số người dùng */}
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card
            loading={loading}
            style={{
              borderRadius: '8px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            bodyStyle={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                👥 Tổng người dùng
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
                {formatNumber(data.totalUsers.total)}
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: data.totalUsers.percentageChange >= 0 ? '#52c41a' : '#ff4d4f',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {data.totalUsers.percentageChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
              {Math.abs(data.totalUsers.percentageChange)}% so với tháng trước
            </div>
          </Card>
        </Col>

        {/* Thẻ 2: Số huấn luyện viên */}
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card
            loading={loading}
            style={{
              borderRadius: '8px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            bodyStyle={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                🧑‍🏫 Huấn luyện viên
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
                {formatNumber(data.coaches.total)}
              </div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                ✅ {data.coaches.verified} verified
                {data.coaches.pending > 0 && ` • ⏳ ${data.coaches.pending} pending`}
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: data.coaches.percentageChange >= 0 ? '#52c41a' : '#ff4d4f',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {data.coaches.percentageChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
              {Math.abs(data.coaches.percentageChange)}% so với tháng trước
            </div>
          </Card>
        </Col>

        {/* Thẻ 3: Số học viên */}
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card
            loading={loading}
            style={{
              borderRadius: '8px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            bodyStyle={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                🧑‍🎓 Học viên
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fa8c16' }}>
                {formatNumber(data.learners.total)}
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: data.learners.percentageChange >= 0 ? '#52c41a' : '#ff4d4f',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {data.learners.percentageChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
              {Math.abs(data.learners.percentageChange)}% so với tháng trước
            </div>
          </Card>
        </Col>

        {/* Thẻ 4: Tổng khóa học */}
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card
            loading={loading}
            style={{
              borderRadius: '8px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            bodyStyle={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                📅 Tổng khóa học
              </div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#722ed1' }}>
                {formatNumber(data.courses.total)}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div>✅ {data.courses.completed} completed</div>
              <div>🔄 {data.courses.ongoing} ongoing</div>
              <div>❌ {data.courses.cancelled} cancelled</div>
            </div>
          </Card>
        </Col>

        {/* Thẻ 5: Feedback trung bình */}
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card
            loading={loading}
            style={{
              borderRadius: '8px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            bodyStyle={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                ⭐ Feedback trung bình
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#faad14',
                  marginBottom: '8px',
                }}
              >
                {data.averageFeedback.total > 0 ? data.averageFeedback.total.toFixed(1) : '0.0'}/5.0
              </div>
              <Progress
                percent={data.averageFeedback.total * 20}
                showInfo={false}
                strokeColor="#faad14"
                size="small"
              />
            </div>
            <div
              style={{
                fontSize: '12px',
                color: data.averageFeedback.percentageChange >= 0 ? '#52c41a' : '#ff4d4f',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {data.averageFeedback.percentageChange >= 0 ? <RiseOutlined /> : <FallOutlined />}
              {Math.abs(data.averageFeedback.percentageChange)}% so với tháng trước
            </div>
          </Card>
        </Col>

        {/* Thẻ 6: Báo cáo hệ thống */}
        <Col xs={24} sm={12} lg={8} xl={4}>
          <Card
            loading={loading}
            style={{
              borderRadius: '8px',
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            bodyStyle={{
              padding: '16px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                ⚙️ Báo cáo hệ thống
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#ff4d4f',
                  marginBottom: '8px',
                }}
              >
                {formatNumber(data.systemReports.pending)}
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div>⏳ {data.systemReports.pending} pending</div>
              <div>✅ {data.systemReports.approved} approved</div>
              <div>❌ {data.systemReports.rejected} rejected</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* B. 2 Biểu Đồ Trực Quan */}
      <Row gutter={[16, 16]}>
        {/* Biểu đồ 1: Số buổi học theo trạng thái */}
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            title="📊 Trạng thái khóa học"
            style={{ borderRadius: '8px', height: '400px' }}
            bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)' }}
          >
            <div style={{ height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.courseStatusChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="status"
                    fontSize={11}
                    tickFormatter={getCourseStatusName}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis fontSize={11} />
                  <Tooltip
                    formatter={(value) => [value, 'Số lượng']}
                    labelFormatter={(label) => getCourseStatusName(label)}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.courseStatusChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COURSE_STATUS_COLORS[entry.status] || '#8884d8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Biểu đồ 2: Phân bố đánh giá */}
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            title="⭐ Phân bố đánh giá"
            style={{ borderRadius: '8px', height: '400px' }}
            bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)' }}
          >
            <div style={{ height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.feedbackDistributionChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) =>
                      `${entry.payload.rating}⭐ (${entry.payload.percentage}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.feedbackDistributionChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.rating - 1]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} đánh giá (${props.payload.percentage}%)`,
                      `${props.payload.rating} sao`,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
