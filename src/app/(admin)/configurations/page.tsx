'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  Typography,
  Tooltip,
  Descriptions,
  Spin,
} from 'antd';
import { EditOutlined, EyeOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRoleGuard } from '@/@crema/hooks/useRoleGuard';
import {
  useGetConfigurations,
  useCreateConfiguration,
  useUpdateConfiguration,
  useGetConfigurationByKey,
  parseConfigValue,
} from '@/@crema/services/apis/configurations';
import { Configuration, ConfigurationDataType } from '@/types/configuration';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ConfigurationsPage() {
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Role guard
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });

  // State
  const [searchText, setSearchText] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null);
  const [detailKey, setDetailKey] = useState<string | null>(null);

  // API params
  const apiParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      pageSize: pageSize,
    };

    if (searchText) {
      params.search = searchText;
    }

    if (dataTypeFilter !== 'all') {
      params.dataType = dataTypeFilter;
    }

    return params;
  }, [currentPage, pageSize, searchText, dataTypeFilter]);

  // API calls
  const { data: configurationsRes, isLoading, refetch } = useGetConfigurations(apiParams);
  const createMutation = useCreateConfiguration();
  const updateMutation = useUpdateConfiguration();
  const detailQuery = useGetConfigurationByKey(
    detailKey || '',
    !!detailKey && isDetailModalVisible,
  );

  // Map data
  const configurations = useMemo(() => {
    if (!configurationsRes?.items) return [];
    return configurationsRes.items;
  }, [configurationsRes]);

  const total = useMemo(() => {
    return configurationsRes?.total || 0;
  }, [configurationsRes]);

  // Check if authorized
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Text>Đang kiểm tra quyền truy cập...</Text>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // Handlers
  const handleEdit = (config: Configuration) => {
    setSelectedConfig(config);
    editForm.setFieldsValue({
      key: config.key,
      value: config.value,
      description: config.description,
      dataType: config.dataType,
    });
    setIsEditModalVisible(true);
  };

  const handleViewDetail = (config: Configuration) => {
    setSelectedConfig(config);
    setDetailKey(config.key);
    setIsDetailModalVisible(true);
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      await createMutation.mutateAsync({
        key: values.key,
        value: values.value,
        description: values.description,
        dataType: values.dataType,
      });
      setIsCreateModalVisible(false);
      createForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Create error:', error);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedConfig) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedConfig.id,
        key: values.key,
        value: values.value,
        description: values.description,
        dataType: values.dataType,
      });
      setIsEditModalVisible(false);
      setSelectedConfig(null);
      editForm.resetFields();
      refetch();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // Helpers
  const getDataTypeColor = (dataType: ConfigurationDataType) => {
    const colors = {
      string: 'blue',
      number: 'green',
      boolean: 'orange',
      json: 'purple',
    };
    return colors[dataType] || 'default';
  };

  const getDataTypeLabel = (dataType: ConfigurationDataType) => {
    const labels = {
      string: 'Chuỗi',
      number: 'Số',
      boolean: 'Boolean',
      json: 'JSON',
    };
    return labels[dataType] || dataType;
  };

  // Table columns
  const columns: ColumnsType<Configuration> = [
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: 150,
      ellipsis: true,
      render: (value: string, record) => {
        const displayValue =
          record.dataType === 'json'
            ? JSON.stringify(parseConfigValue(value, record.dataType))
            : value;
        return (
          <Tooltip title={displayValue}>
            <Text className="font-mono" ellipsis>
              {displayValue}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Loại dữ liệu',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 120,
      align: 'center',
      render: (dataType: ConfigurationDataType) => (
        <Tag color={getDataTypeColor(dataType)}>{getDataTypeLabel(dataType)}</Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (description?: string) => (
        <Tooltip title={description}>
          <Text type="secondary" ellipsis>
            {description || '-'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            <SettingOutlined className="mr-2" />
            Quản lý Cấu hình
          </Title>
          <Text type="secondary">Quản lý cấu hình hệ thống</Text>
        </div>
        <Space>
          {/* <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo cấu hình
          </Button> */}
        </Space>
      </div>

      {/* Main Card */}
      <Card className="card-3d">
        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Tìm kiếm theo Key hoặc Value..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select value={dataTypeFilter} onChange={setDataTypeFilter} style={{ width: 150 }}>
            <Select.Option value="all">Tất cả loại</Select.Option>
            <Select.Option value="string">Chuỗi</Select.Option>
            <Select.Option value="number">Số</Select.Option>
            <Select.Option value="boolean">Boolean</Select.Option>
            <Select.Option value="json">JSON</Select.Option>
          </Select>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={configurations}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 950 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} cấu hình`,
          }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Tạo cấu hình mới"
        open={isCreateModalVisible}
        destroyOnHidden
        getContainer={false}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        confirmLoading={createMutation.isPending}
        width={600}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit} className="mt-4">
          <Form.Item
            name="key"
            label="Key"
            rules={[
              { required: true, message: 'Vui lòng nhập key!' },
              { max: 100, message: 'Key tối đa 100 ký tự!' },
              {
                pattern: /^[a-zA-Z0-9._-]+$/,
                message: 'Key chỉ được chứa chữ, số, dấu chấm, gạch dưới và gạch ngang!',
              },
            ]}
          >
            <Input placeholder="VD: app.max_upload_size" />
          </Form.Item>

          <Form.Item
            name="dataType"
            label="Loại dữ liệu"
            initialValue="string"
            rules={[{ required: true, message: 'Vui lòng chọn loại dữ liệu!' }]}
          >
            <Select>
              <Select.Option value="string">Chuỗi</Select.Option>
              <Select.Option value="number">Số</Select.Option>
              <Select.Option value="boolean">Boolean</Select.Option>
              <Select.Option value="json">JSON</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Value"
            rules={[
              { required: true, message: 'Vui lòng nhập value!' },
              { max: 255, message: 'Value tối đa 255 ký tự!' },
            ]}
          >
            <Input placeholder="Giá trị cấu hình" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả về cấu hình này..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa cấu hình"
        open={isEditModalVisible}
        destroyOnHidden
        getContainer={false}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedConfig(null);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        confirmLoading={updateMutation.isPending}
        width={600}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} className="mt-4">
          <Form.Item
            name="key"
            label="Key"
            rules={[
              { required: true, message: 'Vui lòng nhập key!' },
              { max: 100, message: 'Key tối đa 100 ký tự!' },
              {
                pattern: /^[a-zA-Z0-9._-]+$/,
                message: 'Key chỉ được chứa chữ, số, dấu chấm, gạch dưới và gạch ngang!',
              },
            ]}
          >
            <Input placeholder="VD: app.max_upload_size" />
          </Form.Item>

          <Form.Item
            name="dataType"
            label="Loại dữ liệu"
            rules={[{ required: true, message: 'Vui lòng chọn loại dữ liệu!' }]}
          >
            <Select>
              <Select.Option value="string">Chuỗi</Select.Option>
              <Select.Option value="number">Số</Select.Option>
              <Select.Option value="boolean">Boolean</Select.Option>
              <Select.Option value="json">JSON</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Value"
            rules={[
              { required: true, message: 'Vui lòng nhập value!' },
              { max: 255, message: 'Value tối đa 255 ký tự!' },
            ]}
          >
            <Input placeholder="Giá trị cấu hình" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả về cấu hình này..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết cấu hình"
        open={isDetailModalVisible}
        destroyOnHidden
        getContainer={false}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedConfig(null);
          setDetailKey(null);
        }}
        footer={null}
        width={640}
      >
        {detailQuery.isFetching && (
          <div className="flex justify-center items-center py-10">
            <Spin />
          </div>
        )}
        {!detailQuery.isFetching &&
          (detailQuery.data?.data || selectedConfig) &&
          (() => {
            const cfg = (detailQuery.data?.data as Configuration) || selectedConfig!;
            return (
              <Descriptions bordered column={1} size="middle" className="mt-4">
                <Descriptions.Item label="Key">
                  <Text strong className="font-mono">
                    {cfg.key}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Loại dữ liệu">
                  <Tag color={getDataTypeColor(cfg.dataType)}>{getDataTypeLabel(cfg.dataType)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Value">
                  {cfg.dataType === 'json' ? (
                    <pre className="bg-gray-50 p-3 rounded-md overflow-auto max-h-60">
                      {JSON.stringify(parseConfigValue(cfg.value, cfg.dataType), null, 2)}
                    </pre>
                  ) : (
                    <Text className="font-mono">{cfg.value}</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  <Text type="secondary">{cfg.description || '-'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {cfg.createdAt ? new Date(cfg.createdAt as any).toLocaleDateString('vi-VN') : '-'}
                </Descriptions.Item>
              </Descriptions>
            );
          })()}
      </Modal>
    </div>
  );
}
