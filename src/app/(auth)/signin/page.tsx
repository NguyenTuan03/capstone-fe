'use client';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { useAuthActions, useAuthUser } from '@/@crema/hooks/useAuth';
import { Button, Checkbox, Form, Input } from 'antd';
import Image from 'next/image';
import React from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { messages: t } = useIntl();
  const { signInUser } = useAuthActions();
  const { isAuthenticated } = useAuthUser();
  const router = useRouter();
  const [form] = Form.useForm();

  // Redirect về dashboard nếu đã đăng nhập
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSignIn = (values: { remember: boolean; password: string; email: string }) => {
    signInUser({ ...values, email: values.email.toLowerCase().trim() });
  };

  const onFinish = (values: { remember: boolean; password: string; email: string }) => {
    handleSignIn(values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };
  return (
    <div className="w-[80%] min-h-[600px] bg-white rounded-lg shadow-md">
      <div className="flex justify-between w-full h-[600px]">
        <div className="w-[60%] h-full">
          <Image
            src={'/assets/images/pickleball.jpg'}
            alt="Pickleball Court"
            width={500}
            height={600}
            className="object-cover rounded-lg shadow-lg w-full h-full"
            priority
            quality={95}
          />
        </div>
        <div className="w-[40%]">
          <div className="flex flex-col p-10">
            <div className="text-2xl font-bold text-center mb-3">
              <IntlMessages id="common.login" />
            </div>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ remember: true, password: '', email: '' }}
              onFinish={onFinish as unknown as (values: any) => void}
              onFinishFailed={onFinishFailed}
              className="flex flex-1 flex-col"
            >
              <Form.Item
                name="email"
                label={t['common.email'] as string}
                className="mb-5"
                rules={[
                  { required: true, message: t['common.email'] as string },
                  { type: 'email', message: t['error.validEmail'] as string },
                ]}
              >
                <Input
                  size="large"
                  placeholder={t['placeholder.common.email'] as string}
                  allowClear
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t['common.password'] as string}
                className="mb-5"
                rules={[
                  { required: true, message: t['common.password'] as string },
                  { min: 6, max: 32, message: t['common.passwordLength'] as string },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder={t['placeholder.common.password'] as string}
                  allowClear
                  autoComplete="current-password"
                />
              </Form.Item>

              <div className="flex items-center justify-between mt-auto mb-4">
                <Form.Item name="remember" valuePropName="checked" className="mb-0">
                  <Checkbox>
                    <IntlMessages id="common.rememberMe" />
                  </Checkbox>
                </Form.Item>
              </div>

              <div className="relative flex justify-center mb-4">
                <Button type="primary" htmlType="submit" size="large" className="px-6">
                  <IntlMessages id="common.login" />
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
