import { useState } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen, Compass, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

interface ProvinceInfo {
  id: string;
  name: string;
  count: number;
  region: string;
  highlight: string;
  image: string;
  coords: { x: number; y: number }; // Vị trí phần trăm trên bản đồ SVG
  isIsland?: boolean;
}

const PROVINCE_MAP: Record<string, ProvinceInfo> = {
  HCM: {
    id: 'HCM',
    name: 'TP. Hồ Chí Minh',
    count: 2450,
    region: 'Đô thị đặc biệt phía Nam',
    highlight: 'Nơi Bác Hồ ra đi tìm đường cứu nước (Bến Nhà Rồng), Căn cứ Núi Dinh, Hầm vũ khí Biệt động Sài Gòn, Lá phổi xanh Rừng Sác Cần Giờ và Chiến dịch Mùa hè xanh huyền thoại.',
    image: '/images/thoi-hoa-lua-hero.jpg',
    coords: { x: 42, y: 76 }
  },
  DL: {
    id: 'DL',
    name: 'Đà Lạt (Lâm Đồng)',
    count: 530,
    region: 'Cao nguyên Lâm Viên - P. Xuân Hương',
    highlight: 'Thành phố ngàn hoa kiên cường, nơi 37 Tổ Dân Phố Phường Xuân Hương và thế hệ trẻ thi đua số hóa ký ức kháng chiến, công trình thanh niên và việc tốt học tập lời Bác.',
    image: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
    coords: { x: 50, y: 68 }
  },
  KH: {
    id: 'KH',
    name: 'Quần đảo Trường Sa (Khánh Hòa)',
    count: 890,
    region: 'Quân dân Thềm lục địa phía Nam',
    highlight: 'Nơi tuổi đôi mươi người lính Hải quân gìn giữ từng cột mốc chủ quyền tại 21 đảo, 33 điểm đóng quân thuộc huyện đảo Trường Sa và cụm Nhà giàn DK1 kiên trung.',
    image: '/images/truong-sa-chu-quyen.jpg',
    coords: { x: 78, y: 79 },
    isIsland: true
  },
  DN: {
    id: 'DN',
    name: 'Quần đảo Hoàng Sa (Đà Nẵng)',
    count: 680,
    region: 'Miền Trung kiên cường',
    highlight: 'Huyện đảo Hoàng Sa thiêng liêng của Tổ quốc - Nơi thanh niên và nhân dân cả nước luôn khắc ghi ý chí giữ vững chủ quyền biển đảo ngàn đời của cha ông.',
    image: '/images/thoi-hoa-lua/cat-bien-dao.jpg',
    coords: { x: 74, y: 46 },
    isIsland: true
  },
  QT: {
    id: 'QT',
    name: 'Quảng Trị',
    count: 1150,
    region: 'Tuyến lửa Vĩ tuyến 17',
    highlight: 'Thành Cổ Quảng Trị 81 ngày đêm máu lửa, Dòng sông Thạch Hãn huyền thoại, Cầu Hiền Lương và Nghĩa trang Liệt sĩ Quốc gia Trường Sơn.',
    image: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    coords: { x: 46, y: 39 }
  },
  HN: {
    id: 'HN',
    name: 'Thủ đô Hà Nội',
    count: 1820,
    region: 'Trái tim cả nước',
    highlight: 'Quảng trường Ba Đình lịch sử, Lăng Chủ tịch Hồ Chí Minh, Khu di tích Phủ Chủ tịch - Nơi Bác sống và làm việc trọn đời vì non sông đất nước.',
    image: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg',
    coords: { x: 38, y: 18 }
  },
  DB: {
    id: 'DB',
    name: 'Điện Biên',
    count: 620,
    region: 'Tây Bắc hùng vĩ',
    highlight: 'Chiến thắng Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu" - Tinh thần thanh niên xung phong mở đường Thắng Lợi bạt núi kéo pháo.',
    image: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg',
    coords: { x: 22, y: 14 }
  },
};

