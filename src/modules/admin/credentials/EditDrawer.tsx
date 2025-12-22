'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Image,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { BaseCredential, UpdateBaseCredentialDto } from '@/@crema/services/apis/base-credentials';
import { CourseCredentialType } from '@/types/enums';

const { TextArea } = Input;
const { Option } = Select;

interface EditDrawerProps {
  open: boolean;
  credential: BaseCredential | null;
  onCancel: () => void;
  onSubmit: (id: number, values: UpdateBaseCredentialDto) => Promise<void>;
}

const getTypeLabel = (type: CourseCredentialType): string => {
  const labels: Record<CourseCredentialType, string> = {
    CERTIFICATE: 'Chứng chỉ',
    LICENSE: 'Giấy phép',
    PRIZE: 'Giải thưởng',
    TRAINING: 'Đào tạo',
    ACHIEVEMENT: 'Thành tích',
    OTHER: 'Khác',
  };
  return labels[type] || type;
};

export default function EditDrawer({ open, credential, onCancel, onSubmit }: EditDrawerProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (credential && open) {
      form.setFieldsValue({
        name: credential.name,
        description: credential.description,
        type: credential.type,
      });
      // Set existing image if available
      if (credential.publicUrl) {
        setFileList([
          {
            uid: '-1',
            name: 'current-image',
            status: 'done',
            url: credential.publicUrl,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [credential, open, form]);

  const handleSubmit = async () => {
    if (!credential) return;

    try {
      const values = await form.validateFields();
      const formData: UpdateBaseCredentialDto = {
        name: values.name,
        description: values.description,
        type: values.type,
      };

      // Only include image if a new file was uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.base_credential_image = fileList[0].originFileObj;
      }

      setLoading(true);
      await onSubmit(credential.id, formData);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ chấp nhận file hình ảnh!');
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Hình ảnh phải nhỏ hơn 10MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleChange = (info: any) => {
    setFileList(info.fileList);
  };

  const handleRemove = () => {
    setFileList([]);
  };

  return (
    <Drawer
      title="Chỉnh sửa chứng chỉ"
      open={open}
      onClose={handleCancel}
      width={600}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Cập nhật
          </Button>
        </Space>
      }
    >
      {credential && (
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Tên chứng chỉ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên chứng chỉ' }]}
          >
            <Input placeholder="Nhập tên chứng chỉ" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} placeholder="Nhập mô tả (tùy chọn)" />
          </Form.Item>

          <Form.Item
            label="Loại chứng chỉ"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại chứng chỉ' }]}
          >
            <Select placeholder="Chọn loại chứng chỉ">
              {Object.values(CourseCredentialType).map((type) => (
                <Option key={type} value={type}>
                  {getTypeLabel(type)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Hình ảnh" name="image">
            {credential.publicUrl && fileList.length === 0 && (
              <div style={{ marginBottom: 16 }}>
                <Image src={credential.publicUrl} alt={credential.name} width={200} />
              </div>
            )}
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onRemove={handleRemove}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>
                {credential.publicUrl ? 'Thay đổi hình ảnh' : 'Chọn hình ảnh'}
              </Button>
            </Upload>
            <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Chỉ chấp nhận file hình ảnh, kích thước tối đa 10MB
            </Typography.Text>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
