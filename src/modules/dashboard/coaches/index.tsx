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
  Dropdown,
  Tooltip,
  Badge,
  Rate,
  List,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  FilterOutlined,
  ExportOutlined,
  MoreOutlined,
  StarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CalendarOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

import { CoachApiService } from '@/services/coachApi';
import { Coach, GetCoachesParams, CoachStats, Certificate } from '@/types/coach';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CoachesPageClient() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCertificateModalVisible, setIsCertificateModalVisible] = useState(false);

  // Filters and pagination
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<CoachStats | null>(null);

  // Load coaches data
  const loadCoaches = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetCoachesParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        status: statusFilter === 'all' ? undefined : statusFilter,
        specialty: specialtyFilter === 'all' ? undefined : specialtyFilter,
        minRating: ratingFilter > 0 ? ratingFilter : undefined,
      };

      const response = await CoachApiService.getCoaches(params);
      setCoaches(response.coaches);
      setTotal(response.total);

      // Load stats
      const statsData = await CoachApiService.getCoachStats();
      setStats(statsData);
    } catch {
      message.error('Không thể tải danh sách huấn luyện viên');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, statusFilter, specialtyFilter, ratingFilter]);

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'suspended':
        return 'red';
      case 'pending':
        return 'orange';
      case 'rejected':
        return 'volcano';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCertificateStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'green';
      case 'pending':
        return 'orange';
      case 'expired':
        return 'red';
      case 'rejected':
        return 'volcano';
      default:
        return 'default';
    }
  };

  // Coach actions
  const handleViewCoach = async (coachId: string) => {
    try {
      const coach = await CoachApiService.getCoachById(coachId);
      if (coach) {
        setSelectedCoach(coach);
        setIsDetailModalVisible(true);
      }
    } catch {
      message.error('Không thể tải thông tin huấn luyện viên');
    }
  };

  const handleViewCertificates = async (coachId: string) => {
    try {
      const coach = await CoachApiService.getCoachById(coachId);
      if (coach) {
        setSelectedCoach(coach);
        setIsCertificateModalVisible(true);
      }
    } catch {
      message.error('Không thể tải thông tin chứng chỉ');
    }
  };

  const handleUpdateCertificate = async (
    coachId: string,
    certId: string,
    status: 'verified' | 'rejected',
    notes?: string,
  ) => {
    try {
      await CoachApiService.updateCertificateStatus(
        coachId,
        certId,
        status,
        'current_admin',
        notes,
      );
      message.success(
        status === 'verified' ? 'Đã xác minh chứng chỉ thành công' : 'Đã từ chối chứng chỉ',
      );

      // Reload certificate data
      if (selectedCoach) {
        const updatedCoach = await CoachApiService.getCoachById(selectedCoach.id);
        if (updatedCoach) {
          setSelectedCoach(updatedCoach);
        }
      }
    } catch {
      message.error('Không thể cập nhật trạng thái chứng chỉ');
    }
  };

  // Action dropdown menu
  const getActionMenu = (coach: Coach): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Xem chi tiết',
      onClick: () => handleViewCoach(coach.id),
    },
    {
      key: 'certificates',
      icon: <SafetyCertificateOutlined />,
      label: 'Quản lý chứng chỉ',
      onClick: () => handleViewCertificates(coach.id),
    },
  ];

  // Table columns
  const columns: ColumnsType<Coach> = [
    {
      title: 'Thông tin huấn luyện viên',
      key: 'coachInfo',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Avatar src={record.avatar} className="bg-blue-500" size="default">
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <Text className="font-medium">{record.name}</Text>
              {record.rating >= 4.5 && (
                <Tooltip title="Huấn luyện viên xuất sắc">
                  <TrophyOutlined className="text-yellow-500 text-xs" />
                </Tooltip>
              )}
            </div>
            <Text className="text-sm text-gray-500">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Chuyên môn',
      key: 'specialties',
      width: 160,
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.specialties[0]}</Tag>
          {record.specialties.length > 1 && (
            <Tag color="default">+{record.specialties.length - 1}</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="text-center">
          <Text className="font-medium">{record.rating.toFixed(1)}</Text>
          <div className="text-xs text-gray-500">⭐</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, record) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={
            record.status === 'active'
              ? 'Đang hoạt động'
              : record.status === 'suspended'
                ? 'Bị tạm ngưng'
                : 'Chờ duyệt'
          }
        />
      ),
    },
    {
      title: 'Buổi học',
      key: 'sessions',
      width: 80,
      align: 'center',
      render: (_, record) => <Text className="font-medium">{record.totalSessions}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
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
          <Title level={2}>Quản lý huấn luyện viên</Title>
          <Text className="text-gray-600">
            Quản lý thông tin và trạng thái của tất cả huấn luyện viên
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={4}>
            <Card className="text-center">
              <UserOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <Text className="text-gray-600">Tổng số huấn luyện viên</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card className="text-center">
              <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <Text className="text-gray-600">Đang hoạt động</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card className="text-center">
              <StopOutlined className="text-3xl text-red-500 mb-2" />
              <div className="text-2xl font-bold">{stats.suspended}</div>
              <Text className="text-gray-600">Bị tạm ngưng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card className="text-center">
              <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <Text className="text-gray-600">Chờ duyệt</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card className="text-center">
              <StarOutlined className="text-3xl text-yellow-500 mb-2" />
              <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
              <Text className="text-gray-600">Đánh giá trung bình</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Card className="text-center">
              <TrophyOutlined className="text-3xl text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <Text className="text-gray-600">Tổng buổi học</Text>
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
              <Option value="active">Đang hoạt động</Option>
              <Option value="suspended">Bị tạm ngưng</Option>
              <Option value="pending">Chờ duyệt</Option>
            </Select>

            <Select
              value={specialtyFilter}
              onChange={(value) => {
                setSpecialtyFilter(value);
                setCurrentPage(1);
              }}
              className="w-50"
              placeholder="Chuyên môn"
            >
              <Option value="all">Tất cả chuyên môn</Option>
              <Option value="Kỹ thuật cơ bản">Cơ bản</Option>
              <Option value="Chiến thuật nâng cao">Nâng cao</Option>
              <Option value="Huấn luyện trẻ em">Trẻ em</Option>
              <Option value="Thi đấu đôi">Thi đấu đôi</Option>
            </Select>

            <Select
              value={ratingFilter}
              onChange={(value) => {
                setRatingFilter(value);
                setCurrentPage(1);
              }}
              className="w-40"
              placeholder="Đánh giá tối thiểu"
            >
              <Option value={0}>Tất cả đánh giá</Option>
              <Option value={4}>4+ sao</Option>
              <Option value={4.5}>4.5+ sao</Option>
              <Option value={4.8}>4.8+ sao</Option>
            </Select>

            <Button
              onClick={() => {
                setStatusFilter('all');
                setSpecialtyFilter('all');
                setRatingFilter(0);
                setSearchText('');
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
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
          scroll={{ x: 1000 }}
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
        />
      </Card>

      {/* Coach Detail Modal */}
      <Modal
        title="Chi tiết huấn luyện viên"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedCoach && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar src={selectedCoach.avatar} size={80}>
                {selectedCoach.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <Title level={4} className="mb-1">
                    {selectedCoach.name}
                  </Title>
                  {selectedCoach.rating >= 4.5 && (
                    <Tooltip title="Huấn luyện viên xuất sắc">
                      <TrophyOutlined className="text-yellow-500" />
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Rate disabled value={selectedCoach.rating} allowHalf />
                  <Text className="font-medium">{selectedCoach.rating.toFixed(1)}</Text>
                </div>
                <Space>
                  <Badge
                    status={getStatusColor(selectedCoach.status) as any}
                    text={
                      selectedCoach.status === 'active'
                        ? 'Đang hoạt động'
                        : selectedCoach.status === 'suspended'
                          ? 'Bị tạm ngưng'
                          : 'Chờ duyệt'
                    }
                  />
                </Space>
              </div>
            </div>

            <Descriptions title="Thông tin cơ bản" column={2}>
              <Descriptions.Item label="Email">{selectedCoach.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedCoach.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">
                {selectedCoach.location || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {formatDate(selectedCoach.joinDate)}
              </Descriptions.Item>
              {selectedCoach.lastActive && (
                <Descriptions.Item label="Hoạt động cuối">
                  {formatDate(selectedCoach.lastActive)}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Descriptions title="Thông tin nghề nghiệp" column={2}>
              <Descriptions.Item label="Kinh nghiệm">
                {selectedCoach.experience} năm
              </Descriptions.Item>
              <Descriptions.Item label="Giá theo giờ">
                {formatCurrency(selectedCoach.hourlyRate)}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên môn" span={2}>
                <Space wrap>
                  {selectedCoach.specialties.map((specialty, index) => (
                    <Tag key={index} color="blue">
                      {specialty}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Thống kê hoạt động" column={2}>
              <Descriptions.Item label="Tổng buổi học">
                {selectedCoach.totalSessions}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng học viên">
                {selectedCoach.totalStudents}
              </Descriptions.Item>
            </Descriptions>

            {selectedCoach.bio && (
              <div>
                <Title level={5} className="mb-3">
                  Tiểu sử
                </Title>
                <Text>{selectedCoach.bio}</Text>
              </div>
            )}

            {selectedCoach.status === 'suspended' && selectedCoach.suspendReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Title level={5} className="text-red-600 mb-2">
                  Thông tin đình chỉ
                </Title>
                <Text className="text-red-600">{selectedCoach.suspendReason}</Text>
                {selectedCoach.suspendedAt && (
                  <div className="text-sm text-gray-500 mt-1">
                    Đình chỉ lúc: {formatDate(selectedCoach.suspendedAt)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Certificate Modal */}
      <Modal
        title="Quản lý chứng chỉ"
        open={isCertificateModalVisible}
        onCancel={() => setIsCertificateModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedCoach && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar src={selectedCoach.avatar} size="large">
                {selectedCoach.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Title level={4} className="mb-0">
                  {selectedCoach.name}
                </Title>
                <Text className="text-gray-500">{selectedCoach.email}</Text>
              </div>
            </div>

            <List
              dataSource={selectedCoach.certificates}
              renderItem={(cert: Certificate) => (
                <List.Item
                  actions={[
                    cert.certificateUrl && (
                      <Button
                        type="link"
                        icon={<LinkOutlined />}
                        onClick={() => window.open(cert.certificateUrl, '_blank')}
                      >
                        Xem chứng chỉ
                      </Button>
                    ),
                    cert.status === 'pending' && (
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() =>
                            handleUpdateCertificate(selectedCoach.id, cert.id, 'verified')
                          }
                        >
                          Xác minh
                        </Button>
                        <Button
                          danger
                          size="small"
                          onClick={() =>
                            handleUpdateCertificate(
                              selectedCoach.id,
                              cert.id,
                              'rejected',
                              'Chứng chỉ không hợp lệ',
                            )
                          }
                        >
                          Từ chối
                        </Button>
                      </Space>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={<SafetyCertificateOutlined className="text-2xl text-blue-500" />}
                    title={
                      <div className="flex items-center space-x-2">
                        <Text className="font-medium">{cert.name}</Text>
                        <Badge
                          status={getCertificateStatusColor(cert.status) as any}
                          text={
                            cert.status === 'verified'
                              ? 'Đã xác minh'
                              : cert.status === 'pending'
                                ? 'Chờ xác minh'
                                : cert.status === 'expired'
                                  ? 'Hết hạn'
                                  : 'Bị từ chối'
                          }
                        />
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <Text className="text-gray-500">Nhà cung cấp: {cert.issuer}</Text>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Text className="text-gray-500">
                            <CalendarOutlined className="mr-1" />
                            Ngày cấp: {formatDate(cert.issueDate)}
                          </Text>
                          {cert.expiryDate && (
                            <Text className="text-gray-500">
                              Ngày hết hạn: {formatDate(cert.expiryDate)}
                            </Text>
                          )}
                        </div>
                        {cert.verifiedBy && cert.verifiedAt && (
                          <div className="text-sm text-green-600">
                            Xác minh bởi: {cert.verifiedBy} - {formatDate(cert.verifiedAt)}
                          </div>
                        )}
                        {cert.notes && (
                          <div className="text-sm text-gray-600">Ghi chú: {cert.notes}</div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
