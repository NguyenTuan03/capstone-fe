'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { useRegisterCoach, useRegisterLearner } from '@/@crema/services/apis/auth/register';

const { TextArea } = Input;
const { Option } = Select;

enum UserRole {
  LEARNER = 'learner',
  COACH = 'coach',
}

enum CourseCredentialType {
  CERTIFICATE = 'certificate',
  LICENSE = 'license',
  AWARD = 'award',
  OTHER = 'other',
}

interface RegisterLearnerDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterCoachDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  specialties?: string[];
  teachingMethods?: string[];
  yearOfExperience: number;
  credentials?: Array<{
    name: string;
    description?: string;
    type: CourseCredentialType;
    publicUrl?: string;
  }>;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.LEARNER);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const learnerMutation = useRegisterLearner<any, RegisterLearnerDto>();
  const coachMutation = useRegisterCoach<any, RegisterCoachDto>();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    form.resetFields();
  };

  const onFinishLearner = async (values: RegisterLearnerDto) => {
    setLoading(true);
    try {
      await learnerMutation.mutateAsync(values);
      message.success('Đăng ký học viên thành công!');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch {
      // Global mutation error handler will show message
      message.error('Đăng ký học viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishCoach = async (values: RegisterCoachDto) => {
    setLoading(true);
    try {
      await coachMutation.mutateAsync(values);
      message.success('Đăng ký huấn luyện viên thành công!');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch {
      // Global mutation error handler will show message
      message.error('Đăng ký huấn luyện viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = [
    { required: true, message: 'Vui lòng nhập mật khẩu!' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="text-4xl font-bold text-gray-800">
                PICKLE
                <span className="text-yellow-500 font-black text-5xl">#</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">ĐĂNG KÝ TÀI KHOẢN</div>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleRoleChange(UserRole.LEARNER)}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  userRole === UserRole.LEARNER
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">🎓</div>
                <div>Học viên</div>
              </button>
              <button
                onClick={() => handleRoleChange(UserRole.COACH)}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  userRole === UserRole.COACH
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">👨‍🏫</div>
                <div>Huấn luyện viên</div>
              </button>
            </div>
          </div>

          {/* Learner Form */}
          {userRole === UserRole.LEARNER && (
            <Form form={form} layout="vertical" onFinish={onFinishLearner} className="space-y-4">
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Nhập họ và tên"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="email@example.com"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item name="password" label="Mật khẩu" rules={passwordRules}>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập lại mật khẩu"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item className="mb-0 mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Coach Form */}
          {userRole === UserRole.COACH && (
            <Form form={form} layout="vertical" onFinish={onFinishCoach} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Nhập họ và tên"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="email@example.com"
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="password" label="Mật khẩu" rules={passwordRules}>
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập lại mật khẩu"
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="bio"
                label="Giới thiệu bản thân"
                rules={[{ required: true, message: 'Vui lòng giới thiệu về bản thân!' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Chia sẻ kinh nghiệm, thành tích và phong cách huấn luyện của bạn..."
                  className="rounded-xl"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="yearOfExperience"
                  label="Số năm kinh nghiệm"
                  rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}
                >
                  <InputNumber
                    size="large"
                    min={0}
                    max={80}
                    placeholder="0"
                    className="w-full rounded-xl"
                  />
                </Form.Item>

                <Form.Item name="specialties" label="Chuyên môn">
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="Thêm chuyên môn"
                    className="rounded-xl"
                  >
                    <Option value="Backhand">Backhand</Option>
                    <Option value="Serve">Serve</Option>
                    <Option value="Volley">Volley</Option>
                    <Option value="Footwork">Footwork</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item name="teachingMethods" label="Phương pháp giảng dạy">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Thêm phương pháp"
                  className="rounded-xl"
                >
                  <Option value="Online">Online</Option>
                  <Option value="In-person">Trực tiếp</Option>
                  <Option value="Group">Nhóm</Option>
                  <Option value="One-on-one">1-1</Option>
                </Select>
              </Form.Item>

              {/* Credentials */}
              <div className="bg-gray-50 rounded-xl p-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Chứng chỉ & Bằng cấp</h3>
                <Form.List name="credentials">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div
                          key={field.key}
                          className="bg-white rounded-lg p-4 mb-4 border border-gray-200"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-gray-700">Chứng chỉ {index + 1}</span>
                            <MinusCircleOutlined
                              className="text-red-500 cursor-pointer"
                              onClick={() => remove(field.name)}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Form.Item
                              {...field}
                              name={[field.name, 'name']}
                              rules={[{ required: true, message: 'Nhập tên chứng chỉ!' }]}
                              className="mb-2"
                            >
                              <Input placeholder="Tên chứng chỉ" className="rounded-lg" />
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, 'type']}
                              rules={[{ required: true, message: 'Chọn loại!' }]}
                              className="mb-2"
                            >
                              <Select placeholder="Loại chứng chỉ" className="rounded-lg">
                                <Option value={CourseCredentialType.CERTIFICATE}>Chứng chỉ</Option>
                                <Option value={CourseCredentialType.LICENSE}>Giấy phép</Option>
                                <Option value={CourseCredentialType.AWARD}>Giải thưởng</Option>
                                <Option value={CourseCredentialType.OTHER}>Khác</Option>
                              </Select>
                            </Form.Item>
                          </div>

                          <Form.Item {...field} name={[field.name, 'description']} className="mb-2">
                            <TextArea
                              rows={2}
                              placeholder="Mô tả (tùy chọn)"
                              className="rounded-lg"
                            />
                          </Form.Item>

                          <Form.Item {...field} name={[field.name, 'publicUrl']} className="mb-0">
                            <Input
                              placeholder="URL file chứng chỉ (tùy chọn)"
                              className="rounded-lg"
                            />
                          </Form.Item>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        className="w-full rounded-lg"
                      >
                        Thêm chứng chỉ
                      </Button>
                    </>
                  )}
                </Form.List>
              </div>

              <Form.Item className="mb-0 mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 border-0 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Đăng ký làm Huấn luyện viên
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng nhập ngay
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-xs">
              © 2024 PICKLE-LEARN. Hệ thống quản lý Pickle Ball chuyên nghiệp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
