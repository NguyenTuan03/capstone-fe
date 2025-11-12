'use client';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  UserOutlined,
  DollarOutlined,
  StarOutlined,
  ClockCircleOutlined,
  AimOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';

const AnalyticsPage = () => {
  const { isAuthorized, isChecking } = useRoleGuard(['COACH'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    LEARNER: '/home',
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6');

  const studentTrendData = [
    { month: 'T1', value: 12 },
    { month: 'T2', value: 18 },
    { month: 'T3', value: 25 },
    { month: 'T4', value: 32 },
    { month: 'T5', value: 28 },
    { month: 'T6', value: 42 },
  ];

  const revenueData = [
    { month: 'T1', value: 15000000 },
    { month: 'T2', value: 18500000 },
    { month: 'T3', value: 22000000 },
    { month: 'T4', value: 26500000 },
    { month: 'T5', value: 24000000 },
    { month: 'T6', value: 28500000 },
  ];

  const stats = [
    {
      title: 'Tổng học viên',
      value: '156',
      change: '+23.5% so với kỳ trước',
      icon: UserOutlined,
      positive: true,
    },
    {
      title: 'Doanh thu',
      value: '124.500.000₫',
      change: '+18.2% so với kỳ trước',
      icon: DollarOutlined,
      positive: true,
    },
    {
      title: 'Đánh giá trung bình',
      value: '4.8/5',
      change: 'Dựa trên 1248 buổi học',
      icon: StarOutlined,
      positive: null,
    },
    {
      title: 'Tổng buổi học',
      value: '1248',
      change: 'Trung bình 208 buổi/tháng',
      icon: ClockCircleOutlined,
      positive: null,
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      value: '24.8%',
      change: 'Từ demo thành đăng ký',
      icon: AimOutlined,
      positive: null,
    },
  ];
  const studentSourcesData = [
    { name: 'Tìm kiếm tự nhiên', value: 68, percentage: 43.6, color: '#0ea5e9' },
    { name: 'Giới thiệu', value: 45, percentage: 28.8, color: '#10b981' },
    { name: 'Mạng xã hội', value: 28, percentage: 17.9, color: '#fbbf24' },
    { name: 'Quảng cáo', value: 15, percentage: 9.7, color: '#fb923c' },
  ];

  const coursePerformanceData = [
    {
      course: 'Pickleball cơ bản',
      students: 48,
      completion: 92,
      revenue: '38.400.000₫',
      rating: 4.9,
    },
    {
      course: 'Kỹ thuật nâng cao',
      students: 36,
      completion: 85,
      revenue: '36.000.000₫',
      rating: 4.7,
    },
    {
      course: 'Chiến thuật thi đấu',
      students: 28,
      completion: 88,
      revenue: '28.000.000₫',
      rating: 4.8,
    },
    {
      course: 'Lớp private 1-1',
      students: 44,
      completion: 95,
      revenue: '22.000.000₫',
      rating: 4.9,
    },
  ];

  const studentDevelopmentData = [
    { month: 'T1', new: 20, returning: 12, active: 8 },
    { month: 'T2', new: 32, returning: 18, active: 15 },
    { month: 'T3', new: 48, returning: 25, active: 20 },
    { month: 'T4', new: 62, returning: 32, active: 28 },
    { month: 'T5', new: 63, returning: 35, active: 27 },
    { month: 'T6', new: 85, returning: 42, active: 40 },
  ];
  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'sources', label: 'Nguồn học viên' },
    { id: 'performance', label: 'Hiệu suất khóa học' },
    { id: 'development', label: 'Phát triển học viên' },
  ];
  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1
            style={{ fontSize: '32px', color: '#1a1a1a', marginBottom: '8px', fontWeight: '700' }}
          >
            Phân tích học viên
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Theo dõi hiệu quả thu hút học viên và phát triển kinh doanh
          </p>
        </div>

        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px' }}
        >
          <select
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
            }}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="3">3 tháng qua</option>
            <option value="6">6 tháng qua</option>
            <option value="12">12 tháng qua</option>
          </select>
          <button
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CalendarOutlined /> Tùy chỉnh
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
                  {stat.title}
                </span>
                <Icon style={{ fontSize: '14px', color: '#666', fontWeight: '500' }} />
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: stat.positive ? '#10b981' : '#666',
                  gap: '4px',
                }}
              >
                {stat.positive && '↗ '}
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '30px',
          borderBottom: '1px solid #e5e5e5',
          marginBottom: '30px',
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              padding: '12px 0',
              fontSize: '14px',
              color: activeTab === tab.id ? '#1a1a1a' : '#666',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #1a1a1a' : '2px solid transparent',
              transition: 'all 0.3s',
              fontWeight: activeTab === tab.id ? '500' : '400',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '20px',
        }}
      >
        {activeTab === 'overview' && (
          <>
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Xu hướng học viên
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                Số lượng học viên mới theo tháng
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} />
                  <YAxis
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    domain={[0, 60]}
                    ticks={[0, 15, 30, 45, 60]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Doanh thu theo tháng
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                Doanh thu từ khóa học
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} />
                  <YAxis
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    tickFormatter={formatCurrency}
                    domain={[0, 35000000]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(value),
                      'Doanh thu',
                    ]}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
        {activeTab === 'sources' && (
          <>
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Nguồn học viên
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '20px',
                }}
              >
                Phân bổ học viên theo kênh tìm kiếm
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={studentSourcesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.payload.name}: ${entry.payload.percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {studentSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value} học viên (${props.payload.percentage}%)`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Chi tiết nguồn học viên
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '20px',
                }}
              >
                Số lượng và tỷ lệ phần trăm
              </div>
              <div style={{ marginTop: '40px' }}>
                {studentSourcesData.map((source, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom:
                        index < studentSourcesData.length - 1 ? '1px solid #f0f0f0' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: source.color,
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>
                        {source.name}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                        {source.value} học viên
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {activeTab === 'performance' && (
          <div
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              gridColumn: '1 / -1',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '8px',
              }}
            >
              Hiệu suất khóa học
            </div>
            <div
              style={{
                fontSize: '13px',
                color: '#666',
                marginBottom: '24px',
              }}
            >
              Phân tích hiệu quả từng khóa học
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                      }}
                    >
                      Khóa học
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                      }}
                    >
                      Học viên
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                      }}
                    >
                      Hoàn thành
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                      }}
                    >
                      Doanh thu
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                      }}
                    >
                      Đánh giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coursePerformanceData.map((course, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom:
                          index < coursePerformanceData.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <td
                        style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500',
                        }}
                      >
                        {course.course}
                      </td>
                      <td
                        style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: '#1a1a1a',
                        }}
                      >
                        {course.students}
                      </td>
                      <td
                        style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: course.completion >= 90 ? '#1a1a1a' : '#e5e5e5',
                            color: course.completion >= 90 ? '#fff' : '#1a1a1a',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: '500',
                          }}
                        >
                          {course.completion}%
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                          color: '#1a1a1a',
                        }}
                      >
                        {course.revenue}
                      </td>
                      <td
                        style={{
                          padding: '20px 16px',
                          fontSize: '14px',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#fbbf24',
                          }}
                        >
                          <StarOutlined style={{ fontSize: '16px' }} />
                          {course.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'development' && (
          <>
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                gridColumn: '1 / -1',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}
              >
                Phát triển học viên
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '20px',
                }}
              >
                So sánh học viên mới và học viên quay lại
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={studentDevelopmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} />
                  <YAxis
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={false}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    name="Học viên mới"
                  />
                  <Line
                    type="monotone"
                    dataKey="returning"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={{ fill: '#a78bfa', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    name="Học viên quay lại"
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    name="Học viên hoạt động"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                gridColumn: '1 / -1',
              }}
            >
              <div
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '12px',
                    fontWeight: '500',
                  }}
                >
                  Tỷ lệ giữ chân
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '8px',
                  }}
                >
                  68.5%
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#666',
                  }}
                >
                  Học viên tiếp tục đăng ký khóa mới
                </div>
              </div>

              <div
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '12px',
                    fontWeight: '500',
                  }}
                >
                  Thời gian trung bình
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '8px',
                  }}
                >
                  3.2 tháng
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#666',
                  }}
                >
                  Học viên gắn bó với platform
                </div>
              </div>

              <div
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '12px',
                    fontWeight: '500',
                  }}
                >
                  Giá trị vòng đời
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    color: '#a78bfa',
                    marginBottom: '8px',
                  }}
                >
                  2.800.000₫
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#666',
                  }}
                >
                  Doanh thu trung bình/học viên
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
