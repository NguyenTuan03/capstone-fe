'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Avatar,
  Dropdown,
  message,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Progress,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CertificateVerificationApiService } from '@/services/certificateVerificationApi';
import {
  CoachApplication,
  ApplicationStats,
  GetApplicationsParams,
  FilterOptions,
} from '@/types/certificate-verification';

const { RangePicker } = DatePicker;
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

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load data
  const loadApplications = async () => {
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
    } catch (error) {
      message.error('Không thể tải danh sách đơn đăng ký');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadApplications();
    loadFilterData();
  }, [pagination.current, pagination.pageSize]);

  // Load filter data
  const loadFilterData = async () => {
    try {
      const filterOptionsData = await CertificateVerificationApiService.getFilterOptions();
      setFilterOptions(filterOptionsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
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

  const getPriorityTag = (priority: CoachApplication['priority']) => {
    const priorityConfig = {
      low: { color: 'default', text: 'certificate.priority.low' },
      medium: { color: 'blue', text: 'certificate.priority.medium' },
      high: { color: 'orange', text: 'certificate.priority.high' },
      urgent: { color: 'red', text: 'certificate.priority.urgent' },
    };

    const config = priorityConfig[priority];
    return (
      <Tag color={config.color}>
        <IntlMessages id={config.text} />
      </Tag>
    );
  };

  const formatCurrency = (amount: number) => {
    return CertificateVerificationApiService.formatCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return CertificateVerificationApiService.formatDate(dateString);
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
      flex: 1,
      render: (_, application) => (
        <Space>
          <Avatar src={application.applicant.avatar} icon={<UserOutlined />} size="default" />
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{application.applicant.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{application.applicant.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Kinh nghiệm',
      key: 'experience',
      width: 80,
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
        <div>
          <Tag>{application.professionalInfo.specialties[0]}</Tag>
          {application.professionalInfo.specialties.length > 1 && (
            <Tag color="blue">+{application.professionalInfo.specialties.length - 1}</Tag>
          )}
        </div>
      ),
    },
    {
      title: <IntlMessages id="certificate.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: CoachApplication['status']) => getStatusTag(status),
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 100,
      render: (date: string) => <Text className="text-sm">{formatDate(date)}</Text>,
    },
    {
      title: <IntlMessages id="certificate.table.actions" />,
      key: 'actions',
      width: 120,
      render: (_, application) => {
        const menuItems = [
          {
            key: 'view',
            label: <IntlMessages id="certificate.actions.view" />,
            icon: <EyeOutlined />,
            onClick: () => console.log('View', application.id),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'approve',
            label: <IntlMessages id="certificate.actions.approve" />,
            icon: <CheckOutlined />,
            onClick: () => console.log('Approve', application.id),
            disabled: application.status === 'approved',
          },
          {
            key: 'reject',
            label: <IntlMessages id="certificate.actions.reject" />,
            icon: <CloseOutlined />,
            onClick: () => console.log('Reject', application.id),
            disabled: application.status === 'rejected',
            danger: true,
          },
          {
            key: 'request-info',
            label: <IntlMessages id="certificate.actions.requestInfo" />,
            icon: <ExclamationCircleOutlined />,
            onClick: () => console.log('Request info', application.id),
            disabled: application.status === 'approved' || application.status === 'rejected',
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} size="small" />
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
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
              <IntlMessages id="certificate.filter.clear" />
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              icon={<ExportOutlined />}
              onClick={() => message.info('Tính năng export đang phát triển')}
            >
              <IntlMessages id="certificate.filter.export" />
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
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default CertificatesPageClient;
