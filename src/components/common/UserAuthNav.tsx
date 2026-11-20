import React, { useState, useEffect, useRef } from 'react';
import { withBase } from '@/lib/utils';
import { BookMarked, Send, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
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
    <div className="flex items-center gap-2 sm:gap-2.5">
      
      {/* 1. Nút Xem bài viết đã lưu (Bookmark) */}
      <a
        href={withBase('/thu-vien?fav=true')}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-red-700 bg-stone-100 hover:bg-stone-200 transition-colors"
        title="Danh sách bài viết đã lưu"
      >
        <BookMarked className="w-3.5 h-3.5 text-stone-500" />
        <span className="hidden md:inline text-[11px]">Đã lưu</span>
        {favCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {favCount}
          </span>
        )}
      </a>

      {/* 2. Ban Quản Trị / Duyệt bài */}
      {user.role === 'admin' ? (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-700 shrink-0" />
            <span className="hidden sm:inline">Ban Quản trị</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                {pendingCount}
              </span>
            )}
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-stone-200 shadow-xl py-1.5 z-50 text-xs animate-scale-up">
              <div className="px-3 py-2 border-b border-stone-100">
                <div className="font-bold text-stone-900">Ban Biên tập</div>
                <div className="text-[10px] text-stone-500">Quản trị & Phê duyệt bài</div>
              </div>
              <a
                href={withBase('/quan-tri/duyet-bai')}
                className="flex items-center justify-between px-3 py-2 hover:bg-stone-50 text-stone-700 hover:text-red-700 font-medium"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-700" />
                  <span>Duyệt bài viết</span>
                </span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </a>
              <div className="border-t border-stone-100 my-1"></div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-stone-600 hover:text-red-700 hover:bg-red-50 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Thoát quản trị</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <a
          href={withBase('/quan-tri/duyet-bai')}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          title="Dành cho Ban Biên tập kiểm duyệt bài"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span className="hidden lg:inline text-[11px]">Ban Quản trị</span>
        </a>
      )}

      {/* 3. NÚT GỬI BÀI VIẾT — AI CŨNG CÓ THỂ GỬI */}
      <a
        href={withBase('/gui-cau-chuyen')}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-full bg-red-800 hover:bg-red-900 text-amber-50 font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Send className="w-3.5 h-3.5 text-amber-300" />
        <span>Gửi bài viết</span>
      </a>

    </div>
  );
}
