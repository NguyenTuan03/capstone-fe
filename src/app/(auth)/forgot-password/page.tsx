'use client';
import { Button, Form, Input, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import jwtAxios from '@/@crema/services/jwt-auth';

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');

  const handleRequestReset = async (values: { email: string }) => {
    setLoading(true);
    setEmail(values.email);

    try {
      const response = await jwtAxios.post('/auth/request-reset-password', {
        email: values.email,
      });

      if (response.status === 200 || response.status === 201) {
        message.success('Email đã được gửi, vui lòng kiểm tra hộp thư');
        setCurrentStep(1);
      } else {
        message.error(response.data?.message || 'Không thể gửi email đặt lại mật khẩu');
      }
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
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
                <div>Quên mật khẩu</div>
              </h2>
              <p className="text-gray-600">
                <div>Nhập email đăng nhập để nhận liên kết đặt lại mật khẩu</div>
              </p>
            </div>

            <Form form={form} layout="vertical" onFinish={handleRequestReset} className="space-y-6">
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
          <div className="w-full max-w-md mx-auto text-center">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <MailOutlined className="text-2xl text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Kiểm tra email</h2>
              <p className="text-gray-600 mb-4">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email:
              </p>
              <p className="text-blue-600 font-medium text-lg">{email}</p>
              <p className="text-gray-500 text-sm mt-4">
                Vui lòng kiểm tra hộp thư và click vào liên kết để đặt lại mật khẩu.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Nếu không thấy email, vui lòng kiểm tra thư mục spam.
              </p>
            </div>

            <div className="mt-6">
              <Button
                type="link"
                onClick={() => {
                  setCurrentStep(0);
                  form.resetFields();
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Gửi lại email
              </Button>
            </div>
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
              {[0, 1].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step + 1}
                  </div>
                  {step < 1 && (
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
          {currentStep < 1 && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
              >
                <ArrowLeftOutlined className="mr-2" />
                <div>Quay lại</div>
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
