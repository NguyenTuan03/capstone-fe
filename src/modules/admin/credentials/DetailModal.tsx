'use client';

import { Modal, Button, Descriptions, Image } from 'antd';
import { BaseCredential } from '@/@crema/services/apis/base-credentials';
import { CourseCredentialType } from '@/types/enums';

interface DetailModalProps {
  open: boolean;
  credential: BaseCredential | null;
  onClose: () => void;
}

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

export default function DetailModal({ open, credential, onClose }: DetailModalProps) {
  return (
    <Modal
      title="Chi tiết Chứng chỉ"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Đóng</Button>}
      width={700}
    >
      {credential && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{credential.id}</Descriptions.Item>
          <Descriptions.Item label="Tên chứng chỉ">{credential.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {credential.description || 'Chưa có mô tả'}
          </Descriptions.Item>
          <Descriptions.Item label="Loại">{getTypeLabel(credential.type)}</Descriptions.Item>
          {credential.publicUrl && (
            <Descriptions.Item label="Hình ảnh">
              <Image src={credential.publicUrl} alt={credential.name} width={200} />
            </Descriptions.Item>
          )}
          {credential.createdAt && (
            <Descriptions.Item label="Ngày tạo">
              {new Date(credential.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          )}
          {credential.updatedAt && (
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(credential.updatedAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
}
