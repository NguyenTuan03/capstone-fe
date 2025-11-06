# Mock Data Documentation

Đây là tài liệu tổng quan về toàn bộ mock data cho Pickleball Learning Platform.
q

## 📊 Tổng quan dữ liệu

### 👥 Core Entities (Entities cơ bản)

- **Users**: 30 users (1 admin, 12 coaches, 17 learners)
- **Roles**: 3 roles (Admin, Coach, Learner)
- **Coaches**: 12 coaches với thông tin chi tiết
- **Learners**: 17 learners ở các level khác nhau
- **Credentials**: 18 credentials (chứng chỉ của coaches)

### 📚 Course Management (Quản lý khóa học)

- **Courses**: 20 courses (các level: Beginner, Intermediate, Advanced)
- **Schedules**: 48 schedules (lịch học cho các courses)
- **Sessions**: 20+ sessions (buổi học)
- **Enrollments**: 44 enrollments (học viên đăng ký)
- **Feedbacks**: 30+ feedbacks từ học viên

### 🎥 Content Management (Quản lý nội dung)

- **Videos**: 30 videos giảng dạy
- **Session Videos**: 25 liên kết video-session
- **Quizzes**: 10 quizzes (5 Beginner, 3 Intermediate, 2 Advanced)
- **Questions**: 49 questions với nội dung thực tế
- **Question Options**: 196 options (4 đáp án/câu hỏi)
- **Session Quizzes**: 20 liên kết quiz-session
- **Quiz Attempts**: 25 lần làm quiz
- **Learner Answers**: 33+ câu trả lời chi tiết

### 💰 Financial Management (Quản lý tài chính)

- **Session Earnings**: 18 earnings records
- **Wallets**: 12 wallets cho coaches
- **Wallet Transactions**: 40+ transactions
- **Withdrawal Requests**: 10 requests
- **Payments**: 44 payments

### 🏆 Gamification (Game hóa)

- **Achievements**: 15 achievements (Event Count, Property Check, Streak)
- **Achievement Progresses**: 37 progress records
- **Learner Achievements**: 28 earned achievements

## 📝 Chi tiết từng module

### 1. Users & Authentication

```typescript
// Import
import { users, getUserById, getUsersByRole } from '@/data/users';

// Usage
const admin = users[0]; // Admin user
const coaches = getUsersByRole('COACH'); // All coaches
const learners = getUsersByRole('LEARNER'); // All learners
```

### 2. Courses & Sessions

```typescript
import { courses, getCoursesByLevel } from '@/data/courses';
import { sessions, getSessionsByCourse } from '@/data/sessions';

// Get beginner courses
const beginnerCourses = getCoursesByLevel('BEGINNER');

// Get sessions for a course
const courseSessions = getSessionsByCourse(1);
```

### 3. Quizzes & Learning

```typescript
import { quizzes, getQuizzesByLevel } from '@/data/quizzes';
import { quizAttempts, getQuizAttemptsByUser } from '@/data/quiz-attempts';

// Get intermediate quizzes
const intermediateQuizzes = getQuizzesByLevel('INTERMEDIATE');

// Get user's quiz attempts
const userAttempts = getQuizAttemptsByUser(14);
```

### 4. Achievements

```typescript
import { achievements, getActiveAchievements } from '@/data/achievements';
import { learnerAchievements, getLearnerAchievementsByUserId } from '@/data/learner-achievements';

// Get active achievements
const active = getActiveAchievements();

// Get user's earned achievements
const userAchievements = getLearnerAchievementsByUserId(22);
```

### 5. Financial

```typescript
import { wallets, getWalletByUserId } from '@/data/wallets';
import { payments, getPaymentsByEnrollment } from '@/data/payments';

// Get coach wallet
const coachWallet = getWalletByUserId(2);

// Get enrollment payments
const enrollmentPayments = getPaymentsByEnrollment(1);
```

## 🔗 Relationships (Mối quan hệ)

### User Relationships

- User → Role (many-to-one)
- User → Coach (one-to-one for coaches)
- User → Learner (one-to-one for learners)
- User → Wallet (one-to-one for coaches)
- User → Courses (one-to-many - created courses)
- User → Achievements (one-to-many - created achievements)

### Course Relationships

- Course → Coach (many-to-one via User)
- Course → Sessions (one-to-many)
- Course → Schedules (one-to-many)
- Course → Enrollments (one-to-many)
- Course → Feedbacks (one-to-many)

### Session Relationships

- Session → Course (many-to-one)
- Session → SessionVideos (one-to-many)
- Session → SessionQuizzes (one-to-many)
- Session → QuizAttempts (one-to-many)
- Session → SessionEarnings (one-to-many)
- Session → WalletTransactions (one-to-many)

### Quiz Relationships

- Quiz → Questions (one-to-many)
- Question → QuestionOptions (one-to-many)
- Quiz → SessionQuizzes (one-to-many)
- Quiz → QuizAttempts (through Session)
- QuizAttempt → LearnerAnswers (one-to-many)

### Achievement Relationships

