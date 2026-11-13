# HƯỚNG DẪN KẾT NỐI SUPABASE & CLOUDINARY
### DỰ ÁN «NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC»
**ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG XUÂN HƯƠNG — ĐÀ LẠT**

---

## 🌟 TỔNG QUAN KIẾN TRÚC HYBRID
Dự án được xây dựng với cơ chế **Hybrid Architecture** siêu việt:
1. **Mặc định (Offline/Local First):** Dữ liệu lưu trong LocalStorage của trình duyệt, nén ảnh tự động qua Canvas API. Cho phép tạo bài, duyệt bài, tìm kiếm, lọc 37 Tổ dân phố mà **không bắt buộc phải có tài khoản Supabase hay Cloudinary**.
2. **Khi cấu hình Supabase & Cloudinary:** Hệ thống tự động đẩy hình ảnh, video, audio lên CDN toàn cầu của Cloudinary và lưu trữ cơ sở dữ liệu PostgreSQL tại Supabase để dữ liệu đồng bộ cho tất cả các thiết bị và độc giả toàn quốc.

---

## PHẦN 1: HƯỚNG DẪN CẤU HÌNH SUPABASE (5 PHÚT)

### Bước 1: Tạo tài khoản & Project
1. Truy cập [https://supabase.com](https://supabase.com) và đăng ký miễn phí bằng tài khoản GitHub hoặc Email.
2. Bấm nút **"New Project"**.
3. Điền các thông tin:
   - **Name:** `dtn-xuanhuong-dalat`
   - **Database Password:** Đặt mật khẩu an toàn và lưu lại.
   - **Region:** Chọn `Southeast Asia (Singapore)` để có tốc độ truy cập nhanh nhất tại Việt Nam.
4. Bấm **"Create new project"** và chờ khoảng 1 - 2 phút để Supabase khởi tạo.

### Bước 2: Chạy mã SQL Schema
1. Ở thanh menu bên trái của Supabase, bấm vào biểu tượng **SQL Editor**.
2. Bấm **"New query"**.
3. Dán toàn bộ đoạn mã SQL bên dưới và bấm **"Run"** (nút màu xanh):

```sql
-- 1. BẢNG STORIES: Lưu trữ nhật ký và câu chuyện lịch sử
CREATE TABLE IF NOT EXISTS public.stories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  narrator_name TEXT,
  contributor_name TEXT,
  contributor_unit TEXT,
  to_dan_pho TEXT,
  summary TEXT,
  body TEXT NOT NULL,
  category_id TEXT,
  category_name TEXT,
  province_code TEXT,
  province_name TEXT,
  event_year INTEGER,
  period TEXT,
  media_type TEXT DEFAULT 'article',
  video_url TEXT,
  audio_url TEXT,
  cover_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  historical_characters JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  reject_reason TEXT,
  read_minutes INTEGER DEFAULT 3,
  likes_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG CHARACTERS: Lưu trữ nhân vật lịch sử
CREATE TABLE IF NOT EXISTS public.characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year TEXT,
  hometown TEXT,
  biography TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN TRUY CẬP
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved stories" ON public.stories
  FOR SELECT USING (true);

CREATE POLICY "Public insert new stories" ON public.stories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update stories" ON public.stories
  FOR UPDATE USING (true);

CREATE POLICY "Public read characters" ON public.characters
  FOR SELECT USING (true);

CREATE POLICY "Public insert characters" ON public.characters
  FOR INSERT WITH CHECK (true);
```

### Bước 3: Lấy API Key
1. Bấm vào biểu tượng **Project Settings** (bánh răng ở góc dưới bên trái).
2. Chọn mục **API**.
3. Sao chép 2 giá trị:
   - **Project URL:** Ví dụ `https://abcdefghijk.supabase.co`
   - **Project API Keys (anon public):** Chuỗi ký tự token dài.

---

## PHẦN 2: HƯỚNG DẪN CẤU HÌNH CLOUDINARY (3 PHÚT)

### Bước 1: Tạo tài khoản
1. Truy cập [https://cloudinary.com](https://cloudinary.com) và đăng ký miễn phí (Free tier cung cấp 25GB dung lượng).
2. Xác thực email và đăng nhập vào trang **Dashboard**.

### Bước 2: Lấy Cloud Name
Tại góc trên bên trái của trang **Dashboard**, bạn sẽ thấy mục:
- **Cloud Name:** Ví dụ `dtn-dalat` hoặc chuỗi tên bạn đã đặt.

### Bước 3: Tạo Unsigned Upload Preset
1. Bấm vào biểu tượng **Settings (Bánh răng)** ở góc dưới bên trái.
2. Chọn mục **Upload** ở menu bên trái.
3. Cuộn xuống phần **Upload presets**, bấm vào **Add upload preset**.
4. Thiết lập:
   - **Upload preset name:** Đặt tên, ví dụ `thoi_hoa_lua`
   - **Signing Mode:** Chuyển từ **Signed** sang **Unsigned** *(rất quan trọng để Client có thể upload trực tiếp không cần Backend server)*.
   - **Folder (tùy chọn):** `nhat-ky-bac-ho`
5. Bấm nút **Save** màu xanh ở góc trên bên phải.

---

## PHẦN 3: ĐIỀN VÀO FILE .ENV TRONG DỰ ÁN

Mở file `.env` (hoặc copy từ `.env.example`) tại thư mục gốc `G:\DTN-HCM` và điền:

```env
PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PUBLIC_CLOUDINARY_CLOUD_NAME=dtn-dalat
PUBLIC_CLOUDINARY_UPLOAD_PRESET=thoi_hoa_lua
```

Lưu file lại và khởi động lại server Astro:
```bash
npm run build
npm run dev
```

---

## 🚀 KIỂM TRA HOẠT ĐỘNG
1. Vào trang **Gửi câu chuyện mới** (`http://localhost:4321/gui-cau-chuyen`).
2. Chọn nhân vật, nhập tiêu đề và nội dung.
3. Bấm **+ Thêm ảnh** và chọn file ảnh từ máy tính:
   - Nếu đã điền Cloudinary: Ảnh sẽ được tải thẳng lên máy chủ Cloudinary CDN.
   - Nếu chưa điền: Ảnh được nén tự động và lưu trên trình duyệt mượt mà.
4. Bấm **Tạo bài & Gửi duyệt**: Bài viết sẽ xuất hiện trong trang **Quản trị duyệt bài** (`http://localhost:4321/quan-tri/duyet-bai`).
5. Bấm **Phê duyệt ngay**: Bài viết lập tức xuất hiện trên Trang chủ và Thư viện cho toàn bộ độc giả!

