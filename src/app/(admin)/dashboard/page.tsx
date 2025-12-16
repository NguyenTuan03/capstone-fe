'use client';

import { Spin, Alert } from 'antd';
import { useGetDashboardOverview } from '@/@crema/services/apis/analysis';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, GraduationCap, BookOpen, Star, AlertCircle } from 'lucide-react';

const RATING_COLORS = ['#ff4d4f', '#ff7a45', '#faad14', '#a0d911', '#52c41a'];

const courseStatusLabels: { [key: string]: string } = {
  COMPLETED: 'Hoàn thành',
  ON_GOING: 'Đang diễn ra',
  CANCELLED: 'Đã hủy',
  APPROVED: 'Đã duyệt',
  READY_OPENED: 'Sẵn sàng mở',
  PENDING_APPROVAL: 'Chờ duyệt',
};

const statusColors: { [key: string]: string } = {
  COMPLETED: '#10b981',
  ON_GOING: '#3b82f6',
  CANCELLED: '#ef4444',
  APPROVED: '#8b5cf6',
  READY_OPENED: '#f59e0b',
  PENDING_APPROVAL: '#f97316',
};

export default function DashboardPage() {
  const { data, isLoading, error } = useGetDashboardOverview();
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải dữ liệu dashboard. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không có dữ liệu"
          description="Không tìm thấy dữ liệu dashboard."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const stats = [
    {
      title: 'Tổng Người Dùng',
      value: data.totalUsers.total,
      change: data.totalUsers.percentageChange,
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Huấn Luyện Viên',
      value: data.coaches.total,
      change: data.coaches.percentageChange,
      icon: GraduationCap,
      color: 'green' as const,
      subtitle: `${data.coaches.verified} đã xác thực, ${data.coaches.pending} chờ duyệt`,
    },
    {
      title: 'Học Viên',
      value: data.learners.total,
      change: data.learners.percentageChange,
      icon: Users,
      color: 'purple' as const,
    },
    {
      title: 'Khóa Học',
      value: data.courses.total,
      icon: BookOpen,
      color: 'orange' as const,
      subtitle: `${data.courses.ongoing} đang diễn ra, ${data.courses.completed} hoàn thành`,
    },
    {
      title: 'Đánh Giá TB',
      value: data.averageFeedback.total.toFixed(1),
      change: data.averageFeedback.percentageChange,
      icon: Star,
      color: 'yellow' as const,
    },
    {
      title: 'Phê Duyệt',
      value: data.systemReports.approved + data.systemReports.pending + data.systemReports.rejected,
      icon: AlertCircle,
      color: 'red' as const,
      subtitle: `${data.systemReports.pending} chờ xử lý`,
    },
  ];

  const courseChartData = data.courseStatusChart
    .filter((item: any) => item.count > 0)
    .map((item: any) => ({
      name: courseStatusLabels[item.status],
      value: item.count,
      color: statusColors[item.status],
    }));

  const feedbackChartData = data.feedbackDistributionChart.map((item: any) => ({
    name: `${item.rating} ⭐`,
    value: item.count,
    rating: item.rating,
  }));

  return (
    <div className="bg-gradient-to-br p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">📊 Tổng Quan Hệ Thống</h1>
          <p className="text-sm text-gray-500">Pickle Learn Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-500',
              green: 'bg-green-500',
              purple: 'bg-purple-500',
              orange: 'bg-orange-500',
              yellow: 'bg-yellow-500',
              red: 'bg-red-500',
            };

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${colorClasses[stat.color]} bg-opacity-10`}>
                    <Icon size={18} className={colorClasses[stat.color].replace('bg-', 'text-')} />
                  </div>
                  {stat.change !== undefined && (
                    <span className="text-xs text-green-600 font-semibold">+{stat.change}%</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{stat.subtitle}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Course Status Chart */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen size={18} className="mr-2 text-blue-600" />
              Trạng Thái Khóa Học
            </h2>
            {courseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400 text-center py-20">Chưa có dữ liệu</p>
            )}
          </div>

          {/* Feedback Distribution Chart */}
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
              <Star size={18} className="mr-2 text-yellow-500" />
              Phân Bố Đánh Giá
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedbackChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Số lượng đánh giá" radius={[8, 8, 0, 0]}>
                  {feedbackChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.rating - 1]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
