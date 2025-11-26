PHẦN 1: PHÂN TÍCH KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
Hệ thống này thuộc mô hình LMS (Learning Management System) kết hợp với Gamification và AI Service.

1. Mô hình tổng quan (High-Level Design)
   Hệ thống sẽ bao gồm 3 phần chính:

Client App (Mobile): Dành cho người học (iOS/Android).

Admin Web Portal (CMS): Dành cho admin nhập dữ liệu (từ vựng, bài nghe, đề thi).

Backend Server (API): Xử lý logic, lưu trữ dữ liệu và kết nối AI.

2. Các module chức năng (Functional Modules)
   Auth Service: Đăng ký/Đăng nhập (Email, Google, Facebook, Apple ID).

Course Core: Quản lý cấp độ HSK (1-6), Bài học, Từ vựng, Ngữ pháp.

Exam Engine: Hệ thống thi thử, tính giờ, chấm điểm tự động.

AI Pronunciation (Speech-to-Text): So sánh giọng nói người dùng với giọng mẫu (dùng Google Cloud Speech API hoặc Azure).

Spaced Repetition System (SRS): Thuật toán nhắc lại từ vựng dựa trên độ quên (giống Anki).

Payment: Tích hợp IAP (In-App Purchase) của Apple/Google hoặc cổng thanh toán nội địa (Momo/VNPay).

3. Công nghệ đề xuất (Tech Stack)
   Để tối ưu tốc độ phát triển và hiệu năng:

Mobile App: Flutter (Google) - Code 1 lần chạy cả iOS và Android mượt mà.

Backend: Node.js (NestJS) hoặc Golang. NestJS kiến trúc rất tốt cho các hệ thống lớn.

Database:

PostgreSQL: Lưu User, Transaction, cấu trúc bài học (Quan hệ chặt chẽ).

MongoDB: Lưu Logs bài thi, lịch sử chat AI, dữ liệu không cấu trúc.

Redis: Caching bảng xếp hạng (Leaderboard) và Session.

AI/Storage: Firebase (Auth, Push Notification), AWS S3 (Lưu file nghe, ảnh).

PHẦN 2: FILE PLAN & PROJECT STRUCTURE (CẤU TRÚC DỰ ÁN)
Dưới đây là cấu trúc thư mục tiêu chuẩn (Monorepo) để bạn dễ quản lý cả Backend và Frontend.

1. Cấu trúc thư mục tổng (Root)
   Plaintext

/trum-chinese-clone
├── /backend (API Server)
├── /mobile-app (Flutter App)
├── /admin-panel (ReactJS/NextJS Dashboard)
├── /docs (Tài liệu thiết kế, API Spec)
└── README.md 2. Chi tiết Backend (Node.js/NestJS)
Đây là "bộ não" của hệ thống.

Plaintext

/backend
├── /src
│ ├── /modules
│ │ ├── /auth # Xử lý Login, JWT, Refresh Token
│ │ ├── /users # Profile, streak, level
│ │ ├── /courses # Logic HSK levels, lessons
│ │ ├── /vocabulary # Quản lý từ vựng, Flashcards
│ │ ├── /exam # Logic đề thi, chấm điểm
│ │ ├── /ai-tutor # Tích hợp API nhận diện giọng nói
│ │ └── /payment # Xử lý thanh toán, đăng ký Premium
│ ├── /common # Các hàm dùng chung (Helpers, Constants)
│ ├── /database # Migrations, Seeds (Dữ liệu mẫu)
│ └── main.ts # Entry point
├── .env # Biến môi trường (DB pass, API Keys)
└── docker-compose.yml # Để chạy DB và Redis cục bộ 3. Chi tiết Mobile App (Flutter)
Giao diện người dùng.

Plaintext

/mobile-app
├── /assets # Ảnh, Fonts, Icons, JSON animation
├── /lib
│ ├── /config # Routes, Theme, Env config
│ ├── /core # Base API Client, Error handling
│ ├── /data # Models và Repository (Gọi API)
│ ├── /logic # State Management (Bloc/Riverpod/GetX)
│ ├── /presentation # UI Screens & Widgets
│ │ ├── /auth # Màn hình đăng nhập
│ │ ├── /home # Dashboard chọn HSK
│ │ ├── /learn # Màn hình học (Flashcard, Video)
│ │ ├── /practice # Màn hình luyện nói (ghi âm)
│ │ ├── /exam # Giao diện làm bài thi (Timer, Multiple choice)
│ │ └── /profile # Thống kê, biểu đồ
│ └── main.dart
└── pubspec.yaml # Quản lý thư viện 4. Database Schema (Sơ đồ dữ liệu cơ bản)
Bạn cần thiết kế các bảng (Table) chính sau:

users: id, name, email, password_hash, premium_status.

hsk_levels: id, name (HSK1, HSK2...), description.

lessons: id, level_id, title, order_index.

vocabularies: id, lesson_id, chinese_word, pinyin, meaning, audio_url, example_sentence.

user_progress: user_id, vocab_id, status (remembered/forgot), next_review_date (cho thuật toán SRS).

exam_results: user_id, exam_id, score, time_taken.

PHẦN 3: LỘ TRÌNH THỰC HIỆN (ROADMAP)
Nếu bạn làm một mình hoặc team nhỏ, hãy đi theo quy trình này để tránh bị "ngợp":

Giai đoạn 1: Core & Data (Quan trọng nhất)

Thiết kế Database.

Dựng Backend API cơ bản (CRUD từ vựng, bài học).

Xây dựng trang Admin (Web) để nhập dữ liệu. Lưu ý: Một app học tiếng Trung chỉ hay khi nội dung (Content) hay. Bạn cần nhập hàng ngàn từ vựng và file nghe.

Giai đoạn 2: Mobile App Skeleton

Dựng UI cơ bản bằng Flutter.

Kết nối API Login/Register.

Hiển thị danh sách bài học HSK.

Giai đoạn 3: Tính năng học tập

Làm tính năng Flashcard (vuốt trái/phải).

Làm tính năng Quiz (trắc nghiệm 4 đáp án).

Tích hợp Audio Player để nghe phát âm.

Giai đoạn 4: AI & Premium (Nâng cao)

Tích hợp Speech-to-Text để chấm điểm phát âm (Gợi ý: Dùng Azure Speech SDK vì hỗ trợ tiếng Trung rất tốt).

Tích hợp cổng thanh toán để mở khóa tính năng Pro.
