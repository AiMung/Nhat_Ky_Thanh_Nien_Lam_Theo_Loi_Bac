/**
 * Module Tích hợp Cloudinary Upload Đẳng cấp
 * Cho phép tải trực tiếp hình ảnh/video từ trình duyệt lên CDN Cloudinary
 * Hỗ trợ chế độ Unsigned Upload Preset (không lộ Secret Key trên Client)
 * Tự động fallback nén Base64 mượt mà khi người dùng chưa điền Key Cloudinary.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export function getCloudinaryConfig(): CloudinaryConfig {
  const envCloud = (import.meta as any).env?.PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const envPreset = (import.meta as any).env?.PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

  // Có thể override qua localStorage để người dùng test trực tiếp trên UI mà không cần sửa code
  if (typeof window !== 'undefined') {
    const localCloud = localStorage.getItem('cfg_cloudinary_cloud_name');
    const localPreset = localStorage.getItem('cfg_cloudinary_upload_preset');
    if (localCloud && localPreset) {
      return { cloudName: localCloud, uploadPreset: localPreset };
    }
  }

  return {
    cloudName: envCloud || '',
    uploadPreset: envPreset || ''
  };
}

export function isCloudinaryConfigured(): boolean {
  const cfg = getCloudinaryConfig();
  return Boolean(cfg.cloudName && cfg.uploadPreset && cfg.cloudName !== 'placeholder-cloud');
}

/**
 * Tải file (File, Blob hoặc data URL) lên Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Blob | string,
  resourceType: 'image' | 'video' | 'auto' = 'image',
  onProgress?: (percent: number) => void
): Promise<{ url: string; secure_url: string; public_id?: string }> {
  const cfg = getCloudinaryConfig();

  // NẾU ĐÃ CẤU HÌNH CLOUDINARY: Gọi API Cloudinary chính thức
  if (isCloudinaryConfigured()) {
    const endpoint = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cfg.uploadPreset);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              url: data.url,
              secure_url: data.secure_url || data.url,
              public_id: data.public_id
            });
          } catch (e) {
            reject(new Error('Phản hồi từ Cloudinary không hợp lệ: ' + xhr.responseText));
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error?.message || 'Lỗi tải lên Cloudinary: ' + xhr.statusText));
          } catch {
            reject(new Error('Lỗi tải lên Cloudinary: HTTP ' + xhr.status));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Lỗi kết nối mạng khi tải lên Cloudinary'));
      xhr.send(formData);
    });
  }

  // FALLBACK TỰ ĐỘNG (KHI CHƯA CÓ KEY): Nén Base64 hoặc chuyển Blob URL dùng tức thì
  if (typeof file === 'string') {
    return { url: file, secure_url: file };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (onProgress) onProgress(100);
      resolve({ url: base64, secure_url: base64 });
    };
    reader.readAsDataURL(file);
  });
}
