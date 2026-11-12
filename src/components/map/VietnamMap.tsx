import { useState, useEffect, lazy, Suspense } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen, Compass, ShieldCheck, Sparkles, Layers } from 'lucide-react';

// Lazy load Highcharts component để tránh mọi lỗi SSR
const HighchartsVietnamMap = lazy(() => import('./vietnam-map-34/HighchartsVietnamMap'));

interface ProvinceStoryData {
  id: string;
  name: string;
  code: string;
  region: string;
  count: number;
  highlight: string;
  image: string;
  featuredUnit?: string;
  coords: { x: number; y: number };
  isIsland?: boolean;
}

const PROVINCE_MAP: Record<string, ProvinceStoryData> = {
  LD: {
    id: 'LD',
    name: 'Lâm Đồng (TP. Đà Lạt — Phường Xuân Hương)',
    code: 'LD',
    region: 'Cao nguyên Lâm Viên • Đơn vị thi đua trọng điểm',
    count: 680,
    highlight: 'Thành phố ngàn hoa anh hùng, nơi 37 Tổ Dân Phố Phường Xuân Hương và tuổi trẻ Đà Lạt thi đua số hóa ký ức lịch sử, chiến dịch Mùa hè xanh và phong trào Tuổi trẻ học tập và làm theo lời Bác.',
    image: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
    featuredUnit: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương & 37 Tổ Dân Phố',
    coords: { x: 50, y: 68 }
  },
  HCM: {
    id: 'HCM',
    name: 'Thành phố Hồ Chí Minh',
    code: 'HCM',
    region: 'Đô thị đặc biệt phía Nam',
    count: 2450,
    highlight: 'Nơi Bác Hồ ra đi tìm đường cứu nước (Bến Nhà Rồng), Căn cứ Núi Dinh, Hầm vũ khí Biệt động Sài Gòn, Lá phổi xanh Rừng Sác Cần Giờ và Chiến dịch Mùa hè xanh huyền thoại.',
    image: '/images/thoi-hoa-lua-hero.jpg',
    featuredUnit: 'Thành Đoàn TP. Hồ Chí Minh & Thanh niên xung phong',
    coords: { x: 42, y: 76 }
  },
  HN: {
    id: 'HN',
    name: 'Thủ đô Hà Nội',
    code: 'HN',
    region: 'Trái tim cả nước',
    count: 1820,
    highlight: 'Quảng trường Ba Đình lịch sử, Lăng Chủ tịch Hồ Chí Minh, Khu di tích Phủ Chủ tịch và khúc tráng ca Hà Nội 12 ngày đêm Điện Biên Phủ trên không.',
    image: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg',
    featuredUnit: 'Thành Đoàn Hà Nội & Tự vệ Thủ đô',
    coords: { x: 38, y: 18 }
  },
  KH: {
    id: 'KH',
    name: 'Quần đảo Trường Sa (Khánh Hòa)',
    code: 'KH',
    region: 'Quân dân Thềm lục địa phía Nam',
    count: 890,
    highlight: 'Nơi tuổi đôi mươi người lính Hải quân gìn giữ từng cột mốc chủ quyền tại 21 đảo, 33 điểm đóng quân thuộc huyện đảo Trường Sa và cụm Nhà giàn DK1 kiên trung bất khuất.',
    image: '/images/truong-sa-chu-quyen.jpg',
    featuredUnit: 'Vùng 4 Hải quân & Huyện đảo Trường Sa',
    coords: { x: 78, y: 79 },
    isIsland: true
  },
  DN: {
    id: 'DN',
    name: 'Quần đảo Hoàng Sa (Đà Nẵng)',
    code: 'DN',
    region: 'Miền Trung kiên cường • Biển đảo thiêng liêng',
    count: 780,
    highlight: 'Huyện đảo Hoàng Sa thiêng liêng của Tổ quốc - Nơi thanh niên và nhân dân cả nước luôn khắc ghi ý chí giữ vững chủ quyền biển đảo ngàn đời của cha ông.',
    image: '/images/thoi-hoa-lua/cat-bien-dao.jpg',
    featuredUnit: 'Thành Đoàn Đà Nẵng & Huyện đảo Hoàng Sa',
    coords: { x: 74, y: 46 },
    isIsland: true
  },
  QT: {
    id: 'QT',
    name: 'Quảng Trị',
    code: 'QT',
    region: 'Tuyến lửa Vĩ tuyến 17',
    count: 1150,
    highlight: 'Thành Cổ Quảng Trị 81 ngày đêm máu lửa, Dòng sông Thạch Hãn huyền thoại, Cầu Hiền Lương và Nghĩa trang Liệt sĩ Quốc gia Trường Sơn.',
    image: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    featuredUnit: 'Tỉnh Đoàn Quảng Trị',
    coords: { x: 46, y: 39 }
  },
  DB: {
    id: 'DB',
    name: 'Điện Biên',
    code: 'DB',
    region: 'Tây Bắc hùng vĩ',
    count: 620,
    highlight: 'Chiến thắng Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu" - Tinh thần thanh niên xung phong mở đường Thắng Lợi bạt núi kéo pháo.',
    image: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg',
    featuredUnit: 'Tỉnh Đoàn Điện Biên',
    coords: { x: 22, y: 14 }
  }
};

