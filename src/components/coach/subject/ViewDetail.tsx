'use client';

import React, { useState } from 'react';
import {
  Modal,
  Button,
  Descriptions,
  Tag,
  Card,
  Empty,
  Divider,
  Popconfirm,
  App,
  Space,
} from 'antd';
import {
  EyeOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Subject } from '@/@crema/types/subject';
import { PickleballLevel, SubjectStatus } from '@/@crema/constants/AppEnums';
import LessonDetailModal from '@/components/coach/content/LessonDetailModal';
import CreateLessonModal from '@/components/coach/content/createLessonModal';
import { useUpdateLesson, useDeleteLesson } from '@/@crema/services/apis/lessons';
import { useQueryClient } from '@tanstack/react-query';
import { useGetSubjectById } from '@/@crema/services/apis/subjects';

interface ViewDetailProps {
  open: boolean;
  subject: Subject | null;
  onClose: () => void;
  onRefresh?: () => void;
}

const getLevelConfig = (level: string | PickleballLevel) => {
  const normalizedLevel = typeof level === 'string' ? level.toUpperCase() : level;
  const config: Record<string, { color: string; label: string }> = {
    BEGINNER: { color: 'green', label: 'Cơ bản' },
    INTERMEDIATE: { color: 'blue', label: 'Trung cấp' },
    ADVANCED: { color: 'purple', label: 'Nâng cao' },
  };
  return config[normalizedLevel] || { color: 'default', label: normalizedLevel };
};

