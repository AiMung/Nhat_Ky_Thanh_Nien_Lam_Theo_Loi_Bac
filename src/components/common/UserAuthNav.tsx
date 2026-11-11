import { useState, useEffect } from 'react';
import { getCurrentUser, switchUserRole, type UserSession } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import { User, ShieldCheck, LogOut, PlusCircle, CheckCircle } from 'lucide-react';

export default function UserAuthNav() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());

    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const handleRoleChange = (role: 'guest' | 'member' | 'admin') => {
    const updated = switchUserRole(role);
    setUser(updated);
    setMenuOpen(false);
    const msg = role === 'admin' 
      ? 'Đã chuyển sang quyền: Quản trị viên Ban Biên tập' 
      : role === 'member'
      ? 'Đã chuyển sang: Tài khoản Đoàn viên'
      : 'Đã chuyển sang chế độ Khách';
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  if (!user) return null;

  return (
    <div className="relative flex items-center gap-2 sm:gap-3">
      {/* Toast thông báo đổi quyền */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-doan-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-gold-400/50 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Nút Viết nhật ký mới */}
      <a
        href={withBase('/gui-cau-chuyen')}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-redflag-700 to-redflag-800 hover:from-redflag-800 hover:to-redflag-900 text-gold-200 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
      >
        <PlusCircle className="w-4 h-4 text-gold-400" />
        <span className="hidden sm:inline">Viết nhật ký mới</span>
        <span className="sm:hidden">Viết bài</span>
      </a>

      {/* Dropdown thông tin tài khoản */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Bấm để đổi vai trò (Đoàn viên / Admin)"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-doan-600"
          />
          <div className="hidden lg:block text-left text-xs">
            <div className="font-bold text-slate-800 leading-tight">{user.name}</div>
            <div className={`text-[10px] font-medium leading-none mt-0.5 ${user.role === 'admin' ? 'text-redflag-700 font-bold' : 'text-doan-700'}`}>
              {user.role === 'admin' ? '★ Ban Biên tập' : user.role === 'member' ? 'Đoàn viên' : 'Khách vãng lai'}
            </div>
          </div>
        </button>

        {/* Menu chọn vai trò nhanh để kiểm thử đầy đủ chức năng */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <p className="text-xs text-slate-500">Đang đăng nhập:</p>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.unit}</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Chuyển đổi vai trò để thử chức năng:
              </div>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                  user.role === 'admin' ? 'bg-redflag-50 text-redflag-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-redflag-700" />
                <div>
                  <div>Quản trị viên Ban Biên tập</div>
                  <div className="text-[10px] text-slate-400">Có quyền duyệt & gỡ bài viết</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleChange('member')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                  user.role === 'member' ? 'bg-doan-50 text-doan-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <User className="w-4 h-4 text-doan-700" />
                <div>
                  <div>Đoàn viên TP.HCM</div>
                  <div className="text-[10px] text-slate-400">Gửi câu chuyện, lưu yêu thích</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleChange('guest')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                  user.role === 'guest' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <div>Khách xem độc giả</div>
              </button>
            </div>

            {user.role === 'admin' && (
              <div className="p-2 border-t border-slate-100">
                <a
                  href={withBase('/quan-tri/duyet-bai')}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-redflag-800 hover:bg-redflag-900 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <span>Mở Hàng đợi duyệt bài</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
