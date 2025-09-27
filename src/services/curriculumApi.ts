import {
  Chapter,
  Lesson,
  Quiz,
  CurriculumStats,
  GetChaptersParams,
  GetChaptersResponse,
  GetLessonsParams,
  GetLessonsResponse,
  CreateChapterRequest,
  UpdateChapterRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  UpdateLessonContentRequest,
  CreateQuizRequest,
  UpdateQuizRequest,
  DuplicateLessonRequest,
  ReorderRequest,
  ActivityLog,
  GetActivityLogsParams,
  GetActivityLogsResponse,
  CurriculumFilterOptions,
  ApiResponse,
} from '@/types/curriculum';
import curriculumData from '@/data/curriculum.json';

// Simulate API delay
const simulateDelay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const allChapters = curriculumData.chapters as Chapter[];
const allLessons = curriculumData.lessons as Lesson[];
const allActivityLogs = curriculumData.activityLogs as ActivityLog[];
const filterOptions = curriculumData.filterOptions as CurriculumFilterOptions;

// Generate unique ID
const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export class CurriculumApiService {
  /**
   * Get chapters with pagination and filters
   */
  static async getChapters(params: GetChaptersParams): Promise<GetChaptersResponse> {
    await simulateDelay();

    let filteredChapters = [...allChapters];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredChapters = filteredChapters.filter(
        (chapter) =>
          chapter.name.toLowerCase().includes(searchTerm) ||
          chapter.description.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredChapters = filteredChapters.filter((chapter) => chapter.status === params.status);
    }

    // Apply sorting
    const sortBy = params.sortBy || 'order';
    const sortOrder = params.sortOrder || 'asc';

    filteredChapters.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'lessonsCount':
          aValue = a.lessonsCount;
          bValue = b.lessonsCount;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'order':
        default:
          aValue = a.order;
          bValue = b.order;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const total = filteredChapters.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedChapters = filteredChapters.slice(startIndex, endIndex);

    // Calculate stats
    const stats = this.calculateStats();

    return {
      chapters: paginatedChapters,
      total,
      page: params.page,
      limit: params.limit,
      stats,
    };
  }

  /**
   * Get lessons with pagination and filters
   */
  static async getLessons(params: GetLessonsParams): Promise<GetLessonsResponse> {
    await simulateDelay();

    let filteredLessons = [...allLessons];

    // Apply chapter filter
    if (params.chapterId) {
      filteredLessons = filteredLessons.filter((lesson) => lesson.chapterId === params.chapterId);
    }

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredLessons = filteredLessons.filter(
        (lesson) =>
          lesson.name.toLowerCase().includes(searchTerm) ||
          lesson.shortDescription.toLowerCase().includes(searchTerm) ||
          lesson.chapterName.toLowerCase().includes(searchTerm),
      );
    }

    // Apply status filter
    if (params.status && params.status !== 'all') {
      filteredLessons = filteredLessons.filter((lesson) => lesson.status === params.status);
    }

    // Apply content filter
    if (params.hasContent && params.hasContent !== 'all') {
      switch (params.hasContent) {
        case 'text':
          filteredLessons = filteredLessons.filter((lesson) => lesson.hasText);
          break;
        case 'video':
          filteredLessons = filteredLessons.filter((lesson) => lesson.hasVideo);
          break;
        case 'quiz':
          filteredLessons = filteredLessons.filter((lesson) => lesson.hasQuiz);
          break;
      }
    }

    // Apply sorting
    const sortBy = params.sortBy || 'order';
    const sortOrder = params.sortOrder || 'asc';

    filteredLessons.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'order':
        default:
          // Sort by chapter order first, then lesson order
          if (a.chapterId !== b.chapterId) {
            const chapterA = allChapters.find((c) => c.id === a.chapterId);
            const chapterB = allChapters.find((c) => c.id === b.chapterId);
            aValue = chapterA?.order || 0;
            bValue = chapterB?.order || 0;
          } else {
            aValue = a.order;
            bValue = b.order;
          }
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const total = filteredLessons.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

    return {
      lessons: paginatedLessons,
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  /**
   * Get chapter by ID
   */
  static async getChapterById(id: string): Promise<Chapter | null> {
    await simulateDelay();
    return allChapters.find((chapter) => chapter.id === id) || null;
  }

  /**
   * Get lesson by ID
   */
  static async getLessonById(id: string): Promise<Lesson | null> {
    await simulateDelay();
    const lesson = allLessons.find((lesson) => lesson.id === id);
    if (!lesson) {
      console.log('Lesson not found:', id);
      console.log(
        'Available lessons:',
        allLessons.map((l) => l.id),
      );
      return null;
    }
    console.log(
      'Found lesson:',
      lesson.name,
      'hasText:',
      lesson.hasText,
      'hasVideo:',
      lesson.hasVideo,
    );
    return lesson;
  }

  /**
   * Create new chapter
   */
  static async createChapter(request: CreateChapterRequest): Promise<ApiResponse<Chapter>> {
    await simulateDelay();

    try {
      const newChapter: Chapter = {
        id: generateId('chapter'),
        name: request.name,
        description: request.description,
        order: request.order || allChapters.length + 1,
        status: request.status || 'active',
        lessonsCount: 0,
        totalDuration: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin-001',
        updatedBy: 'admin-001',
      };

      allChapters.push(newChapter);

      return {
        success: true,
        message: 'Đã tạo chương mới thành công',
        data: newChapter,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tạo chương mới',
      };
    }
  }

  /**
   * Update chapter
   */
  static async updateChapter(request: UpdateChapterRequest): Promise<ApiResponse<Chapter>> {
    await simulateDelay();

    try {
      const chapterIndex = allChapters.findIndex((c) => c.id === request.id);
      if (chapterIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy chương',
        };
      }

      const updatedChapter = {
        ...allChapters[chapterIndex],
        ...(request.name && { name: request.name }),
        ...(request.description && { description: request.description }),
        ...(request.order !== undefined && { order: request.order }),
        ...(request.status && { status: request.status }),
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin-001',
      };

      allChapters[chapterIndex] = updatedChapter;

      return {
        success: true,
        message: 'Đã cập nhật chương thành công',
        data: updatedChapter,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật chương',
      };
    }
  }

  /**
   * Delete chapter
   */
  static async deleteChapter(id: string): Promise<ApiResponse> {
    await simulateDelay();

    try {
      const chapterIndex = allChapters.findIndex((c) => c.id === id);
      if (chapterIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy chương',
        };
      }

      // Check if chapter has lessons
      const hasLessons = allLessons.some((lesson) => lesson.chapterId === id);
      if (hasLessons) {
        return {
          success: false,
          message: 'Không thể xóa chương đã có bài học. Vui lòng xóa tất cả bài học trước.',
        };
      }

      allChapters.splice(chapterIndex, 1);

      return {
        success: true,
        message: 'Đã xóa chương thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa chương',
      };
    }
  }

  /**
   * Create new lesson
   */
  static async createLesson(request: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    await simulateDelay();

    try {
      const chapter = allChapters.find((c) => c.id === request.chapterId);
      if (!chapter) {
        return {
          success: false,
          message: 'Không tìm thấy chương',
        };
      }

      const newLesson: Lesson = {
        id: generateId('lesson'),
        chapterId: request.chapterId,
        chapterName: chapter.name,
        name: request.name,
        shortDescription: request.shortDescription,
        order:
          request.order || allLessons.filter((l) => l.chapterId === request.chapterId).length + 1,
        status: request.status || 'active',
        duration: request.duration || 30,
        hasText: false,
        hasVideo: false,
        hasQuiz: false,
        quizzes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin-001',
        updatedBy: 'admin-001',
      };

      allLessons.push(newLesson);

      // Update chapter lessons count
      chapter.lessonsCount += 1;
      chapter.totalDuration += newLesson.duration;

      return {
        success: true,
        message: 'Đã tạo bài học mới thành công',
        data: newLesson,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tạo bài học mới',
      };
    }
  }

  /**
   * Update lesson
   */
  static async updateLesson(request: UpdateLessonRequest): Promise<ApiResponse<Lesson>> {
    await simulateDelay();

    try {
      const lessonIndex = allLessons.findIndex((l) => l.id === request.id);
      if (lessonIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy bài học',
        };
      }

      const oldLesson = allLessons[lessonIndex];
      const updatedLesson = {
        ...oldLesson,
        ...(request.name && { name: request.name }),
        ...(request.shortDescription && { shortDescription: request.shortDescription }),
        ...(request.order !== undefined && { order: request.order }),
        ...(request.status && { status: request.status }),
        ...(request.duration !== undefined && { duration: request.duration }),
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin-001',
      };

      // Update chapter name if chapter changed
      if (request.chapterId && request.chapterId !== oldLesson.chapterId) {
        const newChapter = allChapters.find((c) => c.id === request.chapterId);
        if (newChapter) {
          updatedLesson.chapterId = request.chapterId;
          updatedLesson.chapterName = newChapter.name;
        }
      }

      allLessons[lessonIndex] = updatedLesson;

      return {
        success: true,
        message: 'Đã cập nhật bài học thành công',
        data: updatedLesson,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật bài học',
      };
    }
  }

  /**
   * Delete lesson
   */
  static async deleteLesson(id: string): Promise<ApiResponse> {
    await simulateDelay();

    try {
      const lessonIndex = allLessons.findIndex((l) => l.id === id);
      if (lessonIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy bài học',
        };
      }

      const lesson = allLessons[lessonIndex];
      allLessons.splice(lessonIndex, 1);

      // Update chapter lessons count
      const chapter = allChapters.find((c) => c.id === lesson.chapterId);
      if (chapter) {
        chapter.lessonsCount -= 1;
        chapter.totalDuration -= lesson.duration;
      }

      return {
        success: true,
        message: 'Đã xóa bài học thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa bài học',
      };
    }
  }

  /**
   * Update lesson content
   */
  static async updateLessonContent(request: UpdateLessonContentRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      const lessonIndex = allLessons.findIndex((l) => l.id === request.lessonId);
      if (lessonIndex === -1) {
        return {
          success: false,
          message: 'Không tìm thấy bài học',
        };
      }

      const lesson = allLessons[lessonIndex];

      if (request.type === 'text') {
        lesson.textContent = request.content;
        lesson.hasText = true;
      } else if (request.type === 'video') {
        lesson.videoContent = request.content;
        lesson.hasVideo = true;
      }

      lesson.updatedAt = new Date().toISOString();
      lesson.updatedBy = 'admin-001';

      return {
        success: true,
        message: `Đã cập nhật nội dung ${request.type} thành công`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật nội dung bài học',
      };
    }
  }

  /**
   * Create quiz
   */
  static async createQuiz(request: CreateQuizRequest): Promise<ApiResponse<Quiz>> {
    await simulateDelay();

    try {
      const lesson = allLessons.find((l) => l.id === request.lessonId);
      if (!lesson) {
        return {
          success: false,
          message: 'Không tìm thấy bài học',
        };
      }

      const newQuiz: Quiz = {
        id: generateId('quiz'),
        lessonId: request.lessonId,
        question: request.question,
        type: request.type,
        options: request.options.map((option, index) => ({
          id: generateId('opt'),
          text: option.text,
          order: option.order || index + 1,
        })),
        correctAnswers: request.correctAnswers.map((index) => newQuiz.options[index].id),
        explanation: request.explanation,
        order: lesson.quizzes.length + 1,
        points: request.points || 10,
        timeLimit: request.timeLimit,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin-001',
        updatedBy: 'admin-001',
      };

      lesson.quizzes.push(newQuiz);
      lesson.hasQuiz = true;

      return {
        success: true,
        message: 'Đã tạo quiz mới thành công',
        data: newQuiz,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể tạo quiz mới',
      };
    }
  }

  /**
   * Update quiz
   */
  static async updateQuiz(request: UpdateQuizRequest): Promise<ApiResponse<Quiz>> {
    await simulateDelay();

    try {
      let foundQuiz: Quiz | null = null;
      let lesson: Lesson | null = null;

      // Find quiz in lessons
      for (const l of allLessons) {
        const quiz = l.quizzes.find((q) => q.id === request.id);
        if (quiz) {
          foundQuiz = quiz;
          lesson = l;
          break;
        }
      }

      if (!foundQuiz || !lesson) {
        return {
          success: false,
          message: 'Không tìm thấy quiz',
        };
      }

      // Update quiz properties
      if (request.question) foundQuiz.question = request.question;
      if (request.type) foundQuiz.type = request.type;
      if (request.options) {
        foundQuiz.options = request.options.map((option, index) => ({
          id: generateId('opt'),
          text: option.text,
          order: option.order || index + 1,
        }));
      }
      if (request.correctAnswers) {
        foundQuiz.correctAnswers = request.correctAnswers.map(
          (index) => foundQuiz!.options[index].id,
        );
      }
      if (request.explanation !== undefined) foundQuiz.explanation = request.explanation;
      if (request.points !== undefined) foundQuiz.points = request.points;
      if (request.timeLimit !== undefined) foundQuiz.timeLimit = request.timeLimit;
      if (request.status) foundQuiz.status = request.status;

      foundQuiz.updatedAt = new Date().toISOString();
      foundQuiz.updatedBy = 'admin-001';

      return {
        success: true,
        message: 'Đã cập nhật quiz thành công',
        data: foundQuiz,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể cập nhật quiz',
      };
    }
  }

  /**
   * Delete quiz
   */
  static async deleteQuiz(id: string): Promise<ApiResponse> {
    await simulateDelay();

    try {
      let foundIndex = -1;
      let lesson: Lesson | null = null;

      // Find quiz in lessons
      for (const l of allLessons) {
        const quizIndex = l.quizzes.findIndex((q) => q.id === id);
        if (quizIndex !== -1) {
          foundIndex = quizIndex;
          lesson = l;
          break;
        }
      }

      if (foundIndex === -1 || !lesson) {
        return {
          success: false,
          message: 'Không tìm thấy quiz',
        };
      }

      lesson.quizzes.splice(foundIndex, 1);

      // Update hasQuiz flag
      lesson.hasQuiz = lesson.quizzes.length > 0;

      return {
        success: true,
        message: 'Đã xóa quiz thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể xóa quiz',
      };
    }
  }

  /**
   * Duplicate lesson
   */
  static async duplicateLesson(request: DuplicateLessonRequest): Promise<ApiResponse<Lesson>> {
    await simulateDelay();

    try {
      const sourceLesson = allLessons.find((l) => l.id === request.lessonId);
      if (!sourceLesson) {
        return {
          success: false,
          message: 'Không tìm thấy bài học nguồn',
        };
      }

      const targetChapter = allChapters.find((c) => c.id === request.targetChapterId);
      if (!targetChapter) {
        return {
          success: false,
          message: 'Không tìm thấy chương đích',
        };
      }

      const duplicatedLesson: Lesson = {
        ...sourceLesson,
        id: generateId('lesson'),
        chapterId: request.targetChapterId,
        chapterName: targetChapter.name,
        name: request.newName || `${sourceLesson.name} (Copy)`,
        order: allLessons.filter((l) => l.chapterId === request.targetChapterId).length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin-001',
        updatedBy: 'admin-001',
      };

      // Handle content inclusion
      if (!request.includeContent?.text) {
        duplicatedLesson.textContent = undefined;
        duplicatedLesson.hasText = false;
      }
      if (!request.includeContent?.video) {
        duplicatedLesson.videoContent = undefined;
        duplicatedLesson.hasVideo = false;
      }
      if (!request.includeContent?.quiz) {
        duplicatedLesson.quizzes = [];
        duplicatedLesson.hasQuiz = false;
      } else {
        // Generate new IDs for quizzes and options
        duplicatedLesson.quizzes = duplicatedLesson.quizzes.map((quiz) => ({
          ...quiz,
          id: generateId('quiz'),
          lessonId: duplicatedLesson.id,
          options: quiz.options.map((option) => ({
            ...option,
            id: generateId('opt'),
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }

      allLessons.push(duplicatedLesson);

      // Update target chapter
      targetChapter.lessonsCount += 1;
      targetChapter.totalDuration += duplicatedLesson.duration;

      return {
        success: true,
        message: 'Đã sao chép bài học thành công',
        data: duplicatedLesson,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể sao chép bài học',
      };
    }
  }

  /**
   * Reorder items
   */
  static async reorderItems(request: ReorderRequest): Promise<ApiResponse> {
    await simulateDelay();

    try {
      if (request.type === 'chapter') {
        request.items.forEach((item) => {
          const chapter = allChapters.find((c) => c.id === item.id);
          if (chapter) {
            chapter.order = item.order;
            chapter.updatedAt = new Date().toISOString();
          }
        });
      } else if (request.type === 'lesson') {
        request.items.forEach((item) => {
          const lesson = allLessons.find((l) => l.id === item.id);
          if (lesson) {
            lesson.order = item.order;
            lesson.updatedAt = new Date().toISOString();
          }
        });
      }

      return {
        success: true,
        message: 'Đã sắp xếp lại thứ tự thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Không thể sắp xếp lại thứ tự',
      };
    }
  }

  /**
   * Get activity logs
   */
  static async getActivityLogs(params: GetActivityLogsParams): Promise<GetActivityLogsResponse> {
    await simulateDelay();

    let filteredLogs = [...allActivityLogs];

    // Apply filters
    if (params.entityType && params.entityType !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.entityType === params.entityType);
    }

    if (params.entityId) {
      filteredLogs = filteredLogs.filter((log) => log.entityId === params.entityId);
    }

    if (params.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === params.userId);
    }

    if (params.dateRange && params.dateRange.length === 2) {
      const [startDate, endDate] = params.dateRange;
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });
    }

    // Apply sorting
    const sortOrder = params.sortOrder || 'desc';
    filteredLogs.sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    });

    // Calculate pagination
    const total = filteredLogs.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return {
      logs: paginatedLogs,
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  /**
   * Get filter options
   */
  static async getFilterOptions(): Promise<CurriculumFilterOptions> {
    await simulateDelay(50);
    return filterOptions;
  }

  /**
   * Calculate curriculum statistics
   */
  private static calculateStats(): CurriculumStats {
    const totalChapters = allChapters.length;
    const totalLessons = allLessons.length;
    const totalQuizzes = allLessons.reduce((sum, lesson) => sum + lesson.quizzes.length, 0);

    const activeChapters = allChapters.filter((c) => c.status === 'active').length;
    const activeLessons = allLessons.filter((l) => l.status === 'active').length;
    const activeQuizzes = allLessons.reduce(
      (sum, lesson) => sum + lesson.quizzes.filter((q) => q.status === 'active').length,
      0,
    );

    const totalDuration = allLessons.reduce((sum, lesson) => sum + lesson.duration, 0);
    const avgLessonsPerChapter =
      totalChapters > 0 ? Math.round((totalLessons / totalChapters) * 10) / 10 : 0;
    const avgQuizzesPerLesson =
      totalLessons > 0 ? Math.round((totalQuizzes / totalLessons) * 10) / 10 : 0;

    return {
      totalChapters,
      totalLessons,
      totalQuizzes,
      activeChapters,
      activeLessons,
      activeQuizzes,
      totalDuration,
      avgLessonsPerChapter,
      avgQuizzesPerLesson,
    };
  }

  /**
   * Format duration
   */
  static formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}p` : `${hours} giờ`;
  }

  /**
   * Format date
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * Format datetime
   */
  static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
