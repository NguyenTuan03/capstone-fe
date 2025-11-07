import { useMemo } from 'react';
import { Modal, Form, Input, Button, Card, Space, Radio, Select, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { QuizQuestionFormValue, CreateQuizModalProps } from '@/@crema/types/quiz';

const { TextArea } = Input;
const { Text } = Typography;

const defaultQuestion: QuizQuestionFormValue = {
  title: '',
  explanation: '',
  options: ['', ''],
  correctOptionIndex: 0,
};

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  open,
  form,
  onSubmit,
  onClose,
  submitting = false,
  lessonsOptions,
}) => {
  const initialValues = useMemo(
    () => ({
      title: '',
      description: '',
      lessonId: undefined,
      questions: [defaultQuestion],
    }),
    [],
  );

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Tạo Quiz mới"
      open={open}
      onOk={onSubmit}
      onCancel={handleCancel}
      width={900}
      confirmLoading={submitting}
      style={{ top: 20 }}
      centered
    >
      <Form form={form} layout="vertical" initialValues={initialValues} preserve={false}>
        <Form.Item
          label="Tiêu đề câu hỏi"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề quiz' },
            { max: 50, message: 'Tiêu đề tối đa 50 ký tự' },
            {
              validator: (_, value) =>
                value && !value.trim()
                  ? Promise.reject(new Error('Tiêu đề không được để trống'))
                  : Promise.resolve(),
            },
          ]}
        >
          <Input
            placeholder="VD: Quiz kỹ thuật serve cơ bản"
            size="large"
            showCount
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { max: 200, message: 'Mô tả tối đa 200 ký tự' },
            {
              validator: (_, value) =>
                value && !value.trim()
                  ? Promise.reject(new Error('Mô tả không được để trống'))
                  : Promise.resolve(),
            },
          ]}
        >
          <TextArea
            placeholder="Nhập mô tả cho quiz"
            rows={3}
            showCount
            maxLength={200}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item
          label="Chọn bài học"
          name="lessonId"
          rules={[{ required: true, message: 'Vui lòng chọn bài học' }]}
        >
          <Select
            allowClear
            placeholder="Chọn bài học áp dụng quiz"
            options={lessonsOptions}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text strong>Câu hỏi ({fields.length})</Text>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({ ...defaultQuestion, options: ['', ''], correctOptionIndex: 0 })
                  }
                >
                  Thêm câu hỏi
                </Button>
              </div>

              {fields.map((field, questionIndex) => (
                <Card key={field.key} size="small" className="bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <Text strong>{`Câu ${questionIndex + 1}`}</Text>
                    {fields.length > 1 && (
                      <Button type="text" danger onClick={() => remove(field.name)} size="small">
                        Xóa câu hỏi
                      </Button>
                    )}
                  </div>

                  <Form.Item
                    label="Nội dung câu hỏi"
                    name={[field.name, 'title']}
                    rules={[
                      { required: true, message: 'Vui lòng nhập nội dung câu hỏi' },
                      { min: 2, message: 'Câu hỏi tối thiểu 2 ký tự' },
                      { max: 100, message: 'Câu hỏi tối đa 100 ký tự' },
                      {
                        validator: (_, value) =>
                          value && !value.trim()
                            ? Promise.reject(new Error('Nội dung không được để trống'))
                            : Promise.resolve(),
                      },
                    ]}
                  >
                    <Input placeholder="Nhập nội dung câu hỏi" showCount maxLength={100} />
                  </Form.Item>

                  <Form.Item
                    label="Giải thích"
                    name={[field.name, 'explanation']}
                    rules={[{ max: 200 }]}
                  >
                    <TextArea
                      placeholder="Giải thích đáp án (không bắt buộc)"
                      rows={2}
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Đáp án đúng"
                    name={[field.name, 'correctOptionIndex']}
                    rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng' }]}
                  >
                    <Radio.Group>
                      <Form.List name={[field.name, 'options']}>
                        {(optionFields, { add: addOption, remove: removeOption }) => (
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {optionFields.map((optionField, optionIndex) => (
                              <Space key={optionField.key} align="start" style={{ width: '100%' }}>
                                <Radio value={optionIndex} />
                                <Form.Item
                                  name={[optionField.name]}
                                  rules={[
                                    { required: true, message: 'Vui lòng nhập đáp án' },
                                    {
                                      validator: (_, value) =>
                                        value && !value.trim()
                                          ? Promise.reject(new Error('Đáp án không được để trống'))
                                          : Promise.resolve(),
                                    },
                                  ]}
                                  style={{ flex: 1, margin: 0 }}
                                >
                                  <Input placeholder={`Đáp án ${optionIndex + 1}`} />
                                </Form.Item>
                                {optionFields.length > 2 && (
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      const questions = form.getFieldValue('questions') || [];
                                      const currentCorrect =
                                        questions?.[questionIndex]?.correctOptionIndex ?? 0;

                                      removeOption(optionField.name);

                                      const updatedQuestions =
                                        form.getFieldValue('questions') || [];
                                      if (currentCorrect === optionIndex) {
                                        updatedQuestions[questionIndex].correctOptionIndex = 0;
                                      } else if (currentCorrect > optionIndex) {
                                        updatedQuestions[questionIndex].correctOptionIndex =
                                          currentCorrect - 1;
                                      }
                                      form.setFieldsValue({ questions: updatedQuestions });
                                    }}
                                    style={{ color: '#ff4d4f', marginTop: 8 }}
                                  />
                                )}
                              </Space>
                            ))}

                            <Button
                              type="dashed"
                              icon={<PlusOutlined />}
                              onClick={() => addOption('')}
                            >
                              Thêm đáp án
                            </Button>
                          </Space>
                        )}
                      </Form.List>
                    </Radio.Group>
                  </Form.Item>
                </Card>
              ))}
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateQuizModal;
