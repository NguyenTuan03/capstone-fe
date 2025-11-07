'use client';
import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Tabs,
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Space,
  Skeleton,
  App,
  Badge,
  Empty,
  Form,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import CreateQuizModal from '@/components/coach/content/createQuizModal';
import { CreateQuizFormValues } from '@/@crema/types/quiz';
import CreateLessonModal from '@/components/coach/content/createLessonModal';
import CreateVideoModal, {
  CreateVideoFormValues,
} from '@/components/coach/content/createVideoModal';
import VideoDetailModal from '@/components/coach/content/VideoDetailModal';
import QuizDetailModal from '@/components/coach/content/QuizDetailModal';
import { useCreateLesson, useGetLessons } from '@/@crema/services/apis/lessons';
import { ContentCard } from '@/components/coach/content/ContentCard';
import {
  useCreateQuizForLesson,
  CreateQuizDto,
  useGetQuizzesByLesson,
} from '@/@crema/services/apis/quizzes';
import {
  useCreateVideoForLesson,
  useGetVideosByLesson,
  CreateVideoDto,
} from '@/@crema/services/apis/videos';

const { Search } = Input;

const ContentLibrary = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });

  // States
  const [activeTab, setActiveTab] = useState('lesson');
  const [searchText, setSearchText] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<string | number | undefined>(
    undefined,
  );
  const [selectedLessonForVideo, setSelectedLessonForVideo] = useState<string | number | undefined>(
    undefined,
  );
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoDetailModalVisible, setIsVideoDetailModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [isQuizDetailModalVisible, setIsQuizDetailModalVisible] = useState(false);

  // Modals
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isLessonModalVisible, setIsLessonModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [quizForm] = Form.useForm<CreateQuizFormValues>();
  const [videoForm] = Form.useForm<CreateVideoFormValues>();

  // API
  const createLessonMutation = useCreateLesson();
  const { data: lessonsRes, isLoading: isLoadingLessons } = useGetLessons({ page: 1, size: 10 });
  const lessons = useMemo(() => (lessonsRes?.items as any[]) || [], [lessonsRes?.items]);
  const createQuizForLessonMutation = useCreateQuizForLesson();
  const { data: quizzesRes, isLoading: isLoadingQuizzes } = useGetQuizzesByLesson({
    lessonId: selectedLessonForQuiz ?? 0,
  });

  // Handle response - can be array directly or object with items
  const rawQuizzes = useMemo(() => {
    if (Array.isArray(quizzesRes)) {
      return quizzesRes;
    }
    return (quizzesRes?.items as any[]) || (quizzesRes?.data as any[]) || [];
  }, [quizzesRes]);

  // Create lesson map for quick lookup
  const lessonMap = useMemo(() => {
    const map = new Map<string | number, string>();
    lessons.forEach((lesson: any) => {
      map.set(lesson.id, lesson.name || `Bài học ${lesson.id}`);
    });
    return map;
  }, [lessons]);

  // Map quiz data to match ContentCard expected format
  const quizzes = useMemo(() => {
    return rawQuizzes.map((quiz: any) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.totalQuestions || quiz.questions?.length || 0, // Map totalQuestions to questions count
      totalQuestions: quiz.totalQuestions,
      status: quiz.deletedAt ? 'draft' : 'published', // Map deletedAt to status
      createdAt: quiz.createdAt,
      lessonName: selectedLessonForQuiz ? lessonMap.get(selectedLessonForQuiz) : undefined,
      lessonId: selectedLessonForQuiz,
      createdBy: quiz.createdBy,
      // Include questions array for detail modal
      questionsList: quiz.questions || [],
      // Keep original data for reference
      _original: quiz,
    }));
  }, [rawQuizzes, selectedLessonForQuiz, lessonMap]);

  const lessonsOptions = useMemo(
    () =>
      lessons.map((lesson: any) => ({
        value: lesson.id,
        label: lesson.name || `Bài học ${lesson.id}`,
      })),
    [lessons],
  );

  // Helper function to format video duration
  const formatVideoDuration = (seconds: number): string => {
    if (!seconds || seconds < 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Video API
  const createVideoForLessonMutation = useCreateVideoForLesson();
  const { data: videosRes, isLoading: isLoadingVideos } = useGetVideosByLesson({
    lessonId: selectedLessonForVideo ?? 0,
  });

  // Handle video response
  const rawVideos = useMemo(() => {
    if (Array.isArray(videosRes)) {
      return videosRes;
    }
    return (videosRes?.items as any[]) || (videosRes?.data as any[]) || [];
  }, [videosRes]);

  // Map video data
  const videos = useMemo(() => {
    return rawVideos.map((video: any) => {
      const duration = video.duration || 0;

      // Parse tags from JSON string
      let tags: string[] = [];
      if (video.tags) {
        try {
          if (typeof video.tags === 'string') {
            const parsed = JSON.parse(video.tags);
            tags = Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
          } else if (Array.isArray(video.tags)) {
            tags = video.tags;
          }
        } catch (e) {
          console.warn('Failed to parse tags:', e);
          tags = [];
        }
      }

      // Map video status: READY -> published, others -> draft
      // Video statuses: UPLOADING, READY, ERROR, ANALYZING
      let status = 'draft';
      if (video.status === 'READY') {
        status = 'published';
      } else if (video.status === 'UPLOADING' || video.status === 'ANALYZING') {
        status = 'draft'; // Processing states
      } else if (video.status === 'ERROR') {
        status = 'draft'; // Error state, can be shown as draft
      } else if (video.deletedAt) {
        status = 'draft';
      }

      return {
        id: video.id,
        title: video.title,
        description: video.description,
        duration, // in seconds
        durationFormatted: formatVideoDuration(duration),
        status,
        videoStatus: video.status, // Original video status (UPLOADING, READY, ERROR, ANALYZING)
        createdAt: video.createdAt || video.updatedAt,
        lessonName: selectedLessonForVideo ? lessonMap.get(selectedLessonForVideo) : undefined,
        lessonId: selectedLessonForVideo,
        tags,
        drillName: video.drillName,
        drillDescription: video.drillDescription,
        drillPracticeSets: video.drillPracticeSets,
        publicUrl: video.publicUrl,
        thumbnailUrl: video.thumbnailUrl,
        uploadedBy: video.uploadedBy,
        createdBy: video.uploadedBy, // Map uploadedBy to createdBy for compatibility
        _original: video,
      };
    });
  }, [rawVideos, selectedLessonForVideo, lessonMap]);

  // Handlers
  const handleCreateLesson = async (values: any) => {
    setLessonLoading(true);
    try {
      await createLessonMutation.mutateAsync({
        subjectId: values.subjectId,
        data: {
          name: values.name,
          description: values.description,
          duration: values.duration,
        },
      });
      message.success('Tạo bài học thành công!');
      setIsLessonModalVisible(false);
    } catch (e: any) {
      message.error(e?.message || 'Tạo bài học thất bại');
    } finally {
      setLessonLoading(false);
    }
  };

  const isCreatingQuiz = createQuizForLessonMutation.isPending;

  const handleCreateQuiz = async () => {
    try {
      const values = await quizForm.validateFields();
      const { title, description, lessonId, questions } = values;

      if (!lessonId) {
        message.warning('Vui lòng chọn bài học');
        return;
      }

      if (!questions || questions.length === 0) {
        message.warning('Quiz cần ít nhất một câu hỏi');
        return;
      }

      const sanitizedQuestions = questions.map((question: any, index: number) => {
        const trimmedOptions = (question.options || []).map((option: string) => option.trim());

        if (trimmedOptions.length < 2) {
          throw new Error(`Câu hỏi ${index + 1} cần ít nhất 2 đáp án`);
        }

        const correctIndex = question.correctOptionIndex ?? 0;
        if (correctIndex >= trimmedOptions.length) {
          throw new Error(`Vui lòng chọn đáp án đúng cho câu ${index + 1}`);
        }

        return {
          title: question.title.trim(),
          explanation: question.explanation?.trim() || undefined,
          options: trimmedOptions.map((optionContent: string, optionIndex: number) => ({
            content: optionContent,
            isCorrect: optionIndex === correctIndex,
          })),
        };
      });

      const quizPayload: CreateQuizDto = {
        title: title.trim(),
        description: description?.trim() || undefined,
        questions: sanitizedQuestions,
      };

      await createQuizForLessonMutation.mutateAsync({
        lessonId,
        quiz: quizPayload,
      });

      // Set selected lesson and refetch quizzes for the lesson after successful creation
      setSelectedLessonForQuiz(lessonId);
      await queryClient.refetchQueries({
        queryKey: ['quizzes', 'lesson', lessonId],
      });

      message.success('Tạo quiz thành công!');
      quizForm.resetFields();
      setIsQuizModalVisible(false);

      // Switch to quiz tab to show the newly created quiz
      setActiveTab('quiz');
    } catch (error: any) {
      if (error?.errorFields) {
        // Validation errors handled by Form
        return;
      }
      message.error(error?.message || 'Tạo quiz thất bại, vui lòng thử lại');
    }
  };

  const isCreatingVideo = createVideoForLessonMutation.isPending;

  const handleCreateVideo = async () => {
    try {
      const values = await videoForm.validateFields();
      const {
        title,
        description,
        lessonId,
        duration,
        tags,
        drillName,
        drillDescription,
        drillPracticeSets,
        videoFile,
      } = values;

      if (!lessonId) {
        message.warning('Vui lòng chọn bài học');
        return;
      }

      if (!videoFile) {
        message.warning('Vui lòng chọn file video');
        return;
      }

      if (!duration || duration < 1) {
        message.warning('Vui lòng nhập thời lượng hợp lệ (ít nhất 1 giây)');
        return;
      }

      const videoPayload: CreateVideoDto = {
        title: title.trim(),
        description: description?.trim() || undefined,
        duration: Math.floor(duration), // Ensure integer
        tags: tags && tags.length > 0 ? tags : undefined,
        drillName: drillName?.trim() || undefined,
        drillDescription: drillDescription?.trim() || undefined,
        drillPracticeSets: drillPracticeSets?.trim() || undefined,
      };

      await createVideoForLessonMutation.mutateAsync({
        lessonId,
        video: videoFile,
        data: videoPayload,
      });

      // Set selected lesson and refetch videos for the lesson after successful creation
      setSelectedLessonForVideo(lessonId);
      await queryClient.refetchQueries({
        queryKey: ['videos', 'lesson', lessonId],
      });

      message.success('Upload video thành công!');
      videoForm.resetFields();
      setIsVideoModalVisible(false);

      // Switch to video tab to show the newly uploaded video
      setActiveTab('video');
    } catch (error: any) {
      if (error?.errorFields) {
        // Validation errors handled by Form
        return;
      }
      message.error(error?.message || 'Upload video thất bại, vui lòng thử lại');
    }
  };

  const handleViewVideo = (video: any) => {
    setSelectedVideo(video);
    setIsVideoDetailModalVisible(true);
  };

  const handleViewQuiz = (quiz: any) => {
    // Merge mapped data with original data for full information
    const fullQuizData = {
      ...quiz,
      ...(quiz._original || {}),
      // Keep mapped fields like lessonName
      lessonName: quiz.lessonName,
      status: quiz.status,
    };
    setSelectedQuiz(fullQuizData);
    setIsQuizDetailModalVisible(true);
  };

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">📚 Kho nội dung</h1>
            <p className="text-gray-500 mt-1 mb-0">Quản lý và tái sử dụng nội dung giảng dạy</p>
          </div>

          <Space>
            {activeTab === 'quiz' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  quizForm.resetFields();
                  setIsQuizModalVisible(true);
                }}
                className="bg-blue-500"
              >
                Tạo Quiz
              </Button>
            )}

            {activeTab === 'lesson' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsLessonModalVisible(true)}
                className="bg-green-500"
              >
                Tạo Bài học
              </Button>
            )}

            {activeTab === 'video' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-orange-500"
                onClick={() => {
                  videoForm.resetFields();
                  setIsVideoModalVisible(true);
                }}
              >
                Upload Video
              </Button>
            )}
          </Space>
        </div>

        {/* Search & Filters */}
        <Card className="mb-4" styles={{ body: { padding: '16px' } }}>
          <div className="flex gap-3 flex-wrap">
            <Search
              placeholder="Tìm kiếm nội dung..."
              allowClear
              size="large"
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Select
              placeholder="Cấp độ"
              size="large"
              style={{ width: 150 }}
              value={filterLevel}
              onChange={setFilterLevel}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Advanced">Advanced</Select.Option>
            </Select>

            <Select
              placeholder="Trạng thái"
              size="large"
              style={{ width: 150 }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="published">Đã xuất bản</Select.Option>
              <Select.Option value="draft">Nháp</Select.Option>
              <Select.Option value="archived">Lưu trữ</Select.Option>
            </Select>

            {(searchText || filterLevel !== 'all' || filterStatus !== 'all') && (
              <Button
                onClick={() => {
                  setSearchText('');
                  setFilterLevel('all');
                  setFilterStatus('all');
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </Card>

        {/* Tabs Content */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: 'lesson',
              label: (
                <span className="flex items-center gap-2">
                  <FileTextOutlined />
                  Bài học
                  <Badge count={lessons.length} showZero style={{ backgroundColor: '#52c41a' }} />
                </span>
              ),
              children: (
                <div>
                  {isLoadingLessons ? (
                    <Row gutter={[16, 16]}>
                      {[1, 2, 3].map((i) => (
                        <Col xs={24} sm={12} lg={8} key={i}>
                          <Card>
                            <Skeleton active paragraph={{ rows: 3 }} />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : lessons.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bài học nào">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsLessonModalVisible(true)}
                      >
                        Tạo bài học đầu tiên
                      </Button>
                    </Empty>
                  ) : (
                    <Row gutter={[16, 16]}>
                      {lessons.map((lesson) => (
                        <Col xs={24} sm={12} lg={8} key={lesson.id}>
                          <ContentCard item={lesson} type="lesson" />
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              ),
            },
            {
              key: 'quiz',
              label: (
                <span className="flex items-center gap-2">
                  <QuestionCircleOutlined />
                  Quiz
                  <Badge count={quizzes.length} showZero style={{ backgroundColor: '#1890ff' }} />
                </span>
              ),
              children: (
                <div>
                  {/* Lesson Filter for Quiz Tab */}
                  <Card className="mb-4" styles={{ body: { padding: '16px' } }}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">Lọc theo bài học:</span>
                      <Select
                        placeholder="Chọn bài học để xem quiz"
                        size="large"
                        style={{ width: 300 }}
                        value={selectedLessonForQuiz}
                        onChange={(value) => setSelectedLessonForQuiz(value)}
                        allowClear
                        onClear={() => setSelectedLessonForQuiz(undefined)}
                        options={[
                          { value: undefined, label: 'Tất cả bài học', disabled: true },
                          ...lessonsOptions,
                        ]}
                        optionFilterProp="label"
                      />
                      {selectedLessonForQuiz && (
                        <Button
                          onClick={() => {
                            setSelectedLessonForQuiz(undefined);
                          }}
                        >
                          Xóa bộ lọc
                        </Button>
                      )}
                    </div>
                  </Card>

                  {!selectedLessonForQuiz ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Vui lòng chọn bài học để xem quiz"
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsQuizModalVisible(true)}
                      >
                        Tạo quiz mới
                      </Button>
                    </Empty>
                  ) : isLoadingQuizzes ? (
                    <Row gutter={[16, 16]}>
                      {[1, 2, 3].map((i) => (
                        <Col xs={24} sm={12} lg={8} key={i}>
                          <Card>
                            <Skeleton active paragraph={{ rows: 3 }} />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : quizzes.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={`Chưa có quiz nào cho bài học "${lessonMap.get(selectedLessonForQuiz)}"`}
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          quizForm.setFieldsValue({ lessonId: selectedLessonForQuiz });
                          setIsQuizModalVisible(true);
                        }}
                      >
                        Tạo quiz cho bài học này
                      </Button>
                    </Empty>
                  ) : (
                    <Row gutter={[16, 16]}>
                      {quizzes.map((quiz) => (
                        <Col xs={24} sm={12} lg={8} key={quiz.id}>
                          <ContentCard item={quiz} type="quiz" onView={handleViewQuiz} />
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              ),
            },
            {
              key: 'video',
              label: (
                <span className="flex items-center gap-2">
                  <VideoCameraOutlined />
                  Video
                  <Badge count={videos.length} showZero style={{ backgroundColor: '#fa8c16' }} />
                </span>
              ),
              children: (
                <div>
                  {/* Lesson Filter for Video Tab */}
                  <Card className="mb-4" styles={{ body: { padding: '16px' } }}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">Lọc theo bài học:</span>
                      <Select
                        placeholder="Chọn bài học để xem video"
                        size="large"
                        style={{ width: 300 }}
                        value={selectedLessonForVideo}
                        onChange={(value) => setSelectedLessonForVideo(value)}
                        allowClear
                        onClear={() => setSelectedLessonForVideo(undefined)}
                        options={[
                          { value: undefined, label: 'Tất cả bài học', disabled: true },
                          ...lessonsOptions,
                        ]}
                        optionFilterProp="label"
                      />
                      {selectedLessonForVideo && (
                        <Button
                          onClick={() => {
                            setSelectedLessonForVideo(undefined);
                          }}
                        >
                          Xóa bộ lọc
                        </Button>
                      )}
                    </div>
                  </Card>

                  {!selectedLessonForVideo ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Vui lòng chọn bài học để xem video"
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsVideoModalVisible(true)}
                      >
                        Upload video mới
                      </Button>
                    </Empty>
                  ) : isLoadingVideos ? (
                    <Row gutter={[16, 16]}>
                      {[1, 2, 3].map((i) => (
                        <Col xs={24} sm={12} lg={8} key={i}>
                          <Card>
                            <Skeleton active paragraph={{ rows: 3 }} />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : videos.length === 0 ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={`Chưa có video nào cho bài học "${lessonMap.get(selectedLessonForVideo)}"`}
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          videoForm.setFieldsValue({ lessonId: selectedLessonForVideo });
                          setIsVideoModalVisible(true);
                        }}
                      >
                        Upload video cho bài học này
                      </Button>
                    </Empty>
                  ) : (
                    <Row gutter={[16, 16]}>
                      {videos.map((video) => (
                        <Col xs={24} sm={12} lg={8} key={video.id}>
                          <ContentCard item={video} type="video" onView={handleViewVideo} />
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Modals */}
      <CreateQuizModal
        open={isQuizModalVisible}
        onClose={() => setIsQuizModalVisible(false)}
        onSubmit={handleCreateQuiz}
        form={quizForm}
        submitting={isCreatingQuiz}
        lessonsOptions={lessonsOptions}
      />

      <CreateLessonModal
        open={isLessonModalVisible}
        onClose={() => setIsLessonModalVisible(false)}
        onSubmit={handleCreateLesson}
        loading={lessonLoading}
      />

      <CreateVideoModal
        open={isVideoModalVisible}
        onClose={() => setIsVideoModalVisible(false)}
        onSubmit={handleCreateVideo}
        form={videoForm}
        submitting={isCreatingVideo}
        lessonsOptions={lessonsOptions}
      />

      <VideoDetailModal
        open={isVideoDetailModalVisible}
        video={selectedVideo}
        onClose={() => {
          setIsVideoDetailModalVisible(false);
          setSelectedVideo(null);
        }}
      />

      <QuizDetailModal
        open={isQuizDetailModalVisible}
        quiz={selectedQuiz}
        onClose={() => {
          setIsQuizDetailModalVisible(false);
          setSelectedQuiz(null);
        }}
      />

      <style jsx global>{`
        .content-card {
          transition: all 0.3s ease;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
        }

        .content-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ContentLibrary;
