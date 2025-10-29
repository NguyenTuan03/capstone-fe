'use client';
import React, { useState } from 'react';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'NVA',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      courses: 'Pickleball cơ bản - Khóa 1',
      progress: 75,
      level: 'Beginner',
      age: 25,
      color: '#10b981',
      joinDate: '01/09/2025',
      totalSessions: 8,
      attendedSessions: 6,
      attendanceRate: 75,
      strengths: ['Phản xạ tốt', 'Thái độ học tập tích cực', 'Kỹ thuật cơ bản vững'],
      improvements: ['Cần cải thiện lực đánh', 'Tăng cường thể lực'],
      notes: 'Học viên tiến bộ nhanh, có tiềm năng phát triển',
      sessionHistory: [
        {
          id: 1,
          date: '05/10/2025',
          time: '14:00 - 15:00',
          sessionNumber: 1,
          topic: 'Kỹ thuật serve cơ bản',
          strengths: ['Serve đúng kỹ thuật', 'Tư thế đứng tốt'],
          improvements: ['Cần cải thiện độ chính xác', 'Tăng lực đánh'],
          notes: 'Học viên có nền tảng tốt, tiếp thu nhanh. Serve cơ bản đã ổn định.',
          homework: 'Thực hành 20 serve mỗi ngày vào các vị trí khác nhau',
          homeworkId: 'hw1',
          assignedVideos: ['video1'],
          assignedQuizzes: ['quiz1'],
          studentSubmissions: {
            videos: [
              {
                id: 'sub_vid_1',
                title: 'Video serve thực hành của Nguyễn Văn A',
                url: 'https://example.com/student-video-1',
                submittedAt: '2025-10-08T10:30:00',
                status: 'analyzed',
                aiAnalysis: {
                  strengths: [
                    'Động tác serve chuẩn',
                    'Tư thế đứng ổn định',
                    'Ném bóng đúng kỹ thuật',
                  ],
                  improvements: [
                    'Cần cải thiện độ cao bóng',
                    'Tăng tốc độ vung tay',
                    'Cải thiện độ chính xác',
                  ],
                  technicalScore: 7.5,
                  recommendations: [
                    'Tập trung vào việc ném bóng cao hơn 1-2 feet',
                    'Tăng tốc độ vung tay trong giai đoạn cuối',
                    'Thực hành serve vào 3 vị trí khác nhau',
                  ],
                  nextFocusAreas: ['Độ cao bóng', 'Tốc độ serve', 'Độ chính xác'],
                },
              },
            ],
            quizzes: [
              {
                id: 'sub_quiz_1',
                quizId: 'quiz1',
                score: 8,
                totalQuestions: 10,
                completedAt: '2025-10-08T14:20:00',
                answers: [
                  { questionId: 1, correct: true, timeSpent: 45 },
                  { questionId: 2, correct: false, timeSpent: 62 },
                  { questionId: 3, correct: true, timeSpent: 38 },
                ],
              },
            ],
          },
        },
        {
          id: 2,
          date: '07/10/2025',
          time: '14:00 - 15:00',
          sessionNumber: 2,
          topic: 'Kỹ thuật return',
          strengths: ['Phản xạ nhanh', 'Đọc bóng tốt'],
          improvements: ['Cần ổn định hơn', 'Tránh lỗi hỏng'],
          notes: 'Tiến bộ rõ rệt so với buổi 1. Return đã tự tin hơn.',
          homework: 'Tập với bạn, thực hành return các loại serve khác nhau',
          homeworkId: 'hw2',
          assignedVideos: ['video2'],
          assignedQuizzes: ['quiz2'],
          studentSubmissions: {
            videos: [
              {
                id: 'sub_vid_2',
                title: 'Video return thực hành của Nguyễn Văn A',
                url: 'https://example.com/student-video-2',
                submittedAt: '2025-10-10T16:45:00',
                status: 'pending_analysis',
              },
            ],
            quizzes: [
              {
                id: 'sub_quiz_2',
                quizId: 'quiz2',
                score: 9,
                totalQuestions: 8,
                completedAt: '2025-10-10T18:30:00',
                answers: [
                  { questionId: 1, correct: true, timeSpent: 35 },
                  { questionId: 2, correct: true, timeSpent: 42 },
                ],
              },
            ],
          },
        },
        {
          id: 3,
          date: '09/10/2025',
          time: '14:00 - 15:00',
          sessionNumber: 3,
          topic: 'Dink shot và volley',
          strengths: ['Dink shot chính xác', 'Volley ổn định'],
          improvements: ['Cần cải thiện di chuyển', 'Tăng tốc độ quyết định'],
          notes: 'Kỹ thuật mềm đã tốt hơn, cần thêm luyện tập về tình huống thực tế.',
          homework: 'Thực hành dink shot ở gần lưới',
        },
        {
          id: 4,
          date: '12/10/2025',
          time: '14:00 - 15:00',
          sessionNumber: 4,
          topic: 'Chiến thuật cơ bản',
          strengths: ['Hiểu chiến thuật', 'Phối hợp tốt'],
          improvements: ['Cải thiện giao tiếp', 'Tăng tốc độ di chuyển'],
          notes: 'Buổi tổng hợp tốt, học viên đã áp dụng được các kỹ thuật đã học.',
          homework: 'Xem video trận đấu, phân tích chiến thuật',
        },
        {
          id: 5,
          date: '14/10/2025',
          time: '14:00 - 15:00',
          sessionNumber: 5,
          topic: 'Thi đấu thực tế',
          strengths: ['Áp lực tốt', 'Tâm lý ổn định'],
          improvements: ['Cải thiện serve áp lực', 'Tăng consistency'],
          notes: 'Thi đấu tốt, tự tin hơn nhiều so với lúc đầu. Tiếp tục phát huy.',
          homework: 'Thi đấu thêm 2 trận/tuần',
        },
        {
          id: 6,
          date: '16/10/2025',
          time: '14:00 - 15:00',
          sessionNumber: 6,
          topic: 'Ôn tập và đánh giá',
          strengths: ['Toàn diện kỹ thuật', 'Tự tin'],
          improvements: ['Cần tăng cường thể lực', 'Cải thiện backhand'],
          notes: 'Hoàn thành tốt khóa học cơ bản. Sẵn sàng cho khóa nâng cao.',
          homework: 'Duy trì luyện tập 3 lần/tuần',
        },
      ],
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'TTB',
      email: 'tranthib@email.com',
      phone: '0909876543',
      courses: 'Kỹ thuật nâng cao - Khóa 1',
      progress: 60,
      level: 'Intermediate',
      age: 28,
      color: '#10b981',
      joinDate: '15/08/2025',
      totalSessions: 10,
      attendedSessions: 6,
      attendanceRate: 60,
      strengths: ['Kỹ thuật return tốt', 'Chiến thuật thông minh', 'Đọc trận nhạy bén'],
      improvements: ['Cần cải thiện serve', 'Tăng cường sức mạnh'],
      notes: 'Học viên có kinh nghiệm, cần tập trung vào các kỹ thuật nâng cao',
      sessionHistory: [
        {
          id: 1,
          date: '06/10/2025',
          time: '16:00 - 17:00',
          sessionNumber: 1,
          topic: 'Serve nâng cao',
          strengths: ['Serve spin tốt', 'Đặt bóng chính xác'],
          improvements: ['Cần tăng tốc độ', 'Serve 3 chưa ổn định'],
          notes: 'Nền tảng serve tốt, cần cải thiện consistency.',
          homework: 'Thực hành 50 serve mỗi loại mỗi ngày',
        },
        {
          id: 2,
          date: '08/10/2025',
          time: '16:00 - 17:00',
          sessionNumber: 2,
          topic: 'Return chuyên nghiệp',
          strengths: ['Return mạnh', 'Phản xạ xuất sắc'],
          improvements: ['Cải thiện return lob', 'Đọc bóng serve 3'],
          notes: 'Return rất tốt, tự tin trong các tình huống khó.',
          homework: 'Tập return với máy抛球',
        },
        {
          id: 3,
          date: '10/10/2025',
          time: '16:00 - 17:00',
          sessionNumber: 3,
          topic: 'Chiến thuật đôi',
          strengths: ['Phối hợp tốt', 'Giao tiếp hiệu quả'],
          improvements: ['Di chuyển ở sân đôi', 'Tình huống gấp'],
          notes: 'Hiểu chiến thuật đôi rất nhanh, cần thực hành nhiều hơn.',
          homework: 'Thi đấu đôi 3 lần/tuần',
        },
        {
          id: 4,
          date: '13/10/2025',
          time: '16:00 - 17:00',
          sessionNumber: 4,
          topic: 'Phân tích đối thủ',
          strengths: ['Nhận diện điểm yếu', 'Tấn công hiệu quả'],
          improvements: ['Phòng ngự tốt hơn', 'Kiên nhẫn hơn'],
          notes: 'Khả năng phân tích tốt, cần cải thiện sự kiên nhẫn.',
          homework: 'Xem và phân tích 5 trận đấu chuyên nghiệp',
        },
        {
          id: 5,
          date: '15/10/2025',
          time: '16:00 - 17:00',
          sessionNumber: 5,
          topic: 'Tâm lý thi đấu',
          strengths: ['Tâm lý ổn định', 'Tự tin'],
          improvements: ['Xử lý áp lực', 'Tập trung tốt hơn'],
          notes: 'Tâm lý tốt, cần luyện tập về sự tập trung dưới áp lực.',
          homework: 'Thực hành thi đấu với áp lực thời gian',
        },
        {
          id: 6,
          date: '17/10/2025',
          time: '16:00 - 17:00',
          sessionNumber: 6,
          topic: 'Tổng kết nâng cao',
          strengths: ['Kỹ thuật toàn diện', 'Chiến thuật tốt'],
          improvements: ['Consistency', 'Thể lực'],
          notes: 'Hoàn thành tốt khóa nâng cao. Sẵn sàng thi đấu.',
          homework: 'Duy trì luyện tập và tham gia giải đấu',
        },
      ],
    },
    {
      id: 3,
      name: 'Lê Minh C',
      avatar: 'LMC',
      email: 'leminhc@email.com',
      phone: '0905678901',
      courses: 'Chiến thuật thi đấu - Khóa 1',
      progress: 90,
      level: 'Advanced',
      age: 32,
      color: '#10b981',
      joinDate: '01/07/2025',
      totalSessions: 6,
      attendedSessions: 5,
      attendanceRate: 83,
      strengths: ['Kinh nghiệm thi đấu', 'Tâm lý vững vàng', 'Kỹ thuật toàn diện'],
      improvements: ['Cần cải thiện phối hợp đôi', 'Tăng tốc độ phản xạ'],
      notes: 'Học viên trình độ cao, có thể tham gia giải đấu',
      sessionHistory: [
        {
          id: 1,
          date: '07/10/2025',
          time: '09:00 - 10:00',
          sessionNumber: 1,
          topic: 'Chiến thuật sân đơn',
          strengths: ['Kiểm soát sân tốt', 'Tấn công thông minh'],
          improvements: ['Di chuyển tiết kiệm', 'Tăng sức mạnh'],
          notes: 'Rất kinh nghiệm, chỉ cần tinh chỉnh chiến thuật.',
          homework: 'Thi đấu đơn 3 lần/tuần',
        },
        {
          id: 2,
          date: '09/10/2025',
          time: '09:00 - 10:00',
          sessionNumber: 2,
          topic: 'Chiến thuật sân đôi',
          strengths: ['Phối hợp tốt', 'Đọc bạn đồng đội'],
          improvements: ['Giao tiếp nhiều hơn', 'Di chuyển đôi'],
          notes: 'Phối hợp tốt, cần cải thiện giao tiếp trong trận đấu.',
          homework: 'Thi đấu đôi với các đối thủ khác nhau',
        },
        {
          id: 3,
          date: '11/10/2025',
          time: '09:00 - 10:00',
          sessionNumber: 3,
          topic: 'Phân tích video',
          strengths: ['Nhận diện lỗi', 'Đề xuất giải pháp'],
          improvements: ['Tập trung hơn', 'Kiên nhẫn'],
          notes: 'Khả năng phân tích rất tốt, có thể làm coach trợ lý.',
          homework: 'Phân tích 10 trận đấu của các tay vợt hàng đầu',
        },
        {
          id: 4,
          date: '14/10/2025',
          time: '09:00 - 10:00',
          sessionNumber: 4,
          topic: 'Tình huống match point',
          strengths: ['Tâm lý thép', 'Quyết định dứt khoát'],
          improvements: ['Quản lý năng lượng', 'Chiến thuật thay thế'],
          notes: 'Rất tự tin trong tình huống quyết định, tâm lý vững.',
          homework: 'Thực hành các tình huống match point',
        },
        {
          id: 5,
          date: '16/10/2025',
          time: '09:00 - 10:00',
          sessionNumber: 5,
          topic: 'Thi đấu giả lập',
          strengths: ['Thích ứng nhanh', 'Chiến thuật linh hoạt'],
          improvements: ['Thể lực bền bỉ', 'Phục hồi nhanh'],
          notes: 'Thi đấu rất thông minh, đọc trận tốt.',
          homework: 'Tăng cường luyện tập thể lực',
        },
        {
          id: 6,
          date: '18/10/2025',
          time: '09:00 - 10:00',
          sessionNumber: 6,
          topic: 'Đánh giá và tư vấn',
          strengths: ['Trình độ chuyên nghiệp', 'Kinh nghiệm dày dặn'],
          improvements: ['Cập nhật kỹ thuật mới', 'Tập thể lực đều đặn'],
          notes: 'Sẵn sàng tham gia các giải đấu cấp thành phố.',
          homework: 'Chuẩn bị cho giải đấu sắp tới',
        },
      ],
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      avatar: 'PTD',
      email: 'phamthid@email.com',
      phone: '0902345678',
      courses: 'Pickleball trẻ em - Khóa 1',
      progress: 80,
      level: 'Beginner',
      age: 12,
      color: '#10b981',
      joinDate: '10/09/2025',
      totalSessions: 12,
      attendedSessions: 10,
      attendanceRate: 83,
      strengths: ['Học hỏi nhanh', 'Năng động', 'Phối hợp tốt'],
      improvements: ['Cần tăng cường thể lực', 'Cải thiện kỹ thuật serve'],
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      avatar: 'HVE',
      email: 'hoangvane@email.com',
      phone: '0905678901',
      courses: 'Pickleball cơ bản - Khóa 2',
      progress: 45,
      level: 'Beginner',
      age: 35,
      color: '#10b981',
      joinDate: '20/09/2025',
      totalSessions: 8,
      attendedSessions: 4,
      attendanceRate: 50,
      strengths: ['Thái độ học tập tốt', 'Kiên trì'],
      improvements: ['Cần cải thiện phản xạ', 'Tăng cường thể lực tổng thể'],
    },
    {
      id: 6,
      name: 'Vũ Thị G',
      avatar: 'VTG',
      email: 'vuthig@email.com',
      phone: '0903456789',
      courses: 'Camp Pickleball - Khóa 1',
      progress: 100,
      level: 'Intermediate',
      age: 30,
      color: '#10b981',
      joinDate: '01/06/2025',
      totalSessions: 5,
      attendedSessions: 5,
      attendanceRate: 100,
      strengths: ['Thể lực tốt', 'Kỹ thuật toàn diện', 'Tinh thần đồng đội'],
      improvements: ['Cần cải thiện kỹ thuật thi đấu áp lực'],
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return '#93c5fd';
      case 'Intermediate':
        return '#93c5fd';
      case 'Advanced':
        return '#93c5fd';
      default:
        return '#93c5fd';
    }
  };
  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          marginBottom: '30px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            color: '#1a1a1a',
            marginBottom: '8px',
            fontWeight: '700',
          }}
        >
          Quản lý học viên ({students.length})
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px',
        }}
      >
        {students.map((student) => (
          <div
            key={student.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: student.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  flexShrink: 0,
                }}
              >
                {student.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '6px',
                  }}
                >
                  {student.name}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: getLevelColor(student.level),
                    color: '#1e40af',
                  }}
                >
                  {student.level}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '6px',
                }}
              >
                Email: {student.email}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '6px',
                }}
              >
                SĐT: {student.phone}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                }}
              >
                Khóa học: {student.courses}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    fontWeight: '500',
                  }}
                >
                  Tiến độ:
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#1a1a1a',
                    fontWeight: '600',
                  }}
                >
                  {student.attendanceRate}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e5e5',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${student.progress}%`,
                    height: '100%',
                    backgroundColor: '#10b981',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onClick={() => {
                setSelectedStudent(student);
                setIsModalOpen(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedStudent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: selectedStudent.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600',
                  }}
                >
                  {selectedStudent.avatar}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedStudent.name}
                  </h2>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#666',
                    }}
                  >
                    {selectedStudent.courses}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#666',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e5e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px',
                }}
              >
                {/* Thông tin cá nhân */}
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '20px',
                    }}
                  >
                    Thông tin cá nhân
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Tuổi:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.age} tuổi
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Email:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.email}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>SĐT:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.phone}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Ngày tham gia:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.joinDate}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Trình độ:</span>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: getLevelColor(selectedStudent.level),
                          color: '#1e40af',
                        }}
                      >
                        {selectedStudent.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thông tin học tập */}
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      marginBottom: '20px',
                    }}
                  >
                    Thông tin học tập
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Tổng số buổi:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.totalSessions} buổi
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Đã tham gia:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.attendedSessions} buổi
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Tỷ lệ điểm danh:</span>
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                        {selectedStudent.attendanceRate}%
                      </span>
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ fontSize: '14px', color: '#666' }}>Tiến độ khóa học:</span>
                        <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>
                          {selectedStudent.progress}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#e5e5e5',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${selectedStudent.progress}%`,
                            height: '100%',
                            backgroundColor: '#10b981',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div
                style={{
                  marginTop: '32px',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  👁 Xem chi tiết các buổi học
                </button>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }}
                >
                  Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
