'use client';

import React from 'react';
import Image from 'next/image';
import { Modal, Descriptions, Tag, Button, Space, Divider, Card, Empty } from 'antd';
import {
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { formatDuration } from './ContentCard';

interface LessonDetailModalProps {
  open: boolean;
  lesson: any;
  onClose: () => void;
}

const LessonDetailModal: React.FC<LessonDetailModalProps> = ({ open, lesson, onClose }) => {
  if (!lesson) return null;

  // Use original data if available, otherwise use mapped data
  const lessonData = lesson._original || lesson;
  const videos = lessonData.videos || [];
  const quizzes = lessonData.quizzes || [];

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      READY: { color: 'success', label: 'Sẵn sàng' },
      UPLOADING: { color: 'processing', label: 'Đang tải lên' },
      ANALYZING: { color: 'processing', label: 'Đang phân tích' },
      ERROR: { color: 'error', label: 'Lỗi' },
    };
    return config[status] || { color: 'default', label: status };
  };

  const parseTags = (tags: string | null | undefined): string[] => {
    if (!tags) return [];
    try {
      const parsed = typeof tags === 'string' ? JSON.parse(tags) : tags;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>Chi tiết Bài học</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={1000}
      centered
      styles={{
        body: {
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        },
      }}
    >
      {lessonData && (
        <div>
          {/* Basic Information */}
          <Descriptions column={1} bordered className="mb-6">
            <Descriptions.Item label="Tên bài học">
              <span className="font-semibold text-lg">{lessonData.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {lessonData.description || 'Chưa có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Số thứ tự">
              <Space>
                <FileTextOutlined />
                <span>Bài học số {lessonData.lessonNumber || 'N/A'}</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Thời lượng">
              <Space>
                <ClockCircleOutlined />
                <span>{lessonData.duration || 0} phút</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Số video">
              <Space>
                <VideoCameraOutlined />
                <span>{videos.length} video</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Số quiz">
              <Space>
                <QuestionCircleOutlined />
                <span>{quizzes.length} quiz</span>
              </Space>
            </Descriptions.Item>
            {lessonData.createdAt && (
              <Descriptions.Item label="Ngày tạo">
                <Space>
                  <CalendarOutlined />
                  <span>{new Date(lessonData.createdAt).toLocaleString('vi-VN')}</span>
                </Space>
              </Descriptions.Item>
            )}
            {lessonData.updatedAt && (
              <Descriptions.Item label="Ngày cập nhật">
                <Space>
                  <CalendarOutlined />
                  <span>{new Date(lessonData.updatedAt).toLocaleString('vi-VN')}</span>
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Videos Section */}
          <Divider orientation="left">
            <VideoCameraOutlined /> Danh sách Video ({videos.length})
          </Divider>
          {videos.length > 0 ? (
            <div className="space-y-4 mb-6">
              {videos.map((video: any, index: number) => {
                const statusConfig = getStatusConfig(video.status);
                const tags = parseTags(video.tags);

                return (
                  <Card
                    key={video.id || index}
                    size="small"
                    className="shadow-sm"
                    title={
                      <div className="flex items-center gap-2">
                        <VideoCameraOutlined />
                        <span className="font-semibold">{video.title || `Video ${index + 1}`}</span>
                        <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
                      </div>
                    }
                    extra={
                      video.publicUrl && (
                        <Button
                          type="link"
                          icon={<PlayCircleOutlined />}
                          href={video.publicUrl}
                          target="_blank"
                        >
                          Xem video
                        </Button>
                      )
                    }
                  >
                    <div className="space-y-3">
                      {video.description && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">Mô tả:</div>
                          <p className="text-sm text-gray-700 mb-0">{video.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {video.duration && (
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">
                              Thời lượng:
                            </div>
                            <Space>
                              <ClockCircleOutlined />
                              <span>{formatDuration(video.duration)}</span>
                            </Space>
                          </div>
                        )}

                        {tags.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Tags:</div>
                            <Space wrap>
                              {tags.map((tag: string, tagIndex: number) => (
                                <Tag key={tagIndex} color="blue">
                                  #{tag}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                      </div>

                      {video.thumbnailUrl && (
                        <div className="rounded-lg overflow-hidden" style={{ maxWidth: '300px' }}>
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title || 'Video thumbnail'}
                            width={300}
                            height={169}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      {(video.drillName || video.drillDescription || video.drillPracticeSets) && (
                        <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                          <div className="text-sm font-semibold text-blue-700 mb-2">Hướng dẫn:</div>
                          {video.drillName && (
                            <div className="mb-1">
                              <span className="font-medium">Tên bài tập:</span> {video.drillName}
                            </div>
                          )}
                          {video.drillDescription && (
                            <div className="mb-1">
                              <span className="font-medium">Mô tả bài tập:</span>{' '}
                              {video.drillDescription}
                            </div>
                          )}
                          {video.drillPracticeSets && (
                            <div>
                              <span className="font-medium">Cách tập:</span>{' '}
                              {video.drillPracticeSets}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có video nào"
              className="mb-6"
            />
          )}

          {/* Quizzes Section */}
          <Divider orientation="left">
            <QuestionCircleOutlined /> Danh sách Quiz ({quizzes.length})
          </Divider>
          {quizzes.length > 0 ? (
            <div className="space-y-4">
              {quizzes.map((quiz: any, index: number) => (
                <Card
                  key={quiz.id || index}
                  size="small"
                  className="shadow-sm"
                  title={
                    <div className="flex items-center gap-2">
                      <QuestionCircleOutlined />
                      <span className="font-semibold">{quiz.title || `Quiz ${index + 1}`}</span>
                    </div>
                  }
                >
                  <div className="space-y-2">
                    {quiz.description && (
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Mô tả:</div>
                        <p className="text-sm text-gray-700 mb-0">{quiz.description}</p>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Số câu hỏi:</div>
                      <Space>
                        <QuestionCircleOutlined />
                        <span>{quiz.totalQuestions || 0} câu hỏi</span>
                      </Space>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Chưa có quiz nào"
              className="mb-6"
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default LessonDetailModal;
