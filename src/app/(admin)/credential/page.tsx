'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Space, Input, Typography, Row, Col, Tag, Image } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import {
  baseCredentialService,
  BaseCredential,
  CreateBaseCredentialDto,
  UpdateBaseCredentialDto,
} from '@/@crema/services/apis/base-credentials';
import { CourseCredentialType } from '@/types/enums';
import { toast } from 'react-hot-toast';
import DetailModal from '@/modules/admin/credentials/DetailModal';
import CreateDrawer from '@/modules/admin/credentials/CreateDrawer';
import EditDrawer from '@/modules/admin/credentials/EditDrawer';
import DeleteModal from '@/modules/admin/credentials/DeleteModal';

const { Title } = Typography;
const { Search } = Input;

const getTypeLabel = (type: CourseCredentialType): string => {
  const labels: Record<CourseCredentialType, string> = {
    CERTIFICATE: 'Chứng chỉ',
    LICENSE: 'Giấy phép',
    TRAINING: 'Đào tạo',
    ACHIEVEMENT: 'Thành tích',
    OTHER: 'Khác',
  };
  return labels[type] || type;
};

const getTypeColor = (type: CourseCredentialType): string => {
  const colors: Record<CourseCredentialType, string> = {
    CERTIFICATE: 'blue',
    LICENSE: 'green',
    TRAINING: 'orange',
    ACHIEVEMENT: 'purple',
    OTHER: 'default',
  };
  return colors[type] || 'default';
};

export default function CredentialPage() {
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });

  const [credentials, setCredentials] = useState<BaseCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<BaseCredential | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCredentialForAction, setSelectedCredentialForAction] =
    useState<BaseCredential | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch credentials
  const fetchCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: pageSize,
      };
      if (searchText) params.search = searchText;

      const response = await baseCredentialService.getBaseCredentials(params);
      setCredentials(response.items || []);
      setTotal(response.total || 0);
    } catch {
      toast.error('Không thể tải danh sách chứng chỉ');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText]);

  useEffect(() => {
    if (isAuthorized) {
      fetchCredentials();
    }
  }, [isAuthorized, fetchCredentials]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Handle view details
  const handleViewDetails = (credential: BaseCredential) => {
    setSelectedCredential(credential);
    setIsDetailModalVisible(true);
  };

  // Handle create
  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateSubmit = async (values: CreateBaseCredentialDto) => {
    try {
      await baseCredentialService.createBaseCredential(values);
      toast.success('Tạo chứng chỉ thành công!');
      setIsCreateModalVisible(false);
      fetchCredentials();
    } catch {
      toast.error('Không thể tạo chứng chỉ');
    }
  };

  // Handle edit
  const handleEdit = (credential: BaseCredential) => {
    setSelectedCredentialForAction(credential);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (id: number, values: UpdateBaseCredentialDto) => {
    try {
      await baseCredentialService.updateBaseCredential(id, values);
      toast.success('Cập nhật chứng chỉ thành công!');
      setIsEditModalVisible(false);
      setSelectedCredentialForAction(null);
      fetchCredentials();
    } catch {
      toast.error('Không thể cập nhật chứng chỉ');
    }
  };

  // Handle delete
  const showDeleteConfirm = (credential: BaseCredential) => {
    setSelectedCredentialForAction(credential);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedCredentialForAction) return;

    try {
      await baseCredentialService.deleteBaseCredential(selectedCredentialForAction.id);
      toast.success('Xóa chứng chỉ thành công!');
      setIsDeleteModalVisible(false);
      setSelectedCredentialForAction(null);
      fetchCredentials();
    } catch {
      toast.error('Không thể xóa chứng chỉ');
    }
  };

  // Table columns
  const columns: ColumnsType<BaseCredential> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tên chứng chỉ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: CourseCredentialType) => (
        <Tag color={getTypeColor(type)}>{getTypeLabel(type)}</Tag>
      ),
      filters: Object.values(CourseCredentialType).map((type) => ({
        text: getTypeLabel(type),
        value: type,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteConfirm(record)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  if (isChecking) return <div>Đang tải...</div>;
  if (!isAuthorized) return <div>Bạn không có quyền truy cập trang này</div>;

  return (
    <div>
      <Title level={2}>Quản lý Chứng chỉ</Title>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên chứng chỉ"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ width: '100%' }}
            >
              Thêm chứng chỉ
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={credentials}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chứng chỉ`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modals */}
      <DetailModal
        open={isDetailModalVisible}
        credential={selectedCredential}
        onClose={() => setIsDetailModalVisible(false)}
      />

      <CreateDrawer
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateSubmit}
      />

      <EditDrawer
        open={isEditModalVisible}
        credential={selectedCredentialForAction}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedCredentialForAction(null);
        }}
        onSubmit={handleEditSubmit}
      />

      <DeleteModal
        open={isDeleteModalVisible}
        credential={selectedCredentialForAction}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSelectedCredentialForAction(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
