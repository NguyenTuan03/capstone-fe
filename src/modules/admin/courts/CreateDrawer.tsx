'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  Select,
  Space,
  Typography,
  Spin,
  Button,
  Row,
  Col,
  Drawer,
  Input,
  InputNumber,
  Form,
} from 'antd';
import { EnvironmentOutlined, PhoneOutlined, DollarOutlined } from '@ant-design/icons';
import { useGetProvinces, useGetDistricts } from '@/@crema/services/apis/locations';
import {
  courtService,
  type Court as ApiCourt,
  type CreateCourtBody,
} from '@/@crema/services/apis/courts';
import { toast } from 'react-hot-toast';

const { Text, Title } = Typography;

interface Court {
  id: string;
  name: string;
  address: string;
  provinceId: number;
  districtId?: number;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  pricePerHour?: number;
  publicUrl?: string;
  provinceName?: string;
  districtName?: string;
  isActive?: boolean;
}

// Dynamic import MapComponent để tránh SSR issues
const MapComponent = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Spin size="large" tip="Đang tải bản đồ..." />
    </div>
  ),
});

interface CreateDrawerProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateCourtBody) => Promise<void>;
}

export default function CreateDrawer({ open, onCancel, onSubmit }: CreateDrawerProps) {
  const [form] = Form.useForm();
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [pricePerHour, setPricePerHour] = useState<number | undefined>(undefined);

  const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(undefined);

  // Fetch provinces and districts
  const { data: provincesData } = useGetProvinces();
  const provinces = useMemo(() => {
    if (Array.isArray(provincesData)) return provincesData;
    if (provincesData?.items) return provincesData.items;
    return [];
  }, [provincesData]);

  const { data: districtsData } = useGetDistricts(selectedProvinceId);
  const districts = useMemo(() => {
    if (Array.isArray(districtsData)) return districtsData;
    if (districtsData?.items) return districtsData.items;
    return [];
  }, [districtsData]);

  // Fetch all courts
  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const res = await courtService.getAllCourts(1, 100);
        if (!res) {
          setCourts([]);
          return;
        }

        const items: ApiCourt[] = res.items || [];

        const mapped: Court[] = items
          .map((c) => {
            // Skip if province is null (required field)
            if (!c.province) return null;

            const lat =
              typeof c.latitude === 'string'
                ? parseFloat(c.latitude)
                : (c.latitude as number | null | undefined);
            const lng =
              typeof c.longitude === 'string'
                ? parseFloat(c.longitude)
                : (c.longitude as number | null | undefined);

            if (!lat || !lng) return null;

            const price =
              typeof c.pricePerHour === 'string'
                ? parseFloat(c.pricePerHour)
                : (c.pricePerHour as number);

            const mappedCourt: Court = {
              id: String(c.id),
              name: c.name,
              address: c.address,
              provinceId: c.province.id,
              districtId: c.district?.id ?? undefined,
              latitude: lat,
              longitude: lng,
              phoneNumber: c.phoneNumber ?? undefined,
              pricePerHour: price,
              publicUrl: c.publicUrl ?? undefined,
              provinceName: c.province.name,
              districtName: c.district?.name ?? undefined,
              isActive: c.isActive ?? false,
            };

            return mappedCourt;
          })
          .filter((c): c is Court => c !== null);

        setCourts(mapped);
      } catch (error) {
        console.error('Error fetching courts:', error);
        toast.error('Không thể tải danh sách sân tập');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchCourts();
    }
  }, [open]);

  // Filter courts when province/district changes
  const filteredCourts = useMemo(() => {
    let filtered = courts;

    if (selectedProvinceId) {
      filtered = filtered.filter((court) => court.provinceId === selectedProvinceId);
    }

    if (selectedDistrictId) {
      filtered = filtered.filter((court) => court.districtId === selectedDistrictId);
    }

    return filtered;
  }, [courts, selectedProvinceId, selectedDistrictId]);

  const handleProvinceChange = (value: number | undefined) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId(undefined);
    setSelectedCourtId(null);
  };

  const handleDistrictChange = (value: number | undefined) => {
    setSelectedDistrictId(value);
    setSelectedCourtId(null);
  };

  const handleReset = () => {
    setSelectedProvinceId(undefined);
    setSelectedDistrictId(undefined);
    setSelectedCourtId(null);
  };

  const selectedCourt = courts.find((c) => c.id === selectedCourtId);

  // Reset form when court is selected (don't change filter)
  useEffect(() => {
    if (selectedCourtId && selectedCourt) {
      // Don't update province/district filter when selecting a court
      // This allows other markers to remain visible on the map
      form.setFieldsValue({
        phoneNumber: '',
        pricePerHour: undefined,
      });
      setPhoneNumber('');
      setPricePerHour(undefined);
    }
  }, [selectedCourtId, selectedCourt, form]);

  // Reset when drawer closes
  useEffect(() => {
    if (!open) {
      setSelectedCourtId(null);
      setSelectedProvinceId(undefined);
      setSelectedDistrictId(undefined);
      setPhoneNumber('');
      setPricePerHour(undefined);
      form.resetFields();
    }
  }, [open, form]);

  const handleCreate = async () => {
    if (!selectedCourt) {
      toast.error('Vui lòng chọn một sân trên bản đồ');
      return;
    }
    if (!phoneNumber || !pricePerHour) {
      toast.error('Vui lòng nhập số điện thoại và giá thuê');
      return;
    }

    // API tìm sân theo name + provinceId + districtId và update
    // Các field address, latitude, longitude, publicUrl giữ nguyên từ sân đã chọn
    // Sử dụng provinceId và districtId từ sân đã chọn
    const payload: CreateCourtBody = {
      name: selectedCourt.name,
      phoneNumber: phoneNumber || undefined,
      pricePerHour: pricePerHour,
      publicUrl: selectedCourt.publicUrl,
      address: selectedCourt.address,
      latitude: selectedCourt.latitude,
      longitude: selectedCourt.longitude,
      provinceId: selectedCourt.provinceId,
      districtId: selectedCourt.districtId,
      isActive: true, // Set active khi tạo/update
    };

    try {
      await onSubmit(payload);
      onCancel();
    } catch {
      // Error handling is done in parent component
    }
  };

  return (
    <Drawer
      title="Chọn sân tập trên bản đồ"
      open={open}
      onClose={onCancel}
      width={1200}
      placement="right"
      destroyOnClose
      styles={{
        body: {
          padding: 0,
          height: '100%',
          overflow: 'hidden',
        },
      }}
    >
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        {/* Header & Filter Section */}
        <Card
          className="m-4 mb-2 shadow-xl rounded-2xl border-0 flex-shrink-0"
          styles={{
            body: {
              padding: 24,
              overflow: 'visible',
            },
          }}
        >
          <Space direction="vertical" className="w-full" size="large">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <EnvironmentOutlined className="text-2xl text-white" />
              </div>
              <div>
                <Title
                  level={3}
                  className="m-0 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                >
                  Bản Đồ Sân Pickleball
                </Title>
                <Text type="secondary">Khám phá tất cả các sân pickleball trên toàn quốc</Text>
              </div>
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8} lg={6}>
                <Text strong className="block mb-2">
                  Tỉnh/Thành phố
                </Text>
                <Select
                  showSearch
                  placeholder="Tất cả tỉnh/thành"
                  className="w-full"
                  size="large"
                  value={selectedProvinceId}
                  onChange={handleProvinceChange}
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={provinces.map((province) => ({
                    label: province.name,
                    value: province.id,
                  }))}
                  popupMatchSelectWidth={false}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Col>

              <Col xs={24} sm={24} md={8} lg={6}>
                <Text strong className="block mb-2">
                  Quận/Huyện
                </Text>
                <Select
                  showSearch
                  placeholder="Tất cả quận/huyện"
                  className="w-full"
                  size="large"
                  value={selectedDistrictId}
                  onChange={handleDistrictChange}
                  disabled={!selectedProvinceId}
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={districts.map((district) => ({
                    label: district.name,
                    value: district.id,
                  }))}
                  popupMatchSelectWidth={false}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              </Col>

              <Col xs={24} sm={24} md={8} lg={4}>
                <Text strong className="block mb-2" style={{ opacity: 0 }}>
                  .
                </Text>
                <Button size="large" onClick={handleReset} block className="h-10">
                  Đặt lại bộ lọc
                </Button>
              </Col>

              <Col xs={24}>
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <EnvironmentOutlined className="text-green-600 text-lg" />
                  <Text>
                    Hiển thị{' '}
                    <Text strong className="text-green-600 text-lg">
                      {filteredCourts.length}
                    </Text>{' '}
                    sân pickleball
                    {selectedProvinceId && <Text type="secondary"> trong khu vực đã chọn</Text>}
                  </Text>
                </div>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* Map Section */}
        <div className="flex-1 m-4 mt-0 min-h-0 overflow-hidden">
          <Row gutter={16} style={{ height: '100%' }}>
            {/* Map */}
            <Col xs={24} lg={selectedCourt ? 16 : 24} style={{ height: '100%', minHeight: 0 }}>
              <Card
                className="shadow-2xl rounded-2xl border-0"
                bodyStyle={{ padding: 0, height: '100%', borderRadius: '1rem', overflow: 'hidden' }}
                style={{ height: '100%' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                  </div>
                ) : (
                  <MapComponent
                    courts={courts as any}
                    filteredCourtIds={
                      selectedProvinceId || selectedDistrictId
                        ? filteredCourts.map((c) => c.id)
                        : undefined
                    }
                    selectedCourtId={selectedCourtId}
                    onMarkerClick={setSelectedCourtId}
                  />
                )}
              </Card>
            </Col>

            {/* Court Details */}
            {selectedCourt && (
              <Col xs={24} lg={8} style={{ height: '100%', minHeight: 0 }}>
                <Card
                  className="shadow-2xl rounded-2xl border-0"
                  title={
                    <Space>
                      <EnvironmentOutlined className="text-green-600" />
                      <span>Thông tin sân</span>
                    </Space>
                  }
                  extra={
                    <Button type="text" onClick={() => setSelectedCourtId(null)}>
                      ✕
                    </Button>
                  }
                  style={{ height: '100%', overflow: 'auto' }}
                >
                  <Form form={form} layout="vertical">
                    <Space direction="vertical" size="large" className="w-full">
                      {/* Thông tin cơ bản */}
                      <Space direction="vertical" size="middle" className="w-full">
                        <div>
                          <Text strong className="block mb-1">
                            Tên sân
                          </Text>
                          <Text className="text-gray-600">{selectedCourt.name}</Text>
                        </div>

                        <div className="flex items-start gap-3">
                          <EnvironmentOutlined className="text-gray-500 text-lg mt-1" />
                          <div className="flex-1">
                            <Text strong className="block mb-1">
                              Địa chỉ
                            </Text>
                            <Text className="text-gray-600">{selectedCourt.address}</Text>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <EnvironmentOutlined className="text-gray-500 text-lg mt-1" />
                          <div className="flex-1">
                            <Text strong className="block mb-1">
                              Tỉnh/Thành
                            </Text>
                            <Text className="text-gray-600">{selectedCourt.provinceName}</Text>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <EnvironmentOutlined className="text-gray-500 text-lg mt-1" />
                          <div className="flex-1">
                            <Text strong className="block mb-1">
                              Quận/Huyện
                            </Text>
                            <Text className="text-gray-600">{selectedCourt.districtName}</Text>
                          </div>
                        </div>
                      </Space>

                      {/* Nếu isActive = true: hiển thị đầy đủ thông tin */}
                      {selectedCourt.isActive ? (
                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                          <Title level={5} className="mb-4">
                            Thông tin sân
                          </Title>
                          {selectedCourt.phoneNumber && (
                            <div className="flex items-start gap-3 mb-3">
                              <PhoneOutlined className="text-gray-500 text-lg mt-1" />
                              <div className="flex-1">
                                <Text strong className="block mb-1">
                                  Số điện thoại
                                </Text>
                                <Text className="text-gray-600">{selectedCourt.phoneNumber}</Text>
                              </div>
                            </div>
                          )}
                          {selectedCourt.pricePerHour && (
                            <div className="flex items-start gap-3">
                              <DollarOutlined className="text-gray-500 text-lg mt-1" />
                              <div className="flex-1">
                                <Text strong className="block mb-1">
                                  Giá mỗi giờ
                                </Text>
                                <Text className="text-green-600 font-semibold text-lg">
                                  {selectedCourt.pricePerHour.toLocaleString('vi-VN')}đ/giờ
                                </Text>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Nếu isActive = false: cho nhập số điện thoại và giá */
                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                          <Title level={5} className="mb-4">
                            Thông tin cần nhập
                          </Title>

                          <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                              { required: true, message: 'Vui lòng nhập số điện thoại' },
                              {
                                pattern: /^(\+84|0)[0-9]{9,10}$/,
                                message: 'Số điện thoại không hợp lệ (định dạng VN)',
                              },
                            ]}
                          >
                            <Input
                              placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
                              prefix={<PhoneOutlined />}
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Giá mỗi giờ (VNĐ)"
                            name="pricePerHour"
                            rules={[
                              { required: true, message: 'Vui lòng nhập giá mỗi giờ' },
                              { type: 'number', min: 1, message: 'Giá phải lớn hơn hoặc bằng 1' },
                            ]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder="Nhập giá mỗi giờ"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              }
                              min={1}
                              prefix={<DollarOutlined />}
                              value={pricePerHour}
                              onChange={(value) => setPricePerHour(value || undefined)}
                            />
                          </Form.Item>
                        </div>
                      )}
                    </Space>
                  </Form>
                </Card>
              </Col>
            )}
          </Row>
        </div>

        <div className="m-4 flex justify-end gap-8">
          <div className="text-gray-500 text-sm">
            {selectedCourt
              ? 'Chọn sân trên bản đồ, nhập số điện thoại và giá thuê rồi nhấn Tạo sân.'
              : 'Chọn sân trên bản đồ rồi nhập thông tin để tạo mới.'}
          </div>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              disabled={!selectedCourt || !phoneNumber || !pricePerHour}
              onClick={handleCreate}
            >
              Kích hoạt sân
            </Button>
          </Space>
        </div>
      </div>
    </Drawer>
  );
}
