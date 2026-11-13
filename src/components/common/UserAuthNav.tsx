import React, { useState, useEffect, useRef } from 'react';
import { withBase } from '@/lib/utils';
import { BookMarked, Send, ShieldCheck, User, LogOut, ChevronDown, Lock, FileText } from 'lucide-react';
import { getFavoriteStoryIds, getAllStories } from '@/lib/storage';
import { getCurrentSession, logout, type UserAccount } from '@/lib/auth';

export default function UserAuthNav() {
  const [user, setUser] = useState<UserAccount>(getCurrentSession());
  const [favCount, setFavCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateState = () => {
    setUser(getCurrentSession());
    setFavCount(getFavoriteStoryIds().length);
    const stories = getAllStories();
    setPendingCount(stories.filter((s) => s.status === 'pending').length);
  };

  useEffect(() => {
    updateState();
    window.addEventListener('favorites-changed', updateState);
    window.addEventListener('stories-changed', updateState);
    window.addEventListener('auth-changed', updateState);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('favorites-changed', updateState);
      window.removeEventListener('stories-changed', updateState);
      window.removeEventListener('auth-changed', updateState);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    window.location.href = withBase('/');
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      
      {/* Nút Xem bài viết đã lưu (Bookmark) */}
      <a
        href={withBase('/thu-vien?fav=true')}
        className="inline-flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-red-700 bg-white hover:bg-amber-50 border border-amber-200/80 transition-colors shadow-2xs"
        title="Danh sách bài viết đã lưu"
      >
        <BookMarked className="w-4 h-4 text-red-600" />
        <span className="hidden xl:inline text-[11px]">Đã lưu</span>
        {favCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
            {favCount}
          </span>
        )}
      </a>

      {/* TRƯỜNG HỢP 1: KHÁCH VÃNG LAI (GUEST) */}
      {user.role === 'guest' ? (
        <a
          href={withBase('/tai-khoan/dang-nhap')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-white hover:bg-amber-100/70 border border-amber-300 text-slate-800 hover:text-red-800 text-xs font-bold shadow-2xs transition-colors"
        >
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Đăng nhập</span>
        </a>
      ) : (
        /* TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP (TDP HOẶC ADMIN) */
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-2xs ${
              user.role === 'admin'
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {user.role === 'admin' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-red-700 shrink-0" />
            ) : (
              <span className="text-amber-600">★</span>
            )}
            <span className="max-w-[120px] sm:max-w-[160px] truncate">
              {user.role === 'admin' ? 'Ban Biên tập' : user.to_dan_pho || user.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {/* Dropdown Menu Tài khoản */}
          {showDropdown && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl border border-amber-200/90 shadow-xl py-1.5 z-50 animate-scale-up text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">{user.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                  Quyền: {user.role === 'admin' ? 'Quản trị Ban Biên tập' : 'Đại diện Tổ Dân Phố'}
                </div>
              </div>

              {user.role === 'admin' ? (
                <>
                  <a
                    href={withBase('/quan-tri/duyet-bai')}
                    className="flex items-center justify-between px-3 py-2 hover:bg-amber-50 text-slate-700 hover:text-red-700 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                      <span>Hàng đợi kiểm duyệt</span>
                    </span>
                    {pendingCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black">
                        {pendingCount}
                      </span>
                    )}
                  </a>
                  <a
                    href={withBase('/huong-dan-tich-hop')}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-amber-50 text-slate-700 hover:text-red-700 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Cấu hình Cloud & Database</span>
                  </a>
                </>
              ) : (
                <a
                  href={withBase('/tai-khoan/truyen-cua-toi')}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-amber-50 text-slate-700 hover:text-red-700 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-red-700" />
                  <span>Bài viết của Tổ Dân Phố</span>
                </a>
              )}

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-700 hover:bg-red-50 font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* NÚT DUYỆT BÀI NHANH (CHỈ HIỂN THỊ NẾU LÀ ADMIN) */}
      {user.role === 'admin' && (
        <a
          href={withBase('/quan-tri/duyet-bai')}
          className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors"
          title="Kiểm duyệt bài viết"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
          <span>Duyệt ({pendingCount})</span>
        </a>
      )}

      {/* NÚT GỬI CÂU CHUYỆN (DÀNH CHO TDP HOẶC ADMIN) */}
      <a
        href={withBase('/gui-cau-chuyen')}
        className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-amber-100 font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
      >
        <Send className="w-3 h-3 text-amber-300" />
        <span className="hidden sm:inline">Gửi câu chuyện</span>
        <span className="sm:hidden">Gửi bài</span>
      </a>

    </div>
  );
}
