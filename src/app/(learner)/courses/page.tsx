'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Typography,
  Input,
  Select,
  Pagination,
  Skeleton,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useRoleGuard from '@/@crema/hooks/useRoleGuard';
import { useGetCourses } from '@/@crema/services/apis/courses';
import { mapCoursesWithPagination } from '@/@crema/utils/courseCard';
import { CourseLearningFormat } from '@/types/enums';
import { useGetProvinces, useGetDistricts } from '@/@crema/services/apis/locations';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CoursesPage = () => {
  const router = useRouter();
  const { isAuthorized, isChecking } = useRoleGuard(['LEARNER'], {
    unauthenticated: '/signin',
    ADMIN: '/dashboard',
    COACH: '/summary',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState<number | undefined>(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Get user from localStorage
  const user = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }, []);

  // Get learner's location from user data
  const learnerLocation = useMemo(() => {
    if (!user?.learner || !Array.isArray(user.learner) || user.learner.length === 0) {
      return null;
    }
    const learner = user.learner[0];
    if (learner?.province && learner?.district) {
      return {
        provinceId: learner.province.id,
        districtId: learner.district.id,
        provinceName: learner.province.name,
        districtName: learner.district.name,
      };
    }
    return null;
  }, [user]);

  // Fetch provinces and districts
  const { data: provincesRes, isLoading: isLoadingProvinces } = useGetProvinces();
  const { data: districtsRes, isLoading: isLoadingDistricts } = useGetDistricts(
    selectedProvince || learnerLocation?.provinceId,
  );

  const provinces = useMemo(() => {
    if (!provincesRes) return [];
    return Array.isArray(provincesRes) ? provincesRes : provincesRes.items || [];
  }, [provincesRes]);

  const districts = useMemo(() => {
    if (!districtsRes) return [];
    return Array.isArray(districtsRes) ? districtsRes : districtsRes.items || [];
  }, [districtsRes]);

  // Auto-select province/district based on learner location if available
  useEffect(() => {
    if (learnerLocation && provinces.length > 0 && !selectedProvince) {
      setSelectedProvince(learnerLocation.provinceId);
    }
  }, [learnerLocation, provinces, selectedProvince]);

  // Auto-select district when province is set and districts are loaded
  useEffect(() => {
    if (
      learnerLocation &&
      selectedProvince === learnerLocation.provinceId &&
      districts.length > 0
    ) {
      // Find district by ID to ensure it exists
      const districtExists = districts.find((d: any) => d.id === learnerLocation.districtId);
      if (districtExists && selectedDistrict !== learnerLocation.districtId) {
        setSelectedDistrict(learnerLocation.districtId);
      }
    }
  }, [learnerLocation, selectedProvince, districts, selectedDistrict]);

  // Map filter values to API params
  const getLearningFormatFromFilter = (filter: string): string | undefined => {
    if (filter === 'all') return undefined;
    if (filter === 'individual') return CourseLearningFormat.INDIVIDUAL;
    if (filter === 'group') return CourseLearningFormat.GROUP;
    return undefined;
  };

  // Fetch courses from API
  const { data: coursesRes, isLoading: isLoadingCourses } = useGetCourses({
    page,
    pageSize,
    search: searchQuery || undefined,
    learningFormat: getLearningFormatFromFilter(selectedTypeFilter),
    level: selectedLevelFilter !== 'all' ? selectedLevelFilter : undefined,
    // Note: API might need province/district params, adjust based on actual API
  });

  // Map courses using helper
  const { courses, total: totalCourses } = useMemo(() => {
    return mapCoursesWithPagination(coursesRes);
  }, [coursesRes]);

  // Filter courses by location on client side
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Location filter - check province and district
      if (selectedProvince) {
        const courseProvinceId = course.raw?.province?.id;
        if (courseProvinceId !== selectedProvince) return false;
      }

      if (selectedDistrict) {
        const courseDistrictId = course.raw?.district?.id;
        if (courseDistrictId !== selectedDistrict) return false;
      }

      return true;
    });
  }, [courses, selectedProvince, selectedDistrict]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedTypeFilter, selectedLevelFilter, selectedProvince, selectedDistrict]);

  // Reset district when province changes
  useEffect(() => {
    setSelectedDistrict(undefined);
  }, [selectedProvince]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTypeFilter('all');
    setSelectedLevelFilter('all');
    setSelectedProvince(undefined);
    setSelectedDistrict(undefined);
    setPage(1);
  };

  const getTypeColor = (type: string | null | undefined) => {
    if (!type) return 'default';
    switch (type) {
      case CourseLearningFormat.INDIVIDUAL:
      case 'INDIVIDUAL':
        return 'green';
      case CourseLearningFormat.GROUP:
      case 'GROUP':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getLearningFormatLabel = (format: string | null | undefined) => {
    if (!format) return 'Nhóm';
    if (format === CourseLearningFormat.INDIVIDUAL || format === 'INDIVIDUAL') return 'Cá nhân';
    return 'Nhóm';
  };

  const isIndividual = (course: any) => {
    return (
      course.raw?.learningFormat === CourseLearningFormat.INDIVIDUAL ||
      course.raw?.learningFormat === 'INDIVIDUAL'
    );
  };

  if (isChecking) {
    return <div>Đang tải...</div>;
  }
  if (!isAuthorized) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }
  return (
    <div>
      <Title level={2}>Khóa học Pickleball</Title>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm khóa học..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={(value) => setSearchQuery(value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Loại hình"
              style={{ width: '100%' }}
              size="large"
              value={selectedTypeFilter}
              onChange={setSelectedTypeFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="individual">Cá nhân</Option>
              <Option value="group">Nhóm</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Trình độ"
              style={{ width: '100%' }}
              size="large"
              value={selectedLevelFilter}
              onChange={setSelectedLevelFilter}
            >
              <Option value="all">Tất cả</Option>
              <Option value="Cơ bản">Cơ bản</Option>
              <Option value="Trung cấp">Trung cấp</Option>
              <Option value="Nâng cao">Nâng cao</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Tỉnh/Thành phố"
              style={{ width: '100%' }}
              size="large"
              value={selectedProvince}
              onChange={(value) => setSelectedProvince(value || undefined)}
              loading={isLoadingProvinces}
              allowClear
              showSearch
              optionFilterProp="label"
            >
              {provinces.map((province: any) => (
                <Option key={province.id} value={province.id} label={province.name}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Quận/Huyện"
              style={{ width: '100%' }}
              size="large"
              value={selectedDistrict}
              onChange={(value) => setSelectedDistrict(value || undefined)}
              loading={isLoadingDistricts}
              disabled={!selectedProvince}
              allowClear
              showSearch
              optionFilterProp="label"
            >
              {districts.map((district: any) => (
                <Option key={district.id} value={district.id} label={district.name}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={2}>
            <Button
              icon={<ReloadOutlined />}
              size="large"
              onClick={handleResetFilters}
              style={{ width: '100%', borderColor: '#ff4d4f', color: '#ff4d4f', padding: '0 16px' }}
            >
              Đặt lại
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Courses List */}
      {isLoadingCourses ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col xs={24} lg={12} xl={8} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : filteredCourses.length === 0 ? (
        <Empty description="Không tìm thấy khóa học nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            {filteredCourses.map((course) => {
              const individual = isIndividual(course);
              const scheduleParts = course.schedule ? course.schedule.split(' · ') : [];
              const scheduleText = scheduleParts[0] || '';
              const dateRange = scheduleParts[1] || '';

              return (
                <Col xs={24} lg={12} xl={8} key={course.id}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      maxHeight: 650,
                    }}
                    bodyStyle={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                    }}
                    cover={
                      <div
                        style={{
                          height: 200,
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text type="secondary">Hình ảnh khóa học</Text>
                      </div>
                    }
                    actions={[
                      <Button
                        key={course.id}
                        type="primary"
                        icon={individual ? <UserOutlined /> : <TeamOutlined />}
                        style={{
                          backgroundColor: individual ? '#52c41a' : '#722ed1',
                          borderColor: individual ? '#52c41a' : '#722ed1',
                        }}
                        onClick={() => router.push(`/payment?courseId=${course.id}`)}
                      >
                        {individual ? 'Đăng ký cá nhân' : 'Đăng ký'}
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={course.name}
                      description={
                        <div>
                          <Text type="secondary">Giảng viên: {course.coach}</Text>
                          <br />

                          {/* Sessions */}
                          <div
                            style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <ClockCircleOutlined style={{ color: '#666' }} />
                            <Text type="secondary">{course.sessions} tuần</Text>
                          </div>

                          {/* Location */}
                          <div
                            style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <EnvironmentOutlined style={{ color: '#666' }} />
                            <Text type="secondary">{course.location}</Text>
                          </div>

                          {/* Subject and Type Badges */}
                          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {course.raw?.subject && course.raw.subject.status === 'PUBLISHED' && (
                              <Tag color="blue">{course.raw.subject.name}</Tag>
                            )}
                            <Tag color={getTypeColor(course.raw?.learningFormat)}>
                              {getLearningFormatLabel(course.raw?.learningFormat)}
                            </Tag>
                          </div>

                          {/* Schedule */}
                          {scheduleText && (
                            <div style={{ marginTop: 12 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  marginBottom: 4,
                                }}
                              >
                                <CalendarOutlined style={{ color: '#666' }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {scheduleText}
                                </Text>
                              </div>
                              {dateRange && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {dateRange}
                                </Text>
                              )}
                            </div>
                          )}

                          {/* Students and Sessions - Only show for group courses */}
                          {!individual && (
                            <div style={{ marginTop: 12 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {course.currentStudents}/{course.maxStudents} học viên
                                {course.sessionsCompleted > 0 &&
                                  ` • ${course.sessionsCompleted} buổi học`}
                              </Text>
                            </div>
                          )}

                          {/* Pricing */}
                          <div style={{ marginTop: 12 }}>
                            {individual ? (
                              <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                                {course.fee}
                              </Text>
                            ) : (
                              <div>
                                <Text strong style={{ color: '#722ed1', fontSize: 16 }}>
                                  {course.fee}/người
                                </Text>
                                <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                                  {course.currentStudents}/{course.maxStudents} học viên • Còn{' '}
                                  {course.maxStudents - course.currentStudents} chỗ
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Pagination */}
          {totalCourses > pageSize && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalCourses}
                onChange={(newPage, newPageSize) => {
                  setPage(newPage);
                  if (newPageSize) setPageSize(newPageSize);
                }}
                showSizeChanger
                pageSizeOptions={['9', '18', '27', '36']}
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} khóa học`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;
