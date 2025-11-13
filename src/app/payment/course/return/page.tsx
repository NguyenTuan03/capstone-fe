'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/@crema/axios/ApiConfig';
import { buildUrl } from '@/@crema/helper/BuildUrl';
import { Result, Spin, Typography, Button, Card, Space } from 'antd';

type RequestState = 'idle' | 'loading' | 'success' | 'error';

interface PaymentReturnQueryParams {
  id: string;
  code: string;
  orderCode: string;
  status: string;
  cancel: string;
}

const { Text } = Typography;

const PaymentCourseReturnPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const queryParams = useMemo<PaymentReturnQueryParams | null>(() => {
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

    const notifyPaymentFailure = async () => {
      setRequestState('loading');
      setErrorMessage('');

      try {
        await axios.get(buildUrl('payments/course/return'), {
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
            : 'Không thể ghi nhận trạng thái thanh toán. Vui lòng thử lại sau.';

        setErrorMessage(message);
        setRequestState('error');
      }
    };

    notifyPaymentFailure();

    return () => {
      isMounted = false;
    };
  }, [queryParams]);

  const isCancelled = queryParams?.cancel === 'true';
  const isFailed = queryParams?.status?.toUpperCase() === 'FAILED';

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
          title="Không thể xử lý kết quả thanh toán"
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
          status="error"
          title={
            isCancelled
              ? 'Bạn đã hủy thanh toán'
              : isFailed
                ? 'Thanh toán thất bại'
                : 'Thanh toán chưa hoàn tất'
          }
          subTitle={
            isCancelled
              ? 'Giao dịch đã bị hủy bởi bạn. Nếu muốn tiếp tục, vui lòng thử thanh toán lại.'
              : 'Chúng tôi rất tiếc vì giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'
          }
          extra={[
            <Button
              key="retry-payment"
              type="primary"
              onClick={() => router.push('/payment/course')}
            >
              Thử thanh toán lại
            </Button>,
            <Button key="support" onClick={() => router.push('/contact')}>
              Liên hệ hỗ trợ
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
        background: 'linear-gradient(135deg, #fff1f0, #fff7e6)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 720 }}>{renderContent()}</div>
    </div>
  );
};

export default PaymentCourseReturnPage;
