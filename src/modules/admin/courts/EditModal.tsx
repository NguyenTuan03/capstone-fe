'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Button, Space } from 'antd';
import { Court, CreateCourtBody } from '@/@crema/services/apis/courts';
import { useGetProvinces, useGetDistricts } from '@/@crema/services/apis/locations';

const { Option } = Select;

interface EditModalProps {
  open: boolean;
  court: Court | null;
  onCancel: () => void;
  onSubmit: (values: CreateCourtBody) => Promise<void>;
}

export default function EditModal({ open, court, onCancel, onSubmit }: EditModalProps) {
  const [form] = Form.useForm();
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);

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

  useEffect(() => {
    if (court && open) {
      form.setFieldsValue({
        name: court.name,
        phoneNumber: court.phoneNumber,
        pricePerHour:
          typeof court.pricePerHour === 'string'
            ? parseFloat(court.pricePerHour)
            : court.pricePerHour,
        publicUrl: court.publicUrl,
        address: court.address,
        latitude: typeof court.latitude === 'string' ? parseFloat(court.latitude) : court.latitude,
        longitude:
          typeof court.longitude === 'string' ? parseFloat(court.longitude) : court.longitude,
        provinceId: court.province.id,
        districtId: court.district.id,
      });
      setSelectedProvinceId(court.province.id);
    }
  }, [court, open, form]);

  const handleSubmit = async (values: CreateCourtBody) => {
    await onSubmit(values);
    form.resetFields();
    setSelectedProvinceId(undefined);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedProvinceId(undefined);
    onCancel();
  };

  return (
    <Modal title="Chỉnh sửa Sân tập" open={open} onCancel={handleCancel} footer={null} width={600}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên sân"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sân' },
            { max: 100, message: 'Tên sân không được vượt quá 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên sân" />
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

        <Form.Item label="URL hình ảnh" name="publicUrl">
          <Input placeholder="Nhập URL hình ảnh" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Vĩ độ" name="latitude">
              <InputNumber style={{ width: '100%' }} placeholder="Nhập vĩ độ" step={0.000001} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kinh độ" name="longitude">
              <InputNumber style={{ width: '100%' }} placeholder="Nhập kinh độ" step={0.000001} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tỉnh/Thành"
          name="provinceId"
          rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành' }]}
        >
          <Select
            placeholder="Chọn tỉnh/thành"
            onChange={(value) => {
              setSelectedProvinceId(value);
              form.setFieldValue('districtId', undefined);
            }}
          >
            {provinces.map((province) => (
              <Option key={province.id} value={province.id}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Quận/Huyện"
          name="districtId"
          rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
        >
          <Select placeholder="Chọn quận/huyện" disabled={!selectedProvinceId}>
            {districts.map((district) => (
              <Option key={district.id} value={district.id}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
