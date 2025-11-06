'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Select, InputNumber, DatePicker, App } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
  CalendarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useRegisterCoach, useRegisterLearner } from '@/@crema/services/apis/auth/register';
import { useApiQuery } from '@/@crema/hooks/useApiQuery';
import { CourseCredentialType, UserRole } from '@/@crema/types/models/register';
// import { RegisterLearnerDto } from '@/@crema/types/models/register';
import { RegisterCoachDto } from '@/@crema/types/models/register';

const { TextArea } = Input;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.LEARNER);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const learnerMutation = useRegisterLearner<any, any>();
  const coachMutation = useRegisterCoach<any, RegisterCoachDto>();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    form.resetFields();
  };

  const onFinishLearner = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phoneNumber: values.phoneNumber,
        dateOfBirth: values.dateOfBirth
          ? new Date((values.dateOfBirth as any).toISOString())
          : undefined,
        address: values.address,
        interests: values.interests,
        learner: {
          skillLevel: values.skillLevel,
          learningGoal: values.learningGoal,
          province: values.province,
          district: values.district,
        },
      };
      await learnerMutation.mutateAsync(payload);
      message.success('Đăng ký học viên thành công!, hãy kiểm tra email để xác thực tài khoản!');
      setTimeout(() => router.push('/signin'), 2000);
    } catch (err: any) {
      message.error(err?.message || 'Đăng ký học viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishCoach = async (values: RegisterCoachDto) => {
    setLoading(true);
    try {
      await coachMutation.mutateAsync(values);
      message.success('Đăng ký huấn luyện viên thành công!');
      setTimeout(() => router.push('/signin'), 2000);
    } catch (err: any) {
      message.error(err?.message || 'Đăng ký huấn luyện viên thất bại!');
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

  // Provinces & Districts for Learner registration
  const [selectedProvince, setSelectedProvince] = useState<number | undefined>(undefined);
  const { data: provincesRes, isLoading: loadingProvinces } = useApiQuery<any>({
    endpoint: 'provinces',
    params: { page: 1, size: 100 },
    staleTime: 5 * 60 * 1000,
  });
  const { data: districtsRes, isLoading: loadingDistricts } = useApiQuery<any>({
    endpoint: selectedProvince
      ? `provinces/${selectedProvince}/districts`
      : 'provinces/0/districts',
    enabled: !!selectedProvince,
    params: { page: 1, size: 1000 },
  });
  const provincesArray = Array.isArray(provincesRes)
    ? (provincesRes as any[])
    : (provincesRes?.items as any[]) || [];
  const districtsArray = Array.isArray(districtsRes)
    ? (districtsRes as any[])
    : (districtsRes?.items as any[]) || [];
  const provinceOptions = provincesArray.map((p) => ({ label: p.name, value: p.id }));
  const districtOptions = districtsArray.map((d) => ({ label: d.name, value: d.id }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="text-3xl md:text-4xl font-bold text-gray-800">
                PICKLE
                <span className="text-yellow-500 font-black text-4xl md:text-5xl">#</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">ĐĂNG KÝ TÀI KHOẢN</div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleRoleChange(UserRole.LEARNER)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  userRole === UserRole.LEARNER
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-xl mb-1">🎓</div>
                <div className="text-sm md:text-base">Học viên</div>
              </button>
              <button
                onClick={() => handleRoleChange(UserRole.COACH)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  userRole === UserRole.COACH
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-xl mb-1">👨‍🏫</div>
                <div className="text-sm md:text-base">Huấn luyện viên</div>
              </button>
            </div>
          </div>

          {/* Learner Form */}
          {userRole === UserRole.LEARNER && (
            <Form form={form} layout="vertical" onFinish={onFinishLearner}>
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

                <Form.Item name="phoneNumber" label="Số điện thoại">
                  <Input
                    size="large"
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="0912345678"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item name="dateOfBirth" label="Ngày sinh">
                  <DatePicker
                    size="large"
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    className="w-full rounded-xl"
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
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
              </div>

              <Form.Item name="address" label="Địa chỉ">
                <Input
                  size="large"
                  prefix={<HomeOutlined className="text-gray-400" />}
                  placeholder="Nhập địa chỉ của bạn"
                  className="rounded-xl"
                />
              </Form.Item>

              {/* Learner-specific fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="skillLevel"
                  label="Trình độ hiện tại"
                  rules={[{ required: true, message: 'Chọn trình độ' }]}
                >
                  <Select size="large" placeholder="Chọn trình độ" className="rounded-xl">
                    <Option value="BEGINNER">Cơ bản</Option>
                    <Option value="INTERMEDIATE">Trung bình</Option>
                    <Option value="ADVANCED">Nâng cao</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="learningGoal"
                  label="Mục tiêu học tập"
                  rules={[{ required: true, message: 'Chọn mục tiêu' }]}
                >
                  <Select size="large" placeholder="Chọn mục tiêu" className="rounded-xl">
                    <Option value="BEGINNER">Cơ bản</Option>
                    <Option value="INTERMEDIATE">Trung bình</Option>
                    <Option value="ADVANCED">Nâng cao</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="province"
                  label="Tỉnh/TP"
                  rules={[{ required: true, message: 'Chọn tỉnh/thành phố' }]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn tỉnh/thành phố"
                    options={provinceOptions}
                    loading={loadingProvinces}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    className="rounded-xl"
                    onChange={(val) => {
                      setSelectedProvince(val as number);
                      form.setFieldsValue({ district: undefined });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[{ required: true, message: 'Chọn quận/huyện' }]}
                >
                  <Select
                    size="large"
                    placeholder={selectedProvince ? 'Chọn quận/huyện' : 'Chọn tỉnh trước'}
                    options={districtOptions}
                    loading={loadingDistricts}
                    disabled={!selectedProvince}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>

              <Form.Item name="interests" label="Sở thích">
                <Select
                  mode="tags"
                  size="large"
                  placeholder="Thêm sở thích của bạn"
                  className="rounded-xl"
                >
                  <Option value="Pickleball">Pickleball</Option>
                  <Option value="Tennis">Tennis</Option>
                  <Option value="Badminton">Badminton</Option>
                  <Option value="Fitness">Fitness</Option>
                </Select>
              </Form.Item>

              <Form.Item className="mb-0 mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 border-0 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Coach Form */}
          {userRole === UserRole.COACH && (
            <Form form={form} layout="vertical" onFinish={onFinishCoach}>
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

              <Form.Item
                name="bio"
                label="Giới thiệu bản thân"
                rules={[{ required: true, message: 'Vui lòng giới thiệu về bản thân!' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Chia sẻ kinh nghiệm, thành tích và phong cách huấn luyện..."
                  className="rounded-xl"
                />
              </Form.Item>

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

              {/* Credentials - Compact Version */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Chứng chỉ & Bằng cấp</h3>
                <Form.List name="credentials">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <div key={field.key} className="bg-white rounded-lg p-3 mb-3 border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                            <MinusCircleOutlined
                              className="text-red-500 cursor-pointer hover:text-red-600"
                              onClick={() => remove(field.name)}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Form.Item
                              {...field}
                              name={[field.name, 'name']}
                              rules={[{ required: true, message: 'Nhập tên!' }]}
                              className="mb-2"
                            >
                              <Input placeholder="Tên chứng chỉ" size="middle" />
                            </Form.Item>

                            <Form.Item
                              {...field}
                              name={[field.name, 'type']}
                              rules={[{ required: true, message: 'Chọn loại!' }]}
                              className="mb-2"
                            >
                              <Select placeholder="Loại" size="middle">
                                <Option value={CourseCredentialType.CERTIFICATE}>Chứng chỉ</Option>
                                <Option value={CourseCredentialType.LICENSE}>Giấy phép</Option>
                                <Option value={CourseCredentialType.AWARD}>Giải thưởng</Option>
                                <Option value={CourseCredentialType.OTHER}>Khác</Option>
                              </Select>
                            </Form.Item>
                          </div>

                          <Form.Item {...field} name={[field.name, 'description']} className="mb-2">
                            <TextArea rows={2} placeholder="Mô tả (tùy chọn)" size="middle" />
                          </Form.Item>

                          <Form.Item {...field} name={[field.name, 'publicUrl']} className="mb-0">
                            <Input placeholder="URL (tùy chọn)" size="middle" />
                          </Form.Item>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        className="w-full"
                        size="middle"
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
                  className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 border-0 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Đăng ký làm Huấn luyện viên
                </Button>
              </Form.Item>
            </Form>
          )}

          {/* Footer - Compact */}
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
