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
  Tooltip,
  Dropdown,
  Modal,
  Form,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Statistic,
  Badge,
  Typography,
  Descriptions,
  Rate,
  Tabs,
  Alert,
  Progress,
} from 'antd';

import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  PlayCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MoreOutlined,
} from '@ant-design/icons';

import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import IntlMessages from '@/@crema/helper/IntlMessages';
import { SessionApiService } from '@/services/sessionApi';
import {
  Session,
  SessionStats,
  GetSessionsParams,
  RefundRequest,
  SuspendUserRequest,
  WarnUserRequest,
} from '@/types/session';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const SessionsPageClient = () => {
  // States
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);
  const [warnModalVisible, setWarnModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState<string[]>([]);
  const [refundReasons, setRefundReasons] = useState<string[]>([]);

  // Form instances
  const [refundForm] = Form.useForm();
  const [suspendForm] = Form.useForm();
  const [warnForm] = Form.useForm();

  // Filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [issuesFilter, setIssuesFilter] = useState<string>('all');
  const [recordingFilter, setRecordingFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Load data
  const loadSessions = async () => {
    setLoading(true);
    try {
      const params: GetSessionsParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        dateRange: dateRange ? [dateRange[0].toISOString(), dateRange[1].toISOString()] : undefined,
        hasIssues: issuesFilter !== 'all' ? issuesFilter === 'yes' : undefined,
        hasRecording: recordingFilter !== 'all' ? recordingFilter === 'yes' : undefined,
      };

      const response = await SessionApiService.getSessions(params);
      setSessions(response.sessions);
      setStats(response.stats);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('Không thể tải dữ liệu buổi học');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadSessions();
    loadReasons();
  }, [pagination.current, pagination.pageSize]);

  // Load reasons
  const loadReasons = async () => {
    try {
      const [reportReasonsData, refundReasonsData] = await Promise.all([
        SessionApiService.getReportReasons(),
        SessionApiService.getRefundReasons(),
      ]);
      setReportReasons(reportReasonsData);
      setRefundReasons(refundReasonsData);
    } catch (error) {
      console.error('Failed to load reasons:', error);
    }
  };

  // Helper functions
  const getStatusTag = (status: Session['status']) => {
    const statusConfig = {
      scheduled: { color: 'blue', text: 'session.status.scheduled' },
      in_progress: { color: 'processing', text: 'session.status.in_progress' },
      completed: { color: 'success', text: 'session.status.completed' },
      cancelled: { color: 'default', text: 'session.status.cancelled' },
      no_show: { color: 'error', text: 'session.status.no_show' },
    };

    const config = statusConfig[status];
    return (
      <Tag color={config.color}>
        <IntlMessages id={config.text} />
      </Tag>
    );
  };

  const getPaymentTag = (paymentStatus: Session['paymentStatus']) => {
    const paymentConfig = {
      paid: { color: 'success', text: 'session.payment.paid' },
      pending: { color: 'warning', text: 'session.payment.pending' },
      refunded: { color: 'error', text: 'session.payment.refunded' },
      partial_refund: { color: 'orange', text: 'session.payment.partial_refund' },
      failed: { color: 'error', text: 'session.payment.failed' },
    };

    const config = paymentConfig[paymentStatus];
    return (
      <Tag color={config.color}>
        <IntlMessages id={config.text} />
      </Tag>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Handlers
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    loadSessions();
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setTypeFilter('all');
    setIssuesFilter('all');
    setRecordingFilter('all');
    setDateRange(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setTimeout(() => loadSessions(), 100);
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setDetailModalVisible(true);
  };

  const handleRefund = (session: Session) => {
    setSelectedSession(session);
    refundForm.setFieldsValue({
      amount: session.totalAmount,
      reason: undefined,
      notes: '',
    });
    setRefundModalVisible(true);
  };

  const handleSuspend = (session: Session, userType: 'coach' | 'learner') => {
    setSelectedSession(session);
    suspendForm.setFieldsValue({
      userType,
      duration: 7,
      reason: '',
      notes: '',
      evidence: [],
    });
    setSuspendModalVisible(true);
  };

  const handleWarn = (session: Session, userType: 'coach' | 'learner') => {
    setSelectedSession(session);
    warnForm.setFieldsValue({
      userType,
      severity: 'medium',
      reason: '',
      notes: '',
    });
    setWarnModalVisible(true);
  };

  const handleProcessRefund = async (values: any) => {
    if (!selectedSession) return;

    try {
      const request: RefundRequest = {
        sessionId: selectedSession.id,
        amount: values.amount,
        reason: values.reason,
        adminId: 'admin-001',
        notes: values.notes,
      };

      const response = await SessionApiService.processRefund(request);
      if (response.success) {
        message.success(response.message);
        setRefundModalVisible(false);
        refundForm.resetFields();
        loadSessions();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Không thể xử lý hoàn tiền');
    }
  };

  const handleProcessSuspend = async (values: any) => {
    if (!selectedSession) return;

    try {
      const targetUser =
        values.userType === 'coach' ? selectedSession.coach : selectedSession.learner;

      const request: SuspendUserRequest = {
        userId: targetUser.id,
        userType: values.userType,
        sessionId: selectedSession.id,
        reason: values.reason,
        duration: values.duration === -1 ? 0 : values.duration,
        adminId: 'admin-001',
        notes: values.notes,
        evidence: values.evidence?.map((file: any) => file.url).filter(Boolean),
      };

      const response = await SessionApiService.suspendUser(request);
      if (response.success) {
        message.success(response.message);
        setSuspendModalVisible(false);
        suspendForm.resetFields();
        loadSessions();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Không thể tạm khóa người dùng');
    }
  };

  const handleProcessWarn = async (values: any) => {
    if (!selectedSession) return;

    try {
      const targetUser =
        values.userType === 'coach' ? selectedSession.coach : selectedSession.learner;

      const request: WarnUserRequest = {
        userId: targetUser.id,
        userType: values.userType,
        sessionId: selectedSession.id,
        reason: values.reason,
        severity: values.severity,
        adminId: 'admin-001',
        notes: values.notes,
      };

      const response = await SessionApiService.warnUser(request);
      if (response.success) {
        message.success(response.message);
        setWarnModalVisible(false);
        warnForm.resetFields();
        loadSessions();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Không thể gửi cảnh cáo');
    }
  };

  return {
    sessions,
    loading,
    stats,
    selectedSession,
    detailModalVisible,
    refundModalVisible,
    suspendModalVisible,
    warnModalVisible,
    refundReasons,
    refundForm,
    suspendForm,
    warnForm,
    searchText,
    statusFilter,
    paymentFilter,
    typeFilter,
    issuesFilter,
    recordingFilter,
    dateRange,
    pagination,
    getStatusTag,
    getPaymentTag,
    formatCurrency,
    formatDateTime,
    formatDuration,
    handleSearch,
    handleClearFilters,
    handleViewSession,
    handleRefund,
    handleSuspend,
    handleWarn,
    handleProcessRefund,
    handleProcessSuspend,
    handleProcessWarn,
    setSearchText,
    setStatusFilter,
    setPaymentFilter,
    setTypeFilter,
    setIssuesFilter,
    setRecordingFilter,
    setDateRange,
    setPagination,
    setDetailModalVisible,
    setRefundModalVisible,
    setSuspendModalVisible,
    setWarnModalVisible,
  };
};

export default SessionsPageClient;
