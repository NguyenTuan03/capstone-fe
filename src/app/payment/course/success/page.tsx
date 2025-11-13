'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/@crema/axios/ApiConfig';
import { buildUrl } from '@/@crema/helper/BuildUrl';
import { Result, Spin, Typography, Button, Card, Space } from 'antd';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const queryParams = useMemo<PaymentSuccessQueryParams | null>(() => {
    const id = searchParams.get('id');
    const code = searchParams.get('code');
    const orderCode = searchParams.get('orderCode');
    const status = searchParams.get('status');
    const cancel = searchParams.get('cancel');

    if (!id || !code || !orderCode || !status || cancel === null) {
      return null;
    }

    return {
      id,
      code,
      orderCode,
      status,
      cancel,
    };
  }, [searchParams]);

  useEffect(() => {
    if (!queryParams) {
      setRequestState('error');
      setErrorMessage('Thiếu thông tin thanh toán trong đường dẫn. Vui lòng kiểm tra lại.');
      return;
    }

    let isMounted = true;

    const confirmPayment = async () => {
      setRequestState('loading');
      setErrorMessage('');

      try {
        await axios.get(buildUrl('payments/course/success'), {
          params: queryParams,
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
  }, [queryParams]);

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
      return (
        <Result
          status="error"
          title="Xác nhận thanh toán thất bại"
          subTitle={errorMessage}
          extra={[
            <Button key="retry" type="primary" onClick={() => router.refresh()}>
              Thử lại
            </Button>,
            <Button key="home" onClick={() => router.push('/')}>
              Về trang chủ
            </Button>,
          ]}
        />
      );
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
          extra={[
            <Button key="courses" type="primary" onClick={() => router.push('/my-courses')}>
              Xem khóa học của tôi
            </Button>,
            <Button key="home" onClick={() => router.push('/')}>
              Quay lại trang chủ
            </Button>,
          ]}
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
                <strong>Trạng thái:</strong> {queryParams.status}
              </Text>
              <Text>
                <strong>Đã hủy:</strong> {queryParams.cancel}
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
