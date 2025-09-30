'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Avatar,
  Dropdown,
  message,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Image,
  Rate,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  BookOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { CourseVerificationApiService } from '@/services/courseVerificationApi';
import {
  Course,
  CourseStats,
  GetCoursesParams,
  CourseFilterOptions,
} from '@/types/course-verification';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;

const CourseVerificationPageClient: React.FC = () => {
  // States
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [filterOptions, setFilterOptions] = useState<CourseFilterOptions | null>(null);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load data
  const loadCourses = async () => {
    setLoading(true);
    try {
      const params: GetCoursesParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        level: levelFilter !== 'all' ? levelFilter : undefined,
        dateRange: dateRange ? [dateRange[0].toISOString(), dateRange[1].toISOString()] : undefined,
        sortBy: 'submittedAt',
        sortOrder: 'desc',
      };

      const response = await CourseVerificationApiService.getCourses(params);
      setCourses(response.courses);
      setStats(response.stats);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadCourses();
    loadFilterData();
  }, [pagination.current, pagination.pageSize]);

  // Load filter data
  const loadFilterData = async () => {
    try {
      const filterOptionsData = await CourseVerificationApiService.getFilterOptions();
      setFilterOptions(filterOptionsData);
    } catch (error) {
      console.error('Failed to load filter data:', error);
    }
  };

  // Helper functions
  const getStatusTag = (status: Course['status']) => {
    const color = CourseVerificationApiService.getStatusColor(status);
    return (
      <Tag color={color}>
        <IntlMessages id={`course.status.${status}`} />
      </Tag>
    );
  };

  const getPriorityTag = (priority: Course['priority']) => {
    const color = CourseVerificationApiService.getPriorityColor(priority);
    return (
      <Tag color={color}>
        <IntlMessages id={`course.priority.${priority}`} />
      </Tag>
    );
  };

  const getLevelTag = (level: Course['level']) => {
    const color = CourseVerificationApiService.getLevelColor(level);
    return (
      <Tag color={color}>
        <IntlMessages id={`course.level.${level}`} />
      </Tag>
    );
  };

  const formatCurrency = (amount: number) => {
    return CourseVerificationApiService.formatCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return CourseVerificationApiService.formatDate(dateString);
  };

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadCourses();
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setLevelFilter('all');
    setDateRange(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => loadCourses(), 100);
  };

  // Table columns
  const columns: ColumnsType<Course> = [
    {
      title: <IntlMessages id="course.table.course" />,
      key: 'course',
      width: 300,
      render: (_, course) => (
        <div style={{ display: 'flex', gap: 12 }}>
          <Image
            src={course.coverImage}
            alt={course.title}
            width={80}
            height={60}
            style={{ borderRadius: 6, objectFit: 'cover' }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: 4 }}>{course.title}</div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 4 }}>
              {course.description.length > 80
                ? `${course.description.substring(0, 80)}...`
                : course.description}
            </div>
            <Space size={4}>
              <Tag>{course.category}</Tag>
              {getLevelTag(course.level)}
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="course.table.coach" />,
      key: 'coach',
      width: 180,
      render: (_, course) => (
        <Space>
          <Avatar src={course.coach.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500, fontSize: '13px' }}>{course.coach.name}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              <Rate disabled value={course.coach.rating} style={{ fontSize: 10 }} />
              <span style={{ marginLeft: 4 }}>({course.coach.totalStudents} học viên)</span>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: <IntlMessages id="course.table.duration" />,
      key: 'duration',
      width: 120,
      render: (_, course) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
            {course.duration}
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>tuần</div>
          <div style={{ fontSize: '11px', color: '#666' }}>{course.totalSessions} buổi học</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="course.table.price" />,
      key: 'price',
      width: 120,
      render: (_, course) => (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
            {formatCurrency(course.currentPrice)}
          </div>
          {course.originalPrice !== course.currentPrice && (
            <div style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through' }}>
              {formatCurrency(course.originalPrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: <IntlMessages id="course.table.students" />,
      key: 'students',
      width: 100,
      render: (_, course) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
            {course.stats.enrolledStudents}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>học viên</div>
        </div>
      ),
    },
    {
      title: <IntlMessages id="course.table.status" />,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Course['status']) => getStatusTag(status),
    },
    {
      title: <IntlMessages id="course.table.priority" />,
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: Course['priority']) => getPriorityTag(priority),
    },
    {
      title: <IntlMessages id="course.table.submitted" />,
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 120,
      render: (date: string) => <div style={{ fontSize: '12px' }}>{formatDate(date)}</div>,
    },
    {
      title: <IntlMessages id="course.table.actions" />,
      key: 'actions',
      width: 120,
      render: (_, course) => {
        const menuItems = [
          {
            key: 'view',
            label: <IntlMessages id="course.actions.view" />,
            icon: <EyeOutlined />,
            onClick: () => console.log('View', course.id),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'approve',
            label: <IntlMessages id="course.actions.approve" />,
            icon: <CheckOutlined />,
            onClick: () => console.log('Approve', course.id),
            disabled: course.status === 'approved',
          },
          {
            key: 'reject',
            label: <IntlMessages id="course.actions.reject" />,
            icon: <CloseOutlined />,
            onClick: () => console.log('Reject', course.id),
            disabled: course.status === 'rejected',
            danger: true,
          },
          {
            key: 'request-changes',
            label: <IntlMessages id="course.actions.requestChanges" />,
            icon: <EditOutlined />,
            onClick: () => console.log('Request changes', course.id),
            disabled: course.status === 'approved' || course.status === 'rejected',
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          <IntlMessages id="course.verification.title" />
        </Title>
        <Text type="secondary">
          <IntlMessages id="course.verification.subtitle" />
        </Text>
      </div>

      {/* Stats Cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="course.stats.total" />}
                value={stats.total}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="course.stats.pending" />}
                value={stats.pending}
                prefix={<Badge status="processing" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="course.stats.approved" />}
                value={stats.approved}
                prefix={<Badge status="success" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="course.stats.students" />}
                value={stats.totalStudents}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="course.stats.revenue" />}
                value={stats.totalRevenue}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Card size="small">
              <Statistic
                title={<IntlMessages id="course.stats.avgReview" />}
                value={stats.avgReviewTime}
                suffix="ngày"
                prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm theo tên khóa học, huấn luyện viên..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              placeholder="Trạng thái"
            >
              {filterOptions?.statuses.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
              placeholder="Mức độ ưu tiên"
            >
              {filterOptions?.priorities.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
              placeholder="Danh mục"
            >
              {filterOptions?.categories.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Select
              value={levelFilter}
              onChange={setLevelFilter}
              style={{ width: '100%' }}
              placeholder="Trình độ"
            >
              {filterOptions?.levels.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
              <IntlMessages id="course.filter.clear" />
            </Button>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              icon={<ExportOutlined />}
              onClick={() => message.info('Tính năng export đang phát triển')}
            >
              <IntlMessages id="course.filter.export" />
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khóa học`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default CourseVerificationPageClient;
