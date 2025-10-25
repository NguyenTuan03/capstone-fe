import { Video } from '@/types/video';
import { CoachVideoStatus } from '@/types/enums';
import { users } from './users';

// 25 videos uploaded by coaches (user id 2-13)
export const videos: Video[] = [
  // Coach 1 (Nguyễn Văn Minh - user 2) - 3 videos
  {
    id: 1,
    title: 'Kỹ Thuật Cầm Vợt Cơ Bản',
    description:
      'Hướng dẫn chi tiết cách cầm vợt đúng tư thế, giúp người mới bắt đầu có nền tảng vững chắc.',
    tags: ['Kỹ thuật cơ bản', 'Người mới', 'Cầm vợt'],
    duration: 480, // 8 minutes
    drillName: 'Grip Practice Drill',
    drillDescription:
      'Luyện tập cầm vợt với các bài tập từ cơ bản đến nâng cao.',
    drillPracticeSets: '3 sets x 10 reps mỗi loại grip',
    publicUrl: 'https://example.com/videos/video-001.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-001.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[1],
  },
  {
    id: 2,
    title: 'Di Chuyển Trên Sân',
    description: 'Kỹ thuật di chuyển hiệu quả trên sân pickleball.',
    tags: ['Footwork', 'Di chuyển', 'Kỹ thuật'],
    duration: 540, // 9 minutes
    drillName: 'Footwork Drill',
    drillDescription: 'Luyện tập các bước di chuyển cơ bản và nâng cao.',
    drillPracticeSets: '5 sets x 2 phút mỗi set',
    publicUrl: 'https://example.com/videos/video-002.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-002.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[1],
  },
  {
    id: 3,
    title: 'Kỹ Thuật Serve Cơ Bản',
    description: 'Hướng dẫn kỹ thuật serve từ cơ bản đến nâng cao.',
    tags: ['Serve', 'Kỹ thuật cơ bản'],
    duration: 600, // 10 minutes
    drillName: 'Serve Practice',
    drillDescription: 'Luyện serve với các mục tiêu khác nhau.',
    drillPracticeSets: '4 sets x 15 serves',
    publicUrl: 'https://example.com/videos/video-003.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-003.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[1],
  },

  // Coach 2 (Trần Thị Hương - user 3) - 2 videos
  {
    id: 4,
    title: 'Chiến Thuật Đôi - Phối Hợp Cơ Bản',
    description: 'Cách phối hợp hiệu quả với đồng đội trong thi đấu đôi.',
    tags: ['Chiến thuật', 'Đôi', 'Phối hợp'],
    duration: 720, // 12 minutes
    drillName: 'Doubles Coordination',
    drillDescription: 'Bài tập phối hợp với đồng đội.',
    drillPracticeSets: '3 sets x 15 phút practice',
    publicUrl: 'https://example.com/videos/video-004.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-004.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[2],
  },
  {
    id: 5,
    title: 'Giao Tiếp Trong Thi Đấu',
    description: 'Kỹ năng giao tiếp quan trọng khi chơi đôi.',
    tags: ['Giao tiếp', 'Đôi', 'Team work'],
    duration: 420, // 7 minutes
    drillName: 'Communication Practice',
    drillDescription: 'Luyện tập giao tiếp trong game.',
    drillPracticeSets: '3 games với focus vào communication',
    publicUrl: 'https://example.com/videos/video-005.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-005.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[2],
  },

  // Coach 3 (Lê Văn Cường - user 4) - 2 videos
  {
    id: 6,
    title: 'Kỹ Thuật Smash Chuyên Nghiệp',
    description: 'Kỹ thuật smash mạnh mẽ và chính xác.',
    tags: ['Smash', 'Kỹ thuật nâng cao', 'Chuyên nghiệp'],
    duration: 660, // 11 minutes
    drillName: 'Power Smash Drill',
    drillDescription: 'Luyện smash với power và accuracy.',
    drillPracticeSets: '5 sets x 20 smashes',
    publicUrl: 'https://example.com/videos/video-006.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-006.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[3],
  },
  {
    id: 7,
    title: 'Phân Tích Chiến Thuật Đối Thủ',
    description: 'Cách đọc và phản ứng với chiến thuật đối thủ.',
    tags: ['Chiến thuật', 'Phân tích', 'Thi đấu'],
    duration: 900, // 15 minutes
    drillName: 'Tactical Analysis',
    drillDescription: 'Phân tích video trận đấu và rút ra bài học.',
    publicUrl: 'https://example.com/videos/video-007.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-007.jpg',
    status: CoachVideoStatus.ARCHIVED,
    uploadedBy: users[3],
  },

  // Coach 5 (Hoàng Văn Đức - user 6) - 3 videos
  {
    id: 8,
    title: 'Khởi Động Đúng Cách',
    description: 'Bài tập khởi động an toàn trước khi chơi.',
    tags: ['Khởi động', 'An toàn', 'Sức khỏe'],
    duration: 600, // 10 minutes
    drillName: 'Warm-up Routine',
    drillDescription: 'Quy trình khởi động 10 phút chuẩn.',
    drillPracticeSets: 'Daily routine',
    publicUrl: 'https://example.com/videos/video-008.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-008.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[5],
  },
  {
    id: 9,
    title: 'Phòng Ngừa Chấn Thương Vai',
    description: 'Kỹ thuật và bài tập bảo vệ vai khi chơi.',
    tags: ['Chấn thương', 'Phòng ngừa', 'Vai'],
    duration: 540, // 9 minutes
    drillName: 'Shoulder Protection',
    drillDescription: 'Bài tập strengthen và protect vai.',
    drillPracticeSets: '3 sets x 12 reps các bài tập',
    publicUrl: 'https://example.com/videos/video-009.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-009.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[5],
  },
  {
    id: 10,
    title: 'Dinh Dưỡng Cho Vận Động Viên',
    description: 'Chế độ ăn uống phù hợp cho người chơi pickleball.',
    tags: ['Dinh dưỡng', 'Sức khỏe'],
    duration: 720, // 12 minutes
    drillName: 'N/A',
    drillDescription: 'Kiến thức dinh dưỡng thể thao.',
    publicUrl: 'https://example.com/videos/video-010.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-010.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[5],
  },

  // Coach 6 (Vũ Thị Lan - user 7) - 2 videos
  {
    id: 11,
    title: 'Positioning Trong Đôi',
    description: 'Vị trí đứng tối ưu trong thi đấu đôi.',
    tags: ['Positioning', 'Đôi', 'Chiến thuật'],
    duration: 660, // 11 minutes
    drillName: 'Position Drill',
    drillDescription: 'Luyện tập positioning với partner.',
    drillPracticeSets: '4 sets x 10 phút',
    publicUrl: 'https://example.com/videos/video-011.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-011.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[6],
  },
  {
    id: 12,
    title: 'Counter-Attack Tactics',
    description: 'Chiến thuật phản công hiệu quả.',
    tags: ['Counter-attack', 'Chiến thuật', 'Tấn công'],
    duration: 780, // 13 minutes
    drillName: 'Counter Drill',
    drillDescription: 'Luyện phản công từ thế phòng thủ.',
    drillPracticeSets: '5 sets x 10 rallies',
    publicUrl: 'https://example.com/videos/video-012.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-012.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[6],
  },

  // Coach 7 (Đỗ Văn Thành - user 8) - 2 videos
  {
    id: 13,
    title: 'Pickleball Cho Trẻ Em - Bài 1',
    description: 'Bài học đầu tiên dành cho trẻ em 8-12 tuổi.',
    tags: ['Trẻ em', 'Người mới', 'Cơ bản'],
    duration: 480, // 8 minutes
    drillName: 'Kids Fun Drill',
    drillDescription: 'Bài tập vui nhộn cho trẻ em.',
    drillPracticeSets: '3 games x 5 phút',
    publicUrl: 'https://example.com/videos/video-013.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-013.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[7],
  },
  {
    id: 14,
    title: 'An Toàn Cho Trẻ Em',
    description: 'Hướng dẫn an toàn khi chơi cho trẻ.',
    tags: ['An toàn', 'Trẻ em'],
    duration: 360, // 6 minutes
    drillName: 'Safety First',
    drillDescription: 'Các quy tắc an toàn cơ bản.',
    publicUrl: 'https://example.com/videos/video-014.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-014.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[7],
  },

  // Coach 8 (Bùi Thị Nga - user 9) - 2 videos
  {
    id: 15,
    title: 'Kiểm Soát Cảm Xúc',
    description: 'Kỹ năng kiểm soát cảm xúc trong thi đấu.',
    tags: ['Tâm lý', 'Cảm xúc', 'Thi đấu'],
    duration: 600, // 10 minutes
    drillName: 'Mental Game',
    drillDescription: 'Luyện tập mindfulness và focus.',
    drillPracticeSets: 'Daily practice 10 phút',
    publicUrl: 'https://example.com/videos/video-015.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-015.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[8],
  },
  {
    id: 16,
    title: 'Footwork Nâng Cao',
    description: 'Kỹ thuật di chuyển nhanh và chính xác.',
    tags: ['Footwork', 'Nâng cao', 'Tốc độ'],
    duration: 720, // 12 minutes
    drillName: 'Advanced Footwork',
    drillDescription: 'Bài tập footwork phức tạp.',
    drillPracticeSets: '5 sets x 3 phút',
    publicUrl: 'https://example.com/videos/video-016.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-016.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[8],
  },

  // Coach 9 (Ngô Văn Hải - user 10) - 2 videos
  {
    id: 17,
    title: 'Power Serve Training',
    description: 'Luyện tập serve mạnh mẽ và chính xác.',
    tags: ['Serve', 'Power', 'Tấn công'],
    duration: 660, // 11 minutes
    drillName: 'Power Serve Drill',
    drillDescription: 'Phát triển sức mạnh serve.',
    drillPracticeSets: '6 sets x 15 serves',
    publicUrl: 'https://example.com/videos/video-017.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-017.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[9],
  },
  {
    id: 18,
    title: 'Aggressive Play Style',
    description: 'Lối chơi tấn công chủ động và mạnh mẽ.',
    tags: ['Tấn công', 'Aggressive', 'Chiến thuật'],
    duration: 780, // 13 minutes
    drillName: 'Attack Drill',
    drillDescription: 'Luyện lối chơi tấn công.',
    drillPracticeSets: '4 games aggressive play',
    publicUrl: 'https://example.com/videos/video-018.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-018.jpg',
    status: CoachVideoStatus.PENDING_APPROVAL,
    uploadedBy: users[9],
  },

  // Coach 10 (Đinh Thị Phương - user 11) - 3 videos
  {
    id: 19,
    title: 'Kỹ Thuật Dink',
    description: 'Hướng dẫn chi tiết kỹ thuật dink.',
    tags: ['Dink', 'Kỹ thuật', 'Phòng thủ'],
    duration: 720, // 12 minutes
    drillName: 'Dink Practice',
    drillDescription: 'Luyện dink với control và placement.',
    drillPracticeSets: '5 sets x 10 phút',
    publicUrl: 'https://example.com/videos/video-019.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-019.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[10],
  },
  {
    id: 20,
    title: 'Chiến Thuật Phòng Thủ',
    description: 'Xây dựng lối chơi phòng thủ vững chắc.',
    tags: ['Phòng thủ', 'Chiến thuật', 'Kiên nhẫn'],
    duration: 840, // 14 minutes
    drillName: 'Defense Drill',
    drillDescription: 'Luyện khả năng phòng thủ.',
    drillPracticeSets: '4 sets x 15 phút',
    publicUrl: 'https://example.com/videos/video-020.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-020.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[10],
  },
  {
    id: 21,
    title: 'Placement Over Power',
    description: 'Đặt bóng chính xác quan trọng hơn sức mạnh.',
    tags: ['Placement', 'Kỹ thuật', 'Chiến thuật'],
    duration: 660, // 11 minutes
    drillName: 'Placement Drill',
    drillDescription: 'Luyện đặt bóng vào vị trí mong muốn.',
    drillPracticeSets: '5 sets x 20 shots',
    publicUrl: 'https://example.com/videos/video-021.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-021.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[10],
  },

  // Coach 11 (Lý Văn Tài - user 12) - 2 videos
  {
    id: 22,
    title: 'Nền Tảng Cho Người Mới',
    description: 'Xây dựng nền tảng vững chắc từ đầu.',
    tags: ['Người mới', 'Cơ bản', 'Nền tảng'],
    duration: 900, // 15 minutes
    drillName: 'Foundation Building',
    drillDescription: 'Các bài tập xây dựng nền tảng.',
    drillPracticeSets: '3 sets full routine',
    publicUrl: 'https://example.com/videos/video-022.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-022.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[11],
  },
  {
    id: 23,
    title: 'Conditioning Exercises',
    description: 'Bài tập thể lực cho pickleball.',
    tags: ['Thể lực', 'Conditioning', 'Fitness'],
    duration: 720, // 12 minutes
    drillName: 'Conditioning Routine',
    drillDescription: 'Bài tập cardio và strength.',
    drillPracticeSets: '3 circuits x 10 phút',
    publicUrl: 'https://example.com/videos/video-023.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-023.jpg',
    status: CoachVideoStatus.PENDING_APPROVAL,
    uploadedBy: users[11],
  },

  // Coach 12 (Cao Thị Tâm - user 13) - 2 videos
  {
    id: 24,
    title: 'Spin Techniques',
    description: 'Kỹ thuật tạo spin hiệu quả.',
    tags: ['Spin', 'Kỹ thuật nâng cao', 'Control'],
    duration: 780, // 13 minutes
    drillName: 'Spin Practice',
    drillDescription: 'Luyện các loại spin khác nhau.',
    drillPracticeSets: '5 sets x 15 shots mỗi loại spin',
    publicUrl: 'https://example.com/videos/video-024.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-024.jpg',
    status: CoachVideoStatus.APPROVED,
    uploadedBy: users[12],
  },
  {
    id: 25,
    title: 'Precision Shot Placement',
    description: 'Đặt bóng chính xác tuyệt đối.',
    tags: ['Precision', 'Placement', 'Finesse'],
    duration: 720, // 12 minutes
    drillName: 'Precision Drill',
    drillDescription: 'Target practice với precision cao.',
    drillPracticeSets: '6 sets x 10 shots',
    publicUrl: 'https://example.com/videos/video-025.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/thumb-025.jpg',
    status: CoachVideoStatus.PENDING_APPROVAL,
    uploadedBy: users[12],
  },
];

// Helper functions
export const getVideoById = (id: number): Video | undefined => {
  return videos.find((video) => video.id === id);
};

export const getVideosByCoachUserId = (userId: number): Video[] => {
  return videos.filter((video) => video.uploadedBy.id === userId);
};

export const getVideosByStatus = (status: CoachVideoStatus): Video[] => {
  return videos.filter((video) => video.status === status);
};

export const getApprovedVideos = (): Video[] => {
  return getVideosByStatus(CoachVideoStatus.APPROVED);
};

export const getPendingVideos = (): Video[] => {
  return getVideosByStatus(CoachVideoStatus.PENDING_APPROVAL);
};

export const getVideosByTags = (tags: string[]): Video[] => {
  return videos.filter((video) =>
    video.tags?.some((tag) => tags.includes(tag)),
  );
};

