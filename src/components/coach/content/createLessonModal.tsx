import { Modal } from 'antd';
import LessonForm from './LessonForm';

interface LessonFormData {
  subjectId: string | number;
  name: string;
  description?: string;
  duration?: number;
}

interface LessonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormData) => Promise<void>;
  initialValues?: LessonFormData;
  loading?: boolean;
}

export default function LessonModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  loading = false,
}: LessonModalProps) {
  const handleSubmit = async (values: LessonFormData) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold">
          {initialValues ? '✏️ Sửa bài học' : '➕ Tạo bài học mới'}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <div className="mt-6">
        <LessonForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
