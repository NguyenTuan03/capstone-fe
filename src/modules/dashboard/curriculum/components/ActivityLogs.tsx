'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Select,
  DatePicker,
  Tag,
  Avatar,
  Space,
  Row,
  Col,
  Typography,
  Timeline,
  Tooltip,
} from 'antd';

import {
  UserOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  SortAscendingOutlined,
  EyeOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CurriculumApiService } from '@/services/curriculumApi';
import { ActivityLog, GetActivityLogsParams } from '@/types/curriculum';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

const ActivityLogs: React.FC = () => {
  // States
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Load logs
  const loadLogs = async () => {
    setLoading(true);
    try {
      const params: GetActivityLogsParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        entityType: entityTypeFilter !== 'all' ? (entityTypeFilter as any) : undefined,
        dateRange: dateRange || undefined,
        sortOrder: 'desc',
      };

      const response = await CurriculumApiService.getActivityLogs(params);
      setLogs(response.logs);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Failed to load activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadLogs();
  }, [pagination.current, pagination.pageSize, entityTypeFilter, dateRange]);

  // Get action icon
  const getActionIcon = (type: string) => {
    const iconMap = {
      create: <PlusOutlined style={{ color: '#52c41a' }} />,
      update: <EditOutlined style={{ color: '#1890ff' }} />,
      delete: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
      duplicate: <CopyOutlined style={{ color: '#722ed1' }} />,
      reorder: <SortAscendingOutlined style={{ color: '#faad14' }} />,
      status_change: <EyeOutlined style={{ color: '#13c2c2' }} />,
    };
    return iconMap[type as keyof typeof iconMap] || <HistoryOutlined />;
  };

  // Get entity type color
  const getEntityTypeColor = (entityType: string) => {
    const colorMap = {
      chapter: 'blue',
      lesson: 'green',
      quiz: 'orange',
      content: 'purple',
    };
    return colorMap[entityType as keyof typeof colorMap] || 'default';
  };

  // Get entity type name
  const getEntityTypeName = (entityType: string) => {
    const nameMap = {
      chapter: 'Chương',
      lesson: 'Bài học',
      quiz: 'Quiz',
      content: 'Nội dung',
    };
    return nameMap[entityType as keyof typeof nameMap] || entityType;
  };

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;

    return time.toLocaleDateString('vi-VN');
  };

  // Table columns
  const columns: ColumnsType<ActivityLog> = [
    {
      title: <IntlMessages id="curriculum.logs.table.time" />,
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (timestamp: string) => (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500 }}>{formatTimeAgo(timestamp)}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {new Date(timestamp).toLocaleString('vi-VN')}
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.logs.table.user" />,
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      render: (userName: string, record: ActivityLog) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500 }}>{userName}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>{record.userId}</div>
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.logs.table.action" />,
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string, record: ActivityLog) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getActionIcon(type)}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500 }}>{record.action}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>{type}</div>
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.logs.table.entity" />,
      dataIndex: 'entityType',
      key: 'entityType',
      width: 150,
      render: (entityType: string, record: ActivityLog) => (
        <div>
          <Tag
            color={getEntityTypeColor(entityType)}
            style={{ fontSize: '10px', marginBottom: '2px' }}
          >
            {getEntityTypeName(entityType)}
          </Tag>
          <div style={{ fontSize: '12px', fontWeight: 500 }}>{record.entityName}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>ID: {record.entityId}</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.logs.table.details" />,
      dataIndex: 'details',
      key: 'details',
      render: (details: any) => (
        <div style={{ fontSize: '12px', color: '#666', maxWidth: '200px' }}>
          {details ? (
            typeof details === 'object' ? (
              <Tooltip title={JSON.stringify(details, null, 2)}>
                <span>Chi tiết thay đổi (hover để xem)</span>
              </Tooltip>
            ) : (
              <span>{details}</span>
            )
          ) : (
            <span style={{ color: '#ccc' }}>Không có chi tiết</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={entityTypeFilter}
              onChange={setEntityTypeFilter}
              style={{ width: '100%' }}
              placeholder="Loại đối tượng"
            >
              <Option value="all">Tất cả</Option>
              <Option value="chapter">Chương</Option>
              <Option value="lesson">Bài học</Option>
              <Option value="quiz">Quiz</Option>
              <Option value="content">Nội dung</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                } else {
                  setDateRange(null);
                }
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Tổng: {pagination.total} hoạt động
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Activity Timeline (for recent activities) */}
      {logs.length > 0 && (
        <Card
          title="Hoạt động gần đây"
          style={{ marginBottom: 16 }}
          bodyStyle={{ padding: '16px' }}
        >
          <Timeline
            items={logs.slice(0, 5).map((log, index) => ({
              color: getEntityTypeColor(log.entityType),
              dot: getActionIcon(log.type),
              children: (
                <div key={log.id}>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>
                    {log.action} - {log.entityName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '2px' }}>
                    <Tag size="small" color={getEntityTypeColor(log.entityType)}>
                      {getEntityTypeName(log.entityType)}
                    </Tag>
                    bởi {log.userName}
                  </div>
                  <div style={{ fontSize: '10px', color: '#999' }}>
                    {formatTimeAgo(log.timestamp)}
                  </div>
                </div>
              ),
            }))}
          />
        </Card>
      )}

      {/* Full Activity Table */}
      <Card title="Lịch sử hoạt động chi tiết">
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hoạt động`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 20,
              }));
            },
          }}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default ActivityLogs;
