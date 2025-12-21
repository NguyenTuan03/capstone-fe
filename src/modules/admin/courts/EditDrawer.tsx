'use client';

import { useEffect, useMemo } from 'react';
import { Drawer, Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { Court } from '@/@crema/services/apis/courts';
import { useGetProvinces, useGetDistricts } from '@/@crema/services/apis/locations';

const { Option } = Select;

interface EditDrawerProps {
  open: boolean;
  court: Court | null;
  onCancel: () => void;
  onSubmit: (values: { phoneNumber?: string; pricePerHour: number }) => Promise<void>;
}

export default function EditDrawer({ open, court, onCancel, onSubmit }: EditDrawerProps) {
  const [form] = Form.useForm();

  // Fetch provinces and districts
  const { data: provincesData } = useGetProvinces();
  const provinces = useMemo(() => {
    if (Array.isArray(provincesData)) return provincesData;
    if (provincesData?.items) return provincesData.items;
    return [];
  }, [provincesData]);

  const { data: districtsData } = useGetDistricts(court?.province.id);
  const districts = useMemo(() => {
    if (Array.isArray(districtsData)) return districtsData;
    if (districtsData?.items) return districtsData.items;
    return [];
  }, [districtsData]);

  useEffect(() => {
    if (court && open) {
      const lat = typeof court.latitude === 'string' ? parseFloat(court.latitude) : court.latitude;
      const lng =
        typeof court.longitude === 'string' ? parseFloat(court.longitude) : court.longitude;

      form.setFieldsValue({
        name: court.name,
        phoneNumber: court.phoneNumber,
        pricePerHour:
          typeof court.pricePerHour === 'string'
            ? parseFloat(court.pricePerHour)
            : court.pricePerHour,
        publicUrl: court.publicUrl,
        address: court.address,
        latitude: lat,
        longitude: lng,
        provinceId: court.province.id,
        districtId: court.district.id,
      });
    }
  }, [court, open, form]);

  const handleSubmit = async (values: { phoneNumber?: string; pricePerHour: number }) => {
    await onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Drawer
      title="Chỉnh sửa Sân tập"
      open={open}
      onClose={handleCancel}
      width={600}
      placement="right"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên sân" name="name">
          <Input placeholder="Tên sân" disabled />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            {
              pattern: /^(\+84|0)[0-9]{9,10}$/,
              message: 'Số điện thoại không hợp lệ (định dạng VN)',
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại (ví dụ: 0912345678)" />
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
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={1}
          />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea rows={2} placeholder="Địa chỉ" disabled />
        </Form.Item>

        <Form.Item label="Tỉnh/Thành" name="provinceId" rules={[]}>
          <Select placeholder="Chọn tỉnh/thành" disabled>
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Quận/Huyện" name="districtId" rules={[]}>
          <Select placeholder="Chọn quận/huyện" disabled>
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
