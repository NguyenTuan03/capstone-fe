'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Dropdown,
  Tooltip,
  Row,
  Col,
  Card,
  Radio,
  Checkbox,
  Divider,
  Typography,
  Alert,
  List,
  Switch,
} from 'antd';

import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CurriculumApiService } from '@/services/curriculumApi';
import {
  Quiz,
  Lesson,
  Chapter,
  CreateQuizRequest,
  UpdateQuizRequest,
  CurriculumFilterOptions,
} from '@/types/curriculum';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface QuizManagementProps {
  searchText: string;
  setSearchText: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  chapterFilter: string;
  setChapterFilter: (value: string) => void;
  filterOptions: CurriculumFilterOptions | null;
  onClearFilters: () => void;
  onStatsUpdate: () => void;
}

const QuizManagement: React.FC<QuizManagementProps> = ({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  chapterFilter,
  setChapterFilter,
  filterOptions,
  onClearFilters,
  onStatsUpdate,
}) => {
  // States
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [previewingQuiz, setPreviewingQuiz] = useState<Quiz | null>(null);
  const [form] = Form.useForm();

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Form states
  const [quizType, setQuizType] = useState<'single_choice' | 'multiple_choice' | 'true_false'>(
    'single_choice',
  );
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);

  // Load data
  const loadQuizzes = async () => {
    setLoading(true);
    try {
      // Get all lessons first, then extract quizzes
      const lessonResponse = await CurriculumApiService.getLessons({
        page: 1,
        limit: 1000,
        chapterId: chapterFilter !== 'all' ? chapterFilter : undefined,
        hasContent: 'quiz',
        sortBy: 'order',
        sortOrder: 'asc',
      });

      // Extract all quizzes from lessons
      const allQuizzes: (Quiz & { lessonName: string; chapterName: string })[] = [];
      lessonResponse.lessons.forEach((lesson) => {
        lesson.quizzes.forEach((quiz) => {
          allQuizzes.push({
            ...quiz,
            lessonName: lesson.name,
            chapterName: lesson.chapterName,
          });
        });
      });

      // Apply filters
      let filteredQuizzes = allQuizzes;

      if (searchText) {
        const searchTerm = searchText.toLowerCase();
        filteredQuizzes = filteredQuizzes.filter(
          (quiz) =>
            quiz.question.toLowerCase().includes(searchTerm) ||
            quiz.lessonName.toLowerCase().includes(searchTerm) ||
            quiz.chapterName.toLowerCase().includes(searchTerm),
        );
      }

      if (statusFilter !== 'all') {
        filteredQuizzes = filteredQuizzes.filter((quiz) => quiz.status === statusFilter);
      }

      // Apply pagination
      const total = filteredQuizzes.length;
      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex);

      setQuizzes(paginatedQuizzes);
      setPagination((prev) => ({ ...prev, total }));
      onStatsUpdate();
    } catch (error) {
      message.error('Không thể tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  const loadChapters = async () => {
    try {
      const response = await CurriculumApiService.getChapters({
        page: 1,
        limit: 100,
        status: 'active',
        sortBy: 'order',
        sortOrder: 'asc',
      });
      setChapters(response.chapters);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    }
  };

  const loadLessons = async (chapterId?: string) => {
    try {
      const response = await CurriculumApiService.getLessons({
        page: 1,
        limit: 100,
        chapterId,
        sortBy: 'order',
        sortOrder: 'asc',
      });
      setLessons(response.lessons);
    } catch (error) {
      console.error('Failed to load lessons:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadQuizzes();
  }, [pagination.current, pagination.pageSize, searchText, statusFilter, chapterFilter]);

  useEffect(() => {
    loadChapters();
    loadLessons();
  }, []);

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadQuizzes();
  };

  const handleAddQuiz = () => {
    setEditingQuiz(null);
    form.resetFields();
    setQuizType('single_choice');
    setOptions(['', '']);
    setCorrectAnswers([]);
    form.setFieldsValue({
      type: 'single_choice',
      points: 10,
      timeLimit: 30,
      status: 'active',
    });
    setModalVisible(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setQuizType(quiz.type);
    setOptions(quiz.options.map((opt) => opt.text));

    // Find correct answer indices
    const correctIndices = quiz.options
      .map((opt, index) => (quiz.correctAnswers.includes(opt.id) ? index : -1))
      .filter((index) => index !== -1);
    setCorrectAnswers(correctIndices);

    form.setFieldsValue({
      lessonId: quiz.lessonId,
      question: quiz.question,
      type: quiz.type,
      explanation: quiz.explanation,
      points: quiz.points,
      timeLimit: quiz.timeLimit,
      status: quiz.status,
    });
    setModalVisible(true);
  };

  const handlePreviewQuiz = (quiz: Quiz) => {
    setPreviewingQuiz(quiz);
    setPreviewModalVisible(true);
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    Modal.confirm({
      title: <IntlMessages id="curriculum.delete.quiz.title" />,
      content: <IntlMessages id="curriculum.delete.quiz.message" />,
      okText: <IntlMessages id="common.yes" />,
      cancelText: <IntlMessages id="common.no" />,
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await CurriculumApiService.deleteQuiz(quiz.id);
          if (response.success) {
            message.success(response.message);
            loadQuizzes();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error('Không thể xóa quiz');
        }
      },
    });
  };

  const handleTypeChange = (type: 'single_choice' | 'multiple_choice' | 'true_false') => {
    setQuizType(type);
    setCorrectAnswers([]);

    if (type === 'true_false') {
      setOptions(['Đúng', 'Sai']);
    } else if (options.length < 2) {
      setOptions(['', '']);
    }
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      // Update correct answers
      const newCorrectAnswers = correctAnswers
        .map((answerIndex) => (answerIndex > index ? answerIndex - 1 : answerIndex))
        .filter((answerIndex) => answerIndex !== index);
      setCorrectAnswers(newCorrectAnswers);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index: number, checked: boolean) => {
    if (quizType === 'single_choice') {
      setCorrectAnswers(checked ? [index] : []);
    } else {
      const newCorrectAnswers = checked
        ? [...correctAnswers, index]
        : correctAnswers.filter((i) => i !== index);
      setCorrectAnswers(newCorrectAnswers);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Validate options
      const validOptions = options.filter((opt) => opt.trim() !== '');
      if (validOptions.length < 2) {
        message.error('Vui lòng thêm ít nhất 2 đáp án');
        return;
      }

      if (correctAnswers.length === 0) {
        message.error('Vui lòng chọn đáp án đúng');
        return;
      }

      const optionsData = validOptions.map((text, index) => ({
        text: text.trim(),
        order: index + 1,
      }));

      if (editingQuiz) {
        // Update quiz
        const request: UpdateQuizRequest = {
          id: editingQuiz.id,
          question: values.question,
          type: quizType,
          options: optionsData,
          correctAnswers: correctAnswers,
          explanation: values.explanation,
          points: values.points,
          timeLimit: values.timeLimit,
          status: values.status,
        };

        const response = await CurriculumApiService.updateQuiz(request);
        if (response.success) {
          message.success(response.message);
          setModalVisible(false);
          loadQuizzes();
        } else {
          message.error(response.message);
        }
      } else {
        // Create quiz
        const request: CreateQuizRequest = {
          lessonId: values.lessonId,
          question: values.question,
          type: quizType,
          options: optionsData,
          correctAnswers: correctAnswers,
          points: values.points,
          timeLimit: values.timeLimit,
        };

        const response = await CurriculumApiService.createQuiz(request);
        if (response.success) {
          message.success(response.message);
          setModalVisible(false);
          loadQuizzes();
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error('Không thể lưu quiz');
    }
  };

  // Table columns
  const columns: ColumnsType<Quiz & { lessonName?: string; chapterName?: string }> = [
    {
      title: <IntlMessages id="curriculum.quiz.table.order" />,
      dataIndex: 'order',
      key: 'order',
      width: 60,
      render: (order: number) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{order}</div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.quiz.table.question" />,
      dataIndex: 'question',
      key: 'question',
      width: 250,
      render: (question: string, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
            {question.length > 60 ? `${question.substring(0, 60)}...` : question}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            <Text type="secondary">{record.chapterName}</Text>
            <Divider type="vertical" />
            <Text type="secondary">{record.lessonName}</Text>
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.quiz.table.type" />,
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeConfig = {
          single_choice: { color: 'blue', text: 'Một đáp án' },
          multiple_choice: { color: 'green', text: 'Nhiều đáp án' },
          true_false: { color: 'orange', text: 'Đúng/Sai' },
        };
        const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.single_choice;

        return (
          <Tag color={config.color} style={{ fontSize: '11px' }}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: <IntlMessages id="curriculum.quiz.table.options" />,
      dataIndex: 'options',
      key: 'options',
      width: 80,
      render: (options: any[]) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
            {options.length}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>đáp án</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.quiz.table.points" />,
      dataIndex: 'points',
      key: 'points',
      width: 80,
      render: (points: number) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#faad14' }}>{points}</div>
      ),
    },
    {
      title: <IntlMessages id="curriculum.quiz.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'} style={{ fontSize: '11px' }}>
          <IntlMessages id={`curriculum.status.${status}`} />
        </Tag>
      ),
    },
    {
      title: <IntlMessages id="curriculum.quiz.table.actions" />,
      key: 'actions',
      width: 120,
      render: (_, quiz) => {
        const menuItems = [
          {
            key: 'preview',
            label: 'Xem trước',
            icon: <EyeOutlined />,
            onClick: () => handlePreviewQuiz(quiz),
          },
          {
            key: 'edit',
            label: <IntlMessages id="curriculum.actions.edit" />,
            icon: <EditOutlined />,
            onClick: () => handleEditQuiz(quiz),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: <IntlMessages id="curriculum.actions.delete" />,
            icon: <DeleteOutlined />,
            onClick: () => handleDeleteQuiz(quiz),
            danger: true,
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm câu hỏi, bài học..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={chapterFilter}
              onChange={setChapterFilter}
              style={{ width: '100%' }}
              placeholder="Chọn chương"
            >
              <Option value="all">Tất cả chương</Option>
              {chapters.map((chapter) => (
                <Option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              {filterOptions?.statuses.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button icon={<FilterOutlined />} onClick={onClearFilters}>
              <IntlMessages id="curriculum.filter.clear" />
            </Button>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuiz}>
              <IntlMessages id="curriculum.actions.add" />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={quizzes}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} quiz`,
          onChange: (page, pageSize) => {
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize: pageSize || 10,
            }));
          },
        }}
        size="middle"
        scroll={{ x: 1000 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={
          editingQuiz ? (
            <IntlMessages id="curriculum.quiz.edit.title" />
          ) : (
            <IntlMessages id="curriculum.quiz.add.title" />
          )
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {!editingQuiz && (
            <Form.Item
              name="lessonId"
              label="Bài học"
              rules={[{ required: true, message: 'Vui lòng chọn bài học' }]}
            >
              <Select placeholder="Chọn bài học...">
                {lessons.map((lesson) => (
                  <Option key={lesson.id} value={lesson.id}>
                    {lesson.chapterName} - {lesson.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="question"
            label={<IntlMessages id="curriculum.quiz.question.label" />}
            rules={[
              { required: true, message: 'Vui lòng nhập câu hỏi' },
              { max: 500, message: 'Câu hỏi không được quá 500 ký tự' },
            ]}
          >
            <TextArea rows={3} placeholder="Nhập câu hỏi..." showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="type"
            label={<IntlMessages id="curriculum.quiz.type.label" />}
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
          >
            <Radio.Group onChange={(e) => handleTypeChange(e.target.value)} value={quizType}>
              <Radio value="single_choice">
                <IntlMessages id="curriculum.quiz.type.single" />
              </Radio>
              <Radio value="multiple_choice">
                <IntlMessages id="curriculum.quiz.type.multiple" />
              </Radio>
              <Radio value="true_false">
                <IntlMessages id="curriculum.quiz.type.truefalse" />
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label={<IntlMessages id="curriculum.quiz.options.label" />}>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '12px' }}>
              {options.map((option, index) => (
                <div
                  key={index}
                  style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div style={{ minWidth: '20px', fontSize: '12px', color: '#666' }}>
                    {String.fromCharCode(65 + index)}.
                  </div>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Nhập đáp án ${String.fromCharCode(65 + index)}...`}
                    disabled={quizType === 'true_false'}
                  />
                  {quizType === 'single_choice' ? (
                    <Radio
                      checked={correctAnswers.includes(index)}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.checked)}
                    >
                      Đúng
                    </Radio>
                  ) : quizType === 'multiple_choice' ? (
                    <Checkbox
                      checked={correctAnswers.includes(index)}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.checked)}
                    >
                      Đúng
                    </Checkbox>
                  ) : (
                    <Switch
                      checked={correctAnswers.includes(index)}
                      onChange={(checked) => handleCorrectAnswerChange(index, checked)}
                      size="small"
                    />
                  )}
                  {quizType !== 'true_false' && options.length > 2 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleRemoveOption(index)}
                    />
                  )}
                </div>
              ))}

              {quizType !== 'true_false' && options.length < 6 && (
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={handleAddOption}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <IntlMessages id="curriculum.quiz.options.add" />
                </Button>
              )}
            </div>
          </Form.Item>

          <Form.Item
            name="explanation"
            label={<IntlMessages id="curriculum.quiz.explanation.label" />}
          >
            <TextArea
              rows={2}
              placeholder="Nhập giải thích cho đáp án..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="points"
                label={<IntlMessages id="curriculum.quiz.points.label" />}
                rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="Điểm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="timeLimit"
                label={<IntlMessages id="curriculum.quiz.timeLimit.label" />}
              >
                <InputNumber
                  min={10}
                  max={300}
                  style={{ width: '100%' }}
                  placeholder="Thời gian (giây)"
                  addonAfter="giây"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">
                    <IntlMessages id="curriculum.status.active" />
                  </Option>
                  <Option value="inactive">
                    <IntlMessages id="curriculum.status.inactive" />
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                <IntlMessages id="common.cancel" />
              </Button>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="common.save" />
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Xem trước Quiz"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={600}
      >
        {previewingQuiz && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Tag color="blue" style={{ marginBottom: '8px' }}>
                {previewingQuiz.type === 'single_choice'
                  ? 'Một đáp án'
                  : previewingQuiz.type === 'multiple_choice'
                    ? 'Nhiều đáp án'
                    : 'Đúng/Sai'}
              </Tag>
              <Tag color="orange">{previewingQuiz.points} điểm</Tag>
              {previewingQuiz.timeLimit && <Tag color="purple">{previewingQuiz.timeLimit}s</Tag>}
            </div>

            <Title level={4} style={{ marginBottom: '16px' }}>
              {previewingQuiz.question}
            </Title>

            <List
              dataSource={previewingQuiz.options}
              renderItem={(option, index) => (
                <List.Item
                  style={{
                    backgroundColor: previewingQuiz.correctAnswers.includes(option.id)
                      ? '#f6ffed'
                      : 'transparent',
                    border: previewingQuiz.correctAnswers.includes(option.id)
                      ? '1px solid #b7eb8f'
                      : '1px solid #f0f0f0',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    padding: '8px 12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        minWidth: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: previewingQuiz.correctAnswers.includes(option.id)
                          ? '#52c41a'
                          : '#f0f0f0',
                        color: previewingQuiz.correctAnswers.includes(option.id) ? 'white' : '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option.text}</span>
                    {previewingQuiz.correctAnswers.includes(option.id) && (
                      <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 'auto' }} />
                    )}
                  </div>
                </List.Item>
              )}
            />

            {previewingQuiz.explanation && (
              <Alert
                message="Giải thích"
                description={previewingQuiz.explanation}
                type="info"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuizManagement;
