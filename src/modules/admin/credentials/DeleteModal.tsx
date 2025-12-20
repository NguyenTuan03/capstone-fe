'use client';

import { Modal } from 'antd';
import { BaseCredential } from '@/@crema/services/apis/base-credentials';

interface DeleteModalProps {
  open: boolean;
  credential: BaseCredential | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ open, credential, onCancel, onConfirm }: DeleteModalProps) {
  return (
    <Modal
      title="Xác nhận xóa chứng chỉ"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>
        Bạn có chắc chắn muốn xóa chứng chỉ &quot;{credential?.name}&quot; không? Hành động này
        không thể hoàn tác.
      </p>
    </Modal>
  );
}
