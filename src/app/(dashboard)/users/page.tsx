'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, Select, Avatar, Modal, Form, Typography, Row, Col, Badge, Popconfirm, message, Tabs, Descriptions, List, Progress, Rate, Dropdown, Tooltip } from 'antd';
import { UserOutlined, TeamOutlined, SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, FilterOutlined, ExportOutlined, PlusOutlined, TrophyOutlined, ClockCircleOutlined, StarOutlined, MoreOutlined, CheckCircleOutlined, ExclamationCircleOutlined, RiseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

import { UserApiService } from '@/services/userApi';
import { UserDetail, GetUsersParams, UserListStats } from '@/types/user';
import IntlMessages from '@/@crema/helper/IntlMessages';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function UsersPage() {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [stats, setStats] = useState<UserListStats | null>(null);
  const [editForm] = Form.useForm();

  // Filters and pagination
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

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
        skillLevel: skillFilter === 'all' ? undefined : skillFilter
      };

      const response = await UserApiService.getUsers(params);
      setUsers(response.users);
      setTotal(response.total);

      // Load stats
      const statsData = await UserApiService.getUserStats();
      setStats(statsData);
    } catch (error) {
      message.error('Không thể tải dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize, searchText, roleFilter, statusFilter, skillFilter]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'banned': return 'red';
      case 'pending_coach_approval': return 'orange';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'purple';
      case 'coach': return 'blue';
      case 'user': return 'cyan';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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

  const handleEditUser = (user: UserDetail) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role,
      status: user.status,
      skillLevel: user.skillLevel
    });
    setIsEditModalVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await UserApiService.deleteUser(userId);
      message.success('Xóa người dùng thành công');
      loadUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng');
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: 'active' | 'banned') => {
    try {
      await UserApiService.updateUserStatus(userId, status);
      message.success(status === 'banned' ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công');
      loadUsers();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handlePromoteUser = async (userId: string, newRole: 'user' | 'coach' | 'admin') => {
    try {
      await UserApiService.updateUserRole(userId, newRole);
      message.success('Thăng cấp thành công');
      loadUsers();
    } catch (error) {
      message.error('Không thể thăng cấp người dùng');
    }
  };

  const handleSaveEdit = async (values: any) => {
    if (!selectedUser) return;
    
    try {
      await UserApiService.updateUser(selectedUser.id, values);
      message.success('Cập nhật thành công');
      setIsEditModalVisible(false);
      loadUsers();
    } catch (error) {
      message.error('Không thể cập nhật người dùng');
    }
  };

  // Action dropdown menu
  const getActionMenu = (user: UserDetail): MenuProps['items'] => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Xem chi tiết',
      onClick: () => handleViewUser(user.id)
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Chỉnh sửa',
      onClick: () => handleEditUser(user)
    },
    {
      type: 'divider'
    },
    ...(user.role === 'user' && user.status === 'pending_coach_approval' ? [{
      key: 'promote-coach',
      icon: <RiseOutlined />,
      label: 'Duyệt làm Coach',
      onClick: () => handlePromoteUser(user.id, 'coach')
    }] : []),
    ...(user.role !== 'admin' ? [{
      key: 'promote-admin',
      icon: <RiseOutlined />,
      label: 'Thăng cấp Admin',
      onClick: () => handlePromoteUser(user.id, 'admin')
    }] : []),
    {
      type: 'divider'
    },
    {
      key: user.status === 'active' ? 'ban' : 'unban',
      icon: user.status === 'active' ? <LockOutlined /> : <UnlockOutlined />,
      label: user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa',
      onClick: () => handleUpdateUserStatus(user.id, user.status === 'active' ? 'banned' : 'active'),
      danger: user.status === 'active'
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Xóa người dùng',
      onClick: () => Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc muốn xóa người dùng này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: () => handleDeleteUser(user.id)
      }),
      danger: true
    }
  ];

  // Table columns
  const columns: ColumnsType<UserDetail> = [
    {
      title: 'Thông tin người dùng',
      key: 'userInfo',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={record.avatar}
            className="bg-blue-500"
            size="large"
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Text className="font-medium">{record.name}</Text>
              {record.coachProfile?.isVerified && (
                <Tooltip title="Huấn luyện viên đã xác minh">
                  <CheckCircleOutlined className="text-green-500" />
                </Tooltip>
              )}
              {record.status === 'pending_coach_approval' && (
                <Tooltip title="Chờ duyệt coach">
                  <ExclamationCircleOutlined className="text-orange-500" />
                </Tooltip>
              )}
            </div>
            <Text className="text-sm text-gray-500">{record.email}</Text>
            <div className="flex items-center space-x-2 mt-1">
              <Tag color={getRoleColor(record.role)} size="small">
                {record.role === 'user' ? 'Học viên' : record.role === 'coach' ? 'HLV' : 'Admin'}
              </Tag>
              {record.skillLevel && (
                <Tag color="default" size="small">
                  {record.skillLevel === 'beginner' ? 'Mới' : record.skillLevel === 'intermediate' ? 'TB' : 'NC'}
                </Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <PhoneOutlined className="text-gray-400 text-xs" />
            <Text className="text-sm">{record.phone}</Text>
          </div>
          <div className="flex items-center space-x-1">
            <EnvironmentOutlined className="text-gray-400 text-xs" />
            <Text className="text-sm">{record.location}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'active' ? 'Hoạt động' : 
           status === 'banned' ? 'Đã khóa' : 'Chờ duyệt'}
        </Tag>
      ),
    },
    {
      title: 'Hoạt động',
      key: 'activity',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm">
            <Text className="text-gray-500">Tham gia: </Text>
            <Text className="font-medium">{formatDate(record.joinDate)}</Text>
          </div>
          <div className="text-sm">
            <Text className="text-gray-500">Cuối: </Text>
            <Text className="font-medium">{formatDate(record.lastLogin)}</Text>
          </div>
          {record.role === 'coach' && record.coachProfile && (
            <div className="text-sm">
              <Rate disabled value={record.coachProfile.rating} count={5} className="text-xs" />
              <Text className="text-xs ml-1">({record.coachProfile.totalSessions})</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
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
            <IntlMessages id="user.actions.export" />
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            <IntlMessages id="user.actions.add" />
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <UserOutlined className="text-3xl text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.total" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.active}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.active" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <ClockCircleOutlined className="text-3xl text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{stats.pendingApproval}</div>
              <Text className="text-gray-600">
                <IntlMessages id="user.stats.pending" />
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card className="text-center">
              <TeamOutlined className="text-3xl text-purple-500 mb-2" />
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
              <Option value="all">Tất cả vai trò</Option>
              <Option value="user">Học viên</Option>
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
              <Option value="active">Hoạt động</Option>
              <Option value="banned">Đã khóa</Option>
              <Option value="pending_coach_approval">Chờ duyệt</Option>
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
            
            <Button onClick={() => {
              setRoleFilter('all');
              setStatusFilter('all');
              setSkillFilter('all');
              setSearchText('');
              setCurrentPage(1);
            }}>
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
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title={<IntlMessages id="user.detail.title" />}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            setIsDetailModalVisible(false);
            if (selectedUser) handleEditUser(selectedUser);
          }}>
            Chỉnh sửa
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <Avatar 
                src={selectedUser.avatar}
                size={80}
                className="bg-blue-500"
              >
                {selectedUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex-1">
                <Title level={4}>{selectedUser.name}</Title>
                <Space>
                  <Tag color={getRoleColor(selectedUser.role)}>
                    {selectedUser.role === 'user' ? 'Học viên' : 
                     selectedUser.role === 'coach' ? 'Huấn luyện viên' : 'Quản trị viên'}
                  </Tag>
                  <Tag color={getStatusColor(selectedUser.status)}>
                    {selectedUser.status === 'active' ? 'Hoạt động' : 
                     selectedUser.status === 'banned' ? 'Đã khóa' : 'Chờ duyệt'}
                  </Tag>
                  {selectedUser.coachProfile?.isVerified && (
                    <Tag color="green">ĐÃ XÁC MINH</Tag>
                  )}
                </Space>
              </div>
            </div>

            <Descriptions column={2} bordered>
              <Descriptions.Item label="Email" span={1}>
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={1}>
                {selectedUser.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedUser.location}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia" span={1}>
                {formatDate(selectedUser.joinDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Lần cuối đăng nhập" span={1}>
                {formatDate(selectedUser.lastLogin)}
              </Descriptions.Item>
              {selectedUser.skillLevel && (
                <Descriptions.Item label="Trình độ" span={1}>
                  {selectedUser.skillLevel === 'beginner' ? 'Mới bắt đầu' :
                   selectedUser.skillLevel === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                </Descriptions.Item>
              )}
              {selectedUser.status === 'banned' && (
                <>
                  <Descriptions.Item label="Lý do khóa" span={1}>
                    {selectedUser.banReason}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian khóa" span={1}>
                    {selectedUser.bannedAt && formatDate(selectedUser.bannedAt)}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => editForm.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleSaveEdit}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Địa chỉ"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Vai trò"
          >
            <Select>
              <Option value="user">Học viên</Option>
              <Option value="coach">Huấn luyện viên</Option>
              <Option value="admin">Quản trị viên</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="banned">Đã khóa</Option>
              <Option value="pending_coach_approval">Chờ duyệt coach</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="skillLevel"
            label="Trình độ"
          >
            <Select>
              <Option value="beginner">Mới bắt đầu</Option>
              <Option value="intermediate">Trung bình</Option>
              <Option value="advanced">Nâng cao</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}