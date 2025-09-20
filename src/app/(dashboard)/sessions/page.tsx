'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Avatar, Modal, Typography, Row, Col, Badge, Popconfirm, message, Tabs, Descriptions, List, Dropdown, Tooltip, DatePicker, Statistic, Progress, Rate } from 'antd';
import { CalendarOutlined, SearchOutlined, EyeOutlined, FilterOutlined, ExportOutlined, VideoCameraOutlined, EnvironmentOutlined, ClockCircleOutlined, DollarOutlined, UserOutlined, TeamOutlined, MoreOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, StopOutlined, ReloadOutlined, WarningOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { SessionApiService } from '@/services/sessionApi';
import { SessionDetail, GetSessionsParams, SessionListStats, SessionAction } from '@/types/session';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

dayjs.locale('vi');

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionDetail | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [stats, setStats] = useState<SessionListStats | null>(null);

  // Filters and pagination
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [coachFilter, setCoachFilter] = useState<string>('');
  const [learnerFilter, setLearnerFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load sessions data
  const loadSessions = async () => {
    setLoading(true);
    try {
      const params: GetSessionsParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        status: statusFilter === 'all' ? undefined : statusFilter,
        paymentStatus: paymentFilter === 'all' ? undefined : paymentFilter,
        type: typeFilter === 'all' ? undefined : typeFilter,
        coachId: coachFilter || undefined,
        learnerId: learnerFilter || undefined,
        dateFrom: dateRange?.[0]?.format('YYYY-MM-DD'),
        dateTo: dateRange?.[1]?.format('YYYY-MM-DD'),
      };

      const response = await SessionApiService.getSessions(params);
      setSessions(response.sessions);
      setTotal(response.total);

      // Load stats
      const statsData = await SessionApiService.getSessionStats();
      setStats(statsData);
      } catch (error) {
        message.error(<IntlMessages id="session.message.loadError" />);
        console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [currentPage, pageSize, searchText, statusFilter, paymentFilter, typeFilter, coachFilter, learnerFilter, dateRange]);

  // Status tag colors and icons
  const getStatusTag = (status: string) => {
    const configs = {
      upcoming: { color: 'blue', icon: <ClockCircleOutlined />, key: 'session.status.upcoming' },
      in_progress: { color: 'orange', icon: <PlayCircleOutlined />, key: 'session.status.inProgress' },
      completed: { color: 'green', icon: <CheckCircleOutlined />, key: 'session.status.completed' },
      cancelled: { color: 'red', icon: <CloseCircleOutlined />, key: 'session.status.cancelled' },
      no_show: { color: 'volcano', icon: <StopOutlined />, key: 'session.status.noShow' }
    };
    const config = configs[status as keyof typeof configs] || configs.upcoming;
    return (
      <Tag color={config.color} icon={config.icon}>
        <IntlMessages id={config.key} />
      </Tag>
    );
  };

  const getPaymentTag = (status: string) => {
    const configs = {
      paid: { color: 'success' as const, key: 'session.payment.paid' },
      pending: { color: 'warning' as const, key: 'session.payment.pending' },
      refunded: { color: 'processing' as const, key: 'session.payment.refunded' },
      failed: { color: 'error' as const, key: 'session.payment.failed' }
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    return <Badge status={config.color} text={<IntlMessages id={config.key} />} />;
  };

  // Action handlers
  const handleCancelSession = async (sessionId: string, reason: string) => {
    try {
      const response = await SessionApiService.cancelSession(sessionId, reason);
      if (response.success) {
        message.success(response.message);
        loadSessions();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(<IntlMessages id="session.message.cancelError" />);
    }
  };

  const handleRefundSession = async (sessionId: string, refundAmount?: number) => {
    try {
      const response = await SessionApiService.refundSession(sessionId, refundAmount);
      if (response.success) {
        message.success(response.message);
        loadSessions();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Lỗi khi hoàn tiền');
    }
  };

  // Action menu for each session
  const getActionMenu = (session: SessionDetail): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'Xem chi tiết',
        onClick: () => {
          setSelectedSession(session);
          setIsDetailModalVisible(true);
        }
      }
    ];

    if (session.status === 'upcoming' || session.status === 'in_progress') {
      items.push({
        key: 'cancel',
        icon: <CloseCircleOutlined />,
        label: 'Hủy buổi học',
        onClick: () => {
          Modal.confirm({
            title: 'Hủy buổi học',
            content: 'Bạn có chắc chắn muốn hủy buổi học này?',
            onOk: () => handleCancelSession(session.id, 'Hủy bởi admin')
          });
        }
      });
    }

    if (session.paymentStatus === 'paid' && session.status !== 'completed') {
      items.push({
        key: 'refund',
        icon: <ReloadOutlined />,
        label: 'Hoàn tiền',
        onClick: () => {
          Modal.confirm({
            title: 'Hoàn tiền',
            content: `Hoàn tiền ${session.amount.toLocaleString('vi-VN')} VND cho buổi học này?`,
            onOk: () => handleRefundSession(session.id)
          });
        }
      });
    }

    items.push({
      key: 'warn_learner',
      icon: <WarningOutlined />,
      label: 'Cảnh cáo học viên',
      onClick: () => {
        // Will implement warning functionality
        message.info('Tính năng cảnh cáo đang được phát triển');
      }
    });

    items.push({
      key: 'warn_coach',
      icon: <WarningOutlined />,
      label: 'Cảnh cáo coach',
      onClick: () => {
        // Will implement warning functionality
        message.info('Tính năng cảnh cáo đang được phát triển');
      }
    });

    return items;
  };

  // Table columns
  const columns: ColumnsType<SessionDetail> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Học viên',
      key: 'learner',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar src={record.learnerAvatar} icon={<UserOutlined />} />
          <div>
            <div>{record.learnerName}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Coach',
      key: 'coach',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar src={record.coachAvatar} icon={<TeamOutlined />} />
          <div>
            <div>{record.coachName}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{dayjs(record.date).format('DD/MM/YYYY')}</div>
          <Text type="secondary">{record.time} ({record.duration}p)</Text>
        </div>
      )
    },
    {
      title: 'Hình thức',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag icon={type === 'online' ? <VideoCameraOutlined /> : <EnvironmentOutlined />}>
          {type === 'online' ? 'Online' : 'Offline'}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 130,
      render: (status) => getPaymentTag(status)
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => (
        <Text strong>{amount.toLocaleString('vi-VN')} VND</Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenu(record) }} trigger={['click']}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  // Statistics cards
  const statsCards = [
    {
      title: 'Tổng buổi học',
      value: stats?.total || 0,
      icon: <CalendarOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Đã hoàn thành',
      value: stats?.completed || 0,
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Sắp diễn ra',
      value: stats?.upcoming || 0,
      icon: <ClockCircleOutlined />,
      color: '#faad14'
    },
    {
      title: 'Tổng doanh thu',
      value: `${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} VND`,
      icon: <DollarOutlined />,
      color: '#f5222d'
    }
  ];

  // Clear filters
  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setTypeFilter('all');
    setCoachFilter('');
    setLearnerFilter('');
    setDateRange(null);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>
          <IntlMessages id="page.sessions.title" />
        </Title>
        <Text type="secondary">
          <IntlMessages id="page.sessions.subtitle" />
        </Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="Tìm kiếm học viên, coach..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="upcoming">Sắp diễn ra</Option>
              <Option value="in_progress">Đang diễn ra</Option>
              <Option value="completed">Đã hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="no_show">Không tham gia</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
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
              <Option value="failed">Thanh toán lỗi</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: '100%' }}
              placeholder="Hình thức"
            >
              <Option value="all">Tất cả hình thức</Option>
              <Option value="online">Online</Option>
              <Option value="offline">Offline</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={4} lg={3}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={() => message.info('Tính năng export đang được phát triển')}
              >
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Sessions Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={sessions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} buổi học`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Session Detail Modal */}
      <Modal
        title="Chi tiết buổi học"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedSession && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID buổi học">
                <Text code>{selectedSession.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedSession.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Học viên">
                <Space>
                  <Avatar src={selectedSession.learnerAvatar} icon={<UserOutlined />} />
                  {selectedSession.learnerName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Coach">
                <Space>
                  <Avatar src={selectedSession.coachAvatar} icon={<TeamOutlined />} />
                  {selectedSession.coachName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {dayjs(selectedSession.date).format('DD/MM/YYYY')} - {selectedSession.time}
              </Descriptions.Item>
              <Descriptions.Item label="Thời lượng">
                {selectedSession.duration} phút
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức">
                <Tag icon={selectedSession.type === 'online' ? <VideoCameraOutlined /> : <EnvironmentOutlined />}>
                  {selectedSession.type === 'online' ? 'Online' : 'Offline'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm">
                {selectedSession.location || 'Online'}
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {getPaymentTag(selectedSession.paymentStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                <Text strong>{selectedSession.amount.toLocaleString('vi-VN')} VND</Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Goals */}
            {selectedSession.goals && selectedSession.goals.length > 0 && (
              <div className="mt-6">
                <Title level={4}>Mục tiêu buổi học</Title>
                <List
                  dataSource={selectedSession.goals}
                  renderItem={(goal) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<CheckCircleOutlined style={{ color: goal.completed ? '#52c41a' : '#d9d9d9' }} />}
                        title={goal.title}
                        description={goal.description}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}

            {/* Progress Notes */}
            {selectedSession.progressNotes && selectedSession.progressNotes.length > 0 && (
              <div className="mt-6">
                <Title level={4}>Ghi chú tiến độ</Title>
                {selectedSession.progressNotes.map((note) => (
                  <Card key={note.id} size="small" className="mb-2">
                    <p>{note.content}</p>
                    {note.skillsImproved.length > 0 && (
                      <div>
                        <Text strong>Kỹ năng cải thiện: </Text>
                        {note.skillsImproved.map(skill => <Tag key={skill} color="green">{skill}</Tag>)}
                      </div>
                    )}
                    {note.areasToFocus.length > 0 && (
                      <div className="mt-2">
                        <Text strong>Cần tập trung: </Text>
                        {note.areasToFocus.map(area => <Tag key={area} color="orange">{area}</Tag>)}
                      </div>
                    )}
                    {note.homeworkAssigned && (
                      <div className="mt-2">
                        <Text strong>Bài tập về nhà: </Text>
                        <Text>{note.homeworkAssigned}</Text>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Feedback */}
            <div className="mt-6">
              <Title level={4}>Đánh giá</Title>
              <Row gutter={16}>
                {selectedSession.learnerFeedback && (
                  <Col span={12}>
                    <Card title="Từ học viên" size="small">
                      <Rate disabled value={selectedSession.learnerFeedback.rating} />
                      <p className="mt-2">{selectedSession.learnerFeedback.comment}</p>
                    </Card>
                  </Col>
                )}
                {selectedSession.coachFeedback && (
                  <Col span={12}>
                    <Card title="Từ coach" size="small">
                      <Rate disabled value={selectedSession.coachFeedback.rating} />
                      <p className="mt-2">{selectedSession.coachFeedback.comment}</p>
                    </Card>
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
