'use client';
import { Modal } from 'antd';
import SubjectForm from './SubjectForm';

enum PickleballLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

enum SubjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

interface SubjectFormData {
  name: string;
  description?: string;
  level: PickleballLevel;
  status?: SubjectStatus;
}

interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SubjectFormData) => Promise<void>;
  initialValues?: SubjectFormData;
  loading?: boolean;
}

export default function SubjectModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}: SubjectModalProps) {
  const handleSubmit = async (values: SubjectFormData) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold">
          {initialValues ? '✏️ Sửa môn học' : '➕ Tạo môn học mới'}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <div className="mt-6">
        <SubjectForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
