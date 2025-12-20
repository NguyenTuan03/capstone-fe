'use client';

import { Modal, Button } from 'antd';
import type { CourseRequestData } from '../../../types/curriculum';

interface ApproveModalProps {
  open: boolean;
  course: CourseRequestData | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApproveModal({
  open,
  course,
  loading = false,
  onConfirm,
  onCancel,
}: ApproveModalProps) {
  return (
    <Modal
      title="Xác nhận phê duyệt"
      open={open}
      zIndex={2000}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="approve" type="primary" loading={loading} onClick={onConfirm}>
          Xác nhận phê duyệt
        </Button>,
      ]}
    >
      <p>
        Bạn có chắc chắn muốn phê duyệt khóa học <strong>&ldquo;{course?.courseName}&rdquo;</strong>
        ?
      </p>
    </Modal>
  );
}
