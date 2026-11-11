import { useState, useEffect } from 'react';
import { getCurrentUser, updateStory, deleteStory, type Story, type UserSession } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import { Edit3, Trash2, Save, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

const COVER_PRESETS = [
  { label: 'Thời hoa lửa Trường Sơn', url: '/images/thoi-hoa-lua-hero.jpg' },
  { label: 'Chiến sĩ Trường Sa', url: '/images/truong-sa-chu-quyen.jpg' },
  { label: 'Kháng chiến cứu quốc', url: '/images/thoi-hoa-lua/cat-khang-chien.jpg' },
  { label: 'Mẹ Việt Nam Anh Hùng', url: '/images/thoi-hoa-lua/cat-me-vnah.jpg' },
  { label: 'Hậu phương tiền tuyến', url: '/images/thoi-hoa-lua/cat-hau-phuong.jpg' },
  { label: 'Biển đảo quê hương', url: '/images/thoi-hoa-lua/cat-bien-dao.jpg' },
  { label: 'Biên giới hải đảo', url: '/images/thoi-hoa-lua/cat-bien-gioi.jpg' },
  { label: 'Đại tướng Võ Nguyên Giáp', url: '/images/thoi-hoa-lua/vna-potal-chan-dung-dai-tuong-vo-nguyen-giap-184218511-16-3-52.jpg' },
  { label: 'Hà Nội 12 ngày đêm', url: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg' },
  { label: 'Chiến dịch Điện Biên Phủ', url: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg' },
];

interface Props {
  story: Story;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export default function StoryActionToolbar({ story, onUpdated, onDeleted }: Props) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form edit fields
  const [title, setTitle] = useState(story.title);
  const [narrator, setNarrator] = useState(story.narrator_name);
  const [contributor, setContributor] = useState(story.contributor_name);
  const [unit, setUnit] = useState(story.contributor_unit || '');
  const [summary, setSummary] = useState(story.summary);
  const [body, setBody] = useState(story.body);
  const [category, setCategory] = useState(story.category_id);
  const [provinceCode, setProvinceCode] = useState(story.province_code);
  const [period, setPeriod] = useState(story.period);
  const [coverUrl, setCoverUrl] = useState(story.cover_url);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuth = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', handleAuth);
    return () => window.removeEventListener('auth-changed', handleAuth);
  }, []);

  const canManage = user?.role === 'admin' || user?.role === 'member';

  if (!canManage) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryMap: Record<string, string> = {
      'phong-trao-doan': 'Ký ức Thành Đoàn & Kháng chiến',
      'thanh-nien-xung-phong': 'Thanh niên xung phong & Tiên phong',
      'tinh-nguyen': 'Tình nguyện vì cộng đồng',
      'bien-dao': 'Bảo vệ chủ quyền Biển đảo',
      'hoc-tap-bac': 'Học tập & Làm theo lời Bác',
      'cong-trinh-thanh-nien': 'Công trình Thanh niên thời đại số',
    };

    const provinceMap: Record<string, string> = {
      HCM: 'TP. Hồ Chí Minh',
      HN: 'Hà Nội',
      DN: 'Đà Nẵng (gồm Quần đảo Hoàng Sa)',
      KH: 'Khánh Hòa (gồm Quần đảo Trường Sa)',
      DB: 'Điện Biên',
      QT: 'Quảng Trị',
      TN: 'Tây Ninh',
    };

    const success = updateStory(story.id, {
      title,
      narrator_name: narrator,
      contributor_name: contributor,
      contributor_unit: unit,
      summary,
      body,
      category_id: category,
      category_name: categoryMap[category] || story.category_name,
      province_code: provinceCode,
      province_name: provinceMap[provinceCode] || story.province_name,
      period,
      cover_url: coverUrl,
    });

    if (success) {
      setIsEditing(false);
      setToastMsg('Đã cập nhật bài viết thành công!');
      if (onUpdated) {
        onUpdated();
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  const handleConfirmDelete = () => {
    const success = deleteStory(story.id);
    if (success) {
      setShowDeleteModal(false);
      setToastMsg('Đã xoá bài viết vĩnh viễn!');
      if (onDeleted) {
        onDeleted();
      } else {
        setTimeout(() => {
          window.location.href = withBase('/thu-vien');
        }, 1200);
      }
    }
  };

  return (
    <>
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-green-900 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-green-500/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Thanh nút bấm CRUD */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors shadow-sm"
          title="Chỉnh sửa nội dung câu chuyện"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
          <span>Sửa bài</span>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-redflag-50 hover:bg-redflag-100 text-redflag-800 border border-redflag-200 text-xs font-bold transition-colors shadow-sm"
          title="Xoá vĩnh viễn bài viết"
        >
          <Trash2 className="w-3.5 h-3.5 text-redflag-700" />
          <span>Xoá</span>
        </button>
      </div>

      {/* Modal Chỉnh Sửa Bài Viết (Update Story) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-doan-800 uppercase tracking-widest bg-doan-50 px-2.5 py-0.5 rounded-full border border-doan-200">
                  Cập nhật thông tin
                </span>
                <h2 className="font-serif font-black text-xl text-slate-900 mt-1">
                  Chỉnh sửa câu chuyện lịch sử
                </h2>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-left text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tiêu đề câu chuyện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-doan-700 focus:ring-1 focus:ring-doan-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Người kể / Nhân chứng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={narrator}
                    onChange={(e) => setNarrator(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-doan-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Người ghi chép
                  </label>
                  <input
                    type="text"
                    value={contributor}
                    onChange={(e) => setContributor(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-doan-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Đơn vị / Chi đoàn
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-doan-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Chủ đề chuyên mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="phong-trao-doan">Ký ức Thành Đoàn & Kháng chiến</option>
                    <option value="thanh-nien-xung-phong">Thanh niên xung phong & Tiên phong</option>
                    <option value="tinh-nguyen">Tình nguyện vì cộng đồng</option>
                    <option value="bien-dao">Bảo vệ chủ quyền Biển đảo</option>
                    <option value="hoc-tap-bac">Học tập & Làm theo lời Bác</option>
                    <option value="cong-trinh-thanh-nien">Công trình Thanh niên số</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Địa phương / Địa chỉ Đỏ</label>
                  <select
                    value={provinceCode}
                    onChange={(e) => setProvinceCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="HCM">TP. Hồ Chí Minh</option>
                    <option value="HN">Hà Nội</option>
                    <option value="DN">Đà Nẵng (gồm Quần đảo Hoàng Sa)</option>
                    <option value="KH">Khánh Hòa (gồm Quần đảo Trường Sa)</option>
                    <option value="DB">Điện Biên</option>
                    <option value="QT">Quảng Trị</option>
                    <option value="TN">Tây Ninh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Thời kỳ lịch sử</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="1945-truoc">Trước năm 1945</option>
                    <option value="1945-1954">1945 - 1954 (Kháng chiến chống Pháp)</option>
                    <option value="1955-1975">1955 - 1975 (Kháng chiến chống Mỹ)</option>
                    <option value="1975-1988">1975 - 1988 (Xây dựng & Bảo vệ Tổ quốc)</option>
                    <option value="1989-nay">1989 đến nay (Đổi mới & Phát triển)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Đoạn tóm tắt nổi bật <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-doan-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nội dung chi tiết (hỗ trợ Markdown) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-2 font-mono text-xs rounded-xl border border-slate-300 focus:border-doan-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">
                  Chọn ảnh đại diện tiêu biểu (Thời Hoa Lửa)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
                  {COVER_PRESETS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setCoverUrl(p.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left h-20 transition-all ${
                        coverUrl === p.url ? 'border-doan-800 ring-2 ring-doan-700' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[9px] font-bold text-white truncate">
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="Hoặc nhập đường dẫn ảnh..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-doan-800 hover:bg-doan-900 text-white font-bold shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa Bài Viết (Delete Confirmation) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="font-serif font-black text-xl text-slate-900 mb-2">
              Xác nhận xoá bài viết?
            </h3>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xoá câu chuyện <strong>"{story.title}"</strong> không? 
              Hành động này sẽ loại bỏ vĩnh viễn dữ liệu khỏi hệ thống và không thể hoàn tác.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-redflag-800 hover:bg-redflag-900 text-white text-xs font-bold shadow"
              >
                Đồng ý xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
