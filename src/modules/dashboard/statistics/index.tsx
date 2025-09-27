'use client';

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Button,
  Select,
  DatePicker,
  message,
  Spin,
  Switch,
  Tooltip,
  Badge,
} from 'antd';

import {
  UserOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  StarOutlined,
  TrophyOutlined,
  RiseOutlined,
  ReloadOutlined,
  SettingOutlined,
  FullscreenOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

import IntlMessages from '@/@crema/helper/IntlMessages';
import StatisticsApiService from '@/services/statisticsApi';
import { StatisticsData, GetStatisticsParams } from '@/types/statistics';

// Import 3D Components
import Canvas3D from './components/Canvas3D';
import UserGrowthChart3D from './components/UserGrowthChart3D';
import UserDistributionChart3D from './components/UserDistributionChart3D';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const StatisticsPage: React.FC = () => {
  // States
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 3D Settings
  const [show3D, setShow3D] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Filters
  const [filters, setFilters] = useState<GetStatisticsParams>({
    dateRange: ['2024-01-01', '2024-12-31'],
    metrics: ['users', 'sessions', 'revenue', 'engagement'],
    granularity: 'month',
    includeRealTime: true,
    includePredictions: true,
    includeGeographic: true,
  });

  // Load statistics data
  const loadStatistics = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const response = await StatisticsApiService.getStatistics(filters);

      if (response.success) {
        setStatistics(response.data);
        setLastUpdated(response.lastUpdated);
      } else {
        message.error('Không thể tải dữ liệu thống kê');
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStatistics(false);
    setRefreshing(false);
    message.success('Đã cập nhật dữ liệu');
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof GetStatisticsParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    loadStatistics();
  };

  // Load initial data
  useEffect(() => {
    loadStatistics();
  }, []);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        loadStatistics(false);
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [filters]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <Spin size="large" tip="Đang tải 3D Statistics..." />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Title level={4}>Không có dữ liệu thống kê</Title>
        <Button type="primary" onClick={() => loadStatistics()}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              📊 Thống kê 3D Interactive
            </Title>
            <Text type="secondary">
              Cập nhật lần cuối:{' '}
              {lastUpdated ? StatisticsApiService.getTimeAgo(lastUpdated) : 'Đang tải...'}
            </Text>
          </Col>
          <Col>
            <Space>
              <Tooltip title="Bật/tắt 3D">
                <Switch
                  checkedChildren={<EyeOutlined />}
                  unCheckedChildren={<EyeInvisibleOutlined />}
                  checked={show3D}
                  onChange={setShow3D}
                />
              </Tooltip>
              <Tooltip title="Hiện lưới 3D">
                <Switch size="small" checked={showGrid} onChange={setShowGrid} disabled={!show3D} />
              </Tooltip>
              <Tooltip title="Performance stats">
                <Switch
                  size="small"
                  checked={showStats}
                  onChange={setShowStats}
                  disabled={!show3D}
                />
              </Tooltip>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>
                Làm mới
              </Button>
              <Button icon={<SettingOutlined />}>Cài đặt</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Overview Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={statistics.overview.totalUsers.current}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <Badge
                  count={`+${statistics.overview.totalUsers.change.toFixed(1)}%`}
                  style={{ backgroundColor: '#52c41a' }}
                />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sessions đang hoạt động"
              value={statistics.overview.activeSessions.current}
              prefix={<VideoCameraOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <Badge
                  count={`+${statistics.overview.activeSessions.change.toFixed(1)}%`}
                  style={{ backgroundColor: '#1890ff' }}
                />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={statistics.overview.totalRevenue.current}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              formatter={(value) => StatisticsApiService.formatNumber(Number(value), 'currency')}
              suffix={
                <Badge
                  count={`+${statistics.overview.totalRevenue.change.toFixed(1)}%`}
                  style={{ backgroundColor: '#faad14' }}
                />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Điểm hài lòng"
              value={statistics.overview.avgSatisfaction.current}
              prefix={<StarOutlined style={{ color: '#eb2f96' }} />}
              precision={1}
              suffix={
                <Space>
                  <span>/5</span>
                  <Badge
                    count={`+${statistics.overview.avgSatisfaction.change.toFixed(1)}%`}
                    style={{ backgroundColor: '#eb2f96' }}
                  />
                </Space>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <div>
              <Text strong style={{ marginBottom: 4, display: 'block' }}>
                📅 Khoảng thời gian
              </Text>
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    handleFilterChange('dateRange', [
                      dates[0].format('YYYY-MM-DD'),
                      dates[1].format('YYYY-MM-DD'),
                    ]);
                  }
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div>
              <Text strong style={{ marginBottom: 4, display: 'block' }}>
                📊 Độ chi tiết
              </Text>
              <Select
                style={{ width: '100%' }}
                value={filters.granularity}
                onChange={(value) => handleFilterChange('granularity', value)}
              >
                <Option value="hour">Giờ</Option>
                <Option value="day">Ngày</Option>
                <Option value="week">Tuần</Option>
                <Option value="month">Tháng</Option>
                <Option value="year">Năm</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div>
              <Text strong style={{ marginBottom: 4, display: 'block' }}>
                🎯 Metrics
              </Text>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                value={filters.metrics}
                onChange={(value) => handleFilterChange('metrics', value)}
                placeholder="Chọn metrics"
              >
                <Option value="users">👥 Users</Option>
                <Option value="sessions">🎥 Sessions</Option>
                <Option value="revenue">💰 Revenue</Option>
                <Option value="engagement">❤️ Engagement</Option>
                <Option value="geographic">🌍 Geographic</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              onClick={applyFilters}
              style={{ marginTop: 24 }}
              icon={<ThunderboltOutlined />}
            >
              Áp dụng
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginTop: 24 }}>
              <Space>
                <Tooltip title="Real-time data">
                  <Switch
                    size="small"
                    checked={filters.includeRealTime}
                    onChange={(checked) => handleFilterChange('includeRealTime', checked)}
                  />
                </Tooltip>
                <Text style={{ fontSize: '12px' }}>Real-time</Text>

                <Tooltip title="Predictions">
                  <Switch
                    size="small"
                    checked={filters.includePredictions}
                    onChange={(checked) => handleFilterChange('includePredictions', checked)}
                  />
                </Tooltip>
                <Text style={{ fontSize: '12px' }}>Dự đoán</Text>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 3D Charts Section */}
      {show3D && (
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {/* User Growth 3D Bar Chart */}
          <Col xs={24} lg={14}>
            <Canvas3D
              title="📈 Tăng trưởng người dùng 3D"
              description="Biểu đồ cột 3D hiển thị tăng trưởng theo tháng - Hover để xem chi tiết"
              height={500}
              showGrid={showGrid}
              showStats={showStats}
              config={{
                camera: { position: [10, 8, 10], fov: 60 },
                animations: { enabled: animationsEnabled, duration: 1000 },
                interactions: { hover: true, rotate: true, zoom: true },
              }}
            >
              <UserGrowthChart3D
                data={statistics.userAnalytics.userGrowth.monthly}
                animated={animationsEnabled}
                interactive={true}
                colors={{
                  learners: '#1890ff',
                  coaches: '#52c41a',
                  admins: '#faad14',
                }}
              />
            </Canvas3D>
          </Col>

          {/* User Distribution 3D Donut */}
          <Col xs={24} lg={10}>
            <Canvas3D
              title="🍩 Phân bố thiết bị 3D"
              description="Biểu đồ donut 3D hiển thị phân bố người dùng theo thiết bị"
              height={500}
              showGrid={showGrid}
              showStats={showStats}
              config={{
                camera: { position: [0, 8, 12], fov: 50 },
                animations: { enabled: animationsEnabled, duration: 1500 },
                interactions: { hover: true, rotate: true, zoom: true },
              }}
            >
              <UserDistributionChart3D
                data={statistics.userAnalytics.deviceUsage.devices}
                animated={animationsEnabled}
                interactive={true}
                innerRadius={1.5}
                outerRadius={3.5}
                height={1.2}
                explodeDistance={0.3}
              />
            </Canvas3D>
          </Col>
        </Row>
      )}

      {/* Additional Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tỷ lệ tăng trưởng"
              value={statistics.overview.growthRate.current}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sức khỏe hệ thống"
              value={statistics.overview.systemHealth.current}
              prefix={<TrophyOutlined style={{ color: '#13c2c2' }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Users online"
              value={statistics.timeSeriesData.realTime.activeUsers}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
              suffix={<Badge status="processing" text="Live" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Info */}
      <Card size="small" style={{ marginTop: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                🎮 3D Engine: Three.js + React Three Fiber
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ⚡ Render Mode: {animationsEnabled ? 'Animated' : 'Static'}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                📊 Data Points: {statistics.userAnalytics.userGrowth.monthly.length * 3} bars
              </Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                size="small"
                icon={<FullscreenOutlined />}
                onClick={() => message.info('Fullscreen mode - Coming soon!')}
              >
                Toàn màn hình
              </Button>
              <Switch
                size="small"
                checked={animationsEnabled}
                onChange={setAnimationsEnabled}
                checkedChildren="Animated"
                unCheckedChildren="Static"
              />
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StatisticsPage;
