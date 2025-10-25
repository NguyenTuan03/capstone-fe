import { CoachEntity } from '@/types/coach-entity';
import { CoachVerificationStatus } from '@/types/enums';
import { users } from './users';
import { getCredentialsByCoachId } from './credentials';

// 18 coaches - mapping to user IDs 2-13 (verified), 31-33 (pending), 34-36 (rejected)
export const coachEntities: CoachEntity[] = [
  {
    id: 1,
    bio: 'Có 5 năm kinh nghiệm huấn luyện pickleball, từng tham gia nhiều giải đấu quốc gia. Chuyên về kỹ thuật cơ bản và phát triển tài năng trẻ.',
    specialties: ['Kỹ thuật cơ bản', 'Chiến thuật nâng cao', 'Huấn luyện trẻ em'],
    teachingMethods: ['Thực hành trực tiếp', 'Video phân tích', 'Drills chuyên sâu'],
    yearOfExperience: 5,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-26'),
    user: users[1], // Nguyễn Văn Minh (id: 2)
    credentials: getCredentialsByCoachId(1),
  },
  {
    id: 2,
    bio: 'Huấn luyện viên trẻ năng động với phong cách dạy thân thiện. Chuyên về kỹ thuật cơ bản và chiến thuật thi đấu đôi.',
    specialties: ['Kỹ thuật cơ bản', 'Thi đấu đôi', 'Chiến thuật phòng thủ'],
    teachingMethods: ['Game-based learning', 'Nhóm nhỏ', 'Cá nhân hóa'],
    yearOfExperience: 3,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-26'),
    user: users[2], // Trần Thị Hương (id: 3)
    credentials: getCredentialsByCoachId(2),
  },
  {
    id: 3,
    bio: 'Cựu vận động viên pickleball quốc gia với nhiều năm kinh nghiệm thi đấu và huấn luyện chuyên nghiệp.',
    specialties: ['Chiến thuật nâng cao', 'Thi đấu chuyên nghiệp', 'Kỹ thuật serve'],
    teachingMethods: ['Chuyên sâu kỹ thuật', 'Phân tích đối thủ', 'Mental coaching'],
    yearOfExperience: 7,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2024-01-20'),
    user: users[3], // Lê Văn Cường (id: 4) - Suspended
    credentials: getCredentialsByCoachId(3),
  },
  {
    id: 4,
    bio: 'Huấn luyện viên mới với đam mê pickleball và mong muốn chia sẻ kiến thức với học viên.',
    specialties: ['Kỹ thuật cơ bản', 'Người mới bắt đầu'],
    teachingMethods: ['Từng bước cơ bản', 'Khuyến khích tích cực', 'Luyện tập nhẹ nhàng'],
    yearOfExperience: 2,
    verificationStatus: CoachVerificationStatus.PENDING,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-26'),
    user: users[4], // Phạm Thị Mai (id: 5)
    credentials: getCredentialsByCoachId(4),
  },
  {
    id: 5,
    bio: 'Huấn luyện viên có nền tảng y học thể thao, chuyên về kỹ thuật an toàn và phục hồi chấn thương.',
    specialties: ['Kỹ thuật cơ bản', 'Chiến thuật nâng cao', 'Phục hồi chấn thương', 'Dinh dưỡng thể thao'],
    teachingMethods: ['Khoa học vận động', 'Phòng ngừa chấn thương', 'Kỹ thuật an toàn'],
    yearOfExperience: 4,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2024-01-26'),
    user: users[5], // Hoàng Văn Đức (id: 6)
    credentials: getCredentialsByCoachId(5),
  },
  {
    id: 6,
    bio: 'Chuyên gia về chiến thuật thi đấu đôi, từng vô địch nhiều giải đấu cặp đôi khu vực.',
    specialties: ['Thi đấu đôi', 'Chiến thuật phối hợp', 'Communication on court'],
    teachingMethods: ['Pair practice', 'Match simulation', 'Tactical drills'],
    yearOfExperience: 6,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-07-12'),
    updatedAt: new Date('2024-01-25'),
    user: users[6], // Vũ Thị Lan (id: 7)
    credentials: getCredentialsByCoachId(6),
  },
  {
    id: 7,
    bio: 'Huấn luyện viên chuyên nghiệp với kinh nghiệm dạy các lứa tuổi từ trẻ em đến người lớn.',
    specialties: ['Kỹ thuật cơ bản', 'Huấn luyện trẻ em', 'Người cao tuổi', 'Giáo dục thể chất'],
    teachingMethods: ['Age-appropriate methods', 'Fun learning', 'Progressive training'],
    yearOfExperience: 8,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-05-18'),
    updatedAt: new Date('2024-01-26'),
    user: users[7], // Đỗ Văn Thành (id: 8)
    credentials: getCredentialsByCoachId(7),
  },
  {
    id: 8,
    bio: 'Nữ huấn luyện viên tài năng chuyên về kỹ thuật và tâm lý thi đấu.',
    specialties: ['Kỹ thuật cơ bản', 'Tâm lý thi đấu', 'Footwork', 'Reflexes training'],
    teachingMethods: ['Mental coaching', 'Technical precision', 'Stress management'],
    yearOfExperience: 5,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-10-22'),
    updatedAt: new Date('2024-01-26'),
    user: users[8], // Bùi Thị Nga (id: 9)
    credentials: getCredentialsByCoachId(8),
  },
  {
    id: 9,
    bio: 'Huấn luyện viên năng động chuyên về kỹ thuật tấn công và serve mạnh.',
    specialties: ['Kỹ thuật tấn công', 'Power serve', 'Smash techniques', 'Offensive play'],
    teachingMethods: ['Power training', 'Speed drills', 'Aggressive tactics'],
    yearOfExperience: 4,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-11-08'),
    updatedAt: new Date('2024-01-26'),
    user: users[9], // Ngô Văn Hải (id: 10)
    credentials: getCredentialsByCoachId(9),
  },
  {
    id: 10,
    bio: 'Chuyên gia về chiến thuật phòng thủ và counter-attack, giúp học viên xây dựng lối chơi vững chắc.',
    specialties: ['Chiến thuật phòng thủ', 'Counter-attack', 'Dink game', 'Patience play'],
    teachingMethods: ['Defensive positioning', 'Strategic patience', 'Smart shot selection'],
    yearOfExperience: 6,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-03-25'),
    updatedAt: new Date('2024-01-26'),
    user: users[10], // Đinh Thị Phương (id: 11)
    credentials: getCredentialsByCoachId(10),
  },
  {
    id: 11,
    bio: 'Huấn luyện viên trẻ với năng lượng tích cực, tập trung vào việc xây dựng nền tảng vững chắc.',
    specialties: ['Kỹ thuật cơ bản', 'Conditioning', 'Beginner-friendly'],
    teachingMethods: ['Step-by-step approach', 'Positive reinforcement', 'Foundation building'],
    yearOfExperience: 3,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-12-05'),
    updatedAt: new Date('2024-01-26'),
    user: users[11], // Lý Văn Tài (id: 12)
    credentials: getCredentialsByCoachId(11),
  },
  {
    id: 12,
    bio: 'Huấn luyện viên nữ giàu kinh nghiệm, chuyên về kỹ thuật tinh tế và chiến thuật thông minh.',
    specialties: ['Kỹ thuật tinh tế', 'Spin techniques', 'Placement', 'Smart play'],
    teachingMethods: ['Precision training', 'Strategic thinking', 'Finesse over power'],
    yearOfExperience: 7,
    verificationStatus: CoachVerificationStatus.VERIFIED,
    createdAt: new Date('2023-02-14'),
    updatedAt: new Date('2024-01-25'),
    user: users[12], // Cao Thị Tâm (id: 13)
    credentials: getCredentialsByCoachId(12),
  },

  // ========== PENDING COACHES (NEW APPLICANTS) ==========
  {
    id: 13,
    bio: 'Yêu thích pickleball và muốn chia sẻ kiến thức với cộng đồng. Có kinh nghiệm chơi 3 năm.',
    specialties: ['Kỹ thuật cơ bản', 'Người mới bắt đầu', 'Luyện tập vui vẻ'],
    teachingMethods: ['Friendly approach', 'Khuyến khích tích cực', 'Nhóm nhỏ'],
    yearOfExperience: 2,
    verificationStatus: CoachVerificationStatus.PENDING,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-26'),
    user: users[30], // Phan Văn Thắng (id: 31)
    credentials: getCredentialsByCoachId(13),
  },
  {
    id: 14,
    bio: 'Huấn luyện viên thể thao với nền tảng giáo dục thể chất. Mong muốn phát triển pickleball tại Việt Nam.',
    specialties: ['Kỹ thuật cơ bản', 'Thể lực', 'Khởi động đúng cách'],
    teachingMethods: ['Khoa học vận động', 'An toàn trong tập luyện', 'Progressive training'],
    yearOfExperience: 3,
    verificationStatus: CoachVerificationStatus.PENDING,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-26'),
    user: users[31], // Võ Thị Thu (id: 32)
    credentials: getCredentialsByCoachId(14),
  },
  {
    id: 15,
    bio: 'Có kinh nghiệm huấn luyện thể thao và sơ cứu y tế. Đam mê pickleball và muốn lan tỏa môn thể thao này.',
    specialties: ['Kỹ thuật cơ bản', 'An toàn thể thao', 'Sơ cứu cơ bản'],
    teachingMethods: ['Safety first', 'Kỹ thuật đúng chuẩn', 'Chăm sóc sức khỏe'],
    yearOfExperience: 4,
    verificationStatus: CoachVerificationStatus.PENDING,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
    user: users[32], // Trịnh Văn Vương (id: 33)
    credentials: getCredentialsByCoachId(15),
  },

  // ========== REJECTED COACHES ==========
  {
    id: 16,
    bio: 'Muốn trở thành huấn luyện viên pickleball. Có kinh nghiệm chơi nghiệp dư.',
    specialties: ['Kỹ thuật cơ bản'],
    teachingMethods: ['Luyện tập nhóm'],
    yearOfExperience: 1,
    verificationStatus: CoachVerificationStatus.REJECTED,
    rejectionReason: 'Chứng chỉ huấn luyện viên đã hết hạn (expired 01/2023). Vui lòng gia hạn hoặc cung cấp chứng chỉ mới hợp lệ.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    user: users[33], // Nguyễn Văn Tuấn (id: 34)
    credentials: getCredentialsByCoachId(16),
  },
  {
    id: 17,
    bio: 'Huấn luyện viên pickleball với chứng chỉ quốc tế. Nhiệt tình và năng động.',
    specialties: ['Kỹ thuật cơ bản', 'Chiến thuật nâng cao'],
    teachingMethods: ['Cá nhân hóa', 'Phương pháp hiện đại'],
    yearOfExperience: 2,
    verificationStatus: CoachVerificationStatus.REJECTED,
    rejectionReason: 'Chứng chỉ không được xác thực. Không tìm thấy thông tin trong hệ thống cơ sở dữ liệu chứng chỉ quốc tế. Nghi ngờ giả mạo.',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-23'),
    user: users[34], // Trần Thị Linh (id: 35)
    credentials: getCredentialsByCoachId(17),
  },
  {
    id: 18,
    bio: 'Mới bắt đầu hành trình trở thành huấn luyện viên. Yêu thích pickleball.',
    specialties: ['Người mới bắt đầu'],
    teachingMethods: ['Học từ cơ bản'],
    yearOfExperience: 0,
    verificationStatus: CoachVerificationStatus.REJECTED,
    rejectionReason: 'Thiếu thông tin xác thực trên chứng chỉ. Không có thông tin cơ quan cấp phép và số chứng chỉ. Vui lòng cung cấp chứng chỉ đầy đủ thông tin.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-24'),
    user: users[35], // Lê Văn Khoa (id: 36)
    credentials: getCredentialsByCoachId(18),
  },
];

// Helper functions
export const getCoachById = (id: number): CoachEntity | undefined => {
  return coachEntities.find((coach) => coach.id === id);
};

export const getCoachByUserId = (userId: number): CoachEntity | undefined => {
  return coachEntities.find((coach) => coach.user.id === userId);
};

export const getCoachesByVerificationStatus = (
  status: CoachVerificationStatus,
): CoachEntity[] => {
  return coachEntities.filter((coach) => coach.verificationStatus === status);
};

export const getVerifiedCoaches = (): CoachEntity[] => {
  return getCoachesByVerificationStatus(CoachVerificationStatus.VERIFIED);
};

export const getPendingCoaches = (): CoachEntity[] => {
  return getCoachesByVerificationStatus(CoachVerificationStatus.PENDING);
};

export const getActiveCoaches = (): CoachEntity[] => {
  return coachEntities.filter((coach) => coach.user.isActive);
};