export default function VietnamMap() {
  const [selectedKey, setSelectedKey] = useState<string>('HCM');
  const current = PROVINCE_MAP[selectedKey] || PROVINCE_MAP.HCM;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* CỘT TRÁI: BẢN ĐỒ VIỆT NAM HÌNH CHỮ S TƯƠNG TÁC THỰC SỰ */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full bg-gradient-to-b from-blue-50/50 via-slate-50 to-blue-50/30 rounded-3xl p-5 border border-slate-200 relative overflow-hidden shadow-inner">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-red-700" />
                <span>Bản đồ Ký ức Lịch sử Việt Nam</span>
              </span>
              <span className="text-[11px] text-red-700 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Chạm vào các điểm để xem
              </span>
            </div>

            {/* KHUNG BẢN ĐỒ HÌNH CHỮ S & QUẦN ĐẢO */}
            <div className="relative w-full h-[430px] sm:h-[480px] my-2 select-none">
              
              {/* SVG Hình Dáng Bản Đồ Việt Nam */}
              <svg 
                viewBox="0 0 320 480" 
                className="w-full h-full filter drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Vùng biển Đông xanh biếc */}
                <rect width="320" height="480" fill="transparent" />

                {/* Đường nét cách điệu Đất liền Việt Nam hình chữ S */}
                <path
                  d="M 80 55 Q 120 40, 160 60 Q 180 80, 140 100 Q 120 120, 145 150 Q 160 175, 150 200 Q 140 230, 180 250 Q 200 270, 180 300 Q 160 330, 175 360 Q 165 385, 130 395 Q 100 405, 95 380 Q 120 365, 125 340 Q 115 315, 105 330 Q 90 320, 100 280 Q 90 230, 110 180 Q 90 140, 80 100 Z"
                  fill="#f1f5f9"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  className="transition-colors"
                />

                {/* Quần đảo Hoàng Sa (Đà Nẵng) */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('DN')}>
                  <rect x="210" y="195" width="65" height="45" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="215" y="210" fontSize="8" fill="#1e40af" fontWeight="bold">Q.Đ HOÀNG SA</text>
                  <text x="215" y="222" fontSize="7" fill="#64748b">(Đà Nẵng)</text>
                  <circle cx="230" cy="230" r="3" fill="#dc2626" />
                  <circle cx="245" cy="225" r="2.5" fill="#dc2626" />
                  <circle cx="255" cy="232" r="3" fill="#dc2626" />
                </g>

                {/* Quần đảo Trường Sa (Khánh Hòa) */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('KH')}>
                  <rect x="220" y="340" width="75" height="55" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="225" y="355" fontSize="8" fill="#1e40af" fontWeight="bold">Q.Đ TRƯỜNG SA</text>
                  <text x="225" y="367" fontSize="7" fill="#64748b">(Khánh Hòa) & DK1</text>
                  <circle cx="240" cy="378" r="3.5" fill="#dc2626" />
                  <circle cx="255" cy="372" r="2.5" fill="#dc2626" />
                  <circle cx="270" cy="382" r="3" fill="#dc2626" />
                  <circle cx="280" cy="375" r="2" fill="#dc2626" />
                </g>

                {/* Nhãn Biển Đông thiêng liêng */}
                <text x="175" y="290" fontSize="11" fill="#94a3b8" fontWeight="bold" letterSpacing="3">BIỂN ĐÔNG</text>
              </svg>

              {/* CÁC ĐIỂM PIN TƯƠNG TÁC PHÁT SÁNG NẰM TRÊN BẢN ĐỒ */}
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
                    {/* Vòng sóng radar nhấp nháy */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-red-600/30 animate-ping"></span>
                    )}

                    {/* Huy hiệu nốt Pin */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shadow-lg border transition-all ${
                      isSelected
                        ? 'bg-red-700 text-white border-amber-300 ring-2 ring-red-400'
                        : prov.isIsland
                        ? 'bg-blue-800 text-white border-blue-300 hover:bg-blue-700'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-red-50 hover:text-red-700'
                    }`}>
                      <span className="text-[9px]">{isSelected ? '★' : '📍'}</span>
                      <span className="whitespace-nowrap font-sans">{prov.name.split(' (')[0]}</span>
                    </div>
                  </button>
                );
              })}

            </div>

            {/* Dải nút chọn nhanh địa danh bên dưới */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 border-t border-slate-200">
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

          </div>
        </div>

        {/* CỘT PHẢI: KHUNG CHI TIẾT TƯ LIỆU VÀ CHIẾN TÍCH ĐỊA PHƯƠNG */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          
          <div className="relative rounded-2xl overflow-hidden shadow-md group h-56 sm:h-64 bg-slate-900">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                {current.region}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-white drop-shadow">
                {current.name}
              </h3>
            </div>
          </div>

          {/* Dấu ấn lịch sử */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-700" />
              <span>Dấu ấn lịch sử & Phong trào thanh niên:</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {current.highlight}
            </p>
          </div>

          {/* Bộ đếm và Nút khám phá */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="font-serif font-black text-2xl sm:text-3xl text-red-700">
                {current.count.toLocaleString()}+
              </div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                Trang nhật ký & Tư liệu lưu giữ
              </div>
            </div>

            <a
              href={withBase(`/thu-vien?province=${current.id}`)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám phá toàn bộ tư liệu {current.name.split(' (')[0]}</span>
              <span>→</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
