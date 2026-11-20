import React, { useState } from 'react';
import { login } from '@/lib/auth';
import { withBase } from '@/lib/utils';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, Send, CheckCircle2 } from 'lucide-react';

export default function LoginForm() {
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!adminPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu quản trị.');
      return;
    }
    setIsLoggingIn(true);
    const res = await login(adminUser.trim(), adminPassword);
    setIsLoggingIn(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        window.location.href = withBase('/quan-tri/duyet-bai');
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {/* Thông báo tính năng đóng góp mở */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <Send className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Bạn muốn gửi bài viết?</strong> Website hiện hỗ trợ gửi bài trực tiếp mà không cần tài khoản! Bất kỳ ai cũng có thể{' '}
          <a href={withBase('/gui-cau-chuyen')} className="text-red-700 font-bold underline">
            bấm vào đây để gửi bài ngay
          </a>.
        </div>
      </div>

      {/* Form Quản trị */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-black text-2xl text-stone-900">
            Ban Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-stone-500">
            Dành cho Ban Biên tập Đoàn Phường Xuân Hương kiểm duyệt và xuất bản câu chuyện.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Tài khoản quản trị
            </label>
            <input
              type="text"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-red-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mật khẩu quản trị
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-red-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập Ban Quản trị'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 text-center">
          <a
            href={withBase('/')}
            className="text-xs font-medium text-stone-500 hover:text-stone-800"
          >
            ← Quay lại trang chủ
          </a>
        </div>
      </div>

    </div>
  );
}
