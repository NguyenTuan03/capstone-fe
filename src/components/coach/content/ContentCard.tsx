import Image from 'next/image';
import { EditOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Button, Dropdown, Tag, App } from 'antd';
import { VideoCameraOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { DeleteOutlined, FileTextOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { MoreOutlined } from '@ant-design/icons';

export const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    Beginner: 'green',
    Intermediate: 'blue',
    Advanced: 'purple',
  };
  return colors[level] || 'default';
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    published: 'success',
    draft: 'default',
    archived: 'warning',
  };
  return colors[status] || 'default';
};

export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const ContentCard = ({
  item,
  type,
  onView,
}: {
  item: any;
  type: 'quiz' | 'video' | 'lesson';
  onView?: (item: any) => void;
}) => {
  const { message } = App.useApp();
  const cardActions = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'Xem',
      onClick: () => {
        if (onView) {
          onView(item);
        } else {
          message.info(`Xem ${item.title || item.name}`);
        }
      },
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Sửa',
      onClick: () => message.info(`Sửa ${item.title || item.name}`),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Xóa',
      danger: true,
      onClick: () => message.warning(`Xóa ${item.title || item.name}`),
    },
  ];

  return (
    <Card
      hoverable
      className="content-card"
      styles={{
        body: { padding: '16px' },
      }}
    >
      {/* Video Thumbnail */}
      {type === 'video' && item.thumbnailUrl && (
        <div
          className="mb-3 rounded-lg overflow-hidden relative"
          style={{ aspectRatio: '16/9', maxHeight: '150px' }}
        >
          <Image
            src={item.thumbnailUrl}
            alt={item.title || 'Video thumbnail'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {type === 'quiz' && <QuestionCircleOutlined className="text-blue-500 text-xl" />}
          {type === 'video' && <VideoCameraOutlined className="text-orange-500 text-xl" />}
          {type === 'lesson' && <FileTextOutlined className="text-green-500 text-xl" />}
          <h4 className="text-base font-semibold m-0 line-clamp-1">{item.title || item.name}</h4>
        </div>
        <Dropdown menu={{ items: cardActions }} trigger={['click']} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(type === 'quiz' || type === 'video') && item.lessonName && (
          <Tag color="cyan" className="m-0">
            📚 {item.lessonName}
          </Tag>
        )}
        {item.level && (
          <Tag color={getLevelColor(item.level)} className="m-0">
            {item.level}
          </Tag>
        )}
        {item.status && (
          <Tag
            color={
              type === 'video' && item.videoStatus
                ? item.videoStatus === 'READY'
                  ? 'success'
                  : item.videoStatus === 'UPLOADING' || item.videoStatus === 'ANALYZING'
                    ? 'processing'
                    : item.videoStatus === 'ERROR'
                      ? 'error'
                      : getStatusColor(item.status)
                : getStatusColor(item.status)
            }
            className="m-0"
          >
            {type === 'video' && item.videoStatus
              ? item.videoStatus === 'READY'
                ? 'Sẵn sàng'
                : item.videoStatus === 'UPLOADING'
                  ? 'Đang tải lên'
                  : item.videoStatus === 'ANALYZING'
                    ? 'Đang phân tích'
                    : item.videoStatus === 'ERROR'
                      ? 'Lỗi'
                      : item.status === 'published'
                        ? 'Đã xuất bản'
                        : 'Nháp'
              : item.status === 'published'
                ? 'Đã xuất bản'
                : item.status === 'draft'
                  ? 'Nháp'
                  : 'Lưu trữ'}
          </Tag>
        )}
        {type === 'video' && item.tags && item.tags.length > 0 && (
          <>
            {item.tags.slice(0, 2).map((tag: string, index: number) => (
              <Tag key={index} color="blue" className="m-0">
                #{tag}
              </Tag>
            ))}
            {item.tags.length > 2 && (
              <Tag color="default" className="m-0">
                +{item.tags.length - 2}
              </Tag>
            )}
          </>
        )}
      </div>

      {/* Meta Info */}
      <div className="space-y-1.5 text-sm text-gray-600">
        {type === 'quiz' && (
          <>
            <div className="flex items-center gap-2">
              <QuestionCircleOutlined />
              <span>{item.questions} câu hỏi</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockCircleOutlined />
              <span>{item.duration} phút</span>
            </div>
          </>
        )}

        {type === 'video' && (
          <div className="flex items-center gap-2">
            <ClockCircleOutlined />
            <span>Thời lượng: {item.durationFormatted || formatDuration(item.duration || 0)}</span>
          </div>
        )}

        {type === 'lesson' && item.duration && (
          <div className="flex items-center gap-2">
            <ClockCircleOutlined />
            <span>{item.duration} phút</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <UsergroupAddOutlined />
          <span>Đã dùng: {item.usedCount || 0} lần</span>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-gray-500 mt-2 mb-0 line-clamp-2">{item.description}</p>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {item.createdAt || new Date().toISOString().split('T')[0]}
        </span>
      </div>
    </Card>
  );
};
