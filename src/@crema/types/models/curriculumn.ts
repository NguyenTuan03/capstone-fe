export interface RequestItem {
  id: number;
  description: string;
  type: string;
  status: string;
  metadata: {
    id: number;
    type: string;
    details: {
      address: string;
      district: number;
      province: number;
      schedules: Array<{
        endTime: string;
        dayOfWeek: string;
        startTime: string;
      }>;
      startDate: string;
      learningFormat: string;
      maxParticipants: number;
      minParticipants: number;
      pricePerParticipant: number;
    };
  };
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    profilePicture: string | null;
  };
}

export interface RequestsResponse {
  items: RequestItem[];
  page: number;
  pageSize: number;
  total: number;
}

// Detailed request response type
export interface DetailedRequestItem {
  id: number;
  description: string;
  type: string;
  status: string;
  metadata: {
    id: number;
    type: string;
    details: {
      id: number;
      name: string;
      level: string;
      status: string;
      address: string;
      endDate: string | null;
      description: string;
      district: {
        id: number;
        name: string;
      };
      province: {
        id: number;
        name: string;
      };
      subject: {
        id: number;
        name: string;
        level: string;
        status: string;
        description: string;
        createdAt: string;
        updatedAt: string;
        createdBy: {
          id: number;
          fullName: string;
          email: string;
          role: {
            id: number;
            name: string;
          };
        };
      };
      schedules: Array<{
        id: number;
        endTime: string;
        dayOfWeek: string;
        startTime: string;
      }>;
      startDate: string;
      learningFormat: string;
      maxParticipants: number;
      minParticipants: number;
      currentParticipants: number;
      pricePerParticipant: string;
      totalEarnings: string;
      totalSessions: number;
      createdAt: string;
      updatedAt: string;
      createdBy: {
        id: number;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
  actions: any[];
  createdBy: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    profilePicture: string | null;
    role: {
      id: number;
      name: string;
    };
  };
}
