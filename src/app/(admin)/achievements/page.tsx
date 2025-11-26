'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  InputNumber,
  App,
  Upload,
} from 'antd';
import {
  TrophyOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  FireOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useGet } from '@/@crema/hooks/useApiQuery';
import {
  useCreateEventCountAchievement,
  useCreateStreakAchievement,
  useCreatePropertyCheckAchievement,
  useDeleteAchievement,
  useActivateAchievement,
  useDeactivateAchievement,
  useUpdateEventCountAchievement,
  useUpdateStreakAchievement,
  useUpdatePropertyCheckAchievement,
} from '@/@crema/services/apis/achievements';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

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
}

export default function AchievementsPage() {
  // Use Ant Design App context for modal
  const { modal } = App.useApp();
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });
  const [loading, setLoading] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementData | null>(null);

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
  const [createIconFile, setCreateIconFile] = useState<File | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
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
  const [editIconFile, setEditIconFile] = useState<File | null>(null);

  const ENTITY_OPTIONS = [
    { label: 'Tiến trình người học', value: 'LearnerProgress' },
    { label: 'Bài kiểm tra', value: 'Quiz' },
    { label: 'Huấn luyện viên', value: 'Coach' },
    { label: 'Ghi danh', value: 'Enrollment' },
  ];

  const PROPERTY_OPTIONS_BY_ENTITY: Record<string, { label: string; value: string }[]> = {
    LearnerProgress: [
      { value: 'avgQuizScore', label: 'Điểm quiz trung bình' },
      {
        value: 'avgAiAnalysisScore',
        label: 'Điểm AI phân tích trung bình',
      },
      {
        value: 'sessionsCompleted',
        label: 'Số buổi học đã hoàn thành',
      },
      {
        value: 'progress',
        label: 'Tiến độ khóa học (%)',
      },
    ],
    Coach: [
      { value: 'averageRating', label: 'Điểm đánh giá trung bình' },
      {
        value: 'yearOfExperience',
        label: 'Số năm kinh nghiệm',
      },
      {
        value: 'verificationStatus',
        label: 'Trạng thái duyệt',
      },
    ],
    Enrollment: [
      {
        value: 'sessionCount',
        label: 'Số buổi đã tham gia',
      },
    ],
    Quiz: [{ value: 'score', label: 'Điểm quiz' }],
  };

  const getEntityLabel = (value?: string) => {
    if (!value) return '';
    return ENTITY_OPTIONS.find((opt) => opt.value === value)?.label || value;
  };

  const getPropertyLabel = (entity?: string, property?: string) => {
    if (!entity || !property) return '';
    const options = PROPERTY_OPTIONS_BY_ENTITY[entity];
    if (!options) return property;
    return options.find((opt) => opt.value === property)?.label || property;
  };

  // API mutations
  const createEventCountMutation = useCreateEventCountAchievement();
  const createStreakMutation = useCreateStreakAchievement();
  const createPropertyCheckMutation = useCreatePropertyCheckAchievement();
  const deleteAchievementMutation = useDeleteAchievement();
  const activateAchievementMutation = useActivateAchievement();
  const deactivateAchievementMutation = useDeactivateAchievement();
  const updateEventCountMutation = useUpdateEventCountAchievement();
  const updateStreakMutation = useUpdateStreakAchievement();
  const updatePropertyCheckMutation = useUpdatePropertyCheckAchievement();

  // Filters
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // API call - Get list
  const { data: achievementsRes, isLoading, refetch } = useGet<any>('achievements');

  // API call - Get detail by ID
  const { data: achievementDetail, isLoading: isLoadingDetail } = useGet<any>(
    selectedAchievementId ? `achievements/${selectedAchievementId}` : '',
    undefined,
    { enabled: !!selectedAchievementId && isDetailModalVisible },
  );

  // Map API response to UI data
  const achievements = useMemo(() => {
    if (!achievementsRes?.items) return [];

    let items = achievementsRes.items.map((item: any): AchievementData => {
      // Detect type from specific fields
      // PROPERTY_CHECK: có targetValue
      // STREAK: có streakUnit hoặc targetStreakLength
      // EVENT_COUNT: có targetCount
      let type = 'EVENT_COUNT'; // default
      if (item.targetValue !== undefined && item.targetValue !== null) {
        type = 'PROPERTY_CHECK';
      } else if (item.streakUnit !== undefined || item.targetStreakLength !== undefined) {
        type = 'STREAK';
      } else if (item.targetCount !== undefined && item.targetCount !== null) {
        type = 'EVENT_COUNT';
      }

      const data: AchievementData = {
        id: String(item.id),
        type,
        name: item.name,
        description: item.description || '',
        iconUrl: item.iconUrl || '',
        isActive: item.isActive,
        createdAt: item.createdAt,
        createdBy: 'Admin', // API không trả về, dùng default
        // Type-specific fields
        eventName: item.eventName,
        targetCount: item.targetCount,
        entityName: item.entityName,
        propertyName: item.propertyName,
        comparisonOperator: item.comparisonOperator,
        targetValue: item.targetValue,
        targetStreakLength: item.targetStreakLength,
        streakUnit: item.streakUnit,
      };

      return data;
    });

    // Client-side search filter (API không hỗ trợ search)
    if (searchText) {
      const search = searchText.toLowerCase();
      items = items.filter(
        (a: AchievementData) =>
          a.name.toLowerCase().includes(search) || a.description.toLowerCase().includes(search),
      );
    }

    // Client-side type filter (API không hỗ trợ)
    if (typeFilter !== 'all') {
      items = items.filter((a: AchievementData) => a.type === typeFilter);
    }

    // Client-side status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      items = items.filter((a: AchievementData) => a.isActive === isActive);
    }

    return items;
  }, [achievementsRes?.items, searchText, typeFilter, statusFilter]);

  const paginatedAchievements = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return achievements.slice(startIndex, startIndex + pageSize);
  }, [achievements, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, typeFilter, statusFilter]);

  const handleViewDetails = (achievement: AchievementData) => {
    setSelectedAchievementId(achievement.id); // Set ID để fetch detail
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
    setCreateIconFile(null);
  };

  const handleConfirmCreate = async () => {
    // Validate common fields
    if (!createForm.name.trim()) {
      message.error('Vui lòng nhập tên thành tựu');
      return;
    }
    if (!createForm.description.trim()) {
      message.error('Vui lòng nhập mô tả');
      return;
    }
    // Icon file is optional - không bắt buộc
    // if (!createIconFile) {
    //   message.error('Vui lòng chọn file icon');
    //   return;
    // }

    // Set loading state
    setIsCreating(true);

    try {
      // Call API based on type
      if (createForm.type === 'EVENT_COUNT') {
        // Validate EVENT_COUNT fields
        if (!createForm.eventName.trim()) {
          message.error('Vui lòng nhập tên event');
          setIsCreating(false);
          return;
        }
        if (createForm.targetCount < 1) {
          message.error('Mục tiêu phải lớn hơn 0');
          setIsCreating(false);
          return;
        }

        // Call EVENT_COUNT API
        await createEventCountMutation.mutateAsync({
          name: createForm.name,
          description: createForm.description,
          icon: createIconFile || undefined,
          isActive: createForm.isActive,
          eventName: createForm.eventName,
          targetCount: createForm.targetCount,
        });
      } else if (createForm.type === 'PROPERTY_CHECK') {
        // Validate PROPERTY_CHECK fields
        if (
          !createForm.eventName.trim() ||
          !createForm.entityName.trim() ||
          !createForm.propertyName.trim() ||
          !createForm.targetValue.trim()
        ) {
          message.error('Vui lòng điền đầy đủ thông tin');
          setIsCreating(false);
          return;
        }

        // Call PROPERTY_CHECK API
        await createPropertyCheckMutation.mutateAsync({
          name: createForm.name,
          description: createForm.description,
          icon: createIconFile || undefined,
          isActive: createForm.isActive,
          eventName: createForm.eventName,
          entityName: createForm.entityName,
          propertyName: createForm.propertyName,
          comparisonOperator: createForm.comparisonOperator,
          targetValue: createForm.targetValue,
        });
      } else if (createForm.type === 'STREAK') {
        // Validate STREAK fields
        if (!createForm.eventName.trim()) {
          message.error('Vui lòng nhập tên event');
          setIsCreating(false);
          return;
        }
        if (createForm.targetStreakLength < 1) {
          message.error('Target streak phải lớn hơn 0');
          setIsCreating(false);
          return;
        }

        // Call STREAK API
        await createStreakMutation.mutateAsync({
          name: createForm.name,
          description: createForm.description,
          icon: createIconFile || undefined,
          isActive: createForm.isActive,
          eventName: createForm.eventName,
          targetStreakLength: createForm.targetStreakLength,
          streakUnit: createForm.streakUnit,
        });
      }

      // Success - close modal, reset form, and refetch
      refetch();
    } catch (error: any) {
      // Error already handled by mutation onError
      console.error('Create achievement error:', error);
    } finally {
      // Always close modal and reset state (whether success or error)
      setIsCreating(false);
      setIsCreateModalVisible(false);
      handleCancelCreate();
    }
  };

  const handleToggleStatus = useCallback(
    async (achievement: AchievementData) => {
      const newStatus = !achievement.isActive;
      const statusText = newStatus ? 'kích hoạt' : 'vô hiệu hóa';

      modal.confirm({
        title: `Xác nhận ${statusText}`,
        content: `Bạn có chắc chắn muốn ${statusText} thành tựu "${achievement.name}"?`,
        okText: statusText.charAt(0).toUpperCase() + statusText.slice(1),
        okType: newStatus ? 'primary' : 'default',
        cancelText: 'Hủy',
        centered: true,
        onOk: async () => {
          try {
            // Call the appropriate API based on new status
            if (newStatus) {
              console.log('🟢 Activating achievement ID:', achievement.id);
              await activateAchievementMutation.mutateAsync(achievement.id);
            } else {
              console.log('🔴 Deactivating achievement ID:', achievement.id);
              await deactivateAchievementMutation.mutateAsync(achievement.id);
            }
            refetch();
          } catch (error) {
            console.error('Toggle status error:', error);
          }
        },
      });
    },
    [modal, activateAchievementMutation, deactivateAchievementMutation, refetch],
  );

  const handleDelete = useCallback(
    (achievement: AchievementData) => {
      console.log('🗑️ Attempting to delete achievement:', achievement);
      console.log('Achievement ID:', achievement.id);

      modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa thành tựu "${achievement.name}"? Hành động này không thể hoàn tác.`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        centered: true,
        onOk: async () => {
          try {
            console.log('🚀 Sending DELETE request for ID:', achievement.id);
            const result = await deleteAchievementMutation.mutateAsync(achievement.id);
            console.log('✅ Delete successful:', result);
            refetch();
          } catch (error: any) {
            console.error('❌ Delete achievement error:', error);
            console.error('Error response:', error?.response?.data);
            console.error('Error status:', error?.response?.status);
          }
        },
      });
    },
    [modal, deleteAchievementMutation, refetch],
  );

  // ============================================
  // EDIT HANDLERS
  // ============================================

  const handleEdit = useCallback((achievement: AchievementData) => {
    console.log('✏️ Editing achievement:', achievement);
    setEditingAchievement(achievement);

    // Pre-fill form with achievement data
    setEditForm({
      type: achievement.type,
      name: achievement.name,
      description: achievement.description,
      isActive: achievement.isActive,
      // EVENT_COUNT
      eventName: achievement.eventName || '',
      targetCount: achievement.targetCount || 1,
      // PROPERTY_CHECK
      entityName: achievement.entityName || '',
      propertyName: achievement.propertyName || '',
      comparisonOperator: achievement.comparisonOperator || '>=',
      targetValue: achievement.targetValue || '',
      // STREAK
      targetStreakLength: achievement.targetStreakLength || 1,
      streakUnit: achievement.streakUnit || 'days',
    });
    setEditIconFile(null); // Reset file upload

    setIsEditModalVisible(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditModalVisible(false);
    setEditingAchievement(null);
    setEditIconFile(null);
    setIsUpdating(false);
  }, []);

  const handleConfirmEdit = async () => {
    if (!editingAchievement) return;

    // Validate common fields
    if (!editForm.name.trim()) {
      message.error('Vui lòng nhập tên thành tựu');
      return;
    }
    if (!editForm.description.trim()) {
      message.error('Vui lòng nhập mô tả');
      return;
    }
    // Icon file is optional - không bắt buộc khi edit

    setIsUpdating(true);

    try {
      const id = editingAchievement.id;

      // Call API based on type
      if (editForm.type === 'EVENT_COUNT') {
        // Validate EVENT_COUNT fields
        if (!editForm.eventName.trim()) {
          message.error('Vui lòng nhập tên event');
          setIsUpdating(false);
          return;
        }
        if (editForm.targetCount < 1) {
          message.error('Mục tiêu phải lớn hơn 0');
          setIsUpdating(false);
          return;
        }

        await updateEventCountMutation.mutateAsync({
          id,
          data: {
            name: editForm.name,
            description: editForm.description,
            icon: editIconFile || undefined,
            isActive: editForm.isActive,
            eventName: editForm.eventName,
            targetCount: editForm.targetCount,
          },
        });
      } else if (editForm.type === 'PROPERTY_CHECK') {
        // Validate PROPERTY_CHECK fields
        if (
          !editForm.eventName.trim() ||
          !editForm.entityName.trim() ||
          !editForm.propertyName.trim() ||
          !editForm.targetValue.trim()
        ) {
          message.error('Vui lòng điền đầy đủ thông tin');
          setIsUpdating(false);
          return;
        }

        await updatePropertyCheckMutation.mutateAsync({
          id,
          data: {
            name: editForm.name,
            description: editForm.description,
            icon: editIconFile || undefined,
            isActive: editForm.isActive,
            eventName: editForm.eventName,
            entityName: editForm.entityName,
            propertyName: editForm.propertyName,
            comparisonOperator: editForm.comparisonOperator,
            targetValue: editForm.targetValue,
          },
        });
      } else if (editForm.type === 'STREAK') {
        // Validate STREAK fields
        if (!editForm.eventName.trim()) {
          message.error('Vui lòng nhập tên event');
          setIsUpdating(false);
          return;
        }
        if (editForm.targetStreakLength < 1) {
          message.error('Target streak phải lớn hơn 0');
          setIsUpdating(false);
          return;
        }

        await updateStreakMutation.mutateAsync({
          id,
          data: {
            name: editForm.name,
            description: editForm.description,
            icon: editIconFile || undefined,
            isActive: editForm.isActive,
            eventName: editForm.eventName,
            targetStreakLength: editForm.targetStreakLength,
            streakUnit: editForm.streakUnit,
          },
        });
      }

      // Success - close modal, reset form, and refetch
      refetch();
    } catch (error: any) {
      // Error already handled by mutation onError
      console.error('Update achievement error:', error);
    } finally {
      // Always close modal and reset state (whether success or error)
      setIsUpdating(false);
      setIsEditModalVisible(false);
      setEditingAchievement(null);
    }
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
    const icons: { [key: string]: React.ReactNode } = {
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
          <div
            className={`w-12 h-12 bg-gradient-to-br ${getTypeGradient(record.type)} rounded-lg flex items-center justify-center shadow-md`}
          >
            {getTypeIcon(record.type)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">{record.description}</div>
            <div className="mt-1">
              <Tag color={getTypeColor(record.type)}>{getTypeText(record.type)}</Tag>
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
                <Text strong>Đối tượng:</Text> {getEntityLabel(record.entityName)}
              </div>
              <div>
                <Text strong>Thuộc tính:</Text>{' '}
                {getPropertyLabel(record.entityName, record.propertyName)}
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
      render: (date: string) => <Text className="text-sm">{formatDate(date)}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleteAchievementMutation.isPending}
              onClick={(e) => {
                e.stopPropagation();
                console.log('🖱️ Delete button clicked!', record);
                handleDelete(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Title level={2}>Quản lý Thành tựu</Title>
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
          dataSource={paginatedAchievements}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: achievements.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 5);
            },
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} thành tựu`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            <span>Chi tiết thành tựu</span>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedAchievementId(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsDetailModalVisible(false);
              setSelectedAchievementId(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {isLoadingDetail ? (
          <div className="flex justify-center items-center py-12">
            <Space direction="vertical" align="center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <Text type="secondary">Đang tải thông tin...</Text>
            </Space>
          </div>
        ) : achievementDetail ? (
          (() => {
            // Detect type từ API response
            let detailType = 'EVENT_COUNT';
            if (achievementDetail.entityName || achievementDetail.propertyName) {
              detailType = 'PROPERTY_CHECK';
            } else if (achievementDetail.targetStreakLength !== undefined) {
              detailType = 'STREAK';
            }

            return (
              <div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Tên thành tựu" span={2}>
                    <Text strong>{achievementDetail.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả" span={2}>
                    {achievementDetail.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại thành tựu">
                    <Tag color={getTypeColor(detailType)}>{getTypeText(detailType)}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Badge
                      status={achievementDetail.isActive ? 'success' : 'default'}
                      text={achievementDetail.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                    />
                  </Descriptions.Item>

                  {/* Điều kiện theo từng loại thành tựu */}
                  {detailType === 'EVENT_COUNT' && (
                    <>
                      <Descriptions.Item label="Sự kiện" span={2}>
                        <Tag>{achievementDetail.eventName}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Mục tiêu (số lần)" span={2}>
                        <Text strong className="text-blue-600">
                          {achievementDetail.targetCount} lần
                        </Text>
                      </Descriptions.Item>
                    </>
                  )}

                  {detailType === 'PROPERTY_CHECK' && (
                    <>
                      <Descriptions.Item label="Sự kiện">
                        <Tag>{achievementDetail.eventName}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Đối tượng">
                        <Tag>{getEntityLabel(achievementDetail.entityName)}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Thuộc tính">
                        <Tag>
                          {getPropertyLabel(
                            achievementDetail.entityName,
                            achievementDetail.propertyName,
                          )}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Toán tử so sánh">
                        <Tag>{achievementDetail.comparisonOperator}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá trị cần đạt" span={2}>
                        <Text strong className="text-blue-600">
                          {achievementDetail.targetValue}
                        </Text>
                      </Descriptions.Item>
                    </>
                  )}

                  {detailType === 'STREAK' && (
                    <>
                      <Descriptions.Item label="Sự kiện" span={2}>
                        <Tag>{achievementDetail.eventName}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Độ dài chuỗi">
                        <Text strong className="text-blue-600">
                          {achievementDetail.targetStreakLength}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Đơn vị chuỗi">
                        <Tag>{achievementDetail.streakUnit}</Tag>
                      </Descriptions.Item>
                    </>
                  )}

                  {/* Thông tin người tạo */}
                  <Descriptions.Item label="Người tạo" span={2}>
                    <Space direction="vertical" size={0}>
                      <Text strong>{achievementDetail.createdBy?.fullName || 'N/A'}</Text>
                      <Text type="secondary" className="text-sm">
                        {achievementDetail.createdBy?.email || 'N/A'}
                      </Text>
                      {achievementDetail.createdBy?.phoneNumber && (
                        <Text type="secondary" className="text-sm">
                          {achievementDetail.createdBy.phoneNumber}
                        </Text>
                      )}
                    </Space>
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày tạo" span={2}>
                    {formatDate(achievementDetail.createdAt)}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            );
          })()
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">Không tìm thấy thông tin thành tựu</Text>
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
        confirmLoading={isCreating}
        okText={isCreating ? 'Đang tạo...' : 'Tạo thành tựu'}
        cancelText="Hủy"
        width={700}
        styles={{ body: { maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' } }}
        maskClosable={!isCreating}
        closable={!isCreating}
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
                <ThunderboltOutlined /> Đếm sự kiện
              </Option>
              <Option value="PROPERTY_CHECK">
                <SafetyOutlined /> Kiểm tra thuộc tính
              </Option>
              <Option value="STREAK">
                <FireOutlined /> Chuỗi liên tiếp
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

          {/* Icon Upload */}
          <div>
            <Text strong>
              Icon (tải ảnh lên): <span className="text-gray-400">(không bắt buộc)</span>
            </Text>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                // Kiểm tra loại file
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ được upload file ảnh!');
                  return Upload.LIST_IGNORE;
                }
                // Kiểm tra kích thước (max 5MB)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Ảnh phải nhỏ hơn 5MB!');
                  return Upload.LIST_IGNORE;
                }
                setCreateIconFile(file);
                return false; // Prevent auto upload
              }}
              onRemove={() => {
                setCreateIconFile(null);
              }}
              fileList={
                createIconFile
                  ? [
                      {
                        uid: '-1',
                        name: createIconFile.name,
                        status: 'done',
                        url: URL.createObjectURL(createIconFile),
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                Chọn file ảnh
              </Button>
            </Upload>
            <div className="mt-2 text-xs text-gray-500">
              💡 Chấp nhận: JPG, PNG, GIF, SVG. Tối đa 5MB
            </div>
          </div>

          {/* Type-specific fields */}
          {createForm.type === 'EVENT_COUNT' && (
            <>
              <div>
                <Text strong>
                  Tên sự kiện: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="Nhập tên sự kiện"
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
                  Tên sự kiện (Event Name): <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: QUIZ_COMPLETED"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                />
              </div>
              <div>
                <Text strong>
                  Đối tượng: <span className="text-red-500">*</span>
                </Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn đối tượng"
                  options={ENTITY_OPTIONS}
                  value={createForm.entityName || undefined}
                  onChange={(value) =>
                    setCreateForm({
                      ...createForm,
                      entityName: value,
                      propertyName: '',
                    })
                  }
                />
              </div>
              <div>
                <Text strong>
                  Thuộc tính: <span className="text-red-500">*</span>
                </Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder={
                    createForm.entityName
                      ? 'Chọn thuộc tính trong đối tượng mà bạn muốn so sánh'
                      : 'Chọn đối tượng trước'
                  }
                  options={
                    createForm.entityName
                      ? PROPERTY_OPTIONS_BY_ENTITY[createForm.entityName] || []
                      : []
                  }
                  value={createForm.propertyName || undefined}
                  onChange={(value) =>
                    setCreateForm({
                      ...createForm,
                      propertyName: value,
                    })
                  }
                  disabled={!createForm.entityName}
                />
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>
                    Toán tử so sánh: <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={createForm.comparisonOperator}
                    onChange={(value) =>
                      setCreateForm({ ...createForm, comparisonOperator: value })
                    }
                  >
                    <Option value="==">== (Equal)</Option>
                    <Option value="!=">!= (Not Equal)</Option>
                    <Option value=">">&gt; (Greater Than)</Option>
                    <Option value=">=">&gt;= (Greater or Equal)</Option>
                    <Option value="<">&lt; (Less Than)</Option>
                    <Option value="<=">&lt;= (Less or Equal)</Option>
                  </Select>
                  <Text type="secondary" className="text-xs mt-1 block">
                    Với điểm / số lượng / % nên dùng &gt;, &gt;=, &lt;, &lt;=. Với điểm tuyệt đối
                    hoặc trạng thái nên dùng == hoặc !=.
                  </Text>
                </Col>
                <Col span={16}>
                  <Text strong>
                    Người dùng cần đạt được: <span className="text-red-500">*</span>
                  </Text>
                  <Input
                    style={{ marginTop: 8 }}
                    placeholder="VD: 80, 100 (điểm, phần trăm, ...)"
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
                  Tên sự kiện: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: DAILY_LOGIN, SESSION_ATTENDED"
                  value={createForm.eventName}
                  onChange={(e) => setCreateForm({ ...createForm, eventName: e.target.value })}
                />
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>
                    Độ dài chuỗi: <span className="text-red-500">*</span>
                  </Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    min={1}
                    placeholder="VD: 7, 30"
                    value={createForm.targetStreakLength}
                    onChange={(value) =>
                      setCreateForm({ ...createForm, targetStreakLength: value || 1 })
                    }
                  />
                </Col>
                <Col span={12}>
                  <Text strong>
                    Đơn vị chuỗi: <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={createForm.streakUnit}
                    onChange={(value) => setCreateForm({ ...createForm, streakUnit: value })}
                  >
                    <Option value="days">days (Ngày)</Option>
                    <Option value="weeks">weeks (Tuần)</Option>
                    <Option value="months">months (Tháng)</Option>
                    <Option value="sessions">sessions (Buổi học)</Option>
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

      {/* Edit Achievement Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-blue-500" />
            <span>Chỉnh sửa thành tựu</span>
          </div>
        }
        open={isEditModalVisible}
        onOk={handleConfirmEdit}
        onCancel={handleCancelEdit}
        confirmLoading={isUpdating}
        okText={isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
        cancelText="Hủy"
        width={700}
        styles={{ body: { maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' } }}
        maskClosable={!isUpdating}
        closable={!isUpdating}
        centered
      >
        <div className="space-y-4">
          {/* Type (Read only) */}
          <div>
            <Text strong>Loại thành tựu:</Text>
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <Tag color="blue">{getTypeText(editForm.type)}</Tag>
              <Text type="secondary" className="text-xs ml-2">
                (Không thể thay đổi loại)
              </Text>
            </div>
          </div>

          {/* Name */}
          <div>
            <Text strong>
              Tên thành tựu: <span className="text-red-500">*</span>
            </Text>
            <Input
              style={{ marginTop: 8 }}
              placeholder="VD: Người mới bắt đầu"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>

          {/* Icon Upload */}
          <div>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                // Kiểm tra loại file
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ được upload file ảnh!');
                  return Upload.LIST_IGNORE;
                }
                // Kiểm tra kích thước (max 5MB)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Ảnh phải nhỏ hơn 5MB!');
                  return Upload.LIST_IGNORE;
                }
                setEditIconFile(file);
                return false; // Prevent auto upload
              }}
              onRemove={() => {
                setEditIconFile(null);
              }}
              fileList={
                editIconFile
                  ? [
                      {
                        uid: '-1',
                        name: editIconFile.name,
                        status: 'done',
                        url: URL.createObjectURL(editIconFile),
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                Chọn file ảnh mới
              </Button>
            </Upload>
            <Text strong>
              Icon mới (tải ảnh lên): <span className="text-gray-400">(không bắt buộc)</span>
            </Text>
            <div className="mt-2 text-xs text-gray-500">
              💡 Chấp nhận: JPG, PNG, GIF, SVG. Tối đa 5MB. Để trống nếu không muốn thay đổi icon.
            </div>
            {editingAchievement?.iconUrl && (
              <div className="mt-2 text-xs text-gray-500">
                Icon hiện tại:{' '}
                <img
                  src={editingAchievement.iconUrl}
                  alt="icon"
                  className="inline-block w-8 h-8 ml-2"
                />
              </div>
            )}
          </div>

          {/* Type-specific fields */}
          {editForm.type === 'EVENT_COUNT' && (
            <>
              <div>
                <Text strong>
                  Tên sự kiện: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="Nhập tên sự kiện"
                  value={editForm.eventName}
                  onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                />
              </div>
              <div>
                <Text strong>
                  Mục tiêu (số lần): <span className="text-red-500">*</span>
                </Text>
                <InputNumber
                  style={{ width: '100%', marginTop: 8 }}
                  min={1}
                  value={editForm.targetCount}
                  onChange={(value) => setEditForm({ ...editForm, targetCount: value || 1 })}
                />
              </div>
            </>
          )}

          {editForm.type === 'PROPERTY_CHECK' && (
            <>
              <div>
                <Text strong>
                  Tên sự kiện: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: QUIZ_COMPLETED"
                  value={editForm.eventName}
                  onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                />
              </div>
              <div>
                <Text strong>
                  Đối tượng: <span className="text-red-500">*</span>
                </Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder="Chọn đối tượng"
                  options={ENTITY_OPTIONS}
                  value={editForm.entityName || undefined}
                  onChange={(value) =>
                    setEditForm({
                      ...editForm,
                      entityName: value,
                      propertyName: '',
                    })
                  }
                />
              </div>
              <div>
                <Text strong>
                  Thuộc tính cần áp dụng: <span className="text-red-500">*</span>
                </Text>
                <Select
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder={editForm.entityName ? 'Chọn thuộc tính' : 'Chọn đối tượng trước'}
                  options={
                    editForm.entityName ? PROPERTY_OPTIONS_BY_ENTITY[editForm.entityName] || [] : []
                  }
                  value={editForm.propertyName || undefined}
                  onChange={(value) =>
                    setEditForm({
                      ...editForm,
                      propertyName: value,
                    })
                  }
                  disabled={!editForm.entityName}
                />
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>
                    Toán tử so sánh: <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={editForm.comparisonOperator}
                    onChange={(value) => setEditForm({ ...editForm, comparisonOperator: value })}
                  >
                    <Option value="==">== (Equal)</Option>
                    <Option value="!=">!= (Not Equal)</Option>
                    <Option value=">">&gt; (Greater Than)</Option>
                    <Option value=">=">&gt;= (Greater or Equal)</Option>
                    <Option value="<">&lt; (Less Than)</Option>
                    <Option value="<=">&lt;= (Less or Equal)</Option>
                  </Select>
                </Col>
                <Col span={16}>
                  <Text strong>
                    Người dùng cần đạt được: <span className="text-red-500">*</span>
                  </Text>
                  <Input
                    style={{ marginTop: 8 }}
                    placeholder="VD: 80, 100 (điểm, phần trăm, ...)"
                    value={editForm.targetValue}
                    onChange={(e) => setEditForm({ ...editForm, targetValue: e.target.value })}
                  />
                </Col>
              </Row>
            </>
          )}

          {editForm.type === 'STREAK' && (
            <>
              <div>
                <Text strong>
                  Tên sự kiện: <span className="text-red-500">*</span>
                </Text>
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="VD: DAILY_LOGIN, SESSION_ATTENDED"
                  value={editForm.eventName}
                  onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                />
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>
                    Độ dài chuỗi: <span className="text-red-500">*</span>
                  </Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    min={1}
                    placeholder="VD: 7, 30"
                    value={editForm.targetStreakLength}
                    onChange={(value) =>
                      setEditForm({ ...editForm, targetStreakLength: value || 1 })
                    }
                  />
                </Col>
                <Col span={12}>
                  <Text strong>
                    Đơn vị chuỗi: <span className="text-red-500">*</span>
                  </Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={editForm.streakUnit}
                    onChange={(value) => setEditForm({ ...editForm, streakUnit: value })}
                  >
                    <Option value="days">days (Ngày)</Option>
                    <Option value="weeks">weeks (Tuần)</Option>
                    <Option value="months">months (Tháng)</Option>
                    <Option value="sessions">sessions (Buổi học)</Option>
                  </Select>
                </Col>
              </Row>
            </>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <Text strong>Trạng thái:</Text>
            <Switch
              checked={editForm.isActive}
              onChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
              checkedChildren="Kích hoạt"
              unCheckedChildren="Vô hiệu"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
