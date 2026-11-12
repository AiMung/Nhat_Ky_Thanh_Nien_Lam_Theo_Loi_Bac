import { useState, useEffect } from 'react';
import { withBase } from '@/lib/utils';
import { BookMarked } from 'lucide-react';
import { getFavoriteStoryIds } from '@/lib/storage';

export default function UserAuthNav() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateFavs = () => {
      const favs = getFavoriteStoryIds();
      setFavCount(favs.length);
    };
    updateFavs();
    window.addEventListener('favorites-changed', updateFavs);
    return () => window.removeEventListener('favorites-changed', updateFavs);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Huy hiệu chế độ Độc giả Phường Xuân Hương — Đà Lạt */}
      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-2xs">
        <span className="text-amber-600">★</span>
        <span>Độc giả P. Xuân Hương — Đà Lạt</span>
      </div>

      {/* Nút Xem bài viết đã lưu */}
      <a
        href={withBase('/thu-vien?fav=true')}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-red-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
        title="Danh sách bài viết bạn đã lưu"
      >
        <BookMarked className="w-4 h-4 text-red-600" />
        <span className="hidden md:inline">Đã lưu</span>
        {favCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
            {favCount}
          </span>
        )}
      </a>
    </div>
  );
}
