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
  FileTextOutlined,
  VideoCameraOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const ContentLibrary = () => {
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [viewingContent, setViewingContent] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<any>(null);

  // Forms
  const [quizForm] = Form.useForm();
  const [exerciseForm] = Form.useForm();

  // Mock data for courses and sessions
  const courses = [
    {
      id: 1,
      title: 'Pickleball Cơ Bản - Khóa 1',
      description: 'Khóa học dành cho người mới bắt đầu',
      totalSessions: 8,
      enrolledStudents: 25,
    },
    {
      id: 2,
      title: 'Kỹ Thuật Nâng Cao - Khóa 2',
      description: 'Khóa học cho người đã có kinh nghiệm',
      totalSessions: 10,
      enrolledStudents: 18,
    },
    {
      id: 3,
      title: 'Chiến Thuật Đôi - Khóa 3',
      description: 'Khóa học chuyên về thi đấu đôi',
      totalSessions: 6,
      enrolledStudents: 12,
    },
  ];

  const sessions = [
    {
      id: 1,
      courseId: 1,
      title: 'Session 1: Giới thiệu Pickleball',
      date: '2025-01-15',
      status: 'upcoming',
    },
    {
      id: 2,
      courseId: 1,
      title: 'Session 2: Kỹ thuật cầm vợt',
      date: '2025-01-22',
      status: 'upcoming',
    },
    {
      id: 3,
      courseId: 1,
      title: 'Session 3: Serve cơ bản',
      date: '2025-01-29',
      status: 'upcoming',
    },
    {
      id: 4,
      courseId: 2,
      title: 'Session 1: Return nâng cao',
      date: '2025-02-01',
      status: 'upcoming',
    },
    {
      id: 5,
      courseId: 2,
      title: 'Session 2: Footwork chuyên nghiệp',
      date: '2025-02-08',
      status: 'upcoming',
    },
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Quiz: Kỹ thuật serve cơ bản',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      questions: 10,
      used: 3,
      createdDate: '2025-01-01',
      description: 'Quiz kiểm tra kiến thức về kỹ thuật serve cơ bản trong Pickleball',
      timeLimit: 15, // minutes
      questionsData: [
        {
          id: 1,
          question: 'Tư thế chuẩn bị serve trong Pickleball là gì?',
          options: [
            'Đứng song song với baseline',
            'Đứng chéo với baseline',
            'Đứng bất kỳ vị trí nào',
            'Đứng trong service box',
          ],
          correctAnswer: 0,
          explanation:
            'Tư thế chuẩn bị serve phải đứng song song với baseline để đảm bảo tính công bằng.',
        },
        {
          id: 2,
          question: 'Quả serve hợp lệ phải rơi vào vùng nào?',
          options: [
            'Service box đối diện',
            'Service box cùng bên',
            'Bất kỳ vùng nào trong court',
            'Vùng no-volley zone',
          ],
          correctAnswer: 0,
          explanation:
            'Serve phải rơi vào service box đối diện và không được chạm vào no-volley zone.',
        },
      ],
    },
    {
      id: 2,
      title: 'Quiz: Return nâng cao',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800',
      questions: 8,
      used: 1,
      createdDate: '2025-01-05',
      description: 'Quiz về kỹ thuật return nâng cao và chiến thuật',
      timeLimit: 20,
      questionsData: [
        {
          id: 1,
          question: 'Khi return serve, điều quan trọng nhất là gì?',
          options: [
            'Sức mạnh của cú đánh',
            'Độ chính xác và vị trí',
            'Tốc độ di chuyển',
            'Thời gian phản ứng',
          ],
          correctAnswer: 1,
          explanation:
            'Độ chính xác và vị trí return quan trọng hơn sức mạnh để kiểm soát trận đấu.',
        },
      ],
    },
    {
      id: 3,
      title: 'Quiz: Chiến thuật cơ bản',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      questions: 5,
      used: 2,
      createdDate: '2025-01-10',
      description: 'Quiz về chiến thuật cơ bản trong thi đấu Pickleball',
      timeLimit: 10,
      questionsData: [
        {
          id: 1,
          question: 'Chiến thuật nào hiệu quả nhất khi đối thủ ở vị trí yếu?',
          options: [
            'Đánh mạnh về phía đối thủ',
            'Đánh nhẹ về phía đối thủ',
            'Đánh về vị trí trống',
            'Đánh về phía sau',
          ],
          correctAnswer: 2,
          explanation: 'Đánh về vị trí trống sẽ tạo áp lực và buộc đối thủ di chuyển nhiều hơn.',
        },
      ],
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
      description: 'Video hướng dẫn kỹ thuật serve cơ bản trong Pickleball',
      fileSize: '45MB',
      resolution: '1080p',
      videoUrl: 'serve-technique-demo.mp4',
      thumbnail: 'serve-thumbnail.jpg',
      tags: ['serve', 'technique', 'beginner'],
    },
    {
      id: 2,
      title: 'Video: Return practice',
      tag: 'Practice',
      tagColor: 'bg-orange-100 text-orange-800',
      duration: '8:15',
      used: 2,
      createdDate: '2025-01-06',
      description: 'Video thực hành kỹ thuật return và phản xạ',
      fileSize: '62MB',
      resolution: '1080p',
      videoUrl: 'return-practice-demo.mp4',
      thumbnail: 'return-thumbnail.jpg',
      tags: ['return', 'practice', 'reflex'],
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
      description: 'Bài tập luyện serve cơ bản với 100 quả bóng',
      instructions: [
        'Đứng ở vị trí serve chuẩn',
        'Thực hiện 100 quả serve liên tục',
        'Ghi lại số quả serve thành công',
        'Tập trung vào độ chính xác hơn là tốc độ',
      ],
      duration: 30, // minutes
      equipment: ['Vợt Pickleball', 'Bóng Pickleball', 'Court'],
      difficulty: 'Beginner',
      objectives: [
        'Cải thiện độ chính xác serve',
        'Tăng cường sức mạnh cánh tay',
        'Luyện tập tư thế chuẩn',
      ],
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
      description: 'Bài tập quay video thực hành kỹ thuật return',
      instructions: [
        'Quay video thực hiện 20 quả return',
        'Thể hiện các kỹ thuật return khác nhau',
        'Video phải rõ nét và đầy đủ góc nhìn',
        'Thời lượng video: 3-5 phút',
      ],
      duration: 45,
      equipment: ['Vợt Pickleball', 'Bóng Pickleball', 'Camera/Điện thoại', 'Court'],
      difficulty: 'Intermediate',
      objectives: ['Thực hành kỹ thuật return', 'Cải thiện phản xạ', 'Luyện tập với video'],
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

  const handleUseContent = (content: any) => {
    setSelectedContent(content);
    setIsCourseModalVisible(true);
  };

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    setIsCourseModalVisible(false);
    setIsSessionModalVisible(true);
  };

  const handleAssignToSession = (session: any) => {
    message.success(`Đã gán ${selectedContent?.title} vào ${session.title}`);
    setIsSessionModalVisible(false);
    setSelectedContent(null);
    setSelectedCourse(null);
  };

  const handleViewContent = (content: any) => {
    setViewingContent(content);
    setIsViewModalVisible(true);
  };

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    setIsEditModalVisible(true);

    // Pre-fill form based on content type
    if (content.type === 'quiz') {
      quizForm.setFieldsValue({
        title: content.title,
        description: content.description,
        level: content.level,
        timeLimit: content.timeLimit,
        questions: content.questionsData,
      });
    } else if (content.type === 'video') {
      // Handle video edit form
    } else if (content.type === 'exercise') {
      exerciseForm.setFieldsValue({
        title: content.title,
        description: content.description,
        type: content.type,
        level: content.level,
        duration: content.duration,
        instructions: content.instructions,
        equipment: content.equipment,
        objectives: content.objectives,
      });
    }
  };

  const ContentCard = ({ item, type }: any) => (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Button
          key="view"
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewContent({ ...item, type })}
        >
          Xem
        </Button>,
        <Button
          key="edit"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEditContent({ ...item, type })}
        >
          Sửa
        </Button>,
        <Button
          key="use"
          icon={<PlayCircleOutlined />}
          size="small"
          onClick={() => handleUseContent({ ...item, type })}
        >
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
              <Select.Option value="video">Video</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const exerciseType = getFieldValue('type');
              return exerciseType === 'video' ? (
                <Form.Item
                  label="Tải lên video"
                  name="videoFile"
                  rules={[{ required: true, message: 'Vui lòng chọn file video!' }]}
                >
                  <Upload.Dragger
                    name="videoFile"
                    multiple={false}
                    accept="video/*"
                    beforeUpload={() => false}
                    style={{ padding: '20px' }}
                  >
                    <p className="ant-upload-drag-icon">
                      <VideoCameraOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: '500' }}>
                      Kéo và thả video vào đây hoặc click để chọn
                    </p>
                    <p className="ant-upload-hint" style={{ color: '#999' }}>
                      Hỗ trợ: MP4, AVI, MOV (Tối đa 100MB)
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Form.Item label="Hạn nộp" name="deadline">
            <DatePicker style={{ width: '100%' }} size="large" placeholder="Chọn ngày hạn nộp" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Course Selection Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircleOutlined style={{ color: '#1890ff' }} />
            <span>Chọn khóa học</span>
          </div>
        }
        open={isCourseModalVisible}
        onCancel={() => {
          setIsCourseModalVisible(false);
          setSelectedContent(null);
        }}
        width={800}
        footer={null}
      >
        <div
          style={{
            marginBottom: '16px',
            padding: '16px',
            background: '#f0f9ff',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ margin: 0, color: '#1890ff' }}>📝 {selectedContent?.title || 'Bài tập'}</h4>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>Chọn khóa học để gán bài tập này vào</p>
        </div>

        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col span={24} key={course.id}>
              <Card
                hoverable
                onClick={() => handleSelectCourse(course)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                      {course.title}
                    </h3>
                    <p style={{ margin: '8px 0', color: '#666' }}>{course.description}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#999' }}>
                      <span>📚 {course.totalSessions} buổi học</span>
                      <span>👥 {course.enrolledStudents} học viên</span>
                    </div>
                  </div>
                  <Button type="primary" icon={<PlayCircleOutlined />}>
                    Chọn
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      {/* Session Selection Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircleOutlined style={{ color: '#52c41a' }} />
            <span>Chọn session</span>
          </div>
        }
        open={isSessionModalVisible}
        onCancel={() => {
          setIsSessionModalVisible(false);
          setSelectedCourse(null);
        }}
        width={800}
        footer={null}
      >
        <div
          style={{
            marginBottom: '16px',
            padding: '16px',
            background: '#f6ffed',
            borderRadius: '8px',
          }}
        >
          <h4 style={{ margin: 0, color: '#52c41a' }}>📚 {selectedCourse?.title || 'Khóa học'}</h4>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>Chọn session để gán bài tập vào</p>
        </div>

        <Row gutter={[16, 16]}>
          {sessions
            .filter((session) => session.courseId === selectedCourse?.id)
            .map((session) => (
              <Col span={24} key={session.id}>
                <Card
                  hoverable
                  onClick={() => handleAssignToSession(session)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        {session.title}
                      </h3>
                      <p style={{ margin: '8px 0', color: '#666' }}>📅 {session.date}</p>
                      <Tag color={session.status === 'upcoming' ? 'blue' : 'green'}>
                        {session.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã hoàn thành'}
                      </Tag>
                    </div>
                    <Button type="primary" icon={<PlayCircleOutlined />}>
                      Gán bài tập
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Modal>

      {/* View Content Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EyeOutlined style={{ color: '#1890ff' }} />
            <span>Xem chi tiết</span>
          </div>
        }
        open={isViewModalVisible}
        onCancel={() => {
          setIsViewModalVisible(false);
          setViewingContent(null);
        }}
        width={800}
        footer={null}
      >
        {viewingContent && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                {viewingContent.title}
              </h2>
              <p style={{ margin: '8px 0', color: '#666' }}>{viewingContent.description}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Tag color="blue">{viewingContent.level || viewingContent.tag}</Tag>
                <Tag color="green">Đã dùng: {viewingContent.used} lần</Tag>
                <Tag color="orange">Tạo: {viewingContent.createdDate}</Tag>
              </div>
            </div>

            {viewingContent.type === 'quiz' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>📋 Thông tin Quiz</h3>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Thời gian:</strong> {viewingContent.timeLimit} phút
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Số câu hỏi:</strong> {viewingContent.questions}
                </div>

                <h4 style={{ marginBottom: '12px' }}>Danh sách câu hỏi:</h4>
                {viewingContent.questionsData?.map((question: any, index: number) => (
                  <Card key={question.id} style={{ marginBottom: '12px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Câu {index + 1}:</strong> {question.question}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Các đáp án:</strong>
                      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {question.options.map((option: string, optIndex: number) => (
                          <li
                            key={optIndex}
                            style={{
                              color: optIndex === question.correctAnswer ? '#52c41a' : '#666',
                              fontWeight: optIndex === question.correctAnswer ? '600' : 'normal',
                            }}
                          >
                            {option} {optIndex === question.correctAnswer && '✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ color: '#1890ff', fontSize: '14px' }}>
                      <strong>Giải thích:</strong> {question.explanation}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {viewingContent.type === 'video' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>🎥 Thông tin Video</h3>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Thời lượng:</strong> {viewingContent.duration}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Kích thước file:</strong> {viewingContent.fileSize}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Độ phân giải:</strong> {viewingContent.resolution}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Tags:</strong> {viewingContent.tags?.join(', ')}
                </div>
              </div>
            )}

            {viewingContent.type === 'exercise' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>📝 Thông tin Bài tập</h3>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Loại:</strong> {viewingContent.typeText}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Thời gian:</strong> {viewingContent.duration} phút
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Độ khó:</strong> {viewingContent.difficulty}
                </div>

                <h4 style={{ marginBottom: '12px' }}>Hướng dẫn thực hiện:</h4>
                <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                  {viewingContent.instructions?.map((instruction: string, index: number) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {instruction}
                    </li>
                  ))}
                </ul>

                <h4 style={{ marginBottom: '12px' }}>Thiết bị cần thiết:</h4>
                <div style={{ marginBottom: '16px' }}>{viewingContent.equipment?.join(', ')}</div>

                <h4 style={{ marginBottom: '12px' }}>Mục tiêu:</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {viewingContent.objectives?.map((objective: string, index: number) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Content Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EditOutlined style={{ color: '#52c41a' }} />
            <span>Chỉnh sửa</span>
          </div>
        }
        open={isEditModalVisible}
        onOk={() => {
          if (editingContent?.type === 'quiz') {
            handleCreateQuiz();
          } else if (editingContent?.type === 'exercise') {
            handleCreateExercise();
          }
          setIsEditModalVisible(false);
          setEditingContent(null);
        }}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingContent(null);
        }}
        width={800}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        {editingContent?.type === 'quiz' && (
          <Form
            form={quizForm}
            layout="vertical"
            initialValues={{
              title: editingContent.title,
              description: editingContent.description,
              level: editingContent.level,
              timeLimit: editingContent.timeLimit,
            }}
          >
            <Form.Item
              label="Tiêu đề quiz"
              name="title"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề quiz!' }]}
            >
              <Input placeholder="VD: Quiz kỹ thuật serve" size="large" />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={3} placeholder="Mô tả chi tiết về quiz..." />
            </Form.Item>

            <Form.Item
              label="Cấp độ"
              name="level"
              rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}
            >
              <Select size="large">
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Intermediate">Intermediate</Select.Option>
                <Select.Option value="Advanced">Advanced</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Thời gian làm bài (phút)"
              name="timeLimit"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
            >
              <Input type="number" placeholder="15" size="large" />
            </Form.Item>
          </Form>
        )}

        {editingContent?.type === 'exercise' && (
          <Form
            form={exerciseForm}
            layout="vertical"
            initialValues={{
              title: editingContent.title,
              description: editingContent.description,
              type: editingContent.type,
              level: editingContent.level,
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
                <Select.Option value="video">Video</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ContentLibrary;
