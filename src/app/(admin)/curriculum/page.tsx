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
  Avatar,
  Modal,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Tooltip,
  Badge,
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Types
interface CourseData {
  id: string;
  name: string;
  description: string;
  level: string;
  learningFormat: string;
  status: string;
  minParticipants: number;
  maxParticipants: number;
  pricePerParticipant: number;
  startDate: string;
  endDate: string;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
  enrollmentCount?: number;
}

export default function CurriculumPage() {
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load courses data
  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { courses: mockCourses } = await import('@/data_admin/courses');

      // Convert to UI format
      let filteredCourses = mockCourses.map((course) => ({
        id: course.id.toString(),
        name: course.name,
        description: course.description || '',
        level: course.level,
        learningFormat: course.learningFormat,
        status: course.status,
        minParticipants: course.minParticipants,
        maxParticipants: course.maxParticipants,
        pricePerParticipant: course.pricePerParticipant,
        startDate: course.startDate.toISOString(),
        endDate: course.endDate.toISOString(),
        coachName: course.createdBy.fullName,
        coachEmail: course.createdBy.email,
        coachAvatar: course.createdBy.profilePicture || '',
        enrollmentCount: Math.floor(Math.random() * course.maxParticipants),
      }));

      // Apply filters
      if (searchText) {
        const search = searchText.toLowerCase();
        filteredCourses = filteredCourses.filter(
          (c) =>
            c.name.toLowerCase().includes(search) || c.coachName.toLowerCase().includes(search),
        );
      }

      if (statusFilter !== 'all') {
        filteredCourses = filteredCourses.filter((c) => c.status === statusFilter);
      }

      if (levelFilter !== 'all') {
        filteredCourses = filteredCourses.filter((c) => c.level === levelFilter);
      }

      // Pagination
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedCourses = filteredCourses.slice(start, end);

      setCourses(paginatedCourses);
      setTotal(filteredCourses.length);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, statusFilter, levelFilter]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, levelFilter]);

  const handleViewDetails = (course: CourseData) => {
    setSelectedCourse(course);
    setIsDetailModalVisible(true);
  };

  const handleApproveCourse = (course: CourseData) => {
    setSelectedCourse(course);
    setIsApproveModalVisible(true);
  };

  const handleRejectCourse = (course: CourseData) => {
    setSelectedCourse(course);
    setIsRejectModalVisible(true);
  };

  const confirmApprove = () => {
    if (!selectedCourse) return;
    message.success(`Đã phê duyệt khóa học "${selectedCourse.name}"`);
    setIsApproveModalVisible(false);
    loadCourses();
  };

  const confirmReject = () => {
    if (!selectedCourse) return;
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    message.success(`Đã từ chối khóa học "${selectedCourse.name}"`);
    setIsRejectModalVisible(false);
    setRejectReason('');
    loadCourses();
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING_APPROVAL: 'orange',
      APPROVED: 'blue',
      ONGOING: 'green',
      COMPLETED: 'default',
      CANCELLED: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      PENDING_APPROVAL: 'Chờ phê duyệt',
      APPROVED: 'Đã phê duyệt',
      ONGOING: 'Đang diễn ra',
      COMPLETED: 'Đã hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return texts[status] || status;
  };

  const getLevelText = (level: string) => {
    const texts: { [key: string]: string } = {
      BEGINNER: 'Cơ bản',
      INTERMEDIATE: 'Trung cấp',
      ADVANCED: 'Nâng cao',
      PROFESSIONAL: 'Chuyên nghiệp',
    };
    return texts[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      BEGINNER: 'green',
      INTERMEDIATE: 'blue',
      ADVANCED: 'orange',
      PROFESSIONAL: 'red',
    };
    return colors[level] || 'default';
  };

  const getFormatText = (format: string) => {
    return format === 'INDIVIDUAL' ? 'Cá nhân' : 'Nhóm';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns: ColumnsType<CourseData> = [
    {
      title: 'Khóa học',
      key: 'course',
      width: 300,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            <Tag color={getLevelColor(record.level)}>{getLevelText(record.level)}</Tag>
            <Tag>{getFormatText(record.learningFormat)}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Huấn luyện viên',
      key: 'coach',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={32} src={record.coachAvatar} icon={<UserOutlined />} />
          <div>
            <div className="text-sm font-medium">{record.coachName}</div>
            <div className="text-xs text-gray-500">{record.coachEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Học phí',
      dataIndex: 'pricePerParticipant',
      key: 'price',
      width: 120,
      align: 'right',
      render: (price: number) => (
        <Text strong className="text-green-600">
          {formatCurrency(price)}
        </Text>
      ),
    },
    {
      title: 'Học viên',
      key: 'participants',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.enrollmentCount || 0}/{record.maxParticipants}
          </div>
          <div className="text-xs text-gray-500">(Min: {record.minParticipants})</div>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'duration',
      width: 150,
      render: (_, record) => (
        <div className="text-sm">
          <div>{formatDate(record.startDate)}</div>
          <div className="text-gray-500">đến {formatDate(record.endDate)}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
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
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'PENDING_APPROVAL' && (
            <>
              <Tooltip title="Phê duyệt">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleApproveCourse(record)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleRejectCourse(record)}
                />
              </Tooltip>
            </>
          )}
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
      <div>
        <Title level={2}>Quản lý Khóa học</Title>
        <Text className="text-gray-600">Quản lý và phê duyệt các khóa học trên nền tảng</Text>
      </div>

      {/* Main Card */}
      <Card className="card-3d">
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên khóa học, huấn luyện viên..."
              allowClear
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText('')}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING_APPROVAL">Chờ phê duyệt</Option>
              <Option value="APPROVED">Đã phê duyệt</Option>
              <Option value="ONGOING">Đang diễn ra</Option>
              <Option value="COMPLETED">Đã hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              value={levelFilter}
              onChange={setLevelFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả cấp độ</Option>
              <Option value="BEGINNER">Cơ bản</Option>
              <Option value="INTERMEDIATE">Trung cấp</Option>
              <Option value="ADVANCED">Nâng cao</Option>
              <Option value="PROFESSIONAL">Chuyên nghiệp</Option>
            </Select>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={courses}
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
            showTotal: (total) => `Tổng ${total} khóa học`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết khóa học"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedCourse && (
          <div>
            <Title level={4}>{selectedCourse.name}</Title>
            <Descriptions bordered column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedCourse.description}
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ">
                <Tag color={getLevelColor(selectedCourse.level)}>
                  {getLevelText(selectedCourse.level)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức">
                {getFormatText(selectedCourse.learningFormat)}
              </Descriptions.Item>
              <Descriptions.Item label="Học phí">
                <Text strong className="text-green-600">
                  {formatCurrency(selectedCourse.pricePerParticipant)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng học viên">
                {selectedCourse.minParticipants} - {selectedCourse.maxParticipants} người
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {formatDate(selectedCourse.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {formatDate(selectedCourse.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Huấn luyện viên" span={2}>
                <div className="flex items-center gap-2">
                  <Avatar src={selectedCourse.coachAvatar} icon={<UserOutlined />} />
                  <div>
                    <div>{selectedCourse.coachName}</div>
                    <div className="text-sm text-gray-500">{selectedCourse.coachEmail}</div>
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={2}>
                <Tag color={getStatusColor(selectedCourse.status)}>
                  {getStatusText(selectedCourse.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Phê duyệt khóa học"
        open={isApproveModalVisible}
        onOk={confirmApprove}
        onCancel={() => setIsApproveModalVisible(false)}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn phê duyệt khóa học{' '}
            <Text strong>&quot;{selectedCourse?.name}&quot;</Text>?
          </Text>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <CheckOutlined className="text-green-600 mr-2" />
            <Text className="text-green-600">
              Sau khi phê duyệt, khóa học sẽ được công khai và học viên có thể đăng ký.
            </Text>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối khóa học"
        open={isRejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectReason('');
        }}
        okText="Từ chối"
        okType="danger"
        cancelText="Hủy"
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn từ chối khóa học{' '}
            <Text strong>&quot;{selectedCourse?.name}&quot;</Text>?
          </Text>
          <div className="mt-4">
            <Text strong className="block mb-2">
              Lý do từ chối: <span className="text-red-500">*</span>
            </Text>
            <TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối phê duyệt khóa học..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
