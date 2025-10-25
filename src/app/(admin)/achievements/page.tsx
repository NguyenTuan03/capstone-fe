'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Tooltip,
  Switch,
  Badge,
  Form,
  InputNumber,
} from 'antd';
import {
  TrophyOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

// Types
interface AchievementData {
  id: string;
  type: string;
  name: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  
  // EventCountAchievement
  eventName?: string;
  targetCount?: number;
  
  // PropertyCheckAchievement
  entityName?: string;
  propertyName?: string;
  comparisonOperator?: string;
  targetValue?: string;
  
  // StreakAchievement
  targetStreakLength?: number;
  streakUnit?: string;
  
  // Stats
  earnedCount?: number;
  progressCount?: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  
  // Create form state
  const [createForm, setCreateForm] = useState({
    type: 'EVENT_COUNT',
    name: '',
    description: '',
    isActive: true,
    // EVENT_COUNT
    eventName: '',
    targetCount: 1,
    // PROPERTY_CHECK
    entityName: '',
    propertyName: '',
    comparisonOperator: '>=',
    targetValue: '',
    // STREAK
    targetStreakLength: 1,
    streakUnit: 'days',
  });

  // Filters
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load achievements data
  const loadAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const { achievements: mockAchievements } = await import('@/data_admin/achievements');
      const { learnerAchievements } = await import('@/data_admin/learner-achievements');
      const { achievementProgresses } = await import('@/data_admin/achievement-progresses');

      // Count earned and in-progress for each achievement
      let filteredAchievements = mockAchievements.map((achievement) => {
        const earnedCount = learnerAchievements.filter(
          (la) => la.achievement.id === achievement.id
        ).length;
        
        const progressCount = achievementProgresses.filter(
          (ap) => ap.achievement.id === achievement.id && ap.currentProgress < 100
        ).length;

        const data: AchievementData = {
          id: achievement.id.toString(),
          type: achievement.type,
          name: achievement.name,
          description: achievement.description || '',
          iconUrl: achievement.iconUrl || '',
          isActive: achievement.isActive,
          createdAt: achievement.createdAt.toISOString(),
          createdBy: achievement.createdBy.fullName,
          earnedCount,
          progressCount,
        };

        // Add type-specific fields
        if (achievement.type === 'EVENT_COUNT') {
          data.eventName = (achievement as any).eventName;
          data.targetCount = (achievement as any).targetCount;
        } else if (achievement.type === 'PROPERTY_CHECK') {
          data.eventName = (achievement as any).eventName;
          data.entityName = (achievement as any).entityName;
          data.propertyName = (achievement as any).propertyName;
          data.comparisonOperator = (achievement as any).comparisonOperator;
          data.targetValue = (achievement as any).targetValue;
        } else if (achievement.type === 'STREAK') {
          data.eventName = (achievement as any).eventName;
          data.targetStreakLength = (achievement as any).targetStreakLength;
          data.streakUnit = (achievement as any).streakUnit;
        }

        return data;
      });

      // Apply filters
      if (searchText) {
        const search = searchText.toLowerCase();
        filteredAchievements = filteredAchievements.filter(
          (a) =>
            a.name.toLowerCase().includes(search) ||
            a.description.toLowerCase().includes(search)
        );
      }

      if (typeFilter !== 'all') {
        filteredAchievements = filteredAchievements.filter((a) => a.type === typeFilter);
      }

      if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredAchievements = filteredAchievements.filter((a) => a.isActive === isActive);
      }

      // Pagination
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedAchievements = filteredAchievements.slice(start, end);

      setAchievements(paginatedAchievements);
      setTotal(filteredAchievements.length);
    } catch (error) {
      console.error('Error loading achievements:', error);
      message.error('Không thể tải danh sách thành tựu');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, typeFilter, statusFilter]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, typeFilter, statusFilter]);

  const handleViewDetails = (achievement: AchievementData) => {
    setSelectedAchievement(achievement);
    setIsDetailModalVisible(true);
  };

  const handleCreateAchievement = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
    // Reset form
    setCreateForm({
      type: 'EVENT_COUNT',
      name: '',
      description: '',
      isActive: true,
      eventName: '',
      targetCount: 1,
      entityName: '',
      propertyName: '',
      comparisonOperator: '>=',
      targetValue: '',
      targetStreakLength: 1,
      streakUnit: 'days',
    });
  };

  const handleConfirmCreate = () => {
    // Validate
    if (!createForm.name.trim()) {
      message.error('Vui lòng nhập tên thành tựu');
      return;
    }
    if (!createForm.description.trim()) {
      message.error('Vui lòng nhập mô tả');
      return;
    }

    if (createForm.type === 'EVENT_COUNT') {
      if (!createForm.eventName.trim()) {
        message.error('Vui lòng nhập tên event');
        return;
      }
      if (createForm.targetCount < 1) {
        message.error('Mục tiêu phải lớn hơn 0');
        return;
      }
    } else if (createForm.type === 'PROPERTY_CHECK') {
      if (!createForm.eventName.trim() || !createForm.entityName.trim() || 
          !createForm.propertyName.trim() || !createForm.targetValue.trim()) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }
    } else if (createForm.type === 'STREAK') {
      if (!createForm.eventName.trim()) {
        message.error('Vui lòng nhập tên event');
        return;
      }
      if (createForm.targetStreakLength < 1) {
        message.error('Target streak phải lớn hơn 0');
        return;
      }
    }

    message.success(`Đã tạo thành tựu "${createForm.name}" thành công!`);
    setIsCreateModalVisible(false);
    handleCancelCreate();
    loadAchievements();
  };

  const handleToggleStatus = async (achievement: AchievementData) => {
    const newStatus = !achievement.isActive;
    message.success(
      `Đã ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành tựu "${achievement.name}"`
    );
    loadAchievements();
  };

  const handleDelete = (achievement: AchievementData) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: (
        <div>
          <Text>
            Bạn có chắc chắn muốn xóa thành tựu{' '}
            <Text strong>"{achievement.name}"</Text>?
          </Text>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <Text className="text-red-600">
              ⚠️ Hành động này không thể hoàn tác. Tất cả progress và earned records sẽ bị xóa.
            </Text>
          </div>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        message.success(`Đã xóa thành tựu "${achievement.name}"`);
        loadAchievements();
      },
    });
  };

  const getTypeText = (type: string) => {
    const texts: { [key: string]: string } = {
      EVENT_COUNT: 'Đếm sự kiện',
      PROPERTY_CHECK: 'Kiểm tra thuộc tính',
      STREAK: 'Chuỗi liên tiếp',
    };
    return texts[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      EVENT_COUNT: 'blue',
      PROPERTY_CHECK: 'green',
      STREAK: 'orange',
    };
    return colors[type] || 'default';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      EVENT_COUNT: <ThunderboltOutlined className="text-2xl text-white" />,
      PROPERTY_CHECK: <SafetyOutlined className="text-2xl text-white" />,
      STREAK: <FireOutlined className="text-2xl text-white" />,
    };
    return icons[type] || <TrophyOutlined className="text-2xl text-white" />;
  };

  const getTypeGradient = (type: string) => {
    const gradients: { [key: string]: string } = {
      EVENT_COUNT: 'from-blue-400 to-blue-600',
      PROPERTY_CHECK: 'from-green-400 to-green-600',
      STREAK: 'from-orange-400 to-red-500',
    };
    return gradients[type] || 'from-yellow-400 to-orange-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns: ColumnsType<AchievementData> = [
    {
      title: 'Thành tựu',
      key: 'achievement',
      width: 300,
      render: (_, record) => (
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${getTypeGradient(record.type)} rounded-lg flex items-center justify-center shadow-md`}>
            {getTypeIcon(record.type)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
              {record.description}
            </div>
            <div className="mt-1">
              <Tag color={getTypeColor(record.type)} size="small">
                {getTypeText(record.type)}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Điều kiện',
      key: 'condition',
      width: 250,
      render: (_, record) => {
        if (record.type === 'EVENT_COUNT') {
          return (
            <div className="text-sm">
              <div>
                <Text strong>Event:</Text> {record.eventName}
              </div>
              <div>
                <Text strong>Mục tiêu:</Text> {record.targetCount} lần
              </div>
            </div>
          );
        } else if (record.type === 'PROPERTY_CHECK') {
          return (
            <div className="text-sm">
              <div>
                <Text strong>Entity:</Text> {record.entityName}
              </div>
              <div>
                <Text strong>Thuộc tính:</Text> {record.propertyName}
              </div>
              <div>
                <Text strong>Điều kiện:</Text> {record.comparisonOperator} {record.targetValue}
              </div>
            </div>
          );
        } else if (record.type === 'STREAK') {
          return (
            <div className="text-sm">
              <div>
                <Text strong>Event:</Text> {record.eventName}
              </div>
              <div>
                <Text strong>Streak:</Text> {record.targetStreakLength} {record.streakUnit}
              </div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircleOutlined className="text-green-500" />
            <Text strong className="text-green-600">
              {record.earnedCount}
            </Text>
            <Text type="secondary" className="text-xs">
              đã đạt
            </Text>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CloseCircleOutlined className="text-blue-500" />
            <Text strong className="text-blue-600">
              {record.progressCount}
            </Text>
            <Text type="secondary" className="text-xs">
              đang làm
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div>
          <Badge
            status={record.isActive ? 'success' : 'default'}
            text={record.isActive ? 'Kích hoạt' : 'Vô hiệu'}
          />
          <div className="mt-2">
            <Switch
              size="small"
              checked={record.isActive}
              onChange={() => handleToggleStatus(record)}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <Text className="text-sm">{formatDate(date)}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Title level={2}>Quản lý Thành tựu</Title>
          <Text className="text-gray-600">
            Quản lý hệ thống thành tựu và theo dõi tiến độ của học viên
        </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreateAchievement}
        >
          Tạo thành tựu mới
        </Button>
      </div>

      {/* Main Card */}
      <Card className="card-3d">
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, mô tả..."
              allowClear
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText('')}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              value={typeFilter}
              onChange={setTypeFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="EVENT_COUNT">Đếm sự kiện</Option>
              <Option value="PROPERTY_CHECK">Kiểm tra thuộc tính</Option>
              <Option value="STREAK">Chuỗi liên tiếp</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Kích hoạt</Option>
              <Option value="inactive">Vô hiệu</Option>
            </Select>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={achievements}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} thành tựu`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            <span>Chi tiết Thành tựu</span>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedAchievement && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tên thành tựu" span={2}>
                <Text strong>{selectedAchievement.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedAchievement.description}
              </Descriptions.Item>
              <Descriptions.Item label="Loại">
                <Tag color={getTypeColor(selectedAchievement.type)}>
                  {getTypeText(selectedAchievement.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  status={selectedAchievement.isActive ? 'success' : 'default'}
                  text={selectedAchievement.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                />
              </Descriptions.Item>

              {/* Type-specific conditions */}
              {selectedAchievement.type === 'EVENT_COUNT' && (
                <>
                  <Descriptions.Item label="Event Name" span={2}>
                    <Tag>{selectedAchievement.eventName}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mục tiêu" span={2}>
                    <Text strong className="text-blue-600">
                      {selectedAchievement.targetCount} lần
                    </Text>
                  </Descriptions.Item>
                </>
              )}

              {selectedAchievement.type === 'PROPERTY_CHECK' && (
                <>
                  <Descriptions.Item label="Event Name">
                    <Tag>{selectedAchievement.eventName}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Entity Name">
                    <Tag>{selectedAchievement.entityName}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Property Name">
                    <Tag>{selectedAchievement.propertyName}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Comparison">
                    <Tag>{selectedAchievement.comparisonOperator}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Target Value" span={2}>
                    <Text strong className="text-blue-600">
                      {selectedAchievement.targetValue}
                    </Text>
                  </Descriptions.Item>
                </>
              )}

              {selectedAchievement.type === 'STREAK' && (
                <>
                  <Descriptions.Item label="Event Name" span={2}>
                    <Tag>{selectedAchievement.eventName}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Target Streak">
                    <Text strong className="text-blue-600">
                      {selectedAchievement.targetStreakLength}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Streak Unit">
                    <Tag>{selectedAchievement.streakUnit}</Tag>
                  </Descriptions.Item>
                </>
              )}

              {/* Statistics */}
              <Descriptions.Item label="Số học viên đã đạt">
                <Text strong className="text-green-600">
                  {selectedAchievement.earnedCount} người
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số học viên đang làm">
                <Text strong className="text-blue-600">
                  {selectedAchievement.progressCount} người
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo" span={2}>
                {formatDate(selectedAchievement.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Create Achievement Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            <span>Tạo thành tựu mới</span>
          </div>
        }
        open={isCreateModalVisible}
        onOk={handleConfirmCreate}
        onCancel={handleCancelCreate}
        okText="Tạo thành tựu"
        cancelText="Hủy"
        width={700}
      >
        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <Text strong>
              Loại thành tựu: <span className="text-red-500">*</span>
            </Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={createForm.type}
              onChange={(value) => setCreateForm({ ...createForm, type: value })}
            >
              <Option value="EVENT_COUNT">
                <ThunderboltOutlined /> Đếm sự kiện (EVENT_COUNT)
              </Option>
              <Option value="PROPERTY_CHECK">
                <SafetyOutlined /> Kiểm tra thuộc tính (PROPERTY_CHECK)
              </Option>
              <Option value="STREAK">
                <FireOutlined /> Chuỗi liên tiếp (STREAK)
              </Option>
            </Select>
          </div>

          {/* Name */}
          <div>
            <Text strong>
              Tên thành tựu: <span className="text-red-500">*</span>
            </Text>
            <Input
              style={{ marginTop: 8 }}
              placeholder="VD: Người mới bắt đầu"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <Text strong>
              Mô tả: <span className="text-red-500">*</span>
            </Text>
            <TextArea
              style={{ marginTop: 8 }}
              rows={3}
              placeholder="VD: Hoàn thành buổi học đầu tiên"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            />
          </div>

          {/* Type-specific fields */}
          {createForm.type === 'EVENT_COUNT' && (
            <>
              <div>
                <Text strong>
                  Event Name: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: session_completed"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                />
              </div>
              <div>
                <Text strong>
                  Mục tiêu (số lần): <span className="text-red-500">*</span>
                </Text>
                <InputNumber
                  style={{ width: '100%', marginTop: 8 }}
                  min={1}
                  value={createForm.targetCount}
                  onChange={(value) => setCreateForm({ ...createForm, targetCount: value || 1 })}
                />
              </div>
            </>
          )}

          {createForm.type === 'PROPERTY_CHECK' && (
            <>
              <div>
                <Text strong>
                  Event Name: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: course_completed"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                />
              </div>
              <div>
                <Text strong>
                  Entity Name: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: User"
                  value={createForm.entityName}
                  onChange={(e) => setCreateForm({ ...createForm, entityName: e.target.value })}
                />
              </div>
              <div>
                <Text strong>
                  Property Name: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: skill_level"
                  value={createForm.propertyName}
                  onChange={(e) => setCreateForm({ ...createForm, propertyName: e.target.value })}
                />
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>
                    Toán tử: <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={createForm.comparisonOperator}
                    onChange={(value) => setCreateForm({ ...createForm, comparisonOperator: value })}
                  >
                    <Option value="=">=</Option>
                    <Option value="!=">!=</Option>
                    <Option value=">">&gt;</Option>
                    <Option value=">=">&gt;=</Option>
                    <Option value="<">&lt;</Option>
                    <Option value="<=">&lt;=</Option>
                  </Select>
                </Col>
                <Col span={16}>
                  <Text strong>
                    Target Value: <span className="text-red-500">*</span>
                  </Text>
                  <Input
                    style={{ marginTop: 8 }}
                    placeholder="VD: advanced"
                    value={createForm.targetValue}
                    onChange={(e) => setCreateForm({ ...createForm, targetValue: e.target.value })}
                  />
                </Col>
              </Row>
            </>
          )}

          {createForm.type === 'STREAK' && (
            <>
              <div>
                <Text strong>
                  Event Name: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: daily_login"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                />
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>
                    Target Streak: <span className="text-red-500">*</span>
                  </Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    min={1}
                    value={createForm.targetStreakLength}
                    onChange={(value) =>
                      setCreateForm({ ...createForm, targetStreakLength: value || 1 })
                    }
                  />
                </Col>
                <Col span={12}>
                  <Text strong>
                    Đơn vị: <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={createForm.streakUnit}
                    onChange={(value) => setCreateForm({ ...createForm, streakUnit: value })}
                  >
                    <Option value="days">Ngày (days)</Option>
                    <Option value="weeks">Tuần (weeks)</Option>
                    <Option value="months">Tháng (months)</Option>
                  </Select>
                </Col>
              </Row>
            </>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <Text strong>Trạng thái:</Text>
            <Switch
              checked={createForm.isActive}
              onChange={(checked) => setCreateForm({ ...createForm, isActive: checked })}
              checkedChildren="Kích hoạt"
              unCheckedChildren="Vô hiệu"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

