'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Typography,
  Space,
  Button,
  Tooltip,
  Spin,
  Modal,
  Descriptions,
} from 'antd';
import { EyeOutlined, PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import {
  getWalletsWithUserInfo,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} from '@/services/walletApi';

const { Title } = Typography;

// Wallet type based on backend entity
export interface WithdrawalRequest {
  id: number;
  amount: number;
  status: string;
  requestedAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: number;
  bankAccountNumber?: string;
  currentBalance: number;
  totalIncome: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role?: {
      id: number;
      name: string;
    };
  };
  bank?: {
    id: number;
    name: string;
  };
  withdrawalRequests?: WithdrawalRequest[];
  transactions?: {
    id: number;
    amount: number;
    description?: string;
    type: 'DEBIT' | 'CREDIT';
    createdAt: string;
  }[];
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [approveDialog, setApproveDialog] = useState<{ visible: boolean; record: any | null }>({
    visible: false,
    record: null,
  });
  const [rejectDialog, setRejectDialog] = useState<{ visible: boolean; record: any | null }>({
    visible: false,
    record: null,
  });

  const fetchWallets = () => {
    setLoading(true);
    getWalletsWithUserInfo()
      .then((data) => {
        // Loại bỏ ví của admin khỏi danh sách
        const filteredData = data.filter((wallet) => wallet.user?.role?.name !== 'ADMIN');
        setWallets(filteredData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const columns = [
    {
      title: 'Chủ ví',
      dataIndex: 'user',
      key: 'user',
      render: (user: Wallet['user']) => (
        <span>
          <b>{user.fullName}</b>
          <br />
          <span style={{ color: '#888' }}>{user.email}</span>
        </span>
      ),
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'bankAccountNumber',
      key: 'bankAccountNumber',
      render: (val: string) => val || <Tag color="default">Chưa liên kết</Tag>,
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank: Wallet['bank']) => bank?.name || <Tag color="default">-</Tag>,
    },
    {
      title: 'Số dư',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      render: (val: number) =>
        Math.round(val).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫',
    },
    {
      title: 'Tổng thu nhập',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
      render: (val: number) =>
        Math.round(val).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => new Date(val).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Wallet) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => setSelectedWallet(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showApproveConfirm = (record: any) => {
    setApproveDialog({ visible: true, record });
  };
  const showRejectConfirm = (record: any) => {
    setRejectDialog({ visible: true, record });
  };

  const handleApprove = async () => {
    if (!approveDialog.record) return;
    try {
      await approveWithdrawalRequest(approveDialog.record.id);
      setApproveDialog({ visible: false, record: null });
      setSelectedWallet(null); // Close detail modal after action
      fetchWallets(); // Refresh data
    } catch (e) {
      Modal.error({ title: 'Lỗi', content: 'Không thể duyệt yêu cầu.' });
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.record) return;
    try {
      await rejectWithdrawalRequest(rejectDialog.record.id);
      setRejectDialog({ visible: false, record: null });
      setSelectedWallet(null); // Close detail modal after action
      fetchWallets(); // Refresh data
    } catch (e) {
      Modal.error({ title: 'Lỗi', content: 'Không thể từ chối yêu cầu.' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm border-gray-100" style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý ví người dùng
        </Title>
      </Card>
      <Card className="rounded-2xl border-0 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={wallets}
            rowKey={(record) =>
              `${record.user?.id ?? 'nouser'}-${record.bankAccountNumber ?? 'nobank'}`
            }
            pagination={{ pageSize: 10 }}
            rowClassName={(record) =>
              Array.isArray(record.withdrawalRequests) &&
              record.withdrawalRequests.some((r) => r.status === 'PENDING')
                ? 'wallet-row-pending'
                : ''
            }
          />
        )}
      </Card>
      <Modal
        open={!!selectedWallet}
        title="Chi tiết ví người dùng"
        onCancel={() => setSelectedWallet(null)}
        footer={null}
        width={800}
      >
        {selectedWallet && (
          <>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Họ tên">{selectedWallet.user.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedWallet.user.email}</Descriptions.Item>
              <Descriptions.Item label="Số tài khoản">
                {selectedWallet.bankAccountNumber || <Tag color="default">Chưa liên kết</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Ngân hàng">
                {selectedWallet.bank?.name || <Tag color="default">-</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Số dư">
                {Math.round(selectedWallet.currentBalance).toLocaleString('vi-VN', {
                  maximumFractionDigits: 0,
                })}{' '}
                ₫
              </Descriptions.Item>
              <Descriptions.Item label="Tổng thu nhập">
                {Math.round(selectedWallet.totalIncome).toLocaleString('vi-VN', {
                  maximumFractionDigits: 0,
                })}{' '}
                ₫
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedWallet.createdAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {new Date(selectedWallet.updatedAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 24 }}>
              <Typography.Title level={5}>Lịch sử yêu cầu rút tiền</Typography.Title>
              <Table
                dataSource={selectedWallet.withdrawalRequests || []}
                rowKey={(r) => r.id}
                size="small"
                pagination={false}
                bordered
                columns={[
                  {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    width: 60,
                  },
                  {
                    title: 'Số tiền',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (val: number) =>
                      Math.round(val).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫',
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    render: (val: string) => {
                      let color = 'default';
                      let text = val;
                      if (val === 'APPROVED') {
                        color = 'green';
                        text = 'Đã duyệt';
                      } else if (val === 'REJECTED') {
                        color = 'red';
                        text = 'Từ chối';
                      } else if (val === 'PENDING') {
                        color = 'orange';
                        text = 'Chờ duyệt';
                      }
                      return <Tag color={color}>{text}</Tag>;
                    },
                  },
                  {
                    title: 'Ngày tạo',
                    dataIndex: 'requestedAt',
                    key: 'requestedAt',
                    render: (val: string) => new Date(val).toLocaleDateString('vi-VN'),
                  },
                  {
                    title: 'Ngày hoàn thành',
                    dataIndex: 'updatedAt',
                    key: 'updatedAt',
                    render: (val: string, record: any) =>
                      record.status === 'PENDING' ? (
                        <span style={{ color: '#aaa' }}>-</span>
                      ) : (
                        new Date(val).toLocaleDateString('vi-VN')
                      ),
                  },
                  {
                    title: 'Hành động',
                    key: 'actions',
                    render: (_: any, record: any) =>
                      record.status === 'PENDING' ? (
                        <Space>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => showApproveConfirm(record)}
                          >
                            Duyệt
                          </Button>
                          <Button danger size="small" onClick={() => showRejectConfirm(record)}>
                            Từ chối
                          </Button>
                        </Space>
                      ) : null,
                  },
                ]}
                locale={{ emptyText: 'Không có yêu cầu rút tiền nào' }}
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <Typography.Title level={5}>Lịch sử giao dịch ví</Typography.Title>
              <Table
                dataSource={selectedWallet.transactions || []}
                rowKey={(r) => r.id}
                size="small"
                pagination={false}
                bordered
                columns={[
                  {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    width: 60,
                  },
                  {
                    title: 'Số tiền',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (val: number) =>
                      Math.round(val).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' ₫',
                  },
                  {
                    title: 'Loại',
                    dataIndex: 'type',
                    key: 'type',
                    render: (val: string) => {
                      if (val === 'CREDIT') {
                        return (
                          <span
                            style={{
                              color: '#52c41a',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <PlusCircleTwoTone twoToneColor="#52c41a" /> Cộng tiền
                          </span>
                        );
                      }
                      if (val === 'DEBIT') {
                        return (
                          <span
                            style={{
                              color: '#fa541c',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <MinusCircleTwoTone twoToneColor="#fa541c" /> Trừ tiền
                          </span>
                        );
                      }
                      return val;
                    },
                  },
                  {
                    title: 'Mô tả',
                    dataIndex: 'description',
                    key: 'description',
                  },
                  {
                    title: 'Ngày tạo',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: (val: string) => new Date(val).toLocaleDateString('vi-VN'),
                  },
                ]}
                locale={{ emptyText: 'Không có giao dịch nào' }}
              />
            </div>
          </>
        )}
      </Modal>

      {/* Approve Confirm Dialog */}
      <Modal
        open={approveDialog.visible}
        title="Xác nhận duyệt yêu cầu rút tiền?"
        onCancel={() => setApproveDialog({ visible: false, record: null })}
        onOk={handleApprove}
        okText="Duyệt"
        cancelText="Hủy"
        destroyOnClose
      >
        {approveDialog.record && (
          <div>Bạn có chắc muốn duyệt yêu cầu rút tiền #{approveDialog.record.id}?</div>
        )}
      </Modal>

      {/* Reject Confirm Dialog */}
      <Modal
        open={rejectDialog.visible}
        title="Xác nhận từ chối yêu cầu rút tiền?"
        onCancel={() => setRejectDialog({ visible: false, record: null })}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
        destroyOnClose
      >
        {rejectDialog.record && (
          <div>Bạn có chắc muốn từ chối yêu cầu rút tiền #{rejectDialog.record.id}?</div>
        )}
      </Modal>

      <style jsx global>{`
        .wallet-row-pending {
          background: #fffbe6 !important;
        }
      `}</style>
    </div>
  );
}
