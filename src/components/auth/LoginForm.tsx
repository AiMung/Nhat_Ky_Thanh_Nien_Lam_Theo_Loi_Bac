import React, { useState } from 'react';
import { login, TDP_ACCOUNTS } from '@/lib/auth';
import { withBase } from '@/lib/utils';
import { ShieldCheck, UserCheck, Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [tab, setTab] = useState<'tdp' | 'admin'>('tdp');
  
  // Form TDP
  const [selectedTdpUser, setSelectedTdpUser] = useState(TDP_ACCOUNTS[0].username);
  const [tdpPassword, setTdpPassword] = useState('');
  const [showTdpPass, setShowTdpPass] = useState(false);

  // Form Admin
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleTdpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!tdpPassword.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu xác thực của Tổ Dân Phố.');
      return;
    }
    const res = login(selectedTdpUser, tdpPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        window.location.href = withBase('/gui-cau-chuyen');
      }, 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!adminUser.trim() || !adminPassword.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ tài khoản và mật khẩu quản trị.');
      return;
    }
    const res = login(adminUser.trim(), adminPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        window.location.href = withBase('/quan-tri/duyet-bai');
      }, 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSelectTdp = (username: string) => {
    setSelectedTdpUser(username);
    setTdpPassword('');
    setErrorMsg('');
  };

  return (
    <div className="max-w-xl mx-auto bg-[#FAF6F0] rounded-3xl border border-amber-300/80 p-6 sm:p-10 shadow-xl space-y-6">
      
      {/* Huy hiệu Đoàn & Tiêu đề */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-700 to-red-800 text-amber-300 font-serif font-black text-2xl flex items-center justify-center mx-auto shadow-md border border-amber-300/50">
          ★
        </div>
        <div className="text-[11px] font-bold text-red-800 uppercase tracking-widest">
          ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG XUÂN HƯƠNG — ĐÀ LẠT
        </div>
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Cổng Đăng Nhập Xác Thực
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          Hệ thống bảo mật xác thực nội bộ dành riêng cho 37 Tổ Dân Phố và Ban Biên tập Phường Xuân Hương.
        </p>
      </div>

      {/* Tabs chọn đối tượng */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200">
        <button
          type="button"
          onClick={() => { setTab('tdp'); setErrorMsg(''); setSuccessMsg(''); setTdpPassword(''); }}
          className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            tab === 'tdp'
              ? 'bg-red-700 text-white shadow-md'
              : 'text-slate-700 hover:text-red-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>37 Tổ Dân Phố</span>
        </button>

        <button
          type="button"
          onClick={() => { setTab('admin'); setErrorMsg(''); setSuccessMsg(''); setAdminPassword(''); }}
          className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            tab === 'admin'
              ? 'bg-red-700 text-white shadow-md'
              : 'text-slate-700 hover:text-red-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Ban Biên tập (Admin)</span>
        </button>
      </div>

      {/* Thông báo Lỗi / Thành công */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{successMsg} Đang chuyển hướng...</span>
        </div>
      )}

      {/* FORM 1: DÀNH CHO 37 TỔ DÂN PHỐ */}
      {tab === 'tdp' && (
        <form onSubmit={handleTdpLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Chọn Tổ Dân Phố của bạn <span className="text-red-600">*</span>
            </label>
            <select
              value={selectedTdpUser}
              onChange={(e) => handleSelectTdp(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-amber-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700/30"
            >
              {TDP_ACCOUNTS.map((acc, i) => (
                <option key={acc.username} value={acc.username}>
                  {i + 1}. {acc.to_dan_pho}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Mật khẩu xác thực Tổ Dân Phố <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showTdpPass ? 'text' : 'password'}
                required
                value={tdpPassword}
                onChange={(e) => setTdpPassword(e.target.value)}
                placeholder="Nhập mật khẩu an toàn..."
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white border border-amber-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
              <button
                type="button"
                onClick={() => setShowTdpPass(!showTdpPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showTdpPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showTdpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            💡 <strong>Quyền hạn Tổ Dân Phố:</strong> Đăng bài viết, quản lý bài viết của riêng Tổ Dân Phố mình. Bài gửi sẽ được gắn định danh chính chủ và chuyển vào danh sách chờ duyệt của Ban Biên tập.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-amber-100 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform hover:scale-[1.01]"
          >
            Đăng nhập Tổ Dân Phố →
          </button>
        </form>
      )}

      {/* FORM 2: DÀNH CHO BAN BIÊN TẬP (ADMIN) */}
      {tab === 'admin' && (
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Tài khoản Quản trị <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              placeholder="Nhập tài khoản Quản trị..."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-amber-300 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Mật khẩu Admin <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showAdminPass ? 'text' : 'password'}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Nhập mật khẩu Admin..."
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white border border-amber-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
              <button
                type="button"
                onClick={() => setShowAdminPass(!showAdminPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showAdminPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-[11px] text-red-900 leading-relaxed">
            🛡️ <strong>Quyền hạn Ban Biên tập:</strong> Thẩm định, phê duyệt bài viết, duyệt hàng loạt, yêu cầu chỉnh sửa, xuất bản lên thư viện, xóa bài viết và quản lý toàn bộ hệ thống.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-black text-amber-200 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform hover:scale-[1.01]"
          >
            Đăng nhập Quản trị Ban Biên tập →
          </button>
        </form>
      )}

      {/* KHỐI THÔNG TIN BẢO MẬT DOANH NGHIỆP / CƠ SỞ */}
      <div className="pt-4 border-t border-amber-200/80 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Hệ thống Bảo mật Xác thực Cơ sở</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
          Tài khoản và thông tin xác thực được quản lý tập trung và mã hóa an toàn. Cán bộ Tổ Dân Phố và Ban Biên tập vui lòng liên hệ Thường trực Đoàn Phường Xuân Hương để được cấp quyền hoặc cấp lại mật khẩu.
        </p>
      </div>

    </div>
  );
}

