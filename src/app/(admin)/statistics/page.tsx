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
  Badge,
  Switch,
  Tooltip,
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
  ThunderboltOutlined,
} from '@ant-design/icons';

import StatisticsApiService from '@/services/statisticsApi';
import { StatisticsData, GetStatisticsParams } from '@/types/statistics';

// Import Chart Components
import UserGrowthChart from '@/modules/dashboard/statistics/components/UserGrowthChart';
import UserDistributionChart from '@/modules/dashboard/statistics/components/UserDistributionChart';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const StatisticsPage: React.FC = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });
  // States
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 3D Settings
  // Chart display states (simplified from 3D version)

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
  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
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
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>
                Làm mới
              </Button>
              <Button icon={<SettingOutlined />}>Cài đặt</Button>
            </Space>
          </Col>
        </Row>
      </div>

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

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* User Growth Chart */}
        <Col xs={24} lg={14}>
          <UserGrowthChart
            data={statistics.userAnalytics.userGrowth.monthly}
            title="📈 Tăng trưởng người dùng theo tháng"
          />
        </Col>

        {/* User Distribution Chart */}
        <Col xs={24} lg={10}>
          <UserDistributionChart
            data={statistics.userAnalytics.deviceUsage.devices}
            title="🍩 Phân bố thiết bị người dùng"
          />
        </Col>
      </Row>

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
                📊 Charts: Interactive 2D Visualization
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                📈 Data Points: {statistics.userAnalytics.userGrowth.monthly.length} months
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
                checked={true}
                disabled={true}
                checkedChildren="Interactive"
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
