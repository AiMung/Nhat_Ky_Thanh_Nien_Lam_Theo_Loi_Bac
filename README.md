# NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC
### Cổng thông tin & Nền tảng số hóa ký ức lịch sử — Thành Đoàn TP. Hồ Chí Minh
> Đơn vị phối hợp phát động thi đua: **37 Tổ Dân Phố Phường Xuân Hương (TP. Đà Lạt)** và các cơ sở Đoàn thanh niên toàn quốc.

---

## 🌟 TỔNG QUAN DỰ ÁN

Dự án **"Nhật Ký Thanh Niên Làm Theo Lời Bác"** là nền tảng web ứng dụng (PWA) hiện đại chuẩn **Enterprise**, mô phỏng tinh thần hào hùng của phong trào *Thời Hoa Lửa* (cauchuyenlichsu.vn), được xây dựng trên nền tảng **Astro 5 + React + Tailwind CSS**, tối ưu hóa 100% để vận hành trên hạ tầng miễn phí **GitHub Pages**, **Supabase** và **Cloudinary**.

### Các tính năng cốt lõi đã hoàn thiện:
1. **Hero Banner Hào Hùng Chuẩn Đồ Họa:** Tôn vinh hình ảnh Bác Hồ, Đại tướng Võ Nguyên Giáp, Mẹ Việt Nam Anh hùng, thế hệ trẻ và ngọn cờ Tổ quốc đỏ thắm.
2. **Bộ Tìm Kiếm Không Dấu Tức Thì (`SearchBar`):** Gõ có dấu hoặc không dấu (vd: `ha noi` ra `Hà Nội`), kết quả hiển thị gọn gàng, tự động đóng khi nhấp chuột ra ngoài.
3. **Mốc Son Lịch Sử Tương Tác Phong Cách GSAP (`InteractiveTimelineGsap`):** Trục thời gian ánh kim, 7 mốc son lịch sử hào hùng (1931, 1954, 1968, 1972, 1975, 1988, Nay) với hình ảnh tư liệu sắc nét và trích dẫn bất hủ.
4. **Bản Đồ Ký Ức Lịch Sử & Địa Chỉ Đỏ SVG (`VietnamMap`):** Bản đồ Việt Nam hình chữ S tương tác thực sự, khẳng định trọn vẹn chủ quyền thiêng liêng đối với hai quần đảo **Hoàng Sa** (Đà Nẵng) và **Trường Sa** (Khánh Hòa) cùng cụm Nhà giàn DK1.
5. **Bảng Xếp Hạng Thi Đua (`LeaderboardSection`):** Bục vinh danh Podium Top 1 🥇, Top 2 🥈, Top 3 🥉 với danh mục thi đua dành riêng cho **37 Tổ Dân Phố Phường Xuân Hương (TP. Đà Lạt)**, các cơ sở Đoàn TP.HCM và lực lượng vũ trang.
6. **Bộ Soạn Thảo Đăng Bài Chuẩn Facebook (`StorySubmitForm` + `ImageUploadBox`):**
   - Hỗ trợ chọn tệp từ máy tính, kéo thả nhiều ảnh.
   - **Dán trực tiếp ảnh từ bộ nhớ tạm (Ctrl + V)** với bộ nén tự động trên trình duyệt.
   - Bộ chọn nhanh 37 Tổ dân phố P. Xuân Hương (Đà Lạt).
   - Tab **Xem trước bài viết (Live Preview)** trước khi gửi.
   - Album hiển thị ảnh đa chiều chuẩn Facebook (`FacebookImageGrid`).
7. **Hàng Đợi Kiểm Duyệt Hai Tầng (`AdminModerationQueue`):** Tiền kiểm bài viết trước khi xuất bản, hỗ trợ duyệt bài, từ chối kèm lý do hoặc gỡ bài.
8. **Đọc Chi Tiết & Khắc Phục Lỗi 404 Tuyệt Đối (`ClientStoryViewer` + `404.astro`):** Mọi bài viết vừa đăng hoặc vừa duyệt từ trình duyệt đều được xem tức thì không có độ trễ, không bao giờ bị lỗi 404.
9. **Thanh Công Cụ Tương Tác Giọng Nói (`StoryReaderToolbar`):** Đọc bài viết bằng Web Speech API tiếng Việt, chỉnh cỡ chữ to/nhỏ cho người lớn tuổi, lưu bookmark và chia sẻ mạng xã hội.

---

## 🚀 HƯỚNG DẪN ĐƯA LÊN GITHUB & BÀN GIAO VẬN HÀNH

