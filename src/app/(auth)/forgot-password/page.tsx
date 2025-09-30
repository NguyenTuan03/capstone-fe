'use client';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { Button, Form, Input, Card, Result, Steps, message } from 'antd';
import {
  MailOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthApiService } from '@/services/authApi';

const { Step } = Steps;

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const router = useRouter();

  const handleSendEmail = async (values: { email: string }) => {
    setLoading(true);
    setEmail(values.email);

    try {
      const response = await AuthApiService.forgotPassword({ email: values.email });

      if (response.success) {
        message.success(response.message);
        setCurrentStep(1);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (values: { code: string }) => {
    setLoading(true);

    try {
      const response = await AuthApiService.verifyResetCode({
        email,
        code: values.code,
      });

      if (response.success && response.data?.verificationToken) {
        setVerificationToken(response.data.verificationToken);
        message.success(response.message);
        setCurrentStep(2);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    setLoading(true);

    try {
      const response = await AuthApiService.resetPassword({
        verificationToken,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        message.success(response.message);
        setCurrentStep(3);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <MailOutlined className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                <IntlMessages id="forgotPassword.step1.title" />
              </h2>
              <p className="text-gray-600">
                <IntlMessages id="forgotPassword.step1.subtitle" />
              </p>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSendEmail} className="space-y-6">
              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium">Email đăng nhập</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="admin@pickle-learn.com"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Gửi liên kết đặt lại
                </Button>
              </Form.Item>
            </Form>
          </div>
        );

      case 1:
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <MailOutlined className="text-2xl text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Kiểm tra email</h2>
              <p className="text-gray-600 mb-4">Chúng tôi đã gửi mã xác minh đến email:</p>
              <p className="text-blue-600 font-medium">{email}</p>
            </div>

            <Form layout="vertical" onFinish={handleVerifyCode} className="space-y-6">
              <Form.Item
                name="code"
                label={<span className="text-gray-700 font-medium">Mã xác minh (6 chữ số)</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mã xác minh!' },
                  { len: 6, message: 'Mã xác minh phải có 6 chữ số!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="123456"
                  maxLength={6}
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 text-center text-xl tracking-widest"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Xác minh mã
                </Button>
              </Form.Item>

              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">Không nhận được mã?</p>
                <Button type="link" className="text-blue-600 hover:text-blue-700 p-0">
                  Gửi lại mã xác minh
                </Button>
              </div>
            </Form>
          </div>
        );

      case 2:
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <LockOutlined className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h2>
              <p className="text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
            </div>

            <Form layout="vertical" onFinish={handleResetPassword} className="space-y-6">
              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium">Mật khẩu mới</span>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu mới"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="text-gray-700 font-medium">Xác nhận mật khẩu</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập lại mật khẩu mới"
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Cập nhật mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </div>
        );

      case 3:
        return (
          <div className="w-full max-w-md mx-auto text-center">
            <Result
              icon={<CheckCircleOutlined className="text-green-500" />}
              title={
                <span className="text-2xl font-bold text-gray-800">
                  Đặt lại mật khẩu thành công!
                </span>
              }
              subTitle={
                <p className="text-gray-600 mb-8">
                  Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
                </p>
              }
              extra={
                <Link href="/signin">
                  <Button
                    type="primary"
                    size="large"
                    className="h-12 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Về trang đăng nhập
                  </Button>
                </Link>
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  const backgroundImages = [
    '/assets/images/aleksander-saks-lqKXSNPb8D0-unsplash.jpg',
    '/assets/images/brendan-sapp-l5UX-BuRc3E-unsplash.jpg',
    '/assets/images/laura-tang-9AwSPN41C8U-unsplash.jpg',
    '/assets/images/pickleball.jpg',
    '/assets/images/premium_photo-1709048991290-1d36455a2895.avif',
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000); // Chuyển ảnh mỗi 5 giây

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'opacity 1000ms ease-in-out, transform 10000ms ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Fog effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white/20 via-blue-50/10 to-transparent"></div>
        <div className="absolute bottom-32 left-0 w-full h-32 bg-gradient-to-t from-blue-100/15 to-transparent"></div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white/90 scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Chuyển đến ảnh ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="text-4xl font-bold text-gray-800">
                PICKLE
                <span className="text-yellow-500 font-black text-5xl">#</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">KHÔI PHỤC MẬT KHẨU</div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[0, 1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step + 1}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-1 mx-1 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          {renderStepContent()}

          {/* Back to Login */}
          {currentStep < 3 && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                <ArrowLeftOutlined className="mr-2" />
                <IntlMessages id="forgotPassword.backToLogin" />
              </Link>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              © 2024 PICKLE-LEARN. Hệ thống quản lý Pickle Ball chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