const statusConfig = {
  [SubjectStatus.DRAFT]: { color: 'default', label: 'Nháp' },
  [SubjectStatus.PUBLISHED]: { color: 'success', label: 'Đã xuất bản' },
};

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const ViewDetail: React.FC<ViewDetailProps> = ({ open, subject, onClose, onRefresh }) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isLessonDetailModalVisible, setIsLessonDetailModalVisible] = useState(false);
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState<any>(null);
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);

  // Fetch subject detail when modal opens
  const {
    data: subjectData,
    isLoading: isLoadingSubject,
    refetch: refetchSubjectDetail,
  } = useGetSubjectById(open && subject ? subject.id : null);

  // Use fetched data if available, otherwise use prop
  const displaySubject = subjectData || subject;

  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();

  const handleViewLesson = (lesson: any) => {
    const fullLessonData = {
      ...lesson,
      _original: lesson,
    };
    setSelectedLesson(fullLessonData);
    setIsLessonDetailModalVisible(true);
  };

  const handleEditLesson = (lesson: any) => {
    const fullLessonData = {
      ...lesson,
      _original: lesson,
    };
    setSelectedLessonForEdit(fullLessonData);
    setIsLessonModalVisible(true);
  };

  const handleDeleteLesson = async (lessonId: string | number) => {
    try {
      await deleteLessonMutation.mutateAsync(lessonId);
      message.success('Xóa bài học thành công!');
      // Refresh subject data
      if (onRefresh) {
        onRefresh();
      }
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      // Refetch current subject detail immediately
      if (displaySubject?.id) {
        queryClient.invalidateQueries({ queryKey: ['subjects', 'detail', displaySubject.id] });
        await refetchSubjectDetail();
      }
    } catch (error: any) {
      message.error(error?.message || 'Xóa bài học thất bại');
    }
  };

  const handleEditLessonSubmit = async (values: any) => {
    if (!selectedLessonForEdit) return;

    setLessonLoading(true);
    try {
      await updateLessonMutation.mutateAsync({
        lessonId: selectedLessonForEdit.id,
        data: {
          name: values.name,
          description: values.description,
          duration: values.duration,
        },
      });
      message.success('Cập nhật bài học thành công!');
      setIsLessonModalVisible(false);
      setSelectedLessonForEdit(null);
      // Refresh subject data
      if (onRefresh) {
        onRefresh();
      }
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      // Refetch current subject detail immediately
      if (displaySubject?.id) {
        queryClient.invalidateQueries({ queryKey: ['subjects', 'detail', displaySubject.id] });
        await refetchSubjectDetail();
      }
    } catch (e: any) {
      message.error(e?.message || 'Cập nhật bài học thất bại');
    } finally {
      setLessonLoading(false);
    }
  };

  if (!subject && !isLoadingSubject) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EyeOutlined />
          <span>Chi tiết môn học</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
      centered
      styles={{
        body: {
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        },
      }}
    >
      {isLoadingSubject ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : displaySubject ? (
        <>
          {/* Basic Information */}
          <Descriptions column={1} bordered className="mb-6">
            <Descriptions.Item label="Tên môn học">
              <span className="font-semibold text-lg">{displaySubject.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {displaySubject.description || 'Chưa có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Trình độ">
              <Tag color={getLevelConfig(displaySubject.level).color}>
                {getLevelConfig(displaySubject.level).label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  (statusConfig as Record<string, { color: string; label: string }>)[
                    displaySubject.status
                  ]?.color || 'default'
                }
              >
                {(statusConfig as Record<string, { color: string; label: string }>)[
                  displaySubject.status
                ]?.label || displaySubject.status}
              </Tag>
            </Descriptions.Item>
            {displaySubject.createdBy && (
              <Descriptions.Item label="Người tạo">
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span>{displaySubject.createdBy.fullName || displaySubject.createdBy.email}</span>
                </div>
              </Descriptions.Item>
            )}
            {displaySubject.createdAt && (
              <Descriptions.Item label="Ngày tạo">
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span>{formatDateTime(displaySubject.createdAt)}</span>
                </div>
              </Descriptions.Item>
            )}
            {displaySubject.updatedAt && (
              <Descriptions.Item label="Ngày cập nhật">
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span>{formatDateTime(displaySubject.updatedAt)}</span>
                </div>
              </Descriptions.Item>
            )}
            {displaySubject.lessons && (
              <Descriptions.Item label="Số bài học">
                <span className="font-semibold">{displaySubject.lessons.length || 0} bài học</span>
              </Descriptions.Item>
            )}
            {displaySubject.courses && (
              <Descriptions.Item label="Số khóa học">
                <span className="font-semibold">{displaySubject.courses.length || 0} khóa học</span>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Lessons List */}
          {displaySubject.lessons && displaySubject.lessons.length > 0 && (
            <>
              <Divider orientation="left">
                <span className="text-base font-semibold">
                  Danh sách bài học ({displaySubject.lessons.length})
                </span>
              </Divider>
              <div className="space-y-3">
                {displaySubject.lessons.map((lesson: any) => (
                  <Card
                    key={lesson.id}
                    size="small"
                    className="shadow-sm hover:shadow-md transition-all"
                    styles={{ body: { padding: '16px' } }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag color="blue">Bài {lesson.lessonNumber || 'N/A'}</Tag>
                          <h5 className="text-base font-semibold text-gray-800 m-0">
                            {lesson.name}
                          </h5>
                        </div>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {lesson.duration && (
                            <span className="flex items-center gap-1">
                              <ClockCircleOutlined />
                              <span>{lesson.duration} phút</span>
                            </span>
                          )}
                          {lesson.createdAt && (
                            <span className="flex items-center gap-1">
                              <CalendarOutlined />
                              <span>{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <Space className="ml-4">
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          size="small"
                          onClick={() => handleViewLesson(lesson)}
                        >
                          Xem
                        </Button>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => handleEditLesson(lesson)}
                        >
                          Sửa
                        </Button>
                        <Popconfirm
                          title="Xóa bài học"
                          description="Bạn có chắc chắn muốn xóa bài học này?"
                          onConfirm={() => handleDeleteLesson(lesson.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true, loading: deleteLessonMutation.isPending }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            loading={deleteLessonMutation.isPending}
                          >
                            Xóa
                          </Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {displaySubject.lessons && displaySubject.lessons.length === 0 && (
            <div className="mt-6 text-center py-8 text-gray-400">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có bài học nào"
                styles={{ image: { height: 60 } }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-400">Không tìm thấy thông tin môn học</div>
      )}

      {/* Lesson Detail Modal */}
      <LessonDetailModal
        open={isLessonDetailModalVisible}
        lesson={selectedLesson}
        onClose={() => {
          setIsLessonDetailModalVisible(false);
          setSelectedLesson(null);
        }}
      />

      {/* Lesson Edit Modal */}
      <CreateLessonModal
        open={isLessonModalVisible}
        onClose={() => {
          setIsLessonModalVisible(false);
          setSelectedLessonForEdit(null);
        }}
        onSubmit={handleEditLessonSubmit}
        initialValues={
          selectedLessonForEdit && displaySubject
            ? {
                subjectId: displaySubject.id,
                name: selectedLessonForEdit.name || '',
                description: selectedLessonForEdit.description || '',
                duration: selectedLessonForEdit.duration || undefined,
              }
            : undefined
        }
        loading={lessonLoading}
      />
    </Modal>
  );
};

export default ViewDetail;
