'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Typography,
  Row,
  Col,
  message,
  Descriptions,
  Tooltip,
  Tabs,
  Image,
} from 'antd';
import {
  PlayCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Types
interface VideoData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  duration: number;
  drillName?: string;
  drillDescription?: string;
  drillPracticeSets?: string;
  publicUrl: string;
  thumbnailUrl?: string;
  status: string;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
}

interface QuizData {
  id: string;
  title: string;
  description?: string;
  level: string;
  totalQuestions: number;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
}

export default function CourseVerificationPage() {
  const [activeTab, setActiveTab] = useState('videos');

  // Videos state
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isVideoDetailModalVisible, setIsVideoDetailModalVisible] = useState(false);
  const [isApproveVideoModalVisible, setIsApproveVideoModalVisible] = useState(false);
  const [isRejectVideoModalVisible, setIsRejectVideoModalVisible] = useState(false);
  const [videoRejectReason, setVideoRejectReason] = useState('');

  // Quizzes state
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [isQuizDetailModalVisible, setIsQuizDetailModalVisible] = useState(false);
  const [isApproveQuizModalVisible, setIsApproveQuizModalVisible] = useState(false);
  const [isRejectQuizModalVisible, setIsRejectQuizModalVisible] = useState(false);
  const [quizRejectReason, setQuizRejectReason] = useState('');

  // Filters
  const [videoSearchText, setVideoSearchText] = useState('');
  const [videoStatusFilter, setVideoStatusFilter] = useState<string>('all');
  const [videoCurrentPage, setVideoCurrentPage] = useState(1);
  const [videoPageSize, setVideoPageSize] = useState(10);
  const [videoTotal, setVideoTotal] = useState(0);

  const [quizSearchText, setQuizSearchText] = useState('');
  const [quizLevelFilter, setQuizLevelFilter] = useState<string>('all');
  const [quizCurrentPage, setQuizCurrentPage] = useState(1);
  const [quizPageSize, setQuizPageSize] = useState(10);
  const [quizTotal, setQuizTotal] = useState(0);

  // Load videos data
  const loadVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const { videos: mockVideos } = await import('@/data_admin/videos');

      let filteredVideos = mockVideos.map((video) => ({
        id: video.id.toString(),
        title: video.title,
        description: video.description || '',
        tags: video.tags || [],
        duration: video.duration,
        drillName: video.drillName,
        drillDescription: video.drillDescription,
        drillPracticeSets: video.drillPracticeSets,
        publicUrl: video.publicUrl,
        thumbnailUrl: video.thumbnailUrl,
        status: video.status,
        coachName: video.uploadedBy.fullName,
        coachEmail: video.uploadedBy.email,
        coachAvatar: video.uploadedBy.profilePicture || '',
      }));

      // Apply filters
      if (videoSearchText) {
        const search = videoSearchText.toLowerCase();
        filteredVideos = filteredVideos.filter(
          (v) =>
            v.title.toLowerCase().includes(search) || v.coachName.toLowerCase().includes(search),
        );
      }

      if (videoStatusFilter !== 'all') {
        filteredVideos = filteredVideos.filter((v) => v.status === videoStatusFilter);
      }

      // Pagination
      const start = (videoCurrentPage - 1) * videoPageSize;
      const end = start + videoPageSize;
      const paginatedVideos = filteredVideos.slice(start, end);

      setVideos(paginatedVideos);
      setVideoTotal(filteredVideos.length);
    } catch (error) {
      console.error('Error loading videos:', error);
      message.error('Không thể tải danh sách video');
    } finally {
      setLoadingVideos(false);
    }
  }, [videoCurrentPage, videoPageSize, videoSearchText, videoStatusFilter]);

  // Load quizzes data
  const loadQuizzes = useCallback(async () => {
    setLoadingQuizzes(true);
    try {
      const { quizzes: mockQuizzes } = await import('@/data_admin/quizzes');

      let filteredQuizzes = mockQuizzes.map((quiz) => ({
        id: quiz.id.toString(),
        title: quiz.title,
        description: quiz.description,
        level: quiz.level,
        totalQuestions: quiz.totalQuestions,
        coachName: quiz.createdBy.fullName,
        coachEmail: quiz.createdBy.email,
        coachAvatar: quiz.createdBy.profilePicture || '',
      }));

      // Apply filters
      if (quizSearchText) {
        const search = quizSearchText.toLowerCase();
        filteredQuizzes = filteredQuizzes.filter(
          (q) =>
            q.title.toLowerCase().includes(search) || q.coachName.toLowerCase().includes(search),
        );
      }

      if (quizLevelFilter !== 'all') {
        filteredQuizzes = filteredQuizzes.filter((q) => q.level === quizLevelFilter);
      }

      // Pagination
      const start = (quizCurrentPage - 1) * quizPageSize;
      const end = start + quizPageSize;
      const paginatedQuizzes = filteredQuizzes.slice(start, end);

      setQuizzes(paginatedQuizzes);
      setQuizTotal(filteredQuizzes.length);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      message.error('Không thể tải danh sách quiz');
    } finally {
      setLoadingQuizzes(false);
    }
  }, [quizCurrentPage, quizPageSize, quizSearchText, quizLevelFilter]);

  useEffect(() => {
    if (activeTab === 'videos') {
      loadVideos();
    } else {
      loadQuizzes();
    }
  }, [activeTab, loadVideos, loadQuizzes]);

  // Reset page when filters change
  useEffect(() => {
    setVideoCurrentPage(1);
  }, [videoSearchText, videoStatusFilter]);

  useEffect(() => {
    setQuizCurrentPage(1);
  }, [quizSearchText, quizLevelFilter]);

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      UPLOADING: 'blue',
      PROCESSING: 'cyan',
      PENDING_APPROVAL: 'orange',
      APPROVED: 'green',
      REJECTED: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      UPLOADING: 'Đang tải lên',
      PROCESSING: 'Đang xử lý',
      PENDING_APPROVAL: 'Chờ phê duyệt',
      APPROVED: 'Đã phê duyệt',
      REJECTED: 'Đã từ chối',
    };
    return texts[status] || status;
  };

  const getLevelText = (level: string) => {
    const texts: { [key: string]: string } = {
      BEGINNER: 'Cơ bản',
      INTERMEDIATE: 'Trung cấp',
      ADVANCED: 'Nâng cao',
      PROFESSIONAL: 'Chuyên nghiệp',
    };
    return texts[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      BEGINNER: 'green',
      INTERMEDIATE: 'blue',
      ADVANCED: 'orange',
      PROFESSIONAL: 'red',
    };
    return colors[level] || 'default';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Video handlers
  const handleViewVideoDetails = (video: VideoData) => {
    setSelectedVideo(video);
    setIsVideoDetailModalVisible(true);
  };

  const handleApproveVideo = (video: VideoData) => {
    setSelectedVideo(video);
    setIsApproveVideoModalVisible(true);
  };

  const handleRejectVideo = (video: VideoData) => {
    setSelectedVideo(video);
    setIsRejectVideoModalVisible(true);
  };

  const confirmApproveVideo = () => {
    if (!selectedVideo) return;
    message.success(`Đã phê duyệt video "${selectedVideo.title}"`);
    setIsApproveVideoModalVisible(false);
    loadVideos();
  };

  const confirmRejectVideo = () => {
    if (!selectedVideo) return;
    if (!videoRejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    message.success(`Đã từ chối video "${selectedVideo.title}"`);
    setIsRejectVideoModalVisible(false);
    setVideoRejectReason('');
    loadVideos();
  };

  // Quiz handlers
  const handleViewQuizDetails = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setIsQuizDetailModalVisible(true);
  };

  const handleApproveQuiz = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setIsApproveQuizModalVisible(true);
  };

  const handleRejectQuiz = (quiz: QuizData) => {
    setSelectedQuiz(quiz);
    setIsRejectQuizModalVisible(true);
  };

  const confirmApproveQuiz = () => {
    if (!selectedQuiz) return;
    message.success(`Đã phê duyệt quiz "${selectedQuiz.title}"`);
    setIsApproveQuizModalVisible(false);
    loadQuizzes();
  };

  const confirmRejectQuiz = () => {
    if (!selectedQuiz) return;
    if (!quizRejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    message.success(`Đã từ chối quiz "${selectedQuiz.title}"`);
    setIsRejectQuizModalVisible(false);
    setQuizRejectReason('');
    loadQuizzes();
  };

  // Video columns
  const videoColumns: ColumnsType<VideoData> = [
    {
      title: 'Video',
      key: 'video',
      width: 350,
      render: (_, record) => (
        <div className="flex items-start gap-3">
          <div className="relative">
            {record.thumbnailUrl ? (
              <Image
                src={record.thumbnailUrl}
                alt={record.title}
                width={100}
                height={60}
                style={{ objectFit: 'cover', borderRadius: '4px' }}
                preview={false}
              />
            ) : (
              <div className="w-[100px] h-[60px] bg-gray-200 rounded flex items-center justify-center">
                <PlayCircleOutlined className="text-2xl text-gray-400" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
              {formatDuration(record.duration)}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-medium">{record.title}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{record.description}</div>
            {record.tags && record.tags.length > 0 && (
              <div className="mt-1">
                {record.tags.slice(0, 2).map((tag, idx) => (
                  <Tag key={idx} className="text-xs">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Huấn luyện viên',
      key: 'coach',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={32} src={record.coachAvatar} icon={<UserOutlined />} />
          <div>
            <div className="text-sm font-medium">{record.coachName}</div>
            <div className="text-xs text-gray-500">{record.coachEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewVideoDetails(record)}
            />
          </Tooltip>
          {record.status === 'PENDING_APPROVAL' && (
            <>
              <Tooltip title="Phê duyệt">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleApproveVideo(record)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleRejectVideo(record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Quiz columns
  const quizColumns: ColumnsType<QuizData> = [
    {
      title: 'Quiz',
      key: 'quiz',
      width: 300,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.title}</div>
          {record.description && (
            <div className="text-sm text-gray-500 mt-1">{record.description}</div>
          )}
          <div className="mt-1">
            <Tag color={getLevelColor(record.level)}>{getLevelText(record.level)}</Tag>
            <Tag>{record.totalQuestions} câu hỏi</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Huấn luyện viên',
      key: 'coach',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar size={32} src={record.coachAvatar} icon={<UserOutlined />} />
          <div>
            <div className="text-sm font-medium">{record.coachName}</div>
            <div className="text-xs text-gray-500">{record.coachEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewQuizDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Phê duyệt">
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApproveQuiz(record)}
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleRejectQuiz(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={2}>Quản lý Nội dung</Title>
        <Text className="text-gray-600">
          Quản lý và phê duyệt video, quiz do huấn luyện viên tạo
        </Text>
      </div>

      {/* Main Card with Tabs */}
      <Card className="card-3d">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'videos',
              label: (
                <span>
                  <VideoCameraOutlined /> Videos
                </span>
              ),
              children: (
                <>
                  {/* Video Filters */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={10}>
                      <Search
                        placeholder="Tìm kiếm theo tên video, huấn luyện viên..."
                        allowClear
                        onSearch={setVideoSearchText}
                        onChange={(e) => !e.target.value && setVideoSearchText('')}
                        prefix={<SearchOutlined />}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={5}>
                      <Select
                        style={{ width: '100%' }}
                        value={videoStatusFilter}
                        onChange={setVideoStatusFilter}
                        suffixIcon={<FilterOutlined />}
                      >
                        <Option value="all">Tất cả trạng thái</Option>
                        <Option value="UPLOADING">Đang tải lên</Option>
                        <Option value="PROCESSING">Đang xử lý</Option>
                        <Option value="PENDING_APPROVAL">Chờ phê duyệt</Option>
                        <Option value="APPROVED">Đã phê duyệt</Option>
                        <Option value="REJECTED">Đã từ chối</Option>
                      </Select>
                    </Col>
                  </Row>

                  {/* Video Table */}
                  <Table
                    columns={videoColumns}
                    dataSource={videos}
                    loading={loadingVideos}
                    rowKey="id"
                    pagination={{
                      current: videoCurrentPage,
                      pageSize: videoPageSize,
                      total: videoTotal,
                      onChange: (page, size) => {
                        setVideoCurrentPage(page);
                        setVideoPageSize(size || 10);
                      },
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng ${total} video`,
                    }}
                  />
                </>
              ),
            },
            {
              key: 'quizzes',
              label: (
                <span>
                  <QuestionCircleOutlined /> Quizzes
                </span>
              ),
              children: (
                <>
                  {/* Quiz Filters */}
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12} md={10}>
                      <Search
                        placeholder="Tìm kiếm theo tên quiz, huấn luyện viên..."
                        allowClear
                        onSearch={setQuizSearchText}
                        onChange={(e) => !e.target.value && setQuizSearchText('')}
                        prefix={<SearchOutlined />}
                      />
                    </Col>
                    <Col xs={12} sm={6} md={5}>
                      <Select
                        style={{ width: '100%' }}
                        value={quizLevelFilter}
                        onChange={setQuizLevelFilter}
                        suffixIcon={<FilterOutlined />}
                      >
                        <Option value="all">Tất cả cấp độ</Option>
                        <Option value="BEGINNER">Cơ bản</Option>
                        <Option value="INTERMEDIATE">Trung cấp</Option>
                        <Option value="ADVANCED">Nâng cao</Option>
                        <Option value="PROFESSIONAL">Chuyên nghiệp</Option>
                      </Select>
                    </Col>
                  </Row>

                  {/* Quiz Table */}
                  <Table
                    columns={quizColumns}
                    dataSource={quizzes}
                    loading={loadingQuizzes}
                    rowKey="id"
                    pagination={{
                      current: quizCurrentPage,
                      pageSize: quizPageSize,
                      total: quizTotal,
                      onChange: (page, size) => {
                        setQuizCurrentPage(page);
                        setQuizPageSize(size || 10);
                      },
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng ${total} quiz`,
                    }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* Video Detail Modal */}
      <Modal
        title="Chi tiết Video"
        open={isVideoDetailModalVisible}
        onCancel={() => setIsVideoDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsVideoDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedVideo && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tiêu đề" span={2}>
                {selectedVideo.title}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedVideo.description}
              </Descriptions.Item>
              <Descriptions.Item label="Thời lượng">
                <ClockCircleOutlined /> {formatDuration(selectedVideo.duration)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedVideo.status)}>
                  {getStatusText(selectedVideo.status)}
                </Tag>
              </Descriptions.Item>
              {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                <Descriptions.Item label="Tags" span={2}>
                  {selectedVideo.tags.map((tag, idx) => (
                    <Tag key={idx}>{tag}</Tag>
                  ))}
                </Descriptions.Item>
              )}
              {selectedVideo.drillName && (
                <>
                  <Descriptions.Item label="Tên bài tập" span={2}>
                    {selectedVideo.drillName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả bài tập" span={2}>
                    {selectedVideo.drillDescription}
                  </Descriptions.Item>
                  <Descriptions.Item label="Sets luyện tập" span={2}>
                    {selectedVideo.drillPracticeSets}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Huấn luyện viên" span={2}>
                <div className="flex items-center gap-2">
                  <Avatar src={selectedVideo.coachAvatar} icon={<UserOutlined />} />
                  <div>
                    <div>{selectedVideo.coachName}</div>
                    <div className="text-sm text-gray-500">{selectedVideo.coachEmail}</div>
                  </div>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Quiz Detail Modal */}
      <Modal
        title="Chi tiết Quiz"
        open={isQuizDetailModalVisible}
        onCancel={() => setIsQuizDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsQuizDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedQuiz && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tiêu đề" span={2}>
                {selectedQuiz.title}
              </Descriptions.Item>
              {selectedQuiz.description && (
                <Descriptions.Item label="Mô tả" span={2}>
                  {selectedQuiz.description}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Cấp độ">
                <Tag color={getLevelColor(selectedQuiz.level)}>
                  {getLevelText(selectedQuiz.level)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số câu hỏi">
                {selectedQuiz.totalQuestions} câu
              </Descriptions.Item>
              <Descriptions.Item label="Huấn luyện viên" span={2}>
                <div className="flex items-center gap-2">
                  <Avatar src={selectedQuiz.coachAvatar} icon={<UserOutlined />} />
                  <div>
                    <div>{selectedQuiz.coachName}</div>
                    <div className="text-sm text-gray-500">{selectedQuiz.coachEmail}</div>
                  </div>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Approve/Reject Video Modals */}
      <Modal
        title="Phê duyệt Video"
        open={isApproveVideoModalVisible}
        onOk={confirmApproveVideo}
        onCancel={() => setIsApproveVideoModalVisible(false)}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn phê duyệt video{' '}
            <Text strong>&quot;{selectedVideo?.title}&quot;</Text>?
          </Text>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <CheckOutlined className="text-green-600 mr-2" />
            <Text className="text-green-600">
              Sau khi phê duyệt, video sẽ được công khai trong các khóa học.
            </Text>
          </div>
        </div>
      </Modal>

      <Modal
        title="Từ chối Video"
        open={isRejectVideoModalVisible}
        onOk={confirmRejectVideo}
        onCancel={() => {
          setIsRejectVideoModalVisible(false);
          setVideoRejectReason('');
        }}
        okText="Từ chối"
        okType="danger"
        cancelText="Hủy"
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn từ chối video{' '}
            <Text strong>&quot;{selectedVideo?.title}&quot;</Text>?
          </Text>
          <div className="mt-4">
            <Text strong className="block mb-2">
              Lý do từ chối: <span className="text-red-500">*</span>
            </Text>
            <TextArea
              rows={4}
              value={videoRejectReason}
              onChange={(e) => setVideoRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối video..."
            />
          </div>
        </div>
      </Modal>

      {/* Approve/Reject Quiz Modals */}
      <Modal
        title="Phê duyệt Quiz"
        open={isApproveQuizModalVisible}
        onOk={confirmApproveQuiz}
        onCancel={() => setIsApproveQuizModalVisible(false)}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn phê duyệt quiz{' '}
            <Text strong>&quot;{selectedQuiz?.title}&quot;</Text>?
          </Text>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <CheckOutlined className="text-green-600 mr-2" />
            <Text className="text-green-600">
              Sau khi phê duyệt, quiz sẽ có thể được gán vào các buổi học.
            </Text>
          </div>
        </div>
      </Modal>

      <Modal
        title="Từ chối Quiz"
        open={isRejectQuizModalVisible}
        onOk={confirmRejectQuiz}
        onCancel={() => {
          setIsRejectQuizModalVisible(false);
          setQuizRejectReason('');
        }}
        okText="Từ chối"
        okType="danger"
        cancelText="Hủy"
      >
        <div>
          <Text>
            Bạn có chắc chắn muốn từ chối quiz <Text strong>&quot;{selectedQuiz?.title}&quot;</Text>
            ?
          </Text>
          <div className="mt-4">
            <Text strong className="block mb-2">
              Lý do từ chối: <span className="text-red-500">*</span>
            </Text>
            <TextArea
              rows={4}
              value={quizRejectReason}
              onChange={(e) => setQuizRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối quiz..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
