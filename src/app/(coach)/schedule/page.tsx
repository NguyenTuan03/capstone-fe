'use client';
import React, { useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
  FileTextOutlined,
  RightOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const SchedulePage = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [selectedCompletedSession, setSelectedCompletedSession] = useState<any>(null);
  const [selectedSessionForAttendance, setSelectedSessionForAttendance] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: boolean }>({});
  const [attendanceNotes, setAttendanceNotes] = useState<{ [key: string]: string }>({});
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState<string>('');
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [selectedCourseToReschedule, setSelectedCourseToReschedule] = useState<any>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: '',
    newTime: '',
    reason: '',
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);

  const canAccessAssignments = (sessionId: number) => {
    return sessionId % 2 === 1;
  };

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const upcomingSessions = [
    {
      id: 1,
      student: 'Nguyễn Văn A',
      time: '14:00 - 15:00',
      date: 'Hôm nay',
      isOnline: true,
      level: 'Beginner',
      avatar: 'NVA',
      courseName: 'Pickleball cơ bản',
      studentsInClass: 4,
      studentsList: ['Nguyễn Văn A', 'Trần Văn B', 'Lê Thị C', 'Phạm Văn D'],
    },
    {
      id: 2,
      student: 'Trần Thị B',
      time: '16:00 - 17:00',
      date: 'Hôm nay',
      isOnline: false,
      level: 'Intermediate',
      avatar: 'TTB',
      courseName: 'Kỹ thuật nâng cao',
      studentsInClass: 2,
      studentsList: ['Trần Thị B', 'Nguyễn Thị E'],
    },
    {
      id: 3,
      student: 'Lê Minh C',
      time: '09:00 - 10:00',
      date: 'Ngày mai',
      isOnline: true,
      level: 'Advanced',
      avatar: 'LMC',
      courseName: 'Chiến thuật thi đấu',
      studentsInClass: 1,
      studentsList: ['Lê Minh C'],
    },
    {
      id: 4,
      student: 'Phạm Thị D',
      time: '15:00 - 16:00',
      date: 'Ngày mai',
      isOnline: false,
      level: 'Beginner',
      avatar: 'PTD',
      courseName: 'Pickleball cơ bản',
      studentsInClass: 4,
      studentsList: ['Phạm Thị D', 'Hoàng Văn F', 'Vũ Thị G', 'Đỗ Văn H'],
    },
  ];
  const completedSessions = [
    {
      id: 1,
      courseName: 'Pickleball cơ bản',
      date: '05/10/2025',
      time: '14:00 - 15:00',
      studentsInClass: 4,
      quiz: {
        title: 'Quiz: Kỹ thuật serve cơ bản',
        totalQuestions: 10,
        completed: 4,
        averageScore: 8.5,
        studentResults: [
          {
            studentName: 'Nguyễn Văn A',
            avatar: 'NVA',
            score: 7,
            completedAt: '05/10/2025 15:30',
            timeSpent: '12 phút',
            answers: [
              { question: 1, correct: true, time: 45 },
              { question: 2, correct: false, time: 62 },
              { question: 3, correct: true, time: 38 },
              { question: 4, correct: true, time: 55 },
              { question: 5, correct: true, time: 41 },
              { question: 6, correct: false, time: 70 },
              { question: 7, correct: true, time: 33 },
              { question: 8, correct: false, time: 48 },
              { question: 9, correct: true, time: 52 },
              { question: 10, correct: true, time: 44 },
            ],
          },
          {
            studentName: 'Trần Văn B',
            avatar: 'TVB',
            score: 9,
            completedAt: '05/10/2025 15:45',
            timeSpent: '10 phút',
            answers: [
              { question: 1, correct: true, time: 35 },
              { question: 2, correct: true, time: 42 },
              { question: 3, correct: true, time: 38 },
              { question: 4, correct: true, time: 40 },
              { question: 5, correct: true, time: 36 },
              { question: 6, correct: true, time: 45 },
              { question: 7, correct: true, time: 32 },
              { question: 8, correct: true, time: 41 },
              { question: 9, correct: true, time: 39 },
              { question: 10, correct: false, time: 55 },
            ],
          },
          {
            studentName: 'Lê Thị C',
            avatar: 'LTC',
            score: 8,
            completedAt: '05/10/2025 16:00',
            timeSpent: '11 phút',
            answers: [
              { question: 1, correct: true, time: 40 },
              { question: 2, correct: true, time: 48 },
              { question: 3, correct: true, time: 35 },
              { question: 4, correct: false, time: 65 },
              { question: 5, correct: true, time: 42 },
              { question: 6, correct: true, time: 38 },
              { question: 7, correct: true, time: 36 },
              { question: 8, correct: true, time: 44 },
              { question: 9, correct: false, time: 58 },
              { question: 10, correct: true, time: 41 },
            ],
          },
          {
            studentName: 'Phạm Văn D',
            avatar: 'PVD',
            score: 6,
            completedAt: '05/10/2025 16:15',
            timeSpent: '15 phút',
            answers: [
              { question: 1, correct: false, time: 75 },
              { question: 2, correct: true, time: 55 },
              { question: 3, correct: false, time: 82 },
              { question: 4, correct: true, time: 48 },
              { question: 5, correct: false, time: 68 },
              { question: 6, correct: true, time: 52 },
              { question: 7, correct: false, time: 78 },
              { question: 8, correct: true, time: 45 },
              { question: 9, correct: true, time: 50 },
              { question: 10, correct: false, time: 72 },
            ],
          },
        ],
      },
      coachVideos: [
        {
          id: 1,
          title: 'Demo kỹ thuật serve đúng chuẩn',
          duration: '5:30',
          views: 4,
        },
        {
          id: 2,
          title: 'Lỗi thường gặp khi serve',
          duration: '3:45',
          views: 4,
        },
      ],
      assignments: [
        { id: 1, title: 'Luyện tập serve 50 lần', submitted: 3, total: 4 },
        {
          id: 2,
          title: 'Ghi video serve của bản thân',
          submitted: 4,
          total: 4,
        },
      ],
      studentNotes: [
        {
          studentName: 'Nguyễn Văn A',
          avatar: 'NVA',
          attended: true,
          coachNote:
            'Cần cải thiện tư thế đứng khi serve. Đã có tiến bộ về di chuyển nhưng vẫn còn chậm.',
          quizScore: 7,
          assignmentsCompleted: 2,
          videoSubmitted: true,
          aiScore: 6.5,
          aiSuggestions: [
            'Tư thế đứng chưa chuẩn - chân cần rộng hơn',
            'Động tác tay vung hơi nhanh',
          ],
          strengths: ['Động tác chuẩn bị tốt', 'Follow-through ổn'],
        },
        {
          studentName: 'Trần Văn B',
          avatar: 'TVB',
          attended: true,
          coachNote: 'Tiến bộ rất tốt! Kỹ thuật serve đã chuẩn hơn nhiều so với tuần trước.',
          quizScore: 9,
          assignmentsCompleted: 2,
          videoSubmitted: true,
          aiScore: 8.5,
          aiSuggestions: ['Có thể tăng tốc độ vung tay để tạo spin nhiều hơn'],
          strengths: ['Tư thế chuẩn', 'Timing chính xác', 'Follow-through hoàn chỉnh'],
        },
        {
          studentName: 'Lê Thị C',
          avatar: 'LTC',
          attended: true,
          coachNote: 'Học rất nhanh và tập trung cao. Tư thế cầm vợt đã chuẩn ngay từ đầu.',
          quizScore: 8,
          assignmentsCompleted: 2,
          videoSubmitted: true,
          aiScore: 7.8,
          aiSuggestions: ['Lực đánh có thể nhẹ hơn để tăng độ chính xác'],
          strengths: ['Tư thế tốt', 'Động tác mượt mà', 'Tập trung cao'],
        },
        {
          studentName: 'Phạm Văn D',
          avatar: 'PVD',
          attended: true,
          coachNote: 'Cần luyện tập nhiều hơn về độ chính xác. Động tác còn cứng.',
          quizScore: 6,
          assignmentsCompleted: 1,
          videoSubmitted: true,
          aiScore: 5.5,
          aiSuggestions: ['Động tác còn cứng - cần thư giãn', 'Cần luyện tập thêm về timing'],
          strengths: ['Có cố gắng', 'Grip cầm vợt đúng'],
        },
      ],
      completedTopics: ['Kỹ thuật serve', 'Tư thế cầm vợt', 'Di chuyển cơ bản'],
      sessionNote: 'Buổi học tập trung vào kỹ thuật serve cơ bản. Học viên đều rất tích cực.',
    },
    {
      id: 2,
      courseName: 'Kỹ thuật nâng cao',
      date: '04/10/2025',
      time: '16:00 - 17:00',
      studentsInClass: 2,
      quiz: {
        title: 'Quiz: Return nâng cao',
        totalQuestions: 8,
        completed: 2,
        averageScore: 9.0,
      },
      coachVideos: [{ id: 1, title: 'Kỹ thuật return topspin', duration: '6:20', views: 2 }],
      assignments: [{ id: 1, title: 'Luyện return 100 quả', submitted: 2, total: 2 }],
      studentNotes: [
        {
          studentName: 'Trần Thị B',
          avatar: 'TTB',
          attended: true,
          coachNote: 'Xuất sắc! Đã cải thiện đáng kể kỹ thuật return.',
          quizScore: 9,
          assignmentsCompleted: 1,
          videoSubmitted: true,
          aiScore: 9.0,
          aiSuggestions: ['Có thể thử thêm góc đánh đa dạng hơn'],
          strengths: ['Phản xạ xuất sắc', 'Timing hoàn hảo', 'Footwork tốt'],
        },
        {
          studentName: 'Nguyễn Thị E',
          avatar: 'NTE',
          attended: true,
          coachNote: 'Kỹ thuật tốt nhưng cần chú ý timing.',
          quizScore: 8,
          assignmentsCompleted: 1,
          videoSubmitted: true,
          aiScore: 7.5,
          aiSuggestions: ['Timing cần chính xác hơn', 'Chú ý tốc độ bóng'],
          strengths: ['Kỹ thuật cơ bản tốt', 'Tập trung cao'],
        },
      ],
      completedTopics: ['Return nâng cao', 'Footwork'],
      sessionNote: 'Buổi học về return nâng cao rất hiệu quả.',
    },
    {
      id: 3,
      courseName: 'Chiến thuật thi đấu đôi',
      date: '01/10/2025',
      time: '09:00 - 10:00',
      studentsInClass: 1,
      quiz: {
        title: 'Quiz: Chiến thuật cơ bản',
        totalQuestions: 5,
        completed: 1,
        averageScore: 10,
      },
      coachVideos: [{ id: 1, title: 'Phối hợp trong đôi', duration: '8:00', views: 1 }],
      assignments: [],
      studentNotes: [
        {
          studentName: 'Lê Minh C',
          avatar: 'LMC',
          attended: true,
          coachNote: 'Buổi học 1-1 rất hiệu quả. Nắm vững chiến thuật.',
          quizScore: 10,
          assignmentsCompleted: 0,
          videoSubmitted: true,
          aiScore: 9.2,
          aiSuggestions: ['Giao tiếp với đồng đội cần tốt hơn trong áp lực'],
          strengths: ['Đọc trận xuất sắc', 'Phản xạ nhanh', 'Di chuyển tốt'],
        },
      ],
      completedTopics: ['Chiến thuật di chuyển đôi', 'Phân công vị trí'],
      sessionNote: 'Buổi học cá nhân rất chất lượng.',
    },
    {
      id: 4,
      courseName: 'Pickleball cơ bản',
      date: '03/10/2025',
      time: '14:00 - 15:00',
      studentsInClass: 4,
      quiz: {
        title: 'Quiz: Volley & Dink',
        totalQuestions: 8,
        completed: 3,
        averageScore: 7.3,
      },
      coachVideos: [{ id: 1, title: 'Volley cơ bản', duration: '4:50', views: 3 }],
      assignments: [{ id: 1, title: 'Luyện dink 30 phút', submitted: 2, total: 3 }],
      studentNotes: [
        {
          studentName: 'Nguyễn Văn A',
          avatar: 'NVA',
          attended: false,
          coachNote: '',
        },
        {
          studentName: 'Trần Văn B',
          avatar: 'TVB',
          attended: true,
          coachNote: 'Rất tốt với kỹ thuật volley. Dink shot còn cần điều chỉnh lực.',
          quizScore: 8,
          assignmentsCompleted: 1,
          videoSubmitted: true,
          aiScore: 7.5,
          aiSuggestions: ['Dink cần nhẹ tay hơn'],
          strengths: ['Volley tốt', 'Phản xạ nhanh'],
        },
        {
          studentName: 'Lê Thị C',
          avatar: 'LTC',
          attended: true,
          coachNote: 'Tiếp thu volley rất nhanh. Dink shot khá tốt.',
          quizScore: 7,
          assignmentsCompleted: 1,
          videoSubmitted: true,
          aiScore: 7.2,
          aiSuggestions: ['Độ chính xác khi đặt bóng gần lưới'],
          strengths: ['Học nhanh', 'Chuyên chú'],
        },
        {
          studentName: 'Phạm Văn D',
          avatar: 'PVD',
          attended: true,
          coachNote: 'Cần cải thiện vị trí đứng khi ở lưới.',
          quizScore: 6,
          assignmentsCompleted: 0,
          videoSubmitted: false,
          aiScore: 0,
          aiSuggestions: [],
          strengths: [],
        },
      ],
      completedTopics: ['Volley cơ bản', 'Dink shot', 'Vị trí đứng tại lưới'],
      sessionNote: 'Giới thiệu kỹ thuật volley và dink. Có 1 học viên vắng.',
    },
    {
      id: 3,
      courseName: 'Chiến thuật thi đấu đôi',
      date: '01/10/2025',
      time: '09:00 - 10:00',
      studentsInClass: 1,
      studentNotes: [
        {
          studentName: 'Lê Minh C',
          avatar: 'LMC',
          attended: true,
          coachNote:
            'Buổi học 1-1 rất hiệu quả. Học viên đã nắm vững chiến thuật di chuyển và phối hợp trong thi đấu đôi. Khả năng đọc trận rất tốt, phán đoán chính xác. Cần luyện tập thêm về kỹ năng giao tiếp với đồng đội trong tình huống áp lực cao.',
        },
      ],
      completedTopics: ['Chiến thuật di chuyển đôi', 'Phân công vị trí', 'Giao tiếp trong trận'],
      sessionNote:
        'Buổi học cá nhân rất chất lượng. Học viên có tiềm năng thi đấu cấp độ cao, rất tập trung và tiếp thu nhanh.',
    },
    {
      id: 2, // Even ID - will show as locked
      courseName: 'Kỹ thuật nâng cao',
      date: '04/10/2025',
      time: '16:00 - 17:00',
      studentsInClass: 2,
      quiz: {
        title: 'Quiz: Spin & Slice',
        totalQuestions: 8,
        completed: 0,
        averageScore: 0,
      },
      coachVideos: [{ id: 1, title: 'Kỹ thuật spin', duration: '6:30', views: 0 }],
      assignments: [
        { id: 1, title: 'Luyện spin 50 quả', submitted: 0, total: 2 },
        { id: 2, title: 'Video thực hành slice', submitted: 0, total: 2 },
      ],
      studentNotes: [
        {
          studentName: 'Mai Thị I',
          avatar: 'MTI',
          attended: true,
          coachNote: 'Buổi học đang chờ hoàn thành - chưa thể làm bài tập',
          quizScore: undefined,
          assignmentsCompleted: 0,
          videoSubmitted: false,
          aiScore: undefined,
        },
        {
          studentName: 'Trương Văn K',
          avatar: 'TVK',
          attended: true,
          coachNote: 'Buổi học đang chờ hoàn thành - chưa thể làm bài tập',
          quizScore: undefined,
          assignmentsCompleted: 0,
          videoSubmitted: false,
          aiScore: undefined,
        },
      ],
      completedTopics: ['Spin cơ bản', 'Slice technique'],
      sessionNote: 'Buổi học đang chờ coach xác nhận hoàn thành.',
    },
    {
      id: 4,
      courseName: 'Pickleball cơ bản',
      date: '03/10/2025',
      time: '14:00 - 15:00',
      studentsInClass: 4,
      studentNotes: [
        {
          studentName: 'Nguyễn Văn A',
          avatar: 'NVA',
          attended: false,
          coachNote: '',
        },
        {
          studentName: 'Trần Văn B',
          avatar: 'TVB',
          attended: true,
          coachNote:
            'Rất tốt với kỹ thuật volley. Phản xạ nhanh và vị trí đứng đúng. Dink shot còn cần điều chỉnh về lực đánh nhẹ hơn.',
        },
        {
          studentName: 'Lê Thị C',
          avatar: 'LTC',
          attended: true,
          coachNote:
            'Tiếp thu kỹ thuật volley rất nhanh. Dink shot khá tốt, cần luyện tập thêm về độ chính xác khi đặt bóng gần lưới.',
        },
        {
          studentName: 'Phạm Văn D',
          avatar: 'PVD',
          attended: true,
          coachNote:
            'Cần cải thiện vị trí đứng khi ở lưới. Động tác volley còn chưa tự tin, nên luyện tập nhiều hơn để có phản xạ tốt hơn.',
        },
      ],
      completedTopics: ['Volley cơ bản', 'Dink shot', 'Vị trí đứng tại lưới'],
      sessionNote:
        'Giới thiệu kỹ thuật volley và dink. Học viên rất hào hứng. Có 1 học viên vắng. Cần có thêm bài tập thực hành cho buổi sau.',
    },
  ];

  const handleAttendance = (session: any) => {
    const sessionDateTime = new Date(`${session.date} ${session.time}`);
    const now = new Date();
    const hoursSinceSession = (now.getTime() - sessionDateTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceSession > 24) {
      alert(
        `❌ Đã quá thời hạn điểm danh!\n\nBuổi học ngày ${session.date} (${session.time}) đã kết thúc hơn 24 giờ.\n\nTheo quy định, điểm danh phải được hoàn thành trong vòng 24 giờ sau buổi học.\nBuổi học này sẽ không được thanh toán do không điểm danh đúng hạn.`,
      );
      return;
    }

    setSelectedSessionForAttendance(session);

    const initialAttendance: { [key: string]: boolean } = {};
    const initialNotes: { [key: string]: string } = {};

    if (session.studentNotes) {
      session.studentNotes.forEach((student: any) => {
        initialAttendance[student.studentName] = student.attended || false;
        initialNotes[student.studentName] = student.coachNote || '';
      });
    } else if (session.studentsList) {
      session.studentsList.forEach((studentName: string) => {
        initialAttendance[studentName] = false;
        initialNotes[studentName] = '';
      });
    }

    setAttendanceData(initialAttendance);
    setAttendanceNotes(initialNotes);
    setSessionTopics([]);
    setNewTopic('');
    setShowAttendanceModal(true);
  };

  const handleReschedule = async (course: any) => {
    setSelectedCourseToReschedule(course);
    setRescheduleForm({
      newDate: '',
      newTime: '',
      reason: '',
    });
    setShowRescheduleModal(true);
  };
  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', margin: '24px' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          padding: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
            }}
          >
            Lịch dạy tháng 10/2025
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <button
              style={{
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'white',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              Hôm nay
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day, idx) => (
            <div
              key={idx}
              className="text-center font-semibold text-gray-700 py-2 border-b-2 border-gray-200"
            >
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === 6;
            const hasSessions = [1, 3, 5, 6, 8, 10, 12, 15, 17, 19, 22, 24, 26].includes(dayNum);

            const baseStyle: React.CSSProperties = {
              minHeight: '8rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              backgroundColor: dayNum > 31 ? '#f9fafb' : '#fff',
              color: dayNum > 31 ? '#d1d5db' : '#374151',
            };

            const todayStyle: React.CSSProperties = isToday
              ? {
                  border: '2px solid #10b981',
                  backgroundColor: '#ecfdf5',
                }
              : {};

            const combinedStyle = { ...baseStyle, ...todayStyle };

            return (
              <div
                key={i}
                style={combinedStyle}
                onMouseEnter={(e) => {
                  if (dayNum <= 31) {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 2px 8px rgba(16, 185, 129, 0.4)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = isToday
                    ? '#10b981'
                    : '#e5e7eb';
                }}
              >
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: isToday ? '#059669' : '#374151',
                  }}
                >
                  {dayNum <= 31 ? dayNum : ''}
                </div>

                {hasSessions && dayNum <= 31 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: '#d1fae5',
                        color: '#047857',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={
                        (e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#a7f3d0') // emerald-200
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.backgroundColor = '#d1fae5')
                      }
                    >
                      14:00 • {dayNum % 3 === 0 ? '4' : dayNum % 2 === 0 ? '2' : '1'}
                      HV
                    </div>

                    {[5, 12, 19, 26].includes(dayNum) && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#dbeafe',
                          color: '#1d4ed8',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = '#bfdbfe')
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor = '#dbeafe')
                        }
                      >
                        16:00 • 2HV
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Buổi học hôm nay
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingSessions
              .filter((s) => s.date === 'Hôm nay')
              .map((session) => {
                const isToday = session.date === 'Hôm nay';
                return (
                  <div
                    key={session.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.boxShadow =
                        '0 3px 8px rgba(0,0,0,0.1)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
                    }
                    onClick={() => setSelectedSession(session)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <h4
                            style={{
                              fontWeight: 600,
                              color: '#1f2937',
                            }}
                          >
                            {session.courseName}
                          </h4>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: '#dbeafe',
                              color: '#2563eb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 500,
                            }}
                          >
                            {session.studentsInClass} người
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <ClockCircleOutlined style={{ fontSize: 14, marginRight: 4 }} />
                          {session.time}
                        </p>

                        {session.studentsInClass > 1 && (
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px',
                            }}
                          >
                            {session.studentsList.slice(0, 3).map((student, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                {student}
                              </span>
                            ))}
                            {session.studentsList.length > 3 && (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#6b7280',
                                }}
                              >
                                +{session.studentsList.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttendance(session);
                          }}
                          style={{
                            padding: '8px',
                            color: '#16a34a',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = '#dcfce7')
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')
                          }
                          title="Điểm danh"
                        >
                          <CheckCircleOutlined style={{ fontSize: 16, color: '#16A34A' }} />
                        </button>

                        {!isToday && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReschedule(session);
                            }}
                            style={{
                              padding: '8px',
                              color: '#2563eb',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLElement).style.backgroundColor = '#eff6ff')
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.backgroundColor =
                                'transparent')
                            }
                            title="Đổi lịch học"
                          >
                            <CalendarOutlined style={{ fontSize: 16, color: '#2563EB' }} />
                          </button>
                        )}

                        <RightOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Buổi học ngày mai
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingSessions
              .filter((s) => s.date === 'Ngày mai')
              .map((session) => {
                const isToday = session.date === 'Hôm nay';
                return (
                  <div
                    key={session.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.boxShadow =
                        '0 3px 8px rgba(0,0,0,0.1)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
                    }
                    onClick={() => setSelectedSession(session)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '8px',
                          }}
                        >
                          <h4
                            style={{
                              fontWeight: 600,
                              color: '#1f2937',
                            }}
                          >
                            {session.courseName}
                          </h4>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: '#dbeafe',
                              color: '#2563eb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 500,
                            }}
                          >
                            {session.studentsInClass} người
                          </span>
                        </div>

                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <ClockCircleOutlined style={{ fontSize: 14, marginRight: '4px' }} />
                          {session.time}
                        </p>

                        {session.studentsInClass > 1 && (
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px',
                            }}
                          >
                            {session.studentsList.slice(0, 3).map((student, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                {student}
                              </span>
                            ))}
                            {session.studentsList.length > 3 && (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#6b7280',
                                }}
                              >
                                +{session.studentsList.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttendance(session);
                          }}
                          style={{
                            padding: '8px',
                            color: '#16a34a',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = '#dcfce7')
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')
                          }
                          title="Điểm danh"
                        >
                          <CheckCircleOutlined style={{ fontSize: 16, color: '#16a34a' }} />
                        </button>

                        {!isToday && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReschedule(session);
                            }}
                            style={{
                              padding: '8px',
                              color: '#2563eb',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLElement).style.backgroundColor = '#eff6ff')
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.backgroundColor =
                                'transparent')
                            }
                            title="Đổi lịch học"
                          >
                            <CalendarOutlined style={{ fontSize: 16, color: '#2563EB' }} />
                          </button>
                        )}

                        <RightOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {selectedSession && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  margin: 0,
                }}
              >
                {selectedSession.courseName}
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#4B5563')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
              >
                <CloseOutlined style={{ fontSize: 22 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                      Ngày học
                    </p>
                    <p style={{ fontWeight: 600 }}>{selectedSession.date}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                      Thời gian
                    </p>
                    <p style={{ fontWeight: 600 }}>{selectedSession.time}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                      Số học viên
                    </p>
                    <p style={{ fontWeight: 600 }}>{selectedSession.studentsInClass} người</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                      Trình độ
                    </p>
                    <p style={{ fontWeight: 600 }}>{selectedSession.level}</p>
                  </div>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  Danh sách học viên
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedSession.studentsList.map((student: string, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#10B981',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        {student
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, margin: 0 }}>{student}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSession.isOnline && (
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <VideoCameraOutlined style={{ color: '#2563EB', fontSize: 20, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontWeight: 600,
                          color: '#1E3A8A',
                          marginBottom: '4px',
                          marginTop: 0,
                        }}
                      >
                        Tham gia Online
                      </h4>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#1D4ED8',
                          marginBottom: '12px',
                        }}
                      >
                        Một số học viên sẽ tham gia qua video call do không thể đến sân
                      </p>
                      <button
                        onClick={() => {
                          setSelectedSession(null);
                          setActiveTab('videos');
                          setVideoCallActive(true);
                        }}
                        style={{
                          backgroundColor: '#2563EB',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                      >
                        <VideoCameraOutlined style={{ fontSize: 20, marginRight: 5 }} />
                        Vào lớp Online
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                }}
              >
                <button
                  onClick={() => setSelectedSession(null)}
                  style={{
                    border: '1px solid #D1D5DB',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  Đóng
                </button>
                <button
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                >
                  <EditOutlined style={{ marginRight: '8px' }} />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          padding: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '16px',
          }}
        >
          Buổi học đã hoàn thành gần đây
        </h3>

        <div>
          {completedSessions.slice(0, 4).map((session) => (
            <div
              key={session.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              onClick={() => setSelectedCompletedSession(session)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0,
                      }}
                    >
                      {session.courseName}
                    </h4>
                    <span
                      style={{
                        fontSize: '12px',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      Hoàn thành
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#4b5563',
                      marginBottom: '8px',
                    }}
                  >
                    {session.date} • {session.time}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#4b5563',
                    }}
                  >
                    <span>
                      {session.studentNotes.filter((n) => n.attended).length}/
                      {session.studentsInClass} có mặt
                    </span>
                    <span>•</span>
                    <span>{session.completedTopics.length} chủ đề</span>
                  </div>
                </div>

                <RightOutlined
                  style={{
                    color: '#9ca3af',
                    fontSize: '16px',
                    marginTop: '8px',
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCompletedSession && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={() => setSelectedCompletedSession(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              maxWidth: '1000px',
              width: '100%',
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '24px',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                  }}
                >
                  {selectedCompletedSession.courseName}
                </h3>
                <p style={{ color: '#4b5563', marginTop: '4px' }}>
                  {selectedCompletedSession.date} • {selectedCompletedSession.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedCompletedSession(null)}
                style={{
                  color: '#9ca3af',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <CloseOutlined style={{ fontSize: 22 }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', margin: '8px 0 0 24px' }}>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor: selectedCompletedSession.id % 2 === 0 ? '#dcfce7' : '#dbeafe',
                  color: selectedCompletedSession.id % 2 === 0 ? '#166534' : '#1e40af',
                }}
              >
                {selectedCompletedSession.id % 2 === 0 ? 'Đã hoàn thành' : 'Sắp diễn ra'}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  border: '1px solid',
                  borderColor: canAccessAssignments(selectedCompletedSession.id)
                    ? '#bbf7d0'
                    : '#fde68a',
                  backgroundColor: canAccessAssignments(selectedCompletedSession.id)
                    ? '#f0fdf4'
                    : '#fefce8',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: canAccessAssignments(selectedCompletedSession.id)
                          ? '#22c55e'
                          : '#eab308',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {canAccessAssignments(selectedCompletedSession.id) ? (
                        <CheckCircleOutlined style={{ color: 'white', fontSize: 16 }} />
                      ) : (
                        <ClockCircleOutlined style={{ color: 'white', fontSize: 16 }} />
                      )}
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: '14px',
                          color: canAccessAssignments(selectedCompletedSession.id)
                            ? '#14532d'
                            : '#854d0e',
                          margin: 0,
                        }}
                      >
                        {canAccessAssignments(selectedCompletedSession.id)
                          ? 'Buổi học đã hoàn thành'
                          : 'Đang chờ hoàn thành'}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: canAccessAssignments(selectedCompletedSession.id)
                            ? '#166534'
                            : '#a16207',
                          margin: 0,
                        }}
                      >
                        {canAccessAssignments(selectedCompletedSession.id)
                          ? 'Học viên có thể làm bài tập và nộp video'
                          : 'Học viên cần hoàn thành buổi học trước khi làm bài tập'}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      backgroundColor: canAccessAssignments(selectedCompletedSession.id)
                        ? '#dcfce7'
                        : '#fef9c3',
                      color: canAccessAssignments(selectedCompletedSession.id)
                        ? '#15803d'
                        : '#a16207',
                    }}
                  >
                    {canAccessAssignments(selectedCompletedSession.id) ? '✓ Đã mở' : '🔒 Đã khóa'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1e3a8a',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileTextOutlined />
                  Ghi chú chung về buổi học:
                </p>
                <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                  {selectedCompletedSession.sessionNote}
                </p>
              </div>

              <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Nội dung đã học:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedCompletedSession.completedTopics.map((topic: any, idx: any) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: '24px',
                borderTop: '1px solid #e5e7eb',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setSelectedCompletedSession(null)}
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
              <button
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <EditOutlined style={{ marginRight: '8px' }} />
                Chỉnh sửa ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
