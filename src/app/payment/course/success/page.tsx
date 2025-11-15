'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/@crema/axios/ApiConfig';
import { buildUrl } from '@/@crema/helper/BuildUrl';
import { Result, Spin, Typography, Card, Space } from 'antd';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

interface PaymentSuccessQueryParams {
  id: string;
  code: string;
  orderCode: string;
  status: string;
  cancel: string;
}

const { Text } = Typography;

const PaymentCourseSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [requestState, setRequestState] = useState<RequestState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [queryParams, setQueryParams] = useState<PaymentSuccessQueryParams | null>(null);

  useEffect(() => {
    // Kiểm tra và parse query params ngay lập tức
    const id = searchParams.get('id');
    const code = searchParams.get('code');
    const orderCode = searchParams.get('orderCode');
    const status = searchParams.get('status');
    const cancel = searchParams.get('cancel');

    // Kiểm tra tất cả params bắt buộc
    if (!id || !code || !orderCode || !status || cancel === null) {
      setRequestState('error');
      setErrorMessage('Thiếu thông tin thanh toán trong đường dẫn. Vui lòng kiểm tra lại.');
      return;
    }

    const params: PaymentSuccessQueryParams = {
      id,
      code,
      orderCode,
      status,
      cancel,
    };

    setQueryParams(params);

    // Gửi request ngay lập tức sau khi có params hợp lệ
    let isMounted = true;

    const confirmPayment = async () => {
      setRequestState('loading');
      setErrorMessage('');

      try {
        await axios.get(buildUrl('payments/course/success'), {
          params,
        });

        if (isMounted) {
          setRequestState('success');
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Không thể xác nhận thanh toán. Vui lòng thử lại sau.';

        setErrorMessage(message);
        setRequestState('error');
      }
    };

    confirmPayment();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const isCancelled = queryParams?.cancel === 'true';
  const isPaid = queryParams?.status?.toUpperCase() === 'PAID';

  const renderContent = () => {
    if (requestState === 'loading' || requestState === 'idle') {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (requestState === 'error') {
      return <Result status="error" title="Xác nhận thanh toán thất bại" subTitle={errorMessage} />;
    }

    return (
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Result
          status={isCancelled ? 'warning' : 'success'}
          title={
            isCancelled
              ? 'Giao dịch đã bị hủy'
              : isPaid
                ? 'Thanh toán thành công!'
                : 'Thanh toán đã được xử lý'
          }
          subTitle={
            isCancelled
              ? 'Bạn đã hủy giao dịch. Nếu đây là nhầm lẫn, vui lòng thử thanh toán lại.'
              : 'Cảm ơn bạn đã đăng ký khóa học. Chúng tôi sẽ sớm liên hệ để xác nhận thông tin.'
          }
        />

        {queryParams && (
          <Card title="Chi tiết giao dịch">
            <Space direction="vertical" size={8}>
              <Text>
                <strong>Mã giao dịch:</strong> {queryParams.orderCode}
              </Text>
              <Text>
                <strong>Mã xác nhận:</strong> {queryParams.code}
              </Text>
              <Text>
                <strong>ID thanh toán:</strong> {queryParams.id}
              </Text>
              <Text>
                <strong>Trạng thái:</strong>{' '}
                {queryParams.status === 'PAID'
                  ? 'Thanh toán thành công'
                  : 'Thanh toán đã được xử lý'}
              </Text>
            </Space>
          </Card>
        )}
      </Space>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 16px',
        background: 'linear-gradient(135deg, #f6ffed, #e6f7ff)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 720 }}>{renderContent()}</div>
    </div>
  );
};

export default PaymentCourseSuccessPage;
