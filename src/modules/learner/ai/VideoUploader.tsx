import React from 'react';
import { Upload, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { Text } = Typography;

interface VideoUploaderProps {
  onFileUpload: (file: File) => void;
  id: string;
  title: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileUpload, id, title }) => {
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'video/*',
    beforeUpload: (file) => {
      onFileUpload(file);
      return false;
    },
    showUploadList: false,
    maxCount: 1,
  };

  return (
    <Dragger {...uploadProps} style={{ background: '#1a1f3a', borderColor: '#2a2f4a' }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: '#13c2c2', fontSize: 48 }} />
      </p>
      <p className="ant-upload-text" style={{ color: '#ffffff', fontSize: 16 }}>
        {title}
      </p>
      <Text type="secondary" style={{ color: '#8c8fa5' }}>
        Nhấp hoặc kéo thả video vào đây để tải lên
      </Text>
      <br />
      <Text type="secondary" style={{ color: '#6b6d80', fontSize: 12 }}>
        Hỗ trợ: MP4, MOV, AVI (tối đa 50MB)
      </Text>
    </Dragger>
  );
};

export default VideoUploader;
