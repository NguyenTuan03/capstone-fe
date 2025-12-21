'use client';

import { Modal, Button, Input } from 'antd';
import type { CourseRequestData } from '../../../types/curriculum';

const { TextArea } = Input;

interface RejectModalProps {
  open: boolean;
  course: CourseRequestData | null;
  rejectReason: string;
  loading?: boolean;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RejectModal({
  open,
  course,
  rejectReason,
  loading = false,
  onReasonChange,
  onConfirm,
  onCancel,
}: RejectModalProps) {
  return (
    <Modal
      title="Từ chối khóa học"
      open={open}
      zIndex={2000}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="confirm" type="primary" danger loading={loading} onClick={onConfirm}>
          Xác nhận từ chối
        </Button>,
      ]}
    >
      <div className="space-y-4 mb-[24px]">
        <p>
          Bạn có chắc chắn muốn từ chối khóa học <strong>&ldquo;{course?.courseName}&rdquo;</strong>
          ?
        </p>
        <div>
          <label className="block text-sm font-medium mb-2">
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <TextArea
            className="mb-2"
            value={rejectReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Nhập lý do từ chối khóa học..."
            rows={4}
            maxLength={500}
            showCount
          />
        </div>
      </div>
    </Modal>
  );
}
