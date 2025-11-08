'use client';

import React from 'react';
import Image from 'next/image';
import { Modal, Descriptions, Tag, Button, Space, Divider } from 'antd';
import {
  EyeOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { formatDuration } from './ContentCard';

interface VideoDetailModalProps {
  open: boolean;
  video: any;
  onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ open, video, onClose }) => {
  if (!video) return null;

  const getStatusConfig = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      READY: { color: 'success', label: 'Sẵn sàng' },
      UPLOADING: { color: 'processing', label: 'Đang tải lên' },
      ANALYZING: { color: 'processing', label: 'Đang phân tích' },
      ERROR: { color: 'error', label: 'Lỗi' },
    };
    return config[status] || { color: 'default', label: status };
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <VideoCameraOutlined />
          <span>Chi tiết Video</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        video.publicUrl && (
          <Button
            key="watch"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => window.open(video.publicUrl, '_blank')}
          >
            Xem Video
          </Button>
        ),
      ]}
      width={900}
      centered
      styles={{
        body: {
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        },
      }}
    >
      {video && (
        <div>
          {/* Video Thumbnail/Preview */}
          {video.thumbnailUrl && (
            <div
              className="mb-6 rounded-lg overflow-hidden relative"
              style={{ aspectRatio: '16/9', maxHeight: '400px' }}
            >
              <Image
                src={video.thumbnailUrl}
                alt={video.title || 'Video thumbnail'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Basic Information */}
          <Descriptions column={1} bordered className="mb-6">
            <Descriptions.Item label="Tiêu đề">
              <span className="font-semibold text-lg">{video.title}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {video.description || 'Chưa có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getStatusConfig(video.videoStatus || video.status).color}>
                {getStatusConfig(video.videoStatus || video.status).label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thời lượng">
              <Space>
                <ClockCircleOutlined />
                <span>{video.durationFormatted || formatDuration(video.duration || 0)}</span>
              </Space>
            </Descriptions.Item>
            {video.lessonName && (
              <Descriptions.Item label="Bài học">
                <Tag color="cyan">📚 {video.lessonName}</Tag>
              </Descriptions.Item>
            )}
            {video.tags && video.tags.length > 0 && (
              <Descriptions.Item label="Tags">
                <Space wrap>
                  {video.tags.map((tag: string, index: number) => (
                    <Tag key={index} color="blue">
                      #{tag}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            {video.uploadedBy && (
              <Descriptions.Item label="Người đăng tải video">
                <Space>
                  <UserOutlined />
                  <span>{video.uploadedBy.fullName || video.uploadedBy.email}</span>
                </Space>
              </Descriptions.Item>
            )}
            {video.createdAt && (
              <Descriptions.Item label="Ngày tạo">
                <Space>
                  <CalendarOutlined />
                  <span>{new Date(video.createdAt).toLocaleString('vi-VN')}</span>
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Drill Information */}
          {(video.drillName || video.drillDescription || video.drillPracticeSets) && (
            <>
              <Divider orientation="left">
                <TagOutlined /> Thông tin Drill
              </Divider>
              <Descriptions column={1} bordered>
                {video.drillName && (
                  <Descriptions.Item label="Tên Drill">
                    <span className="font-medium">{video.drillName}</span>
                  </Descriptions.Item>
                )}
                {video.drillDescription && (
                  <Descriptions.Item label="Mô tả Drill">
                    {video.drillDescription}
                  </Descriptions.Item>
                )}
                {video.drillPracticeSets && (
                  <Descriptions.Item label="Lịch tập luyện">
                    {video.drillPracticeSets}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </>
          )}

          {/* Video Player */}
          {video.publicUrl && (
            <>
              <Divider orientation="left">
                <VideoCameraOutlined /> Video Player
              </Divider>
              <div className="rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <video
                  controls
                  className="w-full h-full"
                  style={{ maxHeight: '500px' }}
                  src={video.publicUrl}
                >
                  Trình duyệt của bạn không hỗ trợ video tag.
                </video>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default VideoDetailModal;
