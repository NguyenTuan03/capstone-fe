'use client';

import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Space,
  TimePicker,
} from 'antd';
import { message } from 'antd';
import { CourseLearningFormat } from '@/types/enums';
import { useGetSubjects } from '@/@crema/services/apis/subjects';
import { useCreateCourse } from '@/@crema/services/apis/courses';
import { useApiQuery } from '@/@crema/hooks/useApiQuery';

export interface CreateScheduleDto {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface CreateCourseRequestDto {
  subjectId: number;
  learningFormat: CourseLearningFormat;
  minParticipants: number;
  maxParticipants: number;
  pricePerParticipant: number;
  startDate: Date;
  address: string;
  province: number;
  district: number;
  schedules?: CreateScheduleDto[];
}

export interface UpdateCourseDto extends Partial<CreateCourseRequestDto> {
  schedules?: CreateScheduleDto[];
}

interface CreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: CreateCourseRequestDto) => Promise<void> | void;
  loading?: boolean;
  initialValues?: Partial<CreateCourseRequestDto>;
  subjects?: { label: string; value: number }[]; // Optional override
}

const dayOfWeekOptions = [
  { label: 'Thứ hai', value: 'Monday' },
  { label: 'Thứ ba', value: 'Tuesday' },
  { label: 'Thứ tư', value: 'Wednesday' },
  { label: 'Thứ năm', value: 'Thursday' },
  { label: 'Thứ sáu', value: 'Friday' },
  { label: 'Thứ bảy', value: 'Saturday' },
  { label: 'Chủ nhật', value: 'Sunday' },
];

const learningFormatOptions = [
  { label: 'Cá nhân', value: CourseLearningFormat.INDIVIDUAL },
  { label: 'Nhóm', value: CourseLearningFormat.GROUP },
];

