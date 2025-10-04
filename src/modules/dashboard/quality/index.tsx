'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Avatar,
  Modal,
  Form,
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Dropdown,
  Tooltip,
  Badge,
  Rate,
  List,
  Progress,
  Alert,
  Upload,
  Image,
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  StopOutlined,
  PlayCircleOutlined,
  FilterOutlined,
  ExportOutlined,
  MoreOutlined,
  StarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  VideoCameraOutlined,
  FileImageOutlined,
  UploadOutlined,
  PlayCircleFilled,
  FlagOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

import { CoachApiService } from '@/services/coachApi';
import { CoachQuality, CoachReview, SuspendCoachRequest } from '@/types/coach';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

export default function QualityPageClient() {
  const [coaches, setCoaches] = useState<CoachQuality[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachQuality | null>(null);
  const [coachReviews, setCoachReviews] = useState<CoachReview[]>([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isSuspendModalVisible, setIsSuspendModalVisible] = useState(false);
  const [suspendReasons, setSuspendReasons] = useState<string[]>([]);
  const [suspendForm] = Form.useForm();
  const [evidenceFiles, setEvidenceFiles] = useState<UploadFile[]>([]);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  // Load quality data
  const loadQualityData = async () => {
    setLoading(true);
    try {
      const qualityData = await CoachApiService.getCoachQualities();

      // Apply filters
      let filteredData = [...qualityData];

      if (searchText) {
        const searchTerm = searchText.toLowerCase();
        filteredData = filteredData.filter(
          (coach) =>
            coach.name.toLowerCase().includes(searchTerm) ||
            coach.email.toLowerCase().includes(searchTerm),
        );
      }

      if (statusFilter !== 'all') {
        filteredData = filteredData.filter((coach) => coach.status === statusFilter);
      }

      if (ratingFilter > 0) {
        filteredData = filteredData.filter((coach) => coach.rating >= ratingFilter);
      }

      setCoaches(filteredData);
    } catch (error) {
      message.error('Không thể tải dữ liệu chất lượng');
    } finally {
      setLoading(false);
    }
  };

  // Load suspend reasons
  const loadSuspendReasons = async () => {
    try {
      const reasons = await CoachApiService.getSuspendReasons();
      setSuspendReasons(reasons);
    } catch (error) {
      console.error('Failed to load suspend reasons:', error);
    }
  };

  useEffect(() => {
    loadQualityData();
    loadSuspendReasons();
  }, [searchText, statusFilter, ratingFilter]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'suspended':
        return 'red';
      default:
        return 'default';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'green';
    if (rating >= 4.0) return 'blue';
    if (rating >= 3.5) return 'orange';
    return 'red';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Quality actions
  const handleViewReviews = async (coachId: string) => {
    try {
      const coach = coaches.find((c) => c.id === coachId);
      const reviews = await CoachApiService.getCoachReviews(coachId);

      if (coach && reviews) {
        setSelectedCoach(coach);
        setCoachReviews(reviews);
        setIsReviewModalVisible(true);
      }
    } catch (error) {
      message.error('Không thể tải đánh giá');
    }
  };

  const handleSuspendCoach = (coach: CoachQuality) => {
    setSelectedCoach(coach);
    setIsSuspendModalVisible(true);
    suspendForm.resetFields();
    setEvidenceFiles([]);
  };

  const handleRestoreCoach = async (coachId: string, coachName: string) => {
    Modal.confirm({
      title: 'Xác nhận khôi phục',
      content: `Bạn có chắc chắn muốn khôi phục huấn luyện viên ${coachName}?`,
      okText: 'Khôi phục',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await CoachApiService.restoreCoach(coachId, 'current_admin');
          message.success('Đã khôi phục huấn luyện viên thành công');
          loadQualityData();
        } catch (error) {
          message.error('Không thể khôi phục huấn luyện viên');
        }
      },
    });
  };

  const submitSuspend = async (values: {
    reason: string;
    customReason?: string;
    notes?: string;
  }) => {
    if (!selectedCoach) return;

    const finalReason =
      values.reason === 'Khác (tự nhập lý do)'
        ? values.customReason || values.reason
        : values.reason;

    // Simulate evidence URLs (in real app, these would be uploaded to server)
    const evidenceUrls = evidenceFiles.map((file) => `https://example.com/evidence/${file.name}`);

    const suspendRequest: SuspendCoachRequest = {
      coachId: selectedCoach.id,
      reason: finalReason,
      evidence: evidenceUrls.length > 0 ? evidenceUrls : undefined,
      adminId: 'current_admin',
      notes: values.notes,
    };

    Modal.confirm({
      title: 'Xác nhận đình chỉ',
      content: (
        <div>
          <p>
            Bạn có chắc chắn muốn đình chỉ huấn luyện viên <strong>{selectedCoach.name}</strong>?
          </p>
          <p className="text-red-600 font-medium">Lý do: {finalReason}</p>
          {evidenceUrls.length > 0 && (
            <p className="text-gray-500 text-sm">Bằng chứng: {evidenceUrls.length} file</p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            Huấn luyện viên sẽ không thể nhận buổi học mới sau khi bị đình chỉ.
          </p>
        </div>
      ),
      okText: 'Xác nhận đình chỉ',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await CoachApiService.suspendCoach(suspendRequest);
          message.success('Đã đình chỉ huấn luyện viên thành công');
          setIsSuspendModalVisible(false);
          loadQualityData();
        } catch (error) {
          message.error('Không thể đình chỉ huấn luyện viên');
        }
      },
    });
  };

  // Action dropdown menu
  const getActionMenu = (coach: CoachQuality): MenuProps['items'] => [
    {
      key: 'reviews',
      icon: <EyeOutlined />,
      label: 'Xem đánh giá',
      onClick: () => handleViewReviews(coach.id),
    },
    {
      type: 'divider',
    },
    ...(coach.status === 'active'
      ? [
          {
            key: 'suspend',
            icon: <StopOutlined />,
            label: 'Tạm ngưng hoạt động',
            onClick: () => handleSuspendCoach(coach),
            danger: true,
          },
        ]
      : []),
    ...(coach.status === 'suspended'
      ? [
          {
            key: 'restore',
            icon: <PlayCircleOutlined />,
            label: 'Khôi phục hoạt động',
            onClick: () => handleRestoreCoach(coach.id, coach.name),
          },
        ]
      : []),
  ];

  // Table columns
  const columns: ColumnsType<CoachQuality> = [
    {
      title: 'Huấn luyện viên',
      key: 'coach',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} className="bg-blue-500" size="large">
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Text className="font-medium">{record.name}</Text>
              {record.rating >= 4.5 && (
                <Tooltip title="Huấn luyện viên xuất sắc">
                  <TrophyOutlined className="text-yellow-500" />
                </Tooltip>
              )}
            </div>
            <Text className="text-sm text-gray-500">{record.email}</Text>
            <Badge
              status={getStatusColor(record.status) as any}
              text={
                record.status === 'active'
                  ? 'Đang hoạt động'
                  : record.status === 'suspended'
                    ? 'Bị tạm ngưng'
                    : 'Chờ duyệt'
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Chất lượng',
      key: 'quality',
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Rate disabled value={record.rating} allowHalf />
            <Tag color={getRatingColor(record.rating)}>{record.rating.toFixed(1)}</Tag>
          </div>
          <div className="text-sm text-gray-500">{record.totalReviews} đánh giá</div>
          {record.hasComplaints && (
            <div className="flex items-center space-x-1">
              <WarningOutlined className="text-red-500" />
              <Text className="text-red-500 text-xs">{record.complaintsCount} khiếu nại</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hiệu suất',
      key: 'performance',
      width: 200,
      render: (_, record) => (
        <div className="space-y-2">
          <div>
            <Text className="text-xs text-gray-500">Hoàn thành:</Text>
            <Progress
              percent={record.sessionCompletionRate}
              size="small"
              status={
                record.sessionCompletionRate >= 95
                  ? 'success'
                  : record.sessionCompletionRate >= 85
                    ? 'normal'
                    : 'exception'
              }
            />
          </div>
          <div>
            <Text className="text-xs text-gray-500">Giữ chân:</Text>
            <Progress
              percent={record.studentRetentionRate}
              size="small"
              status={
                record.studentRetentionRate >= 80
                  ? 'success'
                  : record.studentRetentionRate >= 60
                    ? 'normal'
                    : 'exception'
              }
            />
          </div>
          <div className="text-xs text-gray-500">Phản hồi: {record.responseTime.toFixed(1)}h</div>
        </div>
      ),
    },
    {
      title: 'Vấn đề',
      key: 'issues',
      width: 120,
      render: (_, record) => (
        <div className="space-y-1">
          {record.hasComplaints ? (
            <div className="space-y-1">
              <Tag color="red" icon={<ExclamationCircleOutlined />}>
                {record.complaintsCount} khiếu nại
              </Tag>
              {record.lastComplaintDate && (
                <div className="text-xs text-gray-500">
                  Gần nhất: {formatDate(record.lastComplaintDate)}
                </div>
              )}
            </div>
          ) : (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Không có vấn đề
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenu(record) }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Title level={2}>Giám sát chất lượng huấn luyện viên</Title>
          <Text className="text-gray-600">
            Theo dõi và đánh giá chất lượng giảng dạy của huấn luyện viên
          </Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
        </Space>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Search
                placeholder="Tìm kiếm huấn luyện viên..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <FilterOutlined />
              <Text>Bộ lọc:</Text>
            </div>

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
              placeholder="Trạng thái"
            >
              <Option value="all">Tất cả</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="suspended">Đình chỉ</Option>
            </Select>

            <Select
              value={ratingFilter}
              onChange={setRatingFilter}
              className="w-40"
              placeholder="Đánh giá tối thiểu"
            >
              <Option value={0}>Tất cả đánh giá</Option>
              <Option value={3}>3+ sao</Option>
              <Option value={4}>4+ sao</Option>
              <Option value={4.5}>4.5+ sao</Option>
            </Select>

            <Button
              onClick={() => {
                setStatusFilter('all');
                setRatingFilter(0);
                setSearchText('');
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </Card>

      {/* Quality Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={coaches}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng số ${total} huấn luyện viên`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Review Detail Modal */}
      <Modal
        title="Xem đánh giá chi tiết"
        open={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
        width={1200}
      >
        {selectedCoach && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar src={selectedCoach.avatar} size="large">
                {selectedCoach.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Title level={4} className="mb-0">
                  {selectedCoach.name}
                </Title>
                <div className="flex items-center space-x-2">
                  <Rate disabled value={selectedCoach.rating} allowHalf />
                  <Text>
                    {selectedCoach.rating.toFixed(1)} ({selectedCoach.totalReviews} đánh giá)
                  </Text>
                </div>
              </div>
            </div>

            <List
              dataSource={coachReviews}
              renderItem={(review: CoachReview) => (
                <List.Item
                  actions={[
                    review.sessionVideo && (
                      <Button
                        type="link"
                        icon={<PlayCircleFilled />}
                        onClick={() => window.open(review.sessionVideo, '_blank')}
                      >
                        Xem video
                      </Button>
                    ),
                    review.reviewVideo && (
                      <Button
                        type="link"
                        icon={<VideoCameraOutlined />}
                        onClick={() => window.open(review.reviewVideo, '_blank')}
                      >
                        Video phản hồi
                      </Button>
                    ),
                    review.isReported && (
                      <Tag color="red" icon={<FlagOutlined />}>
                        Báo cáo
                      </Tag>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src={review.studentAvatar}>{review.studentName.charAt(0)}</Avatar>
                    }
                    title={
                      <div className="flex items-center space-x-2">
                        <Text className="font-medium">{review.studentName}</Text>
                        <Rate disabled value={review.rating} />
                        <Text className="text-gray-500 text-sm">
                          {formatDate(review.createdAt)}
                        </Text>
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <Text>{review.comment}</Text>
                        {review.adminReviewed && review.adminNotes && (
                          <Alert
                            message="Ghi chú admin"
                            description={review.adminNotes}
                            type="info"
                            showIcon
                            className="mt-2"
                          />
                        )}
                        {review.isReported && review.reportReason && (
                          <Alert
                            message="Lý do báo cáo"
                            description={review.reportReason}
                            type="warning"
                            showIcon
                            className="mt-2"
                          />
                        )}
                        {!review.sessionVideo && (
                          <Text className="text-gray-400 text-sm">Không có video ghi hình</Text>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>

      {/* Suspend Modal */}
      <Modal
        title="Tạm ngưng hoạt động"
        open={isSuspendModalVisible}
        onCancel={() => setIsSuspendModalVisible(false)}
        footer={null}
        width={700}
      >
        <div className="mb-4">
          <Text className="text-gray-600">
            Bạn có chắc chắn muốn tạm ngưng hoạt động của huấn luyện viên này?
          </Text>
        </div>

        <Form form={suspendForm} layout="vertical" onFinish={submitSuspend}>
          <Form.Item
            name="reason"
            label="Lý do tạm ngưng"
            rules={[{ required: true, message: 'Vui lòng chọn lý do đình chỉ' }]}
          >
            <Select
              placeholder="Chọn lý do đình chỉ..."
              onChange={(value) => {
                if (value !== 'Khác (tự nhập lý do)') {
                  suspendForm.setFieldsValue({ customReason: value });
                } else {
                  suspendForm.setFieldsValue({ customReason: '' });
                }
              }}
            >
              {suspendReasons.map((reason) => (
                <Option key={reason} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.reason !== currentValues.reason}
          >
            {({ getFieldValue }) => {
              const selectedReason = getFieldValue('reason');
              return selectedReason === 'Khác (tự nhập lý do)' ? (
                <Form.Item
                  name="customReason"
                  label="Lý do khác"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập chi tiết lý do đình chỉ',
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Nhập chi tiết lý do đình chỉ..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Form.Item name="evidence" label={'Bằng chứng'}>
            <Upload
              multiple
              listType="picture-card"
              fileList={evidenceFiles}
              beforeUpload={() => false}
              onChange={({ fileList }) => setEvidenceFiles(fileList)}
              accept="image/*,video/*"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="notes" label={'Ghi chú'}>
            <TextArea
              rows={3}
              placeholder="Ghi chú thêm cho việc đình chỉ..."
              maxLength={300}
              showCount
            />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsSuspendModalVisible(false)}>Hủy</Button>
            <Button type="primary" danger htmlType="submit">
              Tạm ngưng
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
