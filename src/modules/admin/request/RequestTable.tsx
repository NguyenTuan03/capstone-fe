import {
  Card,
  Table,
  Tag,
  Space,
  Avatar,
  Typography,
  Dropdown,
  Button,
  Tooltip,
  Badge,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserOutlined,
  MoreOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

type RequestItem = {
  id: number;
  description: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  createdBy: {
    fullName: string;
    email: string;
    profilePicture?: string;
  };
};

const STATUS_META: Record<
  RequestItem['status'],
  { color: string; text: string; badge: 'processing' | 'success' | 'error' }
> = {
  PENDING: { color: 'gold', text: 'Chờ duyệt', badge: 'processing' },
  APPROVED: { color: 'green', text: 'Đã duyệt', badge: 'success' },
  REJECTED: { color: 'red', text: 'Từ chối', badge: 'error' },
};

export default function RequestsTable({
  requests,
  isLoading,
  total,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  handleViewDetails,
  handleApproveRequest,
  handleRejectRequest,
}: {
  requests: RequestItem[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (p: number) => void;
  setPageSize: (s: number) => void;
  handleViewDetails: (r: RequestItem) => void;
  handleApproveRequest: (r: RequestItem) => void;
  handleRejectRequest: (r: RequestItem) => void;
}) {
  const columns: ColumnsType<RequestItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 84,
      fixed: 'left',
      render: (id: number) => <Text code>{id}</Text>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: { showTitle: false },
      render: (val: string) => (
        <Tooltip title={val}>
          <Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
            {val}
          </Paragraph>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: RequestItem['status']) => {
        const meta = STATUS_META[status];
        return (
          <Space size={6}>
            <Badge status={meta.badge} />
            <Tag color={meta.color} bordered={false}>
              {meta.text}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Người tạo',
      key: 'createdBy',
      width: 280,
      render: (_, record) => {
        const user = record.createdBy;
        return (
          <Space>
            <Avatar src={user.profilePicture} icon={<UserOutlined />} size="small" />
            <div style={{ lineHeight: 1.2 }}>
              <Text strong>{user.fullName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user.email}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('HH:mm DD/MM/YYYY')}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
        </Tooltip>
      ),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 72,
      fixed: 'right',
      render: (_, record) => {
        const items = [
          {
            key: 'view',
            label: 'Xem chi tiết',
            icon: <EyeOutlined />,
            onClick: () => handleViewDetails(record),
          },
          ...(record.status === 'PENDING'
            ? [
                {
                  key: 'approve',
                  label: <Text style={{ color: '#52c41a' }}>Duyệt</Text>,
                  icon: <CheckOutlined />,
                  onClick: () => handleApproveRequest(record),
                },
                {
                  key: 'reject',
                  label: <Text type="danger">Từ chối</Text>,
                  icon: <CloseOutlined />,
                  onClick: () => handleRejectRequest(record),
                },
              ]
            : []),
        ];
        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Card
      size="small"
      styles={{ body: { padding: 0 } }}
      title={<Text strong>Danh sách yêu cầu</Text>}
      extra={<Text type="secondary">Tổng {total}</Text>}
    >
      <Table<RequestItem>
        columns={columns}
        dataSource={requests}
        rowKey="id"
        loading={isLoading}
        size="small"
        sticky
        bordered={false}
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showLessItems: true,
          size: 'small',
          onChange: (page, size) => {
            setCurrentPage(page);
            if (size && size !== pageSize) setPageSize(size);
          },
          showTotal: (t, [start, end]) => (
            <span>
              {start}-{end} / {t}
            </span>
          ),
        }}
      />
    </Card>
  );
}

// Helpers bạn đã có, giữ nguyên signature cho khỏi chỉnh nhiều
export function getTypeText(type: string) {
  switch (type) {
    case 'CREATE':
      return 'Tạo mới';
    case 'UPDATE':
      return 'Cập nhật';
    case 'DELETE':
      return 'Xoá';
    case 'CHANGE':
      return 'Thay đổi';
    default:
      return type;
  }
}

export function getStatusColor(status: string) {
  return STATUS_META[status as RequestItem['status']]?.color ?? 'default';
}

export function getStatusText(status: string) {
  return STATUS_META[status as RequestItem['status']]?.text ?? status;
}
