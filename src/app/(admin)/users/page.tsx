'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Avatar,
  Modal,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Dropdown,
  Progress,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
  ExportOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Types
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  status: string;
  skillLevel: string;
  location: string;
  joinDate: string;
  lastLogin: string;
  totalSessions: number;
  totalSpent: number;
  stats: {
    completedLessons: number;
    totalLessons: number;
    currentLevel: string;
    achievements: string[];
  };
  blockReason?: string;
}

interface UserStats {
  total: number;
  active: number;
  blocked: number;
  inactive: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  // Filters and pagination
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    blocked: 0,
    inactive: 0,
  });

  // Load users data
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Import mock data
      const { users: mockUsers } = await import('@/data_admin/users');
      
      // Convert mock users to UI format
      let filteredUsers = mockUsers.map((user) => {
        const isCoach = user.role.name === 'COACH';
        const isLearner = user.role.name === 'LEARNER';
        
        // Generate skill level based on role
        let skillLevel = 'beginner';
        if (isCoach) {
          skillLevel = 'advanced'; // Coaches are advanced
        } else if (isLearner) {
          // Random skill level for learners
          const levels = ['beginner', 'intermediate', 'advanced'];
          skillLevel = levels[user.id % 3];
        }
        
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.fullName,
          phone: user.phoneNumber || 'Chưa cập nhật',
          avatar: user.profilePicture || '',
          role: user.role.name.toLowerCase(),
          status: user.isActive ? 'active' : 'inactive',
          skillLevel: skillLevel,
          location: 'TP. HCM',
          joinDate: user.createdAt.toISOString(),
          lastLogin: user.updatedAt.toISOString(),
          totalSessions: Math.floor(Math.random() * 50),
          totalSpent: Math.floor(Math.random() * 10000000),
          stats: {
            completedLessons: Math.floor(Math.random() * 20),
            totalLessons: 30,
            currentLevel: skillLevel.toUpperCase(),
            achievements: ['Người mới', 'Tiến bộ nhanh'],
          },
        };
      });

      // Apply filters
      if (searchText) {
        const search = searchText.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        );
      }

      if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter((u) => u.status === statusFilter);
      }

      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter((u) => u.role === roleFilter);
      }

      // Pagination
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedUsers = filteredUsers.slice(start, end);

      // Calculate stats
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter((u) => u.isActive).length;
      const inactiveUsers = mockUsers.filter((u) => !u.isActive).length;

      setUsers(paginatedUsers);
      setTotal(filteredUsers.length);
      setStats({
        total: totalUsers,
        active: activeUsers,
        blocked: 0, // No blocked users, only inactive
        inactive: inactiveUsers,
      });
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, statusFilter, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, roleFilter]);

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'green',
      inactive: 'orange',
      blocked: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      active: 'Đang hoạt động',
      inactive: 'Không hoạt động',
      blocked: 'Đã khóa',
    };
    return texts[status] || status;
  };

  const getRoleText = (role: string) => {
    const texts: { [key: string]: string } = {
      learner: 'Học viên',
      coach: 'Huấn luyện viên',
      admin: 'Quản trị viên',
    };
    return texts[role] || role;
  };

  const getSkillLevelText = (level: string) => {
    const texts: { [key: string]: string } = {
      beginner: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao',
    };
    return texts[level] || level;
  };

  // Actions
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setBlockReason('');
    setIsBlockModalVisible(true);
  };

  const handleUnblockUser = async (user: User) => {
    try {
      message.success(`Đã mở khóa người dùng ${user.name}`);
      loadUsers();
    } catch (error) {
      message.error('Không thể mở khóa người dùng');
    }
  };

  const handleDeleteUser = (user: User) => {
    Modal.confirm({
      title: 'Xác nhận xóa người dùng',
      content: `Bạn có chắc chắn muốn xóa người dùng "${user.name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          message.success(`Đã xóa người dùng ${user.name}`);
          loadUsers();
        } catch (error) {
          message.error('Không thể xóa người dùng');
        }
      },
    });
  };

  const confirmBlockUser = async () => {
    if (!blockReason.trim()) {
      message.error('Vui lòng nhập lý do khóa');
      return;
    }

    try {
      message.success(`Đã khóa người dùng ${selectedUser?.name}`);
      setIsBlockModalVisible(false);
      setBlockReason('');
      loadUsers();
    } catch (error) {
      message.error('Không thể khóa người dùng');
    }
  };

  const getActionMenu = (user: User): MenuProps => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'Xem chi tiết',
        onClick: () => handleViewDetails(user),
      },
      {
        key: 'divider-1',
        type: 'divider',
      },
      user.status === 'blocked'
        ? {
            key: 'unblock',
            icon: <UnlockOutlined />,
            label: 'Mở khóa',
            onClick: () => handleUnblockUser(user),
          }
        : {
            key: 'block',
            icon: <LockOutlined />,
            label: 'Khóa tài khoản',
            onClick: () => handleBlockUser(user),
          },
      {
        key: 'divider-2',
        type: 'divider',
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Xóa người dùng',
        danger: true,
        onClick: () => handleDeleteUser(user),
      },
    ],
  });

  const columns: ColumnsType<User> = [
    {
      title: 'Thông tin người dùng',
      key: 'userInfo',
      width: 280,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar size={48} src={record.avatar} icon={<UserOutlined />} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
              {record.name}
            </div>
            <div style={{ fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => (
        <Tag color="blue">{getRoleText(role)}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string, record) => (
        <div>
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
          {status === 'blocked' && record.blockReason && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {record.blockReason}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Buổi học',
      dataIndex: 'totalSessions',
      key: 'totalSessions',
      width: 80,
      align: 'center',
      render: (sessions: number) => <Text strong>{sessions}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={2}>Quản lý người dùng</Title>
        <Text className="text-gray-600">
          Quản lý tất cả người dùng trên nền tảng
        </Text>
      </div>

      {/* Main Table Card */}
      <Card className="card-3d">
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Danh sách người dùng
              </Title>
            </Col>
            <Col>
              <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên, email..."
              allowClear
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText('')}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Đang hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              style={{ width: '100%' }}
              value={roleFilter}
              onChange={setRoleFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="admin">Quản trị viên</Option>
              <Option value="coach">Huấn luyện viên</Option>
              <Option value="learner">Học viên</Option>
            </Select>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết người dùng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={80} src={selectedUser.avatar} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedUser.name}
              </Title>
              <Text type="secondary">{selectedUser.email}</Text>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="Số điện thoại" span={2}>
                {selectedUser.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color="blue">{getRoleText(selectedUser.role)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedUser.status)}>
                  {getStatusText(selectedUser.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Khu vực">{selectedUser.location}</Descriptions.Item>
              <Descriptions.Item label="Trình độ">
                {getSkillLevelText(selectedUser.skillLevel)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {new Date(selectedUser.joinDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập gần nhất">
                {new Date(selectedUser.lastLogin).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng buổi học">
                <Text strong>{selectedUser.totalSessions} buổi</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng chi tiêu">
                <Text strong>{selectedUser.totalSpent.toLocaleString('vi-VN')} ₫</Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Title level={5}>Tiến độ học tập</Title>
              <Progress
                percent={Math.round(
                  (selectedUser.stats.completedLessons / selectedUser.stats.totalLessons) * 100
                )}
                format={(percent) =>
                  `${selectedUser.stats.completedLessons}/${selectedUser.stats.totalLessons} bài`
                }
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>
                <TrophyOutlined /> Thành tựu
              </Title>
              <Space wrap>
                {selectedUser.stats.achievements.map((achievement, index) => (
                  <Tag key={index} color="gold">
                    {achievement}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* Block Modal */}
      <Modal
        title="Khóa tài khoản người dùng"
        open={isBlockModalVisible}
        onOk={confirmBlockUser}
        onCancel={() => {
          setIsBlockModalVisible(false);
          setBlockReason('');
        }}
        okText="Khóa"
        okType="danger"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <Text>
            Bạn có chắc chắn muốn khóa tài khoản <strong>{selectedUser?.name}</strong>?
          </Text>
        </div>
        <div>
          <Text strong>Lý do khóa tài khoản:</Text>
          <TextArea
            rows={4}
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Nhập lý do khóa tài khoản..."
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
}

