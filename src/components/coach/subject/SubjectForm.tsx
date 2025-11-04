'use client';
import { Form, Input, Select, Button, App } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Enums
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

interface SubjectFormProps {
  initialValues?: SubjectFormData;
  onSubmit: (values: SubjectFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function SubjectForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: SubjectFormProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const handleSubmit = async (values: SubjectFormData) => {
    try {
      const payload = {
        ...values,
        // transform to backend enum format
        level: (values.level as unknown as string).toUpperCase() as unknown as PickleballLevel,
        status: (
          (values.status ?? initialValues?.status ?? SubjectStatus.DRAFT) as unknown as string
        ).toUpperCase() as unknown as SubjectStatus,
      };
      await onSubmit(payload);
      message.success('Tạo môn học thành công!');
      form.resetFields();
    } catch (error: any) {
      const errMsg = error?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      message.error(errMsg);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || { status: SubjectStatus.DRAFT }}
      onFinish={handleSubmit}
      className="max-w-2xl"
    >
      {/* Tên môn học */}
      <Form.Item
        label="Tên môn học"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên môn học' },
          { max: 100, message: 'Tên môn học không được quá 100 ký tự' },
        ]}
      >
        <Input placeholder="VD: Cơ bản môn Pickleball" size="large" showCount maxLength={100} />
      </Form.Item>

      {/* Mô tả */}
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ max: 500, message: 'Mô tả không được quá 500 ký tự' }]}
      >
        <TextArea placeholder="Nhập mô tả về môn học..." rows={4} showCount maxLength={500} />
      </Form.Item>

      {/* Level */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trình độ */}
        <Form.Item
          label="Trình độ"
          name="level"
          rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
        >
          <Select
            size="large"
            placeholder="Chọn trình độ"
            options={[
              {
                value: PickleballLevel.BEGINNER,
                label: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Beginner - Cơ bản</span>
                  </div>
                ),
              },
              {
                value: PickleballLevel.INTERMEDIATE,
                label: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Intermediate - Trung cấp</span>
                  </div>
                ),
              },
              {
                value: PickleballLevel.ADVANCED,
                label: (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Advanced - Nâng cao</span>
                  </div>
                ),
              },
            ]}
          />
        </Form.Item>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
        {onCancel && (
          <Button size="large" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          icon={<SaveOutlined />}
          loading={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 border-0"
        >
          {initialValues ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </Form>
  );
}
