'use client';

import {
  Modal,
  Button,
  Descriptions,
  Tag,
  Typography,
  Avatar,
  Card,
  Image,
  List,
  Collapse,
} from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import type { CourseRequestData, VideoData, LessonWithDetails } from '../../../types/curriculum';
import {
  formatDateSafe,
  getStatusText,
  getLevelColor,
  getLevelText,
  parseVideoTags,
} from './utils';
import { getLessonStats } from '@/@crema/services/apis/requests';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface DetailModalProps {
  open: boolean;
  course: CourseRequestData | null;
  onClose: () => void;
  onApprove: (course: CourseRequestData) => void;
  onReject: (course: CourseRequestData) => void;
  onPlayVideo: (video: VideoData) => void;
}

export default function DetailModal({
  open,
  course,
  onClose,
  onApprove,
  onReject,
  onPlayVideo,
}: DetailModalProps) {
  // Only render modal content when course is available to prevent flickering
  const shouldRender = open && course;

  return (
    <Modal
      title="Chi tiết Khóa học"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        ...(shouldRender && course.status === 'PENDING'
          ? [
              <Button key="reject" danger onClick={() => course && onReject(course)}>
                Từ chối
              </Button>,
              <Button key="approve" type="primary" onClick={() => course && onApprove(course)}>
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
      {shouldRender ? (
        <div className="space-y-6">
          {/* Course Basic Info */}
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Tên khóa học" span={2}>
              <strong>{course.courseName}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {course.courseDescription}
            </Descriptions.Item>
            <Descriptions.Item label="Cấp độ">
              <Tag color={getLevelColor(course.level)}>{getLevelText(course.level)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  course.status === 'PENDING'
                    ? 'orange'
                    : course.status === 'APPROVED'
                      ? 'green'
                      : 'red'
                }
              >
                {course.status === 'PENDING'
                  ? 'Chờ duyệt'
                  : course.status === 'APPROVED'
                    ? 'Đã duyệt'
                    : 'Đã từ chối'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số bài học">{course.totalLessons} bài</Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              {course.totalVideos} videos, {course.totalQuizzes} quizzes
            </Descriptions.Item>
            <Descriptions.Item label="Huấn luyện viên" span={2}>
              <div className="flex items-center gap-2">
                <Avatar src={course.coachAvatar} icon={<UserOutlined />} />
                <div>
                  <div className="font-medium">{course.coachName}</div>
                  <div className="text-sm text-gray-500">{course.coachEmail}</div>
                </div>
              </div>
            </Descriptions.Item>
          </Descriptions>

          {/* Lessons List with Details */}
          <div className="mt-4">
            <Title level={5}>Danh sách bài học</Title>
            {(() => {
              const lessons = course.requestData?.metadata?.details?.subject?.lessons || [];

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
                                    <Tag>Thời lượng: {lessonStats.videoDurationFormatted}</Tag>
                                    <Tag>Trạng thái: {getStatusText(lesson.video.status)}</Tag>
                                  </div>
                                  {lesson.video.publicUrl && (
                                    <Button
                                      type="primary"
                                      size="small"
                                      icon={<PlayCircleOutlined />}
                                      className="mt-2"
                                      onClick={() =>
                                        onPlayVideo({
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
                                          coachName: course.coachName,
                                          coachEmail: course.coachEmail,
                                          coachAvatar: course.coachAvatar,
                                          lessonName: lesson.name,
                                          courseName: course.courseName,
                                          createdAt: course?.createdAt
                                            ? formatDateSafe(course.createdAt)
                                            : '-',
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
                                  <div className="text-sm text-gray-500">
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
                                {lessonStats.totalDurationFormatted}
                              </Descriptions.Item>
                              <Descriptions.Item label="Số thứ tự">
                                Bài {lesson.lessonNumber}
                              </Descriptions.Item>
                              <Descriptions.Item label="Ngày tạo">
                                {lesson?.createdAt ? formatDateSafe(lesson.createdAt) : '-'}
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
      ) : (
        <div className="flex items-center justify-center py-8">
          <Text type="secondary">Đang tải thông tin khóa học...</Text>
        </div>
      )}
    </Modal>
  );
}
