import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import { SaveOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useGetSubjects } from '@/@crema/services/apis/subjects';
import { useEffect } from 'react';

const { TextArea } = Input;

interface LessonFormData {
  subjectId: string | number;
  name: string;
  description?: string;
  duration?: number;
}

interface LessonFormProps {
  initialValues?: LessonFormData;
  onSubmit: (values: LessonFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export default function LessonForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: LessonFormProps) {
  const [form] = Form.useForm();
  const { data: subjectsRes, isLoading: isLoadingSubjects } = useGetSubjects({
    page: 1,
    size: 100,
  });
  const subjects = (subjectsRes?.items as any[]) || [];

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: LessonFormData) => {
    try {
      await onSubmit(values);
      message.success('Lưu bài học thành công!');
      form.resetFields();
    } catch {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      className="max-w-2xl"
    >
      {/* Chọn môn học */}
      <Form.Item
        label="Môn học"
        name="subjectId"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
      >
        <Select
          size="large"
          placeholder="Chọn môn học"
          loading={isLoadingSubjects}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>
      {/* Tên bài học */}
      <Form.Item
        label="Tên bài học"
        name="name"
        rules={[
          { required: true, message: 'Vui lòng nhập tên bài học' },
          { max: 100, message: 'Tên bài học không được quá 100 ký tự' },
        ]}
      >
        <Input
          placeholder="VD: Introduction to Pickleball"
          size="large"
          showCount
          maxLength={100}
        />
      </Form.Item>

      {/* Mô tả */}
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ max: 1000, message: 'Mô tả không được quá 1000 ký tự' }]}
      >
        <TextArea placeholder="Nhập mô tả về bài học..." rows={4} showCount maxLength={1000} />
      </Form.Item>

      {/* Thời lượng */}
      <Form.Item
        label="Thời lượng (phút)"
        name="duration"
        rules={[
          { type: 'number', min: 1, message: 'Thời lượng phải lớn hơn 0' },
          { type: 'number', max: 480, message: 'Thời lượng không được quá 480 phút (8 giờ)' },
        ]}
      >
        <InputNumber
          placeholder="60"
          size="large"
          min={1}
          max={480}
          className="w-full"
          prefix={<ClockCircleOutlined />}
          addonAfter="phút"
        />
      </Form.Item>

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