export default function CreateCourseModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialValues,
  subjects,
}: CreateCourseModalProps) {
  const [form] = Form.useForm<CreateCourseRequestDto>();
  const learningFormat = Form.useWatch('learningFormat', form);
  const isIndividual = learningFormat === CourseLearningFormat.INDIVIDUAL;
  const [selectedProvince, setSelectedProvince] = useState<number | undefined>(
    initialValues?.province,
  );
  const { data: subjectsRes, isLoading: isLoadingSubjects } = useGetSubjects({
    page: 1,
    size: 100,
    filter: 'status_eq_PUBLISHED',
  });
  const createCourseMutation = useCreateCourse();
  const subjectOptions =
    subjects || ((subjectsRes?.items as any[]) || []).map((s) => ({ label: s.name, value: s.id }));

  // Provinces and districts
  const { data: provincesRes, isLoading: loadingProvinces } = useApiQuery<any>({
    endpoint: 'provinces',
    params: { page: 1, size: 100 },
    staleTime: 5 * 60 * 1000,
  });
  const { data: districtsRes, isLoading: loadingDistricts } = useApiQuery<any>({
    endpoint: selectedProvince
      ? `provinces/${selectedProvince}/districts`
      : 'provinces/0/districts',
    enabled: !!selectedProvince,
    params: { page: 1, size: 1000 },
  });
  const provincesArray = Array.isArray(provincesRes)
    ? (provincesRes as any[])
    : (provincesRes?.items as any[]) || [];
  const districtsArray = Array.isArray(districtsRes)
    ? (districtsRes as any[])
    : (districtsRes?.items as any[]) || [];
  const provinceOptions = provincesArray.map((p) => ({ label: p.name, value: p.id }));
  const districtOptions = districtsArray.map((d) => ({ label: d.name, value: d.id }));

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const isIndividualFormat = values.learningFormat === CourseLearningFormat.INDIVIDUAL;

      const payload: CreateCourseRequestDto = {
        subjectId: values.subjectId,
        learningFormat: values.learningFormat,
        minParticipants: isIndividualFormat ? 1 : values.minParticipants,
        maxParticipants: isIndividualFormat ? 1 : values.maxParticipants,
        pricePerParticipant: values.pricePerParticipant,
        startDate: values.startDate
          ? new Date((values.startDate as any).toISOString())
          : new Date(),
        address: values.address,
        province: values.province,
        district: values.district,
        schedules: values.schedules?.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          startTime:
            typeof (s as any).startTime?.format === 'function'
              ? (s as any).startTime.format('HH:mm:ss')
              : s.startTime,
          endTime:
            typeof (s as any).endTime?.format === 'function'
              ? (s as any).endTime.format('HH:mm:ss')
              : s.endTime,
        })),
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await createCourseMutation.mutateAsync({
          subjectId: payload.subjectId,
          data: {
            learningFormat: payload.learningFormat,
            minParticipants: isIndividualFormat ? 1 : payload.minParticipants,
            maxParticipants: isIndividualFormat ? 1 : payload.maxParticipants,
            pricePerParticipant: payload.pricePerParticipant,
            startDate: payload.startDate,
            address: payload.address,
            province: payload.province,
            district: payload.district,
            schedules: payload.schedules,
          },
        });
        message.success('Tạo khóa học thành công');
      }
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Tạo khóa học thất bại');
      throw error;
    }
  };

  return (
    <Modal
      title={<div className="text-xl font-semibold">➕ Tạo khóa học</div>}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
      destroyOnHidden
      maskClosable={false}
      keyboard={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          subjectId: undefined,
          learningFormat: CourseLearningFormat.GROUP,
          minParticipants: 1,
          maxParticipants: 10,
          pricePerParticipant: 0,
          address: '',
          province: undefined,
          district: undefined,
          schedules: [],
          ...initialValues,
        }}
      >
        {/* THÊM FIELD MÔN HỌC */}
        <Form.Item
          name="subjectId"
          label="Môn học"
          rules={[{ required: true, message: 'Chọn môn học' }]}
        >
          <Select
            placeholder="Chọn môn học"
            options={subjectOptions}
            loading={isLoadingSubjects}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="learningFormat"
          label="Hình thức học"
          rules={[{ required: true, message: 'Chọn hình thức học' }]}
        >
          <Select
            options={learningFormatOptions}
            onChange={(value) => {
              if (value === CourseLearningFormat.INDIVIDUAL) {
                form.setFieldsValue({
                  minParticipants: 1,
                  maxParticipants: 1,
                });
              }
            }}
          />
        </Form.Item>

        <Space size={16} style={{ width: '100%' }} wrap>
          {!isIndividual && (
            <>
              <Form.Item
                name="minParticipants"
                label="Số người tối thiểu"
                rules={[{ required: true, message: 'Nhập số người tối thiểu' }]}
              >
                <InputNumber min={1} style={{ width: 180 }} />
              </Form.Item>
              <Form.Item
                name="maxParticipants"
                label="Số người tối đa"
                rules={[{ required: true, message: 'Nhập số người tối đa' }]}
              >
                <InputNumber min={1} style={{ width: 180 }} />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="pricePerParticipant"
            label="Giá / học viên"
            rules={[{ required: true, message: 'Nhập giá' }]}
          >
            <InputNumber
              min={0}
              step={10000}
              style={{ width: 200 }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => (v ? v.replace(/,/g, '') : '') as any}
            />
          </Form.Item>
        </Space>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Nhập địa chỉ' }]}
        >
          <Input placeholder="123 Main St, City, Country" />
        </Form.Item>

        <Space size={16} style={{ width: '100%' }} wrap>
          <Form.Item
            name="province"
            label="Tỉnh/TP"
            rules={[{ required: true, message: 'Chọn tỉnh/thành phố' }]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
              options={provinceOptions}
              loading={loadingProvinces}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: 260 }}
              onChange={(val) => {
                setSelectedProvince(val as number);
                form.setFieldsValue({ district: undefined });
              }}
            />
          </Form.Item>
          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true, message: 'Chọn quận/huyện' }]}
          >
            <Select
              placeholder={selectedProvince ? 'Chọn quận/huyện' : 'Chọn tỉnh trước'}
              options={districtOptions}
              loading={loadingDistricts}
              disabled={!selectedProvince}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: 260 }}
            />
          </Form.Item>
        </Space>

        <Form.List name="schedules">
          {(fields, { add, remove }) => (
            <div>
              <div className="mb-2 font-medium">Lịch học</div>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
                  <Form.Item
                    {...restField}
                    name={[name, 'dayOfWeek']}
                    rules={[{ required: true, message: 'Chọn ngày' }]}
                  >
                    <Select
                      options={dayOfWeekOptions}
                      style={{ width: 170 }}
                      placeholder="Ngày trong tuần"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'startTime']}
                    rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
                  >
                    <TimePicker format="HH:mm:ss" style={{ width: 140 }} placeholder="Bắt đầu" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'endTime']}
                    rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}
                  >
                    <TimePicker format="HH:mm:ss" style={{ width: 140 }} placeholder="Kết thúc" />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)}>
                    Xóa
                  </Button>
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} block>
                + Thêm lịch học
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
