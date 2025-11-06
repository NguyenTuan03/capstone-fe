'use client';
import React, { useState } from 'react';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const LearnerExercises = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['LEARNER'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    COACH: '/summary',
  });
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'result'

  // Mock data - Bài tập của học viên
  const exercises = [
    {
      id: 1,
      title: 'Bài tập 1: Serve cơ bản',
      description: 'Thực hiện 10 cú serve và quay video. Chú ý tư thế cầm vợt và follow-through.',
      courseTitle: 'Pickleball cơ bản - Khóa 1',
      coachName: 'HLV Nguyễn Văn A',
      coachVideo: 'coach-serve-demo.mp4',
      deadline: '2025-11-01',
      daysLeft: 8,
      status: 'submitted', // 'pending', 'submitted', 'graded'
      submittedAt: '2025-10-25 14:30',
      submittedVideo: 'my-serve-video.mp4',
      hasResult: true,
    },
    {
      id: 2,
      title: 'Bài tập 2: Return nâng cao',
      description: 'Thực hành return với 5 tình huống khác nhau. Tập trung vào footwork và timing.',
      courseTitle: 'Kỹ thuật nâng cao - Khóa 1',
      coachName: 'HLV Trần Thị B',
      coachVideo: null,
      deadline: '2025-11-05',
      daysLeft: 12,
      status: 'pending',
      submittedAt: null,
      submittedVideo: null,
      hasResult: false,
    },
    {
      id: 3,
      title: 'Bài tập 3: Chiến thuật đôi',
      description: 'Quay video thi đấu đôi 10 phút. Thể hiện kỹ năng phối hợp và di chuyển.',
      courseTitle: 'Chiến thuật đôi - Khóa 3',
      coachName: 'HLV Phạm Thị D',
      coachVideo: 'coach-doubles-demo.mp4',
      deadline: '2025-10-28',
      daysLeft: 4,
      status: 'pending',
      submittedAt: null,
      submittedVideo: null,
      hasResult: false,
    },
  ];

  // Mock data - Kết quả chấm bài
  const exerciseResult = {
    exerciseId: 1,
    totalScore: 7.5,
    status: 'Đạt yêu cầu',
    gradedAt: '2025-10-26 10:00',
    coachFeedback:
      'Bạn đã thực hiện khá tốt! Tư thế cầm vợt đúng và có sự tiến bộ rõ rệt. Tuy nhiên cần chú ý đến việc hoàn thiện động tác follow-through. Hãy tiếp tục luyện tập và giữ vững phong độ này nhé!',
    aiAnalysis: {
      summary:
        'Tư thế tốt nhưng cần cải thiện follow-through. Điểm mạnh là grip và stance, điểm cần phát triển là completion của động tác.',
      details: [
        {
          aspect: 'Tư thế cầm vợt',
          score: 8,
          coach: 'Cầm vợt với grip chắc chắn, cổ tay thẳng',
          learner: 'Grip đúng, cổ tay hơi cong nhẹ',
          feedback: 'Rất tốt! Chỉ cần chú ý giữ cổ tay thẳng hơn một chút',
        },
        {
          aspect: 'Footwork',
          score: 7,
          coach: 'Di chuyển nhanh, bước chân rộng',
          learner: 'Bước chân hợp lý nhưng tốc độ chưa cao',
          feedback: 'Tăng tốc độ di chuyển, tập luyện agility drills',
        },
        {
          aspect: 'Follow-through',
          score: 6,
          coach: 'Vung vợt đầy đủ, kết thúc cao',
          learner: 'Vung vợt chưa hoàn thiện, dừng giữa chừng',
          feedback: 'Đây là điểm cần cải thiện nhất. Hãy hoàn tất động tác vung vợt',
        },
        {
          aspect: 'Tư thế sẵn sàng',
          score: 8,
          coach: 'Stance rộng, trọng tâm thấp',
          learner: 'Stance tốt, trọng tâm ổn định',
          feedback: 'Xuất sắc! Giữ vững tư thế này',
        },
      ],
    },
  };

  const handleVideoUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedVideo(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Đã nộp bài thành công!');
      setViewMode('list');
      setUploadedVideo(null);
    }, 2000);
  };

  const ExerciseCard = ({ exercise }: any = {}) => {
    const getStatusConfig = () => {
      switch (exercise.status) {
        case 'submitted':
          return exercise.hasResult
            ? { color: '#52c41a', bg: '#f6ffed', text: '✓ Đã chấm', icon: '✓' }
            : { color: '#1890ff', bg: '#e6f7ff', text: '⏳ Chờ chấm', icon: '⏳' };
        case 'pending':
          return { color: '#fa8c16', bg: '#fff7e6', text: '📝 Chưa nộp', icon: '📝' };
        default:
          return { color: '#722ed1', bg: '#f9f0ff', text: '📄 Bài tập', icon: '📄' };
      }
    };

    const statusConfig = getStatusConfig();

    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '12px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
              >
                <span style={{ fontSize: '24px' }}>📝</span>
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    margin: 0,
                    color: '#1a1a1a',
                    lineHeight: '1.3',
                  }}
                >
                  {exercise.title}
                </h3>
                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      background: statusConfig.bg,
                      color: statusConfig.color,
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: `1px solid ${statusConfig.color}20`,
                    }}
                  >
                    {statusConfig.icon} {statusConfig.text}
                  </span>
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: '16px',
                color: '#666',
                marginBottom: '20px',
                lineHeight: '1.6',
                paddingLeft: '52px',
              }}
            >
              {exercise.description}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingLeft: '52px',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  color: '#0369a1',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid #bae6fd',
                }}
              >
                📚 {exercise.courseTitle}
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  color: '#92400e',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid #fbbf24',
                }}
              >
                👨‍🏫 {exercise.coachName}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            paddingTop: '20px',
            borderTop: '2px solid #f0f0f0',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  background:
                    exercise.daysLeft <= 3
                      ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                      : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  color: exercise.daysLeft <= 3 ? '#dc2626' : '#0369a1',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: `1px solid ${exercise.daysLeft <= 3 ? '#fca5a5' : '#bae6fd'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>⏰</span>
                <span>Còn {exercise.daysLeft} ngày</span>
              </div>
              <span
                style={{
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Hạn: {exercise.deadline}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {exercise.hasResult && (
                <button
                  onClick={() => {
                    setSelectedExercise(exercise);
                    setViewMode('result');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(82, 196, 26, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.3)';
                  }}
                >
                  📊 Xem Kết Quả
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedExercise(exercise);
                  setViewMode('detail');
                }}
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
                }}
              >
                {exercise.status === 'pending' ? '📤 Nộp Bài' : '👁️ Chi Tiết'}
              </button>
            </div>
          </div>

          {/* Quick preview coach video */}
          {exercise.coachVideo && (
            <div
              style={{
                background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                border: '2px solid #bae6fd',
                borderRadius: '16px',
                padding: '20px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                      padding: '8px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🎥</span>
                  </div>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1890ff',
                    }}
                  >
                    Video Hướng Dẫn từ HLV
                  </span>
                </div>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                  }}
                >
                  Bắt buộc xem
                </span>
              </div>
              <div
                style={{
                  background: '#1a1a1a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <video controls style={{ width: '100%', maxHeight: '300px' }}>
                  <source src={exercise.coachVideo} type="video/mp4" />
                </video>
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: '#1890ff',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '500',
                }}
              >
                <span>💡</span>
                <span>Xem kỹ video mẫu của HLV trước khi thực hiện bài tập</span>
              </p>
            </div>
          )}
          {!exercise.coachVideo && (
            <div
              style={{
                background: 'linear-gradient(135deg, #fff7e6 0%, #fef3c7 100%)',
                border: '2px solid #fbbf24',
                borderRadius: '16px',
                padding: '20px',
                marginTop: '16px',
              }}
            >
              <p
                style={{
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  margin: 0,
                }}
              >
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span>HLV chưa tải lên video hướng dẫn cho bài tập này</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <div className="min-h-screen">
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {viewMode === 'list' && (
          <>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                      padding: '8px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>📊</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1890ff' }}>
                      {exercises.length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
                      Tổng bài tập
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </>
        )}

        {viewMode === 'detail' && selectedExercise && (
          <div>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1890ff',
                background: 'rgba(24, 144, 255, 0.1)',
                border: '1px solid rgba(24, 144, 255, 0.2)',
                padding: '12px 20px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(24, 144, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              ← Quay lại danh sách
            </button>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ marginBottom: '32px' }}>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    margin: 0,
                    marginBottom: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {selectedExercise?.title}
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: '#666',
                    marginBottom: '24px',
                    lineHeight: '1.6',
                  }}
                >
                  {selectedExercise.description}
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
                >
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      color: '#0369a1',
                      padding: '12px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    📚 {selectedExercise.courseTitle}
                  </span>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      color: '#92400e',
                      padding: '12px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '1px solid #fbbf24',
                    }}
                  >
                    👨‍🏫 {selectedExercise.coachName}
                  </span>
                  <span
                    style={{
                      background:
                        selectedExercise.daysLeft <= 3
                          ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                          : 'linear-gradient(135deg, #fff7e6 0%, #fef3c7 100%)',
                      color: selectedExercise.daysLeft <= 3 ? '#dc2626' : '#d97706',
                      padding: '12px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: `1px solid ${selectedExercise.daysLeft <= 3 ? '#fca5a5' : '#fbbf24'}`,
                    }}
                  >
                    ⏰ Còn {selectedExercise.daysLeft} ngày (Hạn: {selectedExercise.deadline})
                  </span>
                </div>
              </div>

              {/* Coach Video */}
              <div style={{ marginBottom: '32px' }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                    borderRadius: '20px 20px 0 0',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(24, 144, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          padding: '12px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <span style={{ fontSize: '32px' }}>🎥</span>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            margin: 0,
                            marginBottom: '4px',
                          }}
                        >
                          Video Hướng Dẫn từ Huấn Luyện Viên
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: 0,
                            fontWeight: '500',
                          }}
                        >
                          Xem kỹ video này trước khi thực hiện bài tập của bạn
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1890ff',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      ⚠️ BẮT BUỘC XEM
                    </span>
                  </div>
                </div>
                {selectedExercise.coachVideo ? (
                  <div
                    style={{
                      background: 'white',
                      border: '2px solid #1890ff',
                      borderRadius: '0 0 20px 20px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(24, 144, 255, 0.2)',
                    }}
                  >
                    <div style={{ background: '#1a1a1a' }}>
                      <video controls style={{ width: '100%' }}>
                        <source src={selectedExercise.coachVideo} type="video/mp4" />
                      </video>
                    </div>
                    <div
                      style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                        borderTop: '1px solid #bae6fd',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                            padding: '8px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>💡</span>
                        </div>
                        <div>
                          <h4
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1890ff',
                              margin: 0,
                              marginBottom: '12px',
                            }}
                          >
                            Lưu ý khi xem video:
                          </h4>
                          <ul
                            style={{
                              margin: 0,
                              padding: 0,
                              listStyle: 'none',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            {[
                              'Xem video nhiều lần để nắm rõ kỹ thuật',
                              'Chú ý đến tư thế, động tác và thời điểm thực hiện',
                              'Tạm dừng video ở các điểm quan trọng để quan sát kỹ',
                              'Luyện tập theo đúng mẫu trước khi quay video nộp bài',
                            ].map((item, index) => (
                              <li
                                key={index}
                                style={{
                                  fontSize: '14px',
                                  color: '#1890ff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontWeight: '500',
                                }}
                              >
                                <span
                                  style={{
                                    background: '#1890ff',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {index + 1}
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #fff7e6 0%, #fef3c7 100%)',
                      border: '2px solid #fbbf24',
                      borderRadius: '0 0 20px 20px',
                      padding: '32px',
                      textAlign: 'center',
                      boxShadow: '0 4px 16px rgba(251, 191, 36, 0.2)',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <h4
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#d97706',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      Chưa có Video Hướng Dẫn
                    </h4>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#d97706',
                        margin: 0,
                        fontWeight: '500',
                      }}
                    >
                      HLV chưa tải lên video mẫu cho bài tập này. Vui lòng liên hệ HLV để được hướng
                      dẫn.
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              {selectedExercise.status === 'pending' && (
                <div style={{ marginBottom: '32px' }}>
                  <h3
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      margin: 0,
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#1a1a1a',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                        padding: '8px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>📤</span>
                    </div>
                    <span>Nộp Bài Tập của Bạn</span>
                  </h3>

                  {!uploadedVideo ? (
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '280px',
                        border: '3px dashed #1890ff',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)';
                        e.currentTarget.style.borderColor = '#40a9ff';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)';
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '20px',
                        }}
                      >
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📹</div>
                        <p
                          style={{
                            margin: 0,
                            marginBottom: '8px',
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1890ff',
                          }}
                        >
                          Tải lên Video của bạn
                        </p>
                        <p
                          style={{
                            margin: 0,
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#1890ff',
                            fontWeight: '500',
                          }}
                        >
                          hoặc kéo và thả vào đây
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#40a9ff',
                            fontWeight: '500',
                          }}
                        >
                          MP4, MOV, AVI tối đa 100MB
                        </p>
                      </div>
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        accept="video/*"
                        onChange={handleVideoUpload}
                      />
                    </label>
                  ) : (
                    <div
                      style={{
                        border: '3px solid #52c41a',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(82, 196, 26, 0.2)',
                      }}
                    >
                      <video
                        controls
                        src={URL.createObjectURL(uploadedVideo)}
                        style={{ width: '100%', background: '#1a1a1a' }}
                      />
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)',
                          padding: '20px',
                          borderTop: '1px solid #b7eb8f',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: 0,
                                marginBottom: '4px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#52c41a',
                              }}
                            >
                              ✓ Video đã sẵn sàng
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '14px',
                                color: '#52c41a',
                                fontWeight: '500',
                              }}
                            >
                              📁 {uploadedVideo.name}
                            </p>
                          </div>
                          <button
                            onClick={() => setUploadedVideo(null)}
                            style={{
                              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              padding: '8px 16px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            🗑️ Xóa video
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadedVideo && (
                    <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                          flex: 1,
                          background: isSubmitting
                            ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                            : 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                          color: 'white',
                          padding: '16px 32px',
                          borderRadius: '16px',
                          border: 'none',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          boxShadow: isSubmitting
                            ? '0 4px 12px rgba(156, 163, 175, 0.3)'
                            : '0 6px 20px rgba(82, 196, 26, 0.4)',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(82, 196, 26, 0.5)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(82, 196, 26, 0.4)';
                          }
                        }}
                      >
                        {isSubmitting ? '⏳ Đang nộp bài...' : '✓ Nộp Bài Tập'}
                      </button>
                      <button
                        onClick={() => setUploadedVideo(null)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '2px solid #d1d5db',
                          padding: '16px 32px',
                          borderRadius: '16px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          color: '#374151',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                          e.currentTarget.style.borderColor = '#9ca3af';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Already Submitted */}
              {selectedExercise.status === 'submitted' && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                  <h3 className="font-semibold text-xl text-blue-800 mb-3">✓ Đã Nộp Bài</h3>
                  <p className="text-blue-700 mb-4">
                    Bạn đã nộp bài vào lúc: <strong>{selectedExercise.submittedAt}</strong>
                  </p>
                  <div className="bg-white rounded-lg overflow-hidden">
                    <video controls className="w-full">
                      <source src={selectedExercise.submittedVideo} type="video/mp4" />
                    </video>
                  </div>
                  <p className="text-sm text-blue-600 mt-4">
                    ⏳ Huấn luyện viên đang chấm bài của bạn. Kết quả sẽ được thông báo sớm!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'result' && selectedExercise && exerciseResult && (
          <div>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1890ff',
                background: 'rgba(24, 144, 255, 0.1)',
                border: '1px solid rgba(24, 144, 255, 0.2)',
                padding: '12px 20px',
                borderRadius: '12px',
                marginBottom: '24px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(24, 144, 255, 0.15)';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              ← Quay lại danh sách
            </button>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: '32px' }}>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    margin: 0,
                    marginBottom: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {selectedExercise.title}
                </h2>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
                >
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      color: '#0369a1',
                      padding: '12px 20px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    📚 {selectedExercise.courseTitle}
                  </span>
                  <span
                    style={{
                      color: '#666',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    Chấm bài: {exerciseResult.gradedAt}
                  </span>
                </div>
              </div>

              {/* Score Summary */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  color: 'white',
                  marginBottom: '32px',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    fontSize: '72px',
                    fontWeight: '700',
                    margin: 0,
                    marginBottom: '8px',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {exerciseResult.totalScore}/10
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: 0,
                    marginBottom: '8px',
                  }}
                >
                  {exerciseResult.status}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500',
                  }}
                >
                  Chúc mừng! Bạn đã hoàn thành tốt bài tập
                </div>
              </div>

              {/* Videos Comparison */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                    <span>👨‍🏫</span>
                    <span>Video Huấn luyện viên</span>
                  </h4>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <video controls className="w-full">
                      <source src={selectedExercise.coachVideo} type="video/mp4" />
                    </video>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                    <span>👤</span>
                    <span>Video của bạn</span>
                  </h4>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <video controls className="w-full">
                      <source src={selectedExercise.submittedVideo} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>

              {/* Coach Feedback */}
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2">
                  <span>✍️</span>
                  <span>Nhận Xét từ Huấn Luyện Viên</span>
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {exerciseResult.coachFeedback}
                </p>
              </div>

              {/* AI Analysis */}
              <div className="bg-white border-2 rounded-xl overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    <span>🤖</span>
                    <span>Phân Tích Chi Tiết từ AI</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">📋 Tóm tắt</h4>
                    <p className="text-gray-700">{exerciseResult.aiAnalysis.summary}</p>
                  </div>

                  <div className="space-y-4">
                    {exerciseResult.aiAnalysis.details.map((detail, index) => (
                      <div key={index} className="border-2 rounded-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-bold text-lg text-gray-800">{detail.aspect}</h5>
                          <div
                            className={`px-4 py-2 rounded-full font-bold text-lg ${
                              detail.score >= 8
                                ? 'bg-green-100 text-green-800'
                                : detail.score >= 6
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {detail.score}/10
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-xs text-blue-700 font-semibold mb-2">
                              👨‍🏫 HUẤN LUYỆN VIÊN
                            </div>
                            <p className="text-sm text-gray-700">{detail.coach}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-xs text-green-700 font-semibold mb-2">👤 BẠN</div>
                            <p className="text-sm text-gray-700">{detail.learner}</p>
                          </div>
                        </div>
                        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                          <div className="text-xs text-orange-800 font-semibold mb-2">
                            💡 NHẬN XÉT
                          </div>
                          <p className="text-sm text-gray-700">{detail.feedback}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
                >
                  ✓ Hoàn Tất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerExercises;
