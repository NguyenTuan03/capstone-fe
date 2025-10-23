'use client';
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Radio,
  Upload,
  DatePicker,
  message,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const ContentLibrary = () => {
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);

  // Forms
  const [quizForm] = Form.useForm();
  const [videoForm] = Form.useForm();
  const [exerciseForm] = Form.useForm();

  const quizzes = [
    {
      id: 1,
      title: 'Quiz: Kỹ thuật serve cơ bản',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      questions: 10,
      used: 3,
      createdDate: '2025-01-01',
    },
    {
      id: 2,
      title: 'Quiz: Return nâng cao',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800',
      questions: 8,
      used: 1,
      createdDate: '2025-01-05',
    },
    {
      id: 3,
      title: 'Quiz: Chiến thuật cơ bản',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      questions: 5,
      used: 2,
      createdDate: '2025-01-10',
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'Video: Serve technique',
      tag: 'Technique',
      tagColor: 'bg-orange-100 text-orange-800',
      duration: '5:30',
      used: 4,
      createdDate: '2025-01-02',
    },
    {
      id: 2,
      title: 'Video: Return practice',
      tag: 'Practice',
      tagColor: 'bg-orange-100 text-orange-800',
      duration: '8:15',
      used: 2,
      createdDate: '2025-01-06',
    },
  ];

  const exercises = [
    {
      id: 1,
      title: 'Luyện serve 100 quả',
      type: 'practice',
      typeText: 'practice',
      typeColor: 'bg-green-100 text-green-800',
      level: 'Beginner',
      used: 5,
      createdDate: '2025-01-03',
    },
    {
      id: 2,
      title: 'Video thực hành return',
      type: 'video',
      typeText: 'video',
      typeColor: 'bg-green-100 text-green-800',
      level: 'Intermediate',
      used: 1,
      createdDate: '2025-01-07',
    },
  ];

  // Modal handlers
  const handleCreateQuiz = () => {
    quizForm
      .validateFields()
      .then((values) => {
        console.log('Creating quiz:', values);
        message.success('Tạo quiz thành công!');
        setIsQuizModalVisible(false);
        quizForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleUploadVideo = () => {
    videoForm
      .validateFields()
      .then((values) => {
        console.log('Uploading video:', values);
        message.success('Đăng tải video thành công!');
        setIsVideoModalVisible(false);
        videoForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleCreateExercise = () => {
    exerciseForm
      .validateFields()
      .then((values) => {
        console.log('Creating exercise:', values);
        message.success('Tạo bài tập thành công!');
        setIsExerciseModalVisible(false);
        exerciseForm.resetFields();
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const ContentCard = ({ item, type }: any) => (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Button key="view" type="primary" icon={<EyeOutlined />} size="small">
          Xem
        </Button>,
        <Button key="edit" icon={<EditOutlined />} size="small">
          Sửa
        </Button>,
        <Button key="use" icon={<PlayCircleOutlined />} size="small">
          Sử dụng
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
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 8 }}>{item.title}</h3>
            {type === 'quiz' && (
              <>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>
                  {item.questions} câu hỏi
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>
                  Đã dùng: {item.used} lần
                </div>
              </>
            )}
            {type === 'video' && (
              <>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>
                  Thời lượng: {item.duration}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>
                  Đã dùng: {item.used} lần
                </div>
              </>
            )}
            {type === 'exercise' && (
              <>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>
                  Loại: {item.typeText}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 4 }}>
                  Độ khó: {item.level}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: 8 }}>
                  Đã dùng: {item.used} lần
                </div>
              </>
            )}
            <div style={{ fontSize: '12px', color: '#999' }}>Tạo: {item.createdDate}</div>
          </div>
          {type === 'quiz' && <Tag color="green">{item.level}</Tag>}
          {type === 'video' && <Tag color="orange">{item.tag}</Tag>}
          {type === 'exercise' && <Tag color="blue">{item.typeText}</Tag>}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="px-12 py-6">
        {/* Title and Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Kho nội dung</h2>
          <Space>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => setIsQuizModalVisible(true)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Tạo Quiz
            </Button>
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              onClick={() => setIsVideoModalVisible(true)}
              style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
            >
              Đăng tải Video
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsExerciseModalVisible(true)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Tạo Bài tập
            </Button>
          </Space>
        </div>

        {/* Quiz Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Quiz ({quizzes.length})</h3>
          </div>
          <Row gutter={16}>
            {quizzes.map((quiz) => (
              <Col span={8} key={quiz.id}>
                <ContentCard item={quiz} type="quiz" />
              </Col>
            ))}
          </Row>
        </div>

        {/* Video Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '24px' }}>🎥</span>
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Video ({videos.length})</h3>
          </div>
          <Row gutter={16}>
            {videos.map((video) => (
              <Col span={8} key={video.id}>
                <ContentCard item={video} type="video" />
              </Col>
            ))}
          </Row>
        </div>

        {/* Exercise Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '24px' }}>📝</span>
            <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Bài tập ({exercises.length})</h3>
          </div>
          <Row gutter={16}>
            {exercises.map((exercise) => (
              <Col span={8} key={exercise.id}>
                <ContentCard item={exercise} type="exercise" />
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Create Quiz Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined style={{ color: '#52c41a' }} />
            <span>Tạo Quiz mới</span>
          </div>
        }
        open={isQuizModalVisible}
        onOk={handleCreateQuiz}
        onCancel={() => {
          setIsQuizModalVisible(false);
          quizForm.resetFields();
        }}
        width={800}
        okText="Tạo Quiz"
        cancelText="Hủy"
        okButtonProps={{
          style: { backgroundColor: '#52c41a', borderColor: '#52c41a' },
        }}
      >
        <Form
          form={quizForm}
          layout="vertical"
          initialValues={{
            questions: [
              {
                question: '',
                answers: ['', '', '', ''],
                correctAnswer: 0,
              },
            ],
          }}
        >
          <Form.Item
            label="Tiêu đề Quiz"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề quiz!' }]}
          >
            <Input placeholder="VD: Quiz kỹ thuật serve cơ bản" size="large" />
          </Form.Item>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Câu hỏi ({fields.length})</h3>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm câu hỏi
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 16, backgroundColor: '#fafafa' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                      }}
                    >
                      <h4 style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>
                        Câu {name + 1}
                      </h4>
                      <Button type="text" danger onClick={() => remove(name)} size="small">
                        Xóa
                      </Button>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, 'question']}
                      label="Nội dung câu hỏi"
                      rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                    >
                      <Input placeholder="Nhập câu hỏi..." />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'correctAnswer']}
                      label="Đáp án đúng"
                      rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
                    >
                      <Radio.Group>
                        <Space direction="vertical">
                          {[0, 1, 2, 3].map((index) => (
                            <div
                              key={index}
                              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                              <Radio value={index} />
                              <Form.Item
                                {...restField}
                                name={[name, 'answers', index]}
                                rules={[{ required: true, message: 'Vui lòng nhập đáp án!' }]}
                                style={{ margin: 0, flex: 1 }}
                              >
                                <Input placeholder={`Đáp án ${index + 1}`} />
                              </Form.Item>
                            </div>
                          ))}
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Upload Video Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <VideoCameraOutlined style={{ color: '#fa8c16' }} />
            <span>Đăng tải video mới</span>
          </div>
        }
        open={isVideoModalVisible}
        onOk={handleUploadVideo}
        onCancel={() => {
          setIsVideoModalVisible(false);
          videoForm.resetFields();
        }}
        width={600}
        okText="Đăng tải"
        cancelText="Hủy"
        okButtonProps={{
          style: { backgroundColor: '#fa8c16', borderColor: '#fa8c16' },
        }}
      >
        <Form form={videoForm} layout="vertical">
          <Form.Item
            label="Tiêu đề video"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề video!' }]}
          >
            <Input placeholder="VD: Kỹ thuật serve cơ bản" size="large" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Mô tả ngắn về nội dung video..." />
          </Form.Item>

          <Form.Item
            label="Tải lên video"
            name="file"
            rules={[{ required: true, message: 'Vui lòng chọn file video!' }]}
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              accept="video/*"
              beforeUpload={() => false}
              style={{ padding: '20px' }}
            >
              <p className="ant-upload-drag-icon">
                <VideoCameraOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: '500' }}>
                Kéo và thả video vào đây hoặc click để chọn
              </p>
              <p className="ant-upload-hint" style={{ color: '#999' }}>
                Hỗ trợ: MP4, AVI, MOV (Tối đa 100MB)
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Exercise Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusOutlined style={{ color: '#52c41a' }} />
            <span>Tạo bài tập mới</span>
          </div>
        }
        open={isExerciseModalVisible}
        onOk={handleCreateExercise}
        onCancel={() => {
          setIsExerciseModalVisible(false);
          exerciseForm.resetFields();
        }}
        width={600}
        okText="Tạo bài tập"
        cancelText="Hủy"
        okButtonProps={{
          style: { backgroundColor: '#52c41a', borderColor: '#52c41a' },
        }}
      >
        <Form
          form={exerciseForm}
          layout="vertical"
          initialValues={{
            type: 'practice',
          }}
        >
          <Form.Item
            label="Tiêu đề bài tập"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài tập!' }]}
          >
            <Input placeholder="VD: Luyện serve 100 quả" size="large" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Mô tả chi tiết về yêu cầu bài tập..." />
          </Form.Item>

          <Form.Item
            label="Loại bài tập"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại bài tập!' }]}
          >
            <Select size="large">
              <Select.Option value="practice">Thực hành</Select.Option>
              <Select.Option value="video">Video</Select.Option>
              <Select.Option value="theory">Lý thuyết</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Hạn nộp" name="deadline">
            <DatePicker style={{ width: '100%' }} size="large" placeholder="Chọn ngày hạn nộp" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentLibrary;
