'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Button,
  Input,
  Select,
  Space,
  message,
  Row,
  Col,
  Statistic,
  Typography,
} from 'antd';

import {
  TrophyOutlined,
  StarOutlined,
  BarChartOutlined,
  UserOutlined,
  PlusOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import IntlMessages from '@/@crema/helper/IntlMessages';
import AchievementApiService from '@/services/achievementApi';
import { AchievementStats, AchievementFilterOptions } from '@/types/achievement';

// Import components (will be created)
import AchievementGallery from './components/AchievementGallery';
import AchievementBuilder from './components/AchievementBuilder';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const { TabPane } = Tabs;
const { Option } = Select;
const { Text, Title } = Typography;

const AchievementManagement: React.FC = () => {
  // States
  const [activeTab, setActiveTab] = useState('gallery');
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [filterOptions, setFilterOptions] = useState<AchievementFilterOptions | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [filterOptionsData] = await Promise.all([
        AchievementApiService.getFilterOptions(),
        loadStats(),
      ]);
      setFilterOptions(filterOptionsData);
    } catch (error) {
      message.error('Không thể tải dữ liệu ban đầu');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get stats from achievements API
      const response = await AchievementApiService.getAchievements({
        page: 1,
        limit: 1,
      });
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setCategoryFilter('all');
    setRarityFilter('all');
    setStatusFilter('all');
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Clear filters when changing tabs
    handleClearFilters();
  };

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
        <Title level={3} style={{ margin: 0 }}>
          Quản lý Thành tựu
        </Title>
        <Text type="secondary">
          Hệ thống gamification - Tạo và quản lý achievements để tăng động lực học tập
        </Text>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Tổng Achievements"
                value={stats.totalAchievements}
                prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Đang hoạt động"
                value={stats.activeAchievements}
                prefix={<StarOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Tổng Unlocks"
                value={stats.totalUnlocks}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="TB/User"
                value={stats.averageUnlocksPerUser}
                precision={1}
                prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Content */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          size="large"
          tabBarExtraContent={
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setActiveTab('builder')}
              >
                Tạo Achievement
              </Button>
              <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
            </Space>
          }
        >
          <TabPane
            tab={
              <span>
                <TrophyOutlined />
                Achievement Gallery
              </span>
            }
            key="gallery"
          >
            <AchievementGallery
              searchText={searchText}
              setSearchText={setSearchText}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              rarityFilter={rarityFilter}
              setRarityFilter={setRarityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              filterOptions={filterOptions}
              onClearFilters={handleClearFilters}
              onStatsUpdate={loadStats}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <PlusOutlined />
                Achievement Builder
              </span>
            }
            key="builder"
          >
            <AchievementBuilder onStatsUpdate={loadStats} />
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Analytics
              </span>
            }
            key="analytics"
          >
            <AnalyticsDashboard />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AchievementManagement;
