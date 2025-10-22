import React, { useState } from 'react';
import { Row, Col, Card, Button, Typography, Tag, Alert, Space } from 'antd';
import { PlayCircleOutlined, FilterOutlined } from '@ant-design/icons';

import { CombinedAnalysisResult } from '@/@crema/types/models/AI';
import * as geminiService from '@/@crema/services/apis/ai/geminiService';
import { extractFrames } from '@/@crema/utils/video';
import VideoUploader from './VideoUploader';
import LoadingSpinner from './LoadingSpinner';
import { CombinedAnalysisView } from './AnalysisResultView';

const { Title, Text } = Typography;

const VideoAnalysis: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [results, setResults] = useState<CombinedAnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const handleFileUpload = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(videoFile);
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = resolve;
      });

      const middleTime = videoElement.duration / 2;
      URL.revokeObjectURL(videoElement.src);

      const timestamps = [
        middleTime - 0.2,
        middleTime - 0.1,
        middleTime,
        middleTime + 0.1,
        middleTime + 0.2,
      ].filter((t) => t > 0 && t < videoElement.duration);

      const frames = await extractFrames(videoFile, timestamps);
      const analysisResult = await geminiService.analyzeVideo(frames);

      setResults((prevResults) => [analysisResult, ...prevResults]);
      setVideoFile(null);
      setVideoUrl(null);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        if (err.message.includes('load video')) {
          setError('Lỗi khi tải video. Vui lòng đảm bảo đó là tệp video hợp lệ và thử lại.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shotTypes = ['All', ...Array.from(new Set(results.map((r) => r.shotType)))];
  const filteredResults =
    activeFilter === 'All' ? results : results.filter((r) => r.shotType === activeFilter);

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            style={{ background: '#1a1f3a', borderColor: '#2a2f4a' }}
            bodyStyle={{ padding: 24 }}
          >
            <Title level={4} style={{ color: '#ffffff', marginBottom: 16 }}>
              Tải lên Video
            </Title>
            {!videoFile && (
              <VideoUploader
                onFileUpload={handleFileUpload}
                id="video-analysis-upload"
                title="Tải lên một video"
              />
            )}
            {videoUrl && (
              <div style={{ marginBottom: 16 }}>
                <video
                  controls
                  src={videoUrl}
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    backgroundColor: '#000',
                  }}
                />
                <Text type="secondary" style={{ display: 'block', marginTop: 8, color: '#8c8fa5' }}>
                  Tệp: {videoFile?.name}
                </Text>
              </div>
            )}
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleAnalyze}
              disabled={!videoFile || isLoading}
              loading={isLoading}
              block
              size="large"
              style={{
                background: '#13c2c2',
                borderColor: '#13c2c2',
                height: 48,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {isLoading ? 'Đang phân tích...' : 'Phân tích Video'}
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            style={{
              background: '#1a1f3a',
              borderColor: '#2a2f4a',
              minHeight: 400,
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Title level={4} style={{ color: '#ffffff', marginBottom: 16 }}>
              Phân tích từ AI
            </Title>

            {isLoading && <LoadingSpinner />}
            {error && <Alert message={error} type="error" showIcon />}

            {results.length > 0 && !isLoading && (
              <div style={{ marginBottom: 24 }}>
                <Space style={{ marginBottom: 12 }}>
                  <FilterOutlined style={{ color: '#8c8fa5' }} />
                  <Text style={{ color: '#8c8fa5', fontSize: 13 }}>Lọc theo loại cú đánh</Text>
                </Space>
                <Space wrap>
                  {shotTypes.map((type) => (
                    <Tag
                      key={type}
                      color={activeFilter === type ? 'cyan' : 'default'}
                      onClick={() => setActiveFilter(type)}
                      style={{
                        cursor: 'pointer',
                        padding: '4px 12px',
                        fontSize: 13,
                        borderRadius: 16,
                      }}
                    >
                      {type}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            {!isLoading && filteredResults.length > 0 && (
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {filteredResults.map((result, index) => (
                  <CombinedAnalysisView key={index} data={result} />
                ))}
              </Space>
            )}

            {!isLoading && !error && results.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <Text type="secondary" style={{ color: '#8c8fa5' }}>
                  Tải lên một video và nhấp vào &quot;Phân tích Video&quot; để xem phản hồi từ AI.
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VideoAnalysis;
