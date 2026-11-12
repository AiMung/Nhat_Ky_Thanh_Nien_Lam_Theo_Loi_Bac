import { useState } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen, Compass, ShieldCheck } from 'lucide-react';

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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Bộ điều hướng chọn địa bàn chuẩn Enterprise */}
        <div className="lg:col-span-6 flex flex-col">
          
          <div className="w-full bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-red-700" />
                <span>Không gian Lịch sử Toàn quốc</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Bấm chọn địa bàn</span>
            </div>

            {/* Các điểm nút địa danh trọng điểm */}
            <div className="space-y-3">
              
              {/* Cụm TP. Hồ Chí Minh trọng tâm */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 uppercase">Thành phố mang tên Bác:</span>
                <button
                  onClick={() => setSelectedKey('HCM')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedKey === 'HCM'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  ★ TP. HỒ CHÍ MINH ({PROVINCE_MAP.HCM.count})
                </button>
              </div>

              {/* Khẳng định chủ quyền Hoàng Sa & Trường Sa */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 space-y-2">
                <div className="text-[11px] font-bold text-blue-900 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Chủ quyền biển đảo thiêng liêng:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedKey('KH')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                      selectedKey === 'KH'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-white hover:bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                  >
                    ⚓ Q.Đ TRƯỜNG SA ({PROVINCE_MAP.KH.count})
                  </button>

                  <button
                    onClick={() => setSelectedKey('DN')}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                      selectedKey === 'DN'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-white hover:bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                  >
                    ⚓ Q.Đ HOÀNG SA ({PROVINCE_MAP.DN.count})
                  </button>
                </div>
              </div>

              {/* Tuyến lửa Miền Trung & Miền Bắc */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
                <span className="text-xs text-slate-600 font-semibold">Tuyến lửa Miền Trung:</span>
                <button
                  onClick={() => setSelectedKey('QT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedKey === 'QT' ? 'bg-red-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Quảng Trị ({PROVINCE_MAP.QT.count})
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 shadow-2xs">
                <span className="text-xs text-slate-600 font-semibold">Miền Bắc & Thủ đô:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedKey('HN')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedKey === 'HN' ? 'bg-red-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Hà Nội
                  </button>
                  <button
                    onClick={() => setSelectedKey('DB')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedKey === 'DB' ? 'bg-red-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Điện Biên
                  </button>
                </div>
              </div>

            </div>

            <div className="pt-2 text-center text-[11px] text-slate-500 font-medium border-t border-slate-200/80">
              ★ Toàn vẹn lãnh thổ: Hoàng Sa và Trường Sa là máu thịt thiêng liêng của Việt Nam ★
            </div>

          </div>

        </div>

        {/* Thông tin chi tiết & Hình ảnh minh chứng địa phương */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-red-700 px-3 py-1 rounded-full">
                {current.region}
              </span>
              <h3 className="font-serif font-bold text-2xl text-white mt-1.5">
                {current.name}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
              <MapPin className="w-3.5 h-3.5" />
              <span>Dấu ấn lịch sử & Công trình thanh niên tiêu biểu:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
              {current.highlight}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-2xl font-bold font-serif text-slate-900">
                {current.count.toLocaleString()} +
              </div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Trang nhật ký & Tư liệu
              </div>
            </div>

            <a
              href={withBase('/thu-vien')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám phá tư liệu</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
