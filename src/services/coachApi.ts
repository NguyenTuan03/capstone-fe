import { GetCoachesParams, GetCoachesResponse, CoachDetail, CoachApiResponse, CoachListStats } from '@/types/coach';
import coachesData from '@/data/coaches.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CoachApiService {
  private static coaches: CoachDetail[] = coachesData.coaches as CoachDetail[];
  private static stats: CoachListStats = coachesData.stats as CoachListStats;

  // Get all coaches with pagination and filters
  static async getCoaches(params: GetCoachesParams = {}): Promise<GetCoachesResponse> {
    await delay(800);

    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      specialty = 'all',
      rating = 'all'
    } = params;

    let filteredCoaches = [...this.coaches];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCoaches = filteredCoaches.filter(coach =>
        coach.name.toLowerCase().includes(searchLower) ||
        coach.email.toLowerCase().includes(searchLower) ||
        coach.profile?.specialties.some(s => s.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filteredCoaches = filteredCoaches.filter(coach => coach.status === status);
    }

    // Apply specialty filter
    if (specialty !== 'all') {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.profile?.specialties.includes(specialty)
      );
    }

    // Apply rating filter
    if (rating !== 'all') {
      const minRating = parseInt(rating);
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.profile?.rating && coach.profile.rating >= minRating
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCoaches = filteredCoaches.slice(startIndex, endIndex);

    return {
      coaches: paginatedCoaches,
      total: filteredCoaches.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCoaches.length / limit)
    };
  }

  // Get coach by ID
  static async getCoachById(id: string): Promise<CoachDetail | null> {
    await delay(500);
    
    const coach = this.coaches.find(c => c.id === id);
    return coach || null;
  }

  // Get all coaches data (for admin overview)
  static async getAllCoachesData(): Promise<CoachApiResponse> {
    await delay(600);
    
    return {
      coaches: this.coaches,
      stats: this.stats,
      filters: coachesData.filters as any
    };
  }

  // Approve coach application
  static async approveCoach(coachId: string, adminId: string): Promise<CoachDetail> {
    await delay(1000);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    const coach = this.coaches[coachIndex];
    if (coach.status !== 'pending') {
      throw new Error('Coach is not in pending status');
    }

    // Update coach status
    this.coaches[coachIndex] = {
      ...coach,
      status: 'approved',
      applicationStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: adminId,
      isVerified: true,
      // Move application data to profile
      profile: coach.application ? {
        bio: coach.application.requestedProfile.bio,
        experience: coach.application.requestedProfile.experience,
        hourlyRate: coach.application.requestedProfile.hourlyRate,
        rating: 0,
        totalSessions: 0,
        totalStudents: 0,
        totalEarnings: 0,
        specialties: coach.application.requestedProfile.specialties,
        certifications: [],
        teachingMethods: coach.application.requestedProfile.teachingMethods,
      } : undefined
    };

    // Update stats
    this.stats.approved += 1;
    this.stats.pending -= 1;

    return this.coaches[coachIndex];
  }

  // Reject coach application
  static async rejectCoach(coachId: string, reason: string, adminId: string): Promise<CoachDetail> {
    await delay(800);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    this.coaches[coachIndex] = {
      ...this.coaches[coachIndex],
      status: 'rejected',
      applicationStatus: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: adminId,
      rejectReason: reason
    };

    // Update stats
    this.stats.rejected += 1;
    this.stats.pending -= 1;

    return this.coaches[coachIndex];
  }

  // Suspend coach
  static async suspendCoach(coachId: string, reason: string, adminId: string): Promise<CoachDetail> {
    await delay(800);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    this.coaches[coachIndex] = {
      ...this.coaches[coachIndex],
      status: 'suspended',
      suspendedAt: new Date().toISOString(),
      suspendedBy: adminId,
      suspendReason: reason
    };

    // Update stats
    this.stats.suspended += 1;
    this.stats.approved -= 1;

    return this.coaches[coachIndex];
  }

  // Unsuspend coach (reactivate)
  static async unsuspendCoach(coachId: string): Promise<CoachDetail> {
    await delay(600);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    this.coaches[coachIndex] = {
      ...this.coaches[coachIndex],
      status: 'approved',
      suspendedAt: undefined,
      suspendedBy: undefined,
      suspendReason: undefined
    };

    // Update stats
    this.stats.approved += 1;
    this.stats.suspended -= 1;

    return this.coaches[coachIndex];
  }

  // Delete coach (soft delete)
  static async deleteCoach(coachId: string): Promise<void> {
    await delay(600);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    const coach = this.coaches[coachIndex];
    
    // Remove from list (soft delete)
    this.coaches.splice(coachIndex, 1);
    
    // Update stats
    this.stats.total -= 1;
    if (coach.status === 'approved') this.stats.approved -= 1;
    else if (coach.status === 'pending') this.stats.pending -= 1;
    else if (coach.status === 'suspended') this.stats.suspended -= 1;
    else if (coach.status === 'rejected') this.stats.rejected -= 1;
  }

  // Update coach profile
  static async updateCoach(coachId: string, updateData: Partial<CoachDetail>): Promise<CoachDetail> {
    await delay(900);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    this.coaches[coachIndex] = {
      ...this.coaches[coachIndex],
      ...updateData,
      id: coachId // Ensure ID doesn't change
    };

    return this.coaches[coachIndex];
  }

  // Get coach feedbacks
  static async getCoachFeedbacks(coachId: string, page: number = 1, limit: number = 10) {
    await delay(500);
    
    const coach = this.coaches.find(c => c.id === coachId);
    if (!coach || !coach.recentFeedbacks) {
      return {
        feedbacks: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedbacks = coach.recentFeedbacks.slice(startIndex, endIndex);

    return {
      feedbacks: paginatedFeedbacks,
      total: coach.recentFeedbacks.length,
      page,
      limit,
      totalPages: Math.ceil(coach.recentFeedbacks.length / limit)
    };
  }

  // Get coach statistics
  static async getCoachStats(): Promise<CoachListStats> {
    await delay(400);
    
    // Recalculate stats from current coaches
    const stats: CoachListStats = {
      total: this.coaches.length,
      approved: this.coaches.filter(c => c.status === 'approved').length,
      pending: this.coaches.filter(c => c.status === 'pending').length,
      suspended: this.coaches.filter(c => c.status === 'suspended').length,
      rejected: this.coaches.filter(c => c.status === 'rejected').length,
      averageRating: this.calculateAverageRating(),
      totalSessions: this.coaches.reduce((sum, c) => sum + (c.profile?.totalSessions || 0), 0),
      totalEarnings: this.coaches.reduce((sum, c) => sum + (c.profile?.totalEarnings || 0), 0)
    };
    
    return stats;
  }

  // Calculate average rating
  private static calculateAverageRating(): number {
    const approvedCoaches = this.coaches.filter(c => c.status === 'approved' && c.profile?.rating);
    if (approvedCoaches.length === 0) return 0;
    
    const totalRating = approvedCoaches.reduce((sum, c) => sum + (c.profile?.rating || 0), 0);
    return parseFloat((totalRating / approvedCoaches.length).toFixed(1));
  }

  // Get pending applications
  static async getPendingApplications(): Promise<CoachDetail[]> {
    await delay(400);
    return this.coaches.filter(c => c.status === 'pending');
  }

  // Verify coach certification
  static async verifyCertification(coachId: string, certificationIndex: number): Promise<CoachDetail> {
    await delay(600);
    
    const coachIndex = this.coaches.findIndex(c => c.id === coachId);
    if (coachIndex === -1) {
      throw new Error('Coach not found');
    }

    const coach = this.coaches[coachIndex];
    if (!coach.profile?.certifications || !coach.profile.certifications[certificationIndex]) {
      throw new Error('Certification not found');
    }

    coach.profile.certifications[certificationIndex].verified = true;
    
    return this.coaches[coachIndex];
  }
}
