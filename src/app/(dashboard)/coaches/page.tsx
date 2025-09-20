'use client';

import { useState, useEffect } from 'react';
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
  Form,
  Typography,
  Row,
  Col,
  message,
  Tabs,
  Descriptions,
  List,
  Rate,
  Dropdown,
  Tooltip,
  Alert,
} from 'antd';
import {
  TeamOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  StopOutlined,
  PlayCircleOutlined,
  FilterOutlined,
  ExportOutlined,
  StarOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  WarningOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

import { CoachApiService } from '@/services/coachApi';
import { CoachDetail, GetCoachesParams, CoachListStats } from '@/types/coach';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachDetail | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [isSuspendModalVisible, setIsSuspendModalVisible] = useState(false);
  const [stats, setStats] = useState<CoachListStats | null>(null);
  const [rejectForm] = Form.useForm();
  const [suspendForm] = Form.useForm();

  // Filters and pagination
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load coaches data
  const loadCoaches = async () => {
    setLoading(true);
    try {
      const params: GetCoachesParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        status: statusFilter === 'all' ? undefined : statusFilter,
        specialty: specialtyFilter === 'all' ? undefined : specialtyFilter,
        rating: ratingFilter === 'all' ? undefined : ratingFilter,
      };

      const response = await CoachApiService.getCoaches(params);
      setCoaches(response.coaches);
      setTotal(response.total);

      // Load stats
      const statsData = await CoachApiService.getCoachStats();
      setStats(statsData);
    } catch (error) {
      message.error('Không thể tải dữ liệu huấn luyện viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoaches();
  }, [currentPage, pageSize, searchText, statusFilter, specialtyFilter, ratingFilter]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'orange';
      case 'suspended':
        return 'red';
      case 'rejected':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'suspended':
        return 'Đình chỉ';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  // Coach actions
  const handleViewCoach = async (coachId: string) => {
    try {
      const coach = await CoachApiService.getCoachById(coachId);
      if (coach) {
        setSelectedCoach(coach);
        setIsDetailModalVisible(true);
      }
    } catch (error) {
      message.error('Không thể tải thông tin huấn luyện viên');
    }
  };

  const handleApproveCoach = async (coachId: string) => {
    try {
      await CoachApiService.approveCoach(coachId, 'current_admin');
      message.success('Duyệt huấn luyện viên thành công');
      loadCoaches();
    } catch (error) {
      message.error('Không thể duyệt huấn luyện viên');
    }
  };

  const handleRejectCoach = (coach: CoachDetail) => {
    setSelectedCoach(coach);
    setIsRejectModalVisible(true);
  };

  const handleSuspendCoach = (coach: CoachDetail) => {
    setSelectedCoach(coach);
    setIsSuspendModalVisible(true);
  };

  const handleUnsuspendCoach = async (coachId: string) => {
    try {
      await CoachApiService.unsuspendCoach(coachId);
      message.success('Kích hoạt huấn luyện viên thành công');
      loadCoaches();
    } catch (error) {
      message.error('Không thể kích hoạt huấn luyện viên');
    }
  };

  const handleDeleteCoach = async (coachId: string) => {
    try {
      await CoachApiService.deleteCoach(coachId);
      message.success('Xóa huấn luyện viên thành công');
      loadCoaches();
    } catch (error) {
      message.error('Không thể xóa huấn luyện viên');
    }
  };

  const submitReject = async (values: { reason: string }) => {
    if (!selectedCoach) return;

    try {
      await CoachApiService.rejectCoach(selectedCoach.id, values.reason, 'current_admin');
      message.success('Từ chối hồ sơ thành công');
      setIsRejectModalVisible(false);
      rejectForm.resetFields();
      loadCoaches();
    } catch (error) {
      message.error('Không thể từ chối hồ sơ');
    }
  };

  const submitSuspend = async (values: { reason: string }) => {
    if (!selectedCoach) return;

    try {
      await CoachApiService.suspendCoach(selectedCoach.id, values.reason, 'current_admin');
      message.success('Đình chỉ huấn luyện viên thành công');
      setIsSuspendModalVisible(false);
      suspendForm.resetFields();
      loadCoaches();
    } catch (error) {
      message.error('Không thể đình chỉ huấn luyện viên');
    }
  };

  // Action dropdown menu
  const getActionMenu = (coach: CoachDetail): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Xem chi tiết',
      onClick: () => handleViewCoach(coach.id),
    },
    ...(coach.status === 'pending'
      ? [
          {
            type: 'divider' as const,
          },
          {
            key: 'approve',
            icon: <CheckOutlined />,
            label: 'Duyệt hồ sơ',
            onClick: () =>
              Modal.confirm({
                title: 'Xác nhận duyệt',
                content: 'Bạn có chắc muốn duyệt huấn luyện viên này?',
                okText: 'Duyệt',
                cancelText: 'Hủy',
                onOk: () => handleApproveCoach(coach.id),
              }),
          },
          {
            key: 'reject',
            icon: <CloseOutlined />,
            label: 'Từ chối hồ sơ',
            onClick: () => handleRejectCoach(coach),
            danger: true,
          },
        ]
      : []),
    ...(coach.status === 'approved'
      ? [
          {
            type: 'divider' as const,
          },
          {
            key: 'suspend',
            icon: <StopOutlined />,
            label: 'Đình chỉ',
            onClick: () => handleSuspendCoach(coach),
            danger: true,
          },
        ]
      : []),
    ...(coach.status === 'suspended'
      ? [
          {
            type: 'divider' as const,
          },
          {
            key: 'unsuspend',
            icon: <PlayCircleOutlined />,
            label: 'Kích hoạt lại',
            onClick: () => handleUnsuspendCoach(coach.id),
          },
        ]
      : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Xóa huấn luyện viên',
      onClick: () =>
        Modal.confirm({
          title: 'Xác nhận xóa',
          content: 'Bạn có chắc muốn xóa huấn luyện viên này?',
          okText: 'Xóa',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk: () => handleDeleteCoach(coach.id),
        }),
      danger: true,
    },
  ];

  // Table columns
  const columns: ColumnsType<CoachDetail> = [
    {
      title: 'Thông tin huấn luyện viên',
      key: 'coachInfo',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} className="bg-blue-500" size="large">
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Text className="font-medium">{record.name}</Text>
              {record.isVerified && (
                <Tooltip title="Đã xác minh">
                  <CheckCircleOutlined className="text-green-500" />
                </Tooltip>
              )}
              {record.status === 'pending' && (
                <Tooltip title="Chờ duyệt">
                  <ClockCircleOutlined className="text-orange-500" />
                </Tooltip>
              )}
            </div>
            <Text className="text-sm text-gray-500">{record.email}</Text>
            <div className="flex items-center space-x-2 mt-1">
              <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Chuyên môn & Đánh giá',
      key: 'specialty',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          {record.profile?.specialties && record.profile.specialties.length > 0 ? (
            <div>
              {record.profile.specialties.slice(0, 2).map((specialty, index) => (
                <Tag key={index} color="blue" className="mb-1">
                  {specialty}
                </Tag>
              ))}
              {record.profile.specialties.length > 2 && (
                <Tag>+{record.profile.specialties.length - 2}</Tag>
              )}
            </div>
          ) : (
            <Text className="text-gray-400 text-sm">Chưa có thông tin</Text>
          )}
          {record.profile?.rating !== undefined && (
            <div className="flex items-center space-x-1">
              <Rate disabled value={record.profile.rating} count={5} className="text-xs" />
              <Text className="text-xs">({record.profile.totalSessions})</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Giá/Giờ',
      key: 'rate',
      width: 100,
      render: (_, record) => (
        <div>
          {record.profile?.hourlyRate ? (
            <Text className="font-medium">{formatCurrency(record.profile.hourlyRate)}</Text>
          ) : record.application?.requestedProfile.hourlyRate ? (
            <Text className="text-gray-500">
              {formatCurrency(record.application.requestedProfile.hourlyRate)}
            </Text>
          ) : (
            <Text className="text-gray-400">N/A</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Hoạt động',
      key: 'activity',
      width: 140,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm">
            <Text className="text-gray-500">Tham gia: </Text>
            <Text className="font-medium">{formatDate(record.joinDate)}</Text>
          </div>
          {record.lastActive && (
            <div className="text-sm">
              <Text className="text-gray-500">Hoạt động: </Text>
              <Text className="font-medium">{formatDate(record.lastActive)}</Text>
            </div>
          )}
          {record.profile && (
            <div className="text-sm">
              <Text className="text-gray-500">Sessions: </Text>
              <Text className="font-medium">{record.profile.totalSessions}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenu(record) }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Title level={2}>
            <IntlMessages id="coach.management.title" />
          </Title>
          <Text className="text-gray-600">
            <IntlMessages id="coach.management.subtitle" />
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>
            <IntlMessages id="coach.actions.export" />
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <TeamOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <Text className="text-gray-600">
                <IntlMessages id="coach.stats.total" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.approved}</div>
              <Text className="text-gray-600">
                <IntlMessages id="coach.stats.approved" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <Text className="text-gray-600">
                <IntlMessages id="coach.stats.pending" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <StarOutlined className="text-3xl text-yellow-500 mb-2" />
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <Text className="text-gray-600">
                <IntlMessages id="coach.stats.avgRating" />
              </Text>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Search
                placeholder="Tìm kiếm theo tên, email hoặc chuyên môn..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={() => {
                  setCurrentPage(1);
                  loadCoaches();
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FilterOutlined />
              <Text>Bộ lọc:</Text>
            </div>

            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              className="w-40"
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="approved">Đã duyệt</Option>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="suspended">Đình chỉ</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>

            <Select
              value={specialtyFilter}
              onChange={(value) => {
                setSpecialtyFilter(value);
                setCurrentPage(1);
              }}
              className="w-48"
              placeholder="Chuyên môn"
            >
              <Option value="all">Tất cả chuyên môn</Option>
              <Option value="Beginner Training">Hướng dẫn người mới</Option>
              <Option value="Advanced Strategy">Chiến thuật nâng cao</Option>
              <Option value="Technique Analysis">Phân tích kỹ thuật</Option>
              <Option value="Competitive Play">Thi đấu</Option>
              <Option value="Youth Development">Phát triển trẻ em</Option>
            </Select>

            <Select
              value={ratingFilter}
              onChange={(value) => {
                setRatingFilter(value);
                setCurrentPage(1);
              }}
              className="w-32"
              placeholder="Đánh giá"
            >
              <Option value="all">Tất cả</Option>
              <Option value="5">5 sao</Option>
              <Option value="4">4+ sao</Option>
              <Option value="3">3+ sao</Option>
              <Option value="2">2+ sao</Option>
              <Option value="1">1+ sao</Option>
            </Select>

            <Button
              onClick={() => {
                setStatusFilter('all');
                setSpecialtyFilter('all');
                setRatingFilter('all');
                setSearchText('');
                setCurrentPage(1);
              }}
            >
              <IntlMessages id="coach.filter.clear" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Coaches Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={coaches}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng số ${total} huấn luyện viên`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Coach Detail Modal */}
      <Modal
        title={<IntlMessages id="coach.detail.title" />}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedCoach && (
          <Tabs
            items={[
              {
                key: 'profile',
                label: 'Thông tin cá nhân',
                children: (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 pb-4 border-b">
                      <Avatar src={selectedCoach.avatar} size={80} className="bg-blue-500">
                        {selectedCoach.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <div className="flex-1">
                        <Title level={4}>{selectedCoach.name}</Title>
                        <Space>
                          <Tag color={getStatusColor(selectedCoach.status)}>
                            {getStatusText(selectedCoach.status)}
                          </Tag>
                          {selectedCoach.isVerified && <Tag color="green">ĐÃ XÁC MINH</Tag>}
                        </Space>
                        {selectedCoach.profile?.rating !== undefined && (
                          <div className="mt-2">
                            <Rate disabled value={selectedCoach.profile.rating} />
                            <Text className="ml-2">
                              {selectedCoach.profile.rating.toFixed(1)} (
                              {selectedCoach.profile.totalSessions} sessions)
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>

                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Email" span={1}>
                        {selectedCoach.email}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số điện thoại" span={1}>
                        {selectedCoach.phone}
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ" span={2}>
                        {selectedCoach.location}
                      </Descriptions.Item>
                      {selectedCoach.profile && (
                        <>
                          <Descriptions.Item label="Kinh nghiệm" span={1}>
                            {selectedCoach.profile.experience} năm
                          </Descriptions.Item>
                          <Descriptions.Item label="Giá/giờ" span={1}>
                            {formatCurrency(selectedCoach.profile.hourlyRate)}
                          </Descriptions.Item>
                        </>
                      )}
                      <Descriptions.Item label="Ngày tham gia" span={1}>
                        {formatDate(selectedCoach.joinDate)}
                      </Descriptions.Item>
                      {selectedCoach.lastActive && (
                        <Descriptions.Item label="Hoạt động cuối" span={1}>
                          {formatDate(selectedCoach.lastActive)}
                        </Descriptions.Item>
                      )}
                    </Descriptions>

                    {selectedCoach.profile?.bio && (
                      <div>
                        <Title level={5}>Giới thiệu</Title>
                        <Paragraph>{selectedCoach.profile.bio}</Paragraph>
                      </div>
                    )}

                    {selectedCoach.profile?.specialties && (
                      <div>
                        <Title level={5}>Chuyên môn</Title>
                        <Space wrap>
                          {selectedCoach.profile.specialties.map((specialty, index) => (
                            <Tag key={index} color="blue">
                              {specialty}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                  </div>
                ),
              },
              ...(selectedCoach.application
                ? [
                    {
                      key: 'application',
                      label: 'Hồ sơ đăng ký',
                      children: (
                        <div className="space-y-4">
                          <Alert
                            message="Hồ sơ đăng ký làm huấn luyện viên"
                            description="Thông tin do ứng viên cung cấp khi đăng ký làm huấn luyện viên"
                            type="info"
                            showIcon
                          />

                          <div>
                            <Title level={5}>Động lực</Title>
                            <Paragraph>{selectedCoach.application.motivation}</Paragraph>
                          </div>

                          <div>
                            <Title level={5}>Thông tin yêu cầu</Title>
                            <Descriptions column={2} bordered>
                              <Descriptions.Item label="Kinh nghiệm" span={1}>
                                {selectedCoach.application.requestedProfile.experience} năm
                              </Descriptions.Item>
                              <Descriptions.Item label="Giá/giờ mong muốn" span={1}>
                                {formatCurrency(
                                  selectedCoach.application.requestedProfile.hourlyRate,
                                )}
                              </Descriptions.Item>
                              <Descriptions.Item label="Chuyên môn" span={2}>
                                <Space wrap>
                                  {selectedCoach.application.requestedProfile.specialties.map(
                                    (specialty, index) => (
                                      <Tag key={index} color="purple">
                                        {specialty}
                                      </Tag>
                                    ),
                                  )}
                                </Space>
                              </Descriptions.Item>
                              <Descriptions.Item label="Phương pháp dạy" span={2}>
                                <Space wrap>
                                  {selectedCoach.application.requestedProfile.teachingMethods.map(
                                    (method, index) => (
                                      <Tag key={index} color="green">
                                        {method}
                                      </Tag>
                                    ),
                                  )}
                                </Space>
                              </Descriptions.Item>
                            </Descriptions>
                          </div>

                          <div>
                            <Title level={5}>Tài liệu đính kèm</Title>
                            <List
                              dataSource={selectedCoach.application.documents}
                              renderItem={(doc) => (
                                <List.Item
                                  actions={[
                                    <Button key="download" icon={<DownloadOutlined />} size="small">
                                      Tải xuống
                                    </Button>,
                                  ]}
                                >
                                  <List.Item.Meta
                                    avatar={<FileTextOutlined className="text-blue-500" />}
                                    title={doc.name}
                                    description={
                                      <div>
                                        <Text className="text-sm text-gray-500">
                                          Tải lên: {formatDate(doc.uploadedAt)}
                                        </Text>
                                        <div className="mt-1">
                                          {doc.verified ? (
                                            <Tag color="green">Đã xác minh</Tag>
                                          ) : (
                                            <Tag color="orange">Chờ xác minh</Tag>
                                          )}
                                        </div>
                                      </div>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </div>

                          {selectedCoach.status === 'pending' && (
                            <div className="flex justify-end space-x-2">
                              <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleApproveCoach(selectedCoach.id)}
                              >
                                Duyệt hồ sơ
                              </Button>
                              <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleRejectCoach(selectedCoach)}
                              >
                                Từ chối
                              </Button>
                            </div>
                          )}
                        </div>
                      ),
                    },
                  ]
                : []),
              ...(selectedCoach.recentFeedbacks
                ? [
                    {
                      key: 'feedbacks',
                      label: `Phản hồi (${selectedCoach.recentFeedbacks.length})`,
                      children: (
                        <div className="space-y-4">
                          <List
                            dataSource={selectedCoach.recentFeedbacks}
                            renderItem={(feedback) => (
                              <List.Item>
                                <Card size="small" className="w-full">
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <Avatar size="small">
                                          {feedback.studentName.charAt(0)}
                                        </Avatar>
                                        <Text className="font-medium">{feedback.studentName}</Text>
                                        <Text className="text-sm text-gray-500">
                                          {formatDate(feedback.sessionDate)}
                                        </Text>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Rate disabled value={feedback.rating} />
                                        {feedback.reported && (
                                          <Tag color="red" icon={<WarningOutlined />}>
                                            Đã báo cáo
                                          </Tag>
                                        )}
                                      </div>
                                    </div>
                                    <Paragraph className="mb-2">{feedback.comment}</Paragraph>
                                    <div className="grid grid-cols-4 gap-2 text-sm">
                                      <div>
                                        Chuyên môn:{' '}
                                        <Rate
                                          disabled
                                          value={feedback.aspectRatings.expertise}
                                          count={5}
                                          className="text-xs"
                                        />
                                      </div>
                                      <div>
                                        Giao tiếp:{' '}
                                        <Rate
                                          disabled
                                          value={feedback.aspectRatings.communication}
                                          count={5}
                                          className="text-xs"
                                        />
                                      </div>
                                      <div>
                                        Đúng giờ:{' '}
                                        <Rate
                                          disabled
                                          value={feedback.aspectRatings.punctuality}
                                          count={5}
                                          className="text-xs"
                                        />
                                      </div>
                                      <div>
                                        Kiên nhẫn:{' '}
                                        <Rate
                                          disabled
                                          value={feedback.aspectRatings.patience}
                                          count={5}
                                          className="text-xs"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </List.Item>
                            )}
                          />
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối hồ sơ"
        open={isRejectModalVisible}
        onCancel={() => setIsRejectModalVisible(false)}
        onOk={() => rejectForm.submit()}
        okText="Từ chối"
        okType="danger"
        cancelText="Hủy"
      >
        <Form form={rejectForm} layout="vertical" onFinish={submitReject}>
          <Form.Item
            name="reason"
            label="Lý do từ chối"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do từ chối hồ sơ..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        title="Đình chỉ huấn luyện viên"
        open={isSuspendModalVisible}
        onCancel={() => setIsSuspendModalVisible(false)}
        onOk={() => suspendForm.submit()}
        okText="Đình chỉ"
        okType="danger"
        cancelText="Hủy"
      >
        <Form form={suspendForm} layout="vertical" onFinish={submitSuspend}>
          <Form.Item
            name="reason"
            label="Lý do đình chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập lý do đình chỉ' }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do đình chỉ huấn luyện viên..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
