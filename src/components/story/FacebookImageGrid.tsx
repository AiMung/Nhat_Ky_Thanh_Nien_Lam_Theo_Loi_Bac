import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface Props {
  images: string[];
  title?: string;
  onRemove?: (index: number) => void;
  isEditable?: boolean;
}

export default function FacebookImageGrid({ images, title = '', onRemove, isEditable = false }: Props) {
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const count = images.length;

  return (
    <div className="relative rounded-2xl overflow-hidden my-3 border border-slate-200/80 bg-slate-900/5 select-none">
      {/* 1 ẢNH: Hiển thị tràn viền sắc nét, ưu tiên giữ trọn khuôn mặt nhân chứng (object-top) */}
      {count === 1 && (
        <div className="relative group overflow-hidden max-h-[540px] bg-slate-950/5 flex items-center justify-center">
          <img
            src={images[0]}
            alt={title || 'Hình ảnh tư liệu'}
            className="w-full max-h-[540px] object-cover object-top group-hover:scale-[1.01] transition-transform duration-500 cursor-pointer"
            onClick={() => setPreviewIdx(0)}
          />
          <div 
            onClick={() => setPreviewIdx(0)}
            className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center cursor-pointer"
          >
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-90 transition-opacity drop-shadow" />
          </div>
          {isEditable && onRemove && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(0); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg z-10"
              title="Gỡ ảnh này"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 2 ẢNH: Chia 2 cột song song chuẩn Facebook */}
      {count === 2 && (
        <div className="grid grid-cols-2 gap-1.5 h-64 sm:h-80">
          {images.map((img, idx) => (
            <div key={idx} className="relative group overflow-hidden h-full bg-slate-900/10">
              <img
                src={img}
                alt={`${title} - ảnh ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                onClick={() => setPreviewIdx(idx)}
              />
              {isEditable && onRemove && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3 ẢNH: 1 ảnh lớn bên trái, 2 ảnh xếp tầng bên phải */}
      {count === 3 && (
        <div className="grid grid-cols-3 gap-1.5 h-72 sm:h-96">
          <div className="col-span-2 relative group overflow-hidden h-full">
            <img
              src={images[0]}
              alt={`${title} - ảnh 1`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => setPreviewIdx(0)}
            />
            {isEditable && onRemove && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(0); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
            {images.slice(1, 3).map((img, idx) => (
              <div key={idx + 1} className="relative group overflow-hidden h-full">
                <img
                  src={img}
                  alt={`${title} - ảnh ${idx + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setPreviewIdx(idx + 1)}
                />
                {isEditable && onRemove && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(idx + 1); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4+ ẢNH: Lưới Facebook Collage kèm huy hiệu +N */}
      {count >= 4 && (
        <div className="grid grid-cols-2 gap-1.5 h-80 sm:h-[420px]">
          {images.slice(0, 4).map((img, idx) => {
            const isLast = idx === 3 && count > 4;
            const extra = count - 4;
            return (
              <div key={idx} className="relative group overflow-hidden h-full">
                <img
                  src={img}
                  alt={`${title} - ảnh ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => setPreviewIdx(idx)}
                />
                {isLast && (
                  <div
                    onClick={() => setPreviewIdx(idx)}
                    className="absolute inset-0 bg-slate-950/65 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-slate-950/75 transition-colors"
                  >
                    <span className="font-serif font-black text-2xl sm:text-4xl text-gold-300 drop-shadow">
                      +{extra}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200 mt-1">
                      Xem thêm ảnh
                    </span>
                  </div>
                )}
                {isEditable && onRemove && !isLast && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL LIGHTBOX XEM FULL ẢNH */}
      {previewIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewIdx(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewIdx(null)}
              className="absolute -top-12 right-0 sm:right-2 text-white hover:text-gold-400 p-2 text-sm font-bold flex items-center gap-1"
            >
              <X className="w-6 h-6" />
              <span>Đóng</span>
            </button>
            <img
              src={images[previewIdx]}
              alt="Ảnh chi tiết"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
            {count > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto p-2" onClick={(e) => e.stopPropagation()}>
                {images.map((im, i) => (
                  <button
                    key={i}
                    onClick={() => setPreviewIdx(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      previewIdx === i ? 'border-gold-400 scale-105 ring-2 ring-gold-400' : 'border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={im} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

