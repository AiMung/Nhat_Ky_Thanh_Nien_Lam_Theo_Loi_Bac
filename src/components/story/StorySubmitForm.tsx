import React, { useState, useEffect } from 'react';
import { submitNewStory, type Story } from '@/lib/storage';
import { TDP_UNITS, SCHOOL_UNITS, CITIZEN_UNITS, getUnitBadge } from '@/lib/units';
import { saveStoryToSupabase } from '@/lib/supabase';
import { withBase, resolveImageUrl } from '@/lib/utils';
import ImageUploadBox from '@/components/story/ImageUploadBox';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Building2, 
  GraduationCap, 
  Users, 
  Sparkles,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Eye,
  Edit3,
  Clock,
  FileText,
  Calendar,
  ChevronDown
} from 'lucide-react';

export default function StorySubmitForm() {
  // Mode: 'edit' (Soạn thảo) | 'preview' (Xem trước)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // 1. Thông tin người gửi & Đơn vị đóng góp
  const [contributorName, setContributorName] = useState('');
  const [contributorPhone, setContributorPhone] = useState('');
  const [contributorRole, setContributorRole] = useState('Đoàn viên thanh niên');
  
  // Khối đơn vị: 'tdp' (37 Tổ DP) | 'school' (Trường học) | 'citizen' (Người dân & Khác)
  const [unitGroup, setUnitGroup] = useState<'tdp' | 'school' | 'citizen'>('tdp');
  const [selectedUnit, setSelectedUnit] = useState<string>(TDP_UNITS[0]);
  const [customUnit, setCustomUnit] = useState('');

  // 2. Nội dung câu chuyện
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hoc-tap-bac');
  const [narrator, setNarrator] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [period, setPeriod] = useState('Kháng chiến chống Mỹ (1954 - 1975)');

  // 3. Hình ảnh tư liệu
  const [images, setImages] = useState<string[]>([
    '/images/thoi-hoa-lua-hero.jpg'
  ]);

  // 4. Cam kết
  const [committed, setCommitted] = useState(true);

  // 5. Trạng thái phản hồi
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdStory, setCreatedStory] = useState<Story | null>(null);

  // Cập nhật đơn vị mặc định khi đổi nhóm
  useEffect(() => {
    if (unitGroup === 'tdp') {
      setSelectedUnit(TDP_UNITS[0]);
    } else if (unitGroup === 'school') {
      setSelectedUnit(SCHOOL_UNITS[0]);
    } else {
      setSelectedUnit(CITIZEN_UNITS[0]);
    }
  }, [unitGroup]);

  // Tính số lượng từ và thời gian đọc ước tính
  const fullText = `${title} ${summary} ${body}`;
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 180));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const getFinalUnitName = () => {
    if (unitGroup === 'citizen' && selectedUnit === 'Cá nhân / Đơn vị hảo tâm khác' && customUnit.trim()) {
      return customUnit.trim();
    }
    if (unitGroup === 'school' && selectedUnit === 'Chi đoàn / Liên đội Trường học khác' && customUnit.trim()) {
      return customUnit.trim();
    }
    return selectedUnit;
  };

  const categoryMap: Record<string, string> = {
    'hoc-tap-bac': 'Học tập & Làm theo lời Bác',
    'dia-chi-do': 'Địa chỉ Đỏ & Di tích Đà Lạt',
    'phong-trao-doan': 'Tuổi trẻ Phường Xuân Hương',
    'thanh-nien-xung-phong': 'Thanh niên xung phong & Tiên phong',
    'tinh-nguyen': 'Những lá thư thời hoa lửa',
    'bien-dao': 'Bảo vệ chủ quyền Biển đảo',
  };

  const validateForm = () => {
    if (!contributorName.trim()) {
      showToast('⚠️ Vui lòng nhập Họ và tên của bạn để Ban Biên tập ghi nhận tác giả.');
      return false;
    }
    if (!contributorPhone.trim()) {
      showToast('⚠️ Vui lòng cung cấp Số điện thoại hoặc Zalo để xác thực thông tin khi cần.');
      return false;
    }
    if (!title.trim()) {
      showToast('⚠️ Vui lòng nhập Tiêu đề câu chuyện.');
      return false;
    }
    if (!summary.trim() && !body.trim()) {
      showToast('⚠️ Vui lòng nhập Nội dung câu chuyện hoặc tóm tắt.');
      return false;
    }
    if (!committed) {
      showToast('⚠️ Vui lòng tích chọn cam kết tính trung thực của tư liệu trước khi gửi.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const finalUnit = getFinalUnitName();

    const newStoryData = {
      title: title.trim(),
      narrator_name: narrator.trim() || contributorName.trim(),
      contributor_name: contributorName.trim(),
      contributor_phone: contributorPhone.trim(),
      contributor_role: contributorRole,
      unit_type: unitGroup,
      contributor_unit: finalUnit,
      to_dan_pho: unitGroup === 'tdp' ? finalUnit : (finalUnit + ' — P. Xuân Hương'),
      summary: summary.trim() || title.trim(),
      body: body.trim() || summary.trim(),
      category_id: category,
      category_name: categoryMap[category] || 'Học tập & Làm theo lời Bác',
      province_code: 'LD',
      province_name: 'Phường Xuân Hương — Đà Lạt',
      period: period,
      cover_url: images[0] || '/images/thoi-hoa-lua-hero.jpg',
      images: images
    };

    try {
      // Lưu với trạng thái pending - CHỜ DUYỆT (không hiển thị ngay)
      const saved = submitNewStory(newStoryData, 'pending');

      // Đồng bộ Supabase nếu có
      await saveStoryToSupabase(saved);

      setIsSubmitting(false);
      setCreatedStory(saved);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error submitting story:', err);
      setIsSubmitting(false);
      showToast('⚠️ Có lỗi xảy ra trong quá trình gửi. Vui lòng thử lại!');
    }
  };

  const finalUnitName = getFinalUnitName();
  const unitBadge = getUnitBadge(finalUnitName);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-100 px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner: Trang trọng, hào hùng */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/60 via-amber-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-[11px] font-bold text-red-800 uppercase tracking-wider mb-3">
            <span>★</span>
            <span>Đóng góp Tư liệu & Ký ức — Đoàn Phường Xuân Hương</span>
            <span>★</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
            Gửi Câu Chuyện Ký Ức & Bài Học Làm Theo Lời Bác
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2.5 max-w-2xl leading-relaxed">
            Mọi đoàn viên, thanh thiếu nhi, cựu chiến binh và người dân đều có thể đóng góp câu chuyện. Toàn bộ bài gửi sẽ được <strong>Ban Biên tập kiểm duyệt tính chân thực</strong> trước khi xuất bản công khai.
          </p>

          {/* Thanh chuyển chế độ (Soạn thảo vs Xem trước trực tiếp) */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'edit'
                    ? 'bg-white text-red-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Soạn thảo bài viết</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'preview'
                    ? 'bg-red-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem trước trực tiếp (Live Preview)</span>
              </button>
            </div>

            {/* Thông số bài viết */}
            <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/80">
                <FileText className="w-3 h-3 text-stone-400" />
                <strong>{wordCount}</strong> từ
              </span>
              <span className="flex items-center gap-1 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/80">
                <Clock className="w-3 h-3 text-stone-400" />
                ~<strong>{estimatedReadTime}</strong> phút đọc
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHẾ ĐỘ 1: XEM TRƯỚC TRỰC TIẾP (LIVE PREVIEW) ================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-4 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <span>
                Đây là giao diện mô phỏng bài viết sau khi được <strong>Ban Biên tập phê duyệt</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="text-xs font-bold text-red-800 hover:underline shrink-0"
            >
              ← Quay lại chỉnh sửa
            </button>
          </div>

          <article className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md">
            {/* Ảnh bìa bài viết */}
            {images.length > 0 && (
              <div className="relative aspect-[21/9] sm:aspect-[21/8] bg-stone-900 overflow-hidden">
                <img
                  src={resolveImageUrl(images[0])}
                  alt={title || 'Hình ảnh minh họa'}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-red-700/90 text-amber-100 text-[11px] font-bold backdrop-blur-xs">
                      {categoryMap[category] || 'Học tập & Làm theo lời Bác'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-xs ${unitBadge.bg} ${unitBadge.color} ${unitBadge.border}`}>
                      {unitBadge.label}
                    </span>
                  </div>
                  <h1 className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-white leading-tight drop-shadow">
                    {title || 'Tiêu đề câu chuyện chưa được nhập...'}
                  </h1>
                </div>
              </div>
            )}

            {/* Thân bài viết */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Thông tin tác giả & Đơn vị */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-stone-200 text-xs sm:text-sm text-stone-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-serif font-bold text-base">
                    {(contributorName || 'N')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">
                      {contributorName || 'Họ và tên người gửi'}
                    </div>
                    <div className="text-stone-500 text-xs">
                      {contributorRole} • <span className="text-red-800 font-semibold">{finalUnitName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Hôm nay
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {estimatedReadTime} phút đọc
                  </span>
                </div>
              </div>

              {/* Tóm tắt mở đầu */}
              {summary && (
                <div className="p-5 rounded-2xl bg-stone-50 border-l-4 border-amber-500 font-serif italic text-stone-700 text-sm sm:text-base leading-relaxed">
                  “{summary}”
                </div>
              )}

              {/* Nội dung chi tiết */}
              <div className="text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-serif">
                {body || (
                  <p className="text-stone-400 italic">
                    Chưa có nội dung chi tiết. Vui lòng bấm tab "Soạn thảo bài viết" để nhập nội dung câu chuyện...
                  </p>
                )}
              </div>

              {/* Bộ sưu tập ảnh tư liệu (nếu có hơn 1 ảnh) */}
              {images.length > 1 && (
                <div className="pt-6 border-t border-stone-200 space-y-3">
                  <h4 className="font-serif font-bold text-stone-900 text-sm">
                    Hình ảnh tư liệu đính kèm ({images.length} ảnh):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                        <img src={resolveImageUrl(img)} alt={`Ảnh tư liệu ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thông tin nhân chứng & người kể */}
              {narrator && (
                <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 text-xs text-red-900 font-medium">
                  <strong>Nhân chứng / Người kể lại:</strong> {narrator}
                </div>
              )}
            </div>

            {/* Thanh thao tác dưới cùng của tab Preview */}
            <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="px-6 py-2.5 rounded-full border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
              >
                ← Tiếp tục chỉnh sửa
              </button>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full bg-red-800 hover:bg-red-900 text-white text-xs sm:text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi bài viết đến Ban Biên tập'}</span>
              </button>
            </div>
          </article>
        </div>
      )}

      {/* ================= CHẾ ĐỘ 2: SOẠN THẢO BÀI VIẾT ================= */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= KHỐI 1: THÔNG TIN TÁC GIẢ & ĐƠN VỊ ================= */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Thông tin Người gửi & Đơn vị Đóng góp
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Hỗ trợ 37 Tổ dân phố, các Trường học trên địa bàn và Người dân đóng góp
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Họ và tên người gửi <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An, Trần Thị Mai..."
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Số điện thoại liên hệ */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại / Zalo <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Để Ban Biên tập xác thực thông tin khi cần"
                    value={contributorPhone}
                    onChange={(e) => setContributorPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Vai trò */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Vai trò của bạn
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Đoàn viên thanh niên',
                    'Học sinh / Sinh viên',
                    'Giáo viên / Tổng phụ trách',
                    'Cựu chiến binh / Nhân chứng',
                    'Người dân địa phương',
                    'Khác'
                  ].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setContributorRole(role)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        contributorRole === role
                          ? 'bg-red-800 border-red-800 text-white shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHỌN KHỐI ĐƠN VỊ ĐÓNG GÓP: 3 Tabs trực quan */}
              <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  Đơn vị đóng góp bài viết <span className="text-red-600">*</span>
                </label>

                {/* 3 Tabs phân loại */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl mb-3">
                  <button
                    type="button"
                    onClick={() => setUnitGroup('tdp')}
                    className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      unitGroup === 'tdp'
                        ? 'bg-white text-red-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">37 Tổ Dân Phố</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnitGroup('school')}
                    className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      unitGroup === 'school'
                        ? 'bg-white text-blue-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Khối Trường Học</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUnitGroup('citizen')}
                    className={`py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      unitGroup === 'citizen'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Người Dân & Khác</span>
                  </button>
                </div>

                {/* Danh sách Dropdown tùy biến có icon chevron */}
                <div className="relative">
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-stone-50 focus:bg-white text-stone-900 text-xs sm:text-sm font-semibold focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    {unitGroup === 'tdp' && (
                      <>
                        <optgroup label="Danh sách 37 Tổ Dân Phố Phường Xuân Hương">
                          {TDP_UNITS.map((u, idx) => (
                            <option key={u} value={u}>
                              TDP {(idx + 1).toString().padStart(2, '0')}: {u}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    )}

                    {unitGroup === 'school' && (
                      <>
                        <optgroup label="Khối Trường Học trên địa bàn Phường Xuân Hương">
                          {SCHOOL_UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    )}

                    {unitGroup === 'citizen' && (
                      <>
                        <optgroup label="Người Dân & Nhân chứng lịch sử">
                          {CITIZEN_UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </optgroup>
                      </>
                    )}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Trường nhập tự do nếu chọn mục "Khác" */}
                {(selectedUnit.includes('Khác') || selectedUnit.includes('khác')) && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Vui lòng nhập tên cụ thể của trường hoặc đơn vị của bạn..."
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-amber-300 bg-amber-50/50 text-stone-900 text-xs sm:text-sm focus:border-red-600 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ================= KHỐI 2: NỘI DUNG CÂU CHUYỆN ================= */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Nội dung Câu chuyện & Ký ức Lịch sử
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Kể về một mẩu chuyện làm theo lời Bác, hồi ức người chiến sĩ, hoặc tấm gương sáng
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Tiêu đề câu chuyện <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bác Hồ với thanh thiếu nhi, Khúc tráng ca Nhà lao Thiếu nhi Đà Lạt..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-base font-serif font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                />
              </div>

              {/* Chuyên mục & Thời kỳ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Chuyên mục chủ đề
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-stone-50 focus:bg-white text-stone-900 text-xs sm:text-sm font-semibold focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all cursor-pointer shadow-2xs"
                    >
                      <option value="hoc-tap-bac">Học tập & Làm theo lời Bác</option>
                      <option value="dia-chi-do">Địa chỉ Đỏ & Di tích Đà Lạt</option>
                      <option value="phong-trao-doan">Tuổi trẻ Phường Xuân Hương</option>
                      <option value="thanh-nien-xung-phong">Thanh niên xung phong & Tiên phong</option>
                      <option value="tinh-nguyen">Những lá thư thời hoa lửa</option>
                      <option value="bien-dao">Bảo vệ chủ quyền Biển đảo</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nhân chứng / Người kể chuyện (nếu có)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Bác Lê Văn Triết (Cựu chiến binh TDP Ánh Sáng)"
                    value={narrator}
                    onChange={(e) => setNarrator(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs sm:text-sm focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              {/* Tóm tắt ngắn gọn */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Tóm tắt ngắn gọn (2-3 câu)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn bối cảnh, ý nghĩa và bài học rút ra từ câu chuyện..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs sm:text-sm focus:border-red-600 outline-none transition-colors"
                />
              </div>

              {/* Nội dung chi tiết */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Nội dung chi tiết câu chuyện <span className="text-red-600">*</span>
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {body.trim() ? `${body.trim().split(/\s+/).filter(Boolean).length} từ` : '0 từ'}
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder="Kể lại chi tiết diễn biến, ký ức, cảm nghĩ hoặc bài học sâu sắc từ câu chuyện... Bạn có thể chia đoạn rõ ràng để bài viết trang trọng và dễ đọc."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-xs sm:text-sm leading-relaxed focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none font-sans"
                />
              </div>
            </div>
          </section>

          {/* ================= KHỐI 3: HÌNH ẢNH MINH HỌA ================= */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Hình ảnh Kỷ vật & Tư liệu Minh họa
                </h2>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  Tải ảnh từ máy, chọn từ kho tư liệu lịch sử hoặc sao chép và dán trực tiếp (Ctrl + V)
                </p>
              </div>
            </div>

            <ImageUploadBox
              images={images}
              onChange={(imgs) => setImages(imgs)}
              maxImages={8}
            />
          </section>

          {/* ================= KHỐI 4: CAM KẾT & NỘP BÀI ================= */}
          <section className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={committed}
                  onChange={(e) => setCommitted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-red-700 border-stone-300 focus:ring-red-600 shrink-0"
                />
                <span className="text-xs sm:text-sm text-stone-700 leading-snug group-hover:text-stone-900">
                  Tôi cam đoan thông tin, tư liệu và hình ảnh chia sẻ là đúng sự thật, mang ý nghĩa giáo dục truyền thống và đồng ý để Ban Biên tập Đoàn Phường Xuân Hương thẩm định, xuất bản lên website.
                </span>
              </label>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-[11px] sm:text-xs text-amber-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Quy trình kiểm duyệt: Bài viết sẽ được lưu ở trạng thái <strong>Chờ duyệt</strong> và chỉ xuất bản lên Trang chủ & Thư viện sau khi được Ban Biên tập phê duyệt.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors order-2 sm:order-1"
              >
                <Eye className="w-4 h-4 text-stone-600" />
                <span>Xem trước bài viết</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 order-1 sm:order-2 ${
                  isSubmitting
                    ? 'bg-stone-400 text-white cursor-not-allowed'
                    : 'bg-red-800 hover:bg-red-900 text-amber-50 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Đang gửi bài viết...' : 'Gửi bài viết đến Ban Biên tập'}</span>
              </button>
            </div>
          </section>

        </form>
      )}

      {/* ================= MODAL THÔNG BÁO GỬI THÀNH CÔNG ================= */}
      {showSuccessModal && createdStory && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mx-auto shadow-xs">
              ✓
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                ĐÃ TIẾP NHẬN BÀI VIẾT — CHỜ BAN BIÊN TẬP DUYỆT
              </span>
              <h3 className="font-serif font-black text-xl text-stone-900 mt-3 leading-snug">
                {createdStory.title}
              </h3>
              <p className="text-xs text-stone-600 mt-2">
                Đơn vị: <strong className="text-red-800">{createdStory.contributor_unit}</strong> • Người gửi: <strong>{createdStory.contributor_name}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 text-left space-y-1.5">
              <div className="flex justify-between">
                <span>Mã tiếp nhận:</span>
                <span className="font-mono font-bold text-stone-900">{createdStory.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="font-bold text-amber-700">Đang chờ Ban Biên tập thẩm định</span>
              </div>
              <div className="flex justify-between">
                <span>Hiển thị công khai:</span>
                <span className="text-stone-500">Sau khi được phê duyệt</span>
              </div>
            </div>

            <p className="text-xs text-stone-500 italic">
              Trân trọng cảm ơn đóng góp quý báu của bạn cho công trình số hóa lịch sử Phường Xuân Hương — Đà Lạt!
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setTitle('');
                  setSummary('');
                  setBody('');
                  setActiveTab('edit');
                }}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Gửi bài viết khác
              </button>
              <a
                href={withBase('/thu-vien')}
                className="flex-1 py-2.5 rounded-xl bg-red-800 text-white text-xs font-bold hover:bg-red-900 text-center"
              >
                Về Thư viện bài viết
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
