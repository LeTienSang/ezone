# PRD.md — Product Requirements Document

> **Nguồn gốc:** Toàn bộ nội dung file này được tổng hợp trực tiếp từ báo cáo "Xây dựng hệ thống quản lý khóa học và đào tạo trực tuyến" — Học viện Công nghệ Bưu chính Viễn thông, Nhóm 10, Tháng 4/2026.
> AI agent dùng file này để sinh UI copy, viết test case và đánh giá tính đúng đắn của tính năng.

---

## 1. Problem Statement

*(Nguồn: Chương 1.1 — Lý do chọn đề tài)*

Trong kỷ nguyên số hóa, các trung tâm đào tạo, trường học và tổ chức giáo dục đang đứng trước nhu cầu cấp thiết về việc số hóa quy trình quản lý. Các phương thức quản lý thủ công hoặc bán thủ công (thông qua Excel, Google Sheets rời rạc) bộc lộ 3 điểm yếu cốt lõi:

- **Dữ liệu phân tán:** Thông tin về học viên, giảng viên và các buổi học không được đồng bộ, dễ dẫn đến sai sót và trùng lặp.
- **Tương tác kém:** Việc giao bài tập và phản hồi điểm số qua email hoặc mạng xã hội gây khó khăn trong việc theo dõi tiến độ và lưu trữ lịch sử học tập.
- **Khó khăn trong mở rộng:** Khi số lượng lớp học và khóa học tăng lên, quản trị viên dễ bị quá tải trong việc sắp xếp lịch trình, đối soát thông tin học phí và điều phối nhân sự.

**Giải pháp:** Xây dựng hệ thống quản lý khóa học (LMS) kết hợp Landing Page giới thiệu nhằm:
- Tập trung hóa dữ liệu toàn bộ vòng đời khóa học (từ tiếp nhận tư vấn → mở lớp → kết thúc).
- Nâng cao tính minh bạch — học viên chủ động theo dõi lộ trình, thời khóa biểu, trạng thái học phí và kết quả học tập.
- Tối ưu nguồn lực — giảm thiểu thủ tục hành chính cho giảng viên và nhà quản lý.

---

## 2. Mục tiêu sản phẩm

*(Nguồn: Chương 1.2 — Mục tiêu của đề tài)*

### Mục tiêu tổng quát

Xây dựng một nền tảng Web tích hợp Landing Page quảng bá và hệ thống quản lý khóa học (LMS) ổn định, có tính bảo mật cao, hỗ trợ tốt quá trình tương tác giữa các đối tượng: Khách vãng lai, Học viên, Giảng viên và Quản trị viên.

### Mục tiêu kỹ thuật

*(Nguồn: Chương 1.2.3)*

- Kiến trúc tách biệt hoàn toàn Frontend và Backend (Decoupled Architecture) giao tiếp qua RESTful API với định dạng JSON.
- Đảm bảo Type-safety xuyên suốt dự án từ Client-side nhờ TypeScript.
- Áp dụng cơ chế xác thực Stateless Authentication dựa trên JWT và phân quyền chặt chẽ bằng Spring Security.
- Giao diện phản hồi tốt (Responsive) trên nhiều thiết bị.

---

## 3. User Personas & Mục tiêu theo từng đối tượng

*(Nguồn: Chương 1.2.2 & Chương 2.2.1)*

### 👤 Guest — Khách vãng lai

- **Mô tả:** Người dùng chưa đăng nhập, tương tác với Landing Page để xem thông tin công khai và đăng ký.
- **Mục tiêu hệ thống phục vụ:**
  - Tìm kiếm và xem danh mục khóa học (COURSES_CATALOG).
  - Xem thông tin đội ngũ giảng viên (INSTRUCTORS).
  - Đăng ký tài khoản học viên mới.
  - Gửi yêu cầu tư vấn nhập học (ENROLLMENTS).

---

### 👤 Student — Học viên

- **Mô tả:** Người tham gia các lớp học, thực hiện các hoạt động học tập, nộp bài và theo dõi tiến độ trên LMS.
- **Mục tiêu hệ thống phục vụ:**
  - Theo dõi lịch trình buổi học (CLASS_SESSIONS).
  - Tải tài liệu học tập (MATERIALS).
  - Nộp bài tập (SUBMISSIONS).
  - Xem phản hồi điểm số (SCORES).
  - Xem lịch sử điểm danh (ATTENDANCE).
  - Gửi thông tin giao dịch/hóa đơn học phí (PAYMENTS).

