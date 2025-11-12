'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Select, DatePicker, Space } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { UserOutlined, DollarOutlined, WalletOutlined, RiseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// ✅ Mock data đơn giản theo API structure
const mockUserStats = {
  statusCode: 200,
  message: 'Success',
  metadata: {
    data: [
      { month: '1/2025', data: 0 },
      { month: '2/2025', data: 0 },
      { month: '3/2025', data: 0 },
      { month: '4/2025', data: 0 },
      { month: '5/2025', data: 0 },
      { month: '6/2025', data: 0 },
      { month: '7/2025', data: 0 },
      { month: '8/2025', data: 0 },
      { month: '9/2025', data: 0 },
      { month: '10/2025', data: 5 },
      { month: '11/2025', data: 6 },
      { month: '12/2025', data: 0 },
    ],
  },
};

const mockLearnerRevenue = {
  statusCode: 200,
  message: 'Success',
  metadata: {
    data: [
      { month: '1/2025', data: 0 },
      { month: '2/2025', data: 0 },
      { month: '3/2025', data: 0 },
      { month: '4/2025', data: 0 },
      { month: '5/2025', data: 0 },
      { month: '6/2025', data: 0 },
      { month: '7/2025', data: 0 },
      { month: '8/2025', data: 0 },
      { month: '9/2025', data: 0 },
      { month: '10/2025', data: 0 },
      { month: '11/2025', data: 0 },
      { month: '12/2025', data: 0 },
    ],
  },
};

const mockCoachIncome = {
  statusCode: 200,
  message: 'Success',
  metadata: {
    data: [
      { month: '1/2025', data: 0 },
      { month: '2/2025', data: 0 },
      { month: '3/2025', data: 0 },
      { month: '4/2025', data: 0 },
      { month: '5/2025', data: 0 },
      { month: '6/2025', data: 0 },
      { month: '7/2025', data: 0 },
      { month: '8/2025', data: 0 },
      { month: '9/2025', data: 0 },
      { month: '10/2025', data: 0 },
      { month: '11/2025', data: 0 },
      { month: '12/2025', data: 0 },
    ],
  },
};

const mockSystemRevenue = {
  statusCode: 200,
  message: 'Success',
  metadata: {
    data: [
      { month: '1/2025', data: 0 },
      { month: '2/2025', data: 0 },
      { month: '3/2025', data: 0 },
      { month: '4/2025', data: 0 },
      { month: '5/2025', data: 0 },
      { month: '6/2025', data: 0 },
      { month: '7/2025', data: 0 },
      { month: '8/2025', data: 0 },
      { month: '9/2025', data: 0 },
      { month: '10/2025', data: 0 },
      { month: '11/2025', data: 0 },
      { month: '12/2025', data: 0 },
    ],
  },
};

// ✅ Format tiền tệ
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

// ✅ Format số
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// ✅ Tính tổng và tăng trưởng từ data
const calculateStats = (data: any[]) => {
  const total = data.reduce((sum, item) => sum + item.data, 0);
  const currentMonth = data[data.length - 1]?.data || 0;
  const previousMonth = data[data.length - 2]?.data || 0;
  const growth = previousMonth !== 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  return { total, currentMonth, growth };
};

// ✅ Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`Tháng: ${label}`}</p>
        <p style={{ margin: 0, color: payload[0].color }}>
          {`Giá trị: ${formatNumber(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

// ✅ Custom tooltip cho tiền tệ
const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`Tháng: ${label}`}</p>
        <p style={{ margin: 0, color: payload[0].color }}>
          {`Giá trị: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function FinancialStatisticsPage() {
  const [timeRange, setTimeRange] = useState('year');
  const [customDateRange, setCustomDateRange] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Tính toán stats từ mock data
  const userStats = calculateStats(mockUserStats.metadata.data);
  const learnerStats = calculateStats(mockLearnerRevenue.metadata.data);
  const coachStats = calculateStats(mockCoachIncome.metadata.data);
  const systemStats = calculateStats(mockSystemRevenue.metadata.data);

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
  }, [timeRange, customDateRange]);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>📊 Thống Kê Tài Chính</Title>

        {/* Filter Controls */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space>
            <span style={{ fontWeight: 500 }}>Thời gian:</span>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
              disabled={loading}
            >
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="quarter">Quý</Option>
              <Option value="year">Năm</Option>
              <Option value="custom">Tùy chọn</Option>
            </Select>

            {timeRange === 'custom' && (
              <RangePicker onChange={setCustomDateRange} format="DD/MM/YYYY" disabled={loading} />
            )}
          </Space>
        </Card>
      </div>

      {/* 4 Cards Statistics - 2 cards per row */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Thống kê người dùng mới */}
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            style={{ height: '100%', borderRadius: '8px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Người dùng mới"
                value={userStats.currentMonth}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix={`/ ${formatNumber(userStats.total)} tổng`}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: userStats.growth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {userStats.growth >= 0 ? '📈' : '📉'} {Math.abs(userStats.growth).toFixed(1)}% so
                với tháng trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockUserStats.metadata.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} angle={-45} textAnchor="end" height={50} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#1890ff"
                    strokeWidth={3}
                    dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Card 2: Tổng tiền thu được từ người học */}
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            style={{ height: '100%', borderRadius: '8px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Doanh thu từ học viên"
                value={learnerStats.currentMonth}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: learnerStats.growth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {learnerStats.growth >= 0 ? '📈' : '📉'} {Math.abs(learnerStats.growth).toFixed(1)}%
                so với tháng trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockLearnerRevenue.metadata.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} angle={-45} textAnchor="end" height={50} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="data"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Card 3: Tổng thu nhập của các coach */}
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            style={{ height: '100%', borderRadius: '8px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Thu nhập của Coach"
                value={coachStats.currentMonth}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<WalletOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: coachStats.growth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {coachStats.growth >= 0 ? '📈' : '📉'} {Math.abs(coachStats.growth).toFixed(1)}% so
                với tháng trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockCoachIncome.metadata.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} angle={-45} textAnchor="end" height={50} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Bar dataKey="data" fill="#fa8c16" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Card 4: Doanh thu hệ thống */}
        <Col xs={24} lg={12}>
          <Card
            loading={loading}
            style={{ height: '100%', borderRadius: '8px' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Doanh thu hệ thống"
                value={systemStats.currentMonth}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: systemStats.growth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {systemStats.growth >= 0 ? '📈' : '📉'} {Math.abs(systemStats.growth).toFixed(1)}%
                so với tháng trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSystemRevenue.metadata.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} angle={-45} textAnchor="end" height={50} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="data"
                    stroke="#eb2f96"
                    strokeWidth={3}
                    dot={{ fill: '#eb2f96', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Summary Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card size="small" style={{ borderRadius: '8px' }}>
            <Statistic
              title="Tổng doanh thu năm"
              value={systemStats.total + learnerStats.total}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" style={{ borderRadius: '8px' }}>
            <Statistic
              title="Tổng chi phí Coach"
              value={coachStats.total}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" style={{ borderRadius: '8px' }}>
            <Statistic
              title="Lợi nhuận ròng"
              value={systemStats.total}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
