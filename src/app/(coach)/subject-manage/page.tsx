'use client';

import { useState } from 'react';
import { Card, Button, Tag, Row, Col, Popconfirm, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import SubjectModal from '@/components/coach/subject/createModal';
import {
  useCreateSubject,
  useGetSubjects,
  useUpdateSubject,
} from '@/@crema/services/apis/subjects';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

enum PickleballLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

enum SubjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

interface Subject {
  id: string;
  name: string;
  description?: string;
  level: PickleballLevel;
  status: SubjectStatus;
  createdAt?: string;
}

// No external props; data loads via API

export default function SubjectsList() {
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [page, setPage] = useState(1);
  const size = 6;
  const { data: subjectsRes, isLoading } = useGetSubjects({ page, size });
  const subjects: Subject[] = (subjectsRes?.items as Subject[]) || [];
  const total = (subjectsRes?.total as number) ?? subjects.length;

  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();

  const levelConfig = {
    [PickleballLevel.BEGINNER]: { color: 'green', label: 'Beginner' },
    [PickleballLevel.INTERMEDIATE]: { color: 'blue', label: 'Intermediate' },
    [PickleballLevel.ADVANCED]: { color: 'purple', label: 'Advanced' },
  };

  const statusConfig = {
    [SubjectStatus.DRAFT]: { color: 'default', label: 'Nháp' },
    [SubjectStatus.PUBLISHED]: { color: 'success', label: 'Đã xuất bản' },
    [SubjectStatus.ARCHIVED]: { color: 'warning', label: 'Lưu trữ' },
  };

  const handleCreate = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
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
      } catch (error: any) {
        throw error;
      }
    } else {
      try {
        await createSubjectMutation.mutateAsync(values as any);
      } catch (error: any) {
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
              className="h-full shadow-sm hover:shadow-lg transition-all duration-300"
              bodyStyle={{ padding: '20px' }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex-1">{subject.name}</h3>
                <Tag color={levelConfig[subject.level]?.color}>
                  {levelConfig[subject.level]?.label}
                </Tag>
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
                <Button icon={<EyeOutlined />} className="flex-1">
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
                  onConfirm={() => {}}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />} />
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

      {/* Modal */}
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
    </div>
  );
}
