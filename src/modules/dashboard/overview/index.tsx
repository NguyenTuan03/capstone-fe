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
} from 'antd';

import {
  UserOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  FilterOutlined,
} from '@ant-design/icons';

import IntlMessages from '@/@crema/helper/IntlMessages';
import DashboardApiService from '@/services/dashboardApi';
import { DashboardStats, DashboardFilters } from '@/types/dashboard';

// Import components (will be created)
import StatsCards from './components/StatsCards';
import ChartsSection from './components/ChartsSection';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import PendingItems from './components/PendingItems';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardOverview: React.FC = () => {
  // States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Filters
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: ['2024-11-01', '2024-12-31'],
    userType: 'all',
    sessionType: 'all',
  });

  // Load dashboard data
  const loadDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const response = await DashboardApiService.getDashboardStats({
        filters,
        includeCharts: true,
        includeActivities: true,
      });

      if (response.success) {
        setStats(response.data);
        setLastUpdated(response.lastUpdated);
      } else {
        message.error('Không thể tải dữ liệu dashboard');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData(false);
    setRefreshing(false);
    message.success('Đã cập nhật dữ liệu');
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof DashboardFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    loadDashboardData();
  };

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        loadDashboardData(false);
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
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Tổng quan hệ thống
            </Title>
            <Text type="secondary">
              Cập nhật lần cuối:{' '}
              {lastUpdated ? DashboardApiService.getTimeAgo(lastUpdated) : 'Đang tải...'}
            </Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>
                Làm mới
              </Button>
              <Button icon={<FilterOutlined />}>Bộ lọc</Button>
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
                Thời gian
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
                Loại người dùng
              </Text>
              <Select
                style={{ width: '100%' }}
                value={filters.userType}
                onChange={(value) => handleFilterChange('userType', value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="learner">Học viên</Option>
                <Option value="coach">Huấn luyện viên</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div>
              <Text strong style={{ marginBottom: 4, display: 'block' }}>
                Loại session
              </Text>
              <Select
                style={{ width: '100%' }}
                value={filters.sessionType}
                onChange={(value) => handleFilterChange('sessionType', value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="online">Online</Option>
                <Option value="offline">Offline</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" onClick={applyFilters} style={{ marginTop: 24 }}>
              Áp dụng
            </Button>
          </Col>
        </Row>
      </Card>

      {stats && (
        <>
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Charts Section */}
          <ChartsSection stats={stats} />

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            {/* Activity Feed */}
            <Col xs={24} lg={14}>
              <ActivityFeed />
            </Col>

            {/* Quick Actions & Alerts */}
            <Col xs={24} lg={10}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <QuickActions />
                <PendingItems />
              </Space>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
