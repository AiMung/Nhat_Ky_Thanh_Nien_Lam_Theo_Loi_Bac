import { useState, useEffect } from 'react';
import { withBase } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';

interface Milestone {
  year: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  quote: string;
  period: string;
  img: string;
  storySlug: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '1931',
    badge: 'Mốc son Khai sinh',
    title: 'Thành lập Đoàn TNCS Đông Dương',
    subtitle: 'Ngọn đuốc soi đường của tuổi trẻ Việt Nam',
    desc: 'Tại Hội nghị BCH Trung ương Đảng lần thứ 2 (20-26/3/1931), Trung ương Đảng đã quyết định thành lập tổ chức thanh niên cộng sản, mở ra kỷ nguyên rèn luyện và chiến đấu oanh liệt của tuổi trẻ nước nhà dưới sự dìu dắt của Bác Hồ.',
    quote: 'Tuổi trẻ là mùa xuân của xã hội — Chủ tịch Hồ Chí Minh',
    period: '1945-truoc',
    img: '/images/thoi-hoa-lua/story-1.jpg',
    storySlug: 'loi-dan-cua-bac-voi-thanh-nien-sai-gon-gia-dinh'
  },
  {
    year: '1954',
    badge: 'Thiên sử vàng Điện Biên',
    title: 'Chiến thắng Điện Biên Phủ "Lừng lẫy năm châu"',
    subtitle: 'Tuổi mười chín đôi mươi bạt núi kéo pháo',
    desc: '56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt. Tinh thần thanh niên xung phong mở đường Thắng Lợi và sự hy sinh kiên cường của các anh hùng Phan Đình Giót, Tô Vĩnh Diện, Bế Văn Đàn làm nên chiến thắng địa cầu.',
    quote: 'Dốc Pha Đin, chị gánh anh thồ / Đèo Lũng Lô, anh hò chị hát',
    period: '1945-1954',
    img: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg',
    storySlug: 'chien-dich-dien-bien-phu-lung-lay-nam-chau'
  },
  {
    year: '1968',
    badge: 'Bão lửa Sài Gòn',
    title: 'Tổng tiến công Mậu Thân & Phong trào HSSV',
    subtitle: 'Ngọn lửa Biệt động thành bùng cháy giữa đô thành',
    desc: 'Những đêm thắp nến không ngủ, phong trào "Hát cho đồng bào tôi nghe" hòa cùng súng lệnh của Đội Biệt động Sài Gòn tấn công thẳng vào cơ quan đầu não địch, khẳng định khí phách bất khuất của tuổi trẻ thành đồng.',
    quote: 'Dậy mà đi! Dậy mà đi! Hỡi đồng bào ơi...',
    period: '1955-1975',
    img: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    storySlug: 'loi-dan-cua-bac-voi-thanh-nien-sai-gon-gia-dinh'
  },
  {
    year: '1972',
    badge: 'Điện Biên Phủ trên không',
    title: 'Hà Nội 12 ngày đêm kiên cường',
    subtitle: 'Quân dân Thủ đô đập tan pháo đài bay B-52',
    desc: 'Cuộc tập kích chiến lược bằng pháo đài bay B-52 bị bẻ gãy hoàn toàn. Hàng vạn thanh niên, tự vệ Hà Nội bám trụ trận địa, bắt sống phi công Mỹ, buộc đối phương phải ký Hiệp định Paris lập lại hòa bình.',
    quote: 'Hà Nội - Bản hùng ca bất tử của ý chí quật cường',
    period: '1955-1975',
    img: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg',
    storySlug: 'ha-noi-12-ngay-dem-dien-bien-phu-tren-khong'
  },
  {
    year: '1975',
    badge: 'Đại thắng Mùa Xuân',
    title: 'Chiến dịch Hồ Chí Minh - Non sông thu về một mối',
    subtitle: 'Tuổi trẻ tiếp quản và chung tay dựng xây Thành phố',
    desc: '11 giờ 30 phút ngày 30/4/1975, lá cờ chiến thắng tung bay trên nóc Dinh Độc Lập. Hàng chục ngàn thanh niên Sài Gòn hân hoan đón đoàn quân giải phóng, cùng thắt chặt tay nhau giữ gìn trật tự và bắt tay vào hàn gắn vết thương chiến tranh.',
    quote: 'Mùa xuân đại thắng - Đất nước trọn niềm vui sum họp',
    period: '1955-1975',
    img: '/images/thoi-hoa-lua/timeline-1975.jpg',
    storySlug: 'chuyen-nhung-chiec-ao-xanh-rung-sac-can-gio'
  },
  {
    year: '1988',
    badge: 'Chủ quyền Biển đảo',
    title: 'Vòng tròn bất tử Gạc Ma & Giữ vững Trường Sa',
    subtitle: 'Máu của những người lính trẻ hòa vào biển mẹ thiêng liêng',
    desc: 'Ngày 14/3/1988, 64 chiến sĩ Hải quân đã nắm chặt tay nhau kết thành "Vòng tròn bất tử", lấy thân mình làm lá chắn bảo vệ ngọn cờ Tổ quốc trên đá Gạc Ma. Bản hùng ca bất tử khẳng định chủ quyền không thể chối cãi của Việt Nam.',
    quote: 'Không được lùi bước, phải để máu mình tô thắm cờ Tổ quốc',
    period: '1975-1988',
    img: '/images/truong-sa-chu-quyen.jpg',
    storySlug: 'la-thu-gui-tu-nha-gian-dk1-va-tinh-yeu-bien-dao'
  },
  {
    year: 'Nay',
    badge: 'Khát vọng Tương lai',
    title: 'Mùa Hè Xanh & Tuổi trẻ TP.HCM chuyển đổi số',
    subtitle: 'Nối tiếp ngọn lửa truyền thống - Tiên phong hội nhập',
    desc: 'Kế thừa tinh thần Thanh niên xung phong giải phóng Rừng Sác Cần Giờ, phong trào Tình nguyện Mùa Hè Xanh và Đề án Số hóa 100 Địa chỉ Đỏ của Thành Đoàn đang lan tỏa mạnh mẽ, ứng dụng công nghệ số phụng sự cộng đồng.',
    quote: 'Đâu cần thanh niên có, việc gì khó có thanh niên',
    period: '1989-nay',
    img: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
    storySlug: 'chuyen-nhung-chiec-ao-xanh-rung-sac-can-gio'
  }
];

