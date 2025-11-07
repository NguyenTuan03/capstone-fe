interface CourseCardProps {
  course: any;
  setIsModalVisible: (visible: boolean) => void;
  setIsManageModalVisible: (visible: boolean) => void;
  setIsExerciseModalVisible: (visible: boolean) => void;
  setIsAIFeedbackModalVisible: (visible: boolean) => void;
  setSelectedExercise: (exercise: any) => void;
  setSelectedSubmission: (submission: any) => void;
  setSelectedCourse: (course: any) => void;
  setIsDetailModalVisible: (visible: boolean) => void;
}
export const CourseCard = ({
  course,
  setIsModalVisible,
  setIsManageModalVisible,
  setIsExerciseModalVisible,
  setIsAIFeedbackModalVisible,
  setSelectedExercise,
  setSelectedSubmission,
  setSelectedCourse,
  setIsDetailModalVisible,
}: CourseCardProps) => (
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
            backgroundColor:
              course.levelColor && course.levelColor.includes('green')
                ? '#f6ffed'
                : course.levelColor && course.levelColor.includes('blue')
                  ? '#e6f7ff'
                  : '#f9f0ff',
            color:
              course.levelColor && course.levelColor.includes('green')
                ? '#52c41a'
                : course.levelColor && course.levelColor.includes('blue')
                  ? '#1890ff'
                  : '#722ed1',
            border: `1px solid ${
              course.levelColor && course.levelColor.includes('green')
                ? '#b7eb8f'
                : course.levelColor && course.levelColor.includes('blue')
                  ? '#91d5ff'
                  : '#d3adf7'
            }`,
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
            setIsAIFeedbackModalVisible(false);
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
            setIsAIFeedbackModalVisible(false);
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
