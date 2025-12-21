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
  Modal,
  Typography,
  Row,
  Col,
  Descriptions,
  Tooltip,
  Avatar,
} from 'antd';
import { toast } from 'react-hot-toast';
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  FilterOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  useGetRequests,
  useApproveRequest,
  useRejectRequest,
  formatDuration,
} from '@/@crema/services/apis/requests';
import DetailModal from '@/modules/admin/curriculum/DetailModal';
import ApproveModal from '@/modules/admin/curriculum/ApproveModal';
import RejectModal from '@/modules/admin/curriculum/RejectModal';
import type {
  CourseRequestData,
  VideoData,
  RequestWithContent,
  LessonWithDetails,
} from '@/types/curriculum';
import {
  getStatusColor,
  getStatusText,
  getLevelText,
  getLevelColor,
} from '@/modules/admin/curriculum/utils';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CourseVerificationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthorized, isChecking } = useRoleGuard(['ADMIN'], {
    unauthenticated: '/signin',
    COACH: '/summary',
    LEARNER: '/home',
  });

  // API hooks - fetch up to 1000 items, then paginate on client-side
  const { data: requestsData, refetch: refetchRequests } = useGetRequests({
    type: 'COURSE-APPROVAL',
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
        const courseDetails = request.metadata?.details;
        const lessons = courseDetails?.subject?.lessons || [];
        const createdBy = request.createdBy;

        const totalVideos = lessons.filter((lesson: LessonWithDetails) => lesson.video).length;
        const totalQuizzes = lessons.filter((lesson: LessonWithDetails) => lesson.quiz).length;

        return {
          id: request.id.toString(),
          courseName: courseDetails?.name || 'Unnamed Course',
          courseDescription: courseDetails?.description || '',
          level: courseDetails?.subject?.level || 'BEGINNER',
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

    if (!selectedCourse || selectedCourse.id !== requestId) {
      const foundCourse = courses.find((course: CourseRequestData) => course.id === requestId);
      if (foundCourse) {
        setSelectedCourse(foundCourse);
        setTimeout(() => {
          setIsCourseDetailModalVisible(true);
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, courses]);

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
    setSelectedCourse(course);
    updateQueryParam(course.id);
    setTimeout(() => {
      setIsCourseDetailModalVisible(true);
    }, 0);
  };

  const handleCloseCourseDetails = () => {
    setIsCourseDetailModalVisible(false);
    setSelectedCourse(null);
    updateQueryParam();
  };

  const handleApproveCourse = async (course: CourseRequestData) => {
    try {
      const response = await approveRequestMutation.mutateAsync(Number(course.id));
      const successMessage = response?.message || `Đã phê duyệt khóa học "${course.courseName}"`;
      toast.success(successMessage);
      await refetchRequests();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Không thể phê duyệt khóa học');
    }
  };

  const handleRejectCourse = async (course: CourseRequestData, reason: string) => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      const response = await rejectRequestMutation.mutateAsync({ id: Number(course.id), reason });
      const successMessage = response?.message || `Đã từ chối khóa học "${course.courseName}"`;
      toast.success(successMessage);
      await refetchRequests();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Không thể từ chối khóa học');
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
            <Input
              placeholder="Tìm kiếm theo tên khóa học, huấn luyện viên..."
              allowClear
              value={courseSearchText}
              onChange={(e) => {
                const value = e.target.value;
                setCourseSearchText(value);
                if (!value) setCourseSearchText('');
              }}
              prefix={<SearchOutlined />}
              onPressEnter={(e) => {
                const target = e.target as HTMLInputElement;
                setCourseSearchText(target.value);
              }}
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
            pageSize: 4,
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
      <DetailModal
        open={isCourseDetailModalVisible}
        course={selectedCourse}
        onClose={handleCloseCourseDetails}
        onApprove={openApproveModal}
        onReject={openRejectModal}
        onPlayVideo={handlePlayVideo}
      />

      {/* Approve Course Modal */}
      <ApproveModal
        open={isApproveModalVisible}
        course={pendingActionCourse}
        loading={approveRequestMutation.isPending}
        onConfirm={handleConfirmApprove}
        onCancel={() => {
          setIsApproveModalVisible(false);
          setPendingActionCourse(null);
        }}
      />

      {/* Reject Course Modal */}
      <RejectModal
        open={isRejectModalVisible}
        course={pendingActionCourse}
        rejectReason={rejectReason}
        loading={rejectRequestMutation.isPending}
        onReasonChange={setRejectReason}
        onConfirm={handleConfirmReject}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectReason('');
          setPendingActionCourse(null);
        }}
      />
    </div>
  );
}
