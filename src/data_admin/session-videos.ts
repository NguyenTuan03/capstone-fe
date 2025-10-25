import { SessionVideo } from '@/types/session-video';
import { sessions } from './sessions';
import { videos } from './videos';

// Session Videos - Link videos to sessions
// Videos uploaded by coaches are used as materials in sessions
export const sessionVideos: SessionVideo[] = [
  // Course 1 - Session 1 (Completed)
  {
    id: 1,
    createdAt: new Date('2024-01-20'),
    session: sessions[0], // Session 1
    video: videos[0], // Video 1 - Kỹ Thuật Nắm Vợt
  },
  {
    id: 2,
    createdAt: new Date('2024-01-21'),
    session: sessions[0],
    video: videos[1], // Video 2 - Di Chuyển Cơ Bản
  },

  // Course 1 - Session 2 (Completed)
  {
    id: 3,
    createdAt: new Date('2024-01-28'),
    session: sessions[1], // Session 2
    video: videos[2], // Video 3 - Kỹ Thuật Serve
  },
  {
    id: 4,
    createdAt: new Date('2024-01-29'),
    session: sessions[1],
    video: videos[6], // Video 7 - Chiến Thuật Đánh Đôi
  },

  // Course 1 - Session 3 (In Progress)
  {
    id: 5,
    createdAt: new Date('2024-02-01'),
    session: sessions[2], // Session 3
    video: videos[3], // Video 4 - Forehand Drive
  },

  // Course 2 - Session 1 (Completed)
  {
    id: 6,
    createdAt: new Date('2024-01-12'),
    session: sessions[6], // Session 7
    video: videos[4], // Video 5 - Backhand Slice
  },
  {
    id: 7,
    createdAt: new Date('2024-01-13'),
    session: sessions[6],
    video: videos[9], // Video 10 - Phân Tích Đối Thủ
  },

  // Course 2 - Session 2 (Completed)
  {
    id: 8,
    createdAt: new Date('2024-01-16'),
    session: sessions[7], // Session 8
    video: videos[11], // Video 12 - Chiến Thuật Thi Đấu
  },

  // Course 2 - Session 3 (Completed)
  {
    id: 9,
    createdAt: new Date('2024-01-20'),
    session: sessions[8], // Session 9
    video: videos[14], // Video 15 - Kỹ Thuật Smash
  },

  // Course 2 - Session 4 (In Progress)
  {
    id: 10,
    createdAt: new Date('2024-01-24'),
    session: sessions[9], // Session 10
    video: videos[15], // Video 16 - Drop Shot
  },

  // Course 3 - Session 1
  {
    id: 11,
    createdAt: new Date('2024-02-01'),
    session: sessions[14], // Session 15
    video: videos[6], // Video 7 - Chiến Thuật Đánh Đôi
  },

  // Course 7 - Session 1
  {
    id: 12,
    createdAt: new Date('2024-01-25'),
    session: sessions[21], // Session 22
    video: videos[7], // Video 8 - Khởi Động
  },
  {
    id: 13,
    createdAt: new Date('2024-01-25'),
    session: sessions[21],
    video: videos[8], // Video 9 - Phòng Ngừa Chấn Thương
  },

  // Course 8 - Session 1 (Completed)
  {
    id: 14,
    createdAt: new Date('2024-01-18'),
    session: sessions[26], // Session 27
    video: videos[12], // Video 13 - Dinh Dưỡng Thể Thao
  },

  // Course 9 - Session 1
  {
    id: 15,
    createdAt: new Date('2024-02-01'),
    session: sessions[30], // Session 31
    video: videos[10], // Video 11 - Giao Tiếp Trong Thi Đấu
  },

  // Course 10 - Session 1 (Completed)
  {
    id: 16,
    createdAt: new Date('2024-01-20'),
    session: sessions[36], // Session 37
    video: videos[10], // Video 11 - Giao Tiếp Trong Thi Đấu
  },

  // Course 10 - Session 2 (Completed)
  {
    id: 17,
    createdAt: new Date('2024-01-28'),
    session: sessions[37], // Session 38
    video: videos[6], // Video 7 - Chiến Thuật Đánh Đôi
  },

  // Course 10 - Session 3 (In Progress)
  {
    id: 18,
    createdAt: new Date('2024-02-05'),
    session: sessions[38], // Session 39
    video: videos[17], // Video 18 - Kỹ Thuật Volley
  },

  // Course 11 - Session 1
  {
    id: 19,
    createdAt: new Date('2024-02-05'),
    session: sessions[43], // Session 44
    video: videos[0], // Video 1 - Kỹ Thuật Nắm Vợt
  },
  {
    id: 20,
    createdAt: new Date('2024-02-06'),
    session: sessions[43],
    video: videos[13], // Video 14 - Trò Chơi Vận Động
  },

  // Course 12 - Session 1 (Completed)
  {
    id: 21,
    createdAt: new Date('2024-01-20'),
    session: sessions[51], // Session 52
    video: videos[1], // Video 2 - Di Chuyển Cơ Bản
  },
  {
    id: 22,
    createdAt: new Date('2024-01-21'),
    session: sessions[51],
    video: videos[18], // Video 19 - Bài Tập Thể Lực
  },

  // Course 12 - Session 2 (Completed)
  {
    id: 23,
    createdAt: new Date('2024-01-28'),
    session: sessions[52], // Session 53
    video: videos[19], // Video 20 - An Toàn Khi Chơi
  },

  // Course 12 - Session 3 (In Progress)
  {
    id: 24,
    createdAt: new Date('2024-02-08'),
    session: sessions[53], // Session 54
    video: videos[2], // Video 3 - Kỹ Thuật Serve
  },

  // Course 13 - Session 1
  {
    id: 25,
    createdAt: new Date('2024-02-10'),
    session: sessions[57], // Session 58
    video: videos[20], // Video 21 - Tâm Lý Thi Đấu
  },

  // Course 16 - Session 1 (Completed)
  {
    id: 26,
    createdAt: new Date('2024-01-25'),
    session: sessions[63], // Session 64
    video: videos[16], // Video 17 - Dink Technique
  },

  // Course 16 - Session 2 (Completed)
  {
    id: 27,
    createdAt: new Date('2024-02-01'),
    session: sessions[64], // Session 65
    video: videos[21], // Video 22 - Kitchen Control
  },

  // Course 16 - Session 3 (In Progress)
  {
    id: 28,
    createdAt: new Date('2024-02-08'),
    session: sessions[65], // Session 66
    video: videos[22], // Video 23 - Soft Game
  },
];

// Helper functions
export const getSessionVideoById = (id: number): SessionVideo | undefined => {
  return sessionVideos.find((sv) => sv.id === id);
};

export const getSessionVideosBySessionId = (
  sessionId: number,
): SessionVideo[] => {
  return sessionVideos.filter((sv) => sv.session.id === sessionId);
};

export const getSessionVideosByVideoId = (videoId: number): SessionVideo[] => {
  return sessionVideos.filter((sv) => sv.video.id === videoId);
};

export const getSessionVideosByCourseId = (courseId: number): SessionVideo[] => {
  return sessionVideos.filter((sv) => sv.session.course.id === courseId);
};

