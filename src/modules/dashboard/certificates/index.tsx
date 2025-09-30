'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Dropdown,
  message,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Modal,
  Form,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  MoreOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import { Dayjs } from 'dayjs';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CertificateVerificationApiService } from '@/services/certificateVerificationApi';
import { CoachApiService } from '@/services/coachApi';
import {
  CoachApplication,
  ApplicationStats,
  GetApplicationsParams,
  FilterOptions,
} from '@/types/certificate-verification';

const { Option } = Select;
const { Text, Title } = Typography;

const CertificatesPageClient: React.FC = () => {
  // States
  const [applications, setApplications] = useState<CoachApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Modals and forms
  const [selectedApplication, setSelectedApplication] = useState<CoachApplication | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [supplementModalVisible, setSupplementModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();
  const [supplementForm] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load data
  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetApplicationsParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        specialty: specialtyFilter !== 'all' ? specialtyFilter : undefined,
        experience: experienceFilter !== 'all' ? experienceFilter : undefined,
        dateRange: dateRange ? [dateRange[0].toISOString(), dateRange[1].toISOString()] : undefined,
        sortBy: 'submittedAt',
        sortOrder: 'desc',
      };

      const response = await CertificateVerificationApiService.getApplications(params);
      setApplications(response.applications);
      setStats(response.stats);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch {
      message.error('Không thể tải danh sách đơn đăng ký');
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current,
    pagination.pageSize,
    searchText,
    statusFilter,
    priorityFilter,
    specialtyFilter,
    experienceFilter,
  ]);

  // Load initial data
  useEffect(() => {
    loadApplications();
    loadFilterData();
  }, [loadApplications]);

  // Load filter data
  const loadFilterData = async () => {
    try {
      const filterOptionsData = await CertificateVerificationApiService.getFilterOptions();
      setFilterOptions(filterOptionsData);
    } catch {
      console.error('Failed to load filter data');
    }
  };

  // Helper functions
  const getStatusTag = (status: CoachApplication['status']) => {
    const statusConfig = {
      pending: { color: 'blue', text: 'certificate.status.pending' },
      under_review: { color: 'processing', text: 'certificate.status.under_review' },
      approved: { color: 'success', text: 'certificate.status.approved' },
      rejected: { color: 'error', text: 'certificate.status.rejected' },
      requires_info: { color: 'warning', text: 'certificate.status.requires_info' },
    };

    const config = statusConfig[status];
    return (
      <Tag color={config.color}>
        <IntlMessages id={config.text} />
      </Tag>
    );
  };

  const formatDate = (dateString: string) => {
    return CertificateVerificationApiService.formatDate(dateString);
  };

  // Action handlers
  const handleViewDetail = (application: CoachApplication) => {
    setSelectedApplication(application);
    setDetailModalVisible(true);
  };

  const handleApprove = async (applicationId: string) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt',
      content: 'Bạn có chắc chắn muốn phê duyệt đơn xin này?',
      okText: 'Phê duyệt',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await CoachApiService.approveApplication(applicationId);
          message.success('Đã phê duyệt đơn xin thành công');
          loadApplications();
        } catch {
          message.error('Không thể phê duyệt đơn xin');
        }
      },
    });
  };

  const handleReject = (application: CoachApplication) => {
    setSelectedApplication(application);
    setRejectModalVisible(true);
    rejectForm.resetFields();
  };

  const handleSupplement = (application: CoachApplication) => {
    setSelectedApplication(application);
    setSupplementModalVisible(true);
    supplementForm.resetFields();
  };

  const submitReject = async (values: { reason: string; notes?: string }) => {
    if (!selectedApplication) return;

    try {
      await CoachApiService.rejectApplication(selectedApplication.id, {
        reason: values.reason,
        notes: values.notes,
        adminId: 'current_admin',
      });
      message.success('Đã từ chối đơn xin thành công');
      setRejectModalVisible(false);
      loadApplications();
    } catch {
      message.error('Không thể từ chối đơn xin');
    }
  };

  const submitSupplement = async (values: { requirements: string; notes?: string }) => {
    if (!selectedApplication) return;

    try {
      await CoachApiService.requestSupplement(selectedApplication.id, {
        requirements: values.requirements,
        notes: values.notes,
        adminId: 'current_admin',
      });
      message.success('Đã yêu cầu bổ sung thành công');
      setSupplementModalVisible(false);
      loadApplications();
    } catch {
      message.error('Không thể yêu cầu bổ sung');
    }
  };

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadApplications();
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSpecialtyFilter('all');
    setExperienceFilter('all');
    setDateRange(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => loadApplications(), 100);
  };

  // Table columns
  const columns: ColumnsType<CoachApplication> = [
    {
      title: <IntlMessages id="certificate.table.applicant" />,
      key: 'applicant',
      width: 280,
      render: (_, application) => (
        <div className="flex items-center space-x-2">
          <Avatar src={application.applicant.avatar} icon={<UserOutlined />} size="default" />
          <div className="flex-1 min-w-0">
            <div className="font-medium">{application.applicant.name}</div>
            <div className="text-sm text-gray-500">{application.applicant.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kinh nghiệm',
      key: 'experience',
      width: 100,
      align: 'center',
      render: (_, application) => (
        <Text className="font-medium">{application.professionalInfo.yearsOfExperience} năm</Text>
      ),
    },
    {
      title: 'Chuyên môn',
      key: 'specialties',
      width: 120,
      render: (_, application) => (
        <Tag color="blue">{application.professionalInfo.specialties[0]}</Tag>
      ),
    },
    {
      title: 'Chứng chỉ',
      key: 'certificates',
      width: 80,
      align: 'center',
      render: (_, application) => (
        <Text className="font-medium">{application.certificates?.length || 0}</Text>
      ),
    },
    {
      title: <IntlMessages id="certificate.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: CoachApplication['status']) => getStatusTag(status),
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 120,
      render: (date: string) => <Text className="text-sm">{formatDate(date)}</Text>,
    },
    {
      title: <IntlMessages id="certificate.table.actions" />,
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, application) => {
        const menuItems = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => handleViewDetail(application),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'approve',
            label: 'Phê duyệt',
            icon: <CheckOutlined />,
            onClick: () => handleApprove(application.id),
            disabled: application.status === 'approved',
          },
          {
            key: 'reject',
            label: 'Từ chối',
            icon: <CloseOutlined />,
            onClick: () => handleReject(application),
            disabled: application.status === 'rejected',
            danger: true,
          },
          {
            key: 'supplement',
            label: 'Yêu cầu bổ sung',
            icon: <QuestionCircleOutlined />,
            onClick: () => handleSupplement(application),
            disabled: application.status === 'approved' || application.status === 'rejected',
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <IntlMessages id="certificate.verification.title" />
        </Title>
        <Text type="secondary">
          <IntlMessages id="certificate.verification.subtitle" />
        </Text>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="certificate.stats.total" />}
                value={stats.total}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="certificate.stats.pending" />}
                value={stats.pending + stats.underReview}
                prefix={<Badge status="processing" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="certificate.stats.approved" />}
                value={stats.approved}
                prefix={<Badge status="success" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="certificate.stats.rejected" />}
                value={stats.rejected}
                prefix={<Badge status="error" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="certificate.stats.avgProcessing" />}
                value={stats.avgProcessingTime}
                suffix="ngày"
                prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="certificate.stats.urgent" />}
                value={stats.urgentApplications}
                prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
              {filterOptions?.statuses.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
              placeholder="Mức độ ưu tiên"
            >
              {filterOptions?.priorities.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={specialtyFilter}
              onChange={setSpecialtyFilter}
              style={{ width: '100%' }}
              placeholder="Chuyên môn"
            >
              {filterOptions?.specialties.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={experienceFilter}
              onChange={setExperienceFilter}
              style={{ width: '100%' }}
              placeholder="Kinh nghiệm"
            >
              {filterOptions?.experienceLevels.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
              <IntlMessages id="certificate.filter.clear" />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          loading={loading}
          scroll={{ x: 980 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn đăng ký`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
          size="middle"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đơn xin"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedApplication && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={4}>Thông tin ứng viên</Title>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar
                    src={selectedApplication.applicant.avatar}
                    icon={<UserOutlined />}
                    size={64}
                  />
                  <div>
                    <Text className="text-lg font-semibold">
                      {selectedApplication.applicant.name}
                    </Text>
                    <br />
                    <Text type="secondary">{selectedApplication.applicant.email}</Text>
                    <br />
                    <Text type="secondary">{selectedApplication.applicant.phone}</Text>
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>Kinh nghiệm:</Text>
                <br />
                <Text>{selectedApplication.professionalInfo.yearsOfExperience} năm</Text>
              </Col>

              <Col span={12}>
                <Text strong>Chuyên môn:</Text>
                <br />
                <div>
                  {selectedApplication.professionalInfo.specialties.map((specialty, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                      {specialty}
                    </Tag>
                  ))}
                </div>
              </Col>

              <Col span={24}>
                <Text strong>Mô tả kinh nghiệm:</Text>
                <br />
                <Text>{selectedApplication.professionalInfo.bio}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Số chứng chỉ:</Text>
                <br />
                <Text>{selectedApplication.certificates?.length || 0}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Trạng thái:</Text>
                <br />
                {getStatusTag(selectedApplication.status)}
              </Col>

              <Col span={12}>
                <Text strong>Ngày nộp:</Text>
                <br />
                <Text>{formatDate(selectedApplication.submittedAt)}</Text>
              </Col>

              <Col span={12}>
                <Text strong>Cập nhật lần cuối:</Text>
                <br />
                <Text>{formatDate(selectedApplication.updatedAt)}</Text>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối đơn xin"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
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
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối đơn xin này..." />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú thêm (tùy chọn)">
            <Input.TextArea rows={3} placeholder="Thêm ghi chú nếu cần..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Supplement Request Modal */}
      <Modal
        title="Yêu cầu bổ sung thông tin"
        open={supplementModalVisible}
        onCancel={() => setSupplementModalVisible(false)}
        onOk={() => supplementForm.submit()}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
      >
        <Form form={supplementForm} layout="vertical" onFinish={submitSupplement}>
          <Form.Item
            name="requirements"
            label="Yêu cầu bổ sung"
            rules={[{ required: true, message: 'Vui lòng nhập yêu cầu bổ sung' }]}
          >
            <Input.TextArea rows={4} placeholder="Mô tả những thông tin cần bổ sung..." />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú thêm (tùy chọn)">
            <Input.TextArea rows={3} placeholder="Thêm ghi chú hướng dẫn nếu cần..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CertificatesPageClient;
