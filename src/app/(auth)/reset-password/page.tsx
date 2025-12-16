'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Form, Input, message, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import jwtAxios from '@/@crema/services/jwt-auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      message.error('Token không hợp lệ hoặc đã hết hạn');
      // Redirect to forgot password page after 2 seconds
      setTimeout(() => {
        router.push('/forgot-password');
      }, 2000);
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, router]);

  const handleResetPassword = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!token) {
      message.error('Token không hợp lệ');
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const response = await jwtAxios.post('/auth/reset-password', {
        token,
        newPassword: values.newPassword,
      });

      if (response.status === 200 || response.status === 201) {
        message.success('Đặt lại mật khẩu thành công!');
        setSuccess(true);
      } else {
        message.error(response.data?.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const backgroundImages = [
    '/assets/images/aleksander-saks-lqKXSNPb8D0-unsplash.jpg',
    '/assets/images/brendan-sapp-l5UX-BuRc3E-unsplash.jpg',
    '/assets/images/laura-tang-9AwSPN41C8U-unsplash.jpg',
    '/assets/images/pickleball.jpg',
    '/assets/images/premium_photo-1709048991290-1d36455a2895.avif',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  if (success) {
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

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Fog effect overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white/20 via-blue-50/10 to-transparent"></div>
          <div className="absolute bottom-32 left-0 w-full h-32 bg-gradient-to-t from-blue-100/15 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
            <Result
              icon={<CheckCircleOutlined className="text-green-500 text-6xl" />}
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
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-md mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
            <p className="text-gray-600 mb-4">Token không hợp lệ hoặc đã hết hạn</p>
            <p className="text-gray-500 text-sm mb-6">Đang chuyển hướng...</p>
            <Link href="/forgot-password">
              <Button type="primary">Quay lại trang quên mật khẩu</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Dark overlay */}
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
            <div className="text-sm text-gray-600 font-medium">ĐẶT LẠI MẬT KHẨU</div>
          </div>

          {/* Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <LockOutlined className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h2>
              <p className="text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleResetPassword}
              className="space-y-6"
            >
              <Form.Item
                name="newPassword"
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
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
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
                  disabled={!token}
                  className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </Button>
              </Form.Item>
            </Form>

            {/* Back to Login */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                <ArrowLeftOutlined className="mr-2" />
                <div>Quay lại trang đăng nhập</div>
              </Link>
            </div>
          </div>

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
