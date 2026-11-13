import React, { useState } from 'react';
import { login, TDP_ACCOUNTS, ADMIN_ACCOUNT } from '@/lib/auth';
import { withBase } from '@/lib/utils';
import { ShieldCheck, UserCheck, Lock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginForm() {
  const [tab, setTab] = useState<'tdp' | 'admin'>('tdp');
  
  // Form TDP
  const [selectedTdpUser, setSelectedTdpUser] = useState(TDP_ACCOUNTS[2].username); // Default TDP Ánh Sáng
  const [tdpPassword, setTdpPassword] = useState('TDP03@XH');

  // Form Admin
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('Admin@XuanHuong2026');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleTdpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
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
    const res = login(adminUser, adminPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        window.location.href = withBase('/quan-tri/duyet-bai');
      }, 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Cập nhật gợi ý mật khẩu khi chọn TDP khác
  const handleSelectTdp = (username: string) => {
    setSelectedTdpUser(username);
    const acc = TDP_ACCOUNTS.find((a) => a.username === username);
    if (acc) {
      setTdpPassword(acc.passwordHash);
    }
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
          Phân quyền độc lập, bảo mật tuyệt đối dành cho 37 Tổ Dân Phố và Ban Biên tập Phường Xuân Hương.
        </p>
      </div>

      {/* Tabs chọn đối tượng */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200">
        <button
          type="button"
          onClick={() => { setTab('tdp'); setErrorMsg(''); setSuccessMsg(''); }}
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
          onClick={() => { setTab('admin'); setErrorMsg(''); setSuccessMsg(''); }}
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
                  {i + 1}. {acc.to_dan_pho} ({acc.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Mật khẩu xác thực <span className="text-red-600">*</span></span>
              <span className="text-[11px] text-slate-500 font-normal">Mặc định: TDP[số_tổ]@XH</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={tdpPassword}
                onChange={(e) => setTdpPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-amber-300 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
            💡 <strong>Quyền hạn Tổ Dân Phố:</strong> Đăng bài viết, quản lý bài viết của riêng Tổ Dân Phố mình. Bài gửi sẽ được gắn định danh chính chủ và đưa vào danh sách kiểm duyệt.
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
              placeholder="admin"
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
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Nhập mật khẩu Admin..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-amber-300 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-[11px] text-red-900 leading-relaxed">
            🛡️ <strong>Quyền hạn Ban Biên tập:</strong> Thẩm định, phê duyệt bài viết, yêu cầu chỉnh sửa, xuất bản lên thư viện, xóa bài viết và quản lý toàn bộ hệ thống.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-black text-amber-200 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform hover:scale-[1.01]"
          >
            Đăng nhập Quản trị Ban Biên tập →
          </button>
        </form>
      )}

      {/* DANH SÁCH TRA CỨU MẪU DÀNH CHO CÁN BỘ */}
      <div className="pt-4 border-t border-amber-200 text-center">
        <details className="text-left text-xs text-slate-600 bg-white/70 p-3 rounded-2xl border border-amber-200/80 cursor-pointer">
          <summary className="font-bold text-slate-800 hover:text-red-700 select-none">
            📋 Xem bảng tra cứu tài khoản 37 Tổ Dân Phố
          </summary>
          <div className="mt-3 max-h-48 overflow-y-auto space-y-1 font-mono text-[11px] pr-2 scrollbar-thin">
            {TDP_ACCOUNTS.map((acc, i) => (
              <div key={acc.username} className="flex justify-between py-1 border-b border-slate-100">
                <span>{i + 1}. {acc.to_dan_pho}:</span>
                <span className="text-red-800 font-bold">{acc.username} / {acc.passwordHash}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

    </div>
  );
}
