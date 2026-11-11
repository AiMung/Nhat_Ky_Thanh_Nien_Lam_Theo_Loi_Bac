# HƯỚNG DẪN KẾT NỐI SUPABASE & CLOUDINARY MIỄN PHÍ (100% FREE TIER)
## ĐỀ ÁN: NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC - THÀNH ĐOÀN TP.HCM

Tài liệu này hướng dẫn chi tiết từng bước (kèm hình ảnh và vị trí nút bấm) để bạn thiết lập Cơ sở dữ liệu Postgres (Supabase) và Máy chủ lưu trữ ảnh tối ưu (Cloudinary) hoàn toàn miễn phí.

---

## PHẦN 1: THIẾT LẬP SUPABASE (DATABASE & AUTH & TÌM KIẾM KHÔNG DẤU)

Supabase cung cấp gói miễn phí 500MB Database, 50,000 người dùng hàng tháng và đầy đủ tính năng bảo mật Row Level Security (RLS).

### Bước 1: Đăng ký tài khoản & Tạo Project
1. Truy cập: [https://supabase.com](https://supabase.com) và bấm **Start your project** (đăng nhập nhanh bằng tài khoản GitHub hoặc Google).
2. Bấm **New project**:
   - **Name:** `nhat-ky-thanh-nien` (hoặc tên bạn chọn).
   - **Database Password:** Đặt mật khẩu mạnh và lưu lại (ví dụ: `ThanhDoan@2026!`).
   - **Region:** Chọn **Singapore (ap-southeast-1)** (đây là cụm máy chủ gần Việt Nam nhất, tốc độ phản hồi cực nhanh ~30ms).
   - **Pricing Plan:** Chọn **Free tier ($0/month)**.
3. Bấm **Create new project** và chờ khoảng 1-2 phút để hệ thống khởi tạo.

### Bước 2: Chạy Script Database có sẵn trong dự án
1. Ở menu bên trái giao diện Supabase, bấm vào biểu tượng **SQL Editor** (hình dấu `>_`).
2. Bấm nút **+ New query**.
3. Mở file mã nguồn trong máy bạn tại:
   `G:\DTN-HCM\supabase\migrations\20261111000000_init_schema.sql`
4. Copy toàn bộ nội dung file này, dán vào ô SQL Editor của Supabase.
5. Bấm nút **Run** (màu xanh lá ở góc dưới bên phải).
   > *Hệ thống sẽ tự động tạo bảng `stories`, `profiles`, `provinces`, kích hoạt tìm kiếm tiếng Việt không dấu `unaccent`, phân quyền bảo mật RLS và khởi tạo dữ liệu ban đầu.*

### Bước 3: Lấy API Key điền vào file `.env`
1. Ở menu bên trái, bấm vào biểu tượng **Project Settings** (bánh răng ở góc dưới) -> chọn **API**.
2. Tìm 2 giá trị sau:
   - **Project URL:** Dạng `https://xxxxxxxxxxxx.supabase.co`
   - **Project API keys -> `anon` `public`:** Chuỗi mã token bắt đầu bằng `eyJhbGciOi...`
3. Mở file `.env` tại thư mục dự án `G:\DTN-HCM\.env` (nếu chưa có, copy từ `.env.example`) và dán vào:
   ```env
   PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## PHẦN 2: THIẾT LẬP CLOUDINARY (LƯU TRỮ VÀ NÉN ẢNH TỰ ĐỘNG)

Cloudinary gói miễn phí cung cấp 25 Credits hàng tháng (~25,000 lần chuyển đổi ảnh WebP và 25GB lưu trữ), dư sức vận hành hàng chục ngàn câu chuyện.

### Bước 1: Đăng ký tài khoản Cloudinary
1. Truy cập: [https://cloudinary.com](https://cloudinary.com) và bấm **Sign Up for Free**.
2. Đăng ký bằng Google hoặc Email.
3. Khi vào trang Dashboard chính, bạn sẽ thấy mục **Product Environment Credentials**:
   - Copy giá trị **Cloud Name** (ví dụ: `dtn-hcm-media` hoặc `dyxxxxxxx`).

### Bước 2: Tạo Upload Preset (Chế độ Unsigned an toàn)
Để người dùng trên trang web có thể tải ảnh lên thẳng Cloudinary mà không cần lộ khóa bí mật:
1. Bấm vào biểu tượng **Settings** (bánh răng góc dưới bên trái).
2. Chọn thẻ **Upload** ở menu cài đặt.
3. Cuộn xuống mục **Upload presets**, bấm **Add upload preset**.
4. Cấu hình các mục sau:
   - **Upload preset name:** Đặt tên là `kyuc_unsigned`.
   - **Signing Mode:** Chuyển từ *Signed* sang **Unsigned**.
   - **Folder:** Nhập `ky-uc-thanh-nien/stories` (để gom ảnh gọn vào 1 thư mục).
5. (Tùy chọn tối ưu băng thông) Bấm thẻ **Upload Manipulations**:
   - **Incoming Transformation:** Chọn format **WebP**, Quality **auto:eco** (giúp ảnh nhẹ chỉ vài chục KB nhưng cực kỳ sắc nét).
6. Bấm **Save** (Lưu lại).

### Bước 3: Cập nhật vào `.env` của dự án
Mở file `G:\DTN-HCM\.env` và điền:
```env
PUBLIC_CLOUDINARY_CLOUD_NAME=cloud-name-cua-ban
PUBLIC_CLOUDINARY_UPLOAD_PRESET=kyuc_unsigned
```

---

## PHẦN 3: KIỂM TRA HOẠT ĐỘNG THỰC TẾ

1. Khởi động lại server dev:
   ```bash
   cd G:\DTN-HCM
   npm run dev
   ```
2. Mở trình duyệt tại `http://localhost:4321/gui-cau-chuyen`.
3. Tải lên một bức ảnh tư liệu mới và bấm gửi: Ảnh sẽ được nén tự động trên trình duyệt, đẩy thẳng lên Cloudinary và lưu bản ghi vào Supabase!

