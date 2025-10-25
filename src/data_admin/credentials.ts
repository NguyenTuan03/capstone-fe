import { Credential } from '@/types/credential';
import { CourseCredentialType } from '@/types/enums';

// Credentials for coaches - to be linked to each coach
export const credentials: Credential[] = [
  // Coach 1 (Nguyễn Văn Minh) - 2 credentials
  {
    id: 1,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản do Liên đoàn Pickleball Việt Nam cấp',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-001.pdf',
    issuedAt: new Date('2023-03-15'),
    expiresAt: new Date('2026-03-15'),
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
  },
  {
    id: 2,
    name: 'Chứng chỉ An toàn Thể thao',
    description: 'Chứng chỉ an toàn trong giảng dạy thể thao',
    type: CourseCredentialType.TRAINING,
    publicUrl: 'https://example.com/cert-002.pdf',
    issuedAt: new Date('2023-01-10'),
    expiresAt: new Date('2025-01-10'),
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-10'),
  },

  // Coach 2 (Trần Thị Hương) - 1 credential
  {
    id: 3,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-003.pdf',
    issuedAt: new Date('2023-07-20'),
    expiresAt: new Date('2026-07-20'),
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2023-07-20'),
  },

  // Coach 3 (Lê Văn Cường) - 2 credentials
  {
    id: 4,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 2',
    description: 'Chứng chỉ huấn luyện viên nâng cao',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-004.pdf',
    issuedAt: new Date('2022-11-15'),
    expiresAt: new Date('2025-11-15'),
    createdAt: new Date('2022-11-15'),
    updatedAt: new Date('2022-11-15'),
  },
  {
    id: 5,
    name: 'Chứng chỉ Trọng tài Pickleball',
    description: 'Chứng chỉ trọng tài quốc tế',
    type: CourseCredentialType.LICENSE,
    publicUrl: 'https://example.com/cert-005.pdf',
    issuedAt: new Date('2022-08-10'),
    expiresAt: new Date('2025-08-10'),
    createdAt: new Date('2022-08-10'),
    updatedAt: new Date('2022-08-10'),
  },

  // Coach 4 (Phạm Thị Mai) - 1 credential
  {
    id: 6,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Đang chờ xác minh từ tổ chức cấp chứng chỉ',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-006.pdf',
    issuedAt: new Date('2024-01-15'),
    expiresAt: new Date('2027-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },

  // Coach 5 (Hoàng Văn Đức) - 2 credentials
  {
    id: 7,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-007.pdf',
    issuedAt: new Date('2023-08-01'),
    expiresAt: new Date('2026-08-01'),
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-08-01'),
  },
  {
    id: 8,
    name: 'Chứng chỉ Y học Thể thao',
    description: 'Chứng chỉ chăm sóc sức khỏe vận động viên',
    type: CourseCredentialType.TRAINING,
    publicUrl: 'https://example.com/cert-008.pdf',
    issuedAt: new Date('2022-12-20'),
    createdAt: new Date('2022-12-20'),
    updatedAt: new Date('2022-12-20'),
  },

  // Coach 6 (Vũ Thị Lan) - 2 credentials
  {
    id: 9,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-009.pdf',
    issuedAt: new Date('2023-06-12'),
    expiresAt: new Date('2026-06-12'),
    createdAt: new Date('2023-06-12'),
    updatedAt: new Date('2023-06-12'),
  },
  {
    id: 10,
    name: 'Chứng chỉ An toàn Thể thao',
    description: 'Chứng chỉ an toàn trong giảng dạy thể thao',
    type: CourseCredentialType.TRAINING,
    publicUrl: 'https://example.com/cert-010.pdf',
    issuedAt: new Date('2023-05-01'),
    expiresAt: new Date('2025-05-01'),
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-05-01'),
  },

  // Coach 7 (Đỗ Văn Thành) - 2 credentials
  {
    id: 11,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-011.pdf',
    issuedAt: new Date('2023-04-18'),
    expiresAt: new Date('2026-04-18'),
    createdAt: new Date('2023-04-18'),
    updatedAt: new Date('2023-04-18'),
  },
  {
    id: 12,
    name: 'Chứng chỉ Huấn luyện viên trẻ em',
    description: 'Chuyên về giảng dạy cho lứa tuổi thiếu nhi',
    type: CourseCredentialType.TRAINING,
    publicUrl: 'https://example.com/cert-012.pdf',
    issuedAt: new Date('2023-05-20'),
    expiresAt: new Date('2026-05-20'),
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-05-20'),
  },

  // Coach 8 (Bùi Thị Nga) - 2 credentials
  {
    id: 13,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-013.pdf',
    issuedAt: new Date('2023-09-22'),
    expiresAt: new Date('2026-09-22'),
    createdAt: new Date('2023-09-22'),
    updatedAt: new Date('2023-09-22'),
  },
  {
    id: 14,
    name: 'Chứng chỉ An toàn Thể thao',
    description: 'Chứng chỉ an toàn trong giảng dạy thể thao',
    type: CourseCredentialType.TRAINING,
    publicUrl: 'https://example.com/cert-014.pdf',
    issuedAt: new Date('2023-08-15'),
    expiresAt: new Date('2025-08-15'),
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-08-15'),
  },

  // Coach 9 (Ngô Văn Hải) - 1 credential
  {
    id: 15,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-015.pdf',
    issuedAt: new Date('2023-10-08'),
    expiresAt: new Date('2026-10-08'),
    createdAt: new Date('2023-10-08'),
    updatedAt: new Date('2023-10-08'),
  },

  // Coach 10 (Đinh Thị Phương) - 2 credentials
  {
    id: 16,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-016.pdf',
    issuedAt: new Date('2023-02-25'),
    expiresAt: new Date('2026-02-25'),
    createdAt: new Date('2023-02-25'),
    updatedAt: new Date('2023-02-25'),
  },
  {
    id: 17,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 2',
    description: 'Chứng chỉ huấn luyện viên nâng cao',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-017.pdf',
    issuedAt: new Date('2023-11-10'),
    expiresAt: new Date('2026-11-10'),
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10'),
  },

  // Coach 11 (Lý Văn Tài) - 1 credential
  {
    id: 18,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-018.pdf',
    issuedAt: new Date('2023-11-05'),
    expiresAt: new Date('2026-11-05'),
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05'),
  },

  // Coach 12 (Cao Thị Tâm) - 2 credentials
  {
    id: 19,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-019.pdf',
    issuedAt: new Date('2023-01-14'),
    expiresAt: new Date('2026-01-14'),
    createdAt: new Date('2023-01-14'),
    updatedAt: new Date('2023-01-14'),
  },
  {
    id: 20,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 2',
    description: 'Chứng chỉ huấn luyện viên nâng cao',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-020.pdf',
    issuedAt: new Date('2023-08-22'),
    expiresAt: new Date('2026-08-22'),
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2023-08-22'),
  },

  // Pending Coaches - Valid credentials awaiting verification
  // Coach 13 (Phan Văn Thắng) - Valid credential
  {
    id: 21,
    name: 'Chứng chỉ Huấn luyện viên Pickleball Cấp 1',
    description: 'Chứng chỉ huấn luyện viên cơ bản đang chờ xác minh',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-021-pending.pdf',
    issuedAt: new Date('2023-11-15'),
    expiresAt: new Date('2026-11-15'),
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
    status: 'PENDING',
  },

  // Coach 14 (Võ Thị Thu) - Valid credential
  {
    id: 22,
    name: 'Chứng chỉ Huấn luyện viên thể thao',
    description: 'Chứng chỉ huấn luyện viên thể thao đang chờ xác minh',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-022-pending.pdf',
    issuedAt: new Date('2023-12-01'),
    expiresAt: new Date('2026-12-01'),
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
    status: 'PENDING',
  },

  // Coach 15 (Trịnh Văn Vương) - Valid credentials (2)
  {
    id: 23,
    name: 'Chứng chỉ Huấn luyện viên Pickleball',
    description: 'Chứng chỉ huấn luyện viên đang chờ xác minh',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-023-pending.pdf',
    issuedAt: new Date('2023-10-20'),
    expiresAt: new Date('2026-10-20'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    status: 'PENDING',
  },
  {
    id: 24,
    name: 'Chứng chỉ Sơ cứu thể thao',
    description: 'Chứng chỉ sơ cứu cơ bản',
    type: CourseCredentialType.TRAINING,
    publicUrl: 'https://example.com/cert-024-pending.pdf',
    issuedAt: new Date('2023-09-15'),
    expiresAt: new Date('2025-09-15'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    status: 'PENDING',
  },

  // Rejected Coaches - Credentials with issues
  // Coach 16 (Nguyễn Văn Tuấn) - Expired credential
  {
    id: 25,
    name: 'Chứng chỉ Pickleball cơ bản',
    description: 'Chứng chỉ đã hết hạn - không hợp lệ',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-025-expired.pdf',
    issuedAt: new Date('2020-01-10'),
    expiresAt: new Date('2023-01-10'), // EXPIRED
    createdAt: new Date('2020-01-10'),
    updatedAt: new Date('2020-01-10'),
    status: 'REJECTED',
  },

  // Coach 17 (Trần Thị Linh) - Fake credential
  {
    id: 26,
    name: 'Chứng chỉ Huấn luyện viên quốc tế',
    description: 'Chứng chỉ không được xác thực - nghi ngờ giả mạo',
    type: CourseCredentialType.CERTIFICATE,
    publicUrl: 'https://example.com/cert-026-fake.pdf',
    issuedAt: new Date('2023-06-01'),
    expiresAt: new Date('2026-06-01'),
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-20'),
    status: 'REJECTED',
  },

  // Coach 18 (Lê Văn Khoa) - Incomplete/missing documentation
  {
    id: 27,
    name: 'Chứng chỉ cơ bản',
    description: 'Thiếu thông tin xác thực - không đủ điều kiện',
    type: CourseCredentialType.OTHER,
    publicUrl: 'https://example.com/cert-027-incomplete.pdf',
    issuedAt: new Date('2023-12-01'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-20'),
    status: 'REJECTED',
  },
];

// Helper to get credentials by coach ID (based on coach entity id 1-18)
export const getCredentialsByCoachId = (coachId: number): Credential[] => {
  const credentialMap: { [key: number]: number[] } = {
    1: [1, 2], // Coach 1: 2 credentials (VERIFIED)
    2: [3], // Coach 2: 1 credential (VERIFIED)
    3: [4, 5], // Coach 3: 2 credentials (VERIFIED)
    4: [6], // Coach 4: 1 credential (PENDING - Phạm Thị Mai)
    5: [7, 8], // Coach 5: 2 credentials (VERIFIED)
    6: [9, 10], // Coach 6: 2 credentials (VERIFIED)
    7: [11, 12], // Coach 7: 2 credentials (VERIFIED)
    8: [13, 14], // Coach 8: 2 credentials (VERIFIED)
    9: [15], // Coach 9: 1 credential (VERIFIED)
    10: [16, 17], // Coach 10: 2 credentials (VERIFIED)
    11: [18], // Coach 11: 1 credential (VERIFIED)
    12: [19, 20], // Coach 12: 2 credentials (VERIFIED)
    13: [21], // Coach 13: 1 credential (PENDING - Phan Văn Thắng)
    14: [22], // Coach 14: 1 credential (PENDING - Võ Thị Thu)
    15: [23, 24], // Coach 15: 2 credentials (PENDING - Trịnh Văn Vương)
    16: [25], // Coach 16: 1 credential (REJECTED - Nguyễn Văn Tuấn - expired)
    17: [26], // Coach 17: 1 credential (REJECTED - Trần Thị Linh - fake)
    18: [27], // Coach 18: 1 credential (REJECTED - Lê Văn Khoa - incomplete)
  };

  const credIds = credentialMap[coachId] || [];
  return credentials.filter((cred) => credIds.includes(cred.id));
};

