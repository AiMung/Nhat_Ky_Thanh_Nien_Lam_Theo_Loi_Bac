import { useState } from 'react';
import { submitNewStory } from '@/lib/storage';
import { withBase } from '@/lib/utils';
import { CheckCircle2, Image as ImageIcon, Send, ShieldAlert } from 'lucide-react';

const COVER_PRESETS = [
  { label: 'Thời hoa lửa hào hùng', url: '/images/thoi-hoa-lua-hero.jpg' },
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

export default function StorySubmitForm() {
  const [title, setTitle] = useState('');
  const [narrator, setNarrator] = useState('');
  const [contributor, setContributor] = useState('');
  const [unit, setUnit] = useState('Chi đoàn Phường Bến Nghé, Quận 1');
  const [provinceCode, setProvinceCode] = useState('HCM');
  const [category, setCategory] = useState('phong-trao-doan');
  const [period, setPeriod] = useState('1989-nay');
  const [eventYear, setEventYear] = useState<number>(2024);
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0].url);
  const [committed, setCommitted] = useState(false);
  const [submittedStory, setSubmittedStory] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!committed) {
      alert('Vui lòng xác nhận cam kết tính trung thực của tư liệu trước khi gửi.');
      return;
    }

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

    const created = submitNewStory({
      title,
      narrator_name: narrator,
      contributor_name: contributor || 'Đoàn viên thanh niên',
      contributor_unit: unit,
      summary,
      body,
      category_id: category,
      category_name: categoryMap[category] || 'Nhật ký lịch sử',
      province_code: provinceCode,
      province_name: provinceMap[provinceCode] || 'TP. Hồ Chí Minh',
      event_year: eventYear,
      period,
      cover_url: coverUrl,
    });

    setSubmittedStory(created);
  };

  if (submittedStory) {
    return (
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl text-center max-w-2xl mx-auto animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-doan-800 uppercase tracking-widest bg-doan-50 px-3 py-1 rounded-full border border-doan-200">
          Gửi bài thành công
        </span>

        <h2 className="font-serif font-black text-2xl text-slate-900 mt-3 mb-2">
          Cảm ơn bạn đã đóng góp trang nhật ký!
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Bài viết <strong>"{submittedStory.title}"</strong> đã được lưu thành công vào 
          <span className="text-redflag-800 font-bold"> Hàng đợi kiểm duyệt</span> của Ban Biên tập Thành Đoàn.
        </p>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1 mb-8">
          <div>• <strong>Người kể:</strong> {submittedStory.narrator_name}</div>
          <div>• <strong>Đơn vị gửi:</strong> {submittedStory.contributor_unit}</div>
          <div>• <strong>Trạng thái:</strong> <span className="text-amber-700 font-bold">Đang chờ Ban Biên tập duyệt</span></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={withBase('/quan-tri/duyet-bai')}
            className="w-full sm:w-auto px-6 py-3 bg-redflag-800 hover:bg-redflag-900 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            🛡️ Sang màn hình Quản trị để DUYỆT BÀI NÀY NGAY
          </a>
          <button
            onClick={() => {
              setSubmittedStory(null);
              setTitle('');
              setSummary('');
              setBody('');
            }}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Viết trang nhật ký khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Tiêu đề */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Tiêu đề trang nhật ký / câu chuyện <span className="text-redflag-700">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ví dụ: Ký ức người chiến sĩ trẻ trên tuyến đường Trường Sơn huyền thoại..."
          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
        />
      </div>

      {/* Thông tin Người kể & Người gửi tách biệt sạch sẽ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Nhân chứng lịch sử / Người kể lại <span className="text-redflag-700">*</span>
          </label>
          <input
            type="text"
            required
            value={narrator}
            onChange={(e) => setNarrator(e.target.value)}
            placeholder="Ví dụ: Bác Nguyễn Văn An (Cựu cán bộ Thành Đoàn)"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Họ tên Đoàn viên / Người ghi chép <span className="text-redflag-700">*</span>
          </label>
          <input
            type="text"
            required
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            placeholder="Ví dụ: Nguyễn Thị Mai"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Đơn vị Chi đoàn */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Chi đoàn / Đơn vị trực thuộc <span className="text-redflag-700">*</span>
        </label>
        <input
          type="text"
          required
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Ví dụ: Đoàn Trường Đại học Khoa học Tự nhiên - ĐHQG TP.HCM"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
        />
      </div>

      {/* Địa phương, Chuyên đề, Thời kỳ & Năm */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Địa bàn xảy ra
          </label>
          <select
            value={provinceCode}
            onChange={(e) => setProvinceCode(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
          >
            <option value="HCM">TP. Hồ Chí Minh</option>
            <option value="HN">Hà Nội</option>
            <option value="DN">Đà Nẵng (gồm Hoàng Sa)</option>
            <option value="KH">Khánh Hòa (gồm Trường Sa)</option>
            <option value="DB">Điện Biên</option>
            <option value="QT">Quảng Trị</option>
            <option value="TN">Tây Ninh</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Chuyên đề
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
          >
            <option value="phong-trao-doan">Ký ức Thành Đoàn</option>
            <option value="thanh-nien-xung-phong">Thanh niên xung phong</option>
            <option value="tinh-nguyen">Tình nguyện cộng đồng</option>
            <option value="bien-dao">Bảo vệ Biển đảo</option>
            <option value="hoc-tap-bac">Học tập lời Bác</option>
            <option value="cong-trinh-thanh-nien">Công trình số</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Thời kỳ
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
          >
            <option value="1989-nay">1989 - Nay (Đổi mới)</option>
            <option value="1975-1988">1975 - 1988 (Biên giới, Rừng Sác)</option>
            <option value="1955-1975">1955 - 1975 (Kháng chiến chống Mỹ)</option>
            <option value="1945-1954">1945 - 1954 (Kháng chiến chống Pháp)</option>
            <option value="1945-truoc">Trước 1945</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Năm sự kiện
          </label>
          <input
            type="number"
            min={1900}
            max={2026}
            value={eventYear}
            onChange={(e) => setEventYear(Number(e.target.value))}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Tóm tắt */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Tóm tắt ý nghĩa nổi bật (1-2 câu súc tích) <span className="text-redflag-700">*</span>
        </label>
        <textarea
          required
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Tóm tắt ngắn gọn bối cảnh và bài học rèn luyện từ câu chuyện..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
        />
      </div>

      {/* Nội dung đầy đủ */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Nội dung nhật ký đầy đủ <span className="text-redflag-700">*</span>
        </label>
        <textarea
          required
          rows={7}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Kể lại chi tiết những kỷ niệm, hành động, lời dặn của Bác hoặc người đi trước đã dẫn dắt tuổi trẻ vượt qua khó khăn..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none"
        />
      </div>

      {/* Chọn Ảnh bìa tư liệu đẹp mắt sẵn có hoặc link ảnh */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-doan-700" />
          <span>Chọn hình ảnh minh họa chủ đề (Độ phân giải cao HD)</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
          {COVER_PRESETS.map((preset) => (
            <div
              key={preset.url}
              onClick={() => setCoverUrl(preset.url)}
              className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1 ${
                coverUrl === preset.url ? 'border-doan-800 ring-2 ring-doan-500 scale-105' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover rounded-lg mb-1" />
              <div className="text-[10px] font-bold text-slate-700 text-center truncate">{preset.label}</div>
            </div>
          ))}
        </div>

        <input
          type="url"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="Hoặc dán URL ảnh khác..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-doan-700 focus:outline-none"
        />
      </div>

      {/* Cam kết tính trung thực */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <label className="text-xs text-amber-900 leading-relaxed cursor-pointer select-none">
          <input
            type="checkbox"
            checked={committed}
            onChange={(e) => setCommitted(e.target.checked)}
            className="mr-2 rounded text-redflag-800 focus:ring-redflag-700"
          />
          Tôi cam đoan câu chuyện trên được ghi chép trung thực từ nhân chứng lịch sử hoặc phong trào thực tế, không bịa đặt, sai lệch với sự chỉ đạo của Thành Đoàn TP. Hồ Chí Minh.
        </label>
      </div>

      {/* Nút gửi */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-redflag-800 to-doan-900 hover:from-redflag-900 hover:to-doan-950 text-white font-serif font-black text-base shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
      >
        <Send className="w-5 h-5 text-gold-300" />
        <span>Gửi trang nhật ký vào Hàng đợi kiểm duyệt</span>
      </button>

    </form>
  );
}

