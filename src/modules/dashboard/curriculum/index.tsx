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
  BookOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { CurriculumApiService } from '@/services/curriculumApi';
import { CurriculumStats, CurriculumFilterOptions } from '@/types/curriculum';

// Import components (will be created)
import ChapterManagement from './components/ChapterManagement';
import LessonManagement from './components/LessonManagement';
import ContentEditor from './components/ContentEditor';
import QuizManagement from './components/QuizManagement';
import ActivityLogs from './components/ActivityLogs';

const { TabPane } = Tabs;
const { Option } = Select;
const { Text, Title } = Typography;

const CurriculumPageClient: React.FC = () => {
  // States
  const [activeTab, setActiveTab] = useState('chapters');
  const [stats, setStats] = useState<CurriculumStats | null>(null);
  const [filterOptions, setFilterOptions] = useState<CurriculumFilterOptions | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chapterFilter, setChapterFilter] = useState<string>('all');
  const [contentFilter, setContentFilter] = useState<string>('all');

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [filterOptionsData] = await Promise.all([
        CurriculumApiService.getFilterOptions(),
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
      // Get stats from chapters API
      const response = await CurriculumApiService.getChapters({
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
    setStatusFilter('all');
    setChapterFilter('all');
    setContentFilter('all');
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Clear filters when changing tabs
    handleClearFilters();
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý giáo trình
        </Title>
        <Text type="secondary">Quản lý nội dung giáo trình và bài học</Text>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title="Tổng chương"
                value={stats.totalChapters}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title="Tổng bài học"
                value={stats.totalLessons}
                prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title="Tổng bài kiểm tra"
                value={stats.totalQuizzes}
                prefix={<QuestionCircleOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title="Tổng thời lượng"
                value={CurriculumApiService.formatDuration(stats.totalDuration)}
                prefix={<VideoCameraOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title="TB bài học/chương"
                value={stats.avgLessonsPerChapter}
                precision={1}
                prefix={<BookOutlined style={{ color: '#eb2f96' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title="TB bài kiểm tra/chương"
                value={stats.avgQuizzesPerLesson}
                precision={1}
                prefix={<QuestionCircleOutlined style={{ color: '#13c2c2' }} />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Content */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange} type="card" size="large">
          <TabPane
            tab={
              <span>
                <BookOutlined />
                Chương
              </span>
            }
            key="chapters"
          >
            <ChapterManagement
              searchText={searchText}
              setSearchText={setSearchText}
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
                <FileTextOutlined />
                Bài học
              </span>
            }
            key="lessons"
          >
            <LessonManagement
              searchText={searchText}
              setSearchText={setSearchText}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              chapterFilter={chapterFilter}
              setChapterFilter={setChapterFilter}
              contentFilter={contentFilter}
              setContentFilter={setContentFilter}
              filterOptions={filterOptions}
              onClearFilters={handleClearFilters}
              onStatsUpdate={loadStats}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <VideoCameraOutlined />
                Nội dung
              </span>
            }
            key="content"
          >
            <ContentEditor onStatsUpdate={loadStats} />
          </TabPane>

          <TabPane
            tab={
              <span>
                <QuestionCircleOutlined />
                Bài kiểm tra
              </span>
            }
            key="quizzes"
          >
            <QuizManagement
              searchText={searchText}
              setSearchText={setSearchText}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              chapterFilter={chapterFilter}
              setChapterFilter={setChapterFilter}
              filterOptions={filterOptions}
              onClearFilters={handleClearFilters}
              onStatsUpdate={loadStats}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                Lịch sử thay đổi
              </span>
            }
            key="logs"
          >
            <ActivityLogs />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CurriculumPageClient;
