'use client';

import { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Row,
  Col,
  Popconfirm,
  Pagination,
  Modal,
  Descriptions,
  App,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import SubjectModal from '@/components/coach/subject/createModal';
import {
  useCreateSubject,
  useGetSubjects,
  useUpdateSubject,
  useDeleteSubject,
} from '@/@crema/services/apis/subjects';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { Subject } from '@/@crema/types/subject';
import { PickleballLevel, SubjectStatus } from '@/@crema/constants/AppEnums';

// No external props; data loads via API

export default function SubjectsList() {
  const { message } = App.useApp();
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
  const [page, setPage] = useState(1);
  const size = 6;
  const { data: subjectsRes, isLoading } = useGetSubjects({ page, size });
  const subjects: Subject[] = (subjectsRes?.items as Subject[]) || [];
  const total = (subjectsRes?.total as number) ?? subjects.length;

  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();

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

  const handleCreate = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleView = (subject: Subject) => {
    setViewingSubject(subject);
    setViewModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteSubjectMutation.mutateAsync(id);
      message.success('Xóa môn học thành công!');
    } catch (error: any) {
      message.error(error?.message || 'Xóa môn học thất bại');
    }
  };

  const handleSubmit = async (values: {
    name: string;
    description?: string;
    level: PickleballLevel;
    status?: SubjectStatus;
  }) => {
    if (editingSubject) {
      try {
        await updateSubjectMutation.mutateAsync({ id: editingSubject.id, data: values as any });
        message.success('Cập nhật môn học thành công!');
      } catch (error: any) {
        message.error(error?.message || 'Cập nhật môn học thất bại');
        throw error;
      }
    } else {
      try {
        await createSubjectMutation.mutateAsync(values as any);
        message.success('Tạo môn học thành công!');
      } catch (error: any) {
        message.error(error?.message || 'Tạo môn học thất bại');
        throw error;
      }
    }
  };

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📖 Môn học</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          className="bg-gradient-to-r from-pink-500 to-purple-600 border-0"
        >
          Tạo Môn học
        </Button>
      </div>

      {/* Subjects Grid */}
      <Row gutter={[16, 16]}>
        {subjects?.map((subject) => (
          <Col xs={24} sm={12} lg={8} key={subject.id}>
            <Card
              hoverable
              className="h-full shadow-sm hover:shadow-lg transition-all duration-300 relative"
              styles={{ body: { padding: '20px' } }}
            >
              {/* Level Tag - Top Right Corner */}
              <div className="absolute top-4 right-4 z-10">
                <Tag color={getLevelConfig(subject.level).color}>
                  {getLevelConfig(subject.level).label}
                </Tag>
              </div>

              {/* Header */}
              <div className="mb-3 pr-16">
                <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {subject.description || 'Chưa có mô tả'}
              </p>

              {/* Status */}
              <div className="mb-4">
                <Tag color={statusConfig[subject.status]?.color}>
                  {statusConfig[subject.status]?.label}
                </Tag>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  icon={<EyeOutlined />}
                  className="flex-1"
                  onClick={() => handleView(subject)}
                >
                  Xem
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(subject)}
                  className="flex-1"
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa môn học"
                  description="Bạn có chắc chắn muốn xóa môn học này?"
                  onConfirm={() => handleDelete(subject.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, loading: deleteSubjectMutation.isPending }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteSubjectMutation.isPending}
                  />
                </Popconfirm>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          current={page}
          pageSize={size}
          total={total}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>

      {/* Empty State */}
      {subjects?.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">📖</div>
          <div className="text-gray-600 mb-4">Chưa có môn học nào</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="bg-gradient-to-r from-pink-500 to-purple-600 border-0"
          >
            Tạo môn học đầu tiên
          </Button>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <SubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit as any}
        initialValues={
          editingSubject
            ? ({
                name: editingSubject.name,
                description: editingSubject.description,
                // cast enums to form's local enum type; form will transform to UPPERCASE on submit
                level: editingSubject.level as unknown as any,
                status: editingSubject.status as unknown as any,
              } as any)
            : undefined
        }
        loading={isLoading || createSubjectMutation.isPending}
      />

      {/* View Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EyeOutlined />
            <span>Chi tiết môn học</span>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setViewingSubject(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalOpen(false);
              setViewingSubject(null);
            }}
          >
            Đóng
          </Button>,
          viewingSubject && (
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setViewModalOpen(false);
                handleEdit(viewingSubject);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        ]}
        width={700}
        centered
      >
        {viewingSubject && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên môn học">{viewingSubject.name}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {viewingSubject.description || 'Chưa có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Trình độ">
              <Tag color={getLevelConfig(viewingSubject.level).color}>
                {getLevelConfig(viewingSubject.level).label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusConfig[viewingSubject.status]?.color}>
                {statusConfig[viewingSubject.status]?.label}
              </Tag>
            </Descriptions.Item>
            {viewingSubject.createdBy && (
              <Descriptions.Item label="Người tạo">
                {viewingSubject.createdBy.fullName || viewingSubject.createdBy.email}
              </Descriptions.Item>
            )}
            {viewingSubject.createdAt && (
              <Descriptions.Item label="Ngày tạo">
                {new Date(viewingSubject.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
            {viewingSubject.updatedAt && (
              <Descriptions.Item label="Ngày cập nhật">
                {new Date(viewingSubject.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            )}
            {viewingSubject.lessons && (
              <Descriptions.Item label="Số bài học">
                {viewingSubject.lessons.length || 0} bài học
              </Descriptions.Item>
            )}
          </Descriptions>
        )}

        {/* Lessons List */}
        {viewingSubject && viewingSubject.lessons && viewingSubject.lessons.length > 0 && (
          <div className="mt-6">
            <h4 className="text-base font-semibold mb-4">Danh sách bài học</h4>
            <div className="space-y-3">
              {viewingSubject.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  size="small"
                  className="shadow-sm hover:shadow-md transition-all"
                  styles={{ body: { padding: '16px' } }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color="blue">Bài {lesson.lessonNumber}</Tag>
                        <h5 className="text-base font-semibold text-gray-800 m-0">{lesson.name}</h5>
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>⏱️ {lesson.duration} phút</span>
                        {lesson.createdAt && (
                          <span>📅 {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {viewingSubject && viewingSubject.lessons && viewingSubject.lessons.length === 0 && (
          <div className="mt-6 text-center py-8 text-gray-400">
            <div className="text-lg mb-2">📚</div>
            <div>Chưa có bài học nào</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
