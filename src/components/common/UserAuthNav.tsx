import React, { useState, useEffect } from 'react';
import { withBase } from '@/lib/utils';
import { BookMarked, Send, ShieldCheck, User } from 'lucide-react';
import { getFavoriteStoryIds, getAllStories } from '@/lib/storage';

export default function UserAuthNav() {
  const [favCount, setFavCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const favs = getFavoriteStoryIds();
      setFavCount(favs.length);

      const stories = getAllStories();
      const pending = stories.filter((s) => s.status === 'pending').length;
      setPendingCount(pending);
    };

    updateStats();
    window.addEventListener('favorites-changed', updateStats);
    window.addEventListener('stories-changed', updateStats);
    return () => {
      window.removeEventListener('favorites-changed', updateStats);
      window.removeEventListener('stories-changed', updateStats);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-2.5">
      
      {/* Tài khoản Phường Xuân Hương - Đà Lạt (Pill chuẩn Thời Hoa Lửa) */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-amber-300 text-slate-800 text-xs font-bold shadow-2xs">
        <User className="w-3.5 h-3.5 text-red-700" />
        <span className="hidden sm:inline">Phường Xuân Hương – Đà Lạt</span>
        <span className="sm:hidden">P. Xuân Hương</span>
      </div>

      {/* Nút Xem bài viết đã lưu */}
      <a
        href={withBase('/thu-vien?fav=true')}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-red-700 bg-white hover:bg-amber-50 border border-slate-200 transition-colors shadow-2xs"
        title="Danh sách bài viết bạn đã lưu"
      >
        <BookMarked className="w-4 h-4 text-red-600" />
        <span className="hidden lg:inline">Đã lưu</span>
        {favCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
            {favCount}
          </span>
        )}
      </a>

      {/* Nút Quản trị Duyệt bài (Admin Moderation Queue) */}
      <a
        href={withBase('/quan-tri/duyet-bai')}
        className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-red-700 bg-white hover:bg-amber-50 border border-slate-200 transition-colors shadow-2xs relative"
        title="Hàng đợi kiểm duyệt bài viết"
      >
        <ShieldCheck className="w-4 h-4 text-amber-700" />
        <span>Duyệt bài</span>
        {pendingCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
            {pendingCount}
          </span>
        )}
      </a>

      {/* NÚT ĐỎ GỬI CÂU CHUYỆN (Chuẩn hình ảnh người dùng tải lên) */}
      <a
        href={withBase('/gui-cau-chuyen')}
        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-amber-100 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform hover:scale-105"
      >
        <Send className="w-3.5 h-3.5 text-amber-300" />
        <span>Gửi câu chuyện</span>
      </a>

    </div>
  );
}
