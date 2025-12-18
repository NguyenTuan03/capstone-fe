'use client';

import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Select,
  DatePicker,
  Space,
  Spin,
  Alert,
} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { UserOutlined, DollarOutlined, WalletOutlined, RiseOutlined } from '@ant-design/icons';
import {
  useGetMonthlyNewUsers,
  useGetMonthlyLearnerPayments,
  useGetMonthlyCoachEarnings,
  useGetMonthlyPlatformRevenue,
  formatCurrency,
  formatNumber,
  calculatePercentageChange,
  getCurrentAndPreviousMonthData,
  MonthlyDataItem,
} from '@/@crema/services/apis/analysis';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  const [, setCustomDateRange] = useState<any>(null);

  // ✅ Call 4 API thực tế
  const {
    data: newUsersData,
    isLoading: newUsersLoading,
    error: newUsersError,
  } = useGetMonthlyNewUsers();

  const {
    data: learnerPaymentsData,
    isLoading: learnerPaymentsLoading,
    error: learnerPaymentsError,
  } = useGetMonthlyLearnerPayments();

  const {
    data: coachEarningsData,
    isLoading: coachEarningsLoading,
    error: coachEarningsError,
  } = useGetMonthlyCoachEarnings();

  const {
    data: platformRevenueData,
    isLoading: platformRevenueLoading,
    error: platformRevenueError,
  } = useGetMonthlyPlatformRevenue();

  // ✅ Tính toán loading và error tổng hợp
  const isLoading =
    newUsersLoading || learnerPaymentsLoading || coachEarningsLoading || platformRevenueLoading;
  const hasError =
    newUsersError || learnerPaymentsError || coachEarningsError || platformRevenueError;

  // ✅ Tính toán stats từ data thực tế
  const userStats = newUsersData
    ? getCurrentAndPreviousMonthData(newUsersData)
    : { current: 0, previous: 0 };
  const learnerStats = learnerPaymentsData
    ? getCurrentAndPreviousMonthData(learnerPaymentsData)
    : { current: 0, previous: 0 };
  const coachStats = coachEarningsData
    ? getCurrentAndPreviousMonthData(coachEarningsData)
    : { current: 0, previous: 0 };
  const systemStats = platformRevenueData
    ? getCurrentAndPreviousMonthData(platformRevenueData)
    : { current: 0, previous: 0 };

  const userGrowth = calculatePercentageChange(userStats.current, userStats.previous);
  const learnerGrowth = calculatePercentageChange(learnerStats.current, learnerStats.previous);
  const coachGrowth = calculatePercentageChange(coachStats.current, coachStats.previous);
  const systemGrowth = calculatePercentageChange(systemStats.current, systemStats.previous);

  // ✅ Tính tổng
  const userTotal = newUsersData
    ? newUsersData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  const learnerTotal = learnerPaymentsData
    ? learnerPaymentsData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  const coachTotal = coachEarningsData
    ? coachEarningsData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  const systemTotal = platformRevenueData
    ? platformRevenueData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;

  // ✅ Hiển thị loading
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu thống kê tài chính...</div>
      </div>
    );
  }

  // ✅ Hiển thị lỗi
  if (hasError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải dữ liệu thống kê tài chính. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>📊 Thống Kê Tài Chính</Title>
        {/* Additional Summary Row */}
        <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
          <Col xs={24} md={8}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Tổng doanh thu năm"
                value={systemTotal + learnerTotal}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Tổng chi phí HLV"
                value={coachTotal}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ borderRadius: '8px' }}>
              <Statistic
                title="Lợi nhuận ròng"
                value={systemTotal}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
        {/* Filter Controls */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Space>
            <span style={{ fontWeight: 500 }}>Thời gian:</span>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
              disabled={isLoading}
            >
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="quarter">Quý</Option>
              <Option value="year">Năm</Option>
              <Option value="custom">Tùy chọn</Option>
            </Select>

            {timeRange === 'custom' && (
              <RangePicker onChange={setCustomDateRange} format="DD/MM/YYYY" disabled={isLoading} />
            )}
          </Space>
        </Card>
      </div>

      {/* 4 Cards Statistics - 2 cards per row */}
      <Row gutter={[16, 16]}>
        {/* Card 1: Thống kê người dùng mới */}
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Người dùng mới"
                value={userStats.current}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix={`/ ${formatNumber(userTotal)} tổng`}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: userGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {userGrowth >= 0 ? '📈' : '📉'} {Math.abs(userGrowth).toFixed(1)}% so với tháng
                trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={newUsersData || []}>
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
          <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Doanh thu từ học viên"
                value={learnerStats.current}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: learnerGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {learnerGrowth >= 0 ? '📈' : '📉'} {Math.abs(learnerGrowth).toFixed(1)}% so với
                tháng trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={learnerPaymentsData || []}>
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
          <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Thu nhập của Coach"
                value={coachStats.current}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<WalletOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: coachGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {coachGrowth >= 0 ? '📈' : '📉'} {Math.abs(coachGrowth).toFixed(1)}% so với tháng
                trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coachEarningsData || []}>
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
          <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
            <div style={{ marginBottom: 16 }}>
              <Statistic
                title="Doanh thu hệ thống"
                value={systemStats.current}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: systemGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                  marginTop: '4px',
                }}
              >
                {systemGrowth >= 0 ? '📈' : '📉'} {Math.abs(systemGrowth).toFixed(1)}% so với tháng
                trước
              </div>
            </div>

            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={platformRevenueData || []}>
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
    </div>
  );
}
