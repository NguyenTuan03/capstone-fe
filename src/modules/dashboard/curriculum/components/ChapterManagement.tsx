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
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  DragOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CurriculumApiService } from '@/services/curriculumApi';
import {
  Chapter,
  GetChaptersParams,
  CreateChapterRequest,
  UpdateChapterRequest,
  CurriculumFilterOptions,
} from '@/types/curriculum';

const { Option } = Select;
const { TextArea } = Input;

interface ChapterManagementProps {
  searchText: string;
  setSearchText: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filterOptions: CurriculumFilterOptions | null;
  onClearFilters: () => void;
  onStatsUpdate: () => void;
}

const ChapterManagement: React.FC<ChapterManagementProps> = ({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  filterOptions,
  onClearFilters,
  onStatsUpdate,
}) => {
  // States
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [form] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load chapters
  const loadChapters = async () => {
    setLoading(true);
    try {
      const params: GetChaptersParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
        sortBy: 'order',
        sortOrder: 'asc',
      };

      const response = await CurriculumApiService.getChapters(params);
      setChapters(response.chapters);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
      onStatsUpdate();
    } catch (error) {
      message.error('Không thể tải danh sách chương');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadChapters();
  }, [pagination.current, pagination.pageSize]);

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadChapters();
  };

  const handleAddChapter = () => {
    setEditingChapter(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'active',
      order: chapters.length + 1,
    });
    setModalVisible(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    form.setFieldsValue({
      name: chapter.name,
      description: chapter.description,
      order: chapter.order,
      status: chapter.status,
    });
    setModalVisible(true);
  };

  const handleDeleteChapter = (chapter: Chapter) => {
    Modal.confirm({
      title: <IntlMessages id="curriculum.delete.chapter.title" />,
      content:
        chapter.lessonsCount > 0 ? (
          <div>
            <p>
              <IntlMessages
                id="curriculum.delete.chapter.warning"
                values={{ count: chapter.lessonsCount }}
              />
            </p>
          </div>
        ) : (
          <IntlMessages id="curriculum.delete.chapter.message" values={{ name: chapter.name }} />
        ),
      okText: <IntlMessages id="common.yes" />,
      cancelText: <IntlMessages id="common.no" />,
      okType: chapter.lessonsCount > 0 ? 'default' : 'danger',
      onOk: async () => {
        if (chapter.lessonsCount > 0) {
          message.warning('Không thể xóa chương đã có bài học');
          return;
        }

        try {
          const response = await CurriculumApiService.deleteChapter(chapter.id);
          if (response.success) {
            message.success(response.message);
            loadChapters();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error('Không thể xóa chương');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingChapter) {
        // Update chapter
        const request: UpdateChapterRequest = {
          id: editingChapter.id,
          name: values.name,
          description: values.description,
          order: values.order,
          status: values.status,
        };

        const response = await CurriculumApiService.updateChapter(request);
        if (response.success) {
          message.success(response.message);
          setModalVisible(false);
          loadChapters();
        } else {
          message.error(response.message);
        }
      } else {
        // Create chapter
        const request: CreateChapterRequest = {
          name: values.name,
          description: values.description,
          order: values.order,
          status: values.status,
        };

        const response = await CurriculumApiService.createChapter(request);
        if (response.success) {
          message.success(response.message);
          setModalVisible(false);
          loadChapters();
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error('Không thể lưu chương');
    }
  };

  // Table columns
  const columns: ColumnsType<Chapter> = [
    {
      title: <IntlMessages id="curriculum.chapter.table.order" />,
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order: number) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{order}</div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.chapter.table.name" />,
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Chapter) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '14px' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.chapter.table.description" />,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description: string) => (
        <Tooltip title={description}>
          <span>{description}</span>
        </Tooltip>
      ),
    },
    {
      title: <IntlMessages id="curriculum.chapter.table.lessons" />,
      dataIndex: 'lessonsCount',
      key: 'lessonsCount',
      width: 120,
      render: (count: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>{count}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>bài học</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.chapter.table.duration" />,
      dataIndex: 'totalDuration',
      key: 'totalDuration',
      width: 120,
      render: (duration: number) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
            {CurriculumApiService.formatDuration(duration)}
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.chapter.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          <IntlMessages id={`curriculum.status.${status}`} />
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="curriculum.chapter.table.actions" />,
      key: 'actions',
      width: 120,
      render: (_, chapter) => {
        const menuItems = [
          {
            key: 'view',
            label: <IntlMessages id="curriculum.actions.view" />,
            icon: <EyeOutlined />,
            onClick: () => console.log('View chapter:', chapter.id),
          },
          {
            key: 'edit',
            label: <IntlMessages id="curriculum.actions.edit" />,
            icon: <EditOutlined />,
            onClick: () => handleEditChapter(chapter),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: <IntlMessages id="curriculum.actions.delete" />,
            icon: <DeleteOutlined />,
            onClick: () => handleDeleteChapter(chapter),
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
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm tên chương, mô tả..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
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
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<FilterOutlined />} onClick={onClearFilters}>
              <IntlMessages id="curriculum.filter.clear" />
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddChapter}>
              <IntlMessages id="curriculum.actions.add" />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={chapters}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chương`,
          onChange: (page, pageSize) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10,
            }));
          },
        }}
        size="middle"
      />

      {/* Add/Edit Modal */}
      <Modal
        title={
          editingChapter ? (
            <IntlMessages id="curriculum.chapter.edit.title" />
          ) : (
            <IntlMessages id="curriculum.chapter.add.title" />
          )
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label={<IntlMessages id="curriculum.chapter.name.label" />}
            rules={[
              { required: true, message: 'Vui lòng nhập tên chương' },
              { max: 100, message: 'Tên chương không được quá 100 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên chương..." />
          </Form.Item>

          <Form.Item
            name="description"
            label={<IntlMessages id="curriculum.chapter.description.label" />}
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả' },
              { max: 500, message: 'Mô tả không được quá 500 ký tự' },
            ]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả chương..." showCount maxLength={500} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="order"
                label={<IntlMessages id="curriculum.chapter.order.label" />}
                rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="Thứ tự" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<IntlMessages id="curriculum.chapter.status.label" />}
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
    </div>
  );
};

export default ChapterManagement;