---

### 👤 Teacher — Giảng viên

- **Mô tả:** Người quản lý chuyên môn lớp học, đăng tải tài liệu, giao bài tập và chấm điểm.
- **Mục tiêu hệ thống phục vụ:**
  - Quản lý tiến độ buổi học, cập nhật nội dung/link học trực tuyến (CLASS_SESSIONS).
  - Ghi nhận điểm danh học viên (ATTENDANCE).
  - Đăng tải tài liệu học tập (MATERIALS).
  - Giao bài tập, thiết lập hạn nộp (ASSIGNMENTS).
  - Chấm điểm và viết nhận xét bài nộp (SCORES).

---

### 👤 Admin — Quản trị viên

- **Mô tả:** Người điều hành toàn bộ hệ thống, quản lý tài khoản, cấu hình khóa học/lớp học và xem báo cáo.
- **Mục tiêu hệ thống phục vụ:**
  - Kiểm soát tài khoản và phân quyền (USERS).
  - Quản lý danh mục khóa học (COURSES_CATALOG).
  - Khởi tạo lớp học, chỉ định giảng viên (CLASSES).
  - Phê duyệt xếp lớp học viên (CLASS_MEMBERS).
  - Đối soát và xác nhận học phí (PAYMENTS).
  - Xem thống kê báo cáo tổng hợp.

---

## 4. Phạm vi hệ thống

*(Nguồn: Chương 1.3 — Phạm vi dự án)*

### Các phân hệ chức năng chính

| Phân hệ | Đối tượng | Mô tả |
|---|---|---|
| Landing Page (Public) | Guest | Xem thông tin khóa học, thông tin giảng viên, đăng ký tư vấn, đăng ký tài khoản |
| Quản trị (Admin Dashboard) | Admin | Quản lý người dùng, phân quyền, quản lý danh mục khóa học, lớp học, phê duyệt học viên vào lớp, xác nhận thanh toán |
| Đào tạo & Tương tác (LMS) | Teacher, Student | Quản lý lịch học, điểm danh, kho tài liệu, giao bài tập, nộp bài làm, chấm điểm/nhận xét |

### Giới hạn hệ thống (Won't Have)

*(Nguồn: Chương 1.3.3 & Chương 4.3)*

| Tính năng | Lý do giới hạn |
|---|---|
| Cổng thanh toán tự động (VNPay, Momo, Paypal) | Dừng ở mức học viên upload hóa đơn, Admin phê duyệt thủ công (PAYMENTS) |
| Real-time Video Call nội bộ | Học trực tuyến thực hiện qua link phòng học ngoài đính kèm vào CLASS_SESSIONS |
| Video Streaming dung lượng lớn | Hệ thống chỉ xử lý văn bản và tệp tài liệu thông thường (PDF, Word, Image) |
| Push Notification real-time | Người dùng phải chủ động tải lại trang để cập nhật thông báo mới |

---

## 5. Danh sách Use Case (Tính năng chi tiết)

*(Nguồn: Chương 2.2.3 — Danh mục chi tiết các Use Case)*

### Nhóm chung — Tất cả người dùng đã đăng nhập

| Mã | Tên | Mô tả |
|---|---|---|
| UC01 | Đăng nhập | Xác thực tài khoản dựa trên USERS, cấp JWT token, điều hướng theo Role |
| UC02 | Đăng xuất | Xóa JWT token phía Client, kết thúc phiên làm việc |
| UC03 | Quản lý hồ sơ cá nhân | Cập nhật thông tin cá nhân (SĐT, avatar, mật khẩu) vào USERS hoặc INSTRUCTORS |

### Nhóm Guest — Landing Page

| Mã | Tên | Mô tả |
|---|---|---|
| UC04 | Xem danh mục khóa học | Hiển thị danh sách khóa học đang kích hoạt từ COURSES_CATALOG |
| UC05 | Xem chi tiết khóa học | Xem lộ trình, học phí, mô tả chi tiết theo course_id |
| UC06 | Xem thông tin giảng viên | Truy xuất tiểu sử từ INSTRUCTORS kết hợp USERS |
| UC07 | Đăng ký tài khoản mới | Tạo bản ghi mới trong USERS với vai trò mặc định STUDENT |
| UC08 | Gửi yêu cầu tư vấn/nhập học | Tạo bản ghi trạng thái Pending trong bảng ENROLLMENTS |

### Nhóm Student — LMS

