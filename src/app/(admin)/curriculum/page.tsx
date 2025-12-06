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
  Image,
  List,
  Collapse,
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
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  useGetRequests,
  useApproveRequest,
  useRejectRequest,
  formatDuration,
  getLessonStats,
  type RequestWithContent,
  type LessonWithDetails,
} from '@/@crema/services/apis/requests';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

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
  lessonName: string;
  courseName: string;
}

interface CourseRequestData {
  id: string;
  courseName: string;
  courseDescription: string;
  level: string;
  status: string;
  coachName: string;
  coachEmail: string;
  coachAvatar: string;
  totalLessons: number;
  totalVideos: number;
  totalQuizzes: number;
  createdAt: string;
  requestData: RequestWithContent;
}

export default function CourseVerificationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });

  // API hooks
  const { data: requestsData, refetch: refetchRequests } = useGetRequests({
    type: 'COURSE_APPROVAL',
    status: 'PENDING',
  });

  const approveRequestMutation = useApproveRequest();
  const rejectRequestMutation = useRejectRequest();

  const [isVideoPlayerModalVisible, setIsVideoPlayerModalVisible] = useState(false);

  // Courses state
  const [courses, setCourses] = useState<CourseRequestData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseRequestData | null>(null);
  const [isCourseDetailModalVisible, setIsCourseDetailModalVisible] = useState(false);
  const [pendingActionCourse, setPendingActionCourse] = useState<CourseRequestData | null>(null);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [courseSearchText, setCourseSearchText] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState<string>('ALL');

  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    if (!requestsData?.items) {
      setCourses([]);
      setLoadingCourses(false);
      return;
    }

    setLoadingCourses(true);

    const coursesList: CourseRequestData[] = requestsData.items
      .filter((request: RequestWithContent) => {
        if (courseStatusFilter === 'ALL') return true;
        if (courseStatusFilter === 'PENDING') return request.status === 'PENDING';
        if (courseStatusFilter === 'APPROVED') return request.status === 'APPROVED';
        if (courseStatusFilter === 'REJECTED') return request.status === 'REJECTED';
        return true;
      })
      .map((request: RequestWithContent) => {
        const courseDetails = request.metadata.details;
        const lessons = courseDetails.subject.lessons || [];
        const createdBy = request.createdBy;

        const totalVideos = lessons.filter((lesson: LessonWithDetails) => lesson.video).length;
        const totalQuizzes = lessons.filter((lesson: LessonWithDetails) => lesson.quiz).length;

        return {
          id: request.id.toString(),
          courseName: courseDetails.name || 'Unnamed Course',
          courseDescription: courseDetails.description || '',
          level: courseDetails.subject.level || 'BEGINNER',
          status: request.status,
          coachName: createdBy?.fullName || 'Unknown',
          coachEmail: createdBy?.email || '',
          coachAvatar: createdBy?.profilePicture || '',
          totalLessons: lessons.length,
          totalVideos,
          totalQuizzes,
          createdAt: request.createdAt,
          requestData: request,
        };
      });

    let filteredCourses = coursesList;
    if (courseSearchText) {
      const search = courseSearchText.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (c) =>
          c.courseName.toLowerCase().includes(search) || c.coachName.toLowerCase().includes(search),
      );
    }

    setCourses(filteredCourses);
    setLoadingCourses(false);
  }, [requestsData, courseSearchText, courseStatusFilter]);

  useEffect(() => {
    const requestId = searchParams.get('request');
    if (!requestId) {
      if (isCourseDetailModalVisible) {
        setIsCourseDetailModalVisible(false);
        setSelectedCourse(null);
      }
      return;
    }
    const foundCourse = courses.find((course) => course.id === requestId);
    if (foundCourse) {
      setSelectedCourse(foundCourse);
      setIsCourseDetailModalVisible(true);
    }
  }, [searchParams, courses, isCourseDetailModalVisible]);

  // Helper functions
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      UPLOADING: 'blue',
      PROCESSING: 'cyan',
      PENDING: 'orange',
      PENDING_APPROVAL: 'orange',
      APPROVED: 'green',
      REJECTED: 'red',
      READY: 'green',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      UPLOADING: 'Đang tải lên',
      PROCESSING: 'Đang xử lý',
      PENDING: 'Chờ phê duyệt',
      PENDING_APPROVAL: 'Chờ phê duyệt',
      APPROVED: 'Đã phê duyệt',
      REJECTED: 'Đã từ chối',
      READY: 'Sẵn sàng',
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

  const parseVideoTags = (tags?: string | string[] | null): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags
        .filter((tag) => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    const cleaned = tags.replace(/^\{|\}$/g, '');
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((tag) => typeof tag === 'string')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    } catch {
      // Fallback to comma-split below when JSON.parse fails
    }

    return cleaned
      .split(',')
      .map((tag) => tag.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
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

  // Course handlers
  const updateQueryParam = (courseId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (courseId) {
      params.set('request', courseId);
    } else {
      params.delete('request');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleViewCourseDetails = (course: CourseRequestData) => {
    setIsCourseDetailModalVisible(true);
    setSelectedCourse(course);
    updateQueryParam(course.id);
  };

  const handleCloseCourseDetails = () => {
    setIsCourseDetailModalVisible(false);
    setSelectedCourse(null);
    updateQueryParam();
  };

  const handleApproveCourse = async (course: CourseRequestData) => {
    try {
      await approveRequestMutation.mutateAsync(Number(course.id));
      message.success(`Đã phê duyệt khóa học "${course.courseName}"`);
      await refetchRequests();
    } catch (err) {
      console.error(err);
      message.error('Không thể phê duyệt khóa học');
    }
  };

  const handleRejectCourse = async (course: CourseRequestData, reason: string) => {
    if (!reason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await rejectRequestMutation.mutateAsync({ id: Number(course.id), reason });
      message.success(`Đã từ chối khóa học "${course.courseName}"`);
      await refetchRequests();
    } catch (err) {
      console.error(err);
      message.error('Không thể từ chối khóa học');
    }
  };

  const handleConfirmApprove = async () => {
    if (!pendingActionCourse) return;

    await handleApproveCourse(pendingActionCourse);
    setIsApproveModalVisible(false);
    if (isCourseDetailModalVisible && selectedCourse?.id === pendingActionCourse.id) {
      handleCloseCourseDetails();
    }
    setPendingActionCourse(null);
  };

  const handleConfirmReject = async () => {
    if (!pendingActionCourse) return;

    await handleRejectCourse(pendingActionCourse, rejectReason);
    setIsRejectModalVisible(false);
    setRejectReason('');
    if (isCourseDetailModalVisible && selectedCourse?.id === pendingActionCourse.id) {
      handleCloseCourseDetails();
    }
    setPendingActionCourse(null);
  };

  const openApproveModal = (course: CourseRequestData) => {
    setPendingActionCourse(course);
    setIsApproveModalVisible(true);
  };

  const openRejectModal = (course: CourseRequestData) => {
    setPendingActionCourse(course);
    setRejectReason('');
    setIsRejectModalVisible(true);
  };

  // Video handlers
  const handlePlayVideo = (video: VideoData) => {
    setSelectedVideo(video);
    setIsVideoPlayerModalVisible(true);
  };

  // Course columns
  const courseColumns: ColumnsType<CourseRequestData> = [
    {
      title: 'Khóa học',
      key: 'course',
      width: 300,
      render: (_, record) => (
        <div>
          <div className="font-medium text-base">{record.courseName}</div>
          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{record.courseDescription}</div>
          <div className="mt-2">
            <Tag color={getLevelColor(record.level)}>{getLevelText(record.level)}</Tag>
            <Tag>{record.totalLessons} bài học</Tag>
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
      title: 'Nội dung',
      key: 'content',
      width: 150,
      render: (_, record) => (
        <div className="text-sm">
          <div>{record.totalVideos} videos</div>
          <div>{record.totalQuizzes} quizzes</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => {
        const colors: { [key: string]: string } = {
          PENDING: 'orange',
          APPROVED: 'green',
          REJECTED: 'red',
        };
        const texts: { [key: string]: string } = {
          PENDING: 'Chờ duyệt',
          APPROVED: 'Đã duyệt',
          REJECTED: 'Đã từ chối',
        };
        return <Tag color={colors[status]}>{texts[status] || status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewCourseDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Title level={2}>Quản lý Nội dung</Title>
        <Text className="text-gray-600">Quản lý và phê duyệt khóa học, xem video bài học</Text>
      </div>

      {/* Main Card with Tabs */}
      <Card className="card-3d">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <CheckOutlined className="text-green-500" /> Phê duyệt khóa học
          </div>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={10}>
            <Search
              placeholder="Tìm kiếm theo tên khóa học, huấn luyện viên..."
              allowClear
              onSearch={setCourseSearchText}
              onChange={(e) => !e.target.value && setCourseSearchText('')}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              style={{ width: '100%' }}
              value={courseStatusFilter}
              onChange={setCourseStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="ALL">Tất cả</Option>
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="REJECTED">Đã từ chối</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={courseColumns}
          dataSource={courses}
          loading={loadingCourses}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} khóa học`,
          }}
        />
      </Card>

      {/* Video Player Modal */}
      <Modal
        title={selectedVideo?.title || 'Video Player'}
        open={isVideoPlayerModalVisible}
        onCancel={() => {
          setIsVideoPlayerModalVisible(false);
          setSelectedVideo(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsVideoPlayerModalVisible(false);
              setSelectedVideo(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={900}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 240px)',
            overflowY: 'auto',
            paddingRight: 16,
          },
        }}
      >
        {selectedVideo && (
          <div className="space-y-4">
            {/* Video Player */}
            {selectedVideo.publicUrl ? (
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <video
                  controls
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={selectedVideo.publicUrl}
                  poster={selectedVideo.thumbnailUrl || undefined}
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <VideoCameraOutlined className="text-6xl text-gray-400 mb-4" />
                <Text className="text-gray-500">Video chưa sẵn sàng</Text>
              </div>
            )}

            {/* Video Info */}
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tiêu đề" span={2}>
                {selectedVideo.title}
              </Descriptions.Item>
              {selectedVideo.description && (
                <Descriptions.Item label="Mô tả" span={2}>
                  {selectedVideo.description}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Bài học">{selectedVideo.lessonName}</Descriptions.Item>
              <Descriptions.Item label="Khóa học">{selectedVideo.courseName}</Descriptions.Item>
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
                  <Descriptions.Item label="Bài tập" span={2}>
                    <strong>{selectedVideo.drillName}</strong>
                  </Descriptions.Item>
                  {selectedVideo.drillDescription && (
                    <Descriptions.Item label="Mô tả bài tập" span={2}>
                      {selectedVideo.drillDescription}
                    </Descriptions.Item>
                  )}
                  {selectedVideo.drillPracticeSets && (
                    <Descriptions.Item label="Sets luyện tập" span={2}>
                      {selectedVideo.drillPracticeSets}
                    </Descriptions.Item>
                  )}
                </>
              )}
              <Descriptions.Item label="Huấn luyện viên" span={2}>
                <div className="flex items-center gap-2">
                  <Avatar src={selectedVideo.coachAvatar} icon={<UserOutlined />} />
                  <div>
                    <div className="font-medium">{selectedVideo.coachName}</div>
                    <div className="text-sm text-gray-500">{selectedVideo.coachEmail}</div>
                  </div>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Course Detail Modal */}
      <Modal
        title="Chi tiết Khóa học"
        open={isCourseDetailModalVisible}
        onCancel={handleCloseCourseDetails}
        footer={[
          <Button key="close" onClick={handleCloseCourseDetails}>
            Đóng
          </Button>,
          ...(selectedCourse?.status === 'PENDING'
            ? [
                <Button key="reject" danger onClick={() => openRejectModal(selectedCourse)}>
                  Từ chối
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  onClick={() => openApproveModal(selectedCourse)}
                >
                  Phê duyệt
                </Button>,
              ]
            : []),
        ]}
        width={1000}
        centered
        styles={{
          body: {
            maxHeight: 'calc(100vh - 240px)',
            overflowY: 'auto',
            paddingRight: 16,
          },
        }}
      >
        {selectedCourse && (
          <div className="space-y-6">
            {/* Course Basic Info */}
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Tên khóa học" span={2}>
                <strong>{selectedCourse.courseName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedCourse.courseDescription}
              </Descriptions.Item>
              <Descriptions.Item label="Cấp độ">
                <Tag color={getLevelColor(selectedCourse.level)}>
                  {getLevelText(selectedCourse.level)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    selectedCourse.status === 'PENDING'
                      ? 'orange'
                      : selectedCourse.status === 'APPROVED'
                        ? 'green'
                        : 'red'
                  }
                >
                  {selectedCourse.status === 'PENDING'
                    ? 'Chờ duyệt'
                    : selectedCourse.status === 'APPROVED'
                      ? 'Đã duyệt'
                      : 'Đã từ chối'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số bài học">
                {selectedCourse.totalLessons} bài
              </Descriptions.Item>
              <Descriptions.Item label="Nội dung">
                {selectedCourse.totalVideos} videos, {selectedCourse.totalQuizzes} quizzes
              </Descriptions.Item>
              <Descriptions.Item label="Huấn luyện viên" span={2}>
                <div className="flex items-center gap-2">
                  <Avatar src={selectedCourse.coachAvatar} icon={<UserOutlined />} />
                  <div>
                    <div className="font-medium">{selectedCourse.coachName}</div>
                    <div className="text-sm text-gray-500">{selectedCourse.coachEmail}</div>
                  </div>
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* Lessons List with Details */}
            <div className="mt-4">
              <Title level={5}>Danh sách bài học</Title>
              {(() => {
                const lessons = selectedCourse.requestData.metadata.details.subject.lessons;

                if (!lessons || lessons.length === 0) {
                  return (
                    <div className="p-4 bg-gray-50 rounded text-center text-gray-500">
                      Không có bài học nào
                    </div>
                  );
                }

                return (
                  <Collapse>
                    {lessons.map((lesson: LessonWithDetails, idx: number) => {
                      const lessonStats = getLessonStats(lesson);

                      return (
                        <Panel
                          key={lesson.id}
                          header={
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">
                                  Bài {idx + 1}: {lesson.name}
                                </span>
                                {lesson.description && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    {lesson.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {lesson.video && (
                                  <Tag color="blue" icon={<VideoCameraOutlined />}>
                                    Video
                                  </Tag>
                                )}
                                {lesson.quiz && (
                                  <Tag color="orange" icon={<QuestionCircleOutlined />}>
                                    Quiz ({lesson.quiz.totalQuestions} câu)
                                  </Tag>
                                )}
                              </div>
                            </div>
                          }
                        >
                          {/* Lesson Content */}
                          <div className="space-y-4">
                            {/* Video Section */}
                            {lesson.video && (
                              <Card size="small" title="Video Bài Học">
                                <div className="flex gap-4">
                                  {lesson.video.thumbnailUrl && (
                                    <Image
                                      src={lesson.video.thumbnailUrl}
                                      alt={lesson.video.title}
                                      width={120}
                                      height={80}
                                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                                      preview={false}
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium">{lesson.video.title}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      {lesson.video.description}
                                    </div>
                                    <div className="mt-2">
                                      <Tag>Thời lượng: {lessonStats.videoDuration}</Tag>
                                      <Tag>Trạng thái: {getStatusText(lesson.video.status)}</Tag>
                                    </div>
                                    {lesson.video.publicUrl && (
                                      <Button
                                        type="primary"
                                        size="small"
                                        icon={<PlayCircleOutlined />}
                                        className="mt-2"
                                        onClick={() =>
                                          handlePlayVideo({
                                            id: `${lesson.id}-${lesson.video!.id}`,
                                            title: lesson.video!.title,
                                            description: lesson.video!.description,
                                            tags: parseVideoTags(lesson.video!.tags),
                                            duration: lesson.video!.duration,
                                            drillName: lesson.video!.drillName || undefined,
                                            drillDescription:
                                              lesson.video!.drillDescription || undefined,
                                            drillPracticeSets:
                                              lesson.video!.drillPracticeSets || undefined,
                                            publicUrl: lesson.video!.publicUrl,
                                            thumbnailUrl: lesson.video!.thumbnailUrl ?? undefined,
                                            status: lesson.video!.status,
                                            coachName: selectedCourse.coachName,
                                            coachEmail: selectedCourse.coachEmail,
                                            coachAvatar: selectedCourse.coachAvatar,
                                            lessonName: lesson.name,
                                            courseName: selectedCourse.courseName,
                                          })
                                        }
                                      >
                                        Phát Video
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            )}

                            {/* Quiz Section */}
                            {lesson.quiz && (
                              <Card size="small" title="Quiz">
                                <div className="space-y-3">
                                  <div className="font-medium">{lesson.quiz.title}</div>
                                  {lesson.quiz.description && (
                                    <div className="text-sm text-gray-600">
                                      {lesson.quiz.description}
                                    </div>
                                  )}
                                  <div className="text-sm">
                                    <Tag icon={<QuestionCircleOutlined />}>
                                      {lesson.quiz.totalQuestions} câu hỏi
                                    </Tag>
                                  </div>

                                  {/* Questions List */}
                                  {lesson.quiz.questions && lesson.quiz.questions.length > 0 && (
                                    <div className="mt-3">
                                      <div className="font-medium mb-2">Danh sách câu hỏi:</div>
                                      <List
                                        size="small"
                                        dataSource={lesson.quiz.questions}
                                        renderItem={(question, qIdx) => (
                                          <List.Item>
                                            <div className="w-full">
                                              <div className="font-medium">
                                                Câu {qIdx + 1}: {question.title}
                                              </div>
                                              {question.explanation && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                  Giải thích: {question.explanation}
                                                </div>
                                              )}
                                              <div className="mt-2 space-y-1">
                                                {question.options.map((option, oIdx) => (
                                                  <div
                                                    key={option.id}
                                                    className={`text-sm p-2 rounded ${
                                                      option.isCorrect
                                                        ? 'bg-green-50 border border-green-200'
                                                        : 'bg-gray-50'
                                                    }`}
                                                  >
                                                    {oIdx + 1}. {option.content}
                                                    {option.isCorrect && (
                                                      <Tag color="green" className="ml-2">
                                                        Đáp án đúng
                                                      </Tag>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </List.Item>
                                        )}
                                      />
                                    </div>
                                  )}
                                </div>
                              </Card>
                            )}

                            {/* Lesson Info */}
                            <Card size="small" title="Thông tin Bài Học">
                              <Descriptions column={2} size="small">
                                <Descriptions.Item label="Thời lượng">
                                  {lessonStats.totalDuration}
                                </Descriptions.Item>
                                <Descriptions.Item label="Số thứ tự">
                                  Bài {lesson.lessonNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tạo">
                                  {new Date(lesson.createdAt).toLocaleDateString('vi-VN')}
                                </Descriptions.Item>
                              </Descriptions>
                            </Card>
                          </div>
                        </Panel>
                      );
                    })}
                  </Collapse>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Course Modal */}
      <Modal
        title="Xác nhận phê duyệt"
        open={isApproveModalVisible}
        zIndex={2000}
        onCancel={() => {
          setIsApproveModalVisible(false);
          setPendingActionCourse(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsApproveModalVisible(false);
              setPendingActionCourse(null);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="approve"
            type="primary"
            loading={approveRequestMutation.isPending}
            onClick={handleConfirmApprove}
          >
            Xác nhận phê duyệt
          </Button>,
        ]}
      >
        <p>
          Bạn có chắc chắn muốn phê duyệt khóa học{' '}
          <strong>&ldquo;{pendingActionCourse?.courseName}&rdquo;</strong>?
        </p>
      </Modal>

      {/* Reject Course Modal */}
      <Modal
        title="Từ chối khóa học"
        open={isRejectModalVisible}
        zIndex={2000}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectReason('');
          setPendingActionCourse(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsRejectModalVisible(false);
              setRejectReason('');
              setPendingActionCourse(null);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            loading={rejectRequestMutation.isPending}
            onClick={handleConfirmReject}
          >
            Xác nhận từ chối
          </Button>,
        ]}
      >
        <div className="space-y-4 mb-[24px]">
          <p>
            Bạn có chắc chắn muốn từ chối khóa học{' '}
            <strong>&ldquo;{pendingActionCourse?.courseName}&rdquo;</strong>?
          </p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <TextArea
              className="mb-2"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối khóa học..."
              rows={4}
              maxLength={500}
              showCount
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
