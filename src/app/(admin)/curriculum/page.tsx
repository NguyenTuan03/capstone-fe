'use client';

import { useState, useEffect } from 'react';
import { Card, Space, Input, Select, Modal, Typography, Row, Col, App } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { useApiQuery } from '@/@crema/hooks/useApiQuery';
import { useApproveRequest, useRejectRequest } from '@/@crema/services/apis/requests';
import {
  DetailedRequestItem,
  RequestItem,
  RequestsResponse,
} from '@/@crema/types/models/curriculumn';
import RequestsTable from '@/components/admin/request/RequestTable';
import { RequestDetailModal } from '@/components/admin/request/RequestDetailModal';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function CurriculumPage() {
  const { message } = App.useApp();
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });
  const [selectedRequest, setSelectedRequest] = useState<DetailedRequestItem | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [pendingActionRequest, setPendingActionRequest] = useState<RequestItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API call for list
  const {
    data: requestsData,
    isLoading,
    refetch,
  } = useApiQuery<RequestsResponse>({
    endpoint: 'requests',
    params: {
      page: currentPage,
      pageSize,
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(searchText && { search: searchText }),
    },
  });

  // API call for detailed request
  const { data: detailedRequestData, isLoading: isLoadingDetail } =
    useApiQuery<DetailedRequestItem>({
      endpoint: selectedRequestId ? `requests/${selectedRequestId}` : '',
      enabled: !!selectedRequestId && isDetailModalVisible,
    });

  const requests = requestsData?.items || [];
  const total = requestsData?.total || 0;

  // API mutations
  const approveRequestMutation = useApproveRequest();
  const rejectRequestMutation = useRejectRequest();

  // Update selectedRequest when detailed data is fetched
  useEffect(() => {
    if (detailedRequestData) {
      setSelectedRequest(detailedRequestData);
    }
  }, [detailedRequestData]);

  const handleViewDetails = (request: RequestItem) => {
    setSelectedRequestId(request.id);
    setIsDetailModalVisible(true);
  };

  const handleApproveRequest = (request: RequestItem) => {
    setPendingActionRequest(request);
    setIsApproveModalVisible(true);
  };

  const handleRejectRequest = (request: RequestItem) => {
    setPendingActionRequest(request);
    setIsRejectModalVisible(true);
  };

  const handleApproveFromDetail = async (request: DetailedRequestItem) => {
    try {
      await approveRequestMutation.mutateAsync(request.id);
      message.success(`Đã phê duyệt yêu cầu "${request.description}"`);
      setIsDetailModalVisible(false);
      setSelectedRequest(null);
      setSelectedRequestId(null);
      refetch();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || 'Phê duyệt yêu cầu thất bại');
    }
  };

  const confirmApprove = async () => {
    if (!pendingActionRequest) return;
    try {
      await approveRequestMutation.mutateAsync(pendingActionRequest.id);
      message.success(`Đã phê duyệt yêu cầu "${pendingActionRequest.description}"`);
      setIsApproveModalVisible(false);
      setPendingActionRequest(null);
      refetch();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || 'Phê duyệt yêu cầu thất bại');
    }
  };

  const confirmReject = async () => {
    if (!pendingActionRequest) return;
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await rejectRequestMutation.mutateAsync({
        id: pendingActionRequest.id,
        reason: rejectReason,
      });
      message.success(`Đã từ chối yêu cầu "${pendingActionRequest.description}"`);
      setIsRejectModalVisible(false);
      setRejectReason('');
      setPendingActionRequest(null);
      refetch();
    } catch (err: any) {
      message.error(err?.response?.data?.message || err?.message || 'Từ chối yêu cầu thất bại');
    }
  };

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
        <Title level={2}>Quản lý Yêu cầu</Title>
        <Text className="text-gray-600">Quản lý và phê duyệt các yêu cầu trên nền tảng</Text>
      </div>

      {/* Filters */}
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm theo mô tả..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Lọc theo trạng thái"
                size="large"
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="PENDING">Chờ phê duyệt</Option>
                <Option value="APPROVED">Đã phê duyệt</Option>
                <Option value="REJECTED">Đã từ chối</Option>
              </Select>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Table */}
      <RequestsTable
        requests={requests.map((req) => ({
          id: req.id,
          description: req.description,
          type: req.type,
          status: req.status as 'PENDING' | 'APPROVED' | 'REJECTED',
          createdAt: req.createdAt,
          createdBy: {
            fullName: req.createdBy.fullName,
            email: req.createdBy.email,
            profilePicture: req.createdBy.profilePicture || undefined,
          },
        }))}
        isLoading={isLoading}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        handleViewDetails={(r) => {
          const original = requests.find((req) => req.id === r.id);
          if (original) handleViewDetails(original);
        }}
        handleApproveRequest={(r) => {
          const original = requests.find((req) => req.id === r.id);
          if (original) handleApproveRequest(original);
        }}
        handleRejectRequest={(r) => {
          const original = requests.find((req) => req.id === r.id);
          if (original) handleRejectRequest(original);
        }}
      />

      {/* Detail Modal */}
      <RequestDetailModal
        open={isDetailModalVisible}
        onClose={() => {
          setIsDetailModalVisible(false);
          setSelectedRequest(null);
          setSelectedRequestId(null);
        }}
        selectedRequest={selectedRequest}
        isLoadingDetail={isLoadingDetail}
        onApprove={handleApproveFromDetail}
        onReject={(request) => {
          if (request) {
            // Create a minimal RequestItem for the reject modal
            // We only need id and description for the reject flow
            // Handle both formats: district/province can be number or object
            const getDistrictId = (district: any): number => {
              if (typeof district === 'number') return district;
              if (district?.id) return district.id;
              return 0;
            };

            const getProvinceId = (province: any): number => {
              if (typeof province === 'number') return province;
              if (province?.id) return province.id;
              return 0;
            };

            const requestItem: RequestItem = {
              id: request.id,
              description: request.description,
              type: request.type,
              status: request.status,
              metadata: {
                id: request.metadata.id,
                type: request.metadata.type,
                details: {
                  address: request.metadata.details.address || '',
                  district: getDistrictId(request.metadata.details.district),
                  province: getProvinceId(request.metadata.details.province),
                  schedules: request.metadata.details.schedules || [],
                  startDate: request.metadata.details.startDate,
                  learningFormat: request.metadata.details.learningFormat,
                  maxParticipants: request.metadata.details.maxParticipants,
                  minParticipants: request.metadata.details.minParticipants,
                  pricePerParticipant:
                    typeof request.metadata.details.pricePerParticipant === 'string'
                      ? parseFloat(request.metadata.details.pricePerParticipant) || 0
                      : request.metadata.details.pricePerParticipant || 0,
                },
              },
              createdAt: request.createdAt,
              updatedAt: request.updatedAt,
              createdBy: {
                id: request.createdBy.id,
                fullName: request.createdBy.fullName,
                email: request.createdBy.email,
                phoneNumber: request.createdBy.phoneNumber,
                profilePicture: request.createdBy.profilePicture,
              },
            };
            setPendingActionRequest(requestItem);
            setIsRejectModalVisible(true);
            setRejectReason('');
            setIsDetailModalVisible(false);
            setSelectedRequest(null);
            setSelectedRequestId(null);
          }
        }}
      />

      {/* Approve Modal */}
      <Modal
        title="Xác nhận phê duyệt"
        open={isApproveModalVisible}
        onOk={confirmApprove}
        onCancel={() => {
          setIsApproveModalVisible(false);
          setPendingActionRequest(null);
        }}
        confirmLoading={approveRequestMutation.isPending}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn phê duyệt yêu cầu này?</p>
        {pendingActionRequest && <Text type="secondary">{pendingActionRequest.description}</Text>}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối yêu cầu"
        open={isRejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectReason('');
          setPendingActionRequest(null);
        }}
        confirmLoading={rejectRequestMutation.isPending}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Vui lòng nhập lý do từ chối:</Text>
          {pendingActionRequest && (
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
              Yêu cầu: {pendingActionRequest.description}
            </Text>
          )}
          <TextArea
            rows={4}
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </Space>
      </Modal>
    </div>
  );
}
