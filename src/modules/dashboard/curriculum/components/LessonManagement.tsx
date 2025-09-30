'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Dropdown,
  Tooltip,
  Row,
  Col,
  Card,
  Badge,
  Checkbox,
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  CopyOutlined,
  HolderOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CurriculumApiService } from '@/services/curriculumApi';
import {
  Lesson,
  Chapter,
  GetLessonsParams,
  CreateLessonRequest,
  UpdateLessonRequest,
  DuplicateLessonRequest,
  CurriculumFilterOptions,
} from '@/types/curriculum';

const { Option } = Select;
const { TextArea } = Input;

interface LessonManagementProps {
  searchText: string;
  setSearchText: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  chapterFilter: string;
  setChapterFilter: (value: string) => void;
  contentFilter: string;
  setContentFilter: (value: string) => void;
  filterOptions: CurriculumFilterOptions | null;
  onClearFilters: () => void;
  onStatsUpdate: () => void;
}

const LessonManagement: React.FC<LessonManagementProps> = ({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  chapterFilter,
  setChapterFilter,
  contentFilter,
  setContentFilter,
  filterOptions,
  onClearFilters,
  onStatsUpdate,
}) => {
  // States
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [duplicatingLesson, setDuplicatingLesson] = useState<Lesson | null>(null);
  const [form] = Form.useForm();
  const [duplicateForm] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load data
  const loadLessons = async () => {
    setLoading(true);
    try {
      const params: GetLessonsParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
        chapterId: chapterFilter !== 'all' ? chapterFilter : undefined,
        hasContent: contentFilter !== 'all' ? (contentFilter as any) : undefined,
        sortBy: 'order',
        sortOrder: 'asc',
      };

      const response = await CurriculumApiService.getLessons(params);
      setLessons(response.lessons);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
      onStatsUpdate();
    } catch (error) {
      message.error('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async () => {
    try {
      const response = await CurriculumApiService.getChapters({
        page: 1,
        limit: 100,
        status: 'active',
        sortBy: 'order',
        sortOrder: 'asc',
      });
      setChapters(response.chapters);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadLessons();
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    loadChapters();
  }, []);

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadLessons();
  };

  const handleAddLesson = () => {
    setEditingLesson(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      duration: 30,
    });
    setModalVisible(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    form.setFieldsValue({
      name: lesson.name,
      shortDescription: lesson.shortDescription,
      chapterId: lesson.chapterId,
      duration: lesson.duration,
      order: lesson.order,
      status: lesson.status,
    });
    setModalVisible(true);
  };

  const handleDuplicateLesson = (lesson: Lesson) => {
    setDuplicatingLesson(lesson);
    duplicateForm.resetFields();
    duplicateForm.setFieldsValue({
      targetChapterId: lesson.chapterId,
      newName: `${lesson.name} (Copy)`,
      includeText: lesson.hasText,
      includeVideo: lesson.hasVideo,
      includeQuiz: lesson.hasQuiz,
    });
    setDuplicateModalVisible(true);
  };

  const handleDeleteLesson = (lesson: Lesson) => {
    Modal.confirm({
      title: <IntlMessages id="curriculum.delete.lesson.title" />,
      content: (
        <IntlMessages id="curriculum.delete.lesson.message" values={{ name: lesson.name }} />
      ),
      okText: <IntlMessages id="common.yes" />,
      cancelText: <IntlMessages id="common.no" />,
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await CurriculumApiService.deleteLesson(lesson.id);
          if (response.success) {
            message.success(response.message);
            loadLessons();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error('Không thể xóa bài học');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingLesson) {
        // Update lesson
        const request: UpdateLessonRequest = {
          id: editingLesson.id,
          name: values.name,
          shortDescription: values.shortDescription,
          chapterId: values.chapterId,
          duration: values.duration,
          order: values.order,
          status: values.status,
        };

        const response = await CurriculumApiService.updateLesson(request);
        if (response.success) {
          message.success(response.message);
          setModalVisible(false);
          loadLessons();
        } else {
          message.error(response.message);
        }
      } else {
        // Create lesson
        const request: CreateLessonRequest = {
          chapterId: values.chapterId,
          name: values.name,
          shortDescription: values.shortDescription,
          duration: values.duration,
          order: values.order,
          status: values.status,
        };

        const response = await CurriculumApiService.createLesson(request);
        if (response.success) {
          message.success(response.message);
          setModalVisible(false);
          loadLessons();
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error('Không thể lưu bài học');
    }
  };

  const handleDuplicateSubmit = async (values: any) => {
    if (!duplicatingLesson) return;

    try {
      const request: DuplicateLessonRequest = {
        lessonId: duplicatingLesson.id,
        targetChapterId: values.targetChapterId,
        newName: values.newName,
        includeContent: {
          text: values.includeText || false,
          video: values.includeVideo || false,
          quiz: values.includeQuiz || false,
        },
      };

      const response = await CurriculumApiService.duplicateLesson(request);
      if (response.success) {
        message.success(response.message);
        setDuplicateModalVisible(false);
        loadLessons();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Không thể sao chép bài học');
    }
  };

  // Content indicators component
  const ContentIndicators: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    return (
      <Space size={4}>
        {lesson.hasText && (
          <Tooltip title="Có nội dung text">
            <Badge
              count="T"
              style={{
                backgroundColor: '#52c41a',
                fontSize: '10px',
                minWidth: '16px',
                height: '16px',
                lineHeight: '16px',
              }}
            />
          </Tooltip>
        )}
        {lesson.hasVideo && (
          <Tooltip title="Có video">
            <Badge
              count="V"
              style={{
                backgroundColor: '#1890ff',
                fontSize: '10px',
                minWidth: '16px',
                height: '16px',
                lineHeight: '16px',
              }}
            />
          </Tooltip>
        )}
        {lesson.hasQuiz && (
          <Tooltip title="Có quiz">
            <Badge
              count="Q"
              style={{
                backgroundColor: '#faad14',
                fontSize: '10px',
                minWidth: '16px',
                height: '16px',
                lineHeight: '16px',
              }}
            />
          </Tooltip>
        )}
      </Space>
    );
  };

  // Table columns
  const columns: ColumnsType<Lesson> = [
    {
      title: '',
      key: 'drag',
      width: 30,
      render: () => (
        <div style={{ cursor: 'grab', color: '#999' }}>
          <HolderOutlined />
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.order" />,
      dataIndex: 'order',
      key: 'order',
      width: 60,
      render: (order: number) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{order}</div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.name" />,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Lesson) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{name}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.chapter" />,
      dataIndex: 'chapterName',
      key: 'chapterName',
      width: 150,
      render: (chapterName: string) => (
        <Tag color="blue" style={{ fontSize: '11px' }}>
          {chapterName}
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.description" />,
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      ellipsis: true,
      render: (description: string) => (
        <Tooltip title={description}>
          <span style={{ fontSize: '13px' }}>{description}</span>
        </Tooltip>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.duration" />,
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>{duration}p</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.content" />,
      key: 'content',
      width: 120,
      render: (_, lesson) => <ContentIndicators lesson={lesson} />,
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'} style={{ fontSize: '11px' }}>
          <IntlMessages id={`curriculum.status.${status}`} />
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="curriculum.lesson.table.actions" />,
      key: 'actions',
      width: 120,
      render: (_, lesson) => {
        const menuItems = [
          {
            key: 'view',
            label: <IntlMessages id="curriculum.actions.view" />,
            icon: <EyeOutlined />,
            onClick: () => console.log('View lesson:', lesson.id),
          },
          {
            key: 'edit',
            label: <IntlMessages id="curriculum.actions.edit" />,
            icon: <EditOutlined />,
            onClick: () => handleEditLesson(lesson),
          },
          {
            key: 'duplicate',
            label: <IntlMessages id="curriculum.actions.duplicate" />,
            icon: <CopyOutlined />,
            onClick: () => handleDuplicateLesson(lesson),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: <IntlMessages id="curriculum.actions.delete" />,
            icon: <DeleteOutlined />,
            onClick: () => handleDeleteLesson(lesson),
            danger: true,
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm tên bài học, mô tả..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={chapterFilter}
              onChange={setChapterFilter}
              style={{ width: '100%' }}
              placeholder="Chọn chương"
            >
              <Option value="all">Tất cả chương</Option>
              {chapters.map((chapter) => (
                <Option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              {filterOptions?.statuses.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={contentFilter}
              onChange={setContentFilter}
              style={{ width: '100%' }}
              placeholder="Nội dung"
            >
              {filterOptions?.contentTypes.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={2}>
            <Button icon={<FilterOutlined />} onClick={onClearFilters}>
              <IntlMessages id="curriculum.filter.clear" />
            </Button>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddLesson}>
              <IntlMessages id="curriculum.actions.add" />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài học`,
          onChange: (page, pageSize) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10,
            }));
          },
        }}
        size="middle"
        scroll={{ x: 1000 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={
          editingLesson ? (
            <IntlMessages id="curriculum.lesson.edit.title" />
          ) : (
            <IntlMessages id="curriculum.lesson.add.title" />
          )
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label={<IntlMessages id="curriculum.lesson.name.label" />}
            rules={[
              { required: true, message: 'Vui lòng nhập tên bài học' },
              { max: 150, message: 'Tên bài học không được quá 150 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên bài học..." />
          </Form.Item>

          <Form.Item
            name="shortDescription"
            label={<IntlMessages id="curriculum.lesson.description.label" />}
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả ngắn' },
              { max: 300, message: 'Mô tả không được quá 300 ký tự' },
            ]}
          >
            <TextArea rows={2} placeholder="Nhập mô tả ngắn..." showCount maxLength={300} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="chapterId"
                label={<IntlMessages id="curriculum.lesson.chapter.label" />}
                rules={[{ required: true, message: 'Vui lòng chọn chương' }]}
              >
                <Select placeholder="Chọn chương...">
                  {chapters.map((chapter) => (
                    <Option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label={<IntlMessages id="curriculum.lesson.duration.label" />}
                rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
              >
                <InputNumber
                  min={5}
                  max={180}
                  style={{ width: '100%' }}
                  placeholder="Thời lượng (phút)"
                  addonAfter="phút"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="order" label={<IntlMessages id="curriculum.lesson.order.label" />}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="Thứ tự" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<IntlMessages id="curriculum.lesson.status.label" />}
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">
                    <IntlMessages id="curriculum.status.active" />
                  </Option>
                  <Option value="inactive">
                    <IntlMessages id="curriculum.status.inactive" />
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                <IntlMessages id="common.cancel" />
              </Button>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="common.save" />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Duplicate Modal */}
      <Modal
        title={<IntlMessages id="curriculum.duplicate.title" />}
        open={duplicateModalVisible}
        onCancel={() => setDuplicateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={duplicateForm} layout="vertical" onFinish={handleDuplicateSubmit}>
          <Form.Item
            name="targetChapterId"
            label={<IntlMessages id="curriculum.duplicate.target.label" />}
            rules={[{ required: true, message: 'Vui lòng chọn chương đích' }]}
          >
            <Select placeholder="Chọn chương đích...">
              {chapters.map((chapter) => (
                <Option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="newName"
            label={<IntlMessages id="curriculum.duplicate.name.label" />}
            rules={[
              { required: true, message: 'Vui lòng nhập tên bài học mới' },
              { max: 150, message: 'Tên bài học không được quá 150 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên bài học mới..." />
          </Form.Item>

          <Form.Item label={<IntlMessages id="curriculum.duplicate.content.label" />}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item name="includeText" valuePropName="checked" style={{ marginBottom: 8 }}>
                <Checkbox>
                  <FileTextOutlined style={{ marginRight: 8 }} />
                  <IntlMessages id="curriculum.duplicate.content.text" />
                </Checkbox>
              </Form.Item>
              <Form.Item name="includeVideo" valuePropName="checked" style={{ marginBottom: 8 }}>
                <Checkbox>
                  <VideoCameraOutlined style={{ marginRight: 8 }} />
                  <IntlMessages id="curriculum.duplicate.content.video" />
                </Checkbox>
              </Form.Item>
              <Form.Item name="includeQuiz" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>
                  <QuestionCircleOutlined style={{ marginRight: 8 }} />
                  <IntlMessages id="curriculum.duplicate.content.quiz" />
                </Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDuplicateModalVisible(false)}>
                <IntlMessages id="common.cancel" />
              </Button>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="curriculum.actions.duplicate" />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LessonManagement;
