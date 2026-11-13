/**
 * Helper xử lý base path khi deploy trên GitHub Pages (sub-directory)
 * hoặc custom domain root path.
 */
export function withBase(path: string | null | undefined): string {
  if (!path) return '';
  // Nếu là link ảnh Cloudinary hoặc URL ngoài thì giữ nguyên
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (base === '/' || base === '') {
    return `/${cleanPath}`;
  }
  
  const trimmedBase = base.replace(/^\/+|\/+$/g, '');
  if (cleanPath.startsWith(trimmedBase)) {
    return `/${cleanPath}`;
  }
  
  return `/${trimmedBase}/${cleanPath}`;
}

/**
 * Phục hồi URL ảnh chuẩn cho mọi trường hợp (Local, Cloudinary, fallback)
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return withBase('/images/thoi-hoa-lua-hero.jpg');
  return withBase(url);
}

/**
 * Định dạng ngày tháng tiếng Việt chuẩn DD/MM/YYYY
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Chưa rõ';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Chưa rõ';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return 'Chưa rõ';
  }
}

/**
 * Tính số phút đọc dựa trên 220 từ / phút
 */
export function calculateReadMinutes(content: string): number {
  if (!content) return 1;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

