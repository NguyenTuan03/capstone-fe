'use client';
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Tabs,
  Table,
  Avatar,
  Progress,
  Badge,
  Descriptions,
  Statistic,
  Timeline,
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  DollarOutlined,
  BookOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const stats = [
    { title: 'Tổng khóa học', value: '7', icon: '📚', color: 'bg-blue-50 text-blue-600' },
    { title: 'Đang diễn ra', value: '4', icon: '⏰', color: 'bg-green-50 text-green-600' },
    { title: 'Đã hoàn thành', value: '3', icon: '✓', color: 'bg-gray-50 text-gray-600' },
    { title: 'Tổng học viên', value: '21', icon: '👥', color: 'bg-purple-50 text-purple-600' },
    { title: 'Doanh thu', value: '57.800.000đ', icon: '📈', color: 'bg-orange-50 text-orange-600' },
  ];

  const courses = [
    {
      id: 1,
      name: 'Pickleball cơ bản - Khóa 1',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Đã đủ',
      description:
        'Khóa học offline dành cho người mới bắt đầu, tập trung vào các kỹ thuật cơ bản và luật chơi',
      sessions: 4,
      schedule: 'Thứ 2, 4, 6 - 14:00-15:30',
      location: 'Sân Pickleball Quận 7',
      coach: 'Huấn luyện viên Nguyễn Văn A',
      currentStudents: 4,
      maxStudents: 4,
      progress: 100,
      sessionsCompleted: 8,
      fee: '500.000đ/người',
      feeDetail: '≈ 62.500đ/buổi',
      discount: '65%',
      startDate: '2025-01-15',
    },
    {
      id: 2,
      name: 'Kỹ thuật nâng cao - Khóa 1',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Đã đủ',
      description: 'Nâng cao kỹ năng serve và return, chiến thuật thi đấu chuyên nghiệp',
      sessions: 5,
      schedule: 'Thứ 3, 5, 7 - 16:00-17:30',
      location: 'Sân Pickleball Bình Thạnh',
      coach: 'Huấn luyện viên Trần Thị B',
      currentStudents: 2,
      maxStudents: 2,
      progress: 40,
      sessionsCompleted: 10,
      fee: '800.000đ/người',
      feeDetail: '≈ 80.000đ/buổi',
      discount: '40%',
      startDate: '2025-01-20',
    },
    {
      id: 3,
      name: 'Pickleball thiếu nhi - Khóa 2',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Còn chỗ',
      description: 'Khóa học vui nhộn cho trẻ em 8-14 tuổi, phát triển thể chất và kỹ năng',
      sessions: 6,
      schedule: 'Thứ 7, CN - 09:00-10:30',
      location: 'Sân Pickleball Quận 1',
      coach: 'Huấn luyện viên Lê Văn C',
      currentStudents: 6,
      maxStudents: 8,
      progress: 75,
      sessionsCompleted: 12,
      fee: '600.000đ/người',
      feeDetail: '≈ 50.000đ/buổi',
      discount: '25%',
      startDate: '2025-01-25',
    },
    {
      id: 4,
      name: 'Chiến thuật đôi - Khóa 3',
      level: 'Advanced',
      levelColor: 'bg-purple-100 text-purple-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Còn chỗ',
      description: 'Tập trung vào chiến thuật thi đấu đôi và phối hợp nhóm',
      sessions: 3,
      schedule: 'Thứ 2, 4 - 18:00-19:30',
      location: 'Sân Pickleball Quận 3',
      coach: 'Huấn luyện viên Phạm Thị D',
      currentStudents: 4,
      maxStudents: 6,
      progress: 67,
      sessionsCompleted: 6,
      fee: '900.000đ/người',
      feeDetail: '≈ 150.000đ/buổi',
      discount: '50%',
      startDate: '2025-02-01',
    },
    {
      id: 5,
      name: 'Pickleball cơ bản - Khóa 0',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBadge: '',
      description: 'Khóa học đầu tiên cho người mới bắt đầu',
      sessions: 8,
      schedule: 'Thứ 2, 4, 6 - 14:00-15:30',
      location: 'Sân Pickleball Quận 7',
      coach: 'Huấn luyện viên Nguyễn Văn A',
      currentStudents: 5,
      maxStudents: 5,
      progress: 100,
      sessionsCompleted: 8,
      fee: '450.000đ/người',
      feeDetail: '≈ 56.250đ/buổi',
      discount: '100%',
      startDate: '2024-12-01',
    },
    {
      id: 6,
      name: 'Kỹ thuật serve - Workshop',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBadge: '',
      description: 'Workshop chuyên sâu về kỹ thuật serve',
      sessions: 4,
      schedule: 'Thứ 7 - 15:00-17:00',
      location: 'Sân Pickleball Quận 2',
      coach: 'Huấn luyện viên Trần Thị B',
      currentStudents: 8,
      maxStudents: 8,
      progress: 100,
      sessionsCompleted: 4,
      fee: '300.000đ/người',
      feeDetail: '≈ 75.000đ/buổi',
      discount: '100%',
      startDate: '2024-11-15',
    },
    {
      id: 7,
      name: 'Pickleball nâng cao - Khóa 0',
      level: 'Advanced',
      levelColor: 'bg-purple-100 text-purple-800',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBadge: '',
      description: 'Khóa học nâng cao cho học viên có kinh nghiệm',
      sessions: 10,
      schedule: 'Thứ 3, 5, 7 - 17:00-18:30',
      location: 'Sân Pickleball Tân Bình',
      coach: 'Huấn luyện viên Lại Đức Hùng',
      currentStudents: 3,
      maxStudents: 4,
      progress: 100,
      sessionsCompleted: 10,
      fee: '1.000.000đ/người',
      feeDetail: '≈ 100.000đ/buổi',
      discount: '100%',
      startDate: '2024-10-01',
    },
  ];

  const priceOptions = [500000, 1000000, 1500000, 2000000, 2500000, 3000000, 5000000, 10000000];

  // Modal handlers
  const handleCreateCourse = () => {
    createForm
      .validateFields()
      .then((values) => {
        console.log('Creating course:', values);
        setIsCreateModalVisible(false);
        createForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleEditCourse = () => {
    editForm
      .validateFields()
      .then((values) => {
        console.log('Updating course:', { ...values, id: selectedCourse.id });
        setIsEditModalVisible(false);
        setSelectedCourse(null);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    setIsViewModalVisible(true);
  };

  const handleEditCourseClick = (course: any) => {
    setSelectedCourse(course);
    editForm.setFieldsValue({
      name: course.name,
      level: course.level.toLowerCase(),
      type: course.maxStudents === 1 ? 'individual' : 'group',
      totalSessions: course.sessions,
      sessionsPerWeek: 2,
      startDate: dayjs(course.startDate),
      description: course.description,
      price: parseInt(course.fee.replace(/[^\d]/g, '')),
      location: course.location,
      maxStudents: course.maxStudents,
      coach: course.coach,
    });
    setIsEditModalVisible(true);
  };

  const handleDeleteCourse = (courseId: number) => {
    console.log('Deleting course:', courseId);
    setIsEditModalVisible(false);
    setSelectedCourse(null);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'ongoing' && course.status === 'ongoing') ||
      (activeTab === 'completed' && course.status === 'completed');
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const CourseCard = ({ course }: { course: any }) => (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Button
          key="view"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewCourse(course)}
          size="small"
        >
          Xem
        </Button>,
        <Button
          key="edit"
          icon={<EditOutlined />}
          onClick={() => handleEditCourseClick(course)}
          size="small"
        >
          Sửa
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{course.name}</h3>
              <Tag color={course.status === 'ongoing' ? 'green' : 'default'}>
                {course.statusText}
              </Tag>
              {course.statusBadge && <Tag color="red">{course.statusBadge}</Tag>}
            </div>
            <Tag
              color={
                course.levelColor.includes('green')
                  ? 'green'
                  : course.levelColor.includes('blue')
                    ? 'blue'
                    : 'purple'
              }
            >
              {course.level}
            </Tag>
          </div>
        </div>

        <p style={{ color: '#666', marginBottom: 16 }}>{course.description}</p>

        <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined />
              <span style={{ fontSize: '14px' }}>{course.sessions} tuần</span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClockCircleOutlined />
              <span style={{ fontSize: '14px' }}>{course.schedule}</span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📍</span>
              <span style={{ fontSize: '14px' }}>{course.location}</span>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserOutlined />
              <span style={{ fontSize: '14px' }}>{course.coach}</span>
            </div>
          </Col>
        </Row>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '14px' }}>Sĩ số:</span>
            <span style={{ fontWeight: '600' }}>
              {course.currentStudents}/{course.maxStudents} học viên
            </span>
          </div>
          <Progress
            percent={(course.currentStudents / course.maxStudents) * 100}
            strokeColor="#ff4d4f"
            size="small"
          />
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginTop: 4 }}>
            {course.sessionsCompleted} buổi học
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 16,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>Học phí:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                {course.fee}
              </span>
              <Tag color="blue">{course.discount}</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>{course.feeDetail}</div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Title and Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 4 }}>
              Quản lý khóa học
            </h2>
            <p style={{ color: '#666' }}>Quản lý và theo dõi các khóa học</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              height: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            Tạo khóa học
          </Button>
        </div>

        {/* Stats Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {stats.map((stat, index) => (
            <Col span={4} key={index}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      marginBottom: 8,
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      backgroundColor: stat.color.includes('blue')
                        ? '#e6f7ff'
                        : stat.color.includes('green')
                          ? '#f6ffed'
                          : stat.color.includes('purple')
                            ? '#f9f0ff'
                            : stat.color.includes('orange')
                              ? '#fff7e6'
                              : '#f5f5f5',
                      color: stat.color.includes('blue')
                        ? '#1890ff'
                        : stat.color.includes('green')
                          ? '#52c41a'
                          : stat.color.includes('purple')
                            ? '#722ed1'
                            : stat.color.includes('orange')
                              ? '#fa8c16'
                              : '#666',
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: 4 }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{stat.value}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tabs */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
            <Button
              type={activeTab === 'all' ? 'primary' : 'text'}
              onClick={() => setActiveTab('all')}
              style={{
                borderBottom: activeTab === 'all' ? '2px solid #1890ff' : 'none',
                borderRadius: 0,
              }}
            >
              📚 Tất cả khóa học <Badge count={7} style={{ marginLeft: 8 }} />
            </Button>
            <Button
              type={activeTab === 'ongoing' ? 'primary' : 'text'}
              onClick={() => setActiveTab('ongoing')}
              style={{
                borderBottom: activeTab === 'ongoing' ? '2px solid #1890ff' : 'none',
                borderRadius: 0,
              }}
            >
              ⏰ Đang diễn ra <Badge count={4} style={{ marginLeft: 8 }} />
            </Button>
            <Button
              type={activeTab === 'completed' ? 'primary' : 'text'}
              onClick={() => setActiveTab('completed')}
              style={{
                borderBottom: activeTab === 'completed' ? '2px solid #1890ff' : 'none',
                borderRadius: 0,
              }}
            >
              ✓ Đã hoàn thành <Badge count={3} style={{ marginLeft: 8 }} />
            </Button>
          </div>

          {/* Search */}
          <div style={{ padding: '24px' }}>
            <Input.Search
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: 400 }}
              size="large"
            />
          </div>
        </Card>

        {/* Course List */}
        <Row gutter={16}>
          {filteredCourses.map((course) => (
            <Col span={12} key={course.id}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      </div>

      {/* Create Course Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOutlined style={{ color: '#1890ff' }} />
            <span>Tạo Khóa Học Mới</span>
          </div>
        }
        open={isCreateModalVisible}
        onOk={handleCreateCourse}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={1000}
        okText="Tạo khóa học"
        cancelText="Hủy"
        okButtonProps={{
          style: { backgroundColor: '#1890ff', borderColor: '#1890ff' },
        }}
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{
            level: 'intermediate',
            type: 'group',
            totalSessions: 8,
            sessionsPerWeek: 2,
            price: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                label="Tên khóa học"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
              >
                <Input placeholder="VD: Pickleball cơ bản cho người mới bắt đầu" size="large" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Trình độ" name="level">
                <Select size="large">
                  <Select.Option value="beginner">Cơ bản</Select.Option>
                  <Select.Option value="intermediate">Trung bình</Select.Option>
                  <Select.Option value="advanced">Nâng cao</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Card title="Loại hình khóa học" style={{ marginBottom: 16 }}>
            <Form.Item name="type">
              <Select size="large">
                <Select.Option value="individual">
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Cá nhân (1 người)</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Huấn luyện 1-1, hiệu quả cao nhất
                    </div>
                  </div>
                </Select.Option>
                <Select.Option value="group">
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Nhóm (2-6 người)</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Học theo nhóm, chi phí tiết kiệm
                    </div>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>
          </Card>

          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: '#52c41a' }} />
                <span>Lịch học và thời lượng</span>
              </div>
            }
            style={{ marginBottom: 16 }}
            styles={{ body: { backgroundColor: '#f6ffed' } }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Tổng số buổi học"
                  name="totalSessions"
                  rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} size="large" placeholder="8" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Số buổi mỗi tuần"
                  name="sessionsPerWeek"
                  rules={[{ required: true, message: 'Vui lòng chọn số buổi/tuần!' }]}
                >
                  <Select size="large">
                    <Select.Option value={1}>1 buổi/tuần</Select.Option>
                    <Select.Option value={2}>2 buổi/tuần</Select.Option>
                    <Select.Option value={3}>3 buổi/tuần</Select.Option>
                    <Select.Option value={4}>4 buổi/tuần</Select.Option>
                    <Select.Option value={5}>5 buổi/tuần</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="startDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                  <DatePicker style={{ width: '100%' }} size="large" placeholder="Chọn ngày" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item label="Mô tả khóa học" name="description">
            <Input.TextArea
              rows={4}
              placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học này..."
            />
          </Form.Item>

          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarOutlined style={{ color: '#1890ff' }} />
                <span>Giá khóa học</span>
              </div>
            }
            styles={{ body: { backgroundColor: '#f0f9ff' } }}
          >
            <Form.Item
              label="Giá khóa học"
              name="price"
              rules={[{ required: true, message: 'Vui lòng nhập giá khóa học!' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                size="large"
                placeholder="Nhập giá khóa học"
                addonAfter="VNĐ"
              />
            </Form.Item>

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
                💡 Chọn nhanh các mức giá phổ biến:
              </div>
              <Space wrap>
                {priceOptions.map((price) => (
                  <Tag.CheckableTag
                    key={price}
                    checked={createForm.getFieldValue('price') === price}
                    onChange={(checked) => {
                      if (checked) {
                        createForm.setFieldsValue({ price });
                      }
                    }}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d9d9d9',
                    }}
                  >
                    {price >= 1000000 ? `${price / 1000000} triệu` : `${price / 1000}k`}
                  </Tag.CheckableTag>
                ))}
              </Space>
            </div>
          </Card>
        </Form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EditOutlined style={{ color: '#1890ff' }} />
            <span>Chỉnh sửa khóa học</span>
          </div>
        }
        open={isEditModalVisible}
        onOk={handleEditCourse}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedCourse(null);
        }}
        width={1000}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        okButtonProps={{
          style: { backgroundColor: '#1890ff', borderColor: '#1890ff' },
        }}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                label="Tên khóa học"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
              >
                <Input placeholder="VD: Pickleball cơ bản cho người mới bắt đầu" size="large" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Trình độ" name="level">
                <Select size="large">
                  <Select.Option value="beginner">Cơ bản</Select.Option>
                  <Select.Option value="intermediate">Trung bình</Select.Option>
                  <Select.Option value="advanced">Nâng cao</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Địa điểm"
                name="location"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <Input size="large" placeholder="Sân Pickleball Quận 7" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Huấn luyện viên"
                name="coach"
                rules={[{ required: true, message: 'Vui lòng nhập tên huấn luyện viên!' }]}
              >
                <Input size="large" placeholder="Huấn luyện viên Nguyễn Văn A" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Số học viên tối đa"
                name="maxStudents"
                rules={[{ required: true, message: 'Vui lòng nhập số học viên!' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tổng số buổi học"
                name="totalSessions"
                rules={[{ required: true, message: 'Vui lòng nhập số buổi học!' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Giá khóa học"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá khóa học!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} size="large" addonAfter="VNĐ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả khóa học" name="description">
            <Input.TextArea
              rows={4}
              placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học này..."
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button
              danger
              onClick={() => handleDeleteCourse(selectedCourse?.id)}
              style={{ marginRight: 8 }}
            >
              Xóa khóa học
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Course Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EyeOutlined style={{ color: '#1890ff' }} />
            <span>Chi tiết khóa học</span>
          </div>
        }
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setSelectedCourse(null);
        }}
        width={1000}
        footer={[
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsViewModalVisible(false);
              handleEditCourseClick(selectedCourse);
            }}
          >
            Chỉnh sửa
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setIsViewModalVisible(false);
              setSelectedCourse(null);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        {selectedCourse && (
          <div>
            <Tabs
              defaultActiveKey="overview"
              items={[
                {
                  key: 'overview',
                  label: 'Tổng quan',
                  children: (
                    <div>
                      <Row gutter={24}>
                        <Col span={16}>
                          <Card title="Thông tin cơ bản">
                            <Descriptions column={2}>
                              <Descriptions.Item label="Tên khóa học" span={2}>
                                <strong>{selectedCourse.name}</strong>
                              </Descriptions.Item>
                              <Descriptions.Item label="Trình độ">
                                <Tag
                                  color={
                                    selectedCourse.levelColor.includes('green')
                                      ? 'green'
                                      : selectedCourse.levelColor.includes('blue')
                                        ? 'blue'
                                        : 'purple'
                                  }
                                >
                                  {selectedCourse.level}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Trạng thái">
                                <Tag
                                  color={selectedCourse.status === 'ongoing' ? 'green' : 'default'}
                                >
                                  {selectedCourse.statusText}
                                </Tag>
                              </Descriptions.Item>
                              <Descriptions.Item label="Địa điểm">
                                {selectedCourse.location}
                              </Descriptions.Item>
                              <Descriptions.Item label="Huấn luyện viên">
                                {selectedCourse.coach}
                              </Descriptions.Item>
                              <Descriptions.Item label="Lịch học">
                                {selectedCourse.schedule}
                              </Descriptions.Item>
                              <Descriptions.Item label="Mô tả" span={2}>
                                {selectedCourse.description}
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card title="Thống kê">
                            <Row gutter={16}>
                              <Col span={12}>
                                <Statistic
                                  title="Học viên"
                                  value={selectedCourse.currentStudents}
                                  suffix={`/${selectedCourse.maxStudents}`}
                                  prefix={<TeamOutlined />}
                                />
                              </Col>
                              <Col span={12}>
                                <Statistic
                                  title="Buổi học"
                                  value={selectedCourse.sessionsCompleted}
                                  suffix={`/${selectedCourse.sessions}`}
                                  prefix={<BookOutlined />}
                                />
                              </Col>
                            </Row>
                            <div style={{ marginTop: 16 }}>
                              <div style={{ marginBottom: 8 }}>Tiến độ khóa học</div>
                              <Progress
                                percent={selectedCourse.progress}
                                status={selectedCourse.progress === 100 ? 'success' : 'active'}
                              />
                            </div>
                            <div style={{ marginTop: 16 }}>
                              <Statistic
                                title="Học phí"
                                value={selectedCourse.fee}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                              />
                            </div>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: 'students',
                  label: 'Học viên',
                  children: (
                    <div>
                      <Table
                        columns={[
                          {
                            title: 'Học viên',
                            dataIndex: 'name',
                            key: 'name',
                            render: (text: string, record: any) => (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar>{text.charAt(0)}</Avatar>
                                <div>
                                  <div>{text}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {record.email}
                                  </div>
                                </div>
                              </div>
                            ),
                          },
                          {
                            title: 'Điểm danh',
                            dataIndex: 'attendance',
                            key: 'attendance',
                            render: (attendance: number) => (
                              <Progress percent={attendance} size="small" />
                            ),
                          },
                          {
                            title: 'Trạng thái',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status: string) => (
                              <Tag color={status === 'active' ? 'green' : 'default'}>
                                {status === 'active' ? 'Đang học' : 'Tạm nghỉ'}
                              </Tag>
                            ),
                          },
                        ]}
                        dataSource={[
                          {
                            key: 1,
                            name: 'Nguyễn Văn A',
                            email: 'nguyenvana@email.com',
                            attendance: 85,
                            status: 'active',
                          },
                          {
                            key: 2,
                            name: 'Trần Thị B',
                            email: 'tranthib@email.com',
                            attendance: 92,
                            status: 'active',
                          },
                          {
                            key: 3,
                            name: 'Lê Văn C',
                            email: 'levanc@email.com',
                            attendance: 78,
                            status: 'active',
                          },
                          {
                            key: 4,
                            name: 'Phạm Thị D',
                            email: 'phamthid@email.com',
                            attendance: 88,
                            status: 'active',
                          },
                        ]}
                        pagination={false}
                      />
                    </div>
                  ),
                },
                {
                  key: 'sessions',
                  label: 'Buổi học',
                  children: (
                    <div>
                      <Timeline
                        items={[
                          {
                            children: (
                              <div>
                                <div style={{ fontWeight: 'bold' }}>Buổi 1: Giới thiệu cơ bản</div>
                                <div style={{ color: '#666', fontSize: '12px' }}>
                                  Thứ 2, 14:00-15:30
                                </div>
                                <Tag color="green" icon={<CheckCircleOutlined />}>
                                  Hoàn thành
                                </Tag>
                              </div>
                            ),
                            color: 'green',
                          },
                          {
                            children: (
                              <div>
                                <div style={{ fontWeight: 'bold' }}>Buổi 2: Kỹ thuật serve</div>
                                <div style={{ color: '#666', fontSize: '12px' }}>
                                  Thứ 4, 14:00-15:30
                                </div>
                                <Tag color="green" icon={<CheckCircleOutlined />}>
                                  Hoàn thành
                                </Tag>
                              </div>
                            ),
                            color: 'green',
                          },
                          {
                            children: (
                              <div>
                                <div style={{ fontWeight: 'bold' }}>Buổi 3: Kỹ thuật forehand</div>
                                <div style={{ color: '#666', fontSize: '12px' }}>
                                  Thứ 6, 14:00-15:30
                                </div>
                                <Tag color="blue" icon={<PlayCircleOutlined />}>
                                  Đang diễn ra
                                </Tag>
                              </div>
                            ),
                            color: 'blue',
                          },
                          {
                            children: (
                              <div>
                                <div style={{ fontWeight: 'bold' }}>Buổi 4: Kỹ thuật backhand</div>
                                <div style={{ color: '#666', fontSize: '12px' }}>
                                  Thứ 2, 14:00-15:30
                                </div>
                                <Tag color="default" icon={<ClockCircleOutlined />}>
                                  Sắp tới
                                </Tag>
                              </div>
                            ),
                            color: 'gray',
                          },
                        ]}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseManagement;
