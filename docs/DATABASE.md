# DATABASE.md — Data Model & Từ điển dữ liệu ezone

> **Mục đích:** Mô tả đầy đủ 13 bảng, quan hệ giữa các bảng, ràng buộc dữ liệu và các quyết định thiết kế DB. Đây là nguồn tham chiếu khi viết Entity (BE) và Interface (FE).

---

## Thông tin DB

| Thuộc tính | Giá trị |
|---|---|
| DBMS | MySQL 8.x |
| Database name | `ezone_db` |
| Charset | `utf8mb4` |
| Collation | `utf8mb4_unicode_ci` |
| ORM | Spring Data JPA (Hibernate) |

---

## Sơ đồ quan hệ (ERD tóm tắt)

```
USERS ──────────────── INSTRUCTORS (1:1)
  │
  ├── ENROLLMENTS ──── COURSES_CATALOG (n:n qua ENROLLMENTS)
  │       │
  │       └── PAYMENTS (1:1)
  │
  └── CLASS_MEMBERS ── CLASSES ──────── COURSES_CATALOG (n:1)
                         │                   │
                         │               INSTRUCTORS (n:1)
                         │
                         ├── CLASS_SESSIONS
                         │       │
                         │       └── ATTENDANCE ── USERS (n:n)
                         │
                         ├── MATERIALS
                         │
                         └── ASSIGNMENTS
                                 │
                                 └── SUBMISSIONS ── USERS (n:n)
                                         │
                                         └── SCORES (1:1)
```

---

## Nhóm 1: Quản lý Người dùng & Phân quyền

### Bảng `USERS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Tên đăng nhập |
| `password` | VARCHAR(255) | NOT NULL | Mật khẩu đã mã hóa BCrypt |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Email liên lạc, dùng để đăng nhập |
| `full_name` | VARCHAR(100) | NOT NULL | Họ và tên đầy đủ |
| `phone` | VARCHAR(15) | NULL | Số điện thoại |
| `role` | ENUM | NOT NULL | `'ADMIN'`, `'TEACHER'`, `'STUDENT'` |
| `avatar` | VARCHAR(255) | NULL | Đường dẫn ảnh đại diện |
| `is_active` | BOOLEAN | DEFAULT `true` | `false` = tài khoản bị khóa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tạo tài khoản |

> ⚠️ `is_active = false` → từ chối đăng nhập với lỗi "Tài khoản của bạn đã bị khóa".

---

### Bảng `INSTRUCTORS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `user_id` | INT | FK → `USERS.id`, UNIQUE | Liên kết 1:1 với tài khoản |
| `bio` | TEXT | NULL | Tiểu sử giảng viên |
| `specialization` | VARCHAR(255) | NULL | Chuyên môn (IELTS, TOEIC, Giao tiếp) |
| `experience_years` | INT | NULL | Số năm kinh nghiệm |
| `rating` | DECIMAL(3,2) | NULL | Điểm đánh giá trung bình (0.00 – 5.00) |

**Quan hệ:** `USERS` 1:1 `INSTRUCTORS` (optional — chỉ user có role TEACHER mới có bản ghi INSTRUCTORS)

---

## Nhóm 2: Đào tạo & Website (Landing Page)

### Bảng `COURSES_CATALOG`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `course_name` | VARCHAR(255) | NOT NULL | Tên khóa học |
| `description` | TEXT | NULL | Nội dung & mục tiêu |
| `price` | DECIMAL(10,2) | NOT NULL | Học phí niêm yết (VND) |
| `duration` | VARCHAR(50) | NULL | Thời lượng (ví dụ: "3 tháng") |
| `level` | VARCHAR(50) | NULL | Trình độ (Beginner, Intermediate, Advanced) |
| `thumbnail` | VARCHAR(255) | NULL | Ảnh đại diện khóa học |
| `is_visible` | BOOLEAN | DEFAULT `true` | `false` = ẩn khỏi Landing Page |

---

### Bảng `ENROLLMENTS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `user_id` | INT | FK → `USERS.id`, NOT NULL | Liên kết tới tài khoản người đăng ký (có thể có vai trò `'GUEST'` hoặc `'STUDENT'`) |
| `course_id` | INT | FK → `COURSES_CATALOG.id`, NOT NULL | Khóa học đăng ký |
| `status` | ENUM | DEFAULT `'pending'` | `'pending'`, `'paid'`, `'cancelled'` |
| `registration_date` | TIMESTAMP | DEFAULT NOW() | Ngày gửi yêu cầu |

