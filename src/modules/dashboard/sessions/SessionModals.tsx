'use client';

import React from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Select,
  Input,
  Upload,
  Button,
  Descriptions,
  Space,
  Avatar,
  Tag,
  Tabs,
  Alert,
  Card,
  Row,
  Col,
  Rate,
  Typography,
} from 'antd';

import { PlayCircleOutlined, UploadOutlined, EnvironmentOutlined } from '@ant-design/icons';

import { Session } from '@/types/session';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

interface SessionModalsProps {
  selectedSession: Session | null;
  detailModalVisible: boolean;
  refundModalVisible: boolean;
  suspendModalVisible: boolean;
  warnModalVisible: boolean;
  refundReasons: string[];
  refundForm: any;
  suspendForm: any;
  warnForm: any;
  getStatusTag: (status: Session['status']) => React.ReactElement;
  getPaymentTag: (paymentStatus: Session['paymentStatus']) => React.ReactElement;
  formatCurrency: (amount: number) => string;
  formatDateTime: (dateTime: string) => string;
  formatDuration: (minutes: number) => string;
  handleProcessRefund: (values: any) => void;
  handleProcessSuspend: (values: any) => void;
  handleProcessWarn: (values: any) => void;
  setDetailModalVisible: (visible: boolean) => void;
  setRefundModalVisible: (visible: boolean) => void;
  setSuspendModalVisible: (visible: boolean) => void;
  setWarnModalVisible: (visible: boolean) => void;
  loading: boolean;
}

