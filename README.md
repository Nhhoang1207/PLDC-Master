# ⚡ PLDC Master — Chinh Phục Pháp Luật Đại Cương

> Ứng dụng quiz trắc nghiệm **Pháp Luật Đại Cương** với hệ thống gamification, shop giao diện, và nhiều hiệu ứng đẹp mắt — giúp việc ôn thi trở nên thú vị hơn bao giờ hết.

---

## 🎯 Tính Năng Chính

### 📝 Chế Độ Làm Bài
| Chế độ | Mô tả |
|--------|--------|
| ⚔️ **Luyện Tập** | Làm từng câu, nhận phản hồi và giải thích ngay lập tức. Tích lũy XP khi trả lời đúng. |
| 🏆 **Thi Thử** | Làm toàn bộ đề rồi nộp bài. Mô phỏng thi thật, không hiển thị đáp án cho đến khi nộp. |

### 🔥 Gamification
- **Hệ thống XP & Level**: Nhận **+10 XP** mỗi câu đúng, lên level sau mỗi 100 XP.
- **Góc Ôn Tập**: Tự động lưu các câu trả lời sai để ôn lại sau.
- **Hiệu ứng Confetti**: Ăn mừng khi đạt kết quả cao (≥ 80%).

### 🛒 Cửa Hàng Giao Diện
Dùng XP để mở khóa **13 bộ giao diện** đa dạng:

| Giao diện | Giá XP | Giao diện | Giá XP |
|-----------|--------|-----------|--------|
| ☀️ Sáng Cơ Bản | Miễn phí | 🌙 Tối Cơ Bản | Miễn phí |
| 🌈 Soft Pastel | 100 | 🌿 Bạc Hà | 250 |
| 🌸 Hoa Anh Đào | 300 | ☕ Cà Phê | 300 |
| 🌲 Rừng Xanh | 350 | 🍭 Kẹo Ngọt | 400 |
| 🌅 Hoàng Hôn | 400 | 🌊 Đại Dương | 450 |
| ⚡ Cyberpunk | 500 | 👾 Retro Game | 600 |
| 🌌 Dải Ngân Hà | 700 | | |

---

## 🛠️ Công Nghệ Sử Dụng

- **HTML5** — Cấu trúc semantic
- **CSS3** — Glassmorphism, animations, responsive design, 13 bộ theme với CSS custom properties
- **Vanilla JavaScript** — Logic ứng dụng, quản lý state, localStorage
- **Google Fonts** — Font [Inter](https://fonts.google.com/specimen/Inter)
- **Canvas Confetti** — Hiệu ứng pháo hoa khi hoàn thành bài

---

## 📁 Cấu Trúc Dự Án

```
PLDC/
├── index.html          # Trang chính (Home, Shop, Quiz, Result screens)
├── index.css           # Toàn bộ stylesheet (themes, animations, responsive)
├── app.js              # Logic ứng dụng (state, quiz engine, gamification, shop)
├── quizzes.json        # Dữ liệu câu hỏi trắc nghiệm
├── Quizz/              # File PDF đề gốc (6 bài luyện tập + kiểm tra)
├── extracted/          # Dữ liệu đã trích xuất
└── README.md           # File này
```

---

## 🚀 Cách Chạy

### Yêu cầu
- Một trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Một local server (do ứng dụng sử dụng `fetch` để load `quizzes.json`)

### Khởi chạy nhanh

**Cách 1 — VS Code Live Server:**
1. Mở thư mục `PLDC` trong VS Code
2. Cài extension **Live Server**
3. Click chuột phải vào `index.html` → **Open with Live Server**

**Cách 2 — Python:**
```bash
cd PLDC
python -m http.server 8080
# Mở trình duyệt: http://localhost:8080
```

**Cách 3 — Node.js:**
```bash
npx -y serve .
```

---

## ⌨️ Phím Tắt

| Phím | Chức năng |
|------|-----------|
| `←` | Câu trước |
| `→` | Câu sau |
| `A` `B` `C` `D` | Chọn đáp án tương ứng |

---

## 💾 Lưu Trữ Dữ Liệu

Ứng dụng sử dụng **localStorage** để lưu tiến trình người dùng:

| Key | Mô tả |
|-----|--------|
| `quiz-xp` | Tổng điểm XP |
| `quiz-theme` | Giao diện đang sử dụng |
| `quiz-unlocked-themes` | Danh sách giao diện đã mở khóa |
| `quiz-wrong-qs` | Các câu hỏi đã trả lời sai (để ôn tập) |

---

## 📊 Nguồn Dữ Liệu Câu Hỏi

Câu hỏi được trích xuất từ **6 bài luyện tập & kiểm tra** môn Pháp Luật Đại Cương (định dạng PDF), bao gồm:

- Bài luyện tập 1 → 5
- Bài kiểm tra quá trình

Dữ liệu đã được chuyển đổi sang định dạng JSON trong file `quizzes.json`.

---

## 📄 License

Dự án được tạo cho mục đích **học tập cá nhân**.

---

<p align="center">
  Made with ❤️ for PLDC learners
</p>
