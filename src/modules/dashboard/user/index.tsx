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
  Form,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Dropdown,
  Badge,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  StopOutlined,
  PlayCircleOutlined,
  FilterOutlined,
  ExportOutlined,
  MoreOutlined,
  DeleteOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

import { UserApiService } from '@/services/userApi';
import { User, GetUsersParams, UserListStats } from '@/types/user';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function UsersPageClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [blockReasons, setBlockReasons] = useState<string[]>([]);
  const [blockForm] = Form.useForm();

  // Filters and pagination
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<UserListStats | null>(null);

  // Load users data
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetUsersParams = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        role: roleFilter === 'all' ? undefined : roleFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        skillLevel: skillFilter === 'all' ? undefined : skillFilter,
      };

      const response = await UserApiService.getUsers(params);
      setUsers(response.users);
      setTotal(response.total);

      // Load stats
      const statsData = await UserApiService.getUserStats();
      setStats(statsData);
    } catch {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, roleFilter, statusFilter, skillFilter]);

  // Load block reasons
  const loadBlockReasons = async () => {
    try {
      const reasons = await UserApiService.getBlockReasons();
      setBlockReasons(reasons);
    } catch {
      console.error('Failed to load block reasons');
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadBlockReasons();
  }, []);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'blocked':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'purple';
      case 'coach':
        return 'blue';
      case 'learner':
        return 'cyan';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // User actions
  const handleViewUser = async (userId: string) => {
    try {
      const user = await UserApiService.getUserById(userId);
      if (user) {
        setSelectedUser(user);
        setIsDetailModalVisible(true);
      }
    } catch {
      message.error('Không thể tải thông tin người dùng');
    }
  };

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setIsBlockModalVisible(true);
    blockForm.resetFields();
  };

  const submitBlock = async (values: { reason: string; customReason?: string }) => {
    if (!selectedUser) return;

    const finalReason =
      values.reason === 'Khác (tự nhập lý do)'
        ? values.customReason || values.reason
        : values.reason;

    Modal.confirm({
      title: 'Xác nhận khóa tài khoản',
      content: (
        <div>
          <p>
            Bạn có chắc chắn muốn khóa tài khoản của <strong>{selectedUser.name}</strong>?
          </p>
          <p className="chu-do-600 chu-dam">Lý do: {finalReason}</p>
          <p className="chu-xam-500 chu-nho margin-tren-2">
            Người dùng sẽ không thể đăng nhập sau khi bị khóa.
          </p>
        </div>
      ),
      okText: 'Xác nhận khóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await UserApiService.blockUser({
            userId: selectedUser.id,
            reason: finalReason,
            adminId: 'current_admin',
          });
          message.success('Đã khóa tài khoản thành công');
          setIsBlockModalVisible(false);
          loadUsers();
        } catch {
          message.error('Không thể khóa tài khoản');
        }
      },
    });
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await UserApiService.unblockUser(userId, 'current_admin');
      message.success('Đã mở khóa tài khoản thành công');
      loadUsers();
    } catch {
      message.error('Không thể mở khóa tài khoản');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa người dùng',
      content: (
        <div>
          <p>
            Bạn có chắc chắn muốn xóa người dùng <strong>{userName}</strong>?
          </p>
          <p className="chu-do-600 chu-dam">Hành động này không thể hoàn tác!</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await UserApiService.deleteUser(userId);
          message.success('Đã xóa người dùng thành công');
          loadUsers();
        } catch {
          message.error('Không thể xóa người dùng');
        }
      },
    });
  };

  // Action dropdown menu
  const getActionMenu = (user: User): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Xem chi tiết',
      onClick: () => handleViewUser(user.id),
    },
    {
      type: 'divider',
    },
    ...(user.status === 'active'
      ? [
          {
            key: 'block',
            icon: <StopOutlined />,
            label: 'Khóa tài khoản',
            onClick: () => handleBlockUser(user),
            danger: true,
          },
        ]
      : []),
    ...(user.status === 'blocked'
      ? [
          {
            key: 'unblock',
            icon: <PlayCircleOutlined />,
            label: 'Mở khóa tài khoản',
            onClick: () => handleUnblockUser(user.id),
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Xóa tài khoản',
      onClick: () => handleDeleteUser(user.id, user.name),
      danger: true,
    },
  ];

  // Table columns
  const columns: ColumnsType<User> = [
    {
      title: 'Thông tin người dùng',
      key: 'userInfo',
      width: 280,
      render: (_, record) => (
        <div className="hien-thi-ngang can-giua khoang-cach-ngang-2">
          <Avatar src={record.avatar} className="nen-xanh-500" size="default">
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="mo-rong-1 rong-toi-thieu-0">
            <div className="hien-thi-ngang can-giua khoang-cach-ngang-1">
              <Text className="chu-dam">{record.name}</Text>
              {record.role === 'admin' && <CheckCircleOutlined className="chu-tim-500 chu-nho" />}
            </div>
            <Text className="chu-nho chu-xam-500">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      key: 'role',
      width: 120,
      render: (_, record) => (
        <Tag color={getRoleColor(record.role)}>
          {record.role === 'admin'
            ? 'Quản trị viên'
            : record.role === 'coach'
              ? 'Huấn luyện viên'
              : 'Học viên'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, record) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={
            record.status === 'active'
              ? 'Đang hoạt động'
              : record.status === 'blocked'
                ? 'Bị khóa'
                : 'Chờ duyệt'
          }
        />
      ),
    },
    {
      title: 'Tham gia',
      key: 'joinDate',
      width: 120,
      render: (_, record) => <Text className="text-sm">{formatDate(record.joinDate)}</Text>,
    },
    {
      title: 'Buổi học',
      key: 'sessions',
      width: 80,
      align: 'center',
      render: (_, record) => <Text className="font-medium">{record.totalSessions || 0}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenu(record) }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Title level={2}>Quản lý người dùng</Title>
          <Text className="text-gray-600">
            Quản lý thông tin và trạng thái của tất cả người dùng trong hệ thống
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Xuất dữ liệu</Button>
        </Space>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <UserOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <Text className="text-gray-600">Tổng số người dùng</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <Text className="text-gray-600">Đang hoạt động</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <StopOutlined className="text-3xl text-red-500 mb-2" />
              <div className="text-2xl font-bold">{stats.blocked}</div>
              <Text className="text-gray-600">Bị khóa</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <Text className="text-gray-600">Chờ duyệt</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <UserOutlined className="text-3xl text-cyan-500 mb-2" />
              <div className="text-2xl font-bold">{stats.learners}</div>
              <Text className="text-gray-600">Học viên</Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <TeamOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.coaches}</div>
              <Text className="text-gray-600">Huấn luyện viên</Text>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Search
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={() => {
                  setCurrentPage(1);
                  loadUsers();
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FilterOutlined />
              <Text>Bộ lọc:</Text>
            </div>

            <Select
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setCurrentPage(1);
              }}
              className="w-40"
              placeholder="Vai trò"
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="learner">Học viên</Option>
              <Option value="coach">Huấn luyện viên</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              className="w-40"
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Đang hoạt động</Option>
              <Option value="blocked">Bị khóa</Option>
              <Option value="pending">Chờ duyệt</Option>
            </Select>

            <Select
              value={skillFilter}
              onChange={(value) => {
                setSkillFilter(value);
                setCurrentPage(1);
              }}
              className="w-40"
              placeholder="Trình độ"
            >
              <Option value="all">Tất cả trình độ</Option>
              <Option value="beginner">Mới bắt đầu</Option>
              <Option value="intermediate">Trung bình</Option>
              <Option value="advanced">Nâng cao</Option>
            </Select>

            <Button
              onClick={() => {
                setRoleFilter('all');
                setStatusFilter('all');
                setSkillFilter('all');
                setSearchText('');
                setCurrentPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
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
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng số ${total} người dùng`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size !== pageSize) {
                setPageSize(size);
              }
            },
          }}
        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title="Chi tiết người dùng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar src={selectedUser.avatar} size={80}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Title level={4} className="mb-1">
                  {selectedUser.name}
                </Title>
                <Space>
                  <Tag color={getRoleColor(selectedUser.role)}>
                    {selectedUser.role === 'admin'
                      ? 'Quản trị viên'
                      : selectedUser.role === 'coach'
                        ? 'Huấn luyện viên'
                        : 'Học viên'}
                  </Tag>
                  <Badge
                    status={getStatusColor(selectedUser.status) as any}
                    text={
                      selectedUser.status === 'active'
                        ? 'Đang hoạt động'
                        : selectedUser.status === 'blocked'
                          ? 'Bị khóa'
                          : 'Chờ duyệt'
                    }
                  />
                </Space>
              </div>
            </div>

            <Descriptions title="Thông tin cơ bản" column={2}>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedUser.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">{selectedUser.location || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">
                {formatDate(selectedUser.joinDate)}
              </Descriptions.Item>
              {selectedUser.lastLogin && (
                <Descriptions.Item label="Lần cuối đăng nhập">
                  {formatDate(selectedUser.lastLogin)}
                </Descriptions.Item>
              )}
              {selectedUser.skillLevel && (
                <Descriptions.Item label="Trình độ">
                  {selectedUser.skillLevel === 'beginner'
                    ? 'Mới bắt đầu'
                    : selectedUser.skillLevel === 'intermediate'
                      ? 'Trung bình'
                      : 'Nâng cao'}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedUser.status === 'blocked' && selectedUser.blockReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Title level={5} className="text-red-600 mb-2">
                  Thông tin khóa tài khoản
                </Title>
                <Text className="text-red-600">{selectedUser.blockReason}</Text>
                {selectedUser.blockedAt && (
                  <div className="text-sm text-gray-500 mt-1">
                    Khóa lúc: {formatDate(selectedUser.blockedAt)}
                  </div>
                )}
              </div>
            )}

            {selectedUser.stats && (
              <Descriptions title="Thống kê hoạt động" column={2}>
                <Descriptions.Item label="Tổng số buổi học">
                  {selectedUser.totalSessions || 0}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng chi tiêu">
                  {formatCurrency(selectedUser.totalSpent || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Bài học hoàn thành">
                  {selectedUser.stats.completedLessons}/{selectedUser.stats.totalLessons}
                </Descriptions.Item>
                <Descriptions.Item label="Cấp độ hiện tại">
                  {selectedUser.stats.currentLevel}
                </Descriptions.Item>
              </Descriptions>
            )}

            {selectedUser.stats?.achievements && selectedUser.stats.achievements.length > 0 && (
              <div>
                <Title level={5} className="mb-3">
                  Thành tựu
                </Title>
                <Space wrap>
                  {selectedUser.stats.achievements.map((achievement, index) => (
                    <Tag key={index} color="gold">
                      {achievement}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Block User Modal */}
      <Modal
        title="Khóa tài khoản"
        open={isBlockModalVisible}
        onCancel={() => setIsBlockModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="mb-4">
          <Text className="text-gray-600">Bạn có chắc chắn muốn khóa tài khoản này không?</Text>
        </div>

        <Form form={blockForm} layout="vertical" onFinish={submitBlock}>
          <Form.Item
            name="reason"
            label="Lý do khóa"
            rules={[{ required: true, message: 'Vui lòng chọn lý do khóa tài khoản' }]}
          >
            <Select
              placeholder="Chọn lý do khóa tài khoản..."
              onChange={(value) => {
                if (value !== 'Khác (tự nhập lý do)') {
                  blockForm.setFieldsValue({ customReason: value });
                } else {
                  blockForm.setFieldsValue({ customReason: '' });
                }
              }}
            >
              {blockReasons.map((reason) => (
                <Option key={reason} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.reason !== currentValues.reason}
          >
            {({ getFieldValue }) => {
              const selectedReason = getFieldValue('reason');
              return selectedReason === 'Khác (tự nhập lý do)' ? (
                <Form.Item
                  name="customReason"
                  label="Lý do khác"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập chi tiết lý do khóa tài khoản',
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập chi tiết lý do khóa tài khoản..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsBlockModalVisible(false)}>Hủy</Button>
            <Button type="primary" danger htmlType="submit">
              Khóa tài khoản
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
