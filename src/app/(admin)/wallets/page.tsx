'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { EyeOutlined } from '@ant-design/icons';
import { getWalletsWithUserInfo } from '@/services/walletApi';

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
  };
  bank?: {
    id: number;
    name: string;
  };
  withdrawalRequests?: WithdrawalRequest[];
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    setLoading(true);
    getWalletsWithUserInfo()
      .then((data) => setWallets(data))
      .finally(() => setLoading(false));
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
    Modal.confirm({
      title: 'Xác nhận duyệt yêu cầu rút tiền?',
      content: `Bạn có chắc muốn duyệt yêu cầu rút tiền #${record.id}?`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: () => {
        // TODO: Call approve API here
      },
    });
  };
  const showRejectConfirm = (record: any) => {
    Modal.confirm({
      title: 'Xác nhận từ chối yêu cầu rút tiền?',
      content: `Bạn có chắc muốn từ chối yêu cầu rút tiền #${record.id}?`,
      okText: 'Từ chối',
      cancelText: 'Hủy',
      onOk: () => {
        // TODO: Call reject API here
      },
    });
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
          </>
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
