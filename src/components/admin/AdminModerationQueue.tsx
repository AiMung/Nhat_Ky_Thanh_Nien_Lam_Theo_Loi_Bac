import React, { useState, useEffect } from 'react';
import { 
  getAllStories, 
  updateStoryStatus, 
  deleteStory,
  getCurrentUser, 
  type Story, 
  type UserSession 
} from '@/lib/storage';
import { saveStoryToSupabase } from '@/lib/supabase';
import { renderStoryContent } from '@/lib/renderContent';
import { withBase, formatDate, resolveImageUrl } from '@/lib/utils';
import { 
  Check, 
  Eye, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Lock
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

  // 1. KIỂM TRA BẢO MẬT: NẾU KHÔNG PHẢI ADMIN THÌ KHÓA CHẶT 100%
  if (user && user.role !== 'admin') {
    return (
      <div className="bg-[#FAF6F0] rounded-3xl border border-red-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-700 flex items-center justify-center mx-auto text-2xl font-black border border-red-300">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-black uppercase tracking-wider border border-red-200">
            TRUY CẬP BỊ TỪ CHỐI (403 FORBIDDEN)
          </span>
        </div>
        <h2 className="font-serif font-black text-2xl text-slate-900">
          Khu Vực Dành Riêng Cho Ban Biên Tập
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Bạn hiện đang truy cập với tư cách: <strong className="text-slate-800">{user.name}</strong> ({user.role === 'tdp' ? 'Tổ Dân Phố' : 'Khách vãng lai'}). Khu vực kiểm duyệt bài viết yêu cầu tài khoản Quản trị Ban Biên tập chính thức.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <a
            href={withBase('/tai-khoan/dang-nhap')}
            className="px-6 py-2.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            Đăng nhập Ban Biên tập →
          </a>
          <a
            href={withBase('/')}
            className="px-5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
          >
            Quay lại Trang chủ
          </a>
        </div>
      </div>
    );
  }

  // Hành động Duyệt bài
  const handleApprove = async (id: string, title: string) => {
    const success = updateStoryStatus(id, 'approved');
    if (!success) {
      alert('Bảo mật: Bạn không có quyền thực hiện thao tác duyệt bài!');
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
    showToast(`✓ Đã duyệt và xuất bản thành công: "${title}"`);
  };

  // Hành động Từ chối / Yêu cầu chỉnh sửa
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
      showToast(`Đã chuyển trạng thái sang Yêu cầu chỉnh sửa.`);
    }
  };

  // Xóa bài viết đơn lẻ
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

  // ================= THAO TÁC HÀNG LOẠT (BATCH MODERATION) =================
  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    let approvedCount = 0;
    for (const id of selectedIds) {
      const success = updateStoryStatus(id, 'approved');
      if (success) {
        approvedCount++;
        const updated = getAllStories().find((s) => s.id === id);
        if (updated) {
          await saveStoryToSupabase(updated);
        }
      }
    }
    setSelectedIds([]);
    loadData();
    showToast(`✓ Đã duyệt và xuất bản hàng loạt thành công ${approvedCount} bài viết!`);
  };

  const handleBatchReject = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    const reason = window.prompt(
      `Nhập lý do yêu cầu chỉnh sửa cho ${count} bài viết đã chọn:`,
      'Tư liệu cần bổ sung thêm căn cứ xác thực và hình ảnh rõ nét hơn.'
    );
    if (reason !== null) {
      for (const id of selectedIds) {
        updateStoryStatus(id, 'rejected', reason);
        const updated = getAllStories().find((s) => s.id === id);
        if (updated) {
          await saveStoryToSupabase(updated);
        }
      }
      setSelectedIds([]);
      loadData();
      showToast(`Đã chuyển ${count} bài viết sang trạng thái Yêu cầu chỉnh sửa.`);
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn ${count} bài viết đã chọn khỏi hệ thống?`)) {
      for (const id of selectedIds) {
        deleteStory(id);
      }
      setSelectedIds([]);
      loadData();
      showToast(`Đã xóa thành công ${count} bài viết khỏi hệ thống.`);
    }
  };

  // Đếm số lượng theo trạng thái
  const counts = {
    pending: stories.filter((s) => s.status === 'pending').length,
    approved: stories.filter((s) => s.status === 'approved').length,
    rejected: stories.filter((s) => s.status === 'rejected').length,
    draft: stories.filter((s) => s.status === 'draft').length
  };

  // Lọc dữ liệu
  const filteredStories = stories.filter((s) => {
    if (s.status !== activeTab) return false;
    if (selectedTdp !== 'ALL' && s.to_dan_pho !== selectedTdp) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchNarrator = s.narrator_name.toLowerCase().includes(q);
      const matchTdp = (s.to_dan_pho || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNarrator && !matchTdp) return false;
    }
    return true;
  });

  const allFilteredIds = filteredStories.map((s) => s.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Toast thông báo */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-emerald-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/60 flex items-center gap-2.5 font-bold text-xs sm:text-sm animate-fade-in">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* TABS & BỘ LỌC CHUẨN THỜI HOA LỬA */}
      <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
        
        {/* Hàng Tabs trạng thái */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'pending', label: 'Chờ duyệt', count: counts.pending, color: 'text-amber-700 bg-amber-100' },
              { id: 'approved', label: 'Đã xuất bản', count: counts.approved, color: 'text-emerald-700 bg-emerald-100' },
              { id: 'rejected', label: 'Yêu cầu sửa', count: counts.rejected, color: 'text-red-700 bg-red-100' },
              { id: 'draft', label: 'Bản nháp', count: counts.draft, color: 'text-slate-700 bg-slate-200' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-red-700 text-white shadow-md'
                      : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200/70'
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

          <a
            href={withBase('/gui-cau-chuyen')}
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <span>+ Tạo bài mới</span>
          </a>
        </div>

        {/* Thanh tìm kiếm & Lọc Tổ Dân Phố */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tiêu đề, nhân chứng hoặc tổ dân phố..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-amber-200/80 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedTdp}
              onChange={(e) => setSelectedTdp(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-white border border-amber-200/80 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
            >
              <option value="ALL">Tất cả 37 Tổ Dân Phố</option>
              {Array.from(new Set(stories.map((s) => s.to_dan_pho).filter(Boolean))).map((tdp) => (
                <option key={tdp} value={tdp as string}>
                  {tdp}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* THANH THAO TÁC HÀNG LOẠT (BATCH ACTIONS TOOLBAR) */}
      {filteredStories.length > 0 && (
        <div className="bg-[#FAF6F0] p-3.5 sm:p-4 rounded-2xl border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-slate-800 select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-red-700 accent-red-700 cursor-pointer"
              />
              <span>Chọn tất cả ({filteredStories.length} bài)</span>
            </label>
            {selectedIds.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-xs font-black border border-red-200">
                Đã chọn: {selectedIds.length}
              </span>
            )}
          </div>

          {selectedIds.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {activeTab !== 'approved' && (
                <button
                  type="button"
                  onClick={handleBatchApprove}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Duyệt đã chọn ({selectedIds.length})</span>
                </button>
              )}

              {activeTab !== 'rejected' && (
                <button
                  type="button"
                  onClick={handleBatchReject}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Yêu cầu sửa ({selectedIds.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleBatchDelete}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ({selectedIds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Bỏ chọn
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">
              Tích chọn các ô bên dưới để duyệt hoặc xử lý hàng loạt nhanh chóng
            </span>
          )}
        </div>
      )}

      {/* DANH SÁCH BÀI VIẾT CẦN DUYỆT */}
      {filteredStories.length === 0 ? (
        <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-12 text-center shadow-xs">
          <ShieldCheck className="w-12 h-12 text-amber-600 mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-lg text-slate-800">
            Không có bài viết nào trong mục này
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tất cả bài viết đã được xử lý hoặc không có dữ liệu khớp với bộ lọc tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => {
            const isChecked = selectedIds.includes(story.id);
            return (
              <div
                key={story.id}
                className={`bg-[#FAF6F0] rounded-3xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isChecked ? 'border-red-600 bg-red-50/20 ring-2 ring-red-600/20' : 'border-amber-200/80'
                }`}
              >
                {/* Bên trái: Checkbox + Thumbnail & Thông tin */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  {/* Checkbox chọn bài */}
                  <div className="pt-2 sm:pt-3 shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelectOne(story.id)}
                      className="w-4 h-4 rounded text-red-700 accent-red-700 cursor-pointer"
                      title="Chọn bài viết này"
                    />
                  </div>

                  <div className="w-24 sm:w-32 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-amber-200/60">
                    <img
                      src={resolveImageUrl(story.cover_url)}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-black uppercase tracking-wider border border-red-200">
                      {story.category_name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {story.to_dan_pho || 'Phường Xuân Hương — Đà Lạt'}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500">{formatDate(story.created_at)}</span>
                  </div>

                  <h3 className="font-serif font-black text-base sm:text-lg text-slate-900 hover:text-red-700 transition-colors line-clamp-1">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                    <span>Nhân chứng / Người kể: <strong className="text-slate-800">{story.narrator_name}</strong></span>
                    <span>•</span>
                    <span>Thời gian đọc: <strong>~{story.read_minutes} phút</strong></span>
                  </div>

                  {story.reject_reason && story.status === 'rejected' && (
                    <div className="text-xs text-red-700 bg-red-50 p-2 rounded-xl border border-red-200 mt-1">
                      <strong>Lý do yêu cầu sửa:</strong> {story.reject_reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Bên phải: Nút Thao tác */}
              <div className="flex items-center gap-2 shrink-0 md:flex-col lg:flex-row border-t md:border-t-0 pt-3 md:pt-0 border-amber-200/60 justify-end">
                <button
                  type="button"
                  onClick={() => setReviewStory(story)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-slate-700 font-bold text-xs border border-amber-300 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Xem toàn bộ nội dung & thẩm định"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Thẩm định</span>
                </button>

                {story.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(story.id, story.title)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Duyệt ngay</span>
                  </button>
                )}

                {story.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => handleReject(story.id, story.title)}
                    className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300"
                  >
                    Yêu cầu sửa
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(story.id, story.title)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
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

      {/* ================= MODAL THẨM ĐỊNH CHI TIẾT (FULL REVIEW DRAWER) ================= */}
      {reviewStory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-300 max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider border border-red-300">
                  {reviewStory.status === 'pending' ? 'HỒ SƠ CHỜ THẨM ĐỊNH' : `TRẠNG THÁI: ${reviewStory.status.toUpperCase()}`}
                </span>
                <span className="text-xs text-slate-500">{reviewStory.to_dan_pho}</span>
              </div>
              <button
                type="button"
                onClick={() => setReviewStory(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* Ảnh bìa (Chỉ hiển thị nếu nội dung chưa có ảnh chèn trực tiếp, tránh nhân đôi) */}
            {!/<img|!\[/i.test(reviewStory.body) && (reviewStory.cover_url || (reviewStory.images && reviewStory.images[0])) && (
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 max-h-80">
                <img
                  src={reviewStory.cover_url || (reviewStory.images && reviewStory.images[0])}
                  alt={reviewStory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Chi tiết thông tin */}
            <div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 leading-snug">
                {reviewStory.title}
              </h2>
              <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-3">
                <span>Nhân chứng / Người kể: <strong className="text-slate-800">{reviewStory.narrator_name}</strong></span>
                <span>•</span>
                <span>Thời kỳ: <strong>{reviewStory.period}</strong></span>
                <span>•</span>
                <span>Đơn vị gửi: <strong>{reviewStory.contributor_unit || reviewStory.contributor_name}</strong></span>
              </div>
            </div>

            {/* Tóm tắt */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-slate-700 italic">
              "{reviewStory.summary}"
            </div>

            {/* Nội dung chi tiết (Được render định dạng màu sắc, căn lề và ảnh tư liệu Cloudinary chuẩn đẹp) */}
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderStoryContent(reviewStory.body) }}
            />

            {/* Nút Phê duyệt / Từ chối dưới chân Drawer */}
            <div className="pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDelete(reviewStory.id, reviewStory.title)}
                className="px-4 py-2 rounded-xl text-red-700 hover:bg-red-50 font-bold text-xs"
              >
                Xóa bài viết
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleReject(reviewStory.id, reviewStory.title)}
                  className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300"
                >
                  Yêu cầu sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(reviewStory.id, reviewStory.title)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>Phê duyệt xuất bản</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