export default function VietnamMap() {
  const [selectedKey, setSelectedKey] = useState<string>('LD');
  const [viewMode, setViewMode] = useState<'highcharts' | 'svg'>('highcharts');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const current = PROVINCE_MAP[selectedKey] || PROVINCE_MAP.LD;

  // Dữ liệu tô màu nhiệt Highcharts cho các tỉnh
  const highchartsData = [
    { name: 'Lâm Đồng', value: 680 },
    { name: 'Hồ Chí Minh', value: 2450 },
    { name: 'Hà Nội', value: 1820 },
    { name: 'Đà Nẵng', value: 780 },
    { name: 'Khánh Hòa', value: 890 },
    { name: 'Quảng Trị', value: 1150 },
    { name: 'Điện Biên', value: 620 },
    { name: 'Tây Ninh', value: 510 },
    { name: 'Thanh Hóa', value: 430 },
    { name: 'Nghệ An', value: 480 },
    { name: 'Hải Phòng', value: 490 },
    { name: 'Đồng Nai', value: 410 },
    { name: 'Cần Thơ', value: 390 },
    { name: 'Huế', value: 460 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      
      {/* 1. HEADER BANNER BẢN ĐỒ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-red-700" />
            <span>Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — TP. Đà Lạt</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            Bản Đồ Ký Ức Lịch Sử & Địa Chỉ Đỏ Toàn Quốc
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ứng dụng bản đồ 34 tỉnh/thành phố • Địa bàn trọng điểm: <strong>37 Tổ Dân Phố Phường Xuân Hương (Đà Lạt)</strong>
          </p>
        </div>

        {/* Nút chuyển đổi giao diện & chọn nhanh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút chuyển kiểu xem: Highcharts 34 tỉnh hoặc Bản đồ SVG */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('highcharts')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'highcharts'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bản đồ 34 Tỉnh/TP
            </button>
            <button
              type="button"
              onClick={() => setViewMode('svg')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'svg'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bản đồ Ký Ức SVG
            </button>
          </div>

          {/* Chọn nhanh địa bàn trọng điểm */}
          <button
            type="button"
            onClick={() => setSelectedKey('LD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedKey === 'LD'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span>🌸 P. Xuân Hương (Đà Lạt)</span>
          </button>
        </div>
      </div>

      {/* 2. NỘI DUNG CHÍNH (2 CỘT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CỘT TRÁI: VÙNG BẢN ĐỒ TƯƠNG TÁC */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-inner flex flex-col justify-between">
          
          <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-slate-200">
            <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>{viewMode === 'highcharts' ? 'Bản đồ 34 tỉnh/thành (@xdev-asia)' : 'Bản đồ hình chữ S & Điểm sáng ký ức'}</span>
            </span>
            <span className="text-[11px] text-red-700 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              Đang chọn: <strong>{current.name.split(' (')[0]}</strong>
            </span>
          </div>

          {/* KHUNG HIỂN THỊ BẢN ĐỒ */}
          <div className="relative w-full min-h-[460px] sm:min-h-[520px] rounded-2xl overflow-hidden bg-white border border-slate-200/80 p-2 flex items-center justify-center">
            
            {viewMode === 'highcharts' && isClient ? (
              /* BẢN ĐỒ HIGHCHARTS 34 TỈNH THÀNH */
              <div className="w-full h-full">
                <Suspense
                  fallback={
                    <div className="py-20 text-center">
                      <div className="w-8 h-8 border-3 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-slate-500 text-xs">Đang tải bản đồ 34 tỉnh thành...</p>
                    </div>
                  }
                >
                  <HighchartsVietnamMap
                    height={500}
                    data={highchartsData}
                    onProvinceClick={(p) => {
                      if (p && p.name) {
                        if (p.name.includes('Lâm Đồng') || p.name.includes('Đà Lạt')) setSelectedKey('LD');
                        else if (p.name.includes('Hồ Chí Minh') || p.name.includes('Sài Gòn')) setSelectedKey('HCM');
                        else if (p.name.includes('Hà Nội')) setSelectedKey('HN');
                        else if (p.name.includes('Đà Nẵng')) setSelectedKey('DN');
                        else if (p.name.includes('Khánh Hòa')) setSelectedKey('KH');
                        else if (p.name.includes('Quảng Trị')) setSelectedKey('QT');
                        else if (p.name.includes('Điện Biên')) setSelectedKey('DB');
                      }
                    }}
                  />
                </Suspense>
              </div>
            ) : (
              /* BẢN ĐỒ SVG HÌNH CHỮ S TƯƠNG TÁC (LUÔN HOẠT ĐỘNG 100% KHÔNG BAO GIỜ TRẮNG TRƠN) */
              <div className="relative w-full h-[460px] select-none">
                <svg viewBox="0 0 320 480" className="w-full h-full filter drop-shadow-md">
                  <path
                    d="M 80 55 Q 120 40, 160 60 Q 180 80, 140 100 Q 120 120, 145 150 Q 160 175, 150 200 Q 140 230, 180 250 Q 200 270, 180 300 Q 160 330, 175 360 Q 165 385, 130 395 Q 100 405, 95 380 Q 120 365, 125 340 Q 115 315, 105 330 Q 90 320, 100 280 Q 90 230, 110 180 Q 90 140, 80 100 Z"
                    fill="#f8fafc"
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />

                  {/* Quần đảo Hoàng Sa */}
                  <g className="cursor-pointer" onClick={() => setSelectedKey('DN')}>
                    <rect x="210" y="195" width="65" height="45" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="215" y="210" fontSize="8" fill="#1e40af" fontWeight="bold">Q.Đ HOÀNG SA</text>
                    <text x="215" y="222" fontSize="7" fill="#64748b">(Đà Nẵng)</text>
                    <circle cx="230" cy="230" r="3" fill="#dc2626" />
                    <circle cx="245" cy="225" r="2.5" fill="#dc2626" />
                    <circle cx="255" cy="232" r="3" fill="#dc2626" />
                  </g>

                  {/* Quần đảo Trường Sa */}
                  <g className="cursor-pointer" onClick={() => setSelectedKey('KH')}>
                    <rect x="220" y="340" width="75" height="55" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="225" y="355" fontSize="8" fill="#1e40af" fontWeight="bold">Q.Đ TRƯỜNG SA</text>
                    <text x="225" y="367" fontSize="7" fill="#64748b">(Khánh Hòa) & DK1</text>
                    <circle cx="240" cy="378" r="3.5" fill="#dc2626" />
                    <circle cx="255" cy="372" r="2.5" fill="#dc2626" />
                    <circle cx="270" cy="382" r="3" fill="#dc2626" />
                  </g>

                  <text x="175" y="290" fontSize="11" fill="#cbd5e1" fontWeight="bold" letterSpacing="3">BIỂN ĐÔNG</text>
                </svg>

                {/* Các điểm Pin phát sáng */}
                {Object.values(PROVINCE_MAP).map((prov) => {
                  const isSelected = prov.id === selectedKey;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setSelectedKey(prov.id)}
                      style={{ left: `${prov.coords.x}%`, top: `${prov.coords.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform z-20 ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -inset-2 rounded-full bg-red-600/30 animate-ping"></span>
                      )}
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md border transition-all ${
                        isSelected
                          ? 'bg-red-700 text-white border-amber-300 ring-2 ring-red-400'
                          : prov.id === 'LD'
                          ? 'bg-amber-500 text-white border-amber-300'
                          : prov.isIsland
                          ? 'bg-blue-800 text-white border-blue-300'
                          : 'bg-white text-slate-800 border-slate-300'
                      }`}>
                        <span>{prov.id === 'LD' ? '🌸' : isSelected ? '★' : '📍'}</span>
                        <span className="whitespace-nowrap">{prov.name.split(' (')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Dải nút chọn địa bàn nhanh bên dưới */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 border-t border-slate-200 mt-3">
            {Object.values(PROVINCE_MAP).map((prov) => (
              <button
                key={prov.id}
                type="button"
                onClick={() => setSelectedKey(prov.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  prov.id === selectedKey
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {prov.name.split(' (')[0]} ({prov.count})
              </button>
            ))}
          </div>

          {/* Khẳng định chủ quyền Hoàng Sa & Trường Sa */}
          <div className="mt-3 p-2.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs flex items-center gap-2 text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="font-semibold text-[11px]">
              Chủ quyền thiêng liêng: <strong>Quần đảo Hoàng Sa (Đà Nẵng)</strong> & <strong>Quần đảo Trường Sa (Khánh Hòa)</strong>.
            </span>
          </div>

        </div>

        {/* CỘT PHẢI: KHUNG CHI TIẾT TƯ LIỆU VÀ ĐƠN VỊ THI ĐUA */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          
          <div className="relative rounded-2xl overflow-hidden shadow-md group h-56 sm:h-64 bg-slate-900">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                {current.region}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif font-black text-2xl text-white drop-shadow">
                {current.name}
              </h3>
              {current.featuredUnit && (
                <div className="text-xs text-amber-300 font-semibold mt-1">
                  ★ {current.featuredUnit}
                </div>
              )}
            </div>
          </div>

          {/* Dấu ấn lịch sử & phong trào */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-700" />
              <span>Dấu ấn lịch sử & phong trào thanh niên:</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {current.highlight}
            </p>
          </div>

          {/* Số liệu thống kê bài viết */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <div className="font-serif font-black text-2xl sm:text-3xl text-red-700">
                {current.count.toLocaleString()}+
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Trang nhật ký & Tư liệu lưu giữ
              </div>
            </div>

            <a
              href={withBase(`/thu-vien?province=${current.code}`)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám phá tư liệu</span>
              <span>→</span>
            </a>
          </div>

          {/* Lời kêu gọi thi đua dành cho 37 Tổ Dân Phố Phường Xuân Hương */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50/50 rounded-2xl border border-red-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-700 text-amber-300 flex items-center justify-center font-bold text-base shrink-0">
              🌸
            </div>
            <div className="text-xs text-slate-700 leading-snug">
              <strong className="text-slate-900 block font-bold mb-0.5">
                Phong trào thi đua 37 Tổ Dân Phố Phường Xuân Hương (Đà Lạt)
              </strong>
              Cán bộ, nhân dân và đoàn viên các tổ dân phố hãy cùng đóng góp bài viết để thắp sáng bản đồ ký ức!
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
