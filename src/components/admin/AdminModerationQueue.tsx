import { useState, useEffect } from 'react';
import { getAllStories, updateStoryStatus, getCurrentUser, switchUserRole, type Story, type UserSession } from '@/lib/storage';
import { withBase, formatDate } from '@/lib/utils';
import StoryActionToolbar from '@/components/story/StoryActionToolbar';
import { Check, X, Eye, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminModerationQueue() {
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [user, setUser] = useState<UserSession | null>(null);
  const [toast, setToast] = useState('');

  const loadData = () => {
    setStories(getAllStories());
    setUser(getCurrentUser());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (id: string, title: string) => {
    updateStoryStatus(id, 'approved');
    loadData();
    setToast(`Đã duyệt thành công: "${title}". Bài viết đã xuất hiện trên Thư viện.`);
    setTimeout(() => setToast(''), 4000);
  };

  const handleReject = (id: string, title: string) => {
    const reason = window.prompt(`Nhập lý do từ chối bài viết "${title}":`, 'Tư liệu cần bổ sung thêm căn cứ xác thực.');
    if (reason !== null) {
      updateStoryStatus(id, 'rejected', reason);
      loadData();
      setToast(`Đã chuyển bài viết sang danh sách từ chối.`);
      setTimeout(() => setToast(''), 4000);
    }
  };

  const handleGrantAdmin = () => {
    switchUserRole('admin');
    setUser(getCurrentUser());
  };

  const filtered = stories.filter((s) => s.status === activeTab);

  return (
    <div className="space-y-6">
      
      {/* Toast thông báo hành động */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-green-900 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-green-500/40 flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Thanh cảnh báo quyền nếu chưa phải Admin */}
      {user && user.role !== 'admin' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <strong>Bạn đang xem với tư cách: {user.name} ({user.role === 'member' ? 'Đoàn viên' : 'Khách'}).</strong>
              <div className="text-amber-700">Để thực hiện duyệt hoặc từ chối bài viết, bạn có thể chuyển nhanh sang quyền Ban Biên tập.</div>
            </div>
          </div>
          <button
            onClick={handleGrantAdmin}
            className="shrink-0 px-4 py-2 bg-redflag-800 hover:bg-redflag-900 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            Chuyển sang quyền Ban Biên tập (Admin)
          </button>
        </div>
      )}

      {/* Tabs chuyển đổi trạng thái */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>⏳ Chờ kiểm duyệt</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {stories.filter((s) => s.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'approved'
                ? 'bg-green-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>✓ Đã duyệt & Xuất bản</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {stories.filter((s) => s.status === 'approved').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'rejected'
                ? 'bg-redflag-800 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>✕ Đã từ chối</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {stories.filter((s) => s.status === 'rejected').length}
            </span>
          </button>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
          title="Tải lại danh sách"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* Danh sách các câu chuyện theo Tab */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xl mx-auto mb-3">
            📋
          </div>
          <h3 className="font-serif font-bold text-base text-slate-800 mb-1">
            Không có bài viết nào trong mục này
          </h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'pending'
              ? 'Tất cả các câu chuyện gửi về đều đã được xử lý xong!'
              : 'Chưa có bản ghi nào trong trạng thái này.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-300 transition-colors"
            >
              {/* Ảnh thu nhỏ và nội dung */}
              <div className="flex flex-col sm:flex-row gap-5 flex-1">
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-full sm:w-44 h-32 object-cover rounded-xl border border-slate-100 shrink-0"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-bold text-doan-800 bg-doan-50 px-2 py-0.5 rounded">
                      {item.category_name}
                    </span>
                    <span>•</span>
                    <span>📍 {item.province_name}</span>
                    <span>•</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {item.summary}
                  </p>

                  <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-1 pt-2 border-t border-slate-100">
                    <div>Người kể: <strong className="text-slate-900">{item.narrator_name}</strong></div>
                    <div>Ghi chép: <strong className="text-slate-900">{item.contributor_unit || item.contributor_name}</strong></div>
                  </div>

                  {item.reject_reason && (
                    <div className="mt-2 text-xs text-redflag-700 bg-redflag-50 p-2 rounded-lg border border-redflag-200">
                      <strong>Lý do từ chối:</strong> {item.reject_reason}
                    </div>
                  )}
                </div>
              </div>

              {/* Nút hành động kiểm duyệt */}
              <div className="flex lg:flex-col items-center justify-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[150px]">
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(item.id, item.title)}
                      className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Duyệt & Xuất bản</span>
                    </button>

                    <button
                      onClick={() => handleReject(item.id, item.title)}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-redflag-50 text-redflag-700 hover:text-redflag-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Từ chối</span>
                    </button>
                  </>
                )}

                {item.status === 'approved' && (
                  <button
                    onClick={() => handleReject(item.id, item.title)}
                    className="w-full py-2 px-3 bg-redflag-50 hover:bg-redflag-100 text-redflag-800 rounded-xl text-xs font-bold border border-redflag-200 transition-colors"
                  >
                    Gỡ bài viết
                  </button>
                )}

                {item.status === 'rejected' && (
                  <button
                    onClick={() => handleApprove(item.id, item.title)}
                    className="w-full py-2 px-3 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl text-xs font-bold border border-green-200 transition-colors"
                  >
                    Duyệt lại bài này
                  </button>
                )}

                <a
                  href={withBase(`/truyen/${item.slug}`)}
                  className="w-full py-2 px-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem chi tiết</span>
                </a>

                {/* Sửa và Xóa trực tiếp trong Hàng đợi Admin */}
                <div className="w-full pt-1 flex items-center justify-center">
                  <StoryActionToolbar
                    story={item}
                    onUpdated={loadData}
                    onDeleted={loadData}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
