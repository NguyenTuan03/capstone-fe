'use client';

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
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
import { EyeOutlined, DeleteOutlined, UnlockOutlined } from '@ant-design/icons';
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

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isRestoreModalVisible, setIsRestoreModalVisible] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [filterForm] = Form.useForm();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.id) {
        setCurrentUserId(Number(parsedUser.id));
      }
    } catch (error) {
      console.error('Failed to parse current user from storage:', error);
    }
  }, []);

  const frontendFilteredUsers = useMemo(() => {
    let result = allUsers;

    // 1. Loại ADMIN khác khỏi danh sách
    result = result.filter((user) => {
      if (user.role.name !== 'ADMIN') {
        return true;
      }
      if (currentUserId === null) {
        return false;
      }
      return user.id === currentUserId;
    });

    // 2. Tìm kiếm theo tên
    if (searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      result = result.filter((user) => (user.fullName || '').toLowerCase().includes(keyword));
    }

    // 3. Filter theo trạng thái
    if (statusFilter !== 'all') {
      const shouldActive = statusFilter === 'active';
      result = result.filter((user) => user.isActive === shouldActive);
    }

    // 4. Filter theo vai trò
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role.name === roleFilter);
    }

    // 5. Filter theo ngày tạo
    if (dateRange) {
      const [from, to] = dateRange;
      const fromTime = new Date(from).getTime();
      const toTime = new Date(to).getTime();
      result = result.filter((user) => {
        const createdTime = new Date(user.createdAt).getTime();
        if (Number.isNaN(createdTime)) return false;
        return createdTime >= fromTime && createdTime <= toTime;
      });
    }

    return result;
  }, [allUsers, currentUserId, searchText, statusFilter, roleFilter, dateRange]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return frontendFilteredUsers.slice(startIndex, startIndex + pageSize);
  }, [frontendFilteredUsers, currentPage, pageSize]);

  const totalUsers = frontendFilteredUsers.length;

  useEffect(() => {
    if (!totalUsers) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      return;
    }
    const maxPage = Math.ceil(totalUsers / pageSize) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [totalUsers, pageSize, currentPage]);

  // ✅ Load toàn bộ dữ liệu từ backend, không filter/pagination phía server
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const pageSizeFetch = 100;
      let page = 1;
      let aggregated: User[] = [];
      let total: number | null = null;
      let hasMore = true;

      while (hasMore) {
        const res = await userService.getAll({ page, size: pageSizeFetch });
        aggregated = [...aggregated, ...res.items];
        total = typeof res.total === 'number' ? res.total : null;

        if (total !== null) {
          hasMore = aggregated.length < total;
        } else {
          hasMore = res.items.length === pageSizeFetch;
        }

        page += 1;
      }

      setAllUsers(aggregated);
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, roleFilter, dateRange]);

  // ✅ Apply advanced filters
  const handleApplyAdvancedFilter = (values: FilterValues) => {
    const nextSearch = values.search || '';
    setSearchInput(nextSearch);
    setSearchText(nextSearch.trim());
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

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setSearchInput(nextValue);
    if (!nextValue.trim()) {
      setSearchText('');
    }
  };

  const handleSearch = (value?: string) => {
    const keyword = typeof value === 'string' ? value : searchInput;
    const normalizedKeyword = keyword.trim();

    if (!normalizedKeyword) {
      setSearchInput('');
      setSearchText('');
      return;
    }

    if (normalizedKeyword === searchText) {
      loadUsers();
      return;
    }

    setSearchInput(keyword);
    setSearchText(normalizedKeyword);
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

  // Hàm chuyển đổi vai trò sang tiếng Việt
  const getRoleName = (roleName: string): string => {
    switch (roleName) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'COACH':
        return 'Huấn luyện viên';
      case 'LEARNER':
        return 'Học viên';
      default:
        return roleName;
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
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => id.toString(),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => {
        const aName = a.fullName || '';
        const bName = b.fullName || '';
        return aName.localeCompare(bName);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => {
        const aEmail = a.email || '';
        const bEmail = b.email || '';
        return aEmail.localeCompare(bEmail);
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
      sortDirections: ['descend', 'ascend'],
      render: (isActive: boolean) =>
        isActive ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Đã xóa</Tag>,
    },
    {
      title: 'Vai trò',
      dataIndex: ['role', 'name'],
      key: 'role',
      sorter: (a, b) => {
        const aRoleName = a.role?.name || '';
        const bRoleName = b.role?.name || '';
        return aRoleName.localeCompare(bRoleName);
      },
      sortDirections: ['ascend', 'descend'],
      render: (roleName: string) => getRoleName(roleName),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      },
      sortDirections: ['descend', 'ascend'],
      render: (date: string) => (date ? new Date(date).toLocaleDateString('vi-VN') : '-'),
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
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm theo tên hoặc email"
              allowClear
              value={searchInput}
              onChange={handleSearchInputChange}
              onSearch={handleSearch}
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
          dataSource={paginatedUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalUsers,
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