### Bước 1: Tạo Repository mới trên GitHub
1. Đăng nhập vào tài khoản [GitHub](https://github.com/).
2. Bấm vào dấu **`+`** ở góc trên bên phải → chọn **`New repository`**.
3. Đặt tên Repository: ví dụ `nhat-ky-thanh-nien` (hoặc `ky-uc-lich-su`).
4. Chọn chế độ **Public**.
5. **KHÔNG** tích chọn *Add a README file* (vì mã nguồn cục bộ đã có sẵn).
6. Bấm **Create repository**.

### Bước 2: Đẩy toàn bộ mã nguồn lên GitHub (Chỉ cần 3 lệnh)
Mở cửa sổ PowerShell hoặc Terminal tại thư mục dự án `G:\DTN-HCM` và chạy các lệnh sau:

```bash
# 1. Thêm địa chỉ repository GitHub của bạn (thay username và ten-repo tương ứng)
git remote add origin https://github.com/<username>/<ten-repo>.git

# 2. Đổi tên nhánh chính sang master hoặc main
git branch -M master

# 3. Đẩy toàn bộ mã nguồn lên GitHub
git push -u origin master
```

### Bước 3: Kích hoạt GitHub Pages (Miễn phí 100%)
1. Trên giao diện GitHub của repository, vào mục **Settings** (biểu tượng bánh răng).
2. Tại menu bên trái, chọn **Pages**.
3. Ở mục **Build and deployment** → **Source**, chuyển từ `Deploy from a branch` sang **`GitHub Actions`**.
4. Xong! Quy trình CI/CD trong `.github/workflows/deploy.yml` sẽ tự động kích hoạt, build mã nguồn và xuất bản trang web lên Internet dạng:
   👉 **`https://<username>.github.io/<ten-repo>/`**

---

## 🛠️ CẤU HÌNH CLOUD DATABASE (TÙY CHỌN BỔ SUNG)

Hiện tại dự án đang chạy **chế độ Offline/Local Runtime hoàn chỉnh 100%** (lưu dữ liệu an toàn trên trình duyệt, có sẵn đầy đủ bài mẫu, duyệt bài, thêm-sửa-xóa hoạt động trơn tru).

Nếu muốn kết nối cơ sở dữ liệu dùng chung trên đám mây giữa nhiều người dùng:
- Tham khảo tài liệu chi tiết tại file: **`HD-SETUP-SUPABASE-CLOUDINARY.md`**.
- Thêm 2 Secrets trong **Settings → Secrets and variables → Actions** trên GitHub:
  + `PUBLIC_SUPABASE_URL`: Đường dẫn URL dự án Supabase.
  + `PUBLIC_SUPABASE_ANON_KEY`: Khóa công khai anon key của Supabase.

---

## 📂 CẤU TRÚC THƯ MỤC CHÍNH

```
DTN-HCM/
├── .github/workflows/       # Tự động hóa CI/CD deploy GitHub Pages & ping Supabase
│   ├── deploy.yml           # Tự động build và xuất bản khi push code
│   └── nightly.yml          # Lịch build đêm tự động
├── public/
│   ├── images/              # Kho tư liệu ảnh gốc Thời Hoa Lửa & Đề án Thành Đoàn
│   │   ├── hero-official.jpg # Ảnh hào hùng chính thức cờ Tổ quốc & Bác Hồ
│   │   └── thoi-hoa-lua/    # Hơn 50+ tư liệu ảnh lịch sử quý giá
│   ├── manifest.webmanifest # Cấu hình cài đặt ứng dụng PWA trên Android/iOS
│   └── sw.js                # Service Worker lưu trữ offline
├── src/
│   ├── components/
│   │   ├── admin/           # Hàng đợi kiểm duyệt Ban Biên tập Thành Đoàn
│   │   ├── common/          # Header, Auth, PWA prompt, Ember sparks
│   │   ├── home/            # Timeline GSAP, Bảng xếp hạng thi đua 37 TDP
│   │   ├── map/             # Bản đồ Việt Nam SVG tương tác (Hoàng Sa - Trường Sa)
│   │   ├── search/          # Thanh tìm kiếm thời gian thực
│   │   └── story/           # Form đăng bài, Facebook grid, chi tiết, thư viện
│   ├── layouts/             # RootLayout chuẩn Enterprise (Slate-50 sáng trong)
│   ├── lib/                 # Quản lý storage dữ liệu CRUD, session tác giả
│   └── pages/               # Các trang giao diện (Trang chủ, Thư viện, Bản đồ...)
├── astro.config.mjs         # Cấu hình xuất bản tĩnh Astro SSG
└── package.json             # Danh mục thư viện & dependencies
```

---

## 🎖️ BÀN GIAO VẬN HÀNH

Dự án đã sẵn sàng bàn giao cho **Ban Tuyên giáo Thành Đoàn TP. Hồ Chí Minh** và **Ủy ban Nhân dân / Ban Điều hành 37 Tổ Dân Phố Phường Xuân Hương (TP. Đà Lạt)** để triển khai rộng rãi cho cán bộ, đoàn viên, thanh niên và nhân dân cả nước.

