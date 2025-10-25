'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Row, Col, Card, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  FireOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface StatsCard {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  highlight?: number;
}

// Pre-define all stats data to avoid recreation on every render
const STATS_DATA: Record<string, StatsCard[]> = {
  dashboard: [
    {
      title: 'Tổng số HLV',
      value: 2,
      subtitle: '1 đã được duyệt',
      icon: <TeamOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'HLV chờ duyệt',
      value: 1,
      subtitle: 'Cần kiểm duyệt',
      icon: <UserOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 1,
    },
    {
      title: 'Tổng nội dung',
      value: 5,
      subtitle: '2 đã được duyệt',
      icon: <FileTextOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Nội dung chờ duyệt',
      value: 3,
      subtitle: 'Cần kiểm duyệt',
      icon: <ExclamationCircleOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 3,
    },
    {
      title: 'Tổng khóa học',
      value: 16,
      subtitle: '2 đã được duyệt',
      icon: <BookOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Khóa học đang diễn ra',
      value: 6,
      subtitle: 'Đang hoạt động',
      icon: <PlayCircleOutlined className="text-2xl" />,
      color: '#e6f7ff',
      highlight: 6,
    },
  ],
  coaches: [
    {
      title: 'Tổng số HLV',
      value: 45,
      subtitle: '40 đang hoạt động',
      icon: <TeamOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'HLV chờ duyệt',
      value: 8,
      subtitle: 'Cần xác minh',
      icon: <UserOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 8,
    },
    {
      title: 'HLV đã xác minh',
      value: 35,
      subtitle: 'Đã được phê duyệt',
      icon: <TeamOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'HLV bị tạm ngưng',
      value: 2,
      subtitle: 'Cần xem xét',
      icon: <ExclamationCircleOutlined className="text-2xl" />,
      color: '#fff1f0',
      highlight: 2,
    },
    {
      title: 'Đánh giá trung bình',
      value: 4.8,
      subtitle: 'Trên 5.0 sao',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Tổng buổi học',
      value: 328,
      subtitle: 'Đã hoàn thành',
      icon: <BarChartOutlined className="text-2xl" />,
      color: '#e6f7ff',
      highlight: 328,
    },
  ],
  'course-verification': [
    {
      title: 'Tổng nội dung',
      value: 120,
      subtitle: 'Tất cả khóa học',
      icon: <FileTextOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Chờ kiểm duyệt',
      value: 15,
      subtitle: 'Cần xem xét',
      icon: <ExclamationCircleOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 15,
    },
    {
      title: 'Đã phê duyệt',
      value: 95,
      subtitle: 'Đang hoạt động',
      icon: <FileTextOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Bị từ chối',
      value: 10,
      subtitle: 'Cần chỉnh sửa',
      icon: <ExclamationCircleOutlined className="text-2xl" />,
      color: '#fff1f0',
      highlight: 10,
    },
    {
      title: 'Video bài giảng',
      value: 280,
      subtitle: 'Đã tải lên',
      icon: <PlayCircleOutlined className="text-2xl" />,
      color: '#e6f7ff',
    },
    {
      title: 'Tài liệu đính kèm',
      value: 156,
      subtitle: 'Files PDF/DOC',
      icon: <FileTextOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
  ],
  curriculum: [
    {
      title: 'Tổng khóa học',
      value: 45,
      subtitle: '40 đang mở',
      icon: <BookOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Khóa học mới',
      value: 5,
      subtitle: 'Trong tháng này',
      icon: <BookOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 5,
    },
    {
      title: 'Tổng chương',
      value: 180,
      subtitle: 'Nội dung học',
      icon: <FileTextOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Tổng bài học',
      value: 520,
      subtitle: 'Video và tài liệu',
      icon: <PlayCircleOutlined className="text-2xl" />,
      color: '#e6f7ff',
    },
    {
      title: 'Bài kiểm tra',
      value: 95,
      subtitle: 'Quiz và bài tập',
      icon: <FileTextOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Học viên tham gia',
      value: 1250,
      subtitle: 'Đang học tập',
      icon: <UserOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
  ],
  users: [
    {
      title: 'Tổng người dùng',
      value: 2450,
      subtitle: '2100 đang hoạt động',
      icon: <UserOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Người dùng mới',
      value: 125,
      subtitle: 'Tháng này',
      icon: <UserOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 125,
    },
    {
      title: 'Học viên',
      value: 2200,
      subtitle: 'Đang học tập',
      icon: <UserOutlined className="text-2xl" />,
      color: '#e6f7ff',
    },
    {
      title: 'Huấn luyện viên',
      value: 45,
      subtitle: 'Đang giảng dạy',
      icon: <TeamOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Tài khoản bị khóa',
      value: 15,
      subtitle: 'Vi phạm quy định',
      icon: <ExclamationCircleOutlined className="text-2xl" />,
      color: '#fff1f0',
      highlight: 15,
    },
    {
      title: 'Đăng ký hôm nay',
      value: 8,
      subtitle: 'Người dùng mới',
      icon: <UserOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 8,
    },
  ],
  achievements: [
    {
      title: 'Tổng thành tựu',
      value: 48,
      subtitle: 'Đã tạo',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Thành tựu mới',
      value: 3,
      subtitle: 'Tháng này',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 3,
    },
    {
      title: 'Đã mở khóa',
      value: 3520,
      subtitle: 'Lượt đạt được',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#e6f7ff',
    },
    {
      title: 'Thành tựu hiếm',
      value: 8,
      subtitle: 'Khó đạt được',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#fff1f0',
    },
    {
      title: 'Người hoàn thành nhiều nhất',
      value: 42,
      subtitle: 'Thành tựu cao nhất',
      icon: <UserOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Đạt trong tuần',
      value: 156,
      subtitle: 'Lượt mở khóa',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 156,
    },
  ],
  statistics: [
    {
      title: 'Doanh thu tháng',
      value: 125000000,
      subtitle: '+15% so với tháng trước',
      icon: <BarChartOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Buổi học hoàn thành',
      value: 856,
      subtitle: 'Trong tháng',
      icon: <PlayCircleOutlined className="text-2xl" />,
      color: '#e6f7ff',
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value: 87,
      subtitle: 'Phần trăm',
      icon: <BarChartOutlined className="text-2xl" />,
      color: '#f5f5f5',
    },
    {
      title: 'Đánh giá trung bình',
      value: 4.8,
      subtitle: 'Trên 5.0 sao',
      icon: <TrophyOutlined className="text-2xl" />,
      color: '#fff7e6',
    },
    {
      title: 'Người dùng hoạt động',
      value: 2100,
      subtitle: 'Trong 7 ngày',
      icon: <UserOutlined className="text-2xl" />,
      color: '#e6f7ff',
    },
    {
      title: 'Tăng trưởng',
      value: 22,
      subtitle: '% so với tháng trước',
      icon: <BarChartOutlined className="text-2xl" />,
      color: '#fff7e6',
      highlight: 22,
    },
  ],
};

const AdminHeader = React.memo(() => {
  const pathname = usePathname();
  const [coachStats, setCoachStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [courseStats, setCourseStats] = useState<any>(null);
  const [contentStats, setContentStats] = useState<any>(null);
  const [achievementStats, setAchievementStats] = useState<any>(null);

  // Load real coach stats from mock data
  useEffect(() => {
    const loadCoachStats = async () => {
      try {
        const { coachEntities } = await import('@/data_admin/new-coaches');

        const totalCoaches = coachEntities.length;
        const pendingCoaches = coachEntities.filter(
          (c) => c.verificationStatus === 'PENDING',
        ).length;
        const verifiedCoaches = coachEntities.filter(
          (c) => c.verificationStatus === 'VERIFIED',
        ).length;
        const rejectedCoaches = coachEntities.filter(
          (c) => c.verificationStatus === 'REJECTED',
        ).length;

        // Calculate average rating (assuming rating between 4-5)
        const avgRating = 4.5;

        // Get total sessions from courses
        const totalSessions = Math.floor(Math.random() * 500) + 300; // TODO: Calculate from real sessions data

        setCoachStats({
          total: totalCoaches,
          pending: pendingCoaches,
          verified: verifiedCoaches,
          rejected: rejectedCoaches,
          avgRating: avgRating,
          totalSessions: totalSessions,
        });
      } catch (error) {
        console.error('Error loading coach stats:', error);
      }
    };

    const loadUserStats = async () => {
      try {
        const { users } = await import('@/data_admin/users');

        const totalUsers = users.length;
        const activeUsers = users.filter((u) => u.isActive).length;
        const inactiveUsers = users.filter((u) => !u.isActive).length;
        const totalLearners = users.filter((u) => u.role.name === 'LEARNER').length;
        const totalCoaches = users.filter((u) => u.role.name === 'COACH').length;
        const blockedUsers = 0; // TODO: Add blocked status separate from inactive

        // Calculate new users this month (January 2024)
        const currentMonth = new Date('2024-01-26'); // Current mock date
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const newUsersThisMonth = users.filter((u) => {
          const createdDate = new Date(u.createdAt);
          return createdDate >= startOfMonth && createdDate <= currentMonth;
        }).length;

        setUserStats({
          total: totalUsers,
          active: activeUsers,
          learners: totalLearners,
          coaches: totalCoaches,
          blocked: blockedUsers,
          inactive: inactiveUsers,
          newUsers: newUsersThisMonth,
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    const loadCourseStats = async () => {
      try {
        const { courses } = await import('@/data_admin/courses');

        const totalCourses = courses.length;
        const pendingCourses = courses.filter((c) => c.status === 'PENDING_APPROVAL').length;
        const approvedCourses = courses.filter((c) => c.status === 'APPROVED').length;
        const ongoingCourses = courses.filter((c) => c.status === 'ONGOING').length;
        const completedCourses = courses.filter((c) => c.status === 'COMPLETED').length;
        const cancelledCourses = courses.filter((c) => c.status === 'CANCELLED').length;

        setCourseStats({
          total: totalCourses,
          pending: pendingCourses,
          approved: approvedCourses,
          ongoing: ongoingCourses,
          completed: completedCourses,
          cancelled: cancelledCourses,
        });
      } catch (error) {
        console.error('Error loading course stats:', error);
      }
    };

    const loadContentStats = async () => {
      try {
        const { videos } = await import('@/data_admin/videos');
        const { quizzes } = await import('@/data_admin/quizzes');

        const totalVideos = videos.length;
        const pendingVideos = videos.filter((v) => v.status === 'PENDING_APPROVAL').length;
        const approvedVideos = videos.filter((v) => v.status === 'APPROVED').length;
        const rejectedVideos = videos.filter((v) => v.status === 'REJECTED').length;

        const totalQuizzes = quizzes.length;

        setContentStats({
          totalVideos,
          pendingVideos,
          approvedVideos,
          rejectedVideos,
          totalQuizzes,
          totalContent: totalVideos + totalQuizzes,
        });
      } catch (error) {
        console.error('Error loading content stats:', error);
      }
    };

    const loadAchievementStats = async () => {
      try {
        const { achievements } = await import('@/data_admin/achievements');
        const { learnerAchievements } = await import('@/data_admin/learner-achievements');
        const { achievementProgresses } = await import('@/data_admin/achievement-progresses');

        const totalAchievements = achievements.length;
        const activeAchievements = achievements.filter((a) => a.isActive).length;
        const inactiveAchievements = achievements.filter((a) => !a.isActive).length;

        const eventCountAchievements = achievements.filter((a) => a.type === 'EVENT_COUNT').length;
        const propertyCheckAchievements = achievements.filter(
          (a) => a.type === 'PROPERTY_CHECK',
        ).length;
        const streakAchievements = achievements.filter((a) => a.type === 'STREAK').length;

        const totalEarned = learnerAchievements.length;
        const totalInProgress = achievementProgresses.filter(
          (ap) => ap.currentProgress < 100,
        ).length;

        setAchievementStats({
          total: totalAchievements,
          active: activeAchievements,
          inactive: inactiveAchievements,
          eventCount: eventCountAchievements,
          propertyCheck: propertyCheckAchievements,
          streak: streakAchievements,
          totalEarned,
          totalInProgress,
        });
      } catch (error) {
        console.error('Error loading achievement stats:', error);
      }
    };

    if (pathname.includes('coaches')) {
      loadCoachStats();
    } else if (pathname.includes('users')) {
      loadUserStats();
    } else if (pathname.includes('curriculum')) {
      loadCourseStats();
    } else if (pathname.includes('course-verification')) {
      loadContentStats();
    } else if (pathname.includes('achievements')) {
      loadAchievementStats();
    }
  }, [pathname]);

  // Get stats cards based on current route - memoized to prevent recalculation
  const statsCards = useMemo(() => {
    const routeKey = pathname.split('/').pop() || 'dashboard';

    // If on coaches page and stats are loaded, use real data
    if (routeKey === 'coaches' && coachStats) {
      return [
        {
          title: 'Tổng số HLV',
          value: coachStats.total,
          subtitle: `${coachStats.verified} đang hoạt động`,
          icon: <TeamOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'HLV chờ duyệt',
          value: coachStats.pending,
          subtitle: 'Cần xác minh',
          icon: <UserOutlined className="text-2xl" />,
          color: '#fff7e6',
          highlight: coachStats.pending,
        },
        {
          title: 'HLV đã xác minh',
          value: coachStats.verified,
          subtitle: 'Đã được phê duyệt',
          icon: <TeamOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'HLV bị từ chối',
          value: coachStats.rejected,
          subtitle: 'Cần xem xét',
          icon: <ExclamationCircleOutlined className="text-2xl" />,
          color: '#fff1f0',
          highlight: coachStats.rejected,
        },
        {
          title: 'Đánh giá trung bình',
          value: coachStats.avgRating,
          subtitle: 'Trên 5.0 sao',
          icon: <TrophyOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Tổng buổi học',
          value: coachStats.totalSessions,
          subtitle: 'Đã hoàn thành',
          icon: <BarChartOutlined className="text-2xl" />,
          color: '#e6f7ff',
          highlight: coachStats.totalSessions,
        },
      ];
    }

    // If on users page and stats are loaded, use real data
    if (routeKey === 'users' && userStats) {
      return [
        {
          title: 'Tổng người dùng',
          value: userStats.total,
          subtitle: `${userStats.active} đang hoạt động`,
          icon: <UserOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Đang hoạt động',
          value: userStats.active,
          subtitle: 'Người dùng active',
          icon: <TeamOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Học viên',
          value: userStats.learners,
          subtitle: 'Đang học tập',
          icon: <UserOutlined className="text-2xl" />,
          color: '#e6f7ff',
        },
        {
          title: 'Huấn luyện viên',
          value: userStats.coaches,
          subtitle: 'Đang giảng dạy',
          icon: <TrophyOutlined className="text-2xl" />,
          color: '#e6f7ff',
        },
        {
          title: 'Không hoạt động',
          value: userStats.inactive,
          subtitle: 'Tài khoản inactive',
          icon: <ExclamationCircleOutlined className="text-2xl" />,
          color: '#fff1f0',
          highlight: userStats.inactive,
        },
        {
          title: 'Người dùng mới',
          value: userStats.newUsers,
          subtitle: 'Tháng này',
          icon: <UserOutlined className="text-2xl" />,
          color: '#fff7e6',
          highlight: userStats.newUsers,
        },
      ];
    }

    // If on course-verification page and stats are loaded, use real data
    if (routeKey === 'course-verification' && contentStats) {
      return [
        {
          title: 'Tổng nội dung',
          value: contentStats.totalContent,
          subtitle: `${contentStats.totalVideos} video + ${contentStats.totalQuizzes} quiz`,
          icon: <FileTextOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Video chờ duyệt',
          value: contentStats.pendingVideos,
          subtitle: 'Cần xem xét',
          icon: <ExclamationCircleOutlined className="text-2xl" />,
          color: '#fff7e6',
          highlight: contentStats.pendingVideos,
        },
        {
          title: 'Video đã duyệt',
          value: contentStats.approvedVideos,
          subtitle: 'Đã công khai',
          icon: <PlayCircleOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Video bị từ chối',
          value: contentStats.rejectedVideos,
          subtitle: 'Không hợp lệ',
          icon: <StopOutlined className="text-2xl" />,
          color: '#fff1f0',
          highlight: contentStats.rejectedVideos,
        },
        {
          title: 'Tổng Quiz',
          value: contentStats.totalQuizzes,
          subtitle: 'Tất cả quiz',
          icon: <BookOutlined className="text-2xl" />,
          color: '#e6f7ff',
        },
        {
          title: 'Tổng Video',
          value: contentStats.totalVideos,
          subtitle: 'Tất cả video',
          icon: <PlayCircleOutlined className="text-2xl" />,
          color: '#e6f7ff',
        },
      ];
    }

    // If on achievements page and stats are loaded, use real data
    if (routeKey === 'achievements' && achievementStats) {
      return [
        {
          title: 'Tổng thành tựu',
          value: achievementStats.total,
          subtitle: `${achievementStats.active} kích hoạt`,
          icon: <TrophyOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Đếm sự kiện',
          value: achievementStats.eventCount,
          subtitle: 'EVENT_COUNT',
          icon: <ThunderboltOutlined className="text-2xl" />,
          color: '#e6f7ff',
        },
        {
          title: 'Kiểm tra thuộc tính',
          value: achievementStats.propertyCheck,
          subtitle: 'PROPERTY_CHECK',
          icon: <SafetyOutlined className="text-2xl" />,
          color: '#f6ffed',
        },
        {
          title: 'Chuỗi liên tiếp',
          value: achievementStats.streak,
          subtitle: 'STREAK',
          icon: <FireOutlined className="text-2xl" />,
          color: '#fff7e6',
        },
        {
          title: 'Đã đạt được',
          value: achievementStats.totalEarned,
          subtitle: 'Lượt đạt thành tựu',
          icon: <CheckCircleOutlined className="text-2xl" />,
          color: '#f6ffed',
          highlight: achievementStats.totalEarned,
        },
        {
          title: 'Đang làm',
          value: achievementStats.totalInProgress,
          subtitle: 'Đang tiến hành',
          icon: <PlayCircleOutlined className="text-2xl" />,
          color: '#e6f7ff',
          highlight: achievementStats.totalInProgress,
        },
      ];
    }

    // If on curriculum page and stats are loaded, use real data
    if (routeKey === 'curriculum' && courseStats) {
      return [
        {
          title: 'Tổng khóa học',
          value: courseStats.total,
          subtitle: `${courseStats.approved + courseStats.ongoing} đang hoạt động`,
          icon: <BookOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Chờ phê duyệt',
          value: courseStats.pending,
          subtitle: 'Cần xem xét',
          icon: <ExclamationCircleOutlined className="text-2xl" />,
          color: '#fff7e6',
          highlight: courseStats.pending,
        },
        {
          title: 'Đã phê duyệt',
          value: courseStats.approved,
          subtitle: 'Sẵn sàng học',
          icon: <BookOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Đang diễn ra',
          value: courseStats.ongoing,
          subtitle: 'Đang hoạt động',
          icon: <PlayCircleOutlined className="text-2xl" />,
          color: '#e6f7ff',
          highlight: courseStats.ongoing,
        },
        {
          title: 'Đã hoàn thành',
          value: courseStats.completed,
          subtitle: 'Kết thúc',
          icon: <CheckCircleOutlined className="text-2xl" />,
          color: '#f5f5f5',
        },
        {
          title: 'Đã hủy',
          value: courseStats.cancelled,
          subtitle: 'Không hoạt động',
          icon: <StopOutlined className="text-2xl" />,
          color: '#fff1f0',
          highlight: courseStats.cancelled,
        },
      ];
    }

    return STATS_DATA[routeKey] || STATS_DATA['dashboard'];
  }, [pathname, coachStats, userStats, courseStats, contentStats, achievementStats]);

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {statsCards.map((card, index) => (
        <Col xs={24} sm={12} lg={4} key={index}>
          <Card
            className="rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
            style={{
              backgroundColor: card.color,
              height: '140px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            styles={{ body: { padding: '20px', height: '100%' } }}
            hoverable
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <Text className="text-sm text-gray-600 line-clamp-2 flex-1 pr-2">{card.title}</Text>
                <div className="flex-shrink-0 transition-transform duration-300 hover:scale-125 hover:rotate-12">
                  {card.icon}
                </div>
              </div>
              <div>
                <Title
                  level={2}
                  className="!mb-1"
                  style={{ color: card.highlight ? '#ff7a00' : '#000', lineHeight: '1.2' }}
                >
                  {card.value >= 1000000
                    ? `${Math.round(card.value / 1000000)}M`
                    : card.value.toLocaleString('vi-VN')}
                </Title>
                <Text className="text-xs text-gray-500 line-clamp-1">{card.subtitle}</Text>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
