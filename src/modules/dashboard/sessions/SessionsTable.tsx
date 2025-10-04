'use client';

import React from 'react';
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
  Tooltip,
  Dropdown,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Rate,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import { Session } from '@/types/session';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;

interface SessionsTableProps {
  sessions: Session[];
  loading: boolean;
  stats: any;
  searchText: string;
  statusFilter: string;
  paymentFilter: string;
  typeFilter: string;
  issuesFilter: string;
  recordingFilter: string;
  dateRange: any;
  pagination: any;
  getStatusTag: (status: Session['status']) => React.ReactElement;
  getPaymentTag: (paymentStatus: Session['paymentStatus']) => React.ReactElement;
  formatCurrency: (amount: number) => string;
  formatDateTime: (dateTime: string) => string;
  formatDuration: (minutes: number) => string;
  handleSearch: () => void;
  handleClearFilters: () => void;
  handleViewSession: (session: Session) => void;
  handleRefund: (session: Session) => void;
  handleSuspend: (session: Session, userType: 'coach' | 'learner') => void;
  handleWarn: (session: Session, userType: 'coach' | 'learner') => void;
  setSearchText: (text: string) => void;
  setStatusFilter: (status: string) => void;
  setPaymentFilter: (payment: string) => void;
  setTypeFilter: (type: string) => void;
  setIssuesFilter: (issues: string) => void;
  setRecordingFilter: (recording: string) => void;
  setDateRange: (range: any) => void;
  setPagination: (pagination: any) => void;
}

const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  loading,
  stats,
  searchText,
  statusFilter,
  paymentFilter,
  typeFilter,
  issuesFilter,
  recordingFilter,
  dateRange,
  pagination,
  getStatusTag,
  getPaymentTag,
  formatCurrency,
  formatDateTime,
  formatDuration,
  handleSearch,
  handleClearFilters,
  handleViewSession,
  handleRefund,
  handleSuspend,
  handleWarn,
  setSearchText,
  setStatusFilter,
  setPaymentFilter,
  setTypeFilter,
  setIssuesFilter,
  setRecordingFilter,
  setDateRange,
  setPagination,
}) => {
  // Table columns
  const columns: ColumnsType<Session> = [
    {
      title: 'Mã buổi học',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: '12px' }}>
          {id.split('-').pop()?.toUpperCase()}
        </Text>
      ),
    },
    {
      title: 'Học viên',
      key: 'learner',
      width: 200,
      render: (_, session) => (
        <Space>
          <Avatar src={session.learner.avatar} icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 500, fontSize: '13px' }}>{session.learner.name}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{session.learner.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Huấn luyện viên',
      key: 'coach',
      width: 200,
      render: (_, session) => (
        <Space>
          <Avatar src={session.coach.avatar} icon={<UserOutlined />} size="small" />
          <div>
            <div style={{ fontWeight: 500, fontSize: '13px' }}>{session.coach.name}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>{session.coach.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      width: 160,
      render: (_, session) => (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>
            <CalendarOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {formatDateTime(session.scheduledTime)}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {formatDuration(session.duration)}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            <Tag color={session.type === 'online' ? 'blue' : 'green'}>
              {session.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Session['status']) => getStatusTag(status),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 150,
      render: (_, session) => (
        <div>
          {getPaymentTag(session.paymentStatus)}
          <div style={{ fontSize: '12px', fontWeight: 500, marginTop: 2 }}>
            {formatCurrency(session.totalAmount)}
          </div>
          {session.refundAmount && (
            <div style={{ fontSize: '11px', color: '#ff4d4f' }}>
              Hoàn: {formatCurrency(session.refundAmount)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Extras',
      key: 'extras',
      width: 80,
      render: (_, session) => (
        <Space direction="vertical" size={0}>
          {session.hasRecording && (
            <Tooltip title="Có video ghi lại">
              <VideoCameraOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
          {session.hasIssues && (
            <Tooltip title="Có vấn đề/khiếu nại">
              <Badge count={session.reports.length} size="small">
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
              </Badge>
            </Tooltip>
          )}
          {session.learnerFeedback && (
            <Tooltip title={`Đánh giá: ${session.learnerFeedback.rating}/5`}>
              <Rate disabled value={session.learnerFeedback.rating} style={{ fontSize: 12 }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, session) => {
        const menuItems = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => handleViewSession(session),
          },
          {
            key: 'refund',
            label: 'Hoàn tiền',
            icon: <DollarOutlined />,
            onClick: () => handleRefund(session),
            disabled: session.paymentStatus === 'refunded' || session.paymentStatus === 'pending',
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'warn-learner',
            label: 'Cảnh báo học viên',
            icon: <WarningOutlined />,
            onClick: () => handleWarn(session, 'learner'),
          },
          {
            key: 'warn-coach',
            label: 'Cảnh báo huấn luyện viên',
            icon: <WarningOutlined />,
            onClick: () => handleWarn(session, 'coach'),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'suspend-learner',
            label: 'Tạm khóa học viên',
            icon: <ExclamationCircleOutlined />,
            onClick: () => handleSuspend(session, 'learner'),
            danger: true,
          },
          {
            key: 'suspend-coach',
            label: 'Tạm khóa coach',
            icon: <ExclamationCircleOutlined />,
            onClick: () => handleSuspend(session, 'coach'),
            danger: true,
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
    <>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý buổi học
        </Title>
        <Text type="secondary">Quản lý và theo dõi tất cả các buổi học trong hệ thống</Text>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Tổng buổi học"
                value={stats.total}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Hoàn thành"
                value={stats.completed}
                prefix={<Badge status="success" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Doanh thu"
                value={stats.totalRevenue}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title="Báo cáo chờ xử lý"
                value={stats.pendingReports}
                prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm học viên, coach, ID buổi học..."
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
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="scheduled">Đã lên lịch</Option>
              <Option value="in_progress">Đang diễn ra</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="no_show">Không tham gia</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={paymentFilter}
              onChange={setPaymentFilter}
              style={{ width: '100%' }}
              placeholder="Thanh toán"
            >
              <Option value="all">Tất cả thanh toán</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="refunded">Đã hoàn tiền</Option>
              <Option value="partial_refund">Hoàn tiền một phần</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              placeholder="Hình thức"
            >
              <Option value="all">Tất cả loại</Option>
              <Option value="online">Trực tuyến</Option>
              <Option value="offline">Trực tiếp</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={issuesFilter}
              onChange={setIssuesFilter}
              style={{ width: '100%' }}
              placeholder="Vấn đề"
            >
              <Option value="all">Tất cả</Option>
              <Option value="yes">Có vấn đề</Option>
              <Option value="no">Không có vấn đề</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={recordingFilter}
              onChange={setRecordingFilter}
              style={{ width: '100%' }}
              placeholder="Ghi hình"
            >
              <Option value="all">Tất cả</Option>
              <Option value="yes">Có ghi hình</Option>
              <Option value="no">Không ghi hình</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
              Xóa bộ lọc
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button icon={<ExportOutlined />} onClick={() => console.log('Export feature')}>
              Xuất dữ liệu
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} buổi học`,
            onChange: (page, pageSize) => {
              setPagination((prev: any) => ({
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
    </>
  );
};

export default SessionsTable;
