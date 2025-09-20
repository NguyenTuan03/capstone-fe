'use client';

import { Card, Col, Form, Input, Row, Button, Typography, message } from 'antd';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { user } = useJWTAuth();
  const [form] = Form.useForm();

  const profile = {
    name: (user as any)?.name || 'Admin User',
    email: (user as any)?.email || 'admin@example.com',
    phone: (user as any)?.phone || '0123456789',
  };

  const handleChangePassword = (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    // Chỉ mock UI: hiển thị thông báo thành công
    message.success('Đổi mật khẩu thành công (mock)');
    form.resetFields();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900"><IntlMessages id="settings.title" /></h1>
        <p className="mt-1 text-sm text-gray-600"><IntlMessages id="settings.subtitle" /></p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<IntlMessages id="settings.adminInfo.title" />}>
            <div className="space-y-4">
              <div>
                <Text type="secondary"><IntlMessages id="settings.adminInfo.name" /></Text>
                <div className="text-base font-medium text-gray-900">{profile.name}</div>
              </div>
              <div>
                <Text type="secondary"><IntlMessages id="settings.adminInfo.phone" /></Text>
                <div className="text-base font-medium text-gray-900">{profile.phone}</div>
              </div>
              <div>
                <Text type="secondary"><IntlMessages id="settings.adminInfo.email" /></Text>
                <div className="text-base font-medium text-gray-900">{profile.email}</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<IntlMessages id="settings.changePassword.title" />}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleChangePassword as unknown as (values: any) => void}
              requiredMark={false}
            >
              <Form.Item
                name="currentPassword"
                label={<IntlMessages id="settings.changePassword.current" />}
                rules={[{ required: true, message: <IntlMessages id="settings.changePassword.required.current" /> as unknown as string }]}
              >
                <Input.Password placeholder={String(<IntlMessages id="settings.changePassword.placeholder.current" />)} autoComplete="current-password" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label={<IntlMessages id="settings.changePassword.new" />}
                rules={[
                  { required: true, message: <IntlMessages id="settings.changePassword.required.new" /> as unknown as string },
                  { min: 6, message: <IntlMessages id="common.passwordLength" /> as unknown as string },
                ]}
              >
                <Input.Password placeholder={String(<IntlMessages id="settings.changePassword.placeholder.new" />)} autoComplete="new-password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<IntlMessages id="settings.changePassword.confirm" />}
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: <IntlMessages id="settings.changePassword.required.confirm" /> as unknown as string },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(String(<IntlMessages id="settings.changePassword.mismatch" />)));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder={String(<IntlMessages id="settings.changePassword.placeholder.confirm" />)} autoComplete="new-password" />
              </Form.Item>

              <div className="flex justify-end">
                <Button type="primary" htmlType="submit"><IntlMessages id="settings.changePassword.submit" /></Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
  