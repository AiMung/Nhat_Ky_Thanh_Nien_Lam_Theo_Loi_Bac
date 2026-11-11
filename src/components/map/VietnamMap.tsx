import { useState } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen, Compass, Shield } from 'lucide-react';

interface ProvinceInfo {
  name: string;
  count: number;
  region: string;
  highlight: string;
  image: string;
}

const PROVINCE_MAP: Record<string, ProvinceInfo> = {
  HCM: {
    name: 'TP. Hồ Chí Minh',
    count: 2450,
    region: 'Đô thị đặc biệt phía Nam',
    highlight: 'Nơi Bác Hồ ra đi tìm đường cứu nước (Bến Nhà Rồng), Căn cứ Núi Dinh, Hầm vũ khí Biệt động Sài Gòn, Lá phổi xanh Rừng Sác Cần Giờ và Chiến dịch Mùa hè xanh huyền thoại.',
    image: '/images/thoi-hoa-lua-hero.jpg'
  },
  DN: {
    name: 'Đà Nẵng & Quần đảo Hoàng Sa',
    count: 680,
    region: 'Miền Trung kiên cường',
    highlight: 'Thành phố đầu sóng ngọn gió, nơi thanh niên luôn hướng về huyện đảo Hoàng Sa thiêng liêng và giữ vững an ninh biển đảo.',
    image: '/images/thoi-hoa-lua/cat-bien-dao.jpg'
  },
  KH: {
    name: 'Khánh Hòa & Quần đảo Trường Sa',
    count: 890,
    region: 'Quân dân Thềm lục địa phía Nam',
    highlight: 'Nơi tuổi đôi mươi người lính Hải quân gìn giữ từng cột mốc chủ quyền tại 21 đảo, điểm đảo thuộc huyện đảo Trường Sa và cụm Nhà giàn DK1.',
    image: '/images/truong-sa-chu-quyen.jpg'
  },
  HN: {
    name: 'Thủ đô Hà Nội',
    count: 1820,
    region: 'Trái tim cả nước',
    highlight: 'Quảng trường Ba Đình lịch sử, Lăng Chủ tịch Hồ Chí Minh, Khu di tích Phủ Chủ tịch - Nơi Bác sống và làm việc.',
    image: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg'
  },
  DB: {
    name: 'Điện Biên',
    count: 620,
    region: 'Tây Bắc hùng vĩ',
    highlight: 'Chiến thắng Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu" - Tinh thần thanh niên xung phong mở đường Thắng Lợi.',
    image: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg'
  },
  QT: {
    name: 'Quảng Trị',
    count: 1150,
    region: 'Tuyến lửa Vĩnh Linh',
    highlight: 'Thành Cổ Quảng Trị, Dòng sông Thạch Hãn, Cầu Hiền Lương - Vĩ tuyến 17 và Nghĩa trang Liệt sĩ Quốc gia Trường Sơn.',
    image: '/images/thoi-hoa-lua/map-badge-quangtri.jpg'
  },
};

