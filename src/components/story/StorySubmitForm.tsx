import { useState, useEffect } from 'react';
import { submitNewStory, getCurrentUser, type UserSession } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import ImageUploadBox from '@/components/story/ImageUploadBox';
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
  Calendar
} from 'lucide-react';

export default function StorySubmitForm() {
  const [user, setUser] = useState<UserSession | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [narrator, setNarrator] = useState('');
  const [contributor, setContributor] = useState('');
  const [unit, setUnit] = useState('Chi đoàn Ban Phong trào Thành Đoàn TP.HCM');
  const [provinceCode, setProvinceCode] = useState('HCM');
  const [category, setCategory] = useState('phong-trao-doan');
  const [period, setPeriod] = useState('1955-1975');
  const [eventYear, setEventYear] = useState<number | ''>(1968);
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [images, setImages] = useState<string[]>(['/images/thoi-hoa-lua-hero.jpg']);
  const [committed, setCommitted] = useState(false);
  const [submittedStory, setSubmittedStory] = useState<any>(null);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setContributor(u.name);
      if (u.unit) setUnit(u.unit);
    }
  }, []);

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
      contributor_unit: unit || 'Đoàn Thanh niên TP.HCM',
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
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-doan-800 uppercase tracking-widest bg-doan-50 px-3.5 py-1 rounded-full border border-doan-200">
          Đăng bài thành công
        </span>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-3 mb-2">
          Cảm ơn đồng chí đã đóng góp trang nhật ký!
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Bài viết <strong>"{submittedStory.title}"</strong> đã được lưu thành công vào 
          <span className="text-redflag-800 font-bold"> Hàng đợi kiểm duyệt</span> của Ban Biên tập Thành Đoàn.
        </p>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 mb-8">
          <div>• <strong>Người kể:</strong> {submittedStory.narrator_name}</div>
          <div>• <strong>Đơn vị ghi chép:</strong> {submittedStory.contributor_unit}</div>
          <div>• <strong>Số lượng hình ảnh đính kèm:</strong> {images.length} ảnh</div>
          <div>• <strong>Trạng thái:</strong> <span className="text-amber-700 font-bold">Đang chờ Ban Biên tập duyệt & xuất bản</span></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={withBase('/quan-tri/duyet-bai')}
            className="w-full sm:w-auto px-6 py-3 bg-redflag-800 hover:bg-redflag-900 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center gap-2"
          >
            <span>🛡️ Sang Hàng đợi Quản trị để Duyệt bài ngay</span>
          </a>
          <button
            onClick={() => {
              setSubmittedStory(null);
              setTitle('');
              setSummary('');
              setBody('');
              setNarrator('');
              setImages(['/images/thoi-hoa-lua-hero.jpg']);
            }}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Viết trang nhật ký tiếp theo
          </button>
        </div>
      </div>
    );
  }

  // GIAO DIỆN SOẠN THẢO BÀI VIẾT PHONG CÁCH FACEBOOK & THỜI HOA LỬA
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto my-6">
      
      {/* 1. HEADER COMPOSER: THÔNG TIN TÁC GIẢ & THẺ PHÂN LOẠI NHƯ FACEBOOK */}
      <div className="p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Avatar & Thông tin đoàn viên */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user?.avatar || '/images/thoi-hoa-lua/logo-doan.webp'}
                alt={user?.name || 'Tác giả'}
                className="w-12 h-12 rounded-full object-cover border-2 border-doan-700 shadow"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-redflag-700 text-gold-300 flex items-center justify-center text-[10px] font-bold shadow">
                ★
              </span>
            </div>
            <div>
              <div className="font-serif font-black text-slate-900 text-base flex items-center gap-2">
                <span>{user?.name || 'Đoàn viên Thành phố'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-doan-100 text-doan-800 px-2 py-0.5 rounded-full">
                  Người đóng góp
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {unit || 'Thành Đoàn TP. Hồ Chí Minh'}
              </div>
            </div>
          </div>

          {/* Huy hiệu cam kết */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mỗi trang nhật ký là một đóa hoa dâng Bác</span>
          </div>

        </div>
      </div>

      {/* 2. KHUNG SOẠN THẢO NỘI DUNG CHÍNH */}
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
            placeholder="Ví dụ: Ký ức đêm thắp nến đấu tranh của học sinh - sinh viên Sài Gòn..."
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 font-serif font-bold text-lg focus:border-doan-700 focus:ring-2 focus:ring-doan-700/20 outline-none transition-all placeholder:font-sans placeholder:text-slate-400 placeholder:text-sm"
          />
        </div>

        {/* 3 THẺ THUỘC TÍNH: Chuyên đề, Địa phương, Thời kỳ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-doan-700" />
              <span>Chuyên đề</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-doan-700 cursor-pointer"
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
              <MapPin className="w-3.5 h-3.5 text-redflag-700" />
              <span>Địa phương / Địa chỉ Đỏ</span>
            </label>
            <select
              value={provinceCode}
              onChange={(e) => setProvinceCode(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-doan-700 cursor-pointer"
            >
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
              className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-doan-700 cursor-pointer"
            >
              <option value="1955-1975">⏳ 1955 - 1975: Kháng chiến chống Mỹ cứu nước</option>
              <option value="1945-1954">⏳ 1945 - 1954: Kháng chiến chống Pháp (Điện Biên Phủ)</option>
              <option value="1975-1988">⏳ 1975 - 1988: Xây dựng & Bảo vệ biên giới, hải đảo</option>
              <option value="1989-nay">⏳ 1989 đến nay: Thời kỳ Đổi mới & Hội nhập</option>
              <option value="1945-truoc">⏳ Trước 1945: Thành lập Đảng & phong trào giải phóng</option>
            </select>
          </div>
        </div>

        {/* THÔNG TIN NHÂN CHỨNG & ĐƠN VỊ GHI CHÉP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-doan-700" />
              <span>Nhân chứng / Người kể lại <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={narrator}
              onChange={(e) => setNarrator(e.target.value)}
              placeholder="Ví dụ: Bác Lê Văn Triết (Cựu cán bộ Đoàn)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-doan-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-doan-700" />
              <span>Chi đoàn / Đơn vị ghi chép</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Ví dụ: Đoàn Trường ĐH KHXH&NV TP.HCM..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-doan-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-doan-700" />
              <span>Năm diễn ra sự kiện</span>
            </label>
            <input
              type="number"
              value={eventYear}
              onChange={(e) => setEventYear(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ví dụ: 1968, 1975, 2024..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-doan-700 outline-none"
            />
          </div>
        </div>

        {/* Tóm tắt ngắn câu chuyện */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-doan-700" />
            <span>Đoạn tóm tắt nổi bật (câu mở đầu thu hút) <span className="text-red-500">*</span></span>
          </label>
          <textarea
            rows={2}
            required
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Tóm tắt ngắn gọn trong 2-3 câu về bối cảnh, nhân vật và bài học rút ra..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-doan-700 outline-none"
          />
        </div>

        {/* Nội dung chi tiết (hỗ trợ Markdown) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Nội dung chi tiết câu chuyện <span className="text-red-500">*</span></span>
            <span className="text-[11px] text-slate-400 font-normal">Hỗ trợ định dạng: ### Tiêu đề con, &gt; Trích dẫn, **In đậm**</span>
          </label>
          <textarea
            rows={9}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Kể lại chi tiết những kỷ niệm, hành động cụ thể, lời dặn của Bác Hồ và cảm nghĩ của thế hệ trẻ hôm nay..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-serif leading-relaxed focus:border-doan-700 outline-none"
          />
        </div>

        {/* 3. KHU VỰC TẢI ẢNH / PASTE TỪ CLIPBOARD / CHỌN KHO TƯ LIỆU */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Đính kèm hình ảnh tư liệu (Chọn file, Paste Ctrl+V, hoặc chọn từ Kho tư liệu)
          </label>
          <ImageUploadBox
            images={images}
            onChange={setImages}
            maxImages={8}
          />
        </div>

        {/* 4. CAM KẾT & NÚT GỬI BÀI */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer select-none bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <input
              type="checkbox"
              checked={committed}
              onChange={(e) => setCommitted(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-doan-800 rounded border-slate-300 focus:ring-doan-700 cursor-pointer"
            />
            <span className="text-xs text-amber-950 leading-relaxed">
              Tôi xin cam đoan những tư liệu, hồi ức và hình ảnh được cung cấp trên đây là trung thực, phù hợp với thuần phong mỹ tục và truyền thống yêu nước của dân tộc Việt Nam. Tôi đồng ý để Ban Biên tập Thành Đoàn TP.HCM thẩm định và biên tập xuất bản vào đề án.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>Bài viết sẽ xuất hiện trên Thư viện ngay sau khi Ban Biên tập duyệt.</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-redflag-700 via-doan-800 to-doan-900 hover:from-redflag-800 hover:to-doan-900 text-gold-300 font-serif font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Send className="w-5 h-5 text-gold-400" />
              <span>ĐĂNG CÂU CHUYỆN / GỬI DUYỆT NGAY</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