> **Cơ chế hoạt động:** Guest chưa đăng ký tài khoản khi gửi form tư vấn sẽ được hệ thống tạo tự động một tài khoản USER với role `'GUEST'`. Khi Admin duyệt hoặc khi người dùng đăng ký chính thức, tài khoản sẽ được nâng cấp lên `'STUDENT'`.

---

### Bảng `PAYMENTS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `enrollment_id` | INT | FK → `ENROLLMENTS.id`, UNIQUE | Liên kết đăng ký (1:1) |
| `amount` | DECIMAL(10,2) | NOT NULL | Số tiền thực tế chuyển khoản |
| `payment_method` | VARCHAR(50) | NULL | Hình thức: "Banking", "Momo", "Tiền mặt" |
| `transaction_id` | VARCHAR(100) | NULL | Mã giao dịch đối soát |
| `receipt_image` | VARCHAR(255) | NULL | Đường dẫn ảnh minh chứng chuyển khoản |
| `status` | ENUM | DEFAULT `'pending'` | `'pending'`, `'success'`, `'failed'` |
| `reject_reason` | VARCHAR(255) | NULL | Lý do từ chối (nếu có) |
| `payment_date` | TIMESTAMP | NULL | Thời điểm Admin xác nhận thành công |

---

## Nhóm 3: Quản lý Lớp học (LMS)

### Bảng `CLASSES`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `course_id` | INT | FK → `COURSES_CATALOG.id`, NOT NULL | Khóa học gốc |
| `instructor_id` | INT | FK → `INSTRUCTORS.id`, NOT NULL | Giảng viên phụ trách |
| `class_name` | VARCHAR(100) | NOT NULL | Tên định danh lớp (ví dụ: IELTS-2024-K01) |
| `start_date` | DATE | NOT NULL | Ngày khai giảng |
| `end_date` | DATE | NOT NULL | Ngày kết thúc |
| `max_students` | INT | DEFAULT 20 | Sĩ số tối đa |
| `status` | ENUM | DEFAULT `'upcoming'` | `'upcoming'`, `'active'`, `'completed'` |

---

### Bảng `CLASS_MEMBERS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `class_id` | INT | FK → `CLASSES.id`, NOT NULL | Lớp học tham gia |
| `student_id` | INT | FK → `USERS.id`, NOT NULL | Học viên tham gia |
| `joined_date` | DATE | DEFAULT TODAY | Ngày chính thức vào lớp |

**Unique constraint:** `(class_id, student_id)` — Mỗi học viên chỉ xuất hiện một lần trong một lớp.

---

### Bảng `CLASS_SESSIONS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `class_id` | INT | FK → `CLASSES.id`, NOT NULL | Buổi học thuộc lớp nào |
| `title` | VARCHAR(255) | NULL | Chủ đề buổi học |
| `session_date` | DATETIME | NOT NULL | Ngày và giờ học cụ thể |
| `room` | VARCHAR(255) | NULL | Phòng học hoặc link Zoom/Meet |
| `content` | TEXT | NULL | Nội dung / đề cương buổi học |

---

### Bảng `ATTENDANCE`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `session_id` | INT | FK → `CLASS_SESSIONS.id`, NOT NULL | Buổi học điểm danh |
| `student_id` | INT | FK → `USERS.id`, NOT NULL | Học viên được điểm danh |
| `status` | ENUM | NOT NULL | `'present'`, `'absent'`, `'late'` |
| `note` | VARCHAR(255) | NULL | Ghi chú lý do vắng/muộn |

**Unique constraint:** `(session_id, student_id)` — Mỗi học viên chỉ có một bản ghi điểm danh mỗi buổi.

---

## Nhóm 4: Tài liệu & Bài tập

### Bảng `MATERIALS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `class_id` | INT | FK → `CLASSES.id`, NOT NULL | Lớp học sở hữu tài liệu |
| `title` | VARCHAR(255) | NOT NULL | Tên tài liệu |
| `file_url` | VARCHAR(255) | NOT NULL | Đường dẫn tải/xem tài liệu |
| `material_type` | ENUM | NOT NULL | `'pdf'`, `'doc'`, `'image'`, `'link'` |
| `uploaded_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm đăng tải |

---

### Bảng `ASSIGNMENTS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `class_id` | INT | FK → `CLASSES.id`, NOT NULL | Bài tập của lớp nào |
| `title` | VARCHAR(255) | NOT NULL | Tiêu đề bài tập |
| `description` | TEXT | NULL | Yêu cầu chi tiết bài tập |
| `due_date` | DATETIME | NOT NULL | Thời hạn nộp bài |
| `max_score` | INT | DEFAULT 10 | Thang điểm tối đa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm tạo bài tập |

