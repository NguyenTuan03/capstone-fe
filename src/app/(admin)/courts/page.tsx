'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Table, Button, Space, Input, Select, Typography, Row, Col } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { courtService, Court, CreateCourtBody } from '@/@crema/services/apis/courts';
import { useGetProvinces, useGetDistricts } from '@/@crema/services/apis/locations';
import { toast } from 'react-hot-toast';
import DetailModal from '@/modules/admin/courts/DetailModal';
import CreateDrawer from '@/modules/admin/courts/CreateDrawer';
import EditDrawer from '@/modules/admin/courts/EditDrawer';
import DeleteModal from '@/modules/admin/courts/DeleteModal';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CourtsPage() {
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });

  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedCourtForAction, setSelectedCourtForAction] = useState<Court | null>(null);
  const [searchText, setSearchText] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<number | undefined>(undefined);
  const [districtFilter, setDistrictFilter] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch provinces and districts for filter
  const { data: provincesData } = useGetProvinces();
  const provinces = useMemo(() => {
    if (Array.isArray(provincesData)) return provincesData;
    if (provincesData?.items) return provincesData.items;
    return [];
  }, [provincesData]);

  const { data: districtsData } = useGetDistricts(provinceFilter);
  const districts = useMemo(() => {
    if (Array.isArray(districtsData)) return districtsData;
    if (districtsData?.items) return districtsData.items;
    return [];
  }, [districtsData]);

  // Fetch courts
  const fetchCourts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: pageSize,
      };
      if (searchText) params.search = searchText;
      if (provinceFilter) params.provinceId = provinceFilter;
      if (districtFilter) params.districtId = districtFilter;

      const response = await courtService.getCourts(params);
      setCourts(response.items || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Error fetching courts:', error);
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách sân tập');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchText, provinceFilter, districtFilter]);

  useEffect(() => {
    if (isAuthorized) {
      fetchCourts();
    }
  }, [isAuthorized, fetchCourts]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Handle view details
  const handleViewDetails = (court: Court) => {
    setSelectedCourt(court);
    setIsDetailModalVisible(true);
  };

  // Handle create
  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateSubmit = async (values: CreateCourtBody) => {
    try {
      await courtService.createCourt(values);
      toast.success('Tạo sân tập thành công!');
      setIsCreateModalVisible(false);
      fetchCourts();
    } catch (error: any) {
      console.error('Error creating court:', error);
      toast.error(error?.response?.data?.message || 'Không thể tạo sân tập');
      throw error; // Re-throw để modal có thể xử lý
    }
  };

  // Handle edit
  const handleEdit = (court: Court) => {
    setSelectedCourtForAction(court);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: { phoneNumber?: string; pricePerHour: number }) => {
    if (!selectedCourtForAction) return;

    try {
      await courtService.updateCourt(selectedCourtForAction.id, {
        phoneNumber: values.phoneNumber,
        pricePerHour: values.pricePerHour,
      });
      toast.success('Cập nhật sân tập thành công!');
      setIsEditModalVisible(false);
      setSelectedCourtForAction(null);
      fetchCourts();
    } catch (error: any) {
      console.error('Error updating court:', error);
      toast.error(error?.response?.data?.message || 'Không thể cập nhật sân tập');
      throw error; // Re-throw để modal có thể xử lý
    }
  };

  // Handle delete
  const showDeleteConfirm = (court: Court) => {
    setSelectedCourtForAction(court);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedCourtForAction) return;

    try {
      await courtService.deleteCourt(selectedCourtForAction.id);
      toast.success('Xóa sân tập thành công!');
      setIsDeleteModalVisible(false);
      setSelectedCourtForAction(null);
      fetchCourts();
    } catch (error: any) {
      console.error('Error deleting court:', error);
      toast.error(error?.response?.data?.message || 'Không thể xóa sân tập');
    }
  };

  // Table columns
  const columns: ColumnsType<Court> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tên sân',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Giá/giờ',
      dataIndex: 'pricePerHour',
      key: 'pricePerHour',
      render: (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return `${numPrice.toLocaleString('vi-VN')} VNĐ`;
      },
      sorter: (a, b) => {
        const priceA =
          typeof a.pricePerHour === 'string' ? parseFloat(a.pricePerHour) : a.pricePerHour;
        const priceB =
          typeof b.pricePerHour === 'string' ? parseFloat(b.pricePerHour) : b.pricePerHour;
        return priceA - priceB;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Tỉnh/Thành',
      dataIndex: ['province', 'name'],
      key: 'province',
      render: (_, record) => record.province?.name || '-',
    },
    {
      title: 'Quận/Huyện',
      dataIndex: ['district', 'name'],
      key: 'district',
      render: (_, record) => record.district?.name || '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
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

  // Filtered courts
  const filteredCourts = useMemo(() => {
    return courts;
  }, [courts]);

  if (isChecking) return <div>Đang tải...</div>;
  if (!isAuthorized) return <div>Bạn không có quyền truy cập trang này</div>;

  return (
    <div>
      <Title level={2}>Quản lý Sân tập</Title>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên sân"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={provinceFilter}
              onChange={(value) => {
                setProvinceFilter(value);
                setDistrictFilter(undefined);
                setCurrentPage(1);
              }}
              style={{ width: '100%' }}
              placeholder="Tỉnh/Thành"
              allowClear
            >
              {provinces.map((province) => (
                <Option key={province.id} value={province.id}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={districtFilter}
              onChange={(value) => {
                setDistrictFilter(value);
                setCurrentPage(1);
              }}
              style={{ width: '100%' }}
              placeholder="Quận/Huyện"
              allowClear
              disabled={!provinceFilter}
            >
              {districts.map((district) => (
                <Option key={district.id} value={district.id}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ width: '100%' }}
            >
              Thêm sân tập
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredCourts}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sân tập`,
          }}
        />
      </Card>

      {/* Modals */}
      <DetailModal
        open={isDetailModalVisible}
        court={selectedCourt}
        onClose={() => setIsDetailModalVisible(false)}
      />

      <CreateDrawer
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateSubmit}
      />

      <EditDrawer
        open={isEditModalVisible}
        court={selectedCourtForAction}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedCourtForAction(null);
        }}
        onSubmit={handleEditSubmit}
      />

      <DeleteModal
        open={isDeleteModalVisible}
        court={selectedCourtForAction}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setSelectedCourtForAction(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