export default function VietnamMap() {
  const [selectedKey, setSelectedKey] = useState<string>('HCM');
  const current = PROVINCE_MAP[selectedKey] || PROVINCE_MAP.HCM;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Bản đồ tương tác trực quan */}
        <div className="lg:col-span-6 flex flex-col items-center">
          
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-doan-950 text-white rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
            
            {/* Họa tiết nền */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="text-[11px] font-bold text-gold-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-gold-400/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Không gian Lịch sử Toàn quốc</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Bấm chọn địa bàn</span>
            </div>

            {/* Các điểm nút địa danh trọng điểm */}
            <div className="space-y-4 relative z-10">
              
              {/* Cụm Miền Bắc */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-400 font-semibold uppercase">Bắc Bộ:</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedKey('DB')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedKey === 'DB' ? 'bg-redflag-700 text-gold-200 ring-2 ring-gold-400 scale-105' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    Điện Biên
                  </button>
                  <button
                    onClick={() => setSelectedKey('HN')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedKey === 'HN' ? 'bg-redflag-700 text-gold-200 ring-2 ring-gold-400 scale-105' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    ★ Thủ đô Hà Nội
                  </button>
                </div>
              </div>

              {/* Cụm Miền Trung & Hoàng Sa */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedKey('QT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedKey === 'QT' ? 'bg-redflag-700 text-gold-200 ring-2 ring-gold-400' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  Quảng Trị
                </button>

                {/* Quần đảo Hoàng Sa (TP. Đà Nẵng) */}
                <button
                  onClick={() => setSelectedKey('DN')}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all border-2 flex items-center gap-1.5 ${
                    selectedKey === 'DN'
                      ? 'bg-gold-500 text-slate-950 border-gold-300 ring-2 ring-gold-300 scale-105 shadow-lg'
                      : 'bg-gold-500/20 text-gold-300 border-gold-500/50 hover:bg-gold-500/30'
                  }`}
                  title="Quần đảo Hoàng Sa thuộc chủ quyền thiêng liêng của Việt Nam (TP. Đà Nẵng)"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Q.Đ HOÀNG SA (ĐÀ NẴNG)</span>
                </button>
              </div>

              {/* Cụm TP. Hồ Chí Minh & Quần đảo Trường Sa */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-redflag-950/80 to-doan-900/80 border border-gold-400/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gold-300 uppercase">Thành phố mang tên Bác:</span>
                  <button
                    onClick={() => setSelectedKey('HCM')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      selectedKey === 'HCM'
                        ? 'bg-gradient-to-r from-redflag-700 to-doan-800 text-gold-200 ring-2 ring-gold-400 scale-105 shadow-xl'
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                  >
                    ★ TP. HỒ CHÍ MINH ({PROVINCE_MAP.HCM.count})
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-300">Biển đảo thiêng liêng:</span>
                  {/* Quần đảo Trường Sa (Tỉnh Khánh Hòa) */}
                  <button
                    onClick={() => setSelectedKey('KH')}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all border-2 flex items-center gap-1.5 ${
                      selectedKey === 'KH'
                        ? 'bg-redflag-700 text-gold-200 border-gold-400 ring-2 ring-gold-300 scale-105 shadow-xl'
                        : 'bg-redflag-900/40 text-gold-200 border-redflag-500/60 hover:bg-redflag-900/60'
                    }`}
                    title="Quần đảo Trường Sa và Nhà giàn DK1 (Tỉnh Khánh Hòa)"
                  >
                    <Shield className="w-3.5 h-3.5 text-gold-400" />
                    <span>Q.Đ TRƯỜNG SA (KHÁNH HÒA)</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="mt-6 pt-3 border-t border-white/15 text-center text-[11px] text-gold-300/90 font-medium">
              ★ Khẳng định đanh thép: Hoàng Sa và Trường Sa là máu thịt thiêng liêng của Việt Nam ★
            </div>

          </div>

        </div>

        {/* Thông tin chi tiết & Hình ảnh minh chứng địa phương */}
        <div className="lg:col-span-6 space-y-5">
          <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <span className="text-xs font-bold text-gold-300 uppercase tracking-wider bg-redflag-900/90 px-3 py-1 rounded-full border border-gold-400/30">
                {current.region}
              </span>
              <h3 className="font-serif font-black text-2xl text-white mt-2">
                {current.name}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-doan-800">
              <MapPin className="w-4 h-4 text-redflag-700" />
              <span>Dấu ấn lịch sử & Công trình thanh niên tiêu biểu:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
              {current.highlight}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-2xl font-black font-serif text-doan-800">
                {current.count.toLocaleString()} +
              </div>
              <div className="text-xs text-slate-500 font-semibold uppercase">
                Trang nhật ký & Tư liệu
              </div>
            </div>

            <a
              href={withBase('/thu-vien')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-doan-800 hover:bg-doan-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <BookOpen className="w-4 h-4 text-gold-300" />
              <span>Xem nhật ký tại {current.name}</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