---

### Bảng `SUBMISSIONS`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `assignment_id` | INT | FK → `ASSIGNMENTS.id`, NOT NULL | Nộp cho bài tập nào |
| `student_id` | INT | FK → `USERS.id`, NOT NULL | Học viên nộp bài |
| `content` | TEXT | NULL | Nội dung văn bản / mô tả bài nộp |
| `file_url` | VARCHAR(255) | NULL | Đường dẫn file bài làm |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm nộp bài |

**Unique constraint:** `(assignment_id, student_id)` — Mỗi học viên chỉ có một bài nộp cho mỗi bài tập (có thể ghi đè nếu còn trong hạn).

---

### Bảng `SCORES`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INT | PK, AUTO_INCREMENT | Khóa chính |
| `submission_id` | INT | FK → `SUBMISSIONS.id`, UNIQUE | Điểm cho bài nộp nào (1:1) |
| `score` | DECIMAL(5,2) | NOT NULL | Điểm số giảng viên chấm |
| `teacher_feedback` | TEXT | NULL | Nhận xét, góp ý từ giảng viên |
| `graded_at` | TIMESTAMP | DEFAULT NOW() | Thời điểm chấm điểm |

---

## Tóm tắt quan hệ giữa 13 bảng

| Mối quan hệ | Loại | Bảng trung gian |
|---|---|---|
| `USERS` ↔ `INSTRUCTORS` | 1:1 (optional) | — |
| `USERS` ↔ `COURSES_CATALOG` | n:n | `ENROLLMENTS` |
| `ENROLLMENTS` ↔ `PAYMENTS` | 1:1 | — |
| `COURSES_CATALOG` ↔ `CLASSES` | 1:n | — |
| `INSTRUCTORS` ↔ `CLASSES` | 1:n | — |
| `CLASSES` ↔ `USERS` (Student) | n:n | `CLASS_MEMBERS` |
| `CLASSES` ↔ `CLASS_SESSIONS` | 1:n | — |
| `CLASS_SESSIONS` ↔ `USERS` | n:n | `ATTENDANCE` |
| `CLASSES` ↔ `MATERIALS` | 1:n | — |
| `CLASSES` ↔ `ASSIGNMENTS` | 1:n | — |
| `ASSIGNMENTS` ↔ `USERS` | n:n | `SUBMISSIONS` |
| `SUBMISSIONS` ↔ `SCORES` | 1:1 | — |

---

## Ánh xạ Entity (Spring Data JPA)

```java
// Ví dụ ánh xạ bảng CLASSES
@Entity
@Table(name = "CLASSES")
public class Classes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CoursesCatalog course;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructors instructor;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "max_students")
    private Integer maxStudents = 20;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ClassStatus status = ClassStatus.UPCOMING;

    // OneToMany mappedBy cho classSessions, classMembers, materials, assignments
}

// Enum tương ứng
public enum ClassStatus {
    UPCOMING, ACTIVE, COMPLETED
}
```

---

## Lưu ý thiết kế quan trọng

- **ENROLLMENTS.user_id không thể NULL:** Guest chưa đăng ký tài khoản khi gửi form tư vấn sẽ được hệ thống tự động tạo tài khoản với vai trò 'GUEST'.
- **CLASS_MEMBERS là bảng trung gian quan trọng:** Mọi kiểm tra quyền truy cập tài liệu, bài tập, điểm danh đều JOIN qua bảng này.
- **SUBMISSIONS unique (assignment_id, student_id):** Học viên chỉ có thể nộp một bài cho mỗi assignment; nộp lại = UPDATE bản ghi cũ nếu còn trong hạn.
- **SCORES.submission_id UNIQUE:** Đảm bảo mỗi bài nộp chỉ có đúng một bản ghi điểm.
- **Không dùng soft delete mặc định:** Chỉ `USERS.is_active` và `COURSES_CATALOG.is_visible` dùng cờ boolean để ẩn/khóa. Các bảng còn lại dùng DELETE thật.