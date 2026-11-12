import React, { useState, useEffect, lazy, Suspense, Component } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen, Compass, ShieldCheck, Sparkles, Layers, AlertCircle } from 'lucide-react';

// Lazy load Highcharts component để tránh mọi lỗi SSR
const HighchartsVietnamMap = lazy(() => import('./vietnam-map-34/HighchartsVietnamMap'));

// Error Boundary để phòng ngừa 100% lỗi runtime không làm trắng màn hình
class MapErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('Map boundary caught error:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
  MN: {
    id: 'MN',
    name: 'Mũi Né — Phan Thiết (Bình Thuận)',
    code: 'BT',
    region: 'Duyên hải Nam Trung Bộ • Dấu ấn thời niên thiếu Bác Hồ',
    count: 530,
    highlight: 'Khu di tích Trường Dục Thanh bên bờ biển Phan Thiết - Mũi Né nơi thầy giáo Nguyễn Tất Thành (Bác Hồ) dừng chân dạy học năm 1910 trước khi vào Sài Gòn ra đi tìm đường cứu nước.',
    image: '/images/thoi-hoa-lua/story-1.jpg',
    featuredUnit: 'Thành Đoàn Phan Thiết & Tuổi trẻ Bình Thuận',
    coords: { x: 53, y: 73 }
  },
  CD: {
    id: 'CD',
    name: 'Côn Đảo (Bà Rịa — Vũng Tàu)',
    code: 'BV',
    region: 'Hòn đảo thiêng liêng • Biểu tượng bất khuất',
    count: 420,
    highlight: 'Nghĩa trang Hàng Dương, nơi yên nghỉ của nữ Anh hùng liệt sĩ Võ Thị Sáu, Tổng Bí thư Lê Hồng Phong, nhà yêu nước Nguyễn An Ninh và hàng vạn chiến sĩ cách mạng kiên trung.',
    image: '/images/thoi-hoa-lua/story-me-tien-con-ra-tran.jpg',
    featuredUnit: 'Huyện Đoàn Côn Đảo & Tuổi trẻ Côn Đảo',
    coords: { x: 46, y: 88 },
    isIsland: true
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
  const [viewMode, setViewMode] = useState<'highcharts' | 'svg'>('svg');
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
                <MapErrorBoundary
                  fallback={
                    <div className="py-12 px-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold mb-3 border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Chuyển sang chế độ Bản đồ SVG Ký Ức</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Trình duyệt đã tải Bản đồ SVG Ký Ức để hiển thị tức thì và mượt mà nhất.</p>
                      <button
                        type="button"
                        onClick={() => setViewMode('svg')}
                        className="px-4 py-2 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 transition-colors shadow-sm"
                      >
                        Xem Bản đồ SVG Ký Ức
                      </button>
                    </div>
                  }
                >
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
                          else if (p.name.includes('Bình Thuận') || p.name.includes('Mũi Né') || p.name.includes('Phan Thiết')) setSelectedKey('MN');
                          else if (p.name.includes('Vũng Tàu') || p.name.includes('Côn Đảo')) setSelectedKey('CD');
                        }
                      }}
                    />
                  </Suspense>
                </MapErrorBoundary>
              </div>
            ) : (
              /* BẢN ĐỒ SVG HÌNH CHỮ S TƯƠNG TÁC HÀO HÙNG (HOÀNG SA, TRƯỜNG SA, MŨI NÉ, ĐÀ LẠT, CÔN ĐẢO) */
              <div className="relative w-full h-[520px] select-none rounded-2xl bg-amber-50/40 p-2 overflow-hidden border border-amber-200/60">
                <svg viewBox="0 0 340 500" className="w-full h-full filter drop-shadow-md">
                  <defs>
                    <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#fee2e2" stopOpacity="0.9" />
                    </linearGradient>
                    <pattern id="seaPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 0 10 Q 5 5, 10 10 T 20 10" fill="none" stroke="#e0f2fe" strokeWidth="0.8" />
                    </pattern>
                  </defs>

                  {/* Nền biển Đông xanh dịu */}
                  <rect width="340" height="500" fill="#f8fafc" />
                  <rect width="340" height="500" fill="url(#seaPattern)" />

                  {/* Lãnh thổ Việt Nam hình chữ S duyên dáng, chuẩn địa lý */}
                  <path
                    d="M 75 45 
                       Q 115 35, 155 50 
                       Q 175 70, 145 95 
                       Q 125 115, 140 140 
                       Q 155 165, 145 195 
                       Q 135 220, 165 245 
                       Q 185 265, 175 295 
                       Q 160 325, 175 355 
                       Q 170 380, 145 395 
                       Q 125 405, 95 400 
                       Q 85 385, 105 370 
                       Q 120 355, 125 335 
                       Q 115 315, 105 325 
                       Q 95 315, 100 275 
                       Q 90 230, 105 180 
                       Q 85 140, 75 95 Z"
                    fill="url(#mapGradient)"
                    stroke="#dc2626"
                    strokeWidth="2.2"
                    className="transition-all"
                  />

                  {/* Đảo Phú Quốc (Kiên Giang) */}
                  <g className="cursor-pointer" onClick={() => setSelectedKey('HCM')}>
                    <ellipse cx="82" cy="405" rx="6" ry="12" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" transform="rotate(-15 82 405)" />
                    <text x="75" y="425" fontSize="7" fill="#c2410c" fontWeight="bold">Đ. PHÚ QUỐC</text>
                  </g>

                  {/* Quần đảo Côn Đảo (Bà Rịa - Vũng Tàu) */}
                  <g className="cursor-pointer" onClick={() => setSelectedKey('CD')}>
                    <ellipse cx="140" cy="435" rx="5" ry="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.2" />
                    <circle cx="148" cy="438" r="2.5" fill="#dc2626" />
                    <text x="120" y="452" fontSize="7.5" fill="#b91c1c" fontWeight="bold">Q.Đ CÔN ĐẢO</text>
                    <text x="120" y="460" fontSize="6.5" fill="#64748b">(Bà Rịa - Vũng Tàu)</text>
                  </g>

                  {/* Quần đảo Hoàng Sa thiêng liêng */}
                  <g className="cursor-pointer group" onClick={() => setSelectedKey('DN')}>
                    <rect x="215" y="180" width="85" height="58" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                    <rect x="220" y="186" width="10" height="7" fill="#dc2626" rx="1" />
                    <polygon points="225,188 226,191 224,191" fill="#facc15" />
                    <text x="235" y="193" fontSize="8.5" fill="#1e40af" fontWeight="900">Q.Đ HOÀNG SA</text>
                    <text x="220" y="206" fontSize="7" fill="#475569">Chủ quyền Việt Nam</text>
                    <text x="220" y="215" fontSize="6.5" fill="#64748b">(Thuộc TP. Đà Nẵng)</text>
                    {/* Các đảo thuộc Hoàng Sa */}
                    <circle cx="235" cy="225" r="3.5" fill="#dc2626" />
                    <text x="241" y="227" fontSize="6" fill="#1e3a8a">Đ. Hoàng Sa</text>
                    <circle cx="275" cy="222" r="3" fill="#dc2626" />
                    <text x="270" y="232" fontSize="6" fill="#1e3a8a">Đ. Phú Lâm</text>
                  </g>

                  {/* Quần đảo Trường Sa thiêng liêng */}
                  <g className="cursor-pointer group" onClick={() => setSelectedKey('KH')}>
                    <rect x="215" y="315" width="95" height="78" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                    <rect x="220" y="322" width="10" height="7" fill="#dc2626" rx="1" />
                    <polygon points="225,324 226,327 224,327" fill="#facc15" />
                    <text x="235" y="329" fontSize="8.5" fill="#1e40af" fontWeight="900">Q.Đ TRƯỜNG SA</text>
                    <text x="220" y="341" fontSize="7" fill="#475569">Chủ quyền Việt Nam</text>
                    <text x="220" y="350" fontSize="6.5" fill="#64748b">(H. Trường Sa - Khánh Hòa)</text>
                    {/* Các đảo và Cụm Nhà giàn DK1 */}
                    <circle cx="235" cy="362" r="3.5" fill="#dc2626" />
                    <text x="241" y="364" fontSize="6" fill="#1e3a8a">Đ. Song Tử</text>
                    <circle cx="275" cy="365" r="3.5" fill="#dc2626" />
                    <text x="260" y="375" fontSize="6" fill="#1e3a8a">Đ. Trường Sa Lớn</text>
                    <circle cx="240" cy="380" r="3" fill="#d97706" />
                    <text x="246" y="383" fontSize="6" fill="#92400e" fontWeight="bold">Nhà giàn DK1</text>
                  </g>

                  {/* Dòng chữ Biển Đông thiêng liêng */}
                  <text x="180" y="275" fontSize="12" fill="#94a3b8" fontWeight="bold" letterSpacing="4">BIỂN ĐÔNG</text>
                  <text x="180" y="290" fontSize="7.5" fill="#cbd5e1" fontStyle="italic">Vùng biển chủ quyền thiêng liêng của Tổ quốc</text>
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
                        <span className="absolute -inset-2 rounded-full bg-red-600/40 animate-ping"></span>
                      )}
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md border transition-all ${
                        isSelected
                          ? 'bg-red-700 text-white border-amber-300 ring-2 ring-red-400'
                          : prov.id === 'LD'
                          ? 'bg-amber-500 text-white border-amber-300 ring-1 ring-amber-400'
                          : prov.id === 'MN'
                          ? 'bg-emerald-600 text-white border-emerald-300'
                          : prov.isIsland
                          ? 'bg-blue-800 text-white border-blue-300'
                          : 'bg-white text-slate-800 border-slate-300'
                      }`}>
                        <span>{prov.id === 'LD' ? '🌸' : prov.id === 'MN' ? '🏖️' : isSelected ? '★' : '📍'}</span>
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
