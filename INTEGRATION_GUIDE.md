# 📘 Hướng dẫn tích hợp Mock Data vào UI

## ✅ Đã tích hợp
- [x] **Users Page** (`src/app/(admin)/users/page.tsx`)

## ⏳ Cần tích hợp

### 1. **Coaches Page**
File: `src/app/(admin)/coaches/page.tsx` (nếu có)

```typescript
// Import
import { coaches } from '@/data/coaches';
import { users } from '@/data/users';

// Usage
const coachesWithUserInfo = coaches.map(coach => ({
  ...coach,
  fullName: coach.user.fullName,
  email: coach.user.email,
  // ... other fields
}));
```

### 2. **Courses Page**
File: `src/app/(admin)/courses/page.tsx` (nếu có)

```typescript
// Import
import { courses, getCoursesByLevel } from '@/data/courses';
import { getEnrollmentsByCourse } from '@/data/enrollments';

// Usage
const coursesWithStats = courses.map(course => ({
  ...course,
  enrollmentCount: getEnrollmentsByCourse(course.id).length,
  // ... other stats
}));
```

### 3. **Sessions Page**
File: Có thể tạo mới

```typescript
// Import
import { sessions, getSessionsByCourse } from '@/data/sessions';
import { getQuizAttemptsBySession } from '@/data/quiz-attempts';

// Usage
const sessionsWithData = sessions.map(session => ({
  ...session,
  quizAttempts: getQuizAttemptsBySession(session.id).length,
  // ... other data
}));
```

### 4. **Enrollments Page**
```typescript
// Import
import { enrollments, getEnrollmentsByLearner } from '@/data/enrollments';
import { getPaymentsByEnrollment } from '@/data/payments';
```

### 5. **Quizzes Page**
```typescript
// Import
import { quizzes, getQuizzesByLevel } from '@/data/quizzes';
import { questions, getQuestionsByQuiz } from '@/data/questions';
```

### 6. **Achievements Page**
```typescript
// Import
import { achievements, getActiveAchievements } from '@/data/achievements';
import { learnerAchievements, getTopAchievers } from '@/data/learner-achievements';
```

### 7. **Financial/Wallet Page**
```typescript
// Import
import { wallets, getWalletByUserId } from '@/data/wallets';
import { walletTransactions } from '@/data/wallet-transactions';
import { withdrawalRequests } from '@/data/withdrawal-requests';
```

---

## 📝 Pattern tích hợp chuẩn

### Bước 1: Import mock data
```typescript
const loadData = useCallback(async () => {
  setLoading(true);
  try {
    // Import mock data
    const { entityName } = await import('@/data/entity-name');
    
    // ... process data
  } catch (error) {
    message.error('Không thể tải dữ liệu');
  } finally {
    setLoading(false);
  }
}, [dependencies]);
```

### Bước 2: Convert format (nếu cần)
```typescript
// Convert mock data to UI format
const formattedData = mockData.map(item => ({
  id: item.id.toString(),
  // ... map other fields to match UI interface
}));
```

### Bước 3: Apply filters
```typescript
// Apply search filter
if (searchText) {
  formattedData = formattedData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );
}

// Apply status filter
if (statusFilter !== 'all') {
  formattedData = formattedData.filter(item => item.status === statusFilter);
}
```

### Bước 4: Apply pagination
```typescript
const start = (currentPage - 1) * pageSize;
const end = start + pageSize;
const paginatedData = formattedData.slice(start, end);

setData(paginatedData);
setTotal(formattedData.length);
```

---

## 🎯 Ví dụ cụ thể: Users Page

### Before (Empty data):
```typescript
const loadUsers = useCallback(async () => {
  setLoading(true);
  try {
    setUsers([]);
    setTotal(0);
  } catch (error) {
    message.error('Không thể tải danh sách người dùng');
  } finally {
    setLoading(false);
  }
}, []);
```

### After (With mock data):
```typescript
const loadUsers = useCallback(async () => {
  setLoading(true);
  try {
    // Import mock data
    const { users: mockUsers } = await import('@/data/users');
    const coachData = await import('@/data/coaches');
    const learnerData = await import('@/data/learners');
    
    // Convert to UI format
    let filteredUsers = mockUsers.map((user) => ({
      id: user.id.toString(),
      email: user.email,
      name: user.fullName,
      role: user.role.name.toLowerCase(),
      // ... other mappings
    }));

    // Apply filters
    if (searchText) {
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Pagination
    const start = (currentPage - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(start, start + pageSize);

    setUsers(paginatedUsers);
    setTotal(filteredUsers.length);
  } catch (error) {
    message.error('Không thể tải danh sách người dùng');
  } finally {
    setLoading(false);
  }
}, [currentPage, pageSize, searchText, statusFilter]);
```

---

## 🔗 Relationships to consider

### Users → Coaches
```typescript
const coach = coaches.find(c => c.user.id === user.id);
```

### Users → Learners
```typescript
const learner = learners.find(l => l.user.id === user.id);
```

### Courses → Sessions
```typescript
const courseSessions = getSessionsByCourse(course.id);
```

### Courses → Enrollments
```typescript
const courseEnrollments = getEnrollmentsByCourse(course.id);
```

### Sessions → Quiz Attempts
```typescript
const sessionAttempts = getQuizAttemptsBySession(session.id);
```

### Users → Achievements
```typescript
const userAchievements = getLearnerAchievementsByUserId(user.id);
```

### Users → Wallet
```typescript
const userWallet = getWalletByUserId(user.id);
```

---

## 💡 Tips

### 1. **Type Safety**
Luôn sử dụng TypeScript types từ `src/types/`:
```typescript
import type { User } from '@/types/user';
import type { Course } from '@/types/course';
```

### 2. **Helper Functions**
Sử dụng helper functions có sẵn trong mock data files:
```typescript
// ✅ Good
const activeAchievements = getActiveAchievements();

// ❌ Avoid
const activeAchievements = achievements.filter(a => a.isActive);
```

### 3. **Async Imports**
Sử dụng dynamic imports để tránh bundle size lớn:
```typescript
// ✅ Good
const { users } = await import('@/data/users');

// ❌ Avoid (at top level)
import { users } from '@/data/users';
```

### 4. **Error Handling**
Luôn có try-catch và hiển thị message thân thiện:
```typescript
try {
  // load data
} catch (error) {
  console.error('Error:', error);
  message.error('Không thể tải dữ liệu');
}
```

### 5. **Loading States**
Luôn set loading state để UX tốt hơn:
```typescript
setLoading(true);
try {
  // load data
} finally {
  setLoading(false);
}
```

---

## 🚀 Next Steps

1. ✅ **Users Page** - Đã hoàn thành
2. ⏭️ **Coaches Page** - Tích hợp tiếp theo
3. ⏭️ **Courses Page**
4. ⏭️ **Sessions Page**
5. ⏭️ **Dashboard** (Overview statistics)

---

## 📚 References

- Mock Data Documentation: `src/data/README.md`
- Type Definitions: `src/types/`
- Helper Functions: Mỗi file trong `src/data/` có helper functions riêng

---

**Last Updated**: 2024-10-24  
**Status**: In Progress  
**Completed**: 1/10 pages

