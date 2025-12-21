'use client';

import { Modal } from 'antd';
import { Court } from '@/@crema/services/apis/courts';

interface DeleteModalProps {
  open: boolean;
  court: Court | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteModal({ open, court, onCancel, onConfirm }: DeleteModalProps) {
  return (
    <Modal
      title="Xác nhận đóng sân tập"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Đóng sân"
      cancelText="Đóng"
      okType="danger"
    >
      {court && (
        <p>
          Bạn có chắc chắn muốn hủy sân tập <strong>&quot;{court.name}&quot;</strong> không?
        </p>
      )}
    </Modal>
  );
}
