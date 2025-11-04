'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
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
  List,
  Empty,
  Divider,
  Skeleton,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  CheckOutlined,
  CloseOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
import { CoachVerificationStatus } from '@/types/enums';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

/**
 * TYPES
 */
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
  status: CoachVerificationStatus | null;
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

interface FeedbackItem {
  id: string | number;
  rating: number;
  learnerName: string;
  courseName: string;
  comment?: string;
  createdAt: string;
  courseId: string | number;
}

/**
 * HELPERS
 */
const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toLocaleDateString('vi-VN') : '-';

const statusColor: Record<
  CoachVerificationStatus | 'UNKNOWN',
  'success' | 'warning' | 'error' | 'processing' | 'default'
> = {
  VERIFIED: 'success',
  UNVERIFIED: 'processing',
  REJECTED: 'error',
  PENDING: 'processing',
  UNKNOWN: 'default',
};

const statusLabel: Record<CoachVerificationStatus | 'UNKNOWN', string> = {
  VERIFIED: 'Đã phê duyệt',
  UNVERIFIED: 'Chờ phê duyệt',
  REJECTED: 'Bị từ chối',
  PENDING: 'Chờ phê duyệt',
  UNKNOWN: 'Không rõ',
};

/**
 * MAIN PAGE
 */
export default function CoachesPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [selectedCoach, setSelectedCoach] = useState<CoachData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // API hooks
  const {
    data: coachesRes,
    isLoading,
    refetch,
  } = useGet<any>('coaches', {
    page,
    size,
  });

  const verifyCoachMutation = useVerifyCoach();
  const rejectCoachMutation = useRejectCoach();

  // Feedbacks: only fetch when modal open
  // const { data: feedbackRes, isLoading: isLoadingFeedback } = useGet<any>(
  //   selectedCoach ? `coaches/${selectedCoach.id}/feedbacks` : '',
  //   undefined,
  //   { enabled: isFeedbackModalVisible && !!selectedCoach?.id },
  // );

  const totalFromApi: number | undefined = coachesRes?.meta?.total || coachesRes?.total;

  // Normalize response
  const mappedCoaches: CoachData[] = useMemo(
    () =>
      (coachesRes?.items || []).map(
        (item: any): CoachData => ({
          id: String(item.id),
          name: item.user?.fullName || item.user?.name || '-',
          email: item.user?.email || '-',
          phone: item.user?.phoneNumber || '-',
          avatar: item.user?.profilePicture || '',
          location: item.user?.location || '-',
          yearsOfExperience: item.yearOfExperience ?? 0,
          rating: item.rating ?? 0,
          totalCourses: item.totalCourses ?? 0,
          totalSessions: item.totalSessions ?? 0,
          status: (item?.verificationStatus ?? null) as CoachVerificationStatus | null,
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
          rejectionReason: item.verificationReason || undefined,
        }),
      ),
    [coachesRes?.items],
  );

  // Derived group & search (client-side search for now)
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return mappedCoaches;
    return mappedCoaches.filter((c) =>
      [c.name, c.email, c.phone].some((f) => (f || '').toLowerCase().includes(q)),
    );
  }, [mappedCoaches, searchText]);

  const pendingCoaches = useMemo(
    () => filtered.filter((c) => c.status === CoachVerificationStatus.UNVERIFIED),
    [filtered],
  );
  const approvedCoaches = useMemo(
    () => filtered.filter((c) => c.status !== CoachVerificationStatus.UNVERIFIED),
    [filtered],
  );

  /** ACTIONS */
  const openDetail = (coach: CoachData) => {
    setSelectedCoach(coach);
    setIsDetailModalVisible(true);
  };

  const openApprove = (coach: CoachData) => {
    setSelectedCoach(coach);
    setIsApproveModalVisible(true);
  };

  const openReject = (coach: CoachData) => {
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
      setIsDetailModalVisible(false);
      await refetch();
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
      setIsDetailModalVisible(false);
      await refetch();
    } catch (error: any) {
      message.error(error?.message || 'Từ chối thất bại');
    }
  };

  /** TABLE COLUMNS */
  const InfoCell: React.FC<{ record: CoachData; showBadge?: boolean }> = ({
    record,
    showBadge,
  }) => (
    <div className="flex items-center gap-3">
      <Avatar size={48} src={record.avatar || undefined} icon={<UserOutlined />} />
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-medium truncate max-w-[220px] block">{record.name}</span>
          {showBadge && record.rating >= 4.5 && (
            <Tooltip title="Huấn luyện viên xuất sắc">
              <TrophyOutlined className="text-yellow-500" />
            </Tooltip>
          )}
        </div>
        <div className="text-sm text-gray-500 truncate max-w-[240px]">{record.email}</div>
      </div>
    </div>
  );

  const pendingColumns: ColumnsType<CoachData> = [
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => <InfoCell record={record} />,
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'yearsOfExperience',
      key: 'experience',
      align: 'center',
      width: 120,
      render: (years: number) => <Text strong>{years} năm</Text>,
    },
    {
      title: 'Chứng chỉ',
      key: 'credentials',
      align: 'center',
      width: 120,
      render: (_, record) => <Badge count={record.credentials.length} showZero color="blue" />,
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      width: 140,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => openDetail(record)} />
          </Tooltip>
          <Tooltip title="Phê duyệt">
            <Button type="primary" icon={<CheckOutlined />} onClick={() => openApprove(record)} />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button danger icon={<CloseOutlined />} onClick={() => openReject(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const approvedColumns: ColumnsType<CoachData> = [
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => <InfoCell record={record} showBadge />,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: 130,
      render: (rating: number) => (
        <div className="text-center">
          <div className="font-medium">{Number(rating || 0).toFixed(1)}</div>
          <Rate disabled value={rating} allowHalf style={{ fontSize: 12 }} />
        </div>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'totalCourses',
      key: 'totalCourses',
      align: 'center',
      width: 110,
    },
    {
      title: 'Buổi học',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      align: 'center',
      width: 110,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (status: CoachVerificationStatus | null, record) => {
        const key = (status || 'UNKNOWN') as keyof typeof statusColor;
        return (
          <div>
            <Badge status={statusColor[key]} text={statusLabel[key]} />
            {status === CoachVerificationStatus.REJECTED && record.rejectionReason && (
              <Tooltip title={record.rejectionReason}>
                <div className="text-xs text-red-500 mt-1 cursor-help">Lý do từ chối</div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button icon={<EyeOutlined />} onClick={() => openDetail(record)} />
        </Tooltip>
      ),
    },
  ];

  /** COUNTERS */
  const summaryCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <KpiCard
        title="Chờ phê duyệt"
        value={pendingCoaches.length}
        icon={<ClockCircleOutlined />}
        color="orange"
      />
      <KpiCard
        title="Đã phê duyệt / Từ chối"
        value={approvedCoaches.length}
        icon={<CheckCircleOutlined />}
        color="green"
      />
    </div>
  );

  /** RENDER */
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-2xl shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Huấn luyện viên</h2>
            <p className="text-gray-500 text-sm">
              Phê duyệt và quản lý huấn luyện viên trong hệ thống
            </p>
          </div>

          <Search
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            allowClear
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-full sm:w-96"
          />
        </div>
      </Card>

      {/* KPIs */}
      {isLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : summaryCards}

      {/* Tables */}
      <Card className="rounded-2xl border-0 shadow-sm" bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as 'pending' | 'approved')}
          items={[
            {
              key: 'pending',
              label: (
                <span>
                  <ClockCircleOutlined /> Chờ phê duyệt ({pendingCoaches.length})
                </span>
              ),
              children: (
                <Table<CoachData>
                  columns={pendingColumns}
                  dataSource={pendingCoaches}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize: size,
                    total: totalFromApi ?? pendingCoaches.length,
                    showSizeChanger: true,
                    onChange: (p, s) => {
                      setPage(p);
                      setSize(s || 10);
                    },
                    showTotal: (t) => `Tổng ${t} huấn luyện viên`,
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
                <Table<CoachData>
                  columns={approvedColumns}
                  dataSource={approvedCoaches}
                  rowKey="id"
                  loading={isLoading}
                  pagination={{
                    current: page,
                    pageSize: size,
                    total: totalFromApi ?? approvedCoaches.length,
                    showSizeChanger: true,
                    onChange: (p, s) => {
                      setPage(p);
                      setSize(s || 10);
                    },
                    showTotal: (t) => `Tổng ${t} huấn luyện viên`,
                  }}
                />
              ),
            },
          ]}
          size="large"
          className="px-6 pt-2"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết Huấn luyện viên"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={
          selectedCoach?.status === CoachVerificationStatus.UNVERIFIED
            ? [
                <Button
                  key="reject"
                  danger
                  onClick={() => selectedCoach && openReject(selectedCoach)}
                >
                  <CloseOutlined /> Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  onClick={() => selectedCoach && openApprove(selectedCoach)}
                >
                  <CheckOutlined /> Phê duyệt
                </Button>,
              ]
            : [
                <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
                  Đóng
                </Button>,
              ]
        }
        width={880}
      >
        {selectedCoach && (
          <div className="space-y-6">
            {/* Profile */}
            <div className="flex items-start gap-4">
              <Avatar size={84} src={selectedCoach.avatar} icon={<UserOutlined />} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Title level={4} className="mb-0 truncate">
                    {selectedCoach.name}
                  </Title>
                  {selectedCoach.rating >= 4.5 && (
                    <TrophyOutlined className="text-yellow-500 text-xl" />
                  )}
                </div>
                <div className="mb-2 flex items-center gap-3">
                  <Badge
                    status={
                      statusColor[(selectedCoach.status || 'UNKNOWN') as keyof typeof statusColor]
                    }
                    text={
                      statusLabel[(selectedCoach.status || 'UNKNOWN') as keyof typeof statusLabel]
                    }
                  />
                  {selectedCoach.status === CoachVerificationStatus.VERIFIED && (
                    <div className="flex items-center gap-2">
                      <Rate disabled value={selectedCoach.rating} allowHalf />
                      <Text className="font-medium">
                        {Number(selectedCoach.rating || 0).toFixed(1)}
                      </Text>
                    </div>
                  )}
                </div>
                <div className="text-gray-500 text-sm truncate">{selectedCoach.email}</div>
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
                {' '}
                {selectedCoach.phone}{' '}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <EnvironmentOutlined /> Khu vực
                  </>
                }
              >
                {' '}
                {selectedCoach.location}{' '}
              </Descriptions.Item>
              <Descriptions.Item label="Kinh nghiệm">
                {' '}
                {selectedCoach.yearsOfExperience} năm{' '}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {' '}
                {formatDate(selectedCoach.registrationDate)}{' '}
              </Descriptions.Item>
            </Descriptions>

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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium mb-1 truncate">{cred.name}</div>
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
                          onClick={() => window.open(cred.publicUrl!, '_blank')}
                        >
                          Xem
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </Space>
            </div>

            {/* Stats for approved */}
            {selectedCoach.status === CoachVerificationStatus.VERIFIED && (
              <Descriptions title="Thống kê hoạt động" column={2} bordered>
                <Descriptions.Item label="Tổng khóa học">
                  {selectedCoach.totalCourses}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng buổi học">
                  {selectedCoach.totalSessions}
                </Descriptions.Item>
              </Descriptions>
            )}

            {/* Feedback quick open */}
            <div className="flex justify-end">
              <Button icon={<MessageOutlined />} onClick={() => setIsFeedbackModalVisible(true)}>
                Xem feedback
              </Button>
            </div>
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
      {/* <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-blue-500" />
            <span>Feedback của {selectedCoach?.name}</span>
          </div>
        }
        open={isFeedbackModalVisible}
        onCancel={() => setIsFeedbackModalVisible(false)}
        footer={null}
        width={860}
      >
        {isLoadingFeedback ? (
          <Skeleton active />
        ) : !feedbackRes ||
          (Array.isArray(feedbackRes?.items)
            ? feedbackRes.items.length === 0
            : (feedbackRes || []).length === 0) ? (
          <Empty description="Chưa có feedback nào" />
        ) : (
          (() => {
            const list: FeedbackItem[] = Array.isArray(feedbackRes?.items)
              ? feedbackRes.items
              : feedbackRes;
            const avg = list.reduce((s, f) => s + (f.rating || 0), 0) / list.length;
            return (
              <>
                <div className="mb-4 p-4 bg-blue-50 rounded">
                  <Row gutter={16}>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{list.length}</div>
                        <div className="text-sm text-gray-600">Tổng feedback</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-500">{avg.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Đánh giá TB</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {new Set(list.map((f) => f.courseId)).size}
                        </div>
                        <div className="text-sm text-gray-600">Khóa học</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Divider>Danh sách feedback</Divider>

                <List
                  dataSource={list}
                  renderItem={(fb) => (
                    <List.Item key={String(fb.id)}>
                      <Card className="w-full" size="small">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar icon={<UserOutlined />} size="small" />
                            <Text strong>{fb.learnerName}</Text>
                          </div>
                          <div className="flex items-center gap-2">
                            <Rate disabled value={fb.rating} className="text-sm" />
                            <Text className="text-sm text-gray-500">
                              {formatDate(fb.createdAt)}
                            </Text>
                          </div>
                        </div>
                        <div className="mb-2">
                          <Tag icon={<BookOutlined />} color="blue">
                            {fb.courseName}
                          </Tag>
                        </div>
                        <Paragraph className="mb-0 text-gray-700">{fb.comment}</Paragraph>
                      </Card>
                    </List.Item>
                  )}
                />
              </>
            );
          })()
        )}
      </Modal> */}
    </div>
  );
}

/**
 * SMALL COMPONENTS
 */
function KpiCard({
  title,
  value,
  icon,
  color = 'blue',
}: {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color?: 'orange' | 'green' | 'blue' | 'red';
}) {
  const palette: Record<string, { bg: string; text: string }> = {
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  const c = palette[color] || palette.blue;

  return (
    <Card
      className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
      bodyStyle={{ padding: 24 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${c.text}`}>{value}</h3>
        </div>
        <div
          className={`w-14 h-14 rounded-full ${c.bg} flex items-center justify-center ${c.text}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
