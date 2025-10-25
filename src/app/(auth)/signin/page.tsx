'use client';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { useAuthActions, useAuthUser } from '@/@crema/hooks/useAuth';
import { Button, Checkbox, Form, Input, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { messages: t } = useIntl();
  const { signInUser } = useAuthActions();
  const { isAuthenticated } = useAuthUser();
  const router = useRouter();
  const [form] = Form.useForm();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/dashboard');
  //   }
  // }, [isAuthenticated, router]); // DISABLED FOR UI DEVELOPMENT

  const handleSignIn = (values: { remember: boolean; password: string; email: string }) => {
    console.log('🔥 handleSignIn called with:', values);

    // Simple fake login check
    const email = values.email.toLowerCase().trim();
    const password = values.password;

    if (email === 'admin' && password === 'admin1') {
      // Admin login - redirect to dashboard
      message.success('Đăng nhập thành công! Chào mừng Admin!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else if (email === 'coach' && password === 'coach') {
      // Coach login - redirect to coach dashboard (using dashboard for now)
      message.success('Đăng nhập thành công! Chào mừng Coach!');
      setTimeout(() => {
        router.push('/summary');
      }, 1000);
    } else if (email === 'learner' && password === 'learner') {
      // Learner login - redirect to learner dashboard
      message.success('Đăng nhập thành công! Chào mừng Learner!');
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } else {
      // Wrong credentials - show error
      message.error('Sai tài khoản hoặc mật khẩu!');
    }
  };

  const onFinish = (values: { remember: boolean; password: string; email: string }) => {
    console.log('🎯 Form submitted with values:', values);
    handleSignIn(values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.error('❌ Form validation failed:', errorInfo);
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

      {/* Login Card */}
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
            <div className="text-sm text-gray-600 font-medium">CỔNG QUẢN TRỊ</div>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{ remember: true, password: '', email: '' }}
            onFinish={onFinish as unknown as (values: any) => void}
            onFinishFailed={onFinishFailed}
            className="space-y-6"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="admin"
                className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 bg-gray-50/50"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="admin1"
                className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 bg-gray-50/50"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="mb-4">
              <Checkbox className="text-gray-600">Nhớ tôi</Checkbox>
            </Form.Item>

            <Form.Item className="mb-6">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full h-12 rounded-xl bg-gray-800 hover:bg-gray-900 border-0 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          {/* Forgot Password */}
          <div className="flex justify-end text-sm mb-6">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-xs">
              © 2024 PICKLE-LEARN. Hệ thống quản lý Pickle Ball chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
