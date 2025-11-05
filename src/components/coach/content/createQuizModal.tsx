import { Modal, Form, Input, Button, Card, Space, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CreateQuizModal = ({
  isQuizModalVisible,
  setIsQuizModalVisible,
  handleCreateQuiz,
  quizForm,
}: any) => {
  return (
    <Modal
      title="Tạo Quiz mới"
      open={isQuizModalVisible}
      onOk={handleCreateQuiz}
      onCancel={() => {
        setIsQuizModalVisible(false);
        quizForm.resetFields();
      }}
      width={800}
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
  );
};

export default CreateQuizModal;
