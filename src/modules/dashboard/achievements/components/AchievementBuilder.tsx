'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Alert,
  Divider,
  InputNumber,
  Switch,
  message,
  Tabs,
  Modal,
  List,
  Tag,
} from 'antd';

import {
  PlusOutlined,
  SaveOutlined,
  EyeOutlined,
  StarOutlined,
  TrophyOutlined,
  GiftOutlined,
  SettingOutlined,
  BulbOutlined,
} from '@ant-design/icons';

import AchievementApiService from '@/services/achievementApi';
import {
  CreateAchievementRequest,
  AchievementTemplate,
  AchievementCategory,
  AchievementRarity,
  CriteriaType,
  AchievementCriteria,
  AchievementRewards,
} from '@/types/achievement';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface AchievementBuilderProps {
  onStatsUpdate: () => void;
}

const AchievementBuilder: React.FC<AchievementBuilderProps> = ({ onStatsUpdate }) => {
  // Forms
  const [basicForm] = Form.useForm();
  const [criteriaForm] = Form.useForm();
  const [rewardsForm] = Form.useForm();

  // States
  const [currentStep, setCurrentStep] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [templates, setTemplates] = useState<AchievementTemplate[]>([]);
  const [templatesVisible, setTemplatesVisible] = useState(false);

  // Form data
  const [basicData, setBasicData] = useState<any>({});
  const [criteriaData, setCriteriaData] = useState<any>({});
  const [rewardsData, setRewardsData] = useState<any>({});

  // Load templates
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templatesData = await AchievementApiService.getAchievementTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  // Category options
  const categoryOptions = [
    { value: 'learning', label: 'Học tập', description: 'Hoàn thành bài học, quiz', icon: '📚' },
    { value: 'skill', label: 'Kỹ năng', description: 'Thành thạo kỹ thuật', icon: '🎾' },
    { value: 'time', label: 'Thời gian', description: 'Dựa trên thời gian học', icon: '⏰' },
    { value: 'social', label: 'Xã hội', description: 'Tương tác cộng đồng', icon: '👥' },
    { value: 'milestone', label: 'Cột mốc', description: 'Thành tựu quan trọng', icon: '🏁' },
    { value: 'special', label: 'Đặc biệt', description: 'Sự kiện đặc biệt', icon: '✨' },
  ];

  // Rarity options
  const rarityOptions = [
    {
      value: 'common',
      label: 'Thường',
      description: '70%+ users có thể đạt',
      color: '#8c8c8c',
      points: 50,
    },
    {
      value: 'rare',
      label: 'Hiếm',
      description: '30-70% users có thể đạt',
      color: '#1890ff',
      points: 200,
    },
    {
      value: 'epic',
      label: 'Sử thi',
      description: '10-30% users có thể đạt',
      color: '#722ed1',
      points: 500,
    },
    {
      value: 'legendary',
      label: 'Huyền thoại',
      description: '<10% users có thể đạt',
      color: '#faad14',
      points: 1000,
    },
  ];

  // Criteria type options
  const criteriaTypeOptions = [
    { value: 'lesson_count', label: 'Số bài học', description: 'Hoàn thành X bài học' },
    { value: 'quiz_score', label: 'Điểm quiz', description: 'Đạt điểm X trong quiz' },
    { value: 'streak_days', label: 'Chuỗi ngày', description: 'Học X ngày liên tiếp' },
    { value: 'session_count', label: 'Số session', description: 'Tham gia X sessions' },
    { value: 'chapter_complete', label: 'Hoàn thành chương', description: 'Hoàn thành X chương' },
    { value: 'perfect_score', label: 'Điểm tuyệt đối', description: 'Đạt 100% trong X quiz' },
    { value: 'time_spent', label: 'Thời gian học', description: 'Học tổng cộng X giờ' },
    { value: 'social_interaction', label: 'Tương tác xã hội', description: 'Tương tác X lần' },
  ];

  // Icon options
  const iconOptions = [
    '🎯',
    '🏆',
    '🥇',
    '🎖️',
    '⭐',
    '🌟',
    '💫',
    '✨',
    '📚',
    '📖',
    '🎓',
    '🧠',
    '💡',
    '🔥',
    '⚡',
    '🚀',
    '🎾',
    '🏸',
    '⚽',
    '🏀',
    '🎱',
    '🎪',
    '🎨',
    '🎭',
    '👑',
    '💎',
    '🔱',
    '⚔️',
    '🛡️',
    '🏅',
    '🎊',
    '🎉',
  ];

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate all forms
      const basicValues = await basicForm.validateFields();
      const criteriaValues = await criteriaForm.validateFields();
      const rewardsValues = await rewardsForm.validateFields();

      // Create achievement request
      const request: CreateAchievementRequest = {
        name: basicValues.name,
        description: basicValues.description,
        icon: basicValues.icon,
        category: basicValues.category as AchievementCategory,
        rarity: basicValues.rarity as AchievementRarity,
        criteria: {
          type: criteriaValues.type as CriteriaType,
          target: criteriaValues.target,
          condition: criteriaValues.condition,
          timeframe: criteriaValues.timeframe,
        } as AchievementCriteria,
        rewards: {
          points: rewardsValues.points,
          badge: rewardsValues.badge,
          title: rewardsValues.title,
          description: rewardsValues.description,
          specialPerks: rewardsValues.specialPerks?.split('\n').filter(Boolean) || [],
        } as AchievementRewards,
        status: basicValues.status || 'active',
      };

      const response = await AchievementApiService.createAchievement(request);
      if (response.success) {
        message.success(response.message);
        handleReset();
        onStatsUpdate();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    basicForm.resetFields();
    criteriaForm.resetFields();
    rewardsForm.resetFields();
    setBasicData({});
    setCriteriaData({});
    setRewardsData({});
    setCurrentStep('basic');
  };

  // Handle template selection
  const handleTemplateSelect = (template: AchievementTemplate) => {
    // Fill basic form
    basicForm.setFieldsValue({
      name: template.name,
      description: template.description,
      category: template.category,
      icon: '🎯', // Default icon
    });

    // Fill criteria form
    criteriaForm.setFieldsValue({
      type: template.criteria.type,
      target: template.criteria.target,
      condition: template.criteria.condition,
    });

    // Fill rewards form
    rewardsForm.setFieldsValue({
      points: template.rewards.points,
      badge: template.rewards.badge,
      description: template.rewards.description,
    });

    setTemplatesVisible(false);
    message.success('Đã áp dụng template thành công');
  };

  // Auto-suggest points based on rarity
  const handleRarityChange = (rarity: AchievementRarity) => {
    const rarityConfig = rarityOptions.find((r) => r.value === rarity);
    if (rarityConfig) {
      rewardsForm.setFieldsValue({ points: rarityConfig.points });
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Tạo Achievement Mới
          </Title>
          <Text type="secondary">Thiết kế achievement để tăng động lực học tập</Text>
        </div>
        <Space>
          <Button icon={<BulbOutlined />} onClick={() => setTemplatesVisible(true)}>
            Templates
          </Button>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>
            Xem trước
          </Button>
          <Button onClick={handleReset}>Đặt lại</Button>
        </Space>
      </div>

      <Row gutter={24}>
        {/* Form Section */}
        <Col xs={24} lg={16}>
          <Card>
            <Tabs activeKey={currentStep} onChange={setCurrentStep} type="card">
              {/* Basic Information */}
              <TabPane
                tab={
                  <span>
                    <SettingOutlined />
                    Thông tin cơ bản
                  </span>
                }
                key="basic"
              >
                <Form
                  form={basicForm}
                  layout="vertical"
                  onValuesChange={(_, values) => setBasicData(values)}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Tên Achievement"
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên achievement' },
                          { max: 50, message: 'Tên không được quá 50 ký tự' },
                        ]}
                      >
                        <Input placeholder="VD: Bước đầu tiên" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="icon"
                        label="Icon"
                        rules={[{ required: true, message: 'Vui lòng chọn icon' }]}
                      >
                        <Select placeholder="Chọn icon">
                          {iconOptions.map((icon) => (
                            <Option key={icon} value={icon}>
                              <span style={{ fontSize: '16px', marginRight: '8px' }}>{icon}</span>
                              {icon}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mô tả' },
                      { max: 200, message: 'Mô tả không được quá 200 ký tự' },
                    ]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Mô tả chi tiết về achievement này..."
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="category"
                        label="Danh mục"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                      >
                        <Select placeholder="Chọn danh mục">
                          {categoryOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '16px', marginRight: '8px' }}>
                                  {option.icon}
                                </span>
                                <div>
                                  <div>{option.label}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="rarity"
                        label="Độ hiếm"
                        rules={[{ required: true, message: 'Vui lòng chọn độ hiếm' }]}
                      >
                        <Select placeholder="Chọn độ hiếm" onChange={handleRarityChange}>
                          {rarityOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: option.color,
                                    marginRight: '8px',
                                  }}
                                />
                                <div>
                                  <div>{option.label}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="status" label="Trạng thái" initialValue="active">
                    <Select>
                      <Option value="active">Hoạt động</Option>
                      <Option value="inactive">Không hoạt động</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </TabPane>

              {/* Criteria */}
              <TabPane
                tab={
                  <span>
                    <TrophyOutlined />
                    Điều kiện
                  </span>
                }
                key="criteria"
              >
                <Form
                  form={criteriaForm}
                  layout="vertical"
                  onValuesChange={(_, values) => setCriteriaData(values)}
                >
                  <Form.Item
                    name="type"
                    label="Loại điều kiện"
                    rules={[{ required: true, message: 'Vui lòng chọn loại điều kiện' }]}
                  >
                    <Select placeholder="Chọn loại điều kiện">
                      {criteriaTypeOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {option.description}
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="target"
                        label="Mục tiêu"
                        rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
                      >
                        <InputNumber
                          min={1}
                          max={10000}
                          placeholder="VD: 10"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="timeframe"
                        label="Khung thời gian (ngày)"
                        tooltip="Để trống nếu không giới hạn thời gian"
                      >
                        <InputNumber
                          min={1}
                          max={365}
                          placeholder="VD: 30"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="condition"
                    label="Điều kiện bổ sung"
                    tooltip="Điều kiện chi tiết (tùy chọn)"
                  >
                    <Input placeholder="VD: complete_first_lesson" />
                  </Form.Item>

                  <Alert
                    message="Gợi ý thiết kế"
                    description="Hãy thiết kế điều kiện vừa thử thách nhưng vẫn khả thi. Achievement quá dễ sẽ mất giá trị, quá khó sẽ làm người dùng nản lòng."
                    type="info"
                    showIcon
                  />
                </Form>
              </TabPane>

              {/* Rewards */}
              <TabPane
                tab={
                  <span>
                    <GiftOutlined />
                    Phần thưởng
                  </span>
                }
                key="rewards"
              >
                <Form
                  form={rewardsForm}
                  layout="vertical"
                  onValuesChange={(_, values) => setRewardsData(values)}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="points"
                        label="Điểm thưởng"
                        rules={[{ required: true, message: 'Vui lòng nhập điểm thưởng' }]}
                      >
                        <InputNumber
                          min={1}
                          max={10000}
                          placeholder="VD: 100"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="badge"
                        label="Badge ID"
                        rules={[{ required: true, message: 'Vui lòng nhập badge ID' }]}
                      >
                        <Input placeholder="VD: first-step-badge" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="title"
                    label="Danh hiệu"
                    rules={[{ max: 30, message: 'Danh hiệu không được quá 30 ký tự' }]}
                  >
                    <Input placeholder="VD: Người học mới" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Mô tả phần thưởng"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mô tả phần thưởng' },
                      { max: 150, message: 'Mô tả không được quá 150 ký tự' },
                    ]}
                  >
                    <TextArea
                      rows={2}
                      placeholder="Mô tả về phần thưởng này..."
                      showCount
                      maxLength={150}
                    />
                  </Form.Item>

                  <Form.Item
                    name="specialPerks"
                    label="Đặc quyền đặc biệt"
                    tooltip="Mỗi đặc quyền trên một dòng"
                  >
                    <TextArea
                      rows={4}
                      placeholder={`Unlock profile badge\nPriority booking\nSpecial discount`}
                    />
                  </Form.Item>

                  <Alert
                    message="Lưu ý về phần thưởng"
                    description="Phần thưởng nên tương xứng với độ khó của achievement. Đặc quyền đặc biệt sẽ tăng giá trị và sức hấp dẫn."
                    type="warning"
                    showIcon
                  />
                </Form>
              </TabPane>
            </Tabs>

            {/* Action Buttons */}
            <Divider />
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleReset}>Đặt lại</Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Tạo Achievement
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Preview Section */}
        <Col xs={24} lg={8}>
          <Card title="Xem trước" style={{ position: 'sticky', top: '24px' }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {/* Icon */}
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{basicData.icon || '🎯'}</div>

              {/* Name */}
              <Title level={4} style={{ margin: '0 0 8px 0' }}>
                {basicData.name || 'Tên Achievement'}
              </Title>

              {/* Badges */}
              <div style={{ marginBottom: '12px' }}>
                {basicData.category && (
                  <Tag color={AchievementApiService.getCategoryColor(basicData.category)}>
                    {categoryOptions.find((c) => c.value === basicData.category)?.label}
                  </Tag>
                )}
                {basicData.rarity && (
                  <Tag color={AchievementApiService.getRarityColor(basicData.rarity)}>
                    {rarityOptions.find((r) => r.value === basicData.rarity)?.label}
                  </Tag>
                )}
              </div>

              {/* Description */}
              <Text style={{ display: 'block', marginBottom: '16px', color: '#666' }}>
                {basicData.description || 'Mô tả achievement sẽ hiển thị ở đây'}
              </Text>

              {/* Criteria */}
              {criteriaData.type && (
                <Card size="small" style={{ marginBottom: '12px', textAlign: 'left' }}>
                  <Text strong>Điều kiện:</Text>
                  <br />
                  <Text>
                    {criteriaTypeOptions.find((c) => c.value === criteriaData.type)?.label}:{' '}
                    {criteriaData.target || 0}
                  </Text>
                </Card>
              )}

              {/* Rewards */}
              {rewardsData.points && (
                <Card size="small" style={{ textAlign: 'left' }}>
                  <Text strong>Phần thưởng:</Text>
                  <br />
                  <Text>🏆 {rewardsData.points} điểm</Text>
                  {rewardsData.title && (
                    <>
                      <br />
                      <Text>👑 {rewardsData.title}</Text>
                    </>
                  )}
                </Card>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Templates Modal */}
      <Modal
        title="Chọn Template"
        open={templatesVisible}
        onCancel={() => setTemplatesVisible(false)}
        footer={null}
        width={800}
      >
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          dataSource={templates}
          renderItem={(template) => (
            <List.Item>
              <Card
                hoverable
                size="small"
                onClick={() => handleTemplateSelect(template)}
                extra={template.isPopular && <Tag color="gold">Phổ biến</Tag>}
              >
                <Card.Meta
                  title={template.name}
                  description={
                    <div>
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        {template.description}
                      </Text>
                      <div style={{ marginTop: '8px' }}>
                        <Tag color={AchievementApiService.getCategoryColor(template.category)}>
                          {categoryOptions.find((c) => c.value === template.category)?.label}
                        </Tag>
                        <Tag color="gold">{template.rewards.points} pts</Tag>
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default AchievementBuilder;
