'use client';

import { useState } from 'react';
import { Spin, Alert, Card, Row, Col, Statistic, Select, DatePicker, Space } from 'antd';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Users, GraduationCap, BookOpen, Star, AlertCircle } from 'lucide-react';
import { UserOutlined, DollarOutlined, WalletOutlined, RiseOutlined } from '@ant-design/icons';
import {
  useGetMonthlyNewUsers,
  useGetMonthlyLearnerPayments,
  useGetMonthlyCoachEarnings,
  useGetMonthlyPlatformRevenue,
  formatCurrency,
  formatNumber,
  calculatePercentageChange,
  getCurrentAndPreviousMonthData,
  MonthlyDataItem,
} from '@/@crema/services/apis/analysis';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RATING_COLORS = ['#ff4d4f', '#ff7a45', '#faad14', '#a0d911', '#52c41a'];

// ✅ Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`Tháng: ${label}`}</p>
        <p style={{ margin: 0, color: payload[0].color }}>
          {`Giá trị: ${formatNumber(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

// ✅ Custom tooltip cho tiền tệ
const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`Tháng: ${label}`}</p>
        <p style={{ margin: 0, color: payload[0].color }}>
          {`Giá trị: ${formatCurrency(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};

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
  const [timeRange, setTimeRange] = useState('year');
  const [, setCustomDateRange] = useState<any>(null);

  const { data, isLoading, error } = useGetDashboardOverview();

  const {
    data: newUsersData,
    isLoading: newUsersLoading,
    error: newUsersError,
  } = useGetMonthlyNewUsers();

  const {
    data: learnerPaymentsData,
    isLoading: learnerPaymentsLoading,
    error: learnerPaymentsError,
  } = useGetMonthlyLearnerPayments();

  const {
    data: coachEarningsData,
    isLoading: coachEarningsLoading,
    error: coachEarningsError,
  } = useGetMonthlyCoachEarnings();

  const {
    data: platformRevenueData,
    isLoading: platformRevenueLoading,
    error: platformRevenueError,
  } = useGetMonthlyPlatformRevenue();

  // ✅ Tính toán loading và error tổng hợp cho thống kê tài chính
  const isFinancialStatsLoading =
    newUsersLoading || learnerPaymentsLoading || coachEarningsLoading || platformRevenueLoading;
  const hasFinancialStatsError =
    newUsersError || learnerPaymentsError || coachEarningsError || platformRevenueError;

  // ✅ Tính toán stats từ data thực tế
  const userStats = newUsersData
    ? getCurrentAndPreviousMonthData(newUsersData)
    : { current: 0, previous: 0 };
  const learnerStats = learnerPaymentsData
    ? getCurrentAndPreviousMonthData(learnerPaymentsData)
    : { current: 0, previous: 0 };
  const coachStats = coachEarningsData
    ? getCurrentAndPreviousMonthData(coachEarningsData)
    : { current: 0, previous: 0 };
  const systemStats = platformRevenueData
    ? getCurrentAndPreviousMonthData(platformRevenueData)
    : { current: 0, previous: 0 };

  const userGrowth = calculatePercentageChange(userStats.current, userStats.previous);
  const learnerGrowth = calculatePercentageChange(learnerStats.current, learnerStats.previous);
  const coachGrowth = calculatePercentageChange(coachStats.current, coachStats.previous);
  const systemGrowth = calculatePercentageChange(systemStats.current, systemStats.previous);

  // ✅ Tính tổng
  const userTotal = newUsersData
    ? newUsersData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  const learnerTotal = learnerPaymentsData
    ? learnerPaymentsData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  const coachTotal = coachEarningsData
    ? coachEarningsData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  const systemTotal = platformRevenueData
    ? platformRevenueData.reduce((sum: number, item: MonthlyDataItem) => sum + item.data, 0)
    : 0;
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', height: '100vh' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', height: '100vh' }}>
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
      <div style={{ padding: '24px', height: '100vh' }}>
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
    // {
    //   title: 'Đánh Giá TB',
    //   value: data.averageFeedback.total.toFixed(1),
    //   change: data.averageFeedback.percentageChange,
    //   icon: Star,
    //   color: 'yellow' as const,
    // },
    {
      title: 'Phê Duyệt',
      value: data.systemReports.approved + data.systemReports.pending + data.systemReports.rejected,
      icon: AlertCircle,
      color: 'red' as const,
      subtitle: `${data.systemReports.pending} chờ xử lý`,
    },
    {
      title: 'Tổng doanh thu năm',
      value: formatCurrency(systemTotal + learnerTotal),
      icon: DollarOutlined,
      color: 'blue' as const,
      isCurrency: true,
    },
    {
      title: 'Tổng chi phí HLV',
      value: formatCurrency(coachTotal),
      icon: WalletOutlined,
      color: 'orange' as const,
      isCurrency: true,
    },
    {
      title: 'Lợi nhuận ròng',
      value: formatCurrency(systemTotal),
      icon: RiseOutlined,
      color: 'green' as const,
      isCurrency: true,
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
                    label={({ name }) => `${name}`}
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

        {/* Financial Charts */}
        {isFinancialStatsLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
            <div className="mt-4 text-gray-500">Đang tải dữ liệu thống kê tài chính...</div>
          </div>
        ) : hasFinancialStatsError ? (
          <Alert
            message="Lỗi tải dữ liệu"
            description="Không thể tải dữ liệu thống kê tài chính. Vui lòng thử lại sau."
            type="error"
            showIcon
          />
        ) : (
          <Row gutter={[16, 16]}>
            {/* Card 1: Thống kê người dùng mới */}
            <Col xs={24} lg={12}>
              <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
                <div style={{ marginBottom: 16 }}>
                  <Statistic
                    title="Người dùng mới"
                    value={userStats.current}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                    suffix={`/ ${formatNumber(userTotal)} tổng`}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: userGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                      marginTop: '4px',
                    }}
                  >
                    {userGrowth >= 0 ? '📈' : '📉'} {Math.abs(userGrowth).toFixed(1)}% so với tháng
                    trước
                  </div>
                </div>

                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={newUsersData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="data"
                        stroke="#1890ff"
                        strokeWidth={3}
                        dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Card 2: Tổng tiền thu được từ người học */}
            <Col xs={24} lg={12}>
              <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
                <div style={{ marginBottom: 16 }}>
                  <Statistic
                    title="Doanh thu từ học viên"
                    value={learnerStats.current}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: learnerGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                      marginTop: '4px',
                    }}
                  >
                    {learnerGrowth >= 0 ? '📈' : '📉'} {Math.abs(learnerGrowth).toFixed(1)}% so với
                    tháng trước
                  </div>
                </div>

                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={learnerPaymentsData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        fontSize={12}
                        tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                      />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="data"
                        stroke="#52c41a"
                        fill="#52c41a"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Card 3: Tổng thu nhập của các coach */}
            <Col xs={24} lg={12}>
              <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
                <div style={{ marginBottom: 16 }}>
                  <Statistic
                    title="Thu nhập của Coach"
                    value={coachStats.current}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<WalletOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: coachGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                      marginTop: '4px',
                    }}
                  >
                    {coachGrowth >= 0 ? '📈' : '📉'} {Math.abs(coachGrowth).toFixed(1)}% so với
                    tháng trước
                  </div>
                </div>

                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coachEarningsData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        fontSize={12}
                        tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                      />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Bar dataKey="data" fill="#fa8c16" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            {/* Card 4: Doanh thu hệ thống */}
            <Col xs={24} lg={12}>
              <Card style={{ height: '100%', borderRadius: '8px' }} bodyStyle={{ padding: '16px' }}>
                <div style={{ marginBottom: 16 }}>
                  <Statistic
                    title="Doanh thu hệ thống"
                    value={systemStats.current}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<RiseOutlined />}
                    valueStyle={{ color: '#eb2f96' }}
                  />
                  <div
                    style={{
                      fontSize: '12px',
                      color: systemGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                      marginTop: '4px',
                    }}
                  >
                    {systemGrowth >= 0 ? '📈' : '📉'} {Math.abs(systemGrowth).toFixed(1)}% so với
                    tháng trước
                  </div>
                </div>

                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={platformRevenueData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        fontSize={12}
                        tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                      />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="data"
                        stroke="#eb2f96"
                        strokeWidth={3}
                        dot={{ fill: '#eb2f96', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
