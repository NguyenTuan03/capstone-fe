// ---- Helpers
const toVND = (v: string | number | null | undefined) => {
  const n = typeof v === 'string' ? Number(v) : Number(v ?? 0);
  if (Number.isNaN(n)) return '0₫';
  return n.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });
};

const dayMapVi: Record<string, string> = {
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ nhật',
};

const padHm = (t?: string | null) => (t ? t.slice(0, 5) : '');

const fmtSchedule = (
  schedules?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>,
) => {
  if (!schedules || !schedules.length) return 'Chưa có lịch';
  // Ví dụ: "Thứ 6 21:17–23:00; Thứ 6 04:00–05:00"
  return schedules
    .map((s) => `${dayMapVi[s.dayOfWeek] ?? s.dayOfWeek} ${padHm(s.startTime)}–${padHm(s.endTime)}`)
    .join('; ');
};

const fmtDateRange = (start?: string | null, end?: string | null) => {
  const toVi = (d?: string | null) => (d ? new Date(d).toLocaleDateString('vi-VN') : '');
  if (!start && !end) return '';
  if (start && !end) return `từ ${toVi(start)}`;
  if (!start && end) return `đến ${toVi(end)}`;
  return `${toVi(start)} – ${toVi(end)}`;
};

export type ApiItem = {
  id: number;
  name: string;
  description?: string | null;
  level?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  totalSessions?: number | null;
  schedules?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
  address?: string | null;
  district?: { id?: number; name?: string } | null;
  province?: { id?: number; name?: string } | null;
  createdBy?: { fullName?: string } | null;
  currentParticipants?: number | null;
  maxParticipants?: number | null;
  pricePerParticipant?: string | number | null;
  learningFormat?: string | null;
  subject?: { id: number; name: string; status?: string } | null;
};

export type MappedCourse = {
  id: number;
  name: string;
  description?: string | null;
  level?: string | null;
  levelColor: string;
  status: 'ongoing' | 'ended' | 'upcoming' | 'pending' | 'rejected';
  statusText: string;
  statusBadge?: string;
  sessions: number;
  schedule: string;
  location: string;
  coach: string;
  currentStudents: number;
  maxStudents: number;
  sessionsCompleted: number;
  fee: string;
  discount: string;
  feeDetail: string;
  raw: ApiItem;
};

export type PaginatedApiResponse = {
  items: ApiItem[];
  total: number;
  page?: number;
  pageSize?: number;
};

export type MappedCoursesResponse = {
  courses: MappedCourse[];
  total: number;
  page?: number;
  pageSize?: number;
};

// Tính “ongoing/ended/upcoming” theo ngày thực tế + trạng thái duyệt
const computeRuntimeStatus = (item: ApiItem) => {
  const now = new Date(); // Asia/Ho_Chi_Minh
  const start = item.startDate ? new Date(item.startDate) : null;
  const end = item.endDate ? new Date(item.endDate) : null;

  // Ưu tiên business status
  if (item.status === 'REJECTED') {
    return { status: 'rejected' as const, statusText: 'Đã bị từ chối', statusBadge: 'Bị từ chối' };
  }
  if (item.status === 'APPROVED') {
    if (start && now < start) return { status: 'upcoming' as const, statusText: 'Sắp khai giảng' };
    if (start && (!end || now <= end))
      return { status: 'ongoing' as const, statusText: 'Đang diễn ra' };
    if (end && now > end) return { status: 'ended' as const, statusText: 'Đã kết thúc' };
  }
  // Fallback cho PENDING/khác
  return { status: 'pending' as const, statusText: 'Đang chờ duyệt' };
};

const levelColor = (lv?: string | null) => {
  switch ((lv ?? '').toUpperCase()) {
    case 'BEGINNER':
      return 'green';
    case 'INTERMEDIATE':
      return 'blue';
    case 'ADVANCED':
      return 'purple';
    default:
      return 'blue';
  }
};

const sessionsCompleted = (item: ApiItem) => {
  // Nếu có tổng buổi và endDate < now thì coi như hoàn tất hết, còn lại thì 0 (tuỳ logic bạn chỉnh)
  const now = new Date();
  const end = item.endDate ? new Date(item.endDate) : null;
  if (end && now > end) return item.totalSessions ?? 0;
  return 0;
};

const pickLocation = (item: ApiItem) => {
  // Ưu tiên địa chỉ cụ thể, sau đó district + province
  if (item.address) return item.address;
  const parts = [item.district?.name, item.province?.name].filter(Boolean);
  return parts.join(', ') || '—';
};

// ---- Main mapping
export const mapCourses = (items: ApiItem[]): MappedCourse[] => {
  return items.map((it) => {
    const runtime = computeRuntimeStatus(it);
    const scheduleTxt = fmtSchedule(it.schedules);
    const dateRange = fmtDateRange(it.startDate, it.endDate);

    return {
      // ======= DỮ LIỆU DÙNG CHO <CourseCard /> =======
      id: it.id,
      name: it.name,
      description: it.description,
      // chip level
      level: it.level,
      levelColor: levelColor(it.level),

      // trạng thái hiển thị
      status: runtime.status, // 'ongoing' để thẻ đổi màu, còn lại sẽ là xám
      statusText: runtime.statusText, // text nằm trong chip
      statusBadge: runtime.statusBadge, // optional chip đỏ (ví dụ bị từ chối)

      // các field hiển thị phần icon
      sessions: it.totalSessions ?? 0, // "X tuần" (nếu bạn muốn là số tuần lịch, thay bằng diff)
      schedule: [scheduleTxt, dateRange].filter(Boolean).join(' · '),
      location: pickLocation(it),
      coach: it.createdBy?.fullName ?? '—',

      // sĩ số
      currentStudents: it.currentParticipants ?? 0,
      maxStudents: it.maxParticipants ?? 0,
      sessionsCompleted: sessionsCompleted(it),

      // học phí
      fee: toVND(it.pricePerParticipant),
      discount: '', // nếu có khuyến mãi bạn set ở đây, ví dụ '–10%'
      feeDetail: 'Tính theo người/khóa', // tuỳ UI

      // ======= DỮ LIỆU GỐC GIỮ LẠI (nếu cần cho modal/chi tiết) =======
      raw: it,
    };
  });
};

// ---- Paginated API response mapping
export const mapCoursesWithPagination = (
  response: PaginatedApiResponse | null | undefined,
): MappedCoursesResponse => {
  if (!response || !response.items) {
    return {
      courses: [],
      total: 0,
      page: response?.page,
      pageSize: response?.pageSize,
    };
  }

  return {
    courses: mapCourses(response.items),
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
  };
};
