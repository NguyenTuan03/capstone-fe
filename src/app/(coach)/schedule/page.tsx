'use client';
import React, { useState } from 'react';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EditOutlined,
  EyeFilled,
  FileTextOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';

const SchedulePage = () => {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [activeSessionTab, setActiveSessionTab] = useState('attendance');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [selectedCompletedSession, setSelectedCompletedSession] = useState<any>(null);
  const [selectedSessionForAttendance, setSelectedSessionForAttendance] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: boolean }>({});
  const [attendanceNotes, setAttendanceNotes] = useState<{ [key: string]: string }>({});
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<any>(null);
  const [sessionTopics, setSessionTopics] = useState<string[]>([]);
  const [showStudentDetailModal, setShowStudentDetailModal] = useState(false);
  const [newTopic, setNewTopic] = useState<string>('');
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [selectedCourseToReschedule, setSelectedCourseToReschedule] = useState<any>(null);
  const [showSessionQuizModal, setShowSessionQuizModal] = useState(false);
  const [selectedSessionForQuiz, setSelectedSessionForQuiz] = useState<any>(null);
  const [showSessionVideoModal, setShowSessionVideoModal] = useState(false);
  const [selectedSessionForVideo, setSelectedSessionForVideo] = useState<any>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: '',
    newTime: '',
    reason: '',
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  type SessionManagementState = {
    assignments: any[];
    quizzes: any[];
    videos: any[];
    selectedAssignments: any[];
    selectedQuizzes: any[];
    selectedVideos: any[];
  };

  const [sessionManagement, setSessionManagement] = useState<SessionManagementState>({
    assignments: [],
    quizzes: [],
    videos: [],
    selectedAssignments: [],
    selectedQuizzes: [],
    selectedVideos: [],
  });
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [selectedSessionForHomework, setSelectedSessionForHomework] = useState<any>(null);

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTopic.trim()) {
      e.preventDefault();
      const topic = newTopic.trim();
      if (!sessionTopics.includes(topic)) {
        setSessionTopics((prev) => [...prev, topic]);
      }
      setNewTopic('');
    }
  };
  const handleTopicInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTopic(e.target.value);
  };
  const handleRemoveTopic = (topicToRemove: string) => {
    setSessionTopics((prev) => prev.filter((topic) => topic !== topicToRemove));
  };
  const handleStudentDetail = (student: any) => {
    setSelectedStudentForDetail(student);
    setShowStudentDetailModal(true);
  };
  const toggleAttendance = (studentName: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentName]: !prev[studentName],
    }));
  };
  const updateAttendanceNote = (studentName: string, note: string) => {
    setAttendanceNotes((prev) => ({
      ...prev,
      [studentName]: note,
    }));
  };

  const canAccessAssignments = (sessionId: number) => {
    return sessionId % 2 === 1;
  };

  const calculateSessionPayment = (session: any, presentStudents: number) => {
    const baseRate = session.baseRate || 500000; // Default 500k per session
    const perStudentRate = baseRate / session.maxStudents;
    const totalPayment = perStudentRate * presentStudents;

    return {
      baseRate,
      perStudentRate,
      presentStudents,
      totalPayment,
      formatted: new Intl.NumberFormat('vi-VN').format(totalPayment) + 'đ',
    };
  };

  const handleAttendanceSubmit = () => {
    if (!selectedSessionForAttendance) return;

    // Check if still within 24h deadline
    const sessionDateTime = new Date(
      `${selectedSessionForAttendance.date} ${selectedSessionForAttendance.time}`,
    );
    const now = new Date();
    const hoursSinceSession = (now.getTime() - sessionDateTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceSession > 24) {
      alert(
        '❌ Đã quá thời hạn điểm danh!\n\nBuổi học này đã kết thúc hơn 24 giờ và không thể điểm danh được nữa.',
      );
      return;
    }

    // Mock successful attendance submission
    const totalStudents = Object.keys(attendanceData).length;
    const presentStudents = Object.values(attendanceData).filter(Boolean).length;
    const absentStudents = totalStudents - presentStudents;

    // Prepare session content data
    const sessionContent = {
      assignments: sessionManagement.selectedAssignments,
      quizzes: sessionManagement.selectedQuizzes,
      videos: sessionManagement.selectedVideos,
    };

    console.log('Enhanced attendance data:', {
      sessionId: selectedSessionForAttendance.id,
      attendance: attendanceData,
      notes: attendanceNotes,
      sessionTopics: sessionTopics,
      sessionContent: sessionContent,
      statistics: {
        totalStudents,
        presentStudents,
        absentStudents,
        attendanceRate: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0,
      },
      submittedAt: new Date().toISOString(),
      withinDeadline: hoursSinceSession <= 24,
    });

    // Calculate payment for this session
    const sessionPayment = calculateSessionPayment(selectedSessionForAttendance, presentStudents);

    // Build success message with content summary
    let successMessage = `✅ Điểm danh thành công!\n\n📊 Thống kê:\n• Tổng số: ${totalStudents} học viên\n• Có mặt: ${presentStudents} học viên\n• Vắng mặt: ${absentStudents} học viên\n• Tỷ lệ: ${totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0}%\n\n📚 Nội dung đã học: ${sessionTopics.length} chủ đề${sessionTopics.length > 0 ? '\n' + sessionTopics.slice(0, 3).join(', ') + (sessionTopics.length > 3 ? '...' : '') : ''}`;

    // Add content summary to message
    if (
      sessionContent.assignments.length > 0 ||
      sessionContent.quizzes.length > 0 ||
      sessionContent.videos.length > 0
    ) {
      successMessage += '\n\n📋 Nội dung đã giao:';
      if (sessionContent.assignments.length > 0) {
        successMessage += `\n• Bài tập: ${sessionContent.assignments.length} bài`;
      }
      if (sessionContent.quizzes.length > 0) {
        successMessage += `\n• Quiz: ${sessionContent.quizzes.length} quiz`;
      }
      if (sessionContent.videos.length > 0) {
        successMessage += `\n• Video: ${sessionContent.videos.length} video`;
      }
    }

    successMessage += `\n\n💰 Thanh toán:\n• Số tiền sẽ nhận: ${sessionPayment.formatted}\n• Trạng thái: Đang chờ xử lý\n\n⏰ Điểm danh lúc: ${new Date().toLocaleString('vi-VN')}`;

    alert(successMessage);

    // Reset all states
    setShowAttendanceModal(false);
    setSelectedSessionForAttendance(null);
    setAttendanceData({});
    setAttendanceNotes({});
    setSessionTopics([]);
    setNewTopic('');
    setActiveSessionTab('attendance');
    setSessionManagement({
      assignments: [],
      quizzes: [],
      videos: [],
      selectedAssignments: [],
      selectedQuizzes: [],
      selectedVideos: [],
    });
  };

  const [contentLibrary, setContentLibrary] = useState({
    quizzes: [
      {
        id: 1,
        title: 'Quiz: Kỹ thuật serve cơ bản',
        questions: 10,
        difficulty: 'Beginner',
        usageCount: 3,
        createdAt: '2025-01-01',
        type: 'quiz',
        description: 'Quiz kiểm tra kiến thức về kỹ thuật serve cơ bản',
        detailedContent: {
          duration: '15 phút',
          passingScore: 7,
          questions: [
            {
              id: 1,
              question: 'Kích thước chuẩn của sân pickleball là gì?',
              options: ['13.41m x 6.10m', '15.24m x 6.10m', '13.41m x 7.32m', '15.24m x 7.32m'],
              correctAnswer: 1,
              explanation:
                'Kích thước chuẩn của sân pickleball là 13.41m x 6.10m cho đơn và 13.41m x 7.32m cho đôi.',
            },
            {
              id: 2,
              question: 'Độ cao của lưới pickleball ở giữa sân là bao nhiêu?',
              options: ['0.86m', '0.91m', '0.94m', '1.00m'],
              correctAnswer: 0,
              explanation: 'Độ cao lưới pickleball ở giữa là 0.86m và ở hai bên là 0.91m.',
            },
            {
              id: 3,
              question: 'Serve phải được thực hiện từ đâu?',
              options: [
                'Bất kỳ vị trí nào trong sân',
                'Phía sau đường baseline',
                'Bên phải của sân',
                'Bên trái của sân',
              ],
              correctAnswer: 1,
              explanation:
                'Serve phải được thực hiện từ phía sau đường baseline, giữa đường center line và sideline.',
            },
          ],
        },
      },
      {
        id: 2,
        title: 'Quiz: Return nâng cao',
        questions: 8,
        difficulty: 'Intermediate',
        usageCount: 1,
        createdAt: '2025-01-05',
        type: 'quiz',
        description: 'Quiz về kỹ thuật return nâng cao',
        detailedContent: {
          duration: '12 phút',
          passingScore: 6,
          questions: [
            {
              id: 1,
              question: 'Kỹ thuật return nào hiệu quả nhất với serve mạnh?',
              options: ['Block return', 'Chip return', 'Drive return', 'Lob return'],
              correctAnswer: 0,
              explanation:
                'Block return là kỹ thuật hiệu quả nhất để đối phó với serve mạnh, giúp kiểm soát bóng và giảm thiểu lỗi.',
            },
          ],
        },
      },
      {
        id: 3,
        title: 'Quiz: Chiến thuật cơ bản',
        questions: 5,
        difficulty: 'Beginner',
        usageCount: 2,
        createdAt: '2025-01-10',
        type: 'quiz',
        description: 'Quiz về chiến thuật cơ bản trong pickleball',
        detailedContent: {
          duration: '10 phút',
          passingScore: 4,
          questions: [
            {
              id: 1,
              question: 'Vị trí nào là tốt nhất ở dòng non-volley zone?',
              options: [
                'Gần lưới',
                'Giữa non-volley zone',
                'Phía sau non-volley zone',
                'Ở bất kỳ đâu cũng được',
              ],
              correctAnswer: 1,
              explanation:
                'Vị trí tốt nhất ở non-volley zone là giữa khu vực, giúp bạn di chuyển dễ dàng cả hai bên.',
            },
          ],
        },
      },
    ],
    videos: [
      {
        id: 4,
        title: 'Video: Serve technique',
        duration: '5:30',
        category: 'Technique',
        usageCount: 4,
        createdAt: '2025-01-02',
        type: 'video',
        description: 'Video hướng dẫn kỹ thuật serve đúng chuẩn',
        detailedContent: {
          instructor: 'Huấn luyện viên Nguyễn Văn A',
          level: 'Beginner',
          topics: [
            '1. Gripping the paddle (0:30)',
            '2. Stance and positioning (1:15)',
            '3. Motion mechanics (2:00)',
            '4. Contact point (3:30)',
            '5. Follow-through (4:45)',
            '6. Common mistakes (5:00)',
          ],
          equipment: ['Paddle', 'Ball', 'Practice court'],
          transcript:
            'Trong video này, chúng ta sẽ học về kỹ thuật serve cơ bản trong pickleball...',
        },
      },
      {
        id: 5,
        title: 'Video: Return practice',
        duration: '8:15',
        category: 'Practice',
        usageCount: 2,
        createdAt: '2025-01-06',
        type: 'video',
        description: 'Video luyện tập kỹ thuật return',
        detailedContent: {
          instructor: 'Huấn luyện viên Trần Thị B',
          level: 'Intermediate',
          topics: [
            '1. Reading the serve (0:45)',
            '2. Footwork preparation (1:30)',
            '3. Backswing technique (3:00)',
            '4. Contact and control (5:00)',
            '5. Advanced returns (6:30)',
            '6. Practice drills (7:15)',
          ],
          equipment: ['Paddle', 'Ball', 'Practice partner', 'Cones'],
          transcript: 'Chào mừng đến với video luyện tập return nâng cao...',
        },
      },
    ],
    assignments: [
      {
        id: 6,
        title: 'Luyện serve 100 quả',
        type: 'practice',
        difficulty: 'Beginner',
        usageCount: 5,
        createdAt: '2025-01-03',
        assignmentType: 'assignment',
        description: 'Bài tập luyện tập serve cơ bản',
        detailedContent: {
          estimatedTime: '30 phút',
          instructions: [
            '1. Warm-up trong 5 phút',
            '2. Thực hiện 20 serve vào ô phải',
            '3. Thực hiện 20 serve vào ô trái',
            '4. Thực hiện 20 serve vào giữa',
            '5. Thực hiện 20 serve theo yêu cầu (người tập chọn)',
            '6. Ghi lại kết quả và video',
          ],
          requirements: [
            'Thực hiện đúng kỹ thuật đã học',
            'Ghi lại video toàn bộ quá trình',
            'Đếm số lần thành công và thất bại',
            'Ghi chú các khó khăn gặp phải',
          ],
          submissionFormat: 'Video + Báo cáo kết quả',
          evaluationCriteria: [
            'Đúng kỹ thuật (40%)',
            'Độ chính xác (30%)',
            'Sự nhất quán (20%)',
            'Báo cáo chi tiết (10%)',
          ],
        },
      },
      {
        id: 7,
        title: 'Video thực hành return',
        type: 'video',
        difficulty: 'Intermediate',
        usageCount: 1,
        createdAt: '2025-01-07',
        assignmentType: 'assignment',
        description: 'Bài tập nộp video thực hành return',
        detailedContent: {
          estimatedTime: '45 phút',
          instructions: [
            '1. Tìm bạn tập hoặc máy抛球',
            '2. Thực hành return với 10 loại serve khác nhau',
            '3. Quay video từ 2 góc độ (trước và bên)',
            '4. Thực hiện mỗi loại return 5 lần',
            '5. Chọn 3 lần tốt nhất để nộp',
          ],
          requirements: [
            'Video chất lượng rõ nét',
            'Toàn thân và sân pickleball visible',
            'Có tên và ngày tháng trong video',
            'Thời lượng mỗi đoạn không quá 2 phút',
          ],
          submissionFormat: 'Video file (MP4, MOV)',
          evaluationCriteria: [
            'Kỹ thuật correct (50%)',
            'Sự đa dạng (25%)',
            'Chất lượng video (15%)',
            'Presentation (10%)',
          ],
        },
      },
    ],
  });

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

                        <RightOutlined style={{ fontSize: 20, color: '#9CA3AF' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {showAttendanceModal && selectedSessionForAttendance && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                maxWidth: '72rem',
                width: '100%',
                maxHeight: '95vh',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  padding: '24px',
                  borderBottom: '1px solid #e5e7eb',
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
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        margin: 0,
                      }}
                    >
                      Quản lý buổi học:
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        margin: 0,
                      }}
                    >
                      {selectedSessionForAttendance.courseName} -{' '}
                      {selectedSessionForAttendance.date} ({selectedSessionForAttendance.time})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAttendanceModal(false);
                      setSelectedSessionForAttendance(null);
                      setAttendanceData({});
                      setAttendanceNotes({});
                      setSessionTopics([]);
                      setNewTopic('');
                      // setActiveSessionTab('attendance');
                      // setSessionManagement({
                      //   assignments: [],
                      //   quizzes: [],
                      //   videos: [],
                      //   selectedAssignments: [],
                      //   selectedQuizzes: [],
                      //   selectedVideos: [],
                      // });
                    }}
                    style={{
                      color: '#9ca3af',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#4b5563')} // hover:text-gray-600
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                  >
                    <CloseOutlined style={{ fontSize: 22 }} />
                  </button>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                    }}
                  >
                    <WarningOutlined
                      style={{
                        fontSize: 16,
                        color: '#d97706',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          color: '#92400e', // text-amber-800
                          margin: 0,
                        }}
                      >
                        ⚠️ Lưu ý quan trọng về thời hạn điểm danh
                      </p>
                      <p
                        style={{
                          color: '#b45309', // text-amber-700
                          marginTop: '4px',
                          marginBottom: 0,
                        }}
                      >
                        Bạn phải hoàn thành điểm danh trong vòng <strong>24 giờ</strong> sau khi
                        buổi học kết thúc. Nếu không điểm danh đúng hạn,{' '}
                        <strong>buổi học này sẽ không được thanh toán</strong>.
                      </p>
                      <p
                        style={{
                          color: '#d97706', // text-amber-600
                          marginTop: '4px',
                          fontSize: '12px',
                          marginBottom: 0,
                        }}
                      >
                        Hệ thống sẽ tự động khóa điểm danh sau 24h để đảm bảo tính chính xác của dữ
                        liệu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <nav
                  style={{
                    display: 'flex',
                    gap: '32px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                  }}
                  aria-label="Tabs"
                >
                  {/* --- Tab: Điểm danh & Nội dung --- */}
                  <button
                    onClick={() => setActiveSessionTab('attendance')}
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                      borderBottom: `2px solid ${
                        activeSessionTab === 'attendance' ? '#3b82f6' : 'transparent'
                      }`,
                      fontWeight: 500,
                      fontSize: '14px',
                      color: activeSessionTab === 'attendance' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (activeSessionTab !== 'attendance') {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderBottomColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSessionTab !== 'attendance') {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TeamOutlined style={{ fontSize: 16 }} />
                      <span>Điểm danh & Nội dung</span>
                    </div>
                  </button>

                  {/* --- Tab: Bài tập --- */}
                  <button
                    onClick={() => setActiveSessionTab('assignments')}
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                      borderBottom: `2px solid ${
                        activeSessionTab === 'assignments' ? '#3b82f6' : 'transparent'
                      }`,
                      fontWeight: 500,
                      fontSize: '14px',
                      color: activeSessionTab === 'assignments' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (activeSessionTab !== 'assignments') {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderBottomColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSessionTab !== 'assignments') {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileTextOutlined style={{ fontSize: 16 }} />
                      <span>Bài tập</span>
                      {sessionManagement.selectedAssignments.length > 0 && (
                        <span
                          style={{
                            backgroundColor: '#dbeafe', // bg-blue-100
                            color: '#2563eb', // text-blue-600
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                        >
                          {sessionManagement.selectedAssignments.length}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* --- Tab: Quiz --- */}
                  <button
                    onClick={() => setActiveSessionTab('quizzes')}
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                      borderBottom: `2px solid ${
                        activeSessionTab === 'quizzes' ? '#3b82f6' : 'transparent'
                      }`,
                      fontWeight: 500,
                      fontSize: '14px',
                      color: activeSessionTab === 'quizzes' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (activeSessionTab !== 'quizzes') {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderBottomColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSessionTab !== 'quizzes') {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <QuestionCircleOutlined style={{ fontSize: 16 }} />
                      <span>Quiz</span>
                      {sessionManagement.selectedQuizzes.length > 0 && (
                        <span
                          style={{
                            backgroundColor: '#f3e8ff', // bg-purple-100
                            color: '#9333ea', // text-purple-600
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                        >
                          {sessionManagement.selectedQuizzes.length}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* --- Tab: Video --- */}
                  <button
                    onClick={() => setActiveSessionTab('videos')}
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                      borderBottom: `2px solid ${
                        activeSessionTab === 'videos' ? '#3b82f6' : 'transparent'
                      }`,
                      fontWeight: 500,
                      fontSize: '14px',
                      color: activeSessionTab === 'videos' ? '#2563eb' : '#6b7280',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (activeSessionTab !== 'videos') {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderBottomColor = '#d1d5db';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSessionTab !== 'videos') {
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <VideoCameraOutlined style={{ fontSize: 16 }} />
                      <span>Video</span>
                      {sessionManagement.selectedVideos.length > 0 && (
                        <span
                          style={{
                            backgroundColor: '#ffedd5', // bg-orange-100
                            color: '#ea580c', // text-orange-600
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                          }}
                        >
                          {sessionManagement.selectedVideos.length}
                        </span>
                      )}
                    </div>
                  </button>
                </nav>
              </div>

              <div style={{ padding: '24px' }}>
                {activeSessionTab === 'attendance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Learning Topics Section */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                        }}
                      >
                        <h4 style={{ fontWeight: 600, color: '#1f2937' }}>
                          Nội dung đã học hôm nay
                        </h4>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          {sessionTopics.length} chủ đề
                        </span>
                      </div>

                      {/* Topic Input */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={newTopic}
                            onChange={handleTopicInputChange}
                            onKeyDown={handleAddTopic}
                            placeholder="Nhập nội dung đã học và nhấn Enter..."
                            style={{
                              width: '100%',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              padding: '12px 48px 12px 16px',
                              fontSize: '14px',
                              outline: 'none',
                              transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3b82f6')}
                            onBlur={(e) => (e.target.style.boxShadow = 'none')}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#9ca3af',
                              fontSize: '12px',
                            }}
                          >
                            Enter
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                          Ví dụ: Forehand technique, Serve practice, Double strategy...
                        </p>
                      </div>

                      {/* Topics Badges */}
                      {sessionTopics.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {sessionTopics.map((topic, index) => (
                            <div
                              key={index}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                backgroundColor: '#dbeafe',
                                color: '#1e3a8a',
                                borderRadius: '9999px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'default',
                                transition: 'background-color 0.2s',
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = '#bfdbfe')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = '#dbeafe')
                              }
                            >
                              <span>{topic}</span>
                              <button
                                onClick={() => handleRemoveTopic(topic)}
                                title="Xóa chủ đề"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#2563eb',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1e40af')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
                              >
                                <CloseOutlined style={{ fontSize: 22 }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Attendance Section */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                        }}
                      >
                        <h4 style={{ fontWeight: 600, color: '#1f2937' }}>Danh sách học viên</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#4b5563' }}>
                            <span style={{ fontWeight: 500, color: '#16a34a' }}>
                              {Object.values(attendanceData).filter(Boolean).length}
                            </span>
                            /{Object.keys(attendanceData).length} có mặt
                          </div>
                          <div style={{ fontSize: '14px', color: '#4b5563' }}>
                            <span style={{ fontWeight: 500, color: '#dc2626' }}>
                              {Object.values(attendanceData).filter((v) => !v).length}
                            </span>{' '}
                            vắng mặt
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          maxHeight: '384px',
                          overflowY: 'auto',
                        }}
                      >
                        {Object.entries(attendanceData).map(([studentName, isPresent]) => (
                          <div
                            key={studentName}
                            style={{
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              padding: '16px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  backgroundColor: '#10b981',
                                  borderRadius: '9999px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                              >
                                {studentName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                  >
                                    <h5 style={{ fontWeight: 600, color: '#1f2937' }}>
                                      {studentName}
                                    </h5>
                                    <button
                                    // onClick={() => {
                                    //   const student = students.find(
                                    //     (s: any) => s.name === studentName,
                                    //   );
                                    //   if (student) handleStudentDetail(student);
                                    // }}
                                    // title="Xem chi tiết học viên"
                                    // style={{
                                    //   background: 'none',
                                    //   border: 'none',
                                    //   color: '#2563eb',
                                    //   fontSize: '14px',
                                    //   cursor: 'pointer',
                                    // }}
                                    // onMouseEnter={(e) =>
                                    //   (e.currentTarget.style.color = '#1e40af')
                                    // }
                                    // onMouseLeave={(e) =>
                                    //   (e.currentTarget.style.color = '#2563eb')
                                    // }
                                    >
                                      <EyeFilled size={16} />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => toggleAttendance(studentName)}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      fontWeight: 500,
                                      backgroundColor: isPresent ? '#dcfce7' : '#fee2e2',
                                      color: isPresent ? '#15803d' : '#b91c1c',
                                      cursor: 'pointer',
                                      transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.backgroundColor = isPresent
                                        ? '#bbf7d0'
                                        : '#fecaca')
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.backgroundColor = isPresent
                                        ? '#dcfce7'
                                        : '#fee2e2')
                                    }
                                  >
                                    {isPresent ? '✓ Có mặt' : '✗ Vắng mặt'}
                                  </button>
                                </div>

                                <div
                                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                                >
                                  <label
                                    style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}
                                  >
                                    Ghi chú (tùy chọn)
                                  </label>
                                  <textarea
                                    value={attendanceNotes[studentName] || ''}
                                    onChange={(e) =>
                                      updateAttendanceNote(studentName, e.target.value)
                                    }
                                    rows={2}
                                    placeholder={
                                      isPresent
                                        ? 'Nhập ghi chú về học viên...'
                                        : 'Nhập lý do vắng mặt...'
                                    }
                                    style={{
                                      width: '100%',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '8px',
                                      padding: '8px 12px',
                                      fontSize: '14px',
                                      outline: 'none',
                                      resize: 'none',
                                      transition: 'box-shadow 0.2s',
                                    }}
                                    onFocus={(e) =>
                                      (e.target.style.boxShadow = '0 0 0 2px #3b82f6')
                                    }
                                    onBlur={(e) => (e.target.style.boxShadow = 'none')}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notice */}
                    <div
                      style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <i
                          className="anticon anticon-info-circle"
                          style={{ color: '#2563eb', fontSize: '20px', marginTop: '2px' }}
                        />
                        <div>
                          <h4 style={{ fontWeight: 600, color: '#1e3a8a', marginBottom: '4px' }}>
                            Lưu ý
                          </h4>
                          <p style={{ fontSize: '14px', color: '#1e40af' }}>
                            Sau khi điểm danh, hệ thống sẽ tự động ghi nhận trạng thái tham gia của
                            học viên. Các học viên có mặt sẽ có thể truy cập bài tập và tài liệu của
                            buổi học.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSessionTab === 'assignments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h4 style={{ fontWeight: 600, color: '#1f2937' }}>Bài tập cho buổi học</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedSessionForHomework(selectedSessionForAttendance);
                            setShowHomeworkModal(true);
                          }}
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                        >
                          <PlusOutlined style={{ fontSize: '16px' }} />
                          <span>Tạo bài tập mới</span>
                        </button>
                      </div>
                    </div>

                    {/* Assignment Library */}
                    <div>
                      <h5 style={{ fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                        Chọn bài tập từ thư viện
                      </h5>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
                          gap: '16px',
                          maxHeight: '256px',
                          overflowY: 'auto',
                        }}
                      >
                        {contentLibrary.assignments.map((assignment) => {
                          const isSelected = sessionManagement.selectedAssignments.find(
                            (a: any) => a.id === assignment.id,
                          );
                          return (
                            <div
                              key={assignment.id}
                              style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '16px',
                                transition: 'box-shadow 0.2s',
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)')
                              }
                              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <h6 style={{ fontWeight: 500, color: '#1f2937' }}>
                                    {assignment.title}
                                  </h6>
                                  <p
                                    style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}
                                  >
                                    {assignment.description}
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginTop: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#dcfce7',
                                        color: '#15803d',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                      }}
                                    >
                                      {assignment.type}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                      Đã dùng: {assignment.usageCount} lần
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    if (isSelected) {
                                      setSessionManagement((prev) => ({
                                        ...prev,
                                        selectedAssignments: prev.selectedAssignments.filter(
                                          (a: any) => a.id !== assignment.id,
                                        ),
                                      }));
                                    } else {
                                      setSessionManagement((prev: any) => ({
                                        ...prev,
                                        selectedAssignments: [
                                          ...prev.selectedAssignments,
                                          assignment,
                                        ],
                                      }));
                                    }
                                  }}
                                  style={{
                                    marginLeft: '8px',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#dcfce7' : '#f3f4f6',
                                    color: isSelected ? '#15803d' : '#374151',
                                    transition: 'background-color 0.2s',
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = isSelected
                                      ? '#bbf7d0'
                                      : '#e5e7eb')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = isSelected
                                      ? '#dcfce7'
                                      : '#f3f4f6')
                                  }
                                >
                                  {isSelected ? '✓ Đã chọn' : 'Chọn'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Assignments */}
                    {sessionManagement.selectedAssignments.length > 0 && (
                      <div>
                        <h5 style={{ fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                          Bài tập đã chọn ({sessionManagement.selectedAssignments.length})
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {sessionManagement.selectedAssignments.map((assignment) => (
                            <div
                              key={assignment.id}
                              style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '8px',
                                padding: '16px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div>
                                  <h6 style={{ fontWeight: 500, color: '#1f2937' }}>
                                    {assignment.title}
                                  </h6>
                                  <p
                                    style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}
                                  >
                                    {assignment.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    setSessionManagement((prev) => ({
                                      ...prev,
                                      selectedAssignments: prev.selectedAssignments.filter(
                                        (a: any) => a.id !== assignment.id,
                                      ),
                                    }));
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = '#991b1b')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = '#dc2626')}
                                >
                                  <CloseOutlined style={{ fontSize: '16px' }} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSessionTab === 'quizzes' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h4 style={{ fontWeight: 600, color: '#1f2937' }}>Quiz cho buổi học</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedSessionForQuiz(selectedSessionForAttendance);
                            setShowSessionQuizModal(true);
                          }}
                          style={{
                            backgroundColor: '#9333ea',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7e22ce')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#9333ea')}
                        >
                          <PlusCircleFilled size={16} />
                          <span>Tạo quiz mới</span>
                        </button>
                      </div>
                    </div>

                    {/* Available Quizzes from Library */}
                    <div>
                      <h5 style={{ fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                        Chọn quiz từ thư viện
                      </h5>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                          gap: '16px',
                          maxHeight: '256px',
                          overflowY: 'auto',
                        }}
                      >
                        {contentLibrary.quizzes.map((quiz) => {
                          const isSelected = sessionManagement.selectedQuizzes.find(
                            (q: any) => q.id === quiz.id,
                          );
                          return (
                            <div
                              key={quiz.id}
                              style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '16px',
                                transition: 'box-shadow 0.2s',
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')
                              }
                              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <h6 style={{ fontWeight: 500, color: '#1f2937' }}>
                                    {quiz.title}
                                  </h6>
                                  <p
                                    style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}
                                  >
                                    {quiz.description}
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginTop: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#f3e8ff',
                                        color: '#7e22ce',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {quiz.questions} câu hỏi
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#dbeafe',
                                        color: '#1d4ed8',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {quiz.difficulty}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                      Đã dùng: {quiz.usageCount} lần
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    if (isSelected) {
                                      setSessionManagement((prev) => ({
                                        ...prev,
                                        selectedQuizzes: prev.selectedQuizzes.filter(
                                          (q) => q.id !== quiz.id,
                                        ),
                                      }));
                                    } else {
                                      setSessionManagement((prev) => ({
                                        ...prev,
                                        selectedQuizzes: [...prev.selectedQuizzes, quiz],
                                      }));
                                    }
                                  }}
                                  style={{
                                    marginLeft: '8px',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#dcfce7' : '#f3f4f6',
                                    color: isSelected ? '#15803d' : '#374151',
                                    transition: 'background-color 0.2s',
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = isSelected
                                      ? '#bbf7d0'
                                      : '#e5e7eb')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = isSelected
                                      ? '#dcfce7'
                                      : '#f3f4f6')
                                  }
                                >
                                  {isSelected ? '✓ Đã chọn' : 'Chọn'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Quizzes */}
                    {sessionManagement.selectedQuizzes.length > 0 && (
                      <div>
                        <h5 style={{ fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                          Quiz đã chọn ({sessionManagement.selectedQuizzes.length})
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {sessionManagement.selectedQuizzes.map((quiz) => (
                            <div
                              key={quiz.id}
                              style={{
                                backgroundColor: '#faf5ff',
                                border: '1px solid #e9d5ff',
                                borderRadius: '8px',
                                padding: '16px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div>
                                  <h6 style={{ fontWeight: 500, color: '#1f2937' }}>
                                    {quiz.title}
                                  </h6>
                                  <p
                                    style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}
                                  >
                                    {quiz.description}
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginTop: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#f3e8ff',
                                        color: '#7e22ce',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {quiz.questions} câu hỏi
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#dbeafe',
                                        color: '#1d4ed8',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {quiz.difficulty}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setSessionManagement((prev) => ({
                                      ...prev,
                                      selectedQuizzes: prev.selectedQuizzes.filter(
                                        (q: any) => q.id !== quiz.id,
                                      ),
                                    }));
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = '#b91c1c')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = '#dc2626')}
                                >
                                  <CloseOutlined style={{ fontSize: '16px' }} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSessionTab === 'videos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <h4 style={{ fontWeight: 600, color: '#1f2937' }}>Video cho buổi học</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedSessionForVideo(selectedSessionForAttendance);
                            setShowSessionVideoModal(true);
                          }}
                          style={{
                            backgroundColor: '#ea580c',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                        >
                          <PlusCircleOutlined size={16} />
                          <span>Thêm video mới</span>
                        </button>
                      </div>
                    </div>

                    {/* Available Videos from Library */}
                    <div>
                      <h5 style={{ fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                        Chọn video từ thư viện
                      </h5>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                          gap: '16px',
                          maxHeight: '256px',
                          overflowY: 'auto',
                        }}
                      >
                        {contentLibrary.videos.map((video) => {
                          const isSelected = sessionManagement.selectedVideos.find(
                            (v) => v.id === video.id,
                          );
                          return (
                            <div
                              key={video.id}
                              style={{
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                padding: '16px',
                                transition: 'box-shadow 0.2s',
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')
                              }
                              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <h6 style={{ fontWeight: 500, color: '#1f2937' }}>
                                    {video.title}
                                  </h6>
                                  <p
                                    style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}
                                  >
                                    {video.description}
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginTop: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#ffedd5',
                                        color: '#9a3412',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {video.duration}
                                    </span>
                                    {/* <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#dbeafe',
                                        color: '#1d4ed8',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {video.difficulty}
                                    </span> */}
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                      Đã dùng: {video.usageCount} lần
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    if (isSelected) {
                                      setSessionManagement((prev) => ({
                                        ...prev,
                                        selectedVideos: prev.selectedVideos.filter(
                                          (v) => v.id !== video.id,
                                        ),
                                      }));
                                    } else {
                                      setSessionManagement((prev) => ({
                                        ...prev,
                                        selectedVideos: [...prev.selectedVideos, video],
                                      }));
                                    }
                                  }}
                                  style={{
                                    marginLeft: '8px',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#dcfce7' : '#f3f4f6',
                                    color: isSelected ? '#15803d' : '#374151',
                                    transition: 'background-color 0.2s',
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor = isSelected
                                      ? '#bbf7d0'
                                      : '#e5e7eb')
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = isSelected
                                      ? '#dcfce7'
                                      : '#f3f4f6')
                                  }
                                >
                                  {isSelected ? '✓ Đã chọn' : 'Chọn'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Videos */}
                    {sessionManagement.selectedVideos.length > 0 && (
                      <div>
                        <h5 style={{ fontWeight: 500, color: '#374151', marginBottom: '12px' }}>
                          Video đã chọn ({sessionManagement.selectedVideos.length})
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {sessionManagement.selectedVideos.map((video) => (
                            <div
                              key={video.id}
                              style={{
                                backgroundColor: '#fff7ed',
                                border: '1px solid #fed7aa',
                                borderRadius: '8px',
                                padding: '16px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div>
                                  <h6 style={{ fontWeight: 500, color: '#1f2937' }}>
                                    {video.title}
                                  </h6>
                                  <p
                                    style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}
                                  >
                                    {video.description}
                                  </p>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginTop: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#ffedd5',
                                        color: '#9a3412',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {video.duration}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        backgroundColor: '#dbeafe',
                                        color: '#1d4ed8',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      {video.difficulty}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setSessionManagement((prev) => ({
                                      ...prev,
                                      selectedVideos: prev.selectedVideos.filter(
                                        (v) => v.id !== video.id,
                                      ),
                                    }));
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = '#b91c1c')}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = '#dc2626')}
                                >
                                  <CloseOutlined style={{ fontSize: '16px' }} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '24px',
                  borderTop: '1px solid #e5e7eb', // border-gray-200
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#4b5563', // text-gray-600
                    }}
                  >
                    {activeSessionTab === 'attendance' && (
                      <span>Hoàn thành điểm danh và nội dung buổi học</span>
                    )}
                    {activeSessionTab === 'assignments' && (
                      <span>Đã chọn {sessionManagement.selectedAssignments.length} bài tập</span>
                    )}
                    {activeSessionTab === 'quizzes' && (
                      <span>Đã chọn {sessionManagement.selectedQuizzes.length} quiz</span>
                    )}
                    {activeSessionTab === 'videos' && (
                      <span>Đã chọn {sessionManagement.selectedVideos.length} video</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setShowAttendanceModal(false);
                        setSelectedSessionForAttendance(null);
                        setAttendanceData({});
                        setAttendanceNotes({});
                        setSessionTopics([]);
                        setNewTopic('');
                        setActiveSessionTab('attendance');
                        setSessionManagement({
                          assignments: [],
                          quizzes: [],
                          videos: [],
                          selectedAssignments: [],
                          selectedQuizzes: [],
                          selectedVideos: [],
                        });
                      }}
                      style={{
                        border: '1px solid #d1d5db',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor = '#f9fafb')
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor = '#fff')
                      }
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleAttendanceSubmit}
                      style={{
                        backgroundColor: '#16a34a', // bg-green-600
                        color: '#fff',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor = '#15803d')
                      } // hover:bg-green-700
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor = '#16a34a')
                      }
                    >
                      {activeSessionTab === 'attendance' ? 'Xác nhận điểm danh' : 'Lưu và tiếp tục'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
