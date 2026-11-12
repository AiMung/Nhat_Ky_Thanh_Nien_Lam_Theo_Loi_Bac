import { useState, useEffect } from 'react';
import { getCurrentUser, type UserSession } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import { Image as ImageIcon, Edit3, MapPin, Sparkles, PlusCircle } from 'lucide-react';

export default function SocialPostBar() {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuth = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', handleAuth);
    return () => window.removeEventListener('auth-changed', handleAuth);
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow max-w-4xl mx-auto -mt-8 relative z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User avatar */}
        <div className="relative shrink-0">
          <img
            src={user?.avatar || '/images/thoi-hoa-lua/logo-doan.webp'}
            alt={user?.name || 'Đoàn viên'}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-doan-700 shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-redflag-700 text-gold-300 flex items-center justify-center text-[9px] font-bold">
            ★
          </span>
        </div>

        {/* Fake input triggering post creation (Facebook style) */}
        <a
          href={withBase('/gui-cau-chuyen')}
          className="flex-1 bg-slate-100/80 hover:bg-slate-200/60 rounded-full px-5 py-3 text-slate-500 text-xs sm:text-sm font-medium transition-colors text-left flex items-center justify-between border border-slate-200/60 group cursor-pointer"
        >
          <span className="truncate">
            {user?.name ? `${user.name} ơi, hãy chia sẻ một trang nhật ký hào hùng hôm nay...` : 'Chia sẻ câu chuyện lịch sử hoặc việc tốt học tập Bác Hồ...'}
          </span>
          <Edit3 className="w-4 h-4 text-doan-700 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
        </a>

        {/* Nút gửi nhanh */}
        <a
          href={withBase('/gui-cau-chuyen')}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-redflag-700 to-doan-800 hover:from-redflag-800 hover:to-doan-900 text-gold-300 font-bold text-xs shadow transition-all transform hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng bài</span>
        </a>
      </div>

      {/* Dải nút đính kèm chuẩn Facebook */}
      <div className="flex items-center justify-between gap-1 pt-3.5 mt-3.5 border-t border-slate-100 text-xs font-semibold text-slate-600">
        <a
          href={withBase('/gui-cau-chuyen')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 hover:text-green-700"
        >
          <ImageIcon className="w-4 h-4 text-green-600" />
          <span className="hidden sm:inline">Ảnh / Paste Ctrl+V</span>
          <span className="sm:hidden">Ảnh</span>
        </a>

        <a
          href={withBase('/gui-cau-chuyen')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 hover:text-redflag-700"
        >
          <MapPin className="w-4 h-4 text-redflag-600" />
          <span className="hidden sm:inline">Gắn Địa chỉ Đỏ</span>
          <span className="sm:hidden">Địa chỉ</span>
        </a>

        <a
          href={withBase('/gui-cau-chuyen')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 hover:text-amber-700"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Học lời Bác dạy</span>
          <span className="sm:hidden">Lời Bác</span>
        </a>
      </div>
    </div>
  );
}

