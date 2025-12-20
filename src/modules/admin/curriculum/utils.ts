// Hàm định dạng ngày tháng an toàn
export const formatDateSafe = (dateString?: string | null) => {
  if (!dateString) return '-';
  try {
    // Chuyển đổi về dạng YYYY-MM-DD để đảm bảo nhất quán
    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('vi-VN');
  } catch (error) {
    console.error('Lỗi khi định dạng ngày:', error);
    return dateString || '-';
  }
};

export const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    UPLOADING: 'blue',
    PROCESSING: 'cyan',
    PENDING: 'orange',
    PENDING_APPROVAL: 'orange',
    APPROVED: 'green',
    REJECTED: 'red',
    READY: 'green',
  };
  return colors[status] || 'default';
};

export const getStatusText = (status: string) => {
  const texts: { [key: string]: string } = {
    UPLOADING: 'Đang tải lên',
    PROCESSING: 'Đang xử lý',
    PENDING: 'Chờ phê duyệt',
    PENDING_APPROVAL: 'Chờ phê duyệt',
    APPROVED: 'Đã phê duyệt',
    REJECTED: 'Đã từ chối',
    READY: 'Sẵn sàng',
  };
  return texts[status] || status;
};

export const getLevelText = (level: string) => {
  const texts: { [key: string]: string } = {
    BEGINNER: 'Cơ bản',
    INTERMEDIATE: 'Trung cấp',
    ADVANCED: 'Nâng cao',
    PROFESSIONAL: 'Chuyên nghiệp',
  };
  return texts[level] || level;
};

export const getLevelColor = (level: string) => {
  const colors: { [key: string]: string } = {
    BEGINNER: 'green',
    INTERMEDIATE: 'blue',
    ADVANCED: 'orange',
    PROFESSIONAL: 'red',
  };
  return colors[level] || 'default';
};

export const parseVideoTags = (tags?: string | string[] | null): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .filter((tag) => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  const cleaned = tags.replace(/^\{|\}$/g, '');
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((tag) => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  } catch {
    // Fallback to comma-split below when JSON.parse fails
  }

  return cleaned
    .split(',')
    .map((tag) => tag.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);
};
