'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Descriptions,
  Tooltip,
  Badge,
  Rate,
  Tabs,
  Empty,
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
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useGetAllCoaches,
  useGetCoachById,
  useGetCoachRating,
  useVerifyCoach,
  useRejectCoach,
} from '@/@crema/services/apis/coaches';
import { CoachVerificationStatus } from '@/types/enums';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

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
  specialties?: string[];
  teachingMethods?: string[];
  user?: User;
}

interface CredentialData {
  id: string;
  publicUrl?: string;
  baseCredential: {
    id: number;
    name: string;
    description?: string;
    type: string;
    publicUrl?: string;
  };
  issuedAt?: string;
  expiresAt?: string;
}

/**
 * HELPERS
 */
const formatDate = (dateString?: string) =>
  dateString ? new Date(dateString).toLocaleDateString('vi-VN') : '-';

const parseJsonArray = (value?: string | string[]) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const normalized = value.trim().replace(/^{/, '[').replace(/}$/, ']');
    const parsed = JSON.parse(normalized);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* noop */
  }
  // fallback: split by comma removing braces/quotes
  return value
    .replace(/[{}]/g, '')
    .split(',')
    .map((item) => item.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);
};

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
  useRoleGuard(['ADMIN'], { unauthenticated: '/signin', COACH: '/summary', LEARNER: '/home' });
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [selectedCoach, setSelectedCoach] = useState<CoachData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Modal xem chi tiết từ API
  const [viewDetailCoachId, setViewDetailCoachId] = useState<string | null>(null);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);

  // API hooks
  const { data: coachesRes, isLoading, refetch } = useGetAllCoaches({ page, size });

  // Detail & rating (fetch only when modal is open and an ID exists)
  const detailEnabledId = isDetailModalVisible && selectedCoach?.id ? selectedCoach.id : '';
  const { data: coachDetail } = useGetCoachById(detailEnabledId as string);
  const { data: coachRating } = useGetCoachRating(detailEnabledId as string);

  // API cho modal xem chi tiết
  const { data: viewDetailData, isLoading: isLoadingViewDetail } = useGetCoachById(
    viewDetailCoachId || '',
  );
  const { data: viewDetailRating } = useGetCoachRating(viewDetailCoachId || '');

  const verifyCoachMutation = useVerifyCoach();
  const rejectCoachMutation = useRejectCoach();

  // Sync URL query parameter with modal state
  useEffect(() => {
    const coachIdFromUrl = searchParams.get('coachId');
    if (coachIdFromUrl) {
      if (coachIdFromUrl !== viewDetailCoachId) {
        setViewDetailCoachId(coachIdFromUrl);
        setIsViewDetailModalVisible(true);
      }
    } else {
      // If URL doesn't have coachId but modal is open, close it
      if (isViewDetailModalVisible) {
        setIsViewDetailModalVisible(false);
        setViewDetailCoachId(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Feedbacks: only fetch when modal open
  // const { data: feedbackRes, isLoading: isLoadingFeedback } = useGet<any>(
  //   selectedCoach ? `coaches/${selectedCoach.id}/feedbacks` : '',
  //   undefined,
  //   { enabled: isFeedbackModalVisible && !!selectedCoach?.id },
  // );

  const coachesListRaw: any[] = useMemo(() => {
    if (!coachesRes) return [];

    if (Array.isArray(coachesRes)) return coachesRes;

    if (Array.isArray((coachesRes as any)?.items)) return (coachesRes as any).items;
    if (Array.isArray((coachesRes as any)?.data?.items)) return (coachesRes as any).data.items;
    if (Array.isArray((coachesRes as any)?.data)) return (coachesRes as any).data;
    if (Array.isArray((coachesRes as any)?.result?.items)) return (coachesRes as any).result.items;
    if (Array.isArray((coachesRes as any)?.result)) return (coachesRes as any).result;

    return [];
  }, [coachesRes]);

  const totalFromApi: number | undefined = useMemo(() => {
    if (!coachesRes) return undefined;

    const candidateTotals = [
      (coachesRes as any)?.meta?.total,
      (coachesRes as any)?.meta?.pagination?.total,
      (coachesRes as any)?.total,
      (coachesRes as any)?.data?.meta?.total,
      (coachesRes as any)?.data?.total,
      Array.isArray(coachesListRaw) ? coachesListRaw.length : undefined,
    ];

    return candidateTotals.find((value) => typeof value === 'number') as number | undefined;
  }, [coachesRes, coachesListRaw]);

  // Normalize response
  const mappedCoaches: CoachData[] = useMemo(
    () =>
      coachesListRaw.map((item: any): CoachData => {
        const coachUser = item.user || item.coach?.user || item.profile;
        const coachId = item.id ?? item.coachId ?? item.coach?.id;

        return {
          id: String(coachId),
          name: coachUser?.fullName || coachUser?.name || item.name || '-',
          email: coachUser?.email || item.email || '-',
          phone: coachUser?.phoneNumber || item.phone || '-',
          avatar: coachUser?.profilePicture || item.avatar || '',
          location: coachUser?.location || item.location || '-',
          yearsOfExperience:
            item.yearOfExperience ?? item.yearsOfExperience ?? item.experience ?? 0,
          rating:
            typeof coachRating === 'number' && String(coachId) === selectedCoach?.id
              ? coachRating
              : (item.rating ?? item.averageRating ?? 0),
          totalCourses: item.totalCourses ?? item.courseCount ?? 0,
          totalSessions: item.totalSessions ?? item.sessionCount ?? 0,
          status: (item?.verificationStatus ??
            item?.status ??
            null) as CoachVerificationStatus | null,
          registrationDate: item.createdAt || item.registrationDate || new Date().toISOString(),
          credentials: Array.isArray(item.credentials)
            ? item.credentials.map((c: CredentialData) => ({
                id: String(c.id),
                baseCredential: {
                  id: c.baseCredential?.id,
                  name: c.baseCredential?.name,
                  description: c.baseCredential?.description || undefined,
                  type: c.baseCredential?.type,
                  publicUrl: c.baseCredential?.publicUrl || undefined,
                },
                issuedAt: c.issuedAt || undefined,
                expiresAt: c.expiresAt || undefined,
              }))
            : [],
          bio: item.bio,
          rejectionReason: item.verificationReason || item.rejectionReason || undefined,
          specialties: parseJsonArray(item.specialties),
          teachingMethods: parseJsonArray(item.teachingMethods),
        };
      }),
    [coachesListRaw, coachRating, selectedCoach?.id],
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

  // Mở modal xem chi tiết từ API
  const openViewDetail = (coachId: string) => {
    // Update URL with coachId query parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('coachId', coachId);
    router.push(`/coaches?${params.toString()}`, { scroll: false });
  };

  // Close modal and remove coachId from URL
  const closeViewDetailModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('coachId');
    const newUrl = params.toString() ? `/coaches?${params.toString()}` : '/coaches';
    router.push(newUrl, { scroll: false });
    setIsViewDetailModalVisible(false);
    setViewDetailCoachId(null);
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
    const displayCoach = coachDetail || viewDetailData;
    if (!displayCoach && !selectedCoach) return;
    try {
      const id = (displayCoach?.id || selectedCoach?.id)!;
      const response = await verifyCoachMutation.mutateAsync({ id });
      const successMessage = response?.message || 'Xác minh hồ sơ huấn luyện viên thành công';
      toast.success(successMessage);
      setIsApproveModalVisible(false);
      setIsDetailModalVisible(false);
      // Close view detail modal and remove coachId from URL
      closeViewDetailModal();
      await refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Phê duyệt thất bại');
    }
  };

  const confirmReject = async () => {
    const displayCoach = coachDetail || viewDetailData;
    if (!displayCoach && !selectedCoach) return;
    try {
      const id = (displayCoach?.id || selectedCoach?.id)!;
      const response = await rejectCoachMutation.mutateAsync({ id, reason: rejectReason.trim() });
      const successMessage = response?.message || 'Từ chối hồ sơ huấn luyện viên thành công';
      toast.success(successMessage);
      setIsRejectModalVisible(false);
      setIsDetailModalVisible(false);
      // Close view detail modal and remove coachId from URL
      closeViewDetailModal();
      await refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Từ chối thất bại');
    }
  };

  /** TABLE COLUMNS */
  const InfoCell: React.FC<{ record: CoachData }> = ({ record }) => (
    <div className="flex items-center gap-3">
      <Avatar size={48} src={record.avatar || undefined} icon={<UserOutlined />} />
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-medium truncate max-w-[220px] block">{record.name}</span>
          {record.bio && (
            <Tooltip title={record.bio}>
              <InfoCircleOutlined className="text-gray-400" />
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
      align: 'center',
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
      align: 'center',
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
            <Button icon={<EyeOutlined />} onClick={() => openViewDetail(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const approvedColumns: ColumnsType<CoachData> = [
    {
      title: 'Thông tin',
      key: 'info',
      align: 'center',
      render: (_, record) => <InfoCell record={record} />,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: 130,
      render: (rating: number) => {
        // Handle if rating is an object with 'overall' property
        const ratingValue =
          typeof rating === 'object' && rating !== null ? (rating as any).overall : rating;

        return (
          <div className="text-center">
            <div className="font-medium">{Number(ratingValue || 0).toFixed(1)}</div>
            <Rate disabled value={ratingValue} allowHalf style={{ fontSize: 12 }} />
          </div>
        );
      },
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
      align: 'center',
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
          <Button icon={<EyeOutlined />} onClick={() => openViewDetail(record.id)} />
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
      <Card
        className="rounded-2xl shadow-sm border-gray-100"
        styles={{ body: { padding: '16px 24px' } }}
        style={{ marginBottom: 16 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-0.5">Quản lý Huấn luyện viên</h2>
            <p className="text-gray-500 text-sm">
              Phê duyệt và quản lý huấn luyện viên trong hệ thống
            </p>
          </div>

          <Search
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            allowClear
            size="middle"
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
      <Card className="rounded-2xl border-0 shadow-sm" styles={{ body: { padding: 0 } }}>
        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as 'pending' | 'approved')}
          items={[
            {
              key: 'pending',
              label: (
                <span style={{ marginLeft: 25 }}>
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
          (coachDetail?.verificationStatus || selectedCoach?.status) ===
          CoachVerificationStatus.UNVERIFIED
            ? [
                <Button
                  key="reject"
                  danger
                  onClick={() =>
                    (coachDetail || selectedCoach) &&
                    openReject((coachDetail as any) || selectedCoach!)
                  }
                >
                  <CloseOutlined /> Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  onClick={() =>
                    (coachDetail || selectedCoach) &&
                    openApprove((coachDetail as any) || selectedCoach!)
                  }
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
        styles={{ body: { maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' } }}
      >
        {(coachDetail || selectedCoach) &&
          (() => {
            const dc: any = coachDetail || selectedCoach;
            const ratingToShow =
              typeof coachRating === 'object' && coachRating?.overall
                ? coachRating.overall
                : typeof coachRating === 'number'
                  ? coachRating
                  : selectedCoach?.rating || 0;
            const statusToShow =
              (dc.verificationStatus as CoachVerificationStatus) ||
              (selectedCoach?.status as CoachVerificationStatus) ||
              null;
            const credentialsToShow = dc.credentials || selectedCoach?.credentials || [];
            const emailToShow = dc.user?.email || dc.email || selectedCoach?.email;
            const phoneToShow = dc.user?.phoneNumber || dc.phone || selectedCoach?.phone;
            const locationToShow = dc.user?.location || dc.location || selectedCoach?.location;
            const nameToShow = dc.user?.fullName || dc.user?.name || dc.name || selectedCoach?.name;
            const avatarToShow = dc.user?.profilePicture || dc.avatar || selectedCoach?.avatar;
            const yearsToShow = dc.yearOfExperience ?? selectedCoach?.yearsOfExperience ?? 0;
            const createdAtToShow = dc.createdAt || selectedCoach?.registrationDate;
            const totalCoursesToShow = dc.totalCourses ?? selectedCoach?.totalCourses ?? 0;
            const totalSessionsToShow = dc.totalSessions ?? selectedCoach?.totalSessions ?? 0;
            const bioToShow = dc.bio || selectedCoach?.bio;
            const specialtiesToShow = parseJsonArray(dc.specialties || selectedCoach?.specialties);
            const teachingMethodsToShow = parseJsonArray(
              dc.teachingMethods || selectedCoach?.teachingMethods,
            );

            return (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="pb-4 border-b">
                  <div className="flex items-start gap-4">
                    {/* Left side: Avatar, Name, Rating, Email, Bio */}
                    <div className="flex items-start gap-4 flex-1" style={{ paddingRight: '20px' }}>
                      <Avatar size={84} src={avatarToShow} icon={<UserOutlined />} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Title level={4} className="mb-0 truncate">
                            {nameToShow}
                          </Title>
                          {ratingToShow >= 4.5 && (
                            <TrophyOutlined className="text-yellow-500 text-xl" />
                          )}
                        </div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <Badge
                            status={
                              statusColor[(statusToShow || 'UNKNOWN') as keyof typeof statusColor]
                            }
                            text={
                              statusLabel[(statusToShow || 'UNKNOWN') as keyof typeof statusLabel]
                            }
                          />
                          {statusToShow === CoachVerificationStatus.VERIFIED && (
                            <div className="flex items-center gap-2">
                              <Rate disabled value={ratingToShow} allowHalf />
                              <Text className="font-medium">
                                {Number(ratingToShow || 0).toFixed(1)}
                              </Text>
                            </div>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm mb-3">{emailToShow}</div>

                        {/* Bio */}
                        {bioToShow && (
                          <div className="mt-3">
                            <Title level={5} className="mb-2">
                              Giới thiệu
                            </Title>
                            <Paragraph className="mb-0 text-sm">{bioToShow}</Paragraph>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Specialties & Teaching Methods Cards */}
                    <div className="flex flex-col gap-3" style={{ minWidth: '280px' }}>
                      {/* Chuyên môn Card */}
                      {specialtiesToShow.length > 0 && (
                        <Card size="small" className="shadow-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-700 mb-2">Chuyên môn</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {specialtiesToShow.map((spec: string, idx: number) => (
                                <Tag key={idx} color="blue" className="text-xs">
                                  {spec}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Phương pháp giảng dạy Card */}
                      {teachingMethodsToShow.length > 0 && (
                        <Card size="small" className="shadow-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-700 mb-2">
                              Phương pháp giảng dạy
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {teachingMethodsToShow.map((method: string, idx: number) => (
                                <Tag key={idx} color="green" className="text-xs">
                                  {method}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <Card>
                  <Descriptions
                    title="Thông tin cơ bản"
                    column={2}
                    bordered
                    labelStyle={{ textAlign: 'center' }}
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <MailOutlined /> Email
                        </>
                      }
                      span={2}
                    >
                      {emailToShow}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <PhoneOutlined /> Số điện thoại
                        </>
                      }
                    >
                      {' '}
                      {phoneToShow}{' '}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <EnvironmentOutlined /> Khu vực
                        </>
                      }
                    >
                      {' '}
                      {locationToShow}{' '}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kinh nghiệm"> {yearsToShow} năm </Descriptions.Item>
                    <Descriptions.Item label="Ngày đăng ký">
                      {' '}
                      {formatDate(createdAtToShow)}{' '}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Credentials */}
                <div>
                  <Title level={5}>
                    <SafetyCertificateOutlined /> Chứng chỉ ({credentialsToShow.length})
                  </Title>
                  <Space direction="vertical" className="w-full" size="middle">
                    {credentialsToShow.map((cred: CredentialData) => (
                      <Card key={cred.id} size="small">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium mb-1 truncate">
                              {cred.baseCredential.name}
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              <Tag color="blue">{cred.baseCredential.type}</Tag>
                            </div>
                            {cred.baseCredential.description && (
                              <div className="text-sm text-gray-600 mb-2">
                                {cred.baseCredential.description}
                              </div>
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
                {statusToShow === CoachVerificationStatus.VERIFIED && (
                  <Descriptions
                    title="Thống kê hoạt động"
                    column={2}
                    bordered
                    labelStyle={{ textAlign: 'center' }}
                  >
                    <Descriptions.Item label="Tổng khóa học">
                      {totalCoursesToShow}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng buổi học">
                      {totalSessionsToShow}
                    </Descriptions.Item>
                  </Descriptions>
                )}

                {/* Feedback quick open */}
                <div className="flex justify-end">
                  <Button
                    icon={<MessageOutlined />}
                    onClick={() => setIsFeedbackModalVisible(true)}
                  >
                    Xem feedback
                  </Button>
                </div>
              </div>
            );
          })()}
      </Modal>

      {/* View Detail Modal - Xem chi tiết từ API */}
      <Modal
        title="Thông tin chi tiết Huấn luyện viên"
        open={isViewDetailModalVisible}
        onCancel={closeViewDetailModal}
        footer={
          (viewDetailData?.verificationStatus === CoachVerificationStatus.UNVERIFIED ||
            viewDetailData?.verificationStatus === CoachVerificationStatus.PENDING) &&
          viewDetailData?.verificationStatus !== CoachVerificationStatus.VERIFIED
            ? [
                <Button
                  key="reject"
                  danger
                  onClick={() => {
                    if (viewDetailData) {
                      setSelectedCoach(viewDetailData);
                      setRejectReason('');
                      setIsRejectModalVisible(true);
                    }
                  }}
                >
                  <CloseOutlined /> Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  onClick={() => {
                    if (viewDetailData) {
                      openApprove(viewDetailData as any);
                    }
                  }}
                >
                  <CheckOutlined /> Phê duyệt
                </Button>,
              ]
            : [
                <Button key="close" onClick={closeViewDetailModal}>
                  Đóng
                </Button>,
              ]
        }
        width={900}
        styles={{ body: { maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' } }}
      >
        {isLoadingViewDetail ? (
          <div className="py-8">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : viewDetailData ? (
          (() => {
            const data: any = viewDetailData;
            const user = data.user || {};
            const ratingToShow =
              typeof viewDetailRating === 'number' ? viewDetailRating : (data.rating ?? 0);
            const statusToShow = (data.verificationStatus as CoachVerificationStatus) || null;
            const credentialsToShow = Array.isArray(data.credentials) ? data.credentials : [];
            const specialtiesToShow = parseJsonArray(data.specialties);
            const teachingMethodsToShow = parseJsonArray(data.teachingMethods);

            return (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="pb-4 border-b">
                  <div className="flex items-start gap-4">
                    {/* Left side: Avatar, Name, Rating, Email, Bio */}
                    <div className="flex items-start gap-4 flex-1" style={{ paddingRight: '20px' }}>
                      <Avatar
                        size={96}
                        src={user.profilePicture || undefined}
                        icon={<UserOutlined />}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Title level={3} className="mb-0 truncate">
                            {user.fullName || user.name || '-'}
                          </Title>
                          {ratingToShow >= 4.5 && (
                            <TrophyOutlined className="text-yellow-500 text-2xl" />
                          )}
                        </div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <Badge
                            status={
                              statusColor[(statusToShow || 'UNKNOWN') as keyof typeof statusColor]
                            }
                            text={
                              statusLabel[(statusToShow || 'UNKNOWN') as keyof typeof statusLabel]
                            }
                          />
                          {statusToShow === CoachVerificationStatus.VERIFIED && (
                            <div className="flex items-center gap-2">
                              <Rate disabled value={ratingToShow} allowHalf />
                              <Text className="font-medium text-lg">
                                {Number(ratingToShow || 0).toFixed(1)}
                              </Text>
                            </div>
                          )}
                        </div>
                        <div className="text-gray-500 mb-3">{user.email || '-'}</div>
                      </div>
                    </div>

                    {/* Right side: Specialties & Teaching Methods Cards */}
                    <div className="flex flex-col gap-3" style={{ minWidth: '280px' }}>
                      {/* Chuyên môn Card */}
                      {specialtiesToShow.length > 0 && (
                        <Card size="small" className="shadow-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-700 mb-2">Chuyên môn</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {specialtiesToShow.map((spec: string, idx: number) => (
                                <Tag key={idx} color="blue" className="text-xs">
                                  {spec}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Phương pháp giảng dạy Card */}
                      {teachingMethodsToShow.length > 0 && (
                        <Card size="small" className="shadow-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-700 mb-2">
                              Phương pháp giảng dạy
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {teachingMethodsToShow.map((method: string, idx: number) => (
                                <Tag key={idx} color="green" className="text-xs">
                                  {method}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
                {/* Bio */}
                {data.bio && (
                  <div className="mt-3">
                    <Title level={5} className="mb-2">
                      Giới thiệu
                    </Title>
                    <Paragraph className="text-gray-700 mb-0">{data.bio}</Paragraph>
                  </div>
                )}
                {/* Basic Information */}
                <Card>
                  <Descriptions
                    title="Thông tin cơ bản"
                    column={2}
                    bordered
                    labelStyle={{ textAlign: 'center' }}
                  >
                    <Descriptions.Item
                      label={
                        <>
                          <MailOutlined /> Email
                        </>
                      }
                      span={2}
                    >
                      {user.email || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <PhoneOutlined /> Số điện thoại
                        </>
                      }
                    >
                      {user.phoneNumber || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <>
                          <EnvironmentOutlined /> Khu vực
                        </>
                      }
                    >
                      {`${user.district?.name} - ${user.province?.name}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kinh nghiệm">
                      {data.yearOfExperience ?? 0} năm
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đăng ký">
                      {formatDate(data.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái xác thực">
                      <Badge
                        status={
                          statusColor[(statusToShow || 'UNKNOWN') as keyof typeof statusColor]
                        }
                        text={statusLabel[(statusToShow || 'UNKNOWN') as keyof typeof statusLabel]}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Credentials */}
                <div>
                  <Title level={5}>
                    <SafetyCertificateOutlined /> Chứng chỉ ({credentialsToShow.length})
                  </Title>
                  {credentialsToShow.length > 0 ? (
                    <Space direction="vertical" className="w-full" size="middle">
                      {credentialsToShow.map((cred: CredentialData) => (
                        <Card key={cred.id} size="small">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium mb-1 truncate">
                                {cred.baseCredential.name}
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                <Tag color="blue">{cred.baseCredential.type}</Tag>
                              </div>
                              {cred.baseCredential.description && (
                                <div className="text-sm text-gray-600 mb-2">
                                  {cred.baseCredential.description}
                                </div>
                              )}
                              <Space size="middle" className="text-xs text-gray-500">
                                {cred.issuedAt && (
                                  <span>
                                    <CalendarOutlined /> Cấp: {formatDate(cred.issuedAt)}
                                  </span>
                                )}
                                {cred.expiresAt && (
                                  <span>Hết hạn: {formatDate(cred.expiresAt)}</span>
                                )}
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
                  ) : (
                    <Empty description="Chưa có chứng chỉ" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>

                {/* Stats for verified coaches */}
                {statusToShow === CoachVerificationStatus.VERIFIED && (
                  <Descriptions
                    title="Thống kê hoạt động"
                    column={2}
                    bordered
                    labelStyle={{ textAlign: 'center' }}
                  >
                    <Descriptions.Item label="Tổng khóa học">
                      {data.totalCourses ?? 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng buổi học">
                      {data.totalSessions ?? 0}
                    </Descriptions.Item>
                  </Descriptions>
                )}

                {/* Rejection Reason if rejected */}
                {statusToShow === CoachVerificationStatus.REJECTED && data.verificationReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded">
                    <Text strong className="text-red-600 block mb-2">
                      Lý do từ chối:
                    </Text>
                    <Text className="text-red-700">{data.verificationReason}</Text>
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <Empty description="Không tìm thấy thông tin" />
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
        styles={{ body: { maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' } }}
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn phê duyệt huấn luyện viên{' '}
            <Text strong>
              {coachDetail?.user?.fullName || coachDetail?.name || selectedCoach?.name}
            </Text>
            ?
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
        styles={{ body: { maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' } }}
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn từ chối huấn luyện viên <Text strong>{selectedCoach?.name}</Text>?
            {/* Optional: could also show coachDetail name */}
          </Text>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <CheckCircleOutlined className="text-green-600 mr-2" />
            <Text className="text-green-600">
              Sau khi từ chối, huấn luyện viên không thể tạo khóa học và nhận học viên.
            </Text>
          </div>
        </div>
      </Modal>
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
      styles={{ body: { padding: 24 } }}
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
