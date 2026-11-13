import { useState, useRef, useEffect } from 'react';
import FacebookImageGrid from '@/components/story/FacebookImageGrid';
import { Upload, Image as ImageIcon, Clipboard, FolderArchive, Plus } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

const ARCHIVE_PRESETS = [
  { label: 'Thời hoa lửa - Bác Hồ & Thanh niên', url: '/images/thoi-hoa-lua-hero.jpg' },
  { label: 'Chiến sĩ gìn giữ Trường Sa', url: '/images/truong-sa-chu-quyen.jpg' },
  { label: 'Chiến dịch Điện Biên Phủ 1954', url: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg' },
  { label: 'Hà Nội 12 ngày đêm 1972', url: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg' },
  { label: 'Mẹ tiễn con ra trận', url: '/images/thoi-hoa-lua/story-me-tien-con-ra-tran.jpg' },
  { label: 'Những lá thư thời hoa lửa', url: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg' },
  { label: 'Đại tướng Võ Nguyên Giáp', url: '/images/thoi-hoa-lua/vna-potal-chan-dung-dai-tuong-vo-nguyen-giap-184218511-16-3-52.jpg' },
  { label: 'Đoàn quân giải phóng 1975', url: '/images/thoi-hoa-lua/timeline-1975.jpg' },
  { label: 'Kháng chiến cứu quốc kiên cường', url: '/images/thoi-hoa-lua/cat-khang-chien.jpg' },
  { label: 'Thanh niên xung phong Rừng Sác', url: '/images/thoi-hoa-lua/cat-bien-gioi.jpg' },
  { label: 'Mẹ Việt Nam Anh Hùng', url: '/images/thoi-hoa-lua/cat-me-vnah.jpg' },
  { label: 'Biển đảo quê hương thiêng liêng', url: '/images/thoi-hoa-lua/cat-bien-dao.jpg' },
  { label: 'Chiến trường Thành Cổ Quảng Trị', url: '/images/thoi-hoa-lua/map-badge-quangtri.jpg' },
  { label: 'Bác Hồ với các cháu thanh thiếu nhi', url: '/images/thoi-hoa-lua/10-5-2015hochiminh.jpg' },
];

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploadBox({ images, onChange, maxImages = 10 }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý nén ảnh trên Canvas thành WebP/JPEG nhẹ gọn, chạy mượt mà trên browser
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            // Nén chất lượng 82% WebP hoặc JPEG
            const dataUrl = canvas.toDataURL('image/webp', 0.82);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newImgs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (images.length + newImgs.length >= maxImages) break;
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const compressed = await processImageFile(file);
        newImgs.push(compressed);
      }
    }
    if (newImgs.length > 0) {
      onChange([...images, ...newImgs]);
    }
  };

  // LẮNG NGHE SỰ KIỆN PASTE (Ctrl+V) TỪ BỘ NHỚ TẠM
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const items = clipboardData.items;
      const pastedFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        e.preventDefault();
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 3000);

        const newImgs: string[] = [];
        for (const file of pastedFiles) {
          if (images.length + newImgs.length >= maxImages) break;
          const compressed = await processImageFile(file);
          newImgs.push(compressed);
        }
        if (newImgs.length > 0) {
          onChange([...images, ...newImgs]);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [images, maxImages, onChange]);

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddArchive = (url: string) => {
    if (images.includes(url)) return;
    if (images.length >= maxImages) {
      alert(`Đã đạt giới hạn tối đa ${maxImages} hình ảnh cho một bài viết.`);
      return;
    }
    onChange([...images, url]);
  };

  return (
    <div className="space-y-3">
      {/* Thông báo khi bấm Ctrl+V thành công */}
      {pasteNotice && (
        <div className="bg-green-50 border border-green-300 text-green-900 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce">
          <Clipboard className="w-4 h-4 text-green-600" />
          <span><strong>Đã dán ảnh thành công!</strong> Ảnh từ bộ nhớ tạm (Ctrl+V) đã được thêm vào bài viết.</span>
        </div>
      )}

      {/* Hiển thị Album ảnh dạng Facebook Collage nếu đã có ảnh */}
      {images.length > 0 && (
        <div className="border border-slate-200 rounded-2xl p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 px-1">
            <span className="font-bold text-slate-800">
              📸 Album đính kèm ({images.length}/{maxImages} ảnh)
            </span>
            <span className="text-[11px] text-slate-400">
              Bấm ảnh để phóng to • Bấm ✕ để gỡ
            </span>
          </div>

          <FacebookImageGrid
            images={images}
            isEditable={true}
            onRemove={handleRemove}
          />
        </div>
      )}

      {/* VÙNG KÉO THẢ & NÚT CHỌN ẢNH PHONG CÁCH FACEBOOK */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
          isDragging
            ? 'border-doan-700 bg-doan-50/80 scale-[1.01]'
            : 'border-slate-300 hover:border-doan-600 bg-slate-50/60 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-doan-700 to-redflag-700 text-white flex items-center justify-center shadow-md">
            <Upload className="w-6 h-6 text-gold-300" />
          </div>

          <div className="text-center sm:text-left">
            <div className="text-sm font-bold text-slate-800">
              Chọn ảnh từ máy, kéo thả hoặc <span className="text-redflag-700 underline font-black">dán ảnh (Ctrl+V)</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ PNG, JPG, WebP. Tự động tối ưu dung lượng và ghép lưới Facebook Collage.
            </div>
          </div>
        </div>

        {/* Các nút hành động tải ảnh */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 pt-3 border-t border-slate-200/80">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-doan-800 hover:bg-doan-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <ImageIcon className="w-4 h-4 text-gold-300" />
            <span>Tải ảnh từ máy tính / Điện thoại</span>
          </button>

          <button
            type="button"
            onClick={() => setShowArchive(!showArchive)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors"
          >
            <FolderArchive className="w-4 h-4 text-amber-700" />
            <span>{showArchive ? 'Đóng kho tư liệu' : 'Chọn từ Kho ảnh Thời Hoa Lửa (56+ ảnh)'}</span>
          </button>
        </div>

        {/* Mẹo sử dụng phím tắt Ctrl+V */}
        <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Clipboard className="w-3.5 h-3.5 text-slate-400" />
          <span>Mẹo: Bạn có thể sao chép bất kỳ ảnh nào trên mạng hoặc chụp màn hình rồi bấm <strong>Ctrl + V</strong> để dán trực tiếp.</span>
        </div>
      </div>

      {/* KHO ẢNH TƯ LIỆU LỊCH SỬ THỜI HOA LỬA SẴN CÓ */}
      {showArchive && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg animate-in fade-in space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-doan-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>★</span>
              <span>Kho tư liệu hình ảnh lịch sử chính thống</span>
            </span>
            <span className="text-[11px] text-slate-400">Nhấp vào ảnh để thêm vào bài viết</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 max-h-72 overflow-y-auto p-1">
            {ARCHIVE_PRESETS.map((p) => {
              const isSelected = images.includes(p.url);
              return (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handleAddArchive(p.url)}
                  className={`group relative rounded-xl overflow-hidden border-2 text-left h-24 transition-all ${
                    isSelected
                      ? 'border-green-600 ring-2 ring-green-500 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 hover:border-gold-500 hover:shadow-md'
                  }`}
                  disabled={isSelected}
                  title={p.label}
                >
                  <img src={resolveImageUrl(p.url)} alt={p.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-1 text-[10px] font-bold text-white truncate leading-tight">
                    {p.label}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-green-950/50 flex items-center justify-center text-white text-xs font-bold">
                      ✓ Đã chọn
                    </div>
                  )}
                  {!isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