export default function InteractiveTimelineGsap() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const cur = MILESTONES[activeIdx];

  const handleSelect = (idx: number) => {
    if (idx === activeIdx || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setAnimating(false);
    }, 150);
  };

  const handleNext = () => {
    handleSelect((activeIdx + 1) % MILESTONES.length);
  };

  const handlePrev = () => {
    handleSelect((activeIdx - 1 + MILESTONES.length) % MILESTONES.length);
  };

  return (
    <div className="w-full">
      
      {/* 1. TRỤC ĐIỀU HƯỚNG MỐC SON THỜI GIAN (INTERACTIVE GSAP-STYLE TIMELINE) */}
      <div className="relative mb-8 pb-3">
        {/* Đường ray trục thời gian vàng rực rỡ */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 rounded-full z-0 opacity-40 shadow-xs"></div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
          {MILESTONES.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={item.year}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`group relative p-3 sm:p-4 rounded-2xl text-center transition-all duration-300 cursor-pointer flex flex-col justify-between items-center ${
                  isActive
                    ? 'bg-gradient-to-b from-red-700 to-red-800 text-white shadow-xl scale-105 border-2 border-amber-400 ring-4 ring-amber-400/20'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 hover:border-red-600/50 shadow-xs'
                }`}
              >
                {/* Nốt sao vàng phát sáng */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                  isActive
                    ? 'bg-amber-400 text-red-900 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-red-700'
                }`}>
                  ★
                </div>

                <div className={`font-serif font-black text-xl sm:text-2xl mt-1 tracking-tight ${
                  isActive ? 'text-amber-300' : 'text-slate-900 group-hover:text-red-700'
                }`}>
                  {item.year}
                </div>

                <div className={`text-[10px] font-medium line-clamp-1 mt-1 leading-tight ${
                  isActive ? 'text-amber-100 font-semibold' : 'text-slate-500'
                }`}>
                  {item.badge}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THẺ SHOWCASE MỐC LỊCH SỬ CHUYỂN CẢNH MƯỢT MÀ */}
      <div className={`bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ${animating ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Cột ảnh tư liệu sắc nét */}
          <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[360px] bg-slate-900 overflow-hidden group">
            <img
              src={cur.img}
              alt={cur.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-red-700/90 backdrop-blur text-amber-200 text-xs font-black px-3 py-1 rounded-full shadow border border-amber-400/30">
                Năm {cur.year}
              </span>
              <span className="bg-slate-950/70 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                {cur.badge}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs text-amber-200 italic font-serif leading-relaxed bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                "{cur.quote}"
              </p>
            </div>
          </div>

          {/* Cột thông tin chi tiết */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-red-700" />
                <span>Biên niên sử vàng Tuổi trẻ</span>
              </div>

              <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 leading-tight">
                {cur.title}
              </h3>

              <div className="text-sm font-semibold text-amber-700 mt-1 mb-4 flex items-center gap-1.5">
                <span>✦</span>
                <span>{cur.subtitle}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                {cur.desc}
              </p>
            </div>

            {/* Chân thẻ: Điều hướng & Nút xem chi tiết */}
            <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-red-700 transition-colors"
                  title="Mốc trước đó"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs text-slate-500 font-semibold px-2">
                  {activeIdx + 1} / {MILESTONES.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-red-700 transition-colors"
                  title="Mốc kế tiếp"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={withBase(`/truyen/chi-tiet?slug=${cur.storySlug}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Đọc trang ký ức này</span>
                </a>
                <a
                  href={withBase(`/thu-vien?period=${cur.period}`)}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <span>Xem thời kỳ {cur.year}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