const SessionModals: React.FC<SessionModalsProps> = ({
  selectedSession,
  detailModalVisible,
  refundModalVisible,
  suspendModalVisible,
  warnModalVisible,
  refundReasons,
  refundForm,
  suspendForm,
  warnForm,
  getStatusTag,
  getPaymentTag,
  formatCurrency,
  formatDateTime,
  formatDuration,
  handleProcessRefund,
  handleProcessSuspend,
  handleProcessWarn,
  setDetailModalVisible,
  setRefundModalVisible,
  setSuspendModalVisible,
  setWarnModalVisible,
  loading,
}) => {
  return (
    <>
      {/* Session Detail Modal */}
      <Modal
        title="Chi tiết buổi học"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedSession && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab="Thông tin cơ bản" key="basic">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="ID" span={2}>
                  <Text code>{selectedSession.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Học viên">
                  <Space>
                    <Avatar src={selectedSession.learner.avatar} size="small" />
                    {selectedSession.learner.name}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Coach">
                  <Space>
                    <Avatar src={selectedSession.coach.avatar} size="small" />
                    {selectedSession.coach.name}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian">
                  {formatDateTime(selectedSession.scheduledTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời lượng">
                  {formatDuration(selectedSession.duration)}
                </Descriptions.Item>
                <Descriptions.Item label="Hình thức">
                  <Tag color={selectedSession.type === 'online' ? 'blue' : 'green'}>
                    {selectedSession.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedSession.status)}
                </Descriptions.Item>
                {selectedSession.location && (
                  <Descriptions.Item label="Địa điểm" span={2}>
                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                    {selectedSession.location}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Chủ đề" span={2}>
                  {selectedSession.subject}
                </Descriptions.Item>
                <Descriptions.Item label="Mục tiêu" span={2}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {selectedSession.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </Descriptions.Item>
              </Descriptions>

              {selectedSession.progressNotes && (
                <Alert
                  message="Tiến độ buổi học"
                  description={selectedSession.progressNotes}
                  type="info"
                  style={{ marginTop: 16 }}
                />
              )}
            </TabPane>

            {selectedSession.hasRecording && (
              <TabPane tab="Video ghi hình" key="recording">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <PlayCircleOutlined
                    style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }}
                  />
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Thời lượng: </Text>
                    <Text>{formatDuration(selectedSession.recordingDuration || 0)}</Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => window.open(selectedSession.recordingUrl, '_blank')}
                  >
                    Xem video
                  </Button>
                </div>
              </TabPane>
            )}

            {selectedSession.reports.length > 0 && (
              <TabPane tab="Báo cáo" key="reports">
                {selectedSession.reports.map((report) => (
                  <Card key={report.id} size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={16}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>{report.title}</Text>
                          <Tag color="red" style={{ marginLeft: 8 }}>
                            {report.priority.toUpperCase()}
                          </Tag>
                          <Tag color={report.status === 'resolved' ? 'green' : 'orange'}>
                            {report.status.toUpperCase()}
                          </Tag>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text type="secondary">
                            Từ: {report.reporterName} → {report.reportedName}
                          </Text>
                        </div>
                        <div>{report.description}</div>
                        {report.resolution && (
                          <Alert
                            message="Giải pháp"
                            description={report.resolution}
                            type="success"
                            style={{ marginTop: 8 }}
                          />
                        )}
                      </Col>
                      <Col span={8}>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {formatDateTime(report.createdAt)}
                        </div>
                        {report.evidence && report.evidence.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Text strong>Bằng chứng:</Text>
                            {report.evidence.map((url, i) => (
                              <div key={i}>
                                <Button type="link" onClick={() => window.open(url, '_blank')}>
                                  Xem bằng chứng {i + 1}
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </TabPane>
            )}

            <TabPane tab="Phản hồi" key="feedback">
              <Row gutter={16}>
                {selectedSession.learnerFeedback && (
                  <Col span={12}>
                    <Card title="Từ học viên" size="small">
                      <div style={{ marginBottom: 8 }}>
                        <Rate disabled value={selectedSession.learnerFeedback.rating} />
                        <Text style={{ marginLeft: 8 }}>
                          ({selectedSession.learnerFeedback.rating}/5)
                        </Text>
                      </div>
                      <div>{selectedSession.learnerFeedback.comment}</div>
                      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                        {formatDateTime(selectedSession.learnerFeedback.createdAt)}
                      </div>
                    </Card>
                  </Col>
                )}
                {selectedSession.coachFeedback && (
                  <Col span={12}>
                    <Card title="Từ huấn luyện viên" size="small">
                      <div style={{ marginBottom: 8 }}>
                        <Rate disabled value={selectedSession.coachFeedback.rating} />
                        <Text style={{ marginLeft: 8 }}>
                          ({selectedSession.coachFeedback.rating}/5)
                        </Text>
                      </div>
                      <div>{selectedSession.coachFeedback.comment}</div>
                      <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                        {formatDateTime(selectedSession.coachFeedback.createdAt)}
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        title="Hoàn tiền buổi học"
        open={refundModalVisible}
        onCancel={() => {
          setRefundModalVisible(false);
          refundForm.resetFields();
        }}
        onOk={() => refundForm.submit()}
        confirmLoading={loading}
      >
        <Form form={refundForm} onFinish={handleProcessRefund} layout="vertical">
          <Form.Item
            name="amount"
            label="Số tiền hoàn"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền hoàn' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0')}
              addonAfter="VND"
              min={0}
              max={selectedSession?.totalAmount || 0}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do hoàn tiền"
            rules={[{ required: true, message: 'Vui lòng chọn lý do hoàn tiền' }]}
          >
            <Select placeholder="Chọn lý do hoàn tiền...">
              {refundReasons.map((reason, index) => (
                <Option key={index} value={reason}>
                  {reason}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={3}
              placeholder="Ghi chú chi tiết về việc hoàn tiền..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        title="Tạm ngưng tài khoản"
        open={suspendModalVisible}
        onCancel={() => {
          setSuspendModalVisible(false);
          suspendForm.resetFields();
        }}
        onOk={() => suspendForm.submit()}
        confirmLoading={loading}
        width={600}
      >
        <Form form={suspendForm} onFinish={handleProcessSuspend} layout="vertical">
          <Form.Item name="userType" label={'Loại người dùng'}>
            <Select disabled>
              <Option value="coach">Huấn luyện viên</Option>
              <Option value="learner">Học viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="duration"
            label={'Thời gian tạm ngưng'}
            rules={[{ required: true, message: 'Vui lòng chọn thời gian khóa' }]}
          >
            <Select>
              <Option value={1}>1 ngày</Option>
              <Option value={3}>3 ngày</Option>
              <Option value={7}>7 ngày</Option>
              <Option value={14}>14 ngày</Option>
              <Option value={30}>30 ngày</Option>
              <Option value={-1}>Vĩnh viễn</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reason"
            label={'Lý do tạm ngưng'}
            rules={[{ required: true, message: 'Vui lòng nhập lý do tạm khóa' }]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập lý do tạm khóa người dùng..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item name="evidence" label={'Bằng chứng'}>
            <Upload listType="picture" multiple beforeUpload={() => false} maxCount={5}>
              <Button icon={<UploadOutlined />}>Tải lên bằng chứng</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú thêm">
            <TextArea
              rows={2}
              placeholder="Ghi chú thêm cho việc tạm khóa..."
              maxLength={300}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Warn Modal */}
      <Modal
        title={'Cảnh báo người dùng'}
        open={warnModalVisible}
        onCancel={() => {
          setWarnModalVisible(false);
          warnForm.resetFields();
        }}
        onOk={() => warnForm.submit()}
        confirmLoading={loading}
      >
        <Form form={warnForm} onFinish={handleProcessWarn} layout="vertical">
          <Form.Item name="userType" label={'Loại người dùng'}>
            <Select disabled>
              <Option value="coach">Huấn luyện viên</Option>
              <Option value="learner">Học viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="severity"
            label={'Mức độ nghiêm trọng'}
            rules={[{ required: true, message: 'Vui lòng chọn mức độ nghiêm trọng' }]}
          >
            <Select>
              <Option value="low">Nhẹ</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="high">Nghiêm trọng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do cảnh cáo"
            rules={[{ required: true, message: 'Vui lòng nhập lý do cảnh cáo' }]}
          >
            <TextArea
              rows={3}
              placeholder="Nhập lý do cảnh cáo người dùng..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú thêm">
            <TextArea
              rows={2}
              placeholder="Ghi chú thêm cho việc cảnh cáo..."
              maxLength={300}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SessionModals;
