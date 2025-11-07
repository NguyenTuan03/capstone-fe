'use client';

import { useMemo, useState } from 'react';
import { Modal, Form, Input, Button, Upload, Select, Typography, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormInstance, UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';

const { TextArea } = Input;
const { Text } = Typography;

export interface CreateVideoFormValues {
  title: string;
  description?: string;
  lessonId?: string | number;
  duration: number; // in seconds
  tags?: string[];
  drillName?: string;
  drillDescription?: string;
  drillPracticeSets?: string;
  videoFile?: File;
}

interface LessonOption {
  label: string;
  value: string | number;
}

interface CreateVideoModalProps {
  open: boolean;
  form: FormInstance<CreateVideoFormValues>;
  onSubmit: () => void;
  onClose: () => void;
  submitting?: boolean;
  lessonsOptions: LessonOption[];
}

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const CreateVideoModal: React.FC<CreateVideoModalProps> = ({
  open,
  form,
  onSubmit,
  onClose,
  submitting = false,
  lessonsOptions,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoadingDuration, setIsLoadingDuration] = useState(false);
  const [durationLoaded, setDurationLoaded] = useState(false);

  const initialValues = useMemo(
    () => ({
      title: '',
      description: '',
      lessonId: undefined,
      duration: 0,
      tags: [],
      drillName: '',
      drillDescription: '',
      drillPracticeSets: '',
    }),
    [],
  );

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setDurationLoaded(false);
    setIsLoadingDuration(false);
    onClose();
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.floor(video.duration);
        resolve(duration);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Không thể đọc thông tin video'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const beforeUpload = async (file: RcFile) => {
    // Check file type
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      form.setFields([
        {
          name: 'videoFile',
          errors: ['Chỉ chấp nhận file video'],
        },
      ]);
      return false;
    }

    // Check file size (e.g., max 500MB)
    const isLt500M = file.size / 1024 / 1024 < 500;
    if (!isLt500M) {
      form.setFields([
        {
          name: 'videoFile',
          errors: ['File video không được vượt quá 500MB'],
        },
      ]);
      return false;
    }

    setFileList([file as UploadFile]);
    form.setFieldValue('videoFile', file);

    // Read video duration
    setIsLoadingDuration(true);
    try {
      const duration = await getVideoDuration(file);
      form.setFieldValue('duration', duration);
      setDurationLoaded(true);
    } catch (error: any) {
      console.error('Error reading video duration:', error);
      form.setFields([
        {
          name: 'videoFile',
          errors: [error?.message || 'Không thể đọc thời lượng video'],
        },
      ]);
      setFileList([]);
      form.setFieldValue('videoFile', undefined);
    } finally {
      setIsLoadingDuration(false);
    }

    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setFileList([]);
    form.setFieldValue('videoFile', undefined);
    form.setFieldValue('duration', 0);
    setDurationLoaded(false);
  };

  return (
    <Modal
      title="Upload Video"
      open={open}
      onOk={onSubmit}
      onCancel={handleCancel}
      width={700}
      confirmLoading={submitting}
      style={{ top: 20 }}
      centered
      styles={{
        body: {
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
          padding: '24px',
        },
      }}
    >
      <Form form={form} layout="vertical" initialValues={initialValues} preserve={false}>
        <Form.Item
          label="Chọn bài học"
          name="lessonId"
          rules={[{ required: true, message: 'Vui lòng chọn bài học' }]}
        >
          <Select
            allowClear
            placeholder="Chọn bài học cho video"
            options={lessonsOptions}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          label="File Video"
          name="videoFile"
          rules={[{ required: true, message: 'Vui lòng chọn file video' }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            maxCount={1}
            accept="video/*"
          >
            <Button icon={<UploadOutlined />}>Chọn file video</Button>
          </Upload>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            Chấp nhận file video, tối đa 500MB
          </Text>
        </Form.Item>

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề' },
            { max: 50, message: 'Tiêu đề tối đa 50 ký tự' },
            {
              validator: (_, value) =>
                value && !value.trim()
                  ? Promise.reject(new Error('Tiêu đề không được để trống'))
                  : Promise.resolve(),
            },
          ]}
        >
          <Input placeholder="VD: Introduction to Pickleball" showCount maxLength={50} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea
            placeholder="Nhập mô tả cho video"
            rows={3}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item
          label="Thời lượng (giây)"
          name="duration"
          rules={[
            { required: true, message: 'Vui lòng chọn file video để tự động tính thời lượng' },
            { type: 'number', min: 1, message: 'Thời lượng phải lớn hơn 0' },
          ]}
          tooltip={
            durationLoaded
              ? 'Thời lượng đã được tự động tính từ video'
              : 'Thời lượng sẽ tự động được tính khi bạn chọn file video'
          }
          extra={
            isLoadingDuration ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ⏳ Đang đọc thông tin video...
              </Text>
            ) : durationLoaded ? (
              <Text type="success" style={{ fontSize: 12 }}>
                ✓ Thời lượng đã được tự động tính từ video
              </Text>
            ) : (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Chọn file video để tự động tính thời lượng
              </Text>
            )
          }
        >
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            placeholder={
              isLoadingDuration
                ? 'Đang đọc thông tin video...'
                : durationLoaded
                  ? 'Đã tự động tính từ video'
                  : 'Chọn file video để tự động tính'
            }
            disabled={durationLoaded || isLoadingDuration}
            formatter={(value) => (value ? `${value} giây (${formatDuration(Number(value))})` : '')}
            parser={(value) => {
              const parsed = value ? value.replace(/[^\d]/g, '') : '';
              return parsed ? (Number(parsed) as any) : ('' as any);
            }}
          />
        </Form.Item>

        <Form.Item label="Tags" name="tags" tooltip="Nhấn Enter để thêm tag">
          <Select
            mode="tags"
            placeholder="Nhập tags và nhấn Enter"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 8 }}>
          <Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
            Thông tin Drill (Tùy chọn)
          </Text>

          <Form.Item
            label="Tên Drill"
            name="drillName"
            rules={[{ max: 50, message: 'Tên drill tối đa 50 ký tự' }]}
          >
            <Input placeholder="VD: Basic Serve Practice" showCount maxLength={50} />
          </Form.Item>

          <Form.Item label="Mô tả Drill" name="drillDescription">
            <TextArea
              placeholder="Nhập mô tả về drill"
              rows={2}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <Form.Item label="Lịch tập luyện" name="drillPracticeSets">
            <Input placeholder="VD: 3 sets of 10 serves" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateVideoModal;
