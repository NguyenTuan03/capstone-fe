'use client';

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Progress,
  Modal,
  Typography,
  Avatar,
  Tooltip,
  message,
  Badge,
  Dropdown,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  TrophyOutlined,
  UserOutlined,
  StarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import AchievementApiService from '@/services/achievementApi';
import { Achievement, AchievementFilterOptions, GetAchievementsParams } from '@/types/achievement';

const { Option } = Select;
const { Text, Title } = Typography;
const { Meta } = Card;

interface AchievementGalleryProps {
  searchText: string;
  setSearchText: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  rarityFilter: string;
  setRarityFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filterOptions: AchievementFilterOptions | null;
  onClearFilters: () => void;
  onStatsUpdate: () => void;
}

const AchievementGallery: React.FC<AchievementGalleryProps> = ({
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  rarityFilter,
  setRarityFilter,
  statusFilter,
  setStatusFilter,
  filterOptions,
  onClearFilters,
  onStatsUpdate,
}) => {
  // States
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  // Load achievements
  const loadAchievements = async () => {
    setLoading(true);
    try {
      const params: GetAchievementsParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        category: categoryFilter !== 'all' ? (categoryFilter as any) : undefined,
        rarity: rarityFilter !== 'all' ? (rarityFilter as any) : undefined,
        status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
        sortBy: 'unlockRate',
        sortOrder: 'desc',
      };

      const response = await AchievementApiService.getAchievements(params);
      setAchievements(response.achievements);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
      onStatsUpdate();
    } catch (error) {
      message.error('Không thể tải danh sách achievements');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadAchievements();
  }, [pagination.current, pagination.pageSize]);

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadAchievements();
  };

  const handleViewDetail = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setDetailModalVisible(true);
  };

  const handleEdit = (achievement: Achievement) => {
    // TODO: Open edit modal
    console.log('Edit achievement:', achievement.id);
  };

  const handleDelete = (achievement: Achievement) => {
    Modal.confirm({
      title: 'Xóa Achievement',
      content: `Bạn có chắc chắn muốn xóa achievement "${achievement.name}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await AchievementApiService.deleteAchievement(achievement.id);
          if (response.success) {
            message.success(response.message);
            loadAchievements();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error('Không thể xóa achievement');
        }
      },
    });
  };

  // Get rarity badge props
  const getRarityBadge = (rarity: string) => {
    const rarityConfig = {
      common: { color: '#8c8c8c', text: 'Thường' },
      rare: { color: '#1890ff', text: 'Hiếm' },
      epic: { color: '#722ed1', text: 'Sử thi' },
      legendary: { color: '#faad14', text: 'Huyền thoại' },
    };
    return rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common;
  };

  // Get category badge props
  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      learning: { color: '#1890ff', text: 'Học tập' },
      skill: { color: '#52c41a', text: 'Kỹ năng' },
      time: { color: '#faad14', text: 'Thời gian' },
      social: { color: '#722ed1', text: 'Xã hội' },
      milestone: { color: '#eb2f96', text: 'Cột mốc' },
      special: { color: '#13c2c2', text: 'Đặc biệt' },
    };
    return categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.learning;
  };

  return (
    <div>
      {/* Filters */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Input
              placeholder="Tìm kiếm achievement..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={5} lg={4}>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
              placeholder="Danh mục"
            >
              {filterOptions?.categories.map((option) => (
                <Option key={option.value} value={option.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: option.color,
                      }}
                    />
                    {option.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={5} lg={4}>
            <Select
              value={rarityFilter}
              onChange={setRarityFilter}
              style={{ width: '100%' }}
              placeholder="Độ hiếm"
            >
              {filterOptions?.rarities.map((option) => (
                <Option key={option.value} value={option.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: option.color,
                      }}
                    />
                    {option.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
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
          <Col xs={24} sm={12} md={6} lg={5}>
            <Space style={{ width: '100%' }}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button icon={<FilterOutlined />} onClick={onClearFilters}>
                Xóa bộ lọc
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Achievement Grid */}
      <Row gutter={[16, 16]}>
        {achievements.map((achievement) => {
          const rarityBadge = getRarityBadge(achievement.rarity);
          const categoryBadge = getCategoryBadge(achievement.category);

          const menuItems = [
            {
              key: 'view',
              label: 'Xem chi tiết',
              icon: <EyeOutlined />,
              onClick: () => handleViewDetail(achievement),
            },
            {
              key: 'edit',
              label: 'Chỉnh sửa',
              icon: <EditOutlined />,
              onClick: () => handleEdit(achievement),
            },
            {
              type: 'divider' as const,
            },
            {
              key: 'delete',
              label: 'Xóa',
              icon: <DeleteOutlined />,
              onClick: () => handleDelete(achievement),
              danger: true,
            },
          ];

          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={achievement.id}>
              <Badge.Ribbon text={rarityBadge.text} color={rarityBadge.color} placement="start">
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={
                    <div
                      style={{
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${rarityBadge.color}20, ${categoryBadge.color}20)`,
                        fontSize: '48px',
                      }}
                    >
                      {achievement.icon}
                    </div>
                  }
                  actions={[
                    <Tooltip title="Xem chi tiết" key="view">
                      <EyeOutlined onClick={() => handleViewDetail(achievement)} />
                    </Tooltip>,
                    <Tooltip title="Chỉnh sửa" key="edit">
                      <EditOutlined onClick={() => handleEdit(achievement)} />
                    </Tooltip>,
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} key="more">
                      <MoreOutlined />
                    </Dropdown>,
                  ]}
                >
                  <Meta
                    title={
                      <div style={{ marginBottom: '8px' }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{achievement.name}</span>
                          {achievement.status !== 'active' && (
                            <Tag color="default">{achievement.status}</Tag>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                          <Tag color={categoryBadge.color} style={{ fontSize: '10px' }}>
                            {categoryBadge.text}
                          </Tag>
                          <Tag size="small" color="gold" style={{ fontSize: '10px' }}>
                            {AchievementApiService.formatPoints(achievement.rewards.points)} pts
                          </Tag>
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <Text
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            display: 'block',
                            marginBottom: '12px',
                            height: '36px',
                            overflow: 'hidden',
                          }}
                        >
                          {achievement.description}
                        </Text>

                        {/* Unlock Progress */}
                        <div style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '4px',
                            }}
                          >
                            <Text style={{ fontSize: '11px' }}>Unlock Rate</Text>
                            <Text strong style={{ fontSize: '11px' }}>
                              {AchievementApiService.formatPercentage(achievement.unlockRate)}
                            </Text>
                          </div>
                          <Progress
                            percent={achievement.unlockRate}
                            showInfo={false}
                            strokeColor={rarityBadge.color}
                          />
                        </div>

                        {/* Stats */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: '#999',
                          }}
                        >
                          <Space size="small">
                            <UserOutlined />
                            <span>{achievement.unlockedCount.toLocaleString()}</span>
                          </Space>
                          <Space size="small">
                            <ClockCircleOutlined />
                            <span>{AchievementApiService.getTimeAgo(achievement.createdAt)}</span>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>

      {/* Load More */}
      {achievements.length < pagination.total && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            size="large"
            loading={loading}
            onClick={() => {
              setPagination((prev) => ({ ...prev, current: prev.current + 1 }));
            }}
          >
            Tải thêm ({achievements.length}/{pagination.total})
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        title={
          selectedAchievement && (
            <Space>
              <span style={{ fontSize: '24px' }}>{selectedAchievement.icon}</span>
              <span>{selectedAchievement.name}</span>
              <Tag color={getRarityBadge(selectedAchievement.rarity).color}>
                {getRarityBadge(selectedAchievement.rarity).text}
              </Tag>
            </Space>
          )
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAchievement && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Text>{selectedAchievement.description}</Text>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                      {AchievementApiService.formatPoints(selectedAchievement.rewards.points)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Điểm thưởng</div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                      {selectedAchievement.unlockedCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Đã unlock</div>
                  </div>
                </Card>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>Điều kiện unlock:</Title>
              <Card size="small" style={{ backgroundColor: '#f9f9f9' }}>
                <Text>
                  <strong>Loại:</strong> {selectedAchievement.criteria.type}
                  <br />
                  <strong>Mục tiêu:</strong> {selectedAchievement.criteria.target}
                  {selectedAchievement.criteria.condition && (
                    <>
                      <br />
                      <strong>Điều kiện:</strong> {selectedAchievement.criteria.condition}
                    </>
                  )}
                </Text>
              </Card>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>Phần thưởng:</Title>
              <div>
                <Text>
                  <strong>Danh hiệu:</strong> {selectedAchievement.rewards.title}
                </Text>
                <br />
                <Text>
                  <strong>Badge:</strong> {selectedAchievement.rewards.badge}
                </Text>
                <br />
                <Text>
                  <strong>Mô tả:</strong> {selectedAchievement.rewards.description}
                </Text>
                {selectedAchievement.rewards.specialPerks && (
                  <>
                    <br />
                    <Text>
                      <strong>Đặc quyền:</strong>
                    </Text>
                    <ul style={{ margin: '4px 0 0 16px' }}>
                      {selectedAchievement.rewards.specialPerks.map((perk, index) => (
                        <li key={index}>
                          <Text style={{ fontSize: '13px' }}>{perk}</Text>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#999',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '12px',
              }}
            >
              <span>Tạo: {AchievementApiService.getTimeAgo(selectedAchievement.createdAt)}</span>
              <span>
                Cập nhật: {AchievementApiService.getTimeAgo(selectedAchievement.updatedAt)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AchievementGallery;
