'use client';

import { Modal, Button, Descriptions } from 'antd';
import { Court } from '@/@crema/services/apis/courts';

interface DetailModalProps {
  open: boolean;
  court: Court | null;
  onClose: () => void;
}

export default function DetailModal({ open, court, onClose }: DetailModalProps) {
  return (
    <Modal
      title="Chi tiết Sân tập"
      open={open}
      onCancel={onClose}
      footer={<Button onClick={onClose}>Đóng</Button>}
      width={700}
    >
      {court && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{court.id}</Descriptions.Item>
          <Descriptions.Item label="Tên sân">{court.name}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {court.phoneNumber || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Giá mỗi giờ">
            {typeof court.pricePerHour === 'string'
              ? parseFloat(court.pricePerHour).toLocaleString('vi-VN')
              : court.pricePerHour.toLocaleString('vi-VN')}{' '}
            VNĐ
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{court.address}</Descriptions.Item>
          <Descriptions.Item label="Tỉnh/Thành">{court.province?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Quận/Huyện">{court.district?.name || '-'}</Descriptions.Item>
          {court.latitude && court.longitude && (
            <>
              <Descriptions.Item label="Vĩ độ">{court.latitude}</Descriptions.Item>
              <Descriptions.Item label="Kinh độ">{court.longitude}</Descriptions.Item>
            </>
          )}
          {court.publicUrl && (
            <Descriptions.Item label="Hình ảnh">
              <a href={court.publicUrl} target="_blank" rel="noopener noreferrer">
                {court.publicUrl}
              </a>
            </Descriptions.Item>
          )}
          {court.createdAt && (
            <Descriptions.Item label="Ngày tạo">
              {new Date(court.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Modal>
  );
}