- Achievement → AchievementProgress (one-to-many)
- Achievement → LearnerAchievement (one-to-many)
- User → AchievementProgress (one-to-many)
- User → LearnerAchievement (one-to-many)

## 📊 Statistics

### User Distribution

- Admin: 1
- Coaches: 12 (các level và chuyên môn khác nhau)
- Learners: 17 (Beginner: 8, Intermediate: 6, Advanced: 3)

### Course Distribution by Level

- Beginner: 8 courses
- Intermediate: 7 courses
- Advanced: 5 courses

### Course Distribution by Format

- Individual: 12 courses
- Group: 8 courses

### Quiz Distribution

- Beginner: 4 quizzes (40%)
- Intermediate: 3 quizzes (30%)
- Advanced: 3 quizzes (30%)

### Achievement Distribution

- Event Count: 5 achievements
- Property Check: 5 achievements
- Streak: 5 achievements

### Financial Summary

- Total Session Earnings: ~18 records
- Total Wallet Balance: Sum of all coach wallets
- Total Payments: 44 payments
- Commission Rate: 20% platform fee

## 🎯 Key Features

### 1. Realistic Data

- Tên người Việt thực tế
- Nội dung quiz về Pickleball thực tế
- Mối quan hệ logic giữa các entities
- Timeline hợp lý

### 2. Complete Relationships

- Tất cả foreign keys đều được liên kết đúng
- Circular references được xử lý cẩn thận
- Data consistency được đảm bảo

### 3. Rich Content

- 49 câu hỏi quiz với explanations
- 196 đáp án chi tiết
- 15 achievements đa dạng
- 30 videos giảng dạy

### 4. Helper Functions

Mỗi file data đều có helper functions để query dễ dàng:

- `getById()`
- `getByUserId()`
- `getByCourseId()`
- `getByLevel()`
- `getActive()`
- Statistics functions

## 🚀 Usage Examples

### Example 1: Get Coach Dashboard Data

```typescript
import { getUserById } from '@/data/users';
import { getCoursesByCoach } from '@/data/courses';
import { getWalletByUserId } from '@/data/wallets';

const coachId = 2;
const coach = getUserById(coachId);
const courses = getCoursesByCoach(coachId);
const wallet = getWalletByUserId(coachId);

console.log(`Coach: ${coach?.fullName}`);
console.log(`Courses: ${courses.length}`);
console.log(`Balance: ${wallet?.currentBalance}`);
```

### Example 2: Get Learner Progress

```typescript
import { getUserById } from '@/data/users';
import { getEnrollmentsByLearner } from '@/data/enrollments';
import { getQuizAttemptsByUser } from '@/data/quiz-attempts';
import { getLearnerAchievementsByUserId } from '@/data/learner-achievements';

const learnerId = 14;
const learner = getUserById(learnerId);
const enrollments = getEnrollmentsByLearner(learnerId);
const quizAttempts = getQuizAttemptsByUser(learnerId);
const achievements = getLearnerAchievementsByUserId(learnerId);

console.log(`Learner: ${learner?.fullName}`);
console.log(`Enrolled Courses: ${enrollments.length}`);
console.log(`Quiz Attempts: ${quizAttempts.length}`);
console.log(`Achievements: ${achievements.length}`);
```

### Example 3: Course Statistics

```typescript
import { getCourseById } from '@/data/courses';
import { getSessionsByCourse } from '@/data/sessions';
import { getEnrollmentsByCourse } from '@/data/enrollments';
import { getFeedbacksByCourse } from '@/data/feedbacks';

const courseId = 1;
const course = getCourseById(courseId);
const sessions = getSessionsByCourse(courseId);
const enrollments = getEnrollmentsByCourse(courseId);
const feedbacks = getFeedbacksByCourse(courseId);

console.log(`Course: ${course?.name}`);
console.log(`Sessions: ${sessions.length}`);
console.log(`Students: ${enrollments.length}`);
console.log(`Feedbacks: ${feedbacks.length}`);
```

## 🔄 Data Updates

Để thêm/sửa mock data:

1. Cập nhật file tương ứng trong `src/data/`
2. Đảm bảo relationships đúng
3. Update helper functions nếu cần
4. Run `npm run typecheck` để kiểm tra lỗi

## 📚 Related Documentation

- [TypeScript Types](../types/README.md) - Type definitions
- [API Services](../services/README.md) - API service layer
- [Components](../components/README.md) - UI components

## ✅ Checklist

- [x] Users & Roles
- [x] Coaches & Learners
- [x] Credentials
- [x] Courses & Schedules
- [x] Sessions
- [x] Enrollments & Feedbacks
- [x] Videos & Session Videos
- [x] Quizzes, Questions & Options
- [x] Session Quizzes
- [x] Quiz Attempts & Learner Answers
- [x] Session Earnings
- [x] Wallets & Transactions
- [x] Withdrawal Requests
- [x] Payments
- [x] Achievements
- [x] Achievement Progresses
- [x] Learner Achievements

---

**Last Updated**: 2024-02-10
**Total Mock Data Files**: 27
**Total Records**: 500+
**Status**: ✅ Complete
