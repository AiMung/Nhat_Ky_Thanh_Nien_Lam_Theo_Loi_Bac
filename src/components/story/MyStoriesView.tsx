import { useState, useEffect } from 'react';
import { getAllStories, getCurrentUser, type Story, type UserSession } from '@/lib/storage';
import { withBase, formatDate } from '@/lib/utils';
import StoryActionToolbar from '@/components/story/StoryActionToolbar';
import { PlusCircle, BookOpen, Clock, CheckCircle2, XCircle, Eye, AlertCircle } from 'lucide-react';

export default function MyStoriesView() {
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);

  const loadData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const all = getAllStories();
    
    // Nếu là admin, hiển thị toàn bộ
    // Nếu là member, hiển thị bài viết user tạo hoặc các bài mẫu có tên tương ứng
    if (currentUser.role === 'admin') {
      setStories(all);
    } else {
      setStories(all.filter((s) => 
        s.id.startsWith('user-story-') || 
        s.contributor_name.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        s.id === 'story-1' || s.id === 'story-2'
      ));
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

  return (
    <div className="space-y-8">
      {/* Header trang cá nhân */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-doan-700 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                user.role === 'admin' ? 'bg-redflag-100 text-redflag-800' : 'bg-doan-100 text-doan-800'
              }`}>
                {user.role === 'admin' ? '★ Quản trị viên Ban Biên tập' : 'Đoàn viên đóng góp'}
              </span>
            </div>
            <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 mt-1">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500">{user.unit} • {user.email}</p>
          </div>
        </div>

        <a
          href={withBase('/gui-cau-chuyen')}
          className="inline-flex items-center gap-2 bg-doan-800 hover:bg-doan-900 text-gold-300 font-serif font-black px-6 py-3 rounded-2xl shadow transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Viết trang nhật ký mới</span>
        </a>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-slate-900 font-serif">{stories.length}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Tổng số câu chuyện</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-amber-600 font-serif">
            {stories.filter((s) => s.status === 'pending').length}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Đang chờ duyệt</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-green-600 font-serif">
            {stories.filter((s) => s.status === 'approved').length}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Đã xuất bản</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <div className="text-2xl font-black text-redflag-700 font-serif">
            {stories.filter((s) => s.status === 'rejected').length}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Cần bổ sung tư liệu</div>
        </div>
      </div>

      {/* Danh sách câu chuyện */}
      <div className="space-y-4">
        <h2 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-doan-800" />
          <span>Danh sách câu chuyện của tôi ({stories.length})</span>
        </h2>

        {stories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
              ✍️
            </div>
            <h3 className="font-serif font-black text-lg text-slate-800 mb-2">
              Bạn chưa đóng góp câu chuyện nào
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
              Hãy chia sẻ những trang nhật ký, hồi ức của các thế hệ cha anh để cùng làm giàu thêm kho tàng lịch sử của tuổi trẻ thành phố!
            </p>
            <a
              href={withBase('/gui-cau-chuyen')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-doan-800 text-white rounded-xl text-xs font-bold shadow hover:bg-doan-900 transition-colors"
            >
              <span>Viết bài ngay bây giờ</span>
              <span>→</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row gap-5 flex-1">
                  <img
                    src={story.cover_url}
                    alt={story.title}
                    className="w-full sm:w-44 h-32 object-cover rounded-xl border border-slate-100 shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                      {story.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã xuất bản</span>
                        </span>
                      )}
                      {story.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Đang chờ duyệt</span>
                        </span>
                      )}
                      {story.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Bị từ chối</span>
                        </span>
                      )}

                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">📍 {story.province_name}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatDate(story.created_at)}</span>
                    </div>

                    <h3 className="font-serif font-black text-lg text-slate-900 mb-2">
                      {story.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {story.summary}
                    </p>

                    <div className="text-xs text-slate-500 flex items-center gap-4">
                      <span>Người kể: <strong>{story.narrator_name}</strong></span>
                      <span>Thời lượng đọc: <strong>{story.read_minutes} phút</strong></span>
                    </div>

                    {story.reject_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Lý do từ chối / cần sửa:</strong> {story.reject_reason}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Các nút hành động: Xem, Sửa, Xóa */}
                <div className="flex lg:flex-col items-center justify-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 min-w-[150px]">
                  <a
                    href={withBase(`/truyen/${story.slug}`)}
                    className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem bài</span>
                  </a>

                  {/* Thanh công cụ Sửa & Xóa */}
                  <div className="w-full flex items-center justify-center">
                    <StoryActionToolbar
                      story={story}
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
    </div>
  );
}
