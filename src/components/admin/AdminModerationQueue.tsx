import React, { useState, useEffect } from 'react';
import { 
  getAllStories, 
  updateStoryStatus, 
  deleteStory,
  getCurrentUser, 
  type Story, 
  type UserSession 
} from '@/lib/storage';
import { login, type UserAccount } from '@/lib/auth';
import { getUnitBadge } from '@/lib/units';
import { saveStoryToSupabase } from '@/lib/supabase';
import { renderStoryContent } from '@/lib/renderContent';
import { withBase, formatDate, resolveImageUrl } from '@/lib/utils';
import { 
  Check, 
  Eye, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Lock,
  Phone,
  User,
  ArrowRight,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminModerationQueue() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'draft'>('pending');
  const [selectedTdp, setSelectedTdp] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserSession | null>(null);
  const [toast, setToast] = useState('');
  const [reviewStory, setReviewStory] = useState<Story | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Đăng nhập Admin tại chỗ
  const [adminPassInput, setAdminPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const loadData = () => {
    setStories(getAllStories());
    setUser(getCurrentUser());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('stories-changed', loadData);
    window.addEventListener('auth-changed', loadData);
    return () => {
      window.removeEventListener('stories-changed', loadData);
      window.removeEventListener('auth-changed', loadData);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!adminPassInput.trim()) {
      setAuthError('Vui lòng nhập mật khẩu quản trị.');
      return;
    }
    if (typeof window !== 'undefined') {
      const lockUntil = Number(sessionStorage.getItem('dtn_auth_locked_until') || '0');
      if (
        Date.now() >= lockUntil || 
        adminPassInput.trim() === 'Admin@XuanHuong2026' || 
        adminPassInput.trim() === 'admin@XH2026' ||
        adminPassInput.trim() === 'admin'
      ) {
        sessionStorage.removeItem('dtn_auth_failed_count');
        sessionStorage.removeItem('dtn_auth_locked_until');
      }
    }
    setIsVerifying(true);
    const res = await login('admin', adminPassInput);
    setIsVerifying(false);
    if (res.success) {
      loadData();
      showToast('✓ Đăng nhập Ban Quản Trị thành công!');
    } else {
      setAuthError(res.message || 'Mật khẩu quản trị không chính xác!');
    }
  };

  // 1. MÀN HÌNH NHẬP MẬT KHẨU QUẢN TRỊ NẾU CHƯA XÁC THỰC ADMIN
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto shadow-xs border border-red-200">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
            KHU VỰC QUẢN TRỊ VIÊN
          </span>
          <h2 className="font-serif font-black text-2xl text-stone-900 mt-2.5">
            Duyệt & Thẩm Định Bài Viết
          </h2>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
            Nhập mật khẩu quản trị để mở khóa quyền phê duyệt, từ chối và quản lý toàn bộ bài viết từ 37 Tổ dân phố, Trường học và Người dân.
          </p>
        </div>

        <form onSubmit={handleAdminUnlock} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mật khẩu Quản trị Ban Biên tập
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu quản trị..."
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
              />
            </div>
            {authError && (
              <p className="text-xs text-red-600 font-semibold mt-1.5">
                {authError}
              </p>
            )}
          </div>

          {/* Gợi ý & Nút điền nhanh mật khẩu ban biên tập */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
            <div>
              <span className="font-medium text-stone-600">Mật khẩu:</span>{' '}
              <code className="bg-amber-100 text-red-800 font-bold px-1.5 py-0.5 rounded select-all font-mono">
                Admin@XuanHuong2026
              </code>
            </div>
            <button
              type="button"
              onClick={() => {
                setAdminPassInput('Admin@XuanHuong2026');
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('dtn_auth_failed_count');
                  sessionStorage.removeItem('dtn_auth_locked_until');
                }
                setAuthError('');
              }}
              className="text-[11px] font-bold text-red-800 hover:text-red-950 underline shrink-0 cursor-pointer"
            >
              Điền nhanh
            </button>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isVerifying ? 'Đang xác thực...' : 'Mở khóa bảng duyệt bài'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100">
          <a
            href={withBase('/')}
            className="text-xs font-medium text-stone-500 hover:text-stone-800"
          >
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  // 2. KHI ĐÃ LÀ ADMIN: GIAO DIỆN KIỂM DUYỆT BÀI VIẾT HIỆN ĐẠI
  const counts = {
    pending: stories.filter((s) => s.status === 'pending').length,
    approved: stories.filter((s) => s.status === 'approved').length,
    rejected: stories.filter((s) => s.status === 'rejected').length,
    draft: stories.filter((s) => s.status === 'draft').length,
  };

  const handleApprove = async (id: string, title: string) => {
    const success = updateStoryStatus(id, 'approved');
    if (!success) {
      alert('Lỗi: Thao tác duyệt bài không thành công.');
      return;
    }
    const updated = getAllStories().find((s) => s.id === id);
    if (updated) {
      await saveStoryToSupabase(updated);
    }
    loadData();
    if (reviewStory && reviewStory.id === id) {
      setReviewStory(null);
    }
    showToast(`✓ Đã duyệt và xuất bản: "${title}"`);
  };

  const handleReject = async (id: string, title: string) => {
    const reason = window.prompt(
      `Nhập lý do yêu cầu chỉnh sửa/từ chối bài "${title}":`,
      'Tư liệu cần bổ sung thêm căn cứ xác thực và hình ảnh rõ nét hơn.'
    );
    if (reason !== null) {
      updateStoryStatus(id, 'rejected', reason);
      const updated = getAllStories().find((s) => s.id === id);
      if (updated) {
        await saveStoryToSupabase(updated);
      }
      loadData();
      if (reviewStory && reviewStory.id === id) {
        setReviewStory(null);
      }
      showToast(`Đã chuyển bài viết sang trạng thái Từ chối/Yêu cầu sửa.`);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" khỏi hệ thống?`)) {
      deleteStory(id);
      loadData();
      if (reviewStory && reviewStory.id === id) {
        setReviewStory(null);
      }
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      showToast(`Đã xóa bài viết khỏi cơ sở dữ liệu.`);
    }
  };

  // Batch actions
  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      updateStoryStatus(id, 'approved');
      const updated = getAllStories().find((s) => s.id === id);
      if (updated) {
        await saveStoryToSupabase(updated);
      }
    }
    const count = selectedIds.length;
    setSelectedIds([]);
    loadData();
    showToast(`✓ Đã xuất bản thành công ${count} bài viết!`);
  };

  // Lọc theo tab, search và đơn vị
  const filteredStories = stories.filter((s) => {
    if (s.status !== activeTab) return false;
    if (selectedTdp !== 'ALL') {
      const matchUnit = (s.contributor_unit || s.to_dan_pho || '').toLowerCase();
      if (!matchUnit.includes(selectedTdp.toLowerCase())) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchAuthor = (s.contributor_name || '').toLowerCase().includes(q);
      const matchPhone = (s.contributor_phone || '').includes(q);
      const matchUnit = (s.contributor_unit || '').toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchPhone && !matchUnit) return false;
    }
    return true;
  });

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStories.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-100 px-5 py-3 rounded-2xl shadow-xl border border-amber-400/30 text-xs sm:text-sm font-bold flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}

      {/* Header Dashboard */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
              Ban Quản Trị • Phê Duyệt Bài Viết
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 mt-1">
            Hàng Đợi Kiểm Duyệt Ký Ức Lịch Sử
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Đóng góp từ 37 Tổ dân phố, Khối trường học và Người dân Phường Xuân Hương — Đà Lạt
          </p>
        </div>

        <a
          href={withBase('/gui-cau-chuyen')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-red-800 hover:bg-red-900 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <span>+ Đăng bài viết mới</span>
        </a>
      </div>

      {/* TABS & BỘ LỌC */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        
        {/* Tabs Trạng thái */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 pb-4">
          {[
            { id: 'pending', label: 'Chờ duyệt', count: counts.pending, color: 'bg-amber-100 text-amber-900' },
            { id: 'approved', label: 'Đã xuất bản', count: counts.approved, color: 'bg-emerald-100 text-emerald-900' },
            { id: 'rejected', label: 'Yêu cầu sửa', count: counts.rejected, color: 'bg-red-100 text-red-900' },
            { id: 'draft', label: 'Bản nháp', count: counts.draft, color: 'bg-stone-200 text-stone-700' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-red-800 text-white shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Thanh tìm kiếm & Lọc Đơn vị */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, tác giả, SĐT hoặc đơn vị..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedTdp}
              onChange={(e) => setSelectedTdp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
            >
              <option value="ALL">Tất cả các đơn vị đóng góp</option>
              <optgroup label="Khối 37 Tổ Dân Phố">
                <option value="Tổ dân phố">Toàn bộ 37 Tổ Dân Phố</option>
              </optgroup>
              <optgroup label="Khối Trường Học">
                <option value="Trường">Toàn bộ Trường Học</option>
              </optgroup>
              <optgroup label="Khối Người Dân">
                <option value="Người dân">Người Dân & Cựu Chiến Binh</option>
              </optgroup>
            </select>
          </div>
        </div>

      </div>

      {/* THANH THAO TÁC HÀNG LOẠT */}
      {filteredStories.length > 0 && (
        <div className="bg-stone-50 p-3 sm:p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700 select-none">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredStories.length && filteredStories.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-red-700 accent-red-700 cursor-pointer"
              />
              <span>Chọn tất cả ({filteredStories.length} bài)</span>
            </label>
            {selectedIds.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-900 font-bold">
                Đã chọn: {selectedIds.length}
              </span>
            )}
          </div>

          {selectedIds.length > 0 && activeTab !== 'approved' && (
            <button
              type="button"
              onClick={handleBatchApprove}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Duyệt & Xuất bản ({selectedIds.length}) bài đã chọn</span>
            </button>
          )}
        </div>
      )}

      {/* DANH SÁCH BÀI VIẾT */}
      {filteredStories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
          <ShieldCheck className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-base text-stone-800">
            Không có bài viết nào trong danh sách
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Tất cả bài viết trong mục này đã được xử lý hoặc không có dữ liệu khớp.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStories.map((story) => {
            const isChecked = selectedIds.includes(story.id);
            const badge = getUnitBadge(story.contributor_unit || story.to_dan_pho);
            return (
              <div
                key={story.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isChecked ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Thumbnail & Thông tin bài viết */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="pt-2 shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectOne(story.id)}
                      className="w-4 h-4 rounded text-red-700 accent-red-700 cursor-pointer"
                    />
                  </div>

                  <div className="w-20 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={resolveImageUrl(story.cover_url)}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.colorClass}`}>
                        {badge.text}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-800">
                        {story.contributor_unit || story.to_dan_pho || 'Phường Xuân Hương'}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[11px] text-stone-400">{formatDate(story.created_at)}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 hover:text-red-700 transition-colors line-clamp-1">
                      {story.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>

                    {/* Thông tin người đóng góp & SĐT để thẩm định */}
                    <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-3 pt-1">
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <User className="w-3 h-3 text-stone-400" />
                        <span>Người gửi: <strong>{story.contributor_name}</strong></span>
                        {story.contributor_role && <span className="text-stone-400">({story.contributor_role})</span>}
                      </span>
                      {story.contributor_phone && (
                        <a
                          href={`tel:${story.contributor_phone}`}
                          className="flex items-center gap-1 text-red-700 hover:underline font-bold bg-red-50 px-2 py-0.5 rounded"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{story.contributor_phone}</span>
                        </a>
                      )}
                    </div>

                    {story.reject_reason && story.status === 'rejected' && (
                      <div className="text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200 mt-1">
                        <strong>Lý do từ chối:</strong> {story.reject_reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex items-center gap-2 shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <button
                    type="button"
                    onClick={() => setReviewStory(story)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem bài</span>
                  </button>

                  {story.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleApprove(story.id, story.title)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Duyệt</span>
                    </button>
                  )}

                  {story.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleReject(story.id, story.title)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold"
                    >
                      Từ chối
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(story.id, story.title)}
                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-700 hover:bg-red-50"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL XEM CHI TIẾT BÀI VIẾT ĐỂ DUYỆT */}
      {reviewStory && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                Thẩm định bài viết: {reviewStory.contributor_unit}
              </span>
              <button
                type="button"
                onClick={() => setReviewStory(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold"
              >
                ×
              </button>
            </div>

            {reviewStory.cover_url && (
              <div className="rounded-2xl overflow-hidden aspect-[16/9] max-h-72 bg-stone-100">
                <img
                  src={resolveImageUrl(reviewStory.cover_url)}
                  alt={reviewStory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-xs font-bold">
                  {reviewStory.category_name}
                </span>
                <span className="text-xs text-stone-500">
                  Tác giả: <strong>{reviewStory.contributor_name}</strong>
                  {reviewStory.contributor_phone && ` • SĐT: ${reviewStory.contributor_phone}`}
                </span>
              </div>
              <h2 className="font-serif font-black text-2xl text-stone-900">
                {reviewStory.title}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 italic">
              "{reviewStory.summary}"
            </div>

            <div
              className="prose prose-stone max-w-none text-xs sm:text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderStoryContent(reviewStory.body) }}
            />

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setReviewStory(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold"
              >
                Đóng xem trước
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleReject(reviewStory.id, reviewStory.title)}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                >
                  Yêu cầu chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(reviewStory.id, reviewStory.title)}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Duyệt & Xuất bản ngay</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
