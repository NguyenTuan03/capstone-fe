'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Avatar,
  Progress,
  Tag,
  Typography,
  message,
  Row,
  Col,
  Tooltip,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  TrophyOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import AchievementApiService from '@/services/achievementApi';
import {
  UserAchievementProgress,
  AchievementFilterOptions,
  GetUserProgressParams,
} from '@/types/achievement';

const { Option } = Select;
const { Text } = Typography;

interface UserProgressProps {
  searchText: string;
  setSearchText: (value: string) => void;
  filterOptions: AchievementFilterOptions | null;
  onClearFilters: () => void;
}

const UserProgress: React.FC<UserProgressProps> = ({
  searchText,
  setSearchText,
  filterOptions,
  onClearFilters,
}) => {
  const [progress, setProgress] = useState<UserAchievementProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load user progress
  const loadUserProgress = async () => {
    setLoading(true);
    try {
      const params: GetUserProgressParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
      };

      const response = await AchievementApiService.getUserProgress(params);
      setProgress(response.progress);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('Không thể tải tiến độ người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadUserProgress();
  }, [pagination.current, pagination.pageSize, statusFilter]);

  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      render: (_: any, record: UserAchievementProgress) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar src={record.userAvatar} size="small">
            {record.userName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.userName}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.userId}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Achievement',
      dataIndex: 'achievementId',
      key: 'achievementId',
      render: (achievementId: string) => (
        <div>
          <Text style={{ fontSize: '13px' }}>{achievementId}</Text>
        </div>
      ),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (_: any, record: UserAchievementProgress) => (
        <div>
          <Progress
            percent={record.progress}
            size="small"
            status={record.isUnlocked ? 'success' : 'active'}
            strokeColor={record.isUnlocked ? '#52c41a' : '#1890ff'}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            {record.currentValue}/{record.targetValue}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isUnlocked',
      key: 'isUnlocked',
      render: (isUnlocked: boolean, record: UserAchievementProgress) => (
        <div>
          {isUnlocked ? (
            <Tag color="success" icon={<TrophyOutlined />}>
              Đã hoàn thành
            </Tag>
          ) : record.progress > 0 ? (
            <Tag color="processing">Đang tiến hành</Tag>
          ) : (
            <Tag color="default">Chưa bắt đầu</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày hoàn thành',
      dataIndex: 'unlockedAt',
      key: 'unlockedAt',
      render: (unlockedAt: string) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {unlockedAt ? AchievementApiService.getTimeAgo(unlockedAt) : '-'}
        </Text>
      ),
    },
    {
      title: 'Cập nhật cuối',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (lastUpdated: string) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {AchievementApiService.getTimeAgo(lastUpdated)}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: UserAchievementProgress) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadUserProgress();
  };

  const handleViewDetail = (record: UserAchievementProgress) => {
    // TODO: Open detail modal
    console.log('View detail:', record);
  };

  const handleTableChange = (paginationConfig: any) => {
    setPagination({
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
      total: pagination.total,
    });
  };

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm người dùng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả</Option>
              <Option value="completed">Đã hoàn thành</Option>
              <Option value="in_progress">Đang tiến hành</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<FilterOutlined />} onClick={onClearFilters}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Progress Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={progress}
          rowKey={(record) => `${record.userId}-${record.achievementId}`}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default UserProgress;
