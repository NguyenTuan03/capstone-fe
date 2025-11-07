'use client';

import React, { useEffect, useMemo } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { PickleballLevel } from '@/types/enums';

const { TextArea } = Input;

export enum SubjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

type SubjectFormShape = {
  name: string;
  description?: string;
  level: PickleballLevel | string;
  status?: SubjectStatus | string;
};

export type CreateSubjectRequestDto = {
  name: string;
  description?: string;
  level: PickleballLevel;
  status?: SubjectStatus;
};

interface CreateSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateSubjectRequestDto) => Promise<void> | void;
  loading?: boolean;
  initialValues?: Partial<SubjectFormShape>;
}

const levelOptions = [
  {
    label: 'Cơ bản',
    value: PickleballLevel.BEGINNER,
  },
  {
    label: 'Trung cấp',
    value: PickleballLevel.INTERMEDIATE,
  },
  {
    label: 'Nâng cao',
    value: PickleballLevel.ADVANCED,
  },
];

const normalizeLevel = (value: unknown): PickleballLevel | undefined => {
  if (!value) return undefined;
  const normalized = value.toString().toUpperCase();
  return Object.values(PickleballLevel).includes(normalized as PickleballLevel)
    ? (normalized as PickleballLevel)
    : undefined;
};

const normalizeStatus = (value: unknown): SubjectStatus | undefined => {
  if (!value) return undefined;
  const normalized = value.toString().toUpperCase();
  return Object.values(SubjectStatus).includes(normalized as SubjectStatus)
    ? (normalized as SubjectStatus)
    : undefined;
};

const emptyInitialValues: SubjectFormShape = {
  name: '',
  description: undefined,
  level: PickleballLevel.BEGINNER,
  status: SubjectStatus.DRAFT,
};

const CreateModal: React.FC<CreateSubjectModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialValues,
}) => {
  const [form] = Form.useForm<SubjectFormShape>();

  const memoizedInitialValues = useMemo(() => {
    const merged = {
      ...emptyInitialValues,
      ...initialValues,
    };

    return {
      name: merged.name ?? '',
      description: merged.description ?? undefined,
      level: normalizeLevel(merged.level) ?? PickleballLevel.BEGINNER,
      status: normalizeStatus(merged.status) ?? SubjectStatus.DRAFT,
    } satisfies SubjectFormShape;
  }, [initialValues]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(memoizedInitialValues);
    } else {
      form.resetFields();
    }
  }, [form, memoizedInitialValues, open]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const normalizedLevel = normalizeLevel(values.level);
      if (!normalizedLevel) {
        throw new Error('Trình độ không hợp lệ');
      }

      const payload: CreateSubjectRequestDto = {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        level: normalizedLevel,
      };

      const finalStatus = normalizeStatus(values.status) ?? SubjectStatus.DRAFT;
      payload.status = finalStatus;

      await onSubmit(payload);
      handleClose();
    } catch (error) {
      // Validation errors are handled by Form.Item
      if (error instanceof Error && error.message === 'Trình độ không hợp lệ') {
        form.setFields([
          {
            name: 'level',
            errors: ['Trình độ không hợp lệ'],
          },
        ]);
      }
    }
  };

  return (
    <Modal
      title={<div className="text-xl font-semibold">➕ Tạo môn học</div>}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      okText={initialValues ? 'Cập nhật' : 'Tạo mới'}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="name"
          label="Tên môn học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên môn học' },
            { max: 100, message: 'Tên môn học không vượt quá 100 ký tự' },
            {
              validator: (_, value) =>
                value && !value.trim()
                  ? Promise.reject(new Error('Tên môn học không được để trống'))
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="Ví dụ: Cơ bản môn Pickleball" showCount maxLength={100} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { max: 500, message: 'Mô tả không vượt quá 500 ký tự' },
            {
              validator: (_, value) =>
                value && !value.trim()
                  ? Promise.reject(new Error('Mô tả không được để trống'))
                  : Promise.resolve(),
            },
          ]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả về môn học" showCount maxLength={500} />
        </Form.Item>

        <Form.Item
          name="level"
          label="Trình độ"
          rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
        >
          <Select options={levelOptions} placeholder="Chọn trình độ" />
        </Form.Item>

        {initialValues && (
          <Form.Item name="status" label="Trạng thái" rules={[{ required: false }]}>
            <Select
              options={[
                { label: 'Nháp', value: SubjectStatus.DRAFT },
                { label: 'Đã xuất bản', value: SubjectStatus.PUBLISHED },
              ]}
              placeholder="Chọn trạng thái"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreateModal;
