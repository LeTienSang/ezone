# Vietnamese Templates

## Giải thích Code

```markdown
## 📁 File: {filename}

### Mục đích
[1-2 câu mô tả file này làm gì]

### Phân tích

**Imports**
- Import X từ Y để [mục đích]

**Class/function chính**
- [Giải thích logic]
- [Dùng ví dụ đời thường nếu cần]

**Các methods**
- `methodX()`: [làm gì, khi nào được gọi]

### 💡 Điểm cần nhớ
- Điểm 1
- Điểm 2

### 🔗 Liên kết
- Được gọi bởi: ...
- Gọi tới: ...
```

---

## Giải thích Concept

```markdown
## 🎯 {Tên Concept}

### Là gì?
[Giải thích đơn giản, 2-3 câu]

### Ví dụ đời thường
[So sánh với thứ quen thuộc]

Ví dụ: Repository Pattern giống như **thủ thư** trong thư viện:
- Bạn không tự vào kho tìm sách
- Bạn nhờ thủ thư (Repository) tìm giúp
- Thủ thư biết sách ở đâu, cách tìm nhanh nhất

### Trong code

```typescript
// Ví dụ code ngắn
```

### Tại sao cần?
- Lý do 1
- Lý do 2

### Không dùng thì sao?
[Vấn đề sẽ gặp]

### 📚 Tìm hiểu thêm
- Từ khóa để search
```

---

## Giải thích Flow

```markdown
## 🔄 Flow: {Tên Action}

### Tổng quan
[1-2 câu mô tả flow này]

### Sơ đồ

```
[Hành động của user trên trang web]
    │
    ▼
[Content Script] ──────── Phát hiện sự kiện (bôi chữ, click, ...)
    │ chrome.runtime.sendMessage (có type)
    ▼
[Background Service Worker] ── Điều phối message, gọi integration
    │                       │
    ▼                       ▼
[Integration API]      [chrome.storage]
(dịch thuật / AI)      (đọc / ghi)
    │
    ▼
[Popup / Side Panel] ◄─── Kết quả trả về UI
```

### Chi tiết từng bước

**Bước 1: User thực hiện hành động**
- Ví dụ: bôi đen từ, nhấn nút Save

**Bước 2: Content script phát hiện**
- Lắng nghe sự kiện DOM
- Gửi typed message qua `core/messaging/dispatcher.ts`

**Bước 3: Background điều phối**
- Nhận message, gọi đúng feature service
- Gọi integration (translation API, AI) nếu cần

**Bước 4: Storage (nếu cần)**
- Đọc/ghi qua `core/browser/storage.ts`
- Kiểm tra quota sau khi ghi vào `vocab:entries`

**Bước 5: Response**
- Background trả về `Result<T>` cho nơi gọi
- Popup/side panel cập nhật UI qua hook state

### 🔍 Mẹo debug
- Nếu lỗi ở bước X, kiểm tra...
```

---

## Giải thích Why

```markdown
## ❓ Tại sao: {Câu hỏi}

### Trả lời ngắn
[1-2 câu, trả lời trực tiếp]

### Giải thích chi tiết

**Lý do 1: ...**
[Giải thích]

**Lý do 2: ...**
[Giải thích]

### Không làm vậy thì sao?
[Vấn đề sẽ gặp]

### Đánh đổi
| Ưu điểm | Nhược điểm |
|---------|------------|
| ... | ... |

### Có cách khác không?
[Các lựa chọn khác và khi nào dùng]

### 📌 Kết luận
[Tóm tắt khuyến nghị]
```