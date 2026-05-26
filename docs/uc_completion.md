# UC Completion Report

## Kết luận nhanh

**Dự án chưa đạt 100% Use case.**

Theo audit code-level giữa [docs/PRD.md](PRD.md) và implementation hiện tại, dự án đang ở mức:
- **18 use case hoàn chỉnh**
- **6 use case còn partial**
- **0 use case bị thiếu hoàn toàn** ở lớp kiểm tra surface hiện có

> Ghi chú: đây là đánh giá theo code/màn hình/API hiện có, chưa phải kiểm tra end-to-end trên môi trường chạy thật.

## Bảng đối chiếu Use case

| UC | Tên | Trạng thái | Ghi chú |
|---|---|---|---|
| UC01 | Đăng nhập | Done | Có luồng login + JWT + điều hướng theo role |
| UC02 | Đăng xuất | Partial | Chỉ xóa token phía client, chưa có revoke/blacklist JWT |
| UC03 | Quản lý hồ sơ cá nhân | Done | Có xem/cập nhật hồ sơ và đổi mật khẩu |
| UC04 | Xem danh mục khóa học | Done | Có API/public page cho danh sách khóa học |
| UC05 | Xem chi tiết khóa học | Done | Có trang chi tiết theo course id |
| UC06 | Xem thông tin giảng viên | Done | Có danh sách/tiểu sử giảng viên |
| UC07 | Đăng ký tài khoản mới | Done | Có form register và endpoint tạo user |
| UC08 | Gửi yêu cầu tư vấn/nhập học | Done | Có luồng tạo enrollment |
| UC09 | Gửi minh chứng thanh toán | Done | Có upload payment proof |
| UC10 | Xem thời khóa biểu | Done | Có lịch học cho student |
| UC11 | Tải tài liệu học tập | Done | Có list/download materials |
| UC12 | Xem và nộp bài tập | Done | Có assignment + submission flow |
| UC13 | Tra cứu kết quả học tập | Done | Có điểm và attendance history |
| UC14 | Quản lý buổi học | Partial | Backend có update session, nhưng frontend chưa có editor đầy đủ cho title/content/room/link |
| UC15 | Ghi nhận điểm danh | Done | Có luồng điểm danh cho teacher |
| UC16 | Quản lý tài liệu | Done | Có upload/xóa tài liệu |
| UC17 | Giao bài tập | Done | Có tạo assignment và deadline |
| UC18 | Chấm bài và nhận xét | Done | Có grading/feedback |
| UC19 | Quản lý người dùng | Partial | Mới có list + toggle active, chưa đủ create/edit/role change |
| UC20 | Quản lý khóa học | Partial | Chưa có CRUD đầy đủ cho admin |
| UC21 | Quản lý lớp học | Partial | Chưa bootstrap session mặc định sau khi tạo lớp |
| UC22 | Xếp lớp học viên | Done | Có approve enrollment / add to class |
| UC23 | Quản lý thanh toán | Done | Có confirm/reject payment |
| UC24 | Thống kê báo cáo | Partial | Dashboard còn nghiêng về aggregate client-side, thiếu analytics endpoint riêng |

## Cần nâng cấp để đạt 100%

### Ưu tiên cao

1. **UC02 — Đăng xuất:** thêm cơ chế revoke/blacklist JWT nếu muốn logout có hiệu lực thật.
2. **UC14 — Quản lý buổi học:** bổ sung UI chỉnh sửa session đầy đủ và đồng bộ link học trực tuyến.
3. **UC20 — Quản lý khóa học:** làm đủ CRUD admin cho course catalog.
4. **UC21 — Quản lý lớp học:** tự động sinh các session mặc định khi tạo lớp.

### Ưu tiên trung bình

5. **UC19 — Quản lý người dùng:** thêm create/edit/role change trong admin.
6. **UC24 — Thống kê báo cáo:** tách analytics endpoint riêng, thay vì chỉ tính toán phía client.

## Gợi ý hoàn thiện

- Nếu mục tiêu là **100% use case theo PRD**, nên ưu tiên hoàn tất 6 mục partial ở trên.
- Nếu mục tiêu là **MVP chạy được**, hệ thống đã bao phủ hầu hết luồng cốt lõi.
- Khi verify runtime, cần sửa cấu hình DB trước để backend khởi động ổn định.

## Ghi chú runtime

Backend hiện có lỗi khởi động liên quan đến MySQL credentials:

- `Access denied for user 'root'@'localhost' (using password: YES)`

Điều này không làm thay đổi audit use case, nhưng cần xử lý để test end-to-end.
