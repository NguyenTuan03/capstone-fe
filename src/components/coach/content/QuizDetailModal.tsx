'use client';

import React from 'react';
import { Modal, Descriptions, Tag, Button, Space, Divider, Card } from 'antd';
import {
  QuestionCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CloseOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface QuizDetailModalProps {
  open: boolean;
  quiz: any;
  onClose: () => void;
}

const QuizDetailModal: React.FC<QuizDetailModalProps> = ({ open, quiz, onClose }) => {
  if (!quiz) return null;

  // Use original data if available, otherwise use mapped data
  const quizData = quiz._original || quiz;
  const questions = quizData.questions || [];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <QuestionCircleOutlined />
          <span>Chi tiết Quiz</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={900}
      centered
      styles={{
        body: {
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
        },
      }}
    >
      {quizData && (
        <div>
          {/* Basic Information */}
          <Descriptions column={1} bordered className="mb-6">
            <Descriptions.Item label="Tiêu đề">
              <span className="font-semibold text-lg">{quizData.title}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {quizData.description || 'Chưa có mô tả'}
            </Descriptions.Item>
            <Descriptions.Item label="Số câu hỏi">
              <Space>
                <QuestionCircleOutlined />
                <span>{quizData.totalQuestions || questions.length} câu hỏi</span>
              </Space>
            </Descriptions.Item>
            {quiz.lessonName && (
              <Descriptions.Item label="Bài học">
                <Tag color="cyan">📚 {quiz.lessonName}</Tag>
              </Descriptions.Item>
            )}
            {quizData.createdBy && (
              <Descriptions.Item label="Người tạo">
                <Space>
                  <UserOutlined />
                  <span>{quizData.createdBy.fullName || quizData.createdBy.email}</span>
                </Space>
              </Descriptions.Item>
            )}
            {quizData.createdAt && (
              <Descriptions.Item label="Ngày tạo">
                <Space>
                  <CalendarOutlined />
                  <span>{new Date(quizData.createdAt).toLocaleString('vi-VN')}</span>
                </Space>
              </Descriptions.Item>
            )}
            {quiz.status && (
              <Descriptions.Item label="Trạng thái">
                <Tag color={quiz.status === 'published' ? 'success' : 'default'}>
                  {quiz.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                </Tag>
              </Descriptions.Item>
            )}
          </Descriptions>

          {/* Questions List */}
          {questions.length > 0 && (
            <>
              <Divider orientation="left">
                <QuestionCircleOutlined /> Danh sách câu hỏi
              </Divider>
              <div className="space-y-4">
                {questions.map((question: any, questionIndex: number) => (
                  <Card
                    key={question.id || questionIndex}
                    size="small"
                    className="shadow-sm"
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Câu {questionIndex + 1}</span>
                        {question.title && (
                          <span className="text-gray-600">- {question.title}</span>
                        )}
                      </div>
                    }
                  >
                    {question.explanation && (
                      <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm text-gray-700 mb-0">
                          <strong>Giải thích:</strong> {question.explanation}
                        </p>
                      </div>
                    )}

                    {/* Options */}
                    {question.options && question.options.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-600 mb-2">Các lựa chọn:</div>
                        {question.options.map((option: any, optionIndex: number) => (
                          <div
                            key={option.id || optionIndex}
                            className={`p-3 rounded border ${
                              option.isCorrect
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-1">
                                {option.isCorrect ? (
                                  <CheckCircleOutlined className="text-green-600 text-lg" />
                                ) : (
                                  <CloseOutlined className="text-gray-400 text-lg" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <span>{option.content}</span>
                                  {option.isCorrect && (
                                    <Tag color="success" className="ml-2">
                                      Đáp án đúng
                                    </Tag>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}

          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <QuestionCircleOutlined className="text-4xl mb-2" />
              <div>Chưa có câu hỏi nào</div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default QuizDetailModal;
