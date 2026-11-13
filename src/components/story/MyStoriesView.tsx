import React, { useState, useEffect } from 'react';
import { getAllStories, getCurrentUser, type Story, type UserSession } from '@/lib/storage';
import { withBase, formatDate } from '@/lib/utils';
import { PlusCircle, BookOpen, Clock, CheckCircle2, AlertCircle, Send, Trash2, Edit } from 'lucide-react';

export default function MyStoriesView() {
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);

  const loadData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const all = getAllStories();
    
    // Nếu là admin, hiển thị toàn bộ
    // Nếu là TDP, hiển thị các bài thuộc TDP đó
    if (currentUser.role === 'admin') {
      setStories(all);
    } else if (currentUser.role === 'tdp' && currentUser.to_dan_pho) {
      setStories(all.filter((s) => 
        s.to_dan_pho === currentUser.to_dan_pho ||
        s.contributor_unit?.includes(currentUser.to_dan_pho!) ||
        s.id.startsWith('user-story-')
      ));
    } else {
      setStories(all.filter((s) => s.id.startsWith('user-story-')));
    }
  };

  useEffect(() => {
    loadData();
    const handleAuth = () => loadData();
    const handleStories = () => loadData();
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('stories-changed', handleStories);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('stories-changed', handleStories);
    };
  }, []);

  if (!user) return null;

  const counts = {
    total: stories.length,
    approved: stories.filter((s) => s.status === 'approved').length,
    pending: stories.filter((s) => s.status === 'pending').length,
    draft: stories.filter((s) => s.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      {/* Header trang cá nhân / Tổ Dân Phố */}
      <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || '/images/thoi-hoa-lua/logo-doan.webp'}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-contain drop-shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                user.role === 'admin'
                  ? 'bg-red-100 text-red-900 border-red-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {user.role === 'admin' ? '★ Quản trị viên Ban Biên tập' : `★ Đại diện ${user.to_dan_pho || 'Tổ Dân Phố'}`}
              </span>
            </div>
            <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 mt-1">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user.unit}</p>
          </div>
        </div>

        <a
          href={withBase('/gui-cau-chuyen')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-amber-100 font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md transition-all hover:scale-105 shrink-0"
        >
          <Send className="w-4 h-4 text-amber-300" />
          <span>Gửi bài viết mới</span>
        </a>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-amber-200 text-center">
          <div className="text-2xl font-black text-slate-900 font-serif">{counts.total}</div>
          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Tổng bài viết</div>
        </div>
        <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-amber-200 text-center">
          <div className="text-2xl font-black text-emerald-700 font-serif">{counts.approved}</div>
          <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">Đã xuất bản</div>
        </div>
        <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-amber-200 text-center">
          <div className="text-2xl font-black text-amber-700 font-serif">{counts.pending}</div>
          <div className="text-[11px] text-amber-800 font-bold uppercase tracking-wider mt-0.5">Đang chờ duyệt</div>
        </div>
        <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-amber-200 text-center">
          <div className="text-2xl font-black text-slate-600 font-serif">{counts.draft}</div>
          <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Bản nháp</div>
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="space-y-3">
        {stories.length === 0 ? (
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200 p-12 text-center text-slate-500 text-xs sm:text-sm">
            Tổ Dân Phố chưa có bài viết nào. Hãy bấm <strong>"Gửi bài viết mới"</strong> để lưu giữ ký ức hào hùng của quê hương!
          </div>
        ) : (
          stories.map((s) => (
            <div
              key={s.id}
              className="bg-[#FAF6F0] rounded-2xl border border-amber-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-400 transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    s.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.status === 'approved' ? '✓ Đã xuất bản' : s.status === 'pending' ? '⏳ Đang chờ duyệt' : '📝 Bản nháp'}
                  </span>
                  <span className="text-[11px] text-slate-400">{formatDate(s.created_at)}</span>
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900 truncate">
                  <a href={withBase(`/truyen/chi-tiet?slug=${s.slug}`)} className="hover:text-red-700">
                    {s.title}
                  </a>
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{s.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={withBase(`/truyen/chi-tiet?slug=${s.slug}`)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-red-700 hover:text-red-700 text-xs font-bold transition-colors"
                >
                  Xem bài
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
