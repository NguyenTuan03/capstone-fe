'use client';

import React from 'react';
import { Card, Badge } from 'antd';
import { VideoCameraOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import Image from 'next/image';

const renderAIAnalysis = () => {
  // Common styles
  const containerStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px',
  };
  const cardTitleStyle = {
    fontSize: '16px',
    display: 'flex' as const,
    alignItems: 'center' as const,
  };
  const videoIconStyle = { height: '20px', width: '20px', marginRight: '8px', color: '#9333ea' };
  const cardContentStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px',
  };
  const infoBoxStyle = { backgroundColor: '#faf5ff', padding: '16px', borderRadius: '8px' };
  const titleStyle = { fontWeight: '500', color: '#581c87', marginBottom: '8px' };
  const listStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '8px',
    fontSize: '14px',
    color: '#6b21a8',
  };
  const listItemStyle = { display: 'flex' as const, alignItems: 'center' as const };
  const bulletStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#9333ea',
    borderRadius: '50%',
    marginRight: '8px',
  };

  // Analysis results styles
  const resultsTitleStyle = {
    fontSize: '16px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  };
  const countStyle = { fontSize: '12px', color: '#6b7280', fontWeight: 'normal' };
  const resultItemStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  };
  const resultContentStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '12px',
  };
  const thumbnailStyle = {
    width: '64px',
    height: '64px',
    backgroundColor: '#e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden' as const,
  };
  const imageStyle = { width: '100%', height: '100%', objectFit: 'cover' as const };
  const resultInfoStyle = { flex: 1 };
  const resultTitleStyle = { fontWeight: '500', fontSize: '14px', marginBottom: '4px' };
  const dateStyle = { fontSize: '12px', color: '#6b7280', marginBottom: '8px' };
  const badgeContainerStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
  };
  const scoreContainerStyle = { textAlign: 'right' as const };
  const scoreStyle = { fontSize: '24px', fontWeight: 'bold', color: '#16a34a' };
  const scoreLabelStyle = { fontSize: '12px', color: '#6b7280' };

  // Badge styles
  const successBadgeStyle = {
    color: '#15803d',
    backgroundColor: '#dcfce7',
    fontSize: '12px',
    border: '1px solid #bbf7d0',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'flex' as const,
    alignItems: 'center' as const,
  };
  const warningBadgeStyle = {
    color: '#a16207',
    backgroundColor: '#fef3c7',
    fontSize: '12px',
    border: '1px solid #fde68a',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'flex' as const,
    alignItems: 'center' as const,
  };
  const iconStyle = { height: '12px', width: '12px', marginRight: '4px' };
  const techniqueStyle = { fontSize: '12px', color: '#6b7280' };

  // Detailed analysis styles
  const detailBoxStyle = {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
  };
  const detailTitleStyle = { fontWeight: '500', color: '#1e3a8a', marginBottom: '12px' };
  const detailListStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '12px',
  };
  const detailItemStyle = { borderLeft: '4px solid #3b82f6', paddingLeft: '12px' };
  const detailItemYellowStyle = { borderLeft: '4px solid #eab308', paddingLeft: '12px' };
  const detailItemTitleStyle = { fontSize: '14px', fontWeight: '500', color: '#111827' };
  const detailTextStyle = { fontSize: '12px', color: '#4b5563', marginTop: '4px' };
  const tagsContainerStyle = {
    marginTop: '8px',
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '4px',
  };
  const tagStyle = { fontSize: '12px', padding: '4px 8px', borderRadius: '4px' };
  const greenTagStyle = { ...tagStyle, backgroundColor: '#dcfce7', color: '#15803d' };
  const yellowTagStyle = { ...tagStyle, backgroundColor: '#fef3c7', color: '#a16207' };
  const redTagStyle = { ...tagStyle, backgroundColor: '#fee2e2', color: '#dc2626' };

  return (
    <div style={containerStyle}>
      <Card
        title={
          <div style={cardTitleStyle}>
            <VideoCameraOutlined style={videoIconStyle} />
            Phân tích kỹ thuật bằng AI
          </div>
        }
      >
        <div style={cardContentStyle}>
          <div style={infoBoxStyle}>
            <h4 style={titleStyle}>AI có thể phân tích:</h4>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <div style={bulletStyle}></div>
                Kỹ thuật giao bóng (serve)
              </li>
              <li style={listItemStyle}>
                <div style={bulletStyle}></div>
                Cú đánh trái (forehand)
              </li>
              <li style={listItemStyle}>
                <div style={bulletStyle}></div>
                Cú đánh phải (backhand)
              </li>
              <li style={listItemStyle}>
                <div style={bulletStyle}></div>
                Volley ở gần lưới
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* AI Analysis Results */}
      <Card
        title={
          <div style={resultsTitleStyle}>
            <span>Video đã phân tích</span>
            <span style={countStyle}>2 video</span>
          </div>
        }
      >
        <div style={cardContentStyle}>
          <div style={resultItemStyle}>
            <div style={resultContentStyle}>
              <div style={thumbnailStyle}>
                <Image
                  src="https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2024/07/1200/675/pickleball-paddle-court.jpg?ve=1&tl=1"
                  alt="Forehand Analysis"
                  style={imageStyle}
                  width={64}
                  height={64}
                />
              </div>
              <div style={resultInfoStyle}>
                <h4 style={resultTitleStyle}>Phân tích Forehand</h4>
                <p style={dateStyle}>2 ngày trước</p>
                <div style={badgeContainerStyle}>
                  <span style={successBadgeStyle}>
                    <CheckCircleOutlined style={iconStyle} />
                    Hoàn thành
                  </span>
                  <span style={techniqueStyle}>Kỹ thuật: Forehand</span>
                </div>
              </div>
            </div>
            <div style={scoreContainerStyle}>
              <div style={scoreStyle}>85%</div>
              <div style={scoreLabelStyle}>Điểm số</div>
            </div>
          </div>

          <div style={resultItemStyle}>
            <div style={resultContentStyle}>
              <div style={thumbnailStyle}>
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4StMq4jMrFoO5JU3dNwnlckEdorqhSmoaUw&s"
                  alt="Serve Analysis"
                  style={imageStyle}
                  width={64}
                  height={64}
                />
              </div>
              <div style={resultInfoStyle}>
                <h4 style={resultTitleStyle}>Phân tích Serve</h4>
                <p style={dateStyle}>5 ngày trước</p>
                <div style={badgeContainerStyle}>
                  <span style={warningBadgeStyle}>
                    <TrophyOutlined style={iconStyle} />
                    Cần cải thiện
                  </span>
                  <span style={techniqueStyle}>Kỹ thuật: Serve</span>
                </div>
              </div>
            </div>
            <div style={scoreContainerStyle}>
              <div style={{ ...scoreStyle, color: '#ca8a04' }}>72%</div>
              <div style={scoreLabelStyle}>Điểm số</div>
            </div>
          </div>

          {/* Detailed Analysis Results */}
          <div style={detailBoxStyle}>
            <h5 style={detailTitleStyle}>Chi tiết phân tích gần đây</h5>
            <div style={detailListStyle}>
              <div style={detailItemStyle}>
                <h6 style={detailItemTitleStyle}>Forehand Analysis</h6>
                <p style={detailTextStyle}>
                  <strong>Điểm mạnh:</strong> Tư thế ổn định, điểm tiếp xúc tốt, lực đánh phù hợp.
                </p>
                <p style={detailTextStyle}>
                  <strong>Cần cải thiện:</strong> Theo vợt sau khi đánh, di chuyển chân tốt hơn.
                </p>
                <div style={tagsContainerStyle}>
                  <span style={greenTagStyle}>Tư thế: 90%</span>
                  <span style={greenTagStyle}>Lực: 85%</span>
                  <span style={yellowTagStyle}>Độ chính xác: 80%</span>
                </div>
              </div>

              <div style={detailItemYellowStyle}>
                <h6 style={detailItemTitleStyle}>Serve Analysis</h6>
                <p style={detailTextStyle}>
                  <strong>Điểm mạnh:</strong> Động tác ném bóng ổn định.
                </p>
                <p style={detailTextStyle}>
                  <strong>Cần cải thiện:</strong> Kiểm soát độ cao, kỹ thuật quỹ đạo, lực mạnh hơn.
                </p>
                <div style={tagsContainerStyle}>
                  <span style={greenTagStyle}>Động tác: 80%</span>
                  <span style={yellowTagStyle}>Độ chính xác: 70%</span>
                  <span style={redTagStyle}>Lực: 65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AIPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1f2937' }}>
        AI Coach Dashboard
      </h1>
      {renderAIAnalysis()}
    </div>
  );
};

export default AIPage;
