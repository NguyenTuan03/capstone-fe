import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Spin,
  Divider,
  Timeline,
  List,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title, Paragraph } = Typography;

export function RequestDetailModal({
  open,
  onClose,
  selectedRequest,
  isLoadingDetail,
  onApprove,
  onReject,
}: {
  open: boolean;
  onClose: () => void;
  selectedRequest: any | null;
  isLoadingDetail: boolean;
  onApprove?: (r: any) => void;
  onReject?: (r: any) => void;
}) {
  const r = selectedRequest;
  const details = r?.metadata?.details;

  const footer =
    r && r.status === 'PENDING'
      ? [
          <Button key="reject" danger icon={<CloseOutlined />} onClick={() => onReject?.(r)}>
            Từ chối
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onApprove?.(r)}
          >
            Duyệt
          </Button>,
        ]
      : [
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,
        ];

  return (
    <Modal
      title={
        <Space size={8}>
          <EyeOutlined />
          <span>Chi tiết yêu cầu</span>
          {r?.id ? <Text type="secondary">#{r.id}</Text> : null}
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={footer}
      width={960}
      centered
      // 👇 Scroll trong modal body, không overflow màn hình
      styles={{
        body: {
          maxHeight: 'calc(100dvh - 240px)',
          overflow: 'auto',
          paddingRight: 12,
        },
      }}
    >
      {isLoadingDetail ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" tip="Đang tải chi tiết..." />
        </div>
      ) : !r || !details ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">Không có dữ liệu</Text>
        </div>
      ) : (
        <>
          {/* Header: requester + status */}
          <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Avatar src={r.createdBy?.profilePicture} icon={<UserOutlined />} size={48} />
              <div style={{ lineHeight: 1.2 }}>
                <Title level={5} style={{ margin: 0 }}>
                  {r.createdBy?.fullName}
                </Title>
                <Space size={8} wrap>
                  {r.createdBy?.email && (
                    <Tooltip title={r.createdBy.email}>
                      <Space size={4}>
                        <MailOutlined />
                        <Text type="secondary">{r.createdBy.email}</Text>
                      </Space>
                    </Tooltip>
                  )}
                  {r.createdBy?.phoneNumber && (
                    <Space size={4}>
                      <PhoneOutlined />
                      <Text type="secondary">{r.createdBy.phoneNumber}</Text>
                    </Space>
                  )}
                  {r.createdBy?.role?.name && <Tag>{r.createdBy.role.name}</Tag>}
                </Space>
              </div>
            </Space>

            <Space wrap>
              <Tag color={getStatusColor(r.status)}>{getStatusText(r.status)}</Tag>
              <Tag>{getTypeText(r.type)}</Tag>
            </Space>
          </Space>

          <Divider style={{ margin: '16px 0' }} />

          {/* Info tổng quan */}
          <Descriptions bordered column={2} size="small" labelStyle={{ width: 180 }}>
            <Descriptions.Item label="Mô tả yêu cầu" span={2}>
              <Paragraph
                style={{ margin: 0 }}
                ellipsis={{ rows: 3, expandable: true, symbol: 'xem thêm' }}
              >
                {r.description || '—'}
              </Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              <Space size={6}>
                <CalendarOutlined />
                {formatDate(r.createdAt)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              <Space size={6}>
                <CalendarOutlined />
                {formatDate(r.updatedAt)}
              </Space>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left" style={{ marginTop: 16 }}>
            Thông tin khóa học
          </Divider>

          <Descriptions bordered column={2} size="small" labelStyle={{ width: 180 }}>
            <Descriptions.Item label="Tên khóa học" span={2}>
              <Text strong>
                <BookOutlined />
                &nbsp;{details.name}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trình độ">
              <Tag color="blue">{getLevelText(details.level)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getCourseStatusColor(details.status)}>
                {getCourseStatusText(details.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Hình thức học">
              {formatLearningFormat(details.learningFormat)}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số buổi">{details.totalSessions}</Descriptions.Item>
            <Descriptions.Item label="Số người tham gia">
              <Space size={6}>
                <TeamOutlined />
                {details.currentParticipants} / {details.maxParticipants} (Tối thiểu:{' '}
                {details.minParticipants})
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Giá / học viên">
              <Space size={6}>
                <DollarOutlined />
                {formatCurrency(details.pricePerParticipant)}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng doanh thu">
              {formatCurrency(details.totalEarnings)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {formatDate(details.startDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {details.endDate ? formatDate(details.endDate) : 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              <Space size={6} wrap>
                <EnvironmentOutlined />
                <Text>{details.address}</Text>
                {details.province?.name && <Tag>{details.province.name}</Tag>}
                {details.district?.name && <Tag>{details.district.name}</Tag>}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả khóa học" span={2}>
              <Paragraph
                style={{ margin: 0 }}
                ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}
              >
                {details.description || 'Không có mô tả'}
              </Paragraph>
            </Descriptions.Item>
          </Descriptions>

          {/* Lịch học */}
          <Divider orientation="left">Lịch học</Divider>
          {Array.isArray(details.schedules) && details.schedules.length > 0 ? (
            <List
              size="small"
              dataSource={details.schedules}
              renderItem={(s: any) => (
                <List.Item style={{ padding: '6px 0' }}>
                  <Tag style={{ marginRight: 8 }}>
                    {formatDayOfWeek(s.dayOfWeek)}: {s.startTime} – {s.endTime}
                  </Tag>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">Chưa có lịch học</Text>
          )}

          {/* Subject */}
          {details.subject && (
            <>
              <Divider orientation="left" style={{ marginTop: 16 }}>
                Thông tin môn học
              </Divider>
              <Descriptions bordered column={2} size="small" labelStyle={{ width: 180 }}>
                <Descriptions.Item label="Tên môn học" span={2}>
                  <Text strong>{details.subject.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trình độ">
                  <Tag color="blue">{getLevelText(details.subject.level)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color="green">{getSubjectStatusText(details.subject.status)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Người tạo">
                  <Space direction="vertical" size={0}>
                    <Text>{details.subject.createdBy?.fullName}</Text>
                    <Text type="secondary">{details.subject.createdBy?.email}</Text>
                    {details.subject.createdBy?.role?.name && (
                      <Tag>{details.subject.createdBy.role.name}</Tag>
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {formatDate(details.subject.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                  {formatDate(details.subject.updatedAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>
                  <Paragraph
                    style={{ margin: 0 }}
                    ellipsis={{ rows: 4, expandable: true, symbol: 'xem thêm' }}
                  >
                    {details.subject.description || 'Không có mô tả'}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}

          {/* Timeline */}
          <Divider orientation="left">Mốc thời gian</Divider>
          <Timeline
            items={[
              {
                color: 'gray',
                children: (
                  <>
                    Tạo yêu cầu — <Text type="secondary">{formatDate(r.createdAt)}</Text>
                  </>
                ),
              },
              {
                color: 'blue',
                children: (
                  <>
                    Tạo khóa học — <Text type="secondary">{formatDate(details.createdAt)}</Text>
                  </>
                ),
              },
              {
                color: 'orange',
                children: (
                  <>
                    Cập nhật khóa học —{' '}
                    <Text type="secondary">{formatDate(details.updatedAt)}</Text>
                  </>
                ),
              },
              {
                color: 'green',
                children: (
                  <>
                    Cập nhật yêu cầu — <Text type="secondary">{formatDate(r.updatedAt)}</Text>
                  </>
                ),
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
}

/* ==== helpers giữ nguyên signature của bạn cho đỡ sửa code khác ==== */
function getTypeText(type: string) {
  /* ... như bạn đang dùng ... */ return type;
}
function getStatusText(status: string) {
  /* ... */ return status;
}
function getStatusColor(status: string) {
  /* ... */ return 'blue';
}
function getCourseStatusColor(s: string) {
  /* ... */ return 'green';
}
function getCourseStatusText(s: string) {
  /* ... */ return s;
}
function getLevelText(l: string) {
  /* ... */ return l;
}
function getSubjectStatusText(s: string) {
  /* ... */ return s;
}
function formatDate(d?: string) {
  return d ? dayjs(d).format('DD/MM/YYYY HH:mm') : '—';
}
function formatCurrency(n?: number) {
  return typeof n === 'number' ? n.toLocaleString('vi-VN') + ' ₫' : '—';
}
function formatLearningFormat(v: any) {
  return String(v ?? '—');
}
function formatDayOfWeek(d: number) {
  /* 0..6 -> T2..CN tùy bạn */ return String(d);
}
