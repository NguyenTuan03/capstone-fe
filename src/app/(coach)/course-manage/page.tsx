'use client';
import React, { useState } from 'react';

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManageModalVisible, setIsManageModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [manageTab, setManageTab] = useState('overview');
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<any>(false);
  const [expandedSessions, setExpandedSessions] = useState<any>({});

  // Video comparison states
  const [coachVideo, setCoachVideo] = useState<any>(null);
  const [learnerVideo, setLearnerVideo] = useState<any>(null);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<any>(false);
  const [analysisError, setAnalysisError] = useState<any>(null);

  // Exercise management states
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState<any>(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Mock data for exercises and submissions
  const exercises = [
    {
      id: 1,
      title: 'Bài tập 1: Serve cơ bản',
      description: 'Thực hiện 10 cú serve và quay video',
      hasCoachVideo: true,
      coachVideoUrl: 'coach-serve-demo.mp4',
      submissionsCount: 3,
      deadline: '2025-11-01',
    },
    {
      id: 2,
      title: 'Bài tập 2: Return nâng cao',
      description: 'Thực hành return với 5 tình huống khác nhau',
      hasCoachVideo: false,
      coachVideoUrl: null,
      submissionsCount: 1,
      deadline: '2025-11-05',
    },
  ];

  const submissions: any = {
    1: [
      {
        id: 1,
        studentName: 'Nguyễn Văn A',
        studentAvatar: 'NVA',
        submittedAt: '2025-10-25 14:30',
        videoUrl: 'student1-serve.mp4',
        status: 'pending',
        aiAnalyzed: true,
        aiSummary: 'Tư thế tốt nhưng cần cải thiện follow-through',
      },
      {
        id: 2,
        studentName: 'Trần Văn B',
        studentAvatar: 'TVB',
        submittedAt: '2025-10-26 09:15',
        videoUrl: 'student2-serve.mp4',
        status: 'reviewed',
        aiAnalyzed: true,
        aiSummary: 'Kỹ thuật cơ bản đúng, tốc độ còn chậm',
      },
      {
        id: 3,
        studentName: 'Lê Thị C',
        studentAvatar: 'LTC',
        submittedAt: '2025-10-26 16:45',
        videoUrl: 'student3-serve.mp4',
        status: 'pending',
        aiAnalyzed: true,
        aiSummary: 'Footwork cần cải thiện, tư thế cầm vợt tốt',
      },
    ],
    2: [
      {
        id: 4,
        studentName: 'Phạm Văn D',
        studentAvatar: 'PVD',
        submittedAt: '2025-10-27 10:20',
        videoUrl: 'student4-return.mp4',
        status: 'pending',
        aiAnalyzed: false,
        aiSummary: null,
      },
    ],
  };

  const [courseForm, setCourseForm] = useState({
    name: '',
    level: 'intermediate',
    type: 'group',
    totalSessions: 8,
    sessionsPerWeek: 2,
    startDate: '2025-10-23',
    description: '',
    price: 0,
    schedule: [],
  });

  const stats = [
    { title: 'Tổng khóa học', value: '7', icon: '📚', color: 'bg-blue-50 text-blue-600' },
    { title: 'Đang diễn ra', value: '4', icon: '⏰', color: 'bg-green-50 text-green-600' },
    { title: 'Đã hoàn thành', value: '3', icon: '✓', color: 'bg-gray-50 text-gray-600' },
    { title: 'Tổng học viên', value: '21', icon: '👥', color: 'bg-purple-50 text-purple-600' },
    { title: 'Doanh thu', value: '57.800.000đ', icon: '📈', color: 'bg-orange-50 text-orange-600' },
  ];

  const courses = [
    {
      id: 1,
      name: 'Pickleball cơ bản - Khóa 1',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Đã đủ',
      description:
        'Khóa học offline dành cho người mới bắt đầu, tập trung vào các kỹ thuật cơ bản và luật chơi',
      sessions: 4,
      schedule: 'Thứ 2, 4, 6 - 14:00-15:30',
      location: 'Sân Pickleball Quận 7',
      coach: 'Huấn luyện viên Nguyễn Văn A',
      currentStudents: 4,
      maxStudents: 4,
      progress: 100,
      sessionsCompleted: 8,
      fee: '500.000đ/người',
      feeDetail: '≈ 62.500đ/buổi',
      discount: '65%',
    },
    {
      id: 2,
      name: 'Kỹ thuật nâng cao - Khóa 1',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Đã đủ',
      description: 'Nâng cao kỹ năng serve và return, chiến thuật thi đấu chuyên nghiệp',
      sessions: 5,
      schedule: 'Thứ 3, 5, 7 - 16:00-17:30',
      location: 'Sân Pickleball Bình Thạnh',
      coach: 'Huấn luyện viên Trần Thị B',
      currentStudents: 2,
      maxStudents: 2,
      progress: 40,
      sessionsCompleted: 10,
      fee: '800.000đ/người',
      feeDetail: '≈ 80.000đ/buổi',
      discount: '40%',
    },
    {
      id: 3,
      name: 'Pickleball thiếu nhi - Khóa 2',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Còn chỗ',
      description: 'Khóa học vui nhộn cho trẻ em 8-14 tuổi, phát triển thể chất và kỹ năng',
      sessions: 6,
      schedule: 'Thứ 7, CN - 09:00-10:30',
      location: 'Sân Pickleball Quận 1',
      coach: 'Huấn luyện viên Lê Văn C',
      currentStudents: 6,
      maxStudents: 8,
      progress: 75,
      sessionsCompleted: 12,
      fee: '600.000đ/người',
      feeDetail: '≈ 50.000đ/buổi',
      discount: '25%',
    },
    {
      id: 4,
      name: 'Chiến thuật đôi - Khóa 3',
      level: 'Advanced',
      levelColor: 'bg-purple-100 text-purple-800',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      statusBadge: 'Còn chỗ',
      description: 'Tập trung vào chiến thuật thi đấu đôi và phối hợp nhóm',
      sessions: 3,
      schedule: 'Thứ 2, 4 - 18:00-19:30',
      location: 'Sân Pickleball Quận 3',
      coach: 'Huấn luyện viên Phạm Thị D',
      currentStudents: 4,
      maxStudents: 6,
      progress: 67,
      sessionsCompleted: 6,
      fee: '900.000đ/người',
      feeDetail: '≈ 150.000đ/buổi',
      discount: '50%',
    },
    {
      id: 5,
      name: 'Pickleball cơ bản - Khóa 0',
      level: 'Beginner',
      levelColor: 'bg-green-100 text-green-800',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBadge: '',
      description: 'Khóa học đầu tiên cho người mới bắt đầu',
      sessions: 8,
      schedule: 'Thứ 2, 4, 6 - 14:00-15:30',
      location: 'Sân Pickleball Quận 7',
      coach: 'Huấn luyện viên Nguyễn Văn A',
      currentStudents: 5,
      maxStudents: 5,
      progress: 100,
      sessionsCompleted: 8,
      fee: '450.000đ/người',
      feeDetail: '≈ 56.250đ/buổi',
      discount: '100%',
    },
    {
      id: 6,
      name: 'Kỹ thuật serve - Workshop',
      level: 'Intermediate',
      levelColor: 'bg-blue-100 text-blue-800',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBadge: '',
      description: 'Workshop chuyên sâu về kỹ thuật serve',
      sessions: 4,
      schedule: 'Thứ 7 - 15:00-17:00',
      location: 'Sân Pickleball Quận 2',
      coach: 'Huấn luyện viên Trần Thị B',
      currentStudents: 8,
      maxStudents: 8,
      progress: 100,
      sessionsCompleted: 4,
      fee: '300.000đ/người',
      feeDetail: '≈ 75.000đ/buổi',
      discount: '100%',
    },
    {
      id: 7,
      name: 'Pickleball nâng cao - Khóa 0',
      level: 'Advanced',
      levelColor: 'bg-purple-100 text-purple-800',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      statusBadge: '',
      description: 'Khóa học nâng cao cho học viên có kinh nghiệm',
      sessions: 10,
      schedule: 'Thứ 3, 5, 7 - 17:00-18:30',
      location: 'Sân Pickleball Tân Bình',
      coach: 'Huấn luyện viên Lại Đức Hùng',
      currentStudents: 3,
      maxStudents: 4,
      progress: 100,
      sessionsCompleted: 10,
      fee: '1.000.000đ/người',
      feeDetail: '≈ 100.000đ/buổi',
      discount: '100%',
    },
  ];

  const ongoingSchedules = [
    { day: 'Thứ 2', time: '14:00 - 15:30' },
    { day: 'Thứ 4', time: '14:00 - 15:30' },
    { day: 'Thứ 6', time: '14:00 - 15:30' },
    { day: 'Thứ 3', time: '16:00 - 17:30' },
    { day: 'Thứ 5', time: '16:00 - 17:30' },
    { day: 'Thứ 7', time: '16:00 - 17:30' },
  ];

  const priceOptions = [500000, 1000000, 1500000, 2000000, 2500000, 3000000, 5000000, 10000000];

  const calculateEndDate = () => {
    const start = new Date(courseForm.startDate);
    const weeks = Math.ceil(courseForm.totalSessions / courseForm.sessionsPerWeek);
    const end = new Date(start.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
    return end.toLocaleDateString('vi-VN');
  };

  const calculateDuration = () => {
    const weeks = Math.ceil(courseForm.totalSessions / courseForm.sessionsPerWeek);
    return `${weeks} tuần`;
  };

  const handleFormChange = (field: any, value: any) => {
    setCourseForm((prev) => ({ ...prev, [field]: value }));
  };

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'ongoing' && course.status === 'ongoing') ||
      (activeTab === 'completed' && course.status === 'completed');
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const CourseCard = ({ course }: any) => (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '24px',
        marginBottom: '20px',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#1a1a1a' }}>
              {course.name}
            </h3>
            <span
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: course.status === 'ongoing' ? '#f6ffed' : '#f5f5f5',
                color: course.status === 'ongoing' ? '#52c41a' : '#8c8c8c',
                border: `1px solid ${course.status === 'ongoing' ? '#b7eb8f' : '#d9d9d9'}`,
              }}
            >
              {course.statusText}
            </span>
            {course.statusBadge && (
              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: '#fff2f0',
                  color: '#ff4d4f',
                  border: '1px solid #ffccc7',
                }}
              >
                {course.statusBadge}
              </span>
            )}
          </div>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: course.levelColor.includes('green')
                ? '#f6ffed'
                : course.levelColor.includes('blue')
                  ? '#e6f7ff'
                  : '#f9f0ff',
              color: course.levelColor.includes('green')
                ? '#52c41a'
                : course.levelColor.includes('blue')
                  ? '#1890ff'
                  : '#722ed1',
              border: `1px solid ${course.levelColor.includes('green') ? '#b7eb8f' : course.levelColor.includes('blue') ? '#91d5ff' : '#d3adf7'}`,
            }}
          >
            {course.level}
          </span>
        </div>
      </div>

      <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>{course.description}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📅</span>
          <span style={{ fontSize: '14px', color: '#666' }}>{course.sessions} tuần</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>⏰</span>
          <span style={{ fontSize: '14px', color: '#1890ff', fontWeight: '500' }}>
            {course.schedule}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📍</span>
          <span style={{ fontSize: '14px', color: '#666' }}>{course.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>👤</span>
          <span style={{ fontSize: '14px', color: '#666' }}>{course.coach}</span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
          }}
        >
          <span style={{ color: '#666' }}>Sĩ số:</span>
          <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
            {course.currentStudents}/{course.maxStudents} học viên
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
              width: `${(course.currentStudents / course.maxStudents) * 100}%`,
            }}
          />
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>
          {course.sessionsCompleted} buổi học
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Học phí:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
              {course.fee}
            </span>
            <span
              style={{
                padding: '4px 8px',
                backgroundColor: '#e6f7ff',
                color: '#1890ff',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
              }}
            >
              {course.discount}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>{course.feeDetail}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              // Đóng tất cả modal khác trước khi mở modal xem chi tiết
              setIsModalVisible(false);
              setIsManageModalVisible(false);
              setIsExerciseModalVisible(false);
              setSelectedExercise(null);
              setSelectedSubmission(null);
              setSelectedCourse(course);
              setIsDetailModalVisible(true);
            }}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(24, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(24, 144, 255, 0.3)';
            }}
          >
            👁️ Xem chi tiết
          </button>
          <button
            onClick={() => {
              // Đóng tất cả modal khác trước khi mở modal quản lý
              setIsModalVisible(false);
              setIsDetailModalVisible(false);
              setIsExerciseModalVisible(false);
              setSelectedExercise(null);
              setSelectedSubmission(null);
              setSelectedCourse(course);
              setIsManageModalVisible(true);
            }}
            style={{
              padding: '10px 16px',
              background: 'white',
              color: '#1890ff',
              border: '2px solid #1890ff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e6f7ff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ⚙️ Quản lý
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Content */}
      <div style={{ padding: '24px 48px' }}>
        {/* Title and Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: 0,
                marginBottom: '8px',
                color: '#1a1a1a',
              }}
            >
              Quản lý khóa học
            </h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Quản lý và theo dõi các khóa học
            </p>
          </div>
          <button
            onClick={() => {
              // Đóng tất cả modal khác trước khi mở modal tạo khóa học
              setIsDetailModalVisible(false);
              setIsManageModalVisible(false);
              setIsExerciseModalVisible(false);
              setSelectedCourse(null);
              setSelectedExercise(null);
              setSelectedSubmission(null);
              setIsModalVisible(true);
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
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
            ➕ Tạo khóa học
          </button>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '28px',
                    backgroundColor: stat.color.includes('blue')
                      ? '#e6f7ff'
                      : stat.color.includes('green')
                        ? '#f6ffed'
                        : stat.color.includes('purple')
                          ? '#f9f0ff'
                          : stat.color.includes('orange')
                            ? '#fff7e6'
                            : '#f5f5f5',
                    color: stat.color.includes('blue')
                      ? '#1890ff'
                      : stat.color.includes('green')
                        ? '#52c41a'
                        : stat.color.includes('purple')
                          ? '#722ed1'
                          : stat.color.includes('orange')
                            ? '#fa8c16'
                            : '#666',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  {stat.title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '24px',
            border: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '16px 24px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                position: 'relative',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: activeTab === 'all' ? '#1890ff' : '#666',
                borderBottom: activeTab === 'all' ? '3px solid #1890ff' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'all') {
                  e.currentTarget.style.color = '#1a1a1a';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'all') {
                  e.currentTarget.style.color = '#666';
                }
              }}
            >
              📚 Tất cả khóa học{' '}
              <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '500' }}>7</span>
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              style={{
                padding: '16px 24px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                position: 'relative',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: activeTab === 'ongoing' ? '#1890ff' : '#666',
                borderBottom:
                  activeTab === 'ongoing' ? '3px solid #1890ff' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'ongoing') {
                  e.currentTarget.style.color = '#1a1a1a';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'ongoing') {
                  e.currentTarget.style.color = '#666';
                }
              }}
            >
              ⏰ Đang diễn ra{' '}
              <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '500' }}>4</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              style={{
                padding: '16px 24px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                position: 'relative',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: activeTab === 'completed' ? '#1890ff' : '#666',
                borderBottom:
                  activeTab === 'completed' ? '3px solid #1890ff' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'completed') {
                  e.currentTarget.style.color = '#1a1a1a';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'completed') {
                  e.currentTarget.style.color = '#666';
                }
              }}
            >
              ✓ Đã hoàn thành{' '}
              <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '500' }}>3</span>
            </button>
          </div>

          {/* Search */}
          <div style={{ padding: '24px' }}>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '16px',
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fafafa',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(24, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Course List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Create Course Modal */}
      {isModalVisible && (
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
            zIndex: 1003,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Tạo Khóa Học Mới</h2>
              <button
                onClick={() => setIsModalVisible(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-2">
                    Tên khóa học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Pickleball cơ bản cho người mới bắt đầu"
                    value={courseForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      !courseForm.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {!courseForm.name && (
                    <p className="text-red-500 text-xs mt-1">Tên khóa học là bắt buộc</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Trình độ</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => handleFormChange('level', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Cơ bản</option>
                    <option value="intermediate">Trung bình</option>
                    <option value="advanced">Nâng cao</option>
                  </select>
                </div>
              </div>

              {/* Course Type */}
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <div className="font-medium mb-4">Loại hình khóa học</div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleFormChange('type', 'individual')}
                    className={`p-5 border-2 rounded-lg transition-all ${
                      courseForm.type === 'individual'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">Cá nhân (1 người)</div>
                    <div className="text-gray-600 text-sm">Huấn luyện 1-1, hiệu quả cao nhất</div>
                  </button>
                  <button
                    onClick={() => handleFormChange('type', 'group')}
                    className={`p-5 border-2 rounded-lg transition-all ${
                      courseForm.type === 'group'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">Nhóm (2-6 người)</div>
                    <div className="text-gray-600 text-sm">Học theo nhóm, chi phí tiết kiệm</div>
                  </button>
                </div>
              </div>

              {/* Schedule and Duration */}
              <div className="bg-green-50 p-5 rounded-lg mb-6">
                <div className="font-medium mb-4 flex items-center gap-2">
                  <span>📅</span>
                  Lịch học và thời lượng
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tổng số buổi học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={courseForm.totalSessions}
                      onChange={(e) =>
                        handleFormChange('totalSessions', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Số buổi mỗi tuần <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={courseForm.sessionsPerWeek}
                      onChange={(e) =>
                        handleFormChange('sessionsPerWeek', parseInt(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 buổi/tuần</option>
                      <option value="2">2 buổi/tuần</option>
                      <option value="3">3 buổi/tuần</option>
                      <option value="4">4 buổi/tuần</option>
                      <option value="5">5 buổi/tuần</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={courseForm.startDate}
                      onChange={(e) => handleFormChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between mb-2">
                    <span>Ngày kết thúc dự kiến:</span>
                    <span className="font-bold text-green-600">{calculateEndDate()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng thời gian học:</span>
                    <span className="font-bold text-green-600">{calculateDuration()}</span>
                  </div>
                </div>
              </div>

              {/* Add Schedule */}
              <div className="mb-6">
                <div className="font-medium mb-4">Thêm lịch học</div>
                <div className="grid grid-cols-12 gap-4 mb-4">
                  <div className="col-span-4">
                    <label className="block text-sm mb-2">Thứ</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Chọn thứ</option>
                      <option value="2">Thứ 2</option>
                      <option value="3">Thứ 3</option>
                      <option value="4">Thứ 4</option>
                      <option value="5">Thứ 5</option>
                      <option value="6">Thứ 6</option>
                      <option value="7">Thứ 7</option>
                      <option value="cn">Chủ nhật</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm mb-2">Bắt đầu</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Chọn giờ</option>
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm mb-2">Kết thúc</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Chọn giờ</option>
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm mb-2">&nbsp;</label>
                    <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      ➕ Thêm
                    </button>
                  </div>
                </div>

                {/* Ongoing Schedules Alert */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 font-medium mb-3">
                    <span>⚠️</span>
                    <span>Lịch các khóa học đang diễn ra</span>
                  </div>
                  <div className="space-y-2">
                    {ongoingSchedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="bg-yellow-100 border border-yellow-300 rounded p-3 flex items-center gap-3"
                      >
                        <span>📅</span>
                        <span className="font-semibold">{schedule.day}</span>
                        <span>{schedule.time}</span>
                      </div>
                    ))}
                    <p className="text-xs text-orange-600 mt-2">
                      * Vui lòng tránh chọn thời gian trùng với lịch đã có
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Mô tả khóa học</label>
                <textarea
                  rows={4}
                  placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học này..."
                  value={courseForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 p-5 rounded-lg mb-6">
                <div className="font-medium mb-4 flex items-center gap-2">
                  <span>💰</span>
                  Giá khóa học
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-2">
                    Giá khóa học <span className="text-red-500">*</span> (Nhóm{' '}
                    {courseForm.type === 'group' ? '4' : '1'} người)
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {priceOptions.map((price) => (
                    <button
                      key={price}
                      onClick={() => handleFormChange('price', price)}
                      className={`px-4 py-3 border-2 rounded-lg transition-all ${
                        courseForm.price === price
                          ? 'border-blue-500 bg-blue-100 text-blue-700'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {price >= 1000000 ? `${price / 1000000} triệu` : `${price / 1000}k`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={courseForm.price}
                  onChange={(e) => handleFormChange('price', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                    !courseForm.price
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {!courseForm.price && (
                  <p className="text-red-500 text-xs mt-1">Giá khóa học là bắt buộc</p>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  💡 Bước giá: 100,000đ. Bạn có thể chọn nhanh các mức giá phổ biến hoặc nhập giá
                  tùy chỉnh.
                </p>

                {/* Price Preview */}
                {courseForm.price > 0 && (
                  <div className="mt-4 p-4 bg-white border-2 border-green-500 rounded-lg">
                    <div className="text-center">
                      <div className="text-green-700 font-medium mb-2">
                        Khóa học nhóm ({courseForm.type === 'group' ? '4' : '1'} người)
                      </div>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {courseForm.price.toLocaleString()}đ
                      </div>
                      <div className="text-sm text-gray-600">
                        Tổng {courseForm.totalSessions} buổi
                      </div>
                      <div className="text-sm text-gray-600">
                        {(courseForm.price / courseForm.totalSessions).toLocaleString()}đ/buổi
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  👁️ {showPreview ? 'Ẩn xem trước' : 'Xem trước khóa học'}
                </button>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="border-2 border-blue-500 rounded-lg p-6 mb-6 bg-blue-50">
                  <h3 className="text-xl font-bold mb-4">Xem trước khóa học</h3>
                  <div className="bg-white rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="text-lg font-semibold">{courseForm.name || 'Khóa học mới'}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {courseForm.level === 'beginner'
                          ? 'Cơ bản'
                          : courseForm.level === 'intermediate'
                            ? 'Trung bình'
                            : 'Nâng cao'}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {courseForm.type === 'group' ? 'Nhóm 4 người' : 'Cá nhân'}
                      </span>
                    </div>

                    {courseForm.description && (
                      <p className="text-gray-600 mb-4">{courseForm.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span>📅</span>
                        <span>Lịch học:</span>
                        <span className="text-blue-600">
                          {courseForm.sessionsPerWeek} buổi/tuần
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>📚</span>
                        <span>Tổng số buổi:</span>
                        <span className="font-semibold">{courseForm.totalSessions} buổi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>📅</span>
                        <span>Bắt đầu:</span>
                        <span className="font-semibold">
                          {new Date(courseForm.startDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>🏁</span>
                        <span>Kết thúc:</span>
                        <span className="font-semibold">{calculateEndDate()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>⏱️</span>
                        <span>Thời lượng:</span>
                        <span className="font-semibold">{calculateDuration()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>👥</span>
                        <span>Số học viên tối đa:</span>
                        <span className="font-semibold">
                          {courseForm.type === 'group' ? '4' : '1'} người
                        </span>
                      </div>
                    </div>

                    {courseForm.price > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Học phí:</div>
                            <div className="text-2xl font-bold text-green-600">
                              {courseForm.price.toLocaleString()}đ/người
                            </div>
                            <div className="text-xs text-gray-500">
                              ≈ {(courseForm.price / courseForm.totalSessions).toLocaleString()}
                              đ/buổi
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setIsModalVisible(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle create course
                  console.log('Creating course:', courseForm);
                  setIsModalVisible(false);
                }}
                disabled={!courseForm.name || !courseForm.price}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  !courseForm.name || !courseForm.price
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Tạo khóa học
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {isDetailModalVisible && selectedCourse && (
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
            zIndex: 1002,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1000px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
              <button
                onClick={() => {
                  setIsDetailModalVisible(false);
                  setSelectedCourse(null);
                  setExpandedSessions({});
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* General Info Section */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Thông tin chung</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảng viên:</span>
                      <span className="font-medium">{selectedCourse.coach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span className="font-medium">{selectedCourse.sessions} tuần</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số buổi:</span>
                      <span className="font-medium">{selectedCourse.sessionsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trình độ:</span>
                      <span className="font-medium">{selectedCourse.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lịch học:</span>
                      <span className="font-medium">{selectedCourse.schedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Địa điểm:</span>
                      <span className="font-medium">{selectedCourse.location}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Thông tin lớp học</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lượng học viên:</span>
                      <span className="font-medium">{selectedCourse.maxStudents} người</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đã đăng ký:</span>
                      <span className="font-medium">{selectedCourse.currentStudents} học viên</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá cơ bản:</span>
                      <span className="font-medium text-green-600">
                        {selectedCourse.fee.split('/')[0]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Đánh giá:</span>
                      <span className="font-medium flex items-center gap-1">⭐ 4.8/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {selectedCourse.statusText}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tiến độ:</span>
                        <span className="font-medium">{selectedCourse.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${selectedCourse.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Mô tả khóa học</h3>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>

              {/* Course Content */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Nội dung khóa học</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <span className="font-medium">Kỹ thuật cơ bản</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <span className="font-medium">Luật chơi</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <span className="font-medium">Thực hành</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <span className="font-medium">Thi đấu</span>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Thông tin học viên</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: Math.min(selectedCourse.currentStudents, 4) }, (_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {['NVA', 'TVB', 'LTC', 'PVD'][i]}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {['Nguyễn Văn A', 'Trần Văn B', 'Lê Thị C', 'Phạm Văn D'][i]}
                        </div>
                        <div className="text-sm text-gray-600">
                          {
                            [
                              'nguyenvana@email.com',
                              'student@email.com',
                              'student@email.com',
                              'student@email.com',
                            ][i]
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          {['0901234567', '0123456789', '0123456789', '0123456789'][i]}
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">👁️</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Chi tiết các buổi học</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Session 1: Introduction', duration: 45 },
                    { title: 'Session 2: Fundamentals', duration: 60 },
                    { title: 'Session 3: Advanced Topics', duration: 90 },
                  ].map((session, index) => (
                    <div key={index} className="border rounded-lg">
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          setExpandedSessions((prev: any) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{session.title}</div>
                            <div className="text-sm text-gray-600">
                              Địa điểm: {selectedCourse.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              index === 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {index === 0 ? 'Sắp diễn ra' : 'Sắp diễn ra'}
                          </span>
                          <button className="text-gray-500">
                            {expandedSessions[index] ? '▼' : '▶'}
                          </button>
                        </div>
                      </div>

                      {expandedSessions[index] && (
                        <div className="p-4 border-t bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <span>👥</span>
                              <span className="text-sm">
                                Điểm danh: 0/{selectedCourse.maxStudents}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span className="text-sm">{selectedCourse.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>⏰</span>
                              <span className="text-sm">Thời lượng: {session.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>👤</span>
                              <span className="text-sm">Giảng viên: {selectedCourse.coach}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Doanh thu</h3>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-green-700 font-semibold mb-2">
                    Tổng doanh thu: 6.000.000đ
                  </div>
                </div>
              </div>

              {/* Student Reviews */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Đánh giá từ học viên</h3>
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <div className="text-6xl mb-3">⭐</div>
                  <div className="font-semibold text-lg">Chưa có đánh giá</div>
                  <div className="text-gray-600 text-sm">
                    Đánh giá sẽ được hiển thị sau khi khóa học hoàn thành
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 flex justify-end bg-gray-50">
              <button
                onClick={() => {
                  setIsDetailModalVisible(false);
                  setSelectedCourse(null);
                  setExpandedSessions({});
                }}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Submissions Modal */}
      {isExerciseModalVisible && selectedExercise && (
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
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedExercise.title}</h2>
                <p className="text-gray-600 mt-1">
                  {submissions[selectedExercise.id]?.length || 0} học viên đã nộp bài
                </p>
              </div>
              <button
                onClick={() => {
                  setIsExerciseModalVisible(false);
                  setSelectedExercise(null);
                  setSelectedSubmission(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!selectedSubmission ? (
                /* List of submissions */
                <div className="space-y-3">
                  {submissions[selectedExercise.id]?.map((submission: any) => (
                    <div
                      key={submission.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {submission.studentAvatar}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">
                              Nộp lúc: {submission.submittedAt}
                            </div>
                            {submission.aiAnalyzed && submission.aiSummary && (
                              <div className="text-sm text-blue-600 mt-1">
                                🤖 AI: {submission.aiSummary}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {submission.status === 'reviewed' ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                ✓ Đã chấm
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                ⏳ Chờ chấm
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          👁️ Xem & Chấm
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!submissions[selectedExercise.id] ||
                    submissions[selectedExercise.id].length === 0) && (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                      <div className="text-6xl mb-4">📭</div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Chưa có học viên nào nộp bài
                      </h4>
                      <p className="text-gray-600">Các bài nộp sẽ xuất hiện ở đây</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Video comparison view */
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                  >
                    ← Quay lại danh sách
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {selectedSubmission.studentAvatar}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">
                          {selectedSubmission.studentName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Nộp bài: {selectedSubmission.submittedAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Comparison */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Coach Video */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <span>👨‍🏫</span>
                        <span>Video Huấn luyện viên (Mẫu)</span>
                      </h4>
                      <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <video controls className="w-full">
                          <source src={selectedExercise.coachVideoUrl} type="video/mp4" />
                        </video>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">📹 Video mẫu chuẩn</div>
                    </div>

                    {/* Student Video */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                        <span>👤</span>
                        <span>Video Học viên</span>
                      </h4>
                      <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <video controls className="w-full">
                          <source src={selectedSubmission.videoUrl} type="video/mp4" />
                        </video>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">📹 Bài làm của học viên</div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {selectedSubmission.aiAnalyzed && (
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <span>🤖</span>
                          <span>Phân tích từ AI</span>
                        </h4>
                      </div>
                      <div className="p-6">
                        {/* Summary */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h5 className="font-semibold text-blue-800 mb-2">Tóm tắt</h5>
                          <p className="text-gray-700">{selectedSubmission.aiSummary}</p>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-800">Chi tiết So sánh</h5>

                          <div className="space-y-4">
                            {[
                              {
                                aspect: 'Tư thế cầm vợt',
                                coach: 'Cầm vợt với grip chắc chắn, cổ tay thẳng',
                                learner: 'Grip đúng nhưng cổ tay hơi cong',
                                score: 7,
                                improvement: 'Giữ cổ tay thẳng hơn khi chuẩn bị đánh',
                              },
                              {
                                aspect: 'Footwork',
                                coach: 'Di chuyển nhanh, bước chân rộng',
                                learner: 'Bước chân ngắn, chậm hơn',
                                score: 5,
                                improvement: 'Tăng tốc độ di chuyển và mở rộng bước chân',
                              },
                              {
                                aspect: 'Follow-through',
                                coach: 'Vung vợt đầy đủ, kết thúc cao',
                                learner: 'Vung vợt chưa đủ, kết thúc thấp',
                                score: 6,
                                improvement: 'Hoàn thiện động tác vung vợt đến hết',
                              },
                            ].map((item, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h6 className="font-semibold text-gray-800">{item.aspect}</h6>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Điểm:</span>
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                                        item.score >= 8
                                          ? 'bg-green-100 text-green-800'
                                          : item.score >= 6
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {item.score}/10
                                    </span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="text-xs text-blue-600 font-medium mb-1">
                                      👨‍🏫 HUẤN LUYỆN VIÊN
                                    </div>
                                    <p className="text-sm text-gray-700">{item.coach}</p>
                                  </div>
                                  <div className="bg-green-50 rounded-lg p-3">
                                    <div className="text-xs text-green-600 font-medium mb-1">
                                      👤 HỌC VIÊN
                                    </div>
                                    <p className="text-sm text-gray-700">{item.learner}</p>
                                  </div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                  <div className="text-xs text-orange-700 font-medium mb-1">
                                    💡 GỢI Ý CẢI THIỆN
                                  </div>
                                  <p className="text-sm text-gray-700">{item.improvement}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coach Feedback */}
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="bg-green-600 px-6 py-4">
                      <h4 className="font-semibold text-white">✍️ Nhận xét của Coach</h4>
                    </div>
                    <div className="p-6">
                      <textarea
                        rows={6}
                        placeholder="Nhập nhận xét chi tiết của bạn cho học viên..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <div className="mt-4 flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">Điểm tổng:</span>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.5"
                            placeholder="0-10"
                            className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </label>
                        <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500">
                          <option>Đạt yêu cầu</option>
                          <option>Chưa đạt</option>
                          <option>Xuất sắc</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                      ✓ Gửi Feedback & Chấm điểm
                    </button>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      💾 Lưu nháp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Course Modal */}
      {isManageModalVisible && selectedCourse && (
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
            zIndex: 1001,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '1400px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${selectedCourse.status === 'ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {selectedCourse.statusText}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${selectedCourse.levelColor}`}>
                    {selectedCourse.level}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsManageModalVisible(false);
                  setSelectedCourse(null);
                  setManageTab('overview');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6 bg-gray-50">
              <button
                onClick={() => setManageTab('overview')}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  manageTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Tổng quan
              </button>
              <button
                onClick={() => setManageTab('students')}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  manageTab === 'students'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👥 Học viên ({selectedCourse.currentStudents})
              </button>
              <button
                onClick={() => setManageTab('schedule')}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  manageTab === 'schedule'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📅 Lịch học
              </button>
              <button
                onClick={() => setManageTab('exercises')}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  manageTab === 'exercises'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Bài tập
              </button>
              <button
                onClick={() => setManageTab('edit')}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  manageTab === 'edit'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✏️ Chỉnh sửa
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview Tab */}
              {manageTab === 'overview' && (
                <div>
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-3xl mb-2">👥</div>
                      <div className="text-gray-600 text-sm">Học viên</div>
                      <div className="text-2xl font-bold">
                        {selectedCourse.currentStudents}/{selectedCourse.maxStudents}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-3xl mb-2">📚</div>
                      <div className="text-gray-600 text-sm">Buổi học</div>
                      <div className="text-2xl font-bold">{selectedCourse.sessionsCompleted}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-3xl mb-2">⏰</div>
                      <div className="text-gray-600 text-sm">Tiến độ</div>
                      <div className="text-2xl font-bold">{selectedCourse.progress}%</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-3xl mb-2">💰</div>
                      <div className="text-gray-600 text-sm">Doanh thu</div>
                      <div className="text-2xl font-bold">{selectedCourse.fee}</div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="bg-gray-50 p-5 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg mb-4">Thông tin khóa học</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Lịch học</div>
                        <div className="font-medium">{selectedCourse.schedule}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Địa điểm</div>
                        <div className="font-medium">{selectedCourse.location}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Huấn luyện viên</div>
                        <div className="font-medium">{selectedCourse.coach}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Học phí</div>
                        <div className="font-medium text-green-600">{selectedCourse.fee}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white border rounded-lg p-5">
                    <h3 className="font-semibold text-lg mb-3">Mô tả</h3>
                    <p className="text-gray-600">{selectedCourse.description}</p>
                  </div>
                </div>
              )}

              {/* Students Tab */}
              {manageTab === 'students' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Danh sách học viên</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      ➕ Thêm học viên
                    </button>
                  </div>

                  <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            STT
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Họ tên
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Số điện thoại
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Trạng thái
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: selectedCourse.currentStudents }, (_, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">{i + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  👤
                                </div>
                                <span>Học viên {i + 1}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">student{i + 1}@email.com</td>
                            <td className="px-4 py-3">09{Math.floor(Math.random() * 100000000)}</td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Đang học
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-blue-600 hover:text-blue-800">
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {manageTab === 'schedule' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Lịch học chi tiết</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      ➕ Thêm buổi học
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Array.from({ length: selectedCourse.sessionsCompleted }, (_, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg border-2 ${i < selectedCourse.sessionsCompleted - 1 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${i < selectedCourse.sessionsCompleted - 1 ? 'bg-green-500' : 'bg-blue-500'}`}
                            >
                              {i + 1}
                            </div>
                            <div>
                              <div className="font-semibold">Buổi {i + 1}</div>
                              <div className="text-sm text-gray-600">
                                Thứ {2 + (i % 3) * 2} - 14:00-15:30
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(2025, 9, 23 + i * 2).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {i < selectedCourse.sessionsCompleted - 1 ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                ✓ Đã hoàn thành
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                ⏰ Đang học
                              </span>
                            )}
                            <button className="text-blue-600 hover:text-blue-800">Chi tiết</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises Tab */}
              {manageTab === 'exercises' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-xl">Quản lý Bài tập</h3>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md">
                      ➕ Tạo bài tập mới
                    </button>
                  </div>

                  <div className="space-y-4">
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="border-2 rounded-lg p-6 bg-white hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-xl mb-2 text-gray-800">
                              {exercise.title}
                            </h4>
                            <p className="text-gray-600 mb-3">{exercise.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                                📅 Hạn: {exercise.deadline}
                              </span>
                              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                                📊 {exercise.submissionsCount} bài nộp
                              </span>
                              {exercise.hasCoachVideo ? (
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                  ✓ Có video mẫu
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
                                  ⚠ Thiếu video mẫu
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-4 border-t-2">
                          {!exercise.hasCoachVideo ? (
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg">
                              📹 Upload Video Mẫu
                            </button>
                          ) : (
                            <button className="px-6 py-3 bg-green-50 text-green-700 border-2 border-green-500 rounded-lg hover:bg-green-100 transition-all font-medium">
                              👁️ Xem Video Mẫu
                            </button>
                          )}
                          <button
                            onClick={() => {
                              // Đóng modal quản lý trước khi mở modal bài tập
                              setIsManageModalVisible(false);
                              setSelectedExercise(exercise);
                              setIsExerciseModalVisible(true);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
                          >
                            📋 Xem Bài Nộp ({exercise.submissionsCount})
                          </button>
                          <button className="px-6 py-3 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-200 transition-all font-medium">
                            ✏️ Chỉnh Sửa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {exercises.length === 0 && (
                    <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                      <div className="text-6xl mb-4">📝</div>
                      <h4 className="text-xl font-bold text-gray-700 mb-2">Chưa có bài tập nào</h4>
                      <p className="text-gray-600 mb-6">Tạo bài tập đầu tiên cho khóa học này</p>
                      <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-md">
                        ➕ Tạo Bài Tập Mới
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Tab */}
              {manageTab === 'comparison' && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">So sánh Kỹ thuật Video</h3>
                  <p className="text-gray-600 mb-6">
                    Tải lên video của huấn luyện viên và học viên để AI phân tích và so sánh kỹ
                    thuật
                  </p>

                  {/* Upload Areas */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Learner Video */}
                    <div>
                      <h4 className="font-medium mb-3 text-gray-700">Video Học viên</h4>
                      {!learnerVideo ? (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="text-6xl mb-3">📹</div>
                            <p className="mb-2 text-sm text-gray-600 font-medium">
                              Tải lên Video của Học viên
                            </p>
                            <p className="text-xs text-gray-500">hoặc kéo và thả</p>
                            <p className="text-xs text-gray-400 mt-2">MP4, MOV, AVI tối đa 50MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={(e: any) => {
                              if (e.target.files && e.target.files[0]) {
                                setLearnerVideo(e.target.files[0]);
                                setComparisonResult(null);
                                setAnalysisError(null);
                              }
                            }}
                          />
                        </label>
                      ) : (
                        <div className="bg-white border-2 border-green-500 rounded-lg p-4">
                          <video
                            controls
                            src={URL.createObjectURL(learnerVideo)}
                            className="w-full rounded-md mb-2"
                          />
                          <p className="text-sm text-gray-600 truncate mb-2">
                            📁 {learnerVideo.name}
                          </p>
                          <button
                            onClick={() => setLearnerVideo(null)}
                            className="w-full px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                          >
                            🗑️ Xóa video
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Coach Video */}
                    <div>
                      <h4 className="font-medium mb-3 text-gray-700">Video Huấn luyện viên</h4>
                      {!coachVideo ? (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="text-6xl mb-3">📹</div>
                            <p className="mb-2 text-sm text-gray-600 font-medium">
                              Tải lên Video của Huấn luyện viên
                            </p>
                            <p className="text-xs text-gray-500">hoặc kéo và thả</p>
                            <p className="text-xs text-gray-400 mt-2">MP4, MOV, AVI tối đa 50MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setCoachVideo(e.target.files[0]);
                                setComparisonResult(null);
                                setAnalysisError(null);
                              }
                            }}
                          />
                        </label>
                      ) : (
                        <div className="bg-white border-2 border-blue-500 rounded-lg p-4">
                          <video
                            controls
                            src={URL.createObjectURL(coachVideo)}
                            className="w-full rounded-md mb-2"
                          />
                          <p className="text-sm text-gray-600 truncate mb-2">
                            📁 {coachVideo.name}
                          </p>
                          <button
                            onClick={() => setCoachVideo(null)}
                            className="w-full px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                          >
                            🗑️ Xóa video
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <div className="text-center mb-6">
                    <button
                      onClick={() => {
                        if (coachVideo && learnerVideo) {
                          setIsAnalyzing(true);
                          setAnalysisError(null);
                          // Simulate API call
                          setTimeout(() => {
                            setComparisonResult({
                              summary:
                                'Phân tích đã hoàn tất. Học viên có tư thế cầm vợt tốt nhưng cần cải thiện chuyển động chân.',
                              differences: [
                                {
                                  aspect: 'Tư thế cầm vợt',
                                  coach: 'Cầm vợt với grip chắc chắn, cổ tay thẳng',
                                  learner: 'Grip đúng nhưng cổ tay hơi cong',
                                  improvement: 'Giữ cổ tay thẳng hơn khi chuẩn bị đánh',
                                },
                                {
                                  aspect: 'Footwork',
                                  coach: 'Di chuyển nhanh, bước chân rộng',
                                  learner: 'Bước chân ngắn, chậm hơn',
                                  improvement: 'Tăng tốc độ di chuyển và mở rộng bước chân',
                                },
                                {
                                  aspect: 'Follow-through',
                                  coach: 'Vung vợt đầy đủ, kết thúc cao',
                                  learner: 'Vung vợt chưa đủ, kết thúc thấp',
                                  improvement: 'Hoàn thiện động tác vung vợt đến hết',
                                },
                              ],
                            });
                            setIsAnalyzing(false);
                          }, 3000);
                        }
                      }}
                      disabled={!coachVideo || !learnerVideo || isAnalyzing}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isAnalyzing ? '⏳ Đang so sánh...' : '🔍 So sánh Kỹ thuật'}
                    </button>
                  </div>

                  {/* Loading */}
                  {isAnalyzing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-blue-700 font-medium">AI Coach đang phân tích video...</p>
                      <p className="text-blue-600 text-sm mt-2">
                        Quá trình này có thể mất vài giây
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {analysisError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{analysisError}</p>
                    </div>
                  )}

                  {/* Results */}
                  {comparisonResult && !isAnalyzing && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <span>✅</span>
                          <span>Tóm tắt So sánh</span>
                        </h4>
                        <p className="text-green-700">{comparisonResult.summary}</p>
                      </div>

                      <div className="bg-white border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                          <h4 className="font-semibold text-gray-800">Chi tiết Phân tích</h4>
                        </div>
                        <div className="divide-y">
                          {comparisonResult.differences.map((diff: any, index: number) => (
                            <div key={index} className="p-6">
                              <h5 className="font-semibold text-gray-800 mb-4">{diff.aspect}</h5>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <div className="text-xs text-blue-600 font-medium mb-2">
                                    👨‍🏫 HUẤN LUYỆN VIÊN
                                  </div>
                                  <p className="text-sm text-gray-700">{diff.coach}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                  <div className="text-xs text-green-600 font-medium mb-2">
                                    👤 HỌC VIÊN
                                  </div>
                                  <p className="text-sm text-gray-700">{diff.learner}</p>
                                </div>
                              </div>
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="text-xs text-orange-700 font-medium mb-2">
                                  💡 GỢI Ý CẢI THIỆN
                                </div>
                                <p className="text-sm text-gray-700">{diff.improvement}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          💾 Lưu Phân tích
                        </button>
                        <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          📧 Gửi cho Học viên
                        </button>
                        <button
                          onClick={() => {
                            setCoachVideo(null);
                            setLearnerVideo(null);
                            setComparisonResult(null);
                          }}
                          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          🔄 So sánh mới
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!coachVideo && !learnerVideo && !comparisonResult && !isAnalyzing && (
                    <div className="bg-gray-50 rounded-lg p-12 text-center">
                      <div className="text-6xl mb-4">🎥</div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        So sánh Kỹ thuật Video
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Tải lên hai video để AI phân tích và so sánh chi tiết
                      </p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>• AI sẽ phân tích tư thế, chuyển động và kỹ thuật</p>
                        <p>• Nhận được gợi ý cải thiện cụ thể</p>
                        <p>• Lưu và chia sẻ kết quả với học viên</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Tab */}
              {manageTab === 'edit' && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Chỉnh sửa thông tin khóa học</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên khóa học</label>
                      <input
                        type="text"
                        defaultValue={selectedCourse.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mô tả</label>
                      <textarea
                        rows={4}
                        defaultValue={selectedCourse.description}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Địa điểm</label>
                        <input
                          type="text"
                          defaultValue={selectedCourse.location}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Học phí</label>
                        <input
                          type="text"
                          defaultValue={selectedCourse.fee}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Số học viên tối đa</label>
                        <input
                          type="number"
                          defaultValue={selectedCourse.maxStudents}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Trình độ</label>
                        <select
                          defaultValue={selectedCourse.level}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        💾 Lưu thay đổi
                      </button>
                      <button className="px-6 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        🗑️ Xóa khóa học
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-6 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={() => {
                  setIsManageModalVisible(false);
                  setSelectedCourse(null);
                  setManageTab('overview');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
