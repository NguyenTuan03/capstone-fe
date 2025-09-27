'use client';

import { useState, useEffect } from 'react';
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
  Tooltip,
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
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

import { UserApiService } from '@/services/userApi';
import { User, GetUsersParams, UserListStats } from '@/types/user';
import IntlMessages from '@/@crema/helper/IntlMessages';

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
  const loadUsers = async () => {
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
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Load block reasons
  const loadBlockReasons = async () => {
    try {
      const reasons = await UserApiService.getBlockReasons();
      setBlockReasons(reasons);
    } catch (error) {
      console.error('Failed to load block reasons:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, searchText, roleFilter, statusFilter, skillFilter]);

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
    } catch (error) {
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
          <p className="text-red-600 font-medium">Lý do: {finalReason}</p>
          <p className="text-gray-500 text-sm mt-2">
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
        } catch (error) {
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
    } catch (error) {
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
          <p className="text-red-600 font-medium">Hành động này không thể hoàn tác!</p>
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
        } catch (error) {
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
      label: <IntlMessages id="user.actions.view" />,
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
            label: <IntlMessages id="user.actions.block" />,
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
            label: <IntlMessages id="user.actions.unblock" />,
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
      label: <IntlMessages id="user.actions.delete" />,
      onClick: () => handleDeleteUser(user.id, user.name),
      danger: true,
    },
  ];

  // Table columns
  const columns: ColumnsType<User> = [
    {
      title: <IntlMessages id="user.table.info" />,
      key: 'userInfo',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} className="bg-blue-500" size="default">
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Text className="font-medium">{record.name}</Text>
              {record.role === 'admin' && <CheckCircleOutlined className="text-purple-500" />}
            </div>
            <Text className="text-sm text-gray-500">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="user.table.role" />,
      key: 'role',
      width: 100,
      render: (_, record) => (
        <Tag color={getRoleColor(record.role)}>
          <IntlMessages id={`user.role.${record.role}`} />
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="user.table.status" />,
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Badge
          status={getStatusColor(record.status) as any}
          text={<IntlMessages id={`user.status.${record.status}`} />}
        />
      ),
    },
    {
      title: 'Tham gia',
      key: 'joinDate',
      width: 100,
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
      title: <IntlMessages id="user.table.actions" />,
      key: 'actions',
      width: 80,
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
          <Title level={2}>
            <IntlMessages id="user.management.title" />
          </Title>
          <Text className="text-gray-600">
            <IntlMessages id="user.management.subtitle" />
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>
            <IntlMessages id="user.export" />
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <UserOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.total" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.active" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <StopOutlined className="text-3xl text-red-500 mb-2" />
              <div className="text-2xl font-bold">{stats.blocked}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.blocked" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{stats.pending}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.pending" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <UserOutlined className="text-3xl text-cyan-500 mb-2" />
              <div className="text-2xl font-bold">{stats.learners}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.learners" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card className="text-center">
              <TeamOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.coaches}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.coaches" />
              </Text>
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
              <Option value="all">
                <IntlMessages id="user.role.all" />
              </Option>
              <Option value="learner">
                <IntlMessages id="user.role.learner" />
              </Option>
              <Option value="coach">
                <IntlMessages id="user.role.coach" />
              </Option>
              <Option value="admin">
                <IntlMessages id="user.role.admin" />
              </Option>
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
              <Option value="all">
                <IntlMessages id="user.status.all" />
              </Option>
              <Option value="active">
                <IntlMessages id="user.status.active" />
              </Option>
              <Option value="blocked">
                <IntlMessages id="user.status.blocked" />
              </Option>
              <Option value="pending">
                <IntlMessages id="user.status.pending" />
              </Option>
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
              <Option value="all">
                <IntlMessages id="user.skill.all" />
              </Option>
              <Option value="beginner">
                <IntlMessages id="user.skill.beginner" />
              </Option>
              <Option value="intermediate">
                <IntlMessages id="user.skill.intermediate" />
              </Option>
              <Option value="advanced">
                <IntlMessages id="user.skill.advanced" />
              </Option>
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
              <IntlMessages id="user.filter.clear" />
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title={<IntlMessages id="user.detail.title" />}
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
                    <IntlMessages id={`user.role.${selectedUser.role}`} />
                  </Tag>
                  <Badge
                    status={getStatusColor(selectedUser.status) as any}
                    text={<IntlMessages id={`user.status.${selectedUser.status}`} />}
                  />
                </Space>
              </div>
            </div>

            <Descriptions title={<IntlMessages id="user.detail.basicInfo" />} column={2}>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedUser.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Vị trí">{selectedUser.location || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label={<IntlMessages id="user.detail.joinDate" />}>
                {formatDate(selectedUser.joinDate)}
              </Descriptions.Item>
              {selectedUser.lastLogin && (
                <Descriptions.Item label={<IntlMessages id="user.detail.lastLogin" />}>
                  {formatDate(selectedUser.lastLogin)}
                </Descriptions.Item>
              )}
              {selectedUser.skillLevel && (
                <Descriptions.Item label="Trình độ">
                  <IntlMessages id={`user.skill.${selectedUser.skillLevel}`} />
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
              <Descriptions title={<IntlMessages id="user.detail.stats" />} column={2}>
                <Descriptions.Item label={<IntlMessages id="user.detail.totalSessions" />}>
                  {selectedUser.totalSessions || 0}
                </Descriptions.Item>
                <Descriptions.Item label={<IntlMessages id="user.detail.totalSpent" />}>
                  {formatCurrency(selectedUser.totalSpent || 0)}
                </Descriptions.Item>
                <Descriptions.Item label={<IntlMessages id="user.detail.completedLessons" />}>
                  {selectedUser.stats.completedLessons}/{selectedUser.stats.totalLessons}
                </Descriptions.Item>
                <Descriptions.Item label={<IntlMessages id="user.detail.currentLevel" />}>
                  {selectedUser.stats.currentLevel}
                </Descriptions.Item>
              </Descriptions>
            )}

            {selectedUser.stats?.achievements && selectedUser.stats.achievements.length > 0 && (
              <div>
                <Title level={5} className="mb-3">
                  <IntlMessages id="user.detail.achievements" />
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
        title={<IntlMessages id="user.block.title" />}
        open={isBlockModalVisible}
        onCancel={() => setIsBlockModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="mb-4">
          <Text className="text-gray-600">
            <IntlMessages id="user.block.subtitle" />
          </Text>
        </div>

        <Form form={blockForm} layout="vertical" onFinish={submitBlock}>
          <Form.Item
            name="reason"
            label={<IntlMessages id="user.block.reason.label" />}
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
                  label={<IntlMessages id="user.block.customReason.label" />}
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
            <Button onClick={() => setIsBlockModalVisible(false)}>
              <IntlMessages id="common.cancel" />
            </Button>
            <Button type="primary" danger htmlType="submit">
              <IntlMessages id="user.actions.block" />
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
