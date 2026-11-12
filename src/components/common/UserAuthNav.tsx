import { useState, useEffect } from 'react';
import { getCurrentUser, switchUserRole, type UserSession } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import { User, ShieldCheck, LogOut, Plus, CheckCircle, ChevronDown } from 'lucide-react';

export default function UserAuthNav() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuthChange = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const handleRoleChange = (role: 'guest' | 'member' | 'admin') => {
    const updated = switchUserRole(role);
    setUser(updated);
    setMenuOpen(false);
    const msg = role === 'admin' 
      ? 'Đã chuyển sang: Quản trị viên Ban Biên tập' 
      : role === 'member'
      ? 'Đã chuyển sang: Tài khoản Đoàn viên'
      : 'Đã chuyển sang: Chế độ Khách';
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  if (!user) return null;

  return (
    <div className="relative flex items-center gap-2">
      {/* Toast thông báo đổi quyền */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Nút Kiểm duyệt cho Quản trị viên hoặc phím tắt */}
      {user.role === 'admin' && (
        <a
          href={withBase('/quan-tri/duyet-bai')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kiểm duyệt</span>
        </a>
      )}

      {/* Nút Viết nhật ký mới chuẩn Enterprise */}
      <a
        href={withBase('/gui-cau-chuyen')}
        className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Viết nhật ký</span>
        <span className="sm:hidden">Viết bài</span>
      </a>

      {/* User profile dropdown button */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Tài khoản cá nhân"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-300"
          />
          <div className="hidden md:block text-left text-xs pr-1">
            <div className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">{user.name}</div>
            <div className={`text-[10px] leading-none mt-0.5 ${user.role === 'admin' ? 'text-red-700 font-bold' : 'text-slate-500'}`}>
              {user.role === 'admin' ? '★ Ban Biên tập' : 'Đoàn viên'}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <p className="text-[11px] text-slate-400">Đang đăng nhập:</p>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.unit}</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Chuyển vai trò thử nghiệm:
              </div>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                  user.role === 'admin' ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-red-700" />
                <div>
                  <div>Quản trị viên Ban Biên tập</div>
                  <div className="text-[10px] text-slate-400">Duyệt, chỉnh sửa & gỡ bài viết</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleChange('member')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                  user.role === 'member' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <User className="w-4 h-4 text-blue-700" />
                <div>
                  <div>Đoàn viên TP.HCM</div>
                  <div className="text-[10px] text-slate-400">Gửi câu chuyện, đăng bài</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleChange('guest')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                  user.role === 'guest' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <div>Khách độc giả</div>
              </button>
            </div>

            <div className="p-2 border-t border-slate-100 space-y-1">
              <a
                href={withBase('/tai-khoan/truyen-cua-toi')}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <span>📖 Quản lý câu chuyện của tôi</span>
              </a>

              {user.role === 'admin' && (
                <a
                  href={withBase('/quan-tri/duyet-bai')}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <span>Mở Hàng đợi duyệt bài</span>
                  <span>→</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
