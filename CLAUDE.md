# QUY TẮC PHÁT TRIỂN DỰ ÁN KÝ ỨC LỊCH SỬ (G:\DTN-HCM)

1. **Bảo mật RLS là tuyệt đối:** Bất kỳ bảng mới nào cũng phải bật Row Level Security (RLS). Không bao giờ commit `service_role` key hay secrets vào source code.
2. **Helper đường dẫn:** Tuyệt đối không dùng đường dẫn tuyệt đối bắt đầu bằng `/` đơn thuần nếu không bọc qua helper `withBase()` trong `src/lib/utils.ts` để tránh lỗi khi deploy GitHub Pages sub-path.
3. **Chống XSS:** Mọi nội dung Markdown do người dùng nhập trước khi render phải chạy qua `DOMPurify.sanitize()`.
4. **Tối ưu ảnh:** Ảnh gửi lên phải nén tại trình duyệt qua Canvas (max 1600px, WebP quality 0.8) trước khi upload Cloudinary.
5. **Chủ quyền quốc gia:** Bản đồ SVG Việt Nam phải luôn bảo đảm hiển thị đầy đủ, trang trọng hai quần đảo Hoàng Sa và Trường Sa.
6. **Kiểm thử PWA:** Mỗi thay đổi service worker hay manifest phải kiểm tra tính tương thích trên iOS Safari và Android Chrome.

