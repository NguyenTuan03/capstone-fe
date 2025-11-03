'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  // Select,
  Avatar,
  Modal,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Tooltip,
  Badge,
  Rate,
  Tabs,
  // Image,
  List,
  Empty,
  Divider,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  CheckOutlined,
  CloseOutlined,
  // StarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  // StopOutlined,
  CalendarOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useGet } from '@/@crema/hooks/useApiQuery';
import { useVerifyCoach, useRejectCoach } from '@/@crema/services/apis/coaches';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

// Types
interface CoachData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  yearsOfExperience: number;
  rating: number;
  totalCourses: number;
  totalSessions: number;
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'rejected';
  registrationDate: string;
  rejectionReason?: string;
  credentials: CredentialData[];
  bio?: string;
}

interface CredentialData {
  id: string;
  name: string;
  type: string;
  publicUrl?: string;
  issuedAt?: string;
  expiresAt?: string;
  description?: string;
}

export default function CoachesPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingCoaches, setPendingCoaches] = useState<CoachData[]>([]);
  const [approvedCoaches, setApprovedCoaches] = useState<CoachData[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<CoachData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [coachFeedbacks, setCoachFeedbacks] = useState<any[]>([]);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch coaches from API
  const { data: coachesRes, isLoading } = useGet<any>('coaches', {
    page: currentPage,
    size: pageSize,
  });

  const verifyCoachMutation = useVerifyCoach();
  const rejectCoachMutation = useRejectCoach();

  useEffect(() => {
    const items = coachesRes?.items || [];
    const mapToCoachData = (item: any): CoachData => ({
      id: String(item.id),
      name: item.user?.fullName || item.user?.name || '-',
      email: item.user?.email || '-',
      phone: item.user?.phoneNumber || '-',
      avatar: item.user?.profilePicture || '',
      location: '-',
      yearsOfExperience: item.yearOfExperience ?? 0,
      rating: 0,
      totalCourses: 0,
      totalSessions: 0,
      status: (item.user?.isActive ? 'active' : 'pending') as CoachData['status'],
      registrationDate: item.createdAt || new Date().toISOString(),
      credentials: Array.isArray(item.credentials)
        ? item.credentials.map((c: any) => ({
            id: String(c.id),
            name: c.name,
            type: c.type,
            publicUrl: c.publicUrl || undefined,
            issuedAt: c.issuedAt || undefined,
            expiresAt: c.expiresAt || undefined,
            description: c.description || undefined,
          }))
        : [],
      bio: item.bio,
      rejectionReason: undefined,
    });

    const mapped: CoachData[] = items.map(mapToCoachData);
    setPendingCoaches(mapped.filter((c) => c.status === 'pending'));
    setApprovedCoaches(mapped.filter((c) => c.status === 'active'));
  }, [coachesRes]);

  // Actions
  const handleViewDetails = (coach: CoachData) => {
    setSelectedCoach(coach);
    setIsDetailModalVisible(true);
  };

  const handleApprove = (coach: CoachData) => {
    setSelectedCoach(coach);
    setIsApproveModalVisible(true);
  };

  const handleReject = (coach: CoachData) => {
    setSelectedCoach(coach);
    setRejectReason('');
    setIsRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    if (!selectedCoach) return;
    try {
      await verifyCoachMutation.mutateAsync(selectedCoach.id);
      message.success(`Đã phê duyệt huấn luyện viên ${selectedCoach.name}`);
      setIsApproveModalVisible(false);
      setPendingCoaches((prev) => prev.filter((c) => c.id !== selectedCoach.id));
      setApprovedCoaches((prev) => [...prev, { ...selectedCoach, status: 'active' }]);
    } catch (error: any) {
      message.error(error?.message || 'Phê duyệt thất bại');
    }
  };

  const confirmReject = async () => {
    if (!selectedCoach) return;
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await rejectCoachMutation.mutateAsync({ id: selectedCoach.id, reason: rejectReason.trim() });
      message.success(`Đã từ chối huấn luyện viên ${selectedCoach.name}`);
      setIsRejectModalVisible(false);
      setPendingCoaches((prev) => prev.filter((c) => c.id !== selectedCoach.id));
    } catch (error: any) {
      message.error(error?.message || 'Từ chối thất bại');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Columns for Pending Coaches
  const pendingColumns: ColumnsType<CoachData> = [
    {
      title: 'Thông tin',
      key: 'info',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={48} src={record.avatar || undefined} icon={<UserOutlined />} />
          <div className="flex-1">
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'yearsOfExperience',
      key: 'experience',
      width: 100,
      align: 'center',
      render: (years: number) => <Text strong>{years} năm</Text>,
    },
    {
      title: 'Chứng chỉ',
      key: 'credentials',
      width: 120,
      align: 'center',
      render: (_, record) => <Badge count={record.credentials.length} showZero color="blue" />,
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Phê duyệt">
            <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record)} />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button danger icon={<CloseOutlined />} onClick={() => handleReject(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Columns for Approved Coaches
  const approvedColumns: ColumnsType<CoachData> = [
    {
      title: 'Thông tin',
      key: 'info',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={48} src={record.avatar || undefined} icon={<UserOutlined />} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{record.name}</span>
              {record.rating >= 4.5 && (
                <Tooltip title="Huấn luyện viên xuất sắc">
                  <TrophyOutlined className="text-yellow-500" />
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      align: 'center',
      render: (rating: number) => (
        <div className="text-center">
          <div className="font-medium">{rating.toFixed(1)}</div>
          <div className="text-xs text-yellow-500">★★★★★</div>
        </div>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'totalCourses',
      key: 'totalCourses',
      width: 100,
      align: 'center',
    },
    {
      title: 'Buổi học',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      width: 100,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record) => (
        <div>
          <Badge
            status={status === 'active' ? 'success' : status === 'rejected' ? 'error' : 'warning'}
            text={
              status === 'active' ? 'Hoạt động' : status === 'rejected' ? 'Bị từ chối' : 'Tạm ngưng'
            }
          />
          {status === 'rejected' && record.rejectionReason && (
            <Tooltip title={record.rejectionReason}>
              <div className="text-xs text-red-500 mt-1 cursor-help">Xem lý do</div>
            </Tooltip>
          )}
        </div>
      ),
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
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredPendingCoaches = pendingCoaches.filter((coach) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return coach.name.toLowerCase().includes(search) || coach.email.toLowerCase().includes(search);
  });

  const filteredApprovedCoaches = approvedCoaches.filter((coach) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return coach.name.toLowerCase().includes(search) || coach.email.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Huấn luyện viên</h2>
            <p className="text-gray-500 text-sm">
              Phê duyệt và quản lý huấn luyện viên trong hệ thống
            </p>
          </div>

          <Search
            placeholder="Tìm kiếm theo tên, email..."
            allowClear
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full sm:w-80"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pending Card */}
        <Card
          className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-white"
          bodyStyle={{ padding: '24px' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Chờ phê duyệt</p>
              <h3 className="text-3xl font-bold text-orange-600">{pendingCoaches.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
              <ClockCircleOutlined className="text-2xl text-orange-600" />
            </div>
          </div>
        </Card>

        {/* Approved Card */}
        <Card
          className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-green-50 to-white"
          bodyStyle={{ padding: '24px' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Đã phê duyệt</p>
              <h3 className="text-3xl font-bold text-green-600">{approvedCoaches.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleOutlined className="text-2xl text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs with Tables */}
      <Card className="rounded-2xl border-0 shadow-sm" bodyStyle={{ padding: 0 }}>
        {(() => {
          const tabItems = [
            {
              key: 'pending',
              label: (
                <span>
                  <ClockCircleOutlined /> Chờ phê duyệt ({pendingCoaches.length})
                </span>
              ),
              children: (
                <Table
                  columns={pendingColumns}
                  dataSource={filteredPendingCoaches}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredPendingCoaches.length,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} huấn luyện viên`,
                    onChange: (page, size) => {
                      setCurrentPage(page);
                      setPageSize(size || 10);
                    },
                  }}
                />
              ),
            },
            {
              key: 'approved',
              label: (
                <span>
                  <CheckCircleOutlined /> Đã phê duyệt ({approvedCoaches.length})
                </span>
              ),
              children: (
                <Table
                  columns={approvedColumns}
                  dataSource={filteredApprovedCoaches}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredApprovedCoaches.length,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} huấn luyện viên`,
                    onChange: (page, size) => {
                      setCurrentPage(page);
                      setPageSize(size || 10);
                    },
                  }}
                />
              ),
            },
          ];

          return (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
              className="px-6 pt-2"
            />
          );
        })()}
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết Huấn luyện viên"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={
          selectedCoach?.status === 'pending'
            ? [
                <Button key="reject" danger onClick={() => handleReject(selectedCoach)}>
                  <CloseOutlined /> Từ chối
                </Button>,
                <Button key="approve" type="primary" onClick={() => handleApprove(selectedCoach)}>
                  <CheckOutlined /> Phê duyệt
                </Button>,
              ]
            : [
                <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                  Đóng
                </Button>,
              ]
        }
        width={800}
      >
        {selectedCoach && (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-start gap-4">
              <Avatar size={80} src={selectedCoach.avatar} icon={<UserOutlined />} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Title level={4} className="mb-0">
                    {selectedCoach.name}
                  </Title>
                  {selectedCoach.rating >= 4.5 && (
                    <TrophyOutlined className="text-yellow-500 text-xl" />
                  )}
                </div>
                {selectedCoach.status === 'active' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Rate disabled value={selectedCoach.rating} allowHalf />
                    <Text className="font-medium">{selectedCoach.rating.toFixed(1)}</Text>
                  </div>
                )}
                <Badge
                  status={selectedCoach.status === 'pending' ? 'processing' : 'success'}
                  text={selectedCoach.status === 'pending' ? 'Chờ phê duyệt' : 'Đã phê duyệt'}
                />
              </div>
            </div>

            {/* Basic Info */}
            <Descriptions title="Thông tin cơ bản" column={2} bordered>
              <Descriptions.Item
                label={
                  <>
                    <MailOutlined /> Email
                  </>
                }
                span={2}
              >
                {selectedCoach.email}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <PhoneOutlined /> Số điện thoại
                  </>
                }
              >
                {selectedCoach.phone}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <EnvironmentOutlined /> Khu vực
                  </>
                }
              >
                {selectedCoach.location}
              </Descriptions.Item>
              <Descriptions.Item label="Kinh nghiệm">
                {selectedCoach.yearsOfExperience} năm
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {formatDate(selectedCoach.registrationDate)}
              </Descriptions.Item>
            </Descriptions>

            {/* Bio */}
            {selectedCoach.bio && (
              <div>
                <Title level={5}>Giới thiệu</Title>
                <Paragraph>{selectedCoach.bio}</Paragraph>
              </div>
            )}

            {/* Credentials */}
            <div>
              <Title level={5}>
                <SafetyCertificateOutlined /> Chứng chỉ ({selectedCoach.credentials.length})
              </Title>
              <Space direction="vertical" className="w-full" size="middle">
                {selectedCoach.credentials.map((cred) => (
                  <Card key={cred.id} size="small">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{cred.name}</div>
                        <div className="text-sm text-gray-500 mb-2">
                          <Tag color="blue">{cred.type}</Tag>
                        </div>
                        {cred.description && (
                          <div className="text-sm text-gray-600 mb-2">{cred.description}</div>
                        )}
                        <Space size="middle" className="text-xs text-gray-500">
                          {cred.issuedAt && (
                            <span>
                              <CalendarOutlined /> Cấp: {formatDate(cred.issuedAt)}
                            </span>
                          )}
                          {cred.expiresAt && <span>Hết hạn: {formatDate(cred.expiresAt)}</span>}
                        </Space>
                      </div>
                      {cred.publicUrl && (
                        <Button
                          type="link"
                          icon={<LinkOutlined />}
                          onClick={() => window.open(cred.publicUrl, '_blank')}
                        >
                          Xem
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </Space>
            </div>

            {/* Stats for Approved Coaches */}
            {selectedCoach.status !== 'pending' && (
              <Descriptions title="Thống kê hoạt động" column={2} bordered>
                <Descriptions.Item label="Tổng khóa học">
                  {selectedCoach.totalCourses}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng buổi học">
                  {selectedCoach.totalSessions}
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Xác nhận phê duyệt"
        open={isApproveModalVisible}
        onOk={confirmApprove}
        onCancel={() => setIsApproveModalVisible(false)}
        okText="Phê duyệt"
        cancelText="Hủy"
        okButtonProps={{ loading: verifyCoachMutation.isPending }}
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn phê duyệt huấn luyện viên{' '}
            <Text strong>{selectedCoach?.name}</Text>?
          </Text>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <CheckCircleOutlined className="text-green-600 mr-2" />
            <Text className="text-green-600">
              Sau khi phê duyệt, huấn luyện viên có thể bắt đầu tạo khóa học và nhận học viên.
            </Text>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối phê duyệt"
        open={isRejectModalVisible}
        onOk={confirmReject}
        onCancel={() => setIsRejectModalVisible(false)}
        okText="Từ chối"
        okType="danger"
        cancelText="Hủy"
        okButtonProps={{ loading: rejectCoachMutation.isPending }}
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn từ chối huấn luyện viên <Text strong>{selectedCoach?.name}</Text>?
          </Text>
          <div className="mt-4">
            <Text strong className="block mb-2">
              Lý do từ chối: <span className="text-red-500">*</span>
            </Text>
            <TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối phê duyệt..."
            />
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-blue-500" />
            <span>Feedback của {selectedCoach?.name}</span>
          </div>
        }
        open={isFeedbackModalVisible}
        onCancel={() => {
          setIsFeedbackModalVisible(false);
          setCoachFeedbacks([]);
        }}
        footer={null}
        width={800}
      >
        {coachFeedbacks.length === 0 ? (
          <Empty description="Chưa có feedback nào" />
        ) : (
          <>
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <Row gutter={16}>
                <Col span={8}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{coachFeedbacks.length}</div>
                    <div className="text-sm text-gray-600">Tổng feedback</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">
                      {(
                        coachFeedbacks.reduce((sum, f) => sum + f.rating, 0) / coachFeedbacks.length
                      ).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Đánh giá TB</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {[...new Set(coachFeedbacks.map((f) => f.courseId))].length}
                    </div>
                    <div className="text-sm text-gray-600">Khóa học</div>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider>Danh sách feedback</Divider>

            <List
              dataSource={coachFeedbacks}
              renderItem={(feedback) => (
                <List.Item key={feedback.id}>
                  <Card className="w-full" size="small">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar icon={<UserOutlined />} size="small" />
                        <Text strong>{feedback.learnerName}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Rate disabled value={feedback.rating} className="text-sm" />
                        <Text className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                        </Text>
                      </div>
                    </div>
                    <div className="mb-2">
                      <Tag icon={<BookOutlined />} color="blue">
                        {feedback.courseName}
                      </Tag>
                    </div>
                    <Paragraph className="mb-0 text-gray-700">{feedback.comment}</Paragraph>
                  </Card>
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
