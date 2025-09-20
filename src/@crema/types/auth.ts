export interface UserType {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'learner' | 'coach';
  avatar?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerProfile extends UserType {
  role: 'learner';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences?: {
    learningGoals: string[];
    availableTimeSlots: string[];
    preferredCoachGender?: 'male' | 'female' | 'any';
  };
  progress?: {
    completedLessons: number;
    totalLessons: number;
    currentLevel: string;
    badges: string[];
    analyticsCount: number;
  };
}

export interface CoachProfile extends UserType {
  role: 'coach';
  isVerified: boolean;
  certifications: string[];
  specialties: string[];
  experience: number; // years
  rating: number;
  totalSessions: number;
  hourlyRate: number;
  availability: {
    [key: string]: string[]; // day: time slots
  };
  bio: string;
  teachingMethodology: string;
}
