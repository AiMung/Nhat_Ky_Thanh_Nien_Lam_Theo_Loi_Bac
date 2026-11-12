import { useState, useEffect } from 'react';
import { submitNewStory, getCurrentUser, type UserSession } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import ImageUploadBox from '@/components/story/ImageUploadBox';
import FacebookImageGrid from '@/components/story/FacebookImageGrid';
import { 
  CheckCircle2, 
  Send, 
  Sparkles, 
  MapPin, 
  Tag, 
  Clock, 
  UserCheck, 
  Building2, 
  FileText,
  ShieldCheck,
  Calendar,
  Eye,
  Award,
  Layers
} from 'lucide-react';

export default function StorySubmitForm() {
  const [user, setUser] = useState<UserSession | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [narrator, setNarrator] = useState('');
  const [contributor, setContributor] = useState('');
  const [unit, setUnit] = useState('Tổ dân phố 12 - Phường Xuân Hương, TP. Đà Lạt');
  const [provinceCode, setProvinceCode] = useState('DL');
  const [category, setCategory] = useState('phong-trao-doan');
  const [period, setPeriod] = useState('1955-1975');
  const [eventYear, setEventYear] = useState<number | ''>(1968);
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<string[]>(['/images/thoi-hoa-lua-hero.jpg']);
  const [committed, setCommitted] = useState(false);
  const [submittedStory, setSubmittedStory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setContributor(u.name);
      if (u.unit) setUnit(u.unit);
    }
  }, []);

  const handleSelectQuickUnit = (val: string) => {
    setUnit(val);
    if (val.includes('Đà Lạt') || val.includes('Xuân Hương')) {
      setProvinceCode('DL');
    } else if (val.includes('TP.HCM') || val.includes('Sài Gòn')) {
      setProvinceCode('HCM');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!committed) {
      alert('Vui lòng tích chọn cam kết tính trung thực của tư liệu trước khi đăng.');
      return;
    }

    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề câu chuyện.');
      return;
    }

    if (!narrator.trim()) {
      alert('Vui lòng nhập tên nhân chứng lịch sử hoặc người kể lại.');
      return;
    }

    if (!summary.trim() && !body.trim()) {
      alert('Vui lòng nhập nội dung hoặc tóm tắt câu chuyện.');
      return;
    }

    const categoryMap: Record<string, string> = {
      'phong-trao-doan': 'Ký ức Thành Đoàn & Kháng chiến',
      'thanh-nien-xung-phong': 'Thanh niên xung phong & Tiên phong',
      'tinh-nguyen': 'Tình nguyện vì cộng đồng',
      'bien-dao': 'Bảo vệ chủ quyền Biển đảo',
      'hoc-tap-bac': 'Học tập & Làm theo lời Bác',
      'me-viet-nam-anh-hung': 'Mẹ Việt Nam Anh Hùng & Hậu phương',
    };

    const provinceMap: Record<string, string> = {
      HCM: 'TP. Hồ Chí Minh',
      DL: 'Đà Lạt (Lâm Đồng)',
      HN: 'Hà Nội',
      DN: 'Đà Nẵng (gồm Quần đảo Hoàng Sa)',
      KH: 'Khánh Hòa (gồm Quần đảo Trường Sa)',
      DB: 'Điện Biên',
      QT: 'Quảng Trị',
      TN: 'Tây Ninh',
    };

    const coverUrl = images.length > 0 ? images[0] : '/images/thoi-hoa-lua-hero.jpg';

    const created = submitNewStory({
      title,
      narrator_name: narrator,
      contributor_name: contributor || user?.name || 'Đoàn viên thanh niên',
      contributor_unit: unit || 'Tổ dân phố - Phường Xuân Hương',
      summary: summary || body.slice(0, 180) + '...',
      body: body || summary,
      category_id: category,
      category_name: categoryMap[category] || 'Ký ức lịch sử',
      province_code: provinceCode,
      province_name: provinceMap[provinceCode] || 'TP. Hồ Chí Minh',
      event_year: eventYear ? Number(eventYear) : undefined,
      period,
      cover_url: coverUrl,
      images: images,
    });

    setSubmittedStory(created);
  };

  // MÀN HÌNH THÀNH CÔNG SAU KHI ĐĂNG
  if (submittedStory) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-2xl text-center max-w-2xl mx-auto animate-in zoom-in-95 my-8">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 border border-green-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3.5 py-1 rounded-full border border-red-200">
          Đăng bài thành công
        </span>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-3 mb-2">
          Cảm ơn đồng chí đã đóng góp trang nhật ký!
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Bài viết <strong>"{submittedStory.title}"</strong> đã được lưu thành công vào 
          <span className="text-red-700 font-bold"> Hàng đợi kiểm duyệt</span> của Ban Biên tập và đã được cộng điểm thi đua cho <strong>{submittedStory.contributor_unit}</strong>.
        </p>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 mb-8">
          <div>• <strong>Người kể lại / Nhân chứng:</strong> {submittedStory.narrator_name}</div>
          <div>• <strong>Đơn vị thi đua:</strong> <span className="font-bold text-slate-900">{submittedStory.contributor_unit}</span></div>
          <div>• <strong>Hình ảnh đính kèm:</strong> {images.length} ảnh tư liệu</div>
          <div>• <strong>Trạng thái:</strong> <span className="text-amber-700 font-bold">Đã lưu an toàn • Sẵn sàng đọc & xem trước</span></div>
        </div>

        {/* CÁC NÚT ĐIỀU HƯỚNG TỨC THÌ (XEM BÀI VIẾT VỪA ĐĂNG 100% KHÔNG 404) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={withBase(`/truyen/chi-tiet?slug=${submittedStory.slug}`)}
            className="w-full sm:w-auto px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Xem chi tiết bài viết vừa đăng ngay</span>
          </a>

          <a
            href={withBase('/quan-tri/duyet-bai')}
            className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sang Hàng đợi Duyệt bài</span>
          </a>

          <button
            onClick={() => {
              setSubmittedStory(null);
              setTitle('');
              setSummary('');
              setBody('');
              setNarrator('');
              setImages(['/images/thoi-hoa-lua-hero.jpg']);
              setActiveTab('edit');
            }}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Viết trang nhật ký tiếp theo
          </button>
        </div>
      </div>
    );
  }

  // GIAO DIỆN SOẠN THẢO BÀI VIẾT CHUẨN ENTERPRISE CÓ LIVE PREVIEW
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto my-6">
      
      {/* 1. HEADER COMPOSER: THÔNG TIN TÁC GIẢ & CHUYỂN TAB SOẠN THẢO / XEM TRƯỚC */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={user?.avatar || '/images/thoi-hoa-lua/logo-doan.webp'}
              alt={user?.name || 'Tác giả'}
              className="w-12 h-12 rounded-full object-cover border-2 border-red-700 shadow"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-700 text-amber-300 flex items-center justify-center text-[10px] font-bold shadow">
              ★
            </span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>{user?.name || 'Đoàn viên thanh niên / Cộng tác viên'}</span>
              <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full border border-red-200">
                Thi đua 37 TDP Xuân Hương
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <span>Đơn vị:</span>
              <strong className="text-slate-700">{unit}</strong>
            </div>
          </div>
        </div>

        {/* Nút chuyển đổi Tab Soạn thảo / Xem trước */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-red-700" />
            <span>Soạn thảo bài</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-red-700" />
            <span>Xem trước thẻ bài</span>
          </button>
        </div>
      </div>

      {/* 2. NỘI DUNG THEO TAB */}
      {activeTab === 'preview' ? (
        /* TAB XEM TRƯỚC (LIVE PREVIEW) */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-xs text-slate-500 font-medium">
            Dưới đây là hình thức hiển thị thực tế của bài viết khi đăng tải lên Thư viện và Trang chủ:
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="relative h-56 bg-slate-100 overflow-hidden">
              <img
                src={images[0] || '/images/thoi-hoa-lua-hero.jpg'}
                alt={title || 'Xem trước'}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="bg-slate-950/70 backdrop-blur text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                  📍 {provinceCode === 'DL' ? 'Đà Lạt (Lâm Đồng)' : 'TP. Hồ Chí Minh'}
                </span>
                {images.length > 1 && (
                  <span className="bg-slate-950/70 backdrop-blur text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    📷 {images.length} ảnh
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs text-slate-400 mb-1.5">Vừa xong • Chờ duyệt</div>
              <h3 className="font-serif font-bold text-slate-900 text-lg leading-snug mb-2">
                {title || 'Tiêu đề bài viết của bạn sẽ hiển thị tại đây...'}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {summary || body || 'Nội dung tóm tắt hồi ức lịch sử hoặc gương sáng học tập theo lời Bác...'}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <span className="text-slate-500">Kể:</span> <strong className="text-slate-800">{narrator || 'Chưa nhập'}</strong>
                  <div className="text-[10px] text-slate-400 truncate">{unit}</div>
                </div>
                <span className="px-3 py-1.5 bg-red-50 text-red-700 font-bold rounded-lg text-xs">
                  Đọc tiếp →
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="px-6 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition-colors"
            >
              Quay lại chỉnh sửa tiếp
            </button>
          </div>
        </div>
      ) : (
        /* TAB SOẠN THẢO CHÍNH */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Tiêu đề câu chuyện */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tiêu đề bài viết / Tên hồi ức lịch sử <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Ký ức thời hoa lửa của cựu chiến binh Phường Xuân Hương..."
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 font-serif font-bold text-base sm:text-lg focus:border-red-700 focus:ring-2 focus:ring-red-700/20 outline-none transition-all placeholder:font-sans placeholder:text-slate-400 placeholder:text-sm"
            />
          </div>

          {/* CHỌN NHANH ĐƠN VỊ THI ĐUA: 37 TỔ DÂN PHỐ P. XUÂN HƯƠNG HOẶC ĐOÀN CƠ SỞ */}
          <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-red-700" />
                <span>Chọn nhanh đơn vị tính điểm thi đua:</span>
              </label>
              <span className="text-[11px] text-red-700 font-semibold">37 Tổ dân phố P. Xuân Hương (Đà Lạt)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-600 block mb-1">Danh mục 37 Tổ dân phố P. Xuân Hương:</span>
                <select
                  onChange={(e) => handleSelectQuickUnit(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-red-700 cursor-pointer shadow-2xs"
                >
                  <option value="">-- Bấm chọn tổ dân phố của bạn --</option>
                  {Array.from({ length: 37 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={`Tổ dân phố ${num} - Phường Xuân Hương, TP. Đà Lạt`}>
                      Tổ dân phố {num} (Phường Xuân Hương, TP. Đà Lạt)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-600 block mb-1">Hoặc chọn cơ sở Đoàn TP.HCM & Đơn vị khác:</span>
                <select
                  onChange={(e) => handleSelectQuickUnit(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-red-700 cursor-pointer shadow-2xs"
                >
                  <option value="">-- Cơ sở Đoàn tiêu biểu --</option>
                  <option value="Quận Đoàn 1 - TP. Hồ Chí Minh">Quận Đoàn 1 - TP. Hồ Chí Minh</option>
                  <option value="Lực lượng Thanh niên Xung phong TP.HCM">Lực lượng Thanh niên Xung phong TP.HCM</option>
                  <option value="Đoàn Trường ĐH KHXH&NV - ĐHQG TP.HCM">Đoàn Trường ĐH KHXH&NV - ĐHQG TP.HCM</option>
                  <option value="Huyện Đoàn Cần Giờ - TP.HCM">Huyện Đoàn Cần Giờ - TP.HCM</option>
                  <option value="Chi đoàn Ban Phong trào Thành Đoàn TP.HCM">Chi đoàn Ban Phong trào Thành Đoàn TP.HCM</option>
                  <option value="Tuổi trẻ Vùng 4 Hải quân (Trường Sa - DK1)">Tuổi trẻ Vùng 4 Hải quân (Trường Sa - DK1)</option>
                </select>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-slate-600 block mb-1">Tên đơn vị hiển thị trên bài viết:</span>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Nhập tên tổ dân phố, chi đoàn hoặc đơn vị của bạn..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white outline-none focus:border-red-700"
              />
            </div>
          </div>

          {/* 3 THẺ THUỘC TÍNH: Chuyên đề, Địa phương, Thời kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-red-700" />
                <span>Chuyên đề</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-red-700 cursor-pointer"
              >
                <option value="phong-trao-doan">🏛️ Ký ức Thành Đoàn & Kháng chiến</option>
                <option value="thanh-nien-xung-phong">🎖️ Thanh niên xung phong kiên cường</option>
                <option value="tinh-nguyen">🤝 Tình nguyện vì cộng đồng (Mùa hè xanh)</option>
                <option value="bien-dao">🌊 Bảo vệ chủ quyền Biển đảo (Trường Sa, DK1)</option>
                <option value="hoc-tap-bac">⭐ Học tập & Làm theo lời Bác</option>
                <option value="me-viet-nam-anh-hung">🌹 Mẹ Việt Nam Anh Hùng & Hậu phương</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-700" />
                <span>Địa phương / Địa chỉ Đỏ</span>
              </label>
              <select
                value={provinceCode}
                onChange={(e) => setProvinceCode(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-red-700 cursor-pointer"
              >
                <option value="DL">🌸 Đà Lạt (Lâm Đồng - P. Xuân Hương)</option>
                <option value="HCM">📍 TP. Hồ Chí Minh (Sài Gòn - Gia Định)</option>
                <option value="HN">📍 Thủ đô Hà Nội</option>
                <option value="DN">📍 Đà Nẵng (gồm Quần đảo Hoàng Sa)</option>
                <option value="KH">📍 Khánh Hòa (gồm Quần đảo Trường Sa)</option>
                <option value="DB">📍 Điện Biên</option>
                <option value="QT">📍 Quảng Trị (Thành Cổ, Vĩ tuyến 17)</option>
                <option value="TN">📍 Tây Ninh (Căn cứ Trung ương Cục)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Thời kỳ lịch sử</span>
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-red-700 cursor-pointer"
              >
                <option value="1955-1975">⏳ 1955 - 1975: Kháng chiến chống Mỹ cứu nước</option>
                <option value="1945-1954">⏳ 1945 - 1954: Kháng chiến chống Pháp (Điện Biên Phủ)</option>
                <option value="1975-1988">⏳ 1975 - 1988: Xây dựng & Bảo vệ biên giới, hải đảo</option>
                <option value="1989-nay">⏳ 1989 đến nay: Thời kỳ Đổi mới & Hội nhập</option>
                <option value="1945-truoc">⏳ Trước 1945: Thành lập Đảng & phong trào giải phóng</option>
              </select>
            </div>
          </div>

          {/* THÔNG TIN NHÂN CHỨNG & NĂM SỰ KIỆN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-red-700" />
                <span>Nhân chứng / Người kể lại <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={narrator}
                onChange={(e) => setNarrator(e.target.value)}
                placeholder="Ví dụ: Bác Nguyễn Văn An (Cựu chiến binh, TDP 12)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-red-700 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-700" />
                <span>Năm diễn ra sự kiện (hoặc ghi nhận)</span>
              </label>
              <input
                type="number"
                value={eventYear}
                onChange={(e) => setEventYear(e.target.value ? Number(e.target.value) : '')}
                placeholder="Ví dụ: 1968, 1975, 2026..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-red-700 outline-none"
              />
            </div>
          </div>

          {/* Tóm tắt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Đoạn trích tóm tắt ý nghĩa bài viết</span>
              <span className="text-[11px] text-slate-400 font-normal">Hiển thị nổi bật đầu bài</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn 2-3 câu về câu chuyện, việc tốt hoặc chiến công hào hùng..."
              className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:border-red-700 outline-none leading-relaxed"
            />
          </div>

          {/* Nội dung chi tiết */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Nội dung chi tiết câu chuyện <span className="text-red-500">*</span></span>
              <span className="text-[11px] text-slate-400 font-normal">Hỗ trợ định dạng xuống dòng, in đậm **từ khóa**</span>
            </label>
            <textarea
              rows={6}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Ghi lại toàn văn lời kể của nhân chứng, hoàn cảnh lịch sử, những kỷ niệm xúc động và bài học noi gương Bác..."
              className="w-full p-4 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:border-red-700 outline-none leading-relaxed font-serif"
            />
          </div>

          {/* KHUNG ĐÍNH KÈM HÌNH ẢNH: FILE / KÉO THẢ / PASTE CTRL+V */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Hình ảnh tư liệu & Album Facebook</span>
              <span className="text-red-500 font-normal text-[11px]">(Hỗ trợ dán trực tiếp Ctrl+V từ clipboard)</span>
            </label>
            <ImageUploadBox
              images={images}
              onChange={setImages}
              maxImages={6}
            />
          </div>

          {/* Cam kết tính xác thực */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="commitCheck"
              checked={committed}
              onChange={(e) => setCommitted(e.target.checked)}
              className="mt-1 w-4 h-4 text-red-700 rounded border-amber-300 focus:ring-red-700 cursor-pointer"
            />
            <label htmlFor="commitCheck" className="text-xs text-amber-950 leading-relaxed cursor-pointer select-none">
              <strong>Cam kết tính trung thực:</strong> Tôi xin cam đoan những tư liệu, hồi ức và hình ảnh trên là trung thực, phản ánh khách quan nhân chứng lịch sử hoặc phong trào thi đua tại tổ dân phố, chi đoàn cơ sở.
            </label>
          </div>

          {/* Nút gửi bài */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Xem trước</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Đăng trang nhật ký ngay</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