| Mã | Tên | Mô tả |
|---|---|---|
| UC09 | Gửi minh chứng thanh toán học phí | Tải lên minh chứng chuyển khoản vào PAYMENTS trạng thái "Chờ xác nhận" |
| UC10 | Xem thời khóa biểu | Theo dõi lịch học từ CLASS_SESSIONS của các lớp đang tham gia |
| UC11 | Tải tài liệu học tập | Tải xuống tệp tin từ bảng MATERIALS của lớp |
| UC12 | Xem và Nộp bài tập | Xem ASSIGNMENTS, upload file bài làm vào SUBMISSIONS trước deadline |
| UC13 | Tra cứu kết quả học tập | Xem điểm từ SCORES và lịch sử điểm danh từ ATTENDANCE |

### Nhóm Teacher — LMS

| Mã | Tên | Mô tả |
|---|---|---|
| UC14 | Quản lý buổi học | Cập nhật nội dung, link Zoom/Meet vào CLASS_SESSIONS |
| UC15 | Ghi nhận điểm danh | Đánh dấu Present/Absent/Late cho từng học viên vào ATTENDANCE |
| UC16 | Quản lý tài liệu | Đăng tải hoặc xóa tài liệu trong bảng MATERIALS |
| UC17 | Giao bài tập | Tạo yêu cầu bài tập, thiết lập deadline trong bảng ASSIGNMENTS |
| UC18 | Chấm bài và Nhận xét | Đánh giá SUBMISSIONS, cập nhật điểm số và nhận xét vào SCORES |

### Nhóm Admin — Dashboard

| Mã | Tên | Mô tả |
|---|---|---|
| UC19 | Quản lý người dùng | Thêm, sửa, khóa tài khoản (is_active), phân quyền Role trong USERS |
| UC20 | Quản lý khóa học | Thêm/sửa thông tin lộ trình, học phí trong COURSES_CATALOG |
| UC21 | Quản lý lớp học | Khởi tạo lớp, chỉ định giảng viên, tự động sinh CLASS_SESSIONS mặc định |
| UC22 | Xếp lớp học viên | Duyệt ENROLLMENTS, thêm học viên vào CLASS_MEMBERS |
| UC23 | Quản lý thanh toán | Đối soát hóa đơn, xác nhận/từ chối PAYMENTS |
| UC24 | Thống kê báo cáo | Tổng hợp doanh thu (PAYMENTS), học viên mới (USERS/ENROLLMENTS), chuyên cần (ATTENDANCE) |

---

## 6. Kết quả đạt được & Hạn chế

*(Nguồn: Chương 4.2 & 4.3)*

### Kết quả MVP đạt được

- **Phân quyền và bảo mật chặt chẽ:** Tích hợp Spring Security và JWT, đảm bảo luồng xác thực an toàn và phân tách rõ ràng không gian làm việc của Admin, Teacher và Student.
- **Số hóa quy trình nộp – chấm bài:** Luồng khép kín Teacher giao bài → Student upload SUBMISSIONS → Teacher chấm SCORES.
- **Quản lý dữ liệu tập trung:** Chuẩn hóa 13 bảng thực thể có quan hệ chặt chẽ (Classes, Sessions, Attendance...), loại bỏ phân tán dữ liệu so với quản lý thủ công bằng Excel.

### Hạn chế hiện tại

- **Thanh toán:** Chỉ hỗ trợ Admin nhập thông tin hóa đơn và đối soát thủ công, chưa tích hợp Payment Gateway.
- **Không gian học tập:** Chỉ quản lý lịch học và đính kèm link ngoài (Google Meet/Zoom), chưa tích hợp Video Streaming trực tiếp.
- **Thông báo:** Một số tính năng thông báo (bài tập mới, có điểm) vẫn yêu cầu người dùng chủ động tải lại trang để cập nhật.

---

## 7. Hướng phát triển tương lai

*(Nguồn: Chương 4.4)*

| # | Tính năng | Mô tả |
|---|---|---|
| R01 | Tích hợp cổng thanh toán trực tuyến | Triển khai VNPay hoặc ví điện tử MoMo thông qua API để tự động hóa xác nhận đóng học phí |
| R02 | Tích hợp API hội nghị trực tuyến | Liên kết Zoom API hoặc Google Workspace API để hệ thống tự động tạo phòng học và gửi link cho học viên khi giảng viên lên lịch buổi học mới |
| R03 | Thông báo thời gian thực | Ứng dụng WebSockets để đẩy Push Notifications ngay lập tức khi có điểm thi hoặc thay đổi lịch học |