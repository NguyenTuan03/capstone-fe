'use client';

import React, { useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Radio,
  Space,
  Form,
  Input,
  Button,
  Alert,
  Progress,
  Result,
} from 'antd';
import {
  LeftOutlined,
  CreditCardOutlined,
  MobileOutlined,
  WalletOutlined,
  IeOutlined,
  CheckCircleTwoTone,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const { Title, Text } = Typography;

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'momo' | 'bank'>(
    'card',
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2>(1);
  const [form] = Form.useForm();

  // Mock user data (đã đăng nhập)
  const user = {
    fullName: 'Lâm Tiên Hưng',
    email: 'lamtienhung@example.com',
    phone: '0901234567',
  };

  // Mock course data
  const course = {
    id: 1,
    title: 'Cơ bản Pickleball cho người mới bắt đầu',
    coach: 'Huấn luyện viên Nguyễn Văn A',
    price: '500.000 VNĐ',
    duration: '4 tuần',
    level: 'Cơ bản',
    image:
      'https://cdn.britannica.com/25/236225-050-59A4051E/woman-daughter-doubles-pickleball.jpg',
    location: 'Sân Pickleball Quận 3',
    courseType: 'individual',
    startDate: '2025-01-15',
    endDate: '2025-02-12',
    totalSessions: 8,
    weeklySchedule: [
      { day: 'Thứ 3', time: '19:00-20:30', sessions: 4 },
      { day: 'Thứ 5', time: '19:00-20:30', sessions: 4 },
    ],
    benefits: [
      'Học 1 kèm 1 với HLV chuyên nghiệp',
      'Thiết bị luyện tập miễn phí',
      'Video phân tích kỹ thuật cá nhân',
      'Chứng chỉ hoàn thành khóa học',
      'Tham gia cộng đồng Pickleball',
      'Hỗ trợ 24/7 qua Zalo',
    ],
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Thẻ tín dụng/Ghi nợ',
      icon: CreditCardOutlined,
      description: 'Visa, Mastercard, JCB',
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: MobileOutlined,
      description: 'Thanh toán qua ví điện tử',
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      icon: WalletOutlined,
      description: 'Quét mã QR hoặc chuyển khoản',
    },
  ];

  const handlePrevStep = () => {
    if (paymentStep === 1) {
      router.back();
      return;
    }
    setPaymentStep(1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setPaymentStep(2);
  };

  const renderStep1 = () => (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bodyStyle={{ padding: 16 }} style={{ borderColor: '#91caff', background: '#e6f4ff' }}>
        <Title level={4} style={{ marginTop: 0, color: '#0958d9' }}>
          Thông tin học viên
        </Title>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Text type="secondary">Họ và tên:</Text>
            <Text strong>{user.fullName}</Text>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">Email:</Text>
            <Text>{user.email}</Text>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">Số điện thoại:</Text>
            <Text>{user.phone}</Text>
          </Row>
        </Space>
      </Card>

      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Text strong>Chọn phương thức thanh toán</Text>
        <Radio.Group
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Card
              hoverable
              onClick={() => setSelectedPaymentMethod('card')}
              bodyStyle={{ padding: 12 }}
            >
              <Space>
                <Radio value="card" />
                <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 8 }}>
                  <CreditCardOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>Thẻ tín dụng/Ghi nợ</div>
                  <Text type="secondary">Visa, Mastercard, JCB</Text>
                </div>
              </Space>
            </Card>
            <Card
              hoverable
              onClick={() => setSelectedPaymentMethod('momo')}
              bodyStyle={{ padding: 12 }}
            >
              <Space>
                <Radio value="momo" />
                <div style={{ padding: 8, background: '#fff1f0', borderRadius: 8 }}>
                  <MobileOutlined style={{ color: '#eb2f96' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>Ví MoMo</div>
                  <Text type="secondary">Thanh toán qua ví điện tử</Text>
                </div>
              </Space>
            </Card>
            <Card
              hoverable
              onClick={() => setSelectedPaymentMethod('bank')}
              bodyStyle={{ padding: 12 }}
            >
              <Space>
                <Radio value="bank" />
                <div style={{ padding: 8, background: '#f6ffed', borderRadius: 8 }}>
                  <WalletOutlined style={{ color: '#52c41a' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>Chuyển khoản ngân hàng</div>
                  <Text type="secondary">Quét mã QR hoặc chuyển khoản</Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Radio.Group>
      </Space>

      {selectedPaymentMethod === 'card' && (
        <Card title="Thông tin thẻ" bodyStyle={{ paddingTop: 12 }}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Số thẻ"
              name="cardNumber"
              rules={[{ required: true, message: 'Vui lòng nhập số thẻ' }]}
            >
              <Input placeholder="1234 5678 9012 3456" maxLength={19} />
            </Form.Item>
            <Form.Item
              label="Tên trên thẻ"
              name="cardName"
              rules={[{ required: true, message: 'Vui lòng nhập tên trên thẻ' }]}
            >
              <Input placeholder="NGUYEN VAN A" />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={12}>
                <Form.Item
                  label="Ngày hết hạn"
                  name="expiryDate"
                  rules={[{ required: true, message: 'Vui lòng nhập MM/YY' }]}
                >
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label="CVV"
                  name="cvv"
                  rules={[{ required: true, message: 'Vui lòng nhập CVV' }]}
                >
                  <Input placeholder="123" maxLength={3} type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {selectedPaymentMethod === 'momo' && (
        <Alert
          message="Thanh toán qua MoMo"
          description="Sau khi nhấn 'Thanh toán', bạn sẽ được chuyển đến ứng dụng MoMo để hoàn tất."
          type="info"
          showIcon
        />
      )}

      {selectedPaymentMethod === 'bank' && (
        <Alert
          message="Chuyển khoản ngân hàng"
          description={
            <div>
              Sau khi nhấn &apos;Thanh toán&apos;, mã QR sẽ được hiển thị để bạn quét và chuyển
              khoản.
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Ngân hàng: Vietcombank • Số TK: 1234567890 • Chủ TK: PICKLE LEARN CENTER
                </Text>
              </div>
            </div>
          }
          type="success"
          showIcon
        />
      )}

      <Alert
        style={{ marginTop: 4 }}
        message="Bảo mật thanh toán"
        description="Thông tin thanh toán của bạn được mã hóa và bảo mật. Tuân thủ tiêu chuẩn PCI DSS."
        type="success"
        icon={<IeOutlined />}
        showIcon
      />
    </Space>
  );

  const renderStep2 = () => (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Result
        status="success"
        title="Đăng ký thành công!"
        subTitle="Chúc mừng bạn đã đăng ký khóa học thành công"
        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
      />
      <Card bodyStyle={{ padding: 16 }} style={{ borderColor: '#b7eb8f', background: '#f6ffed' }}>
        <Title level={4} style={{ marginTop: 0, color: '#389e0d' }}>
          Thông tin đăng ký
        </Title>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Row justify="space-between">
            <Text type="secondary">Mã đăng ký:</Text>
            <Text strong>PKL-{Date.now().toString().slice(-6)}</Text>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">Họ và tên:</Text>
            <Text>{user.fullName}</Text>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">Khóa học:</Text>
            <Text>{course.title}</Text>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">Ngày bắt đầu:</Text>
            <Text>{course.startDate}</Text>
          </Row>
          <Row justify="space-between">
            <Text type="secondary">Số tiền đã thanh toán:</Text>
            <Text strong>{course.price}</Text>
          </Row>
        </Space>
      </Card>

      <Card>
        <Title level={5}>Các bước tiếp theo</Title>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div>
            <Text strong>1. Kiểm tra email xác nhận</Text>
            <div>
              <Text type="secondary">Chúng tôi đã gửi email xác nhận đến {user.email}</Text>
            </div>
          </div>
          <div>
            <Text strong>2. Tham gia nhóm Zalo</Text>
            <div>
              <Text type="secondary">Liên hệ với HLV và các học viên khác</Text>
            </div>
          </div>
          <div>
            <Text strong>3. Chuẩn bị cho buổi học đầu tiên</Text>
            <div>
              <Text type="secondary">Đến đúng giờ và chuẩn bị trang phục phù hợp</Text>
            </div>
          </div>
        </Space>
      </Card>

      <Alert
        message="Cần hỗ trợ?"
        description={
          <div>
            Liên hệ với chúng tôi qua Hotline: 1900 1234 • Email: support@picklelearn.vn • Zalo: 090
            123 4567
          </div>
        }
        type="info"
        showIcon
      />
    </Space>
  );

  const renderCurrentStep = () => {
    switch (paymentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (paymentStep) {
      case 1:
        return 'Thanh toán';
      case 2:
        return 'Hoàn thành';
      default:
        return 'Thanh toán';
    }
  };

  const totalSteps = 2;
  const progressPercentage = (paymentStep / totalSteps) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f6ffed,#e6fffb)' }}>
      <div style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Button onClick={handlePrevStep} disabled={paymentStep === 2} icon={<LeftOutlined />} />
            <Title level={4} style={{ margin: 0 }}>
              {getStepTitle()}
            </Title>
            <div style={{ width: 36 }} />
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#595959',
                marginBottom: 8,
              }}
            >
              <span>
                Bước {paymentStep} / {totalSteps}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress percent={progressPercentage} showInfo={false} strokeColor="#52c41a" />
          </div>
        </div>
      </div>

      {paymentStep < 2 && (
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ padding: 16 }}>
            <Card
              bodyStyle={{ padding: 16 }}
              style={{ borderColor: '#b7eb8f', background: '#f6ffed' }}
            >
              <Row gutter={12} align="middle">
                <Col>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      background: '#f0f0f0',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={course.image as string}
                      alt={course.title}
                      width={64}
                      height={64}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </Col>
                <Col flex="auto">
                  <Title level={5} style={{ margin: 0 }}>
                    {course.title}
                  </Title>
                  <Text type="secondary">{course.coach}</Text>
                  <div
                    style={{
                      marginTop: 4,
                      display: 'flex',
                      gap: 12,
                      fontSize: 12,
                      color: '#595959',
                    }}
                  >
                    <span>
                      <CalendarOutlined /> {course.startDate}
                    </span>
                    <span>
                      <EnvironmentOutlined /> {course.location}
                    </span>
                    <span>
                      <ClockCircleOutlined /> {course.totalSessions} buổi
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      )}

      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>{renderCurrentStep()}</div>
      </div>

      {paymentStep < 2 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            padding: 16,
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <Card bodyStyle={{ padding: 12 }} style={{ marginBottom: 12, background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Tổng thanh toán:</span>
                <span style={{ color: '#52c41a' }}>{course.price}</span>
              </div>
            </Card>
            <Button
              type="primary"
              block
              size="large"
              onClick={handlePayment}
              loading={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : `Thanh toán ${course.price}`}
            </Button>
          </div>
        </div>
      )}

      {paymentStep === 2 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            padding: 16,
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 12 }}>
            <Button onClick={() => router.push('/')} block>
              Quay lại trang chính
            </Button>
            <Button
              type="primary"
              block
              icon={<TrophyOutlined />}
              onClick={() => router.push('/my-courses')}
            >
              Xem khóa học
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
