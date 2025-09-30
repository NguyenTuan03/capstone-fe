'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Tabs,
  Button,
  Input,
  Form,
  Upload,
  message,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Image,
  Alert,
} from 'antd';

import {
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  SaveOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import IntlMessages from '@/@crema/helper/IntlMessages';
import { CurriculumApiService } from '@/services/curriculumApi';
import {
  Lesson,
  Chapter,
  LessonTextContent,
  LessonVideoContent,
  UpdateLessonContentRequest,
} from '@/types/curriculum';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface ContentEditorProps {
  onStatsUpdate: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ onStatsUpdate }) => {
  // States
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  // Forms
  const [textForm] = Form.useForm();
  const [videoForm] = Form.useForm();

  // Load data
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

  const loadLessonContent = async (lessonId: string) => {
    setLoading(true);
    try {
      console.log('Loading lesson content for:', lessonId);
      const lesson = await CurriculumApiService.getLessonById(lessonId);
      if (lesson) {
        console.log('Lesson loaded:', lesson.name);
        console.log('Text content:', lesson.textContent);
        console.log('Video content:', lesson.videoContent);
        setSelectedLesson(lesson);

        // Set form values
        if (lesson.textContent) {
          textForm.setFieldsValue({
            content: lesson.textContent.content,
          });
          console.log('Text form set with content');
        } else {
          textForm.resetFields();
          console.log('No text content, form reset');
        }

        if (lesson.videoContent) {
          videoForm.setFieldsValue({
            title: lesson.videoContent.title,
            description: lesson.videoContent.description,
            videoUrl: lesson.videoContent.videoUrl,
          });
          console.log('Video form set with content');
        } else {
          videoForm.resetFields();
          console.log('No video content, form reset');
        }
      } else {
        console.log('No lesson found for ID:', lessonId);
        message.error('Không tìm thấy bài học');
      }
    } catch (error) {
      console.error('Error loading lesson content:', error);
      message.error('Không thể tải nội dung bài học');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadChapters();
  }, []);

  // Handlers
  const handleChapterChange = (chapterId: string) => {
    loadLessons(chapterId);
    setSelectedLesson(null);
    setLessons([]);
  };

  const handleLessonChange = (lessonId: string) => {
    loadLessonContent(lessonId);
  };

  const handleSaveTextContent = async (values: any) => {
    if (!selectedLesson) return;

    setSaving(true);
    try {
      const textContent: LessonTextContent = {
        id: selectedLesson.textContent?.id || `text-${Date.now()}`,
        content: values.content,
        attachments: selectedLesson.textContent?.attachments || [],
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'admin-001',
      };

      const request: UpdateLessonContentRequest = {
        lessonId: selectedLesson.id,
        type: 'text',
        content: textContent,
      };

      const response = await CurriculumApiService.updateLessonContent(request);
      if (response.success) {
        message.success(response.message);
        // Reload lesson to get updated content
        loadLessonContent(selectedLesson.id);
        onStatsUpdate();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Không thể lưu nội dung text');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVideoContent = async (values: any) => {
    if (!selectedLesson) return;

    setSaving(true);
    try {
      const videoContent: LessonVideoContent = {
        id: selectedLesson.videoContent?.id || `video-${Date.now()}`,
        title: values.title,
        description: values.description,
        videoUrl: values.videoUrl,
        thumbnailUrl: selectedLesson.videoContent?.thumbnailUrl,
        duration: selectedLesson.videoContent?.duration || 0,
        fileSize: selectedLesson.videoContent?.fileSize,
        uploadedAt: selectedLesson.videoContent?.uploadedAt || new Date().toISOString(),
        uploadedBy: 'admin-001',
      };

      const request: UpdateLessonContentRequest = {
        lessonId: selectedLesson.id,
        type: 'video',
        content: videoContent,
      };

      const response = await CurriculumApiService.updateLessonContent(request);
      if (response.success) {
        message.success(response.message);
        // Reload lesson to get updated content
        loadLessonContent(selectedLesson.id);
        onStatsUpdate();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Không thể lưu nội dung video');
    } finally {
      setSaving(false);
    }
  };

  // Video preview component
  const VideoPreview: React.FC<{ videoUrl: string; title?: string }> = ({ videoUrl, title }) => {
    const getVideoThumbnail = (url: string) => {
      // Extract YouTube video ID
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
      }
      return null;
    };

    const thumbnail = getVideoThumbnail(videoUrl);

    return (
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '12px',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <PlayCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
          <Text strong>{title || 'Video Preview'}</Text>
        </div>
        {thumbnail ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Image
              src={thumbnail}
              alt="Video thumbnail"
              style={{ maxWidth: '300px', borderRadius: '4px' }}
              preview={{
                mask: (
                  <div style={{ color: 'white' }}>
                    <PlayCircleOutlined style={{ fontSize: '24px' }} />
                  </div>
                ),
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '48px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              <PlayCircleOutlined />
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            }}
          >
            <VideoCameraOutlined style={{ fontSize: '24px', color: '#999' }} />
            <div style={{ marginTop: '8px', color: '#666' }}>Video URL: {videoUrl}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Lesson Selector */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Select
              placeholder="Chọn chương..."
              style={{ width: '100%' }}
              onChange={handleChapterChange}
              loading={loading}
            >
              {chapters.map((chapter) => (
                <Option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="Chọn bài học..."
              style={{ width: '100%' }}
              onChange={handleLessonChange}
              disabled={lessons.length === 0}
              loading={loading}
            >
              {lessons.map((lesson) => (
                <Option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            {selectedLesson && (
              <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                <Text type="secondary">
                  Đã chọn: <Text strong>{selectedLesson.name}</Text>
                </Text>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* Content Editor */}
      {selectedLesson ? (
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            {/* Text Content Tab */}
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  <IntlMessages id="curriculum.content.tabs.text" />
                  {selectedLesson.hasText && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#52c41a',
                        borderRadius: '50%',
                        marginLeft: '6px',
                      }}
                    />
                  )}
                </span>
              }
              key="text"
            >
              <Form form={textForm} layout="vertical" onFinish={handleSaveTextContent}>
                <Form.Item
                  name="content"
                  label={<IntlMessages id="curriculum.content.text.editor" />}
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học' }]}
                >
                  <TextArea
                    rows={15}
                    placeholder="Nhập nội dung bài học..."
                    showCount
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>

                <Alert
                  message="Hướng dẫn soạn thảo"
                  description="Bạn có thể sử dụng HTML tags để format nội dung: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, etc."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Space>
                    <Button icon={<EyeOutlined />}>Xem trước</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={saving}
                    >
                      <IntlMessages id="common.save" />
                    </Button>
                  </Space>
                </Form.Item>
              </Form>

              {/* Text Content Preview */}
              {selectedLesson.hasText && selectedLesson.textContent && (
                <>
                  <Divider>Nội dung hiện tại</Divider>
                  <div
                    style={{
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      padding: '16px',
                      backgroundColor: '#fafafa',
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedLesson.textContent.content,
                    }}
                  />
                </>
              )}
            </TabPane>

            {/* Video Content Tab */}
            <TabPane
              tab={
                <span>
                  <VideoCameraOutlined />
                  <IntlMessages id="curriculum.content.tabs.video" />
                  {selectedLesson.hasVideo && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#1890ff',
                        borderRadius: '50%',
                        marginLeft: '6px',
                      }}
                    />
                  )}
                </span>
              }
              key="video"
            >
              <Form form={videoForm} layout="vertical" onFinish={handleSaveVideoContent}>
                <Form.Item
                  name="title"
                  label={<IntlMessages id="curriculum.content.video.title.label" />}
                  rules={[
                    { required: true, message: 'Vui lòng nhập tiêu đề video' },
                    { max: 200, message: 'Tiêu đề không được quá 200 ký tự' },
                  ]}
                >
                  <Input placeholder="Nhập tiêu đề video..." />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={<IntlMessages id="curriculum.content.video.description.label" />}
                >
                  <TextArea rows={3} placeholder="Nhập mô tả video..." showCount maxLength={500} />
                </Form.Item>

                <Form.Item
                  name="videoUrl"
                  label={<IntlMessages id="curriculum.content.video.url.label" />}
                  rules={[
                    { required: true, message: 'Vui lòng nhập URL video' },
                    { type: 'url', message: 'URL không hợp lệ' },
                  ]}
                >
                  <Input placeholder="https://www.youtube.com/watch?v=..." />
                </Form.Item>

                <Alert
                  message="Hỗ trợ video"
                  description="Hiện tại hỗ trợ YouTube URLs. Trong tương lai sẽ hỗ trợ upload video trực tiếp."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    <IntlMessages id="common.save" />
                  </Button>
                </Form.Item>
              </Form>

              {/* Video Preview */}
              {selectedLesson.hasVideo && selectedLesson.videoContent && (
                <>
                  <Divider>Video hiện tại</Divider>
                  <VideoPreview
                    videoUrl={selectedLesson.videoContent.videoUrl}
                    title={selectedLesson.videoContent.title}
                  />
                </>
              )}
            </TabPane>

            {/* Quiz Content Tab */}
            <TabPane
              tab={
                <span>
                  <QuestionCircleOutlined />
                  <IntlMessages id="curriculum.content.tabs.quiz" />
                  {selectedLesson.hasQuiz && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#faad14',
                        borderRadius: '50%',
                        marginLeft: '6px',
                      }}
                    />
                  )}
                </span>
              }
              key="quiz"
            >
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <QuestionCircleOutlined
                  style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }}
                />
                <Title level={4}>Quiz Management</Title>
                <Text type="secondary">
                  Quiz builder sẽ được implement trong phần Quiz Management tab.
                  <br />
                  Hiện tại bài học này có {selectedLesson.quizzes.length} quiz.
                </Text>
                {selectedLesson.quizzes.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <Button type="primary">Chuyển đến Quiz Management</Button>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Card>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <FileTextOutlined
              style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }}
            />
            <Title level={4} type="secondary">
              Chọn bài học để chỉnh sửa nội dung
            </Title>
            <Text type="secondary">
              Vui lòng chọn chương và bài học từ dropdown phía trên để bắt đầu soạn thảo nội dung.
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContentEditor;
