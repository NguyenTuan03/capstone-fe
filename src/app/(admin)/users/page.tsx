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
  Modal,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Form,
  DatePicker,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  UnlockOutlined,
  PlusOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { userService, CreateUserBody } from '@/@crema/services/apis/users';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profilePicture: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: { id: number; name: string };
}

// ✅ Interface cho filter form
interface FilterValues {
  search?: string;
  status?: string;
  role?: string;
  dateRange?: [any, any];
}

export default function UsersPage() {
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRestoreModalVisible, setIsRestoreModalVisible] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filterForm] = Form.useForm();

  // ✅ Build filter parameters cho API
  const buildFilterParams = useCallback((): any => {
    const params: any = {
      page: currentPage,
      size: pageSize,
    };

    // ✅ Tìm kiếm chung (search across multiple fields)
    if (searchText) {
      params.filter = `email_cont_${searchText},fullName_cont_${searchText}`;
    }

    // ✅ Filter theo status
    if (statusFilter !== 'all') {
      params.isActive = statusFilter === 'active';
    }

    // ✅ Filter theo role
    if (roleFilter !== 'all') {
      params.roleName = roleFilter;
    }

    // ✅ Filter theo date range
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      params.createdAtFrom = startDate;
      params.createdAtTo = endDate;
    }

    return params;
  }, [currentPage, pageSize, searchText, statusFilter, roleFilter, dateRange]);

  // ✅ Load users data từ API với filter
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildFilterParams();
      console.log('API Params:', params); // Debug params

      const res = await userService.getAll(params);
      setUsers(res.items);
      setTotal(res.total);
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [buildFilterParams]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ✅ Apply advanced filters
  const handleApplyAdvancedFilter = (values: FilterValues) => {
    setSearchText(values.search || '');
    setStatusFilter(values.status || 'all');
    setRoleFilter(values.role || 'all');

    if (values.dateRange) {
      const [start, end] = values.dateRange;
      setDateRange([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
    } else {
      setDateRange(null);
    }

    setCurrentPage(1);
    setShowAdvancedFilter(false);
  };

  // ✅ Xóa mềm user
  const handleDeleteUser = async () => {
    if (!selectedUserForAction) return;

    try {
      const msg = await userService.softDelete(selectedUserForAction.id);
      message.success(msg);
      setIsDeleteModalVisible(false);
      setSelectedUserForAction(null);
      loadUsers();
    } catch (err: any) {
      console.error('Delete error:', err);
      message.error(err.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  // ✅ Khôi phục user
  const handleRestoreUser = async () => {
    if (!selectedUserForAction) return;

    try {
      const msg = await userService.restore(selectedUserForAction.id);
      message.success(msg);
      setIsRestoreModalVisible(false);
      setSelectedUserForAction(null);
      loadUsers();
    } catch (err: any) {
      console.error('Restore error:', err);
      message.error(err.response?.data?.message || 'Không thể khôi phục người dùng');
    }
  };

  // ✅ Tạo user mới
  const handleCreateUser = async (values: any) => {
    setCreateLoading(true);
    try {
      const createData: CreateUserBody = {
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        role: {
          id: values.role,
          name: values.role === 1 ? 'ADMIN' : values.role === 2 ? 'COACH' : 'LEARNER',
        },
      };

      await userService.create(createData);
      message.success('Tạo người dùng thành công');
      setIsCreateModalVisible(false);
      filterForm.resetFields();
      loadUsers();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Không thể tạo người dùng');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  const showDeleteConfirm = (user: User) => {
    setSelectedUserForAction(user);
    setIsDeleteModalVisible(true);
  };

  const showRestoreConfirm = (user: User) => {
    setSelectedUserForAction(user);
    setIsRestoreModalVisible(true);
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) =>
        isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Đã xóa</Tag>,
    },
    {
      title: 'Vai trò',
      dataIndex: ['role', 'name'],
      key: 'role',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            title="Xem chi tiết"
          />
          {record.isActive ? (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => showDeleteConfirm(record)}
              title="Xóa người dùng"
            />
          ) : (
            <Button
              type="text"
              icon={<UnlockOutlined />}
              onClick={() => showRestoreConfirm(record)}
              title="Khôi phục người dùng"
            />
          )}
        </Space>
      ),
    },
  ];

  if (isChecking) return <div>Đang tải...</div>;
  if (!isAuthorized) return <div>Bạn không có quyền truy cập trang này</div>;

  return (
    <div>
      <Title level={2}>Quản lý người dùng</Title>
      <Card>
        {/* ✅ Simple Search & Filter */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm theo tên hoặc email"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => loadUsers()}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Đã xóa</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%' }}
              placeholder="Vai trò"
            >
              <Option value="all">Tất cả vai trò</Option>
              <Option value="ADMIN">ADMIN</Option>
              <Option value="COACH">COACH</Option>
              <Option value="LEARNER">LEARNER</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              >
                Lọc nâng cao
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
              >
                Tạo tài khoản
              </Button>
            </Space>
          </Col>
        </Row>

        {/* ✅ Advanced Filter Form */}
        {showAdvancedFilter && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Form form={filterForm} layout="vertical" onFinish={handleApplyAdvancedFilter}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Tìm kiếm" name="search">
                    <Input placeholder="Tên hoặc email" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Trạng thái" name="status">
                    <Select placeholder="Chọn trạng thái">
                      <Option value="all">Tất cả</Option>
                      <Option value="active">Hoạt động</Option>
                      <Option value="inactive">Đã xóa</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Vai trò" name="role">
                    <Select placeholder="Chọn vai trò">
                      <Option value="all">Tất cả</Option>
                      <Option value="ADMIN">ADMIN</Option>
                      <Option value="COACH">COACH</Option>
                      <Option value="LEARNER">LEARNER</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Ngày tạo" name="dateRange">
                    <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Áp dụng
                    </Button>
                    <Button onClick={() => setShowAdvancedFilter(false)}>Hủy</Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
        )}

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>

      {/* Các modal khác giữ nguyên... */}
      <Modal
        title="Chi tiết người dùng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={<Button onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>}
        width={600}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{selectedUser.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedUser.phoneNumber || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">{selectedUser.role.name}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {selectedUser.isActive ? 'Hoạt động' : 'Đã xóa'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa người dùng"
        open={isDeleteModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSelectedUserForAction(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
      >
        {selectedUserForAction && (
          <p>
            Bạn có chắc chắn muốn xóa người dùng{' '}
            <strong>&quot;{selectedUserForAction.fullName}&quot;</strong> không?
          </p>
        )}
      </Modal>

      <Modal
        title="Khôi phục người dùng"
        open={isRestoreModalVisible}
        onOk={handleRestoreUser}
        onCancel={() => {
          setIsRestoreModalVisible(false);
          setSelectedUserForAction(null);
        }}
        okText="Khôi phục"
        cancelText="Hủy"
      >
        {selectedUserForAction && (
          <p>
            Bạn có chắc muốn khôi phục người dùng{' '}
            <strong>&quot;{selectedUserForAction.fullName}&quot;</strong> không?
          </p>
        )}
      </Modal>

      {/* Modal tạo user mới - giữ nguyên */}
      <Modal
        title="Tạo tài khoản mới"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          filterForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={filterForm} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value={1}>ADMIN</Option>
              <Option value={2}>COACH</Option>
              <Option value={3}>LEARNER</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsCreateModalVisible(false);
                  filterForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={createLoading}>
                Tạo tài khoản
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
