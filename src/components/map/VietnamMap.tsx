import { useState, useEffect } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen, Compass, ShieldCheck, Sparkles, Trophy } from 'lucide-react';

// Dữ liệu câu chuyện lịch sử và phong trào thi đua gắn với các tỉnh thành
interface ProvinceStoryData {
  name: string;
  code: string;
  region: string;
  count: number;
  highlight: string;
  image: string;
  featuredUnit?: string;
}

const PROVINCE_HISTORICAL_DATA: Record<string, ProvinceStoryData> = {
  'Lâm Đồng': {
    name: 'Lâm Đồng (TP. Đà Lạt — Phường Xuân Hương)',
    code: 'LD',
    region: 'Cao nguyên Lâm Viên • Đơn vị thi đua trọng điểm',
    count: 680,
    highlight: 'Thành phố ngàn hoa anh hùng, nơi 37 Tổ Dân Phố Phường Xuân Hương và tuổi trẻ Đà Lạt thi đua số hóa ký ức lịch sử, chiến dịch Mùa hè xanh và phong trào Tuổi trẻ học tập và làm theo lời Bác.',
    image: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
    featuredUnit: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương & 37 Tổ Dân Phố'
  },
  'Hồ Chí Minh': {
    name: 'Thành phố Hồ Chí Minh',
    code: 'HCM',
    region: 'Đô thị đặc biệt phía Nam',
    count: 2450,
    highlight: 'Nơi Bác Hồ ra đi tìm đường cứu nước (Bến Nhà Rồng), Căn cứ Núi Dinh, Hầm vũ khí Biệt động Sài Gòn, Lá phổi xanh Rừng Sác Cần Giờ và Chiến dịch Mùa hè xanh huyền thoại.',
    image: '/images/thoi-hoa-lua-hero.jpg',
    featuredUnit: 'Thành Đoàn TP. Hồ Chí Minh & Thanh niên xung phong'
  },
  'Hà Nội': {
    name: 'Thủ đô Hà Nội',
    code: 'HN',
    region: 'Trái tim cả nước',
    count: 1820,
    highlight: 'Quảng trường Ba Đình lịch sử, Lăng Chủ tịch Hồ Chí Minh, Khu di tích Phủ Chủ tịch và khúc tráng ca Hà Nội 12 ngày đêm Điện Biên Phủ trên không.',
    image: '/images/thoi-hoa-lua/story-ha-noi-12-ngay-dem.jpg',
    featuredUnit: 'Thành Đoàn Hà Nội & Tự vệ Thủ đô'
  },
  'Đà Nẵng': {
    name: 'Đà Nẵng & Quần đảo Hoàng Sa',
    code: 'DN',
    region: 'Miền Trung kiên cường • Biển đảo thiêng liêng',
    count: 780,
    highlight: 'Thành phố đầu sóng ngọn gió, nơi thanh niên và nhân dân cả nước luôn khắc ghi ý chí giữ vững chủ quyền biển đảo thiêng liêng đối với huyện đảo Hoàng Sa của Tổ quốc.',
    image: '/images/thoi-hoa-lua/cat-bien-dao.jpg',
    featuredUnit: 'Thành Đoàn Đà Nẵng & Huyện đảo Hoàng Sa'
  },
  'Khánh Hòa': {
    name: 'Khánh Hòa & Quần đảo Trường Sa',
    code: 'KH',
    region: 'Quân dân Thềm lục địa phía Nam',
    count: 890,
    highlight: 'Nơi tuổi đôi mươi người lính Hải quân gìn giữ từng cột mốc chủ quyền tại 21 đảo, 33 điểm đóng quân thuộc huyện đảo Trường Sa và cụm Nhà giàn DK1 kiên trung bất khuất.',
    image: '/images/truong-sa-chu-quyen.jpg',
    featuredUnit: 'Vùng 4 Hải quân & Huyện đảo Trường Sa'
  },
  'Quảng Trị': {
    name: 'Quảng Trị',
    code: 'QT',
    region: 'Tuyến lửa Vĩ tuyến 17',
    count: 1150,
    highlight: 'Thành Cổ Quảng Trị 81 ngày đêm máu lửa, Dòng sông Thạch Hãn huyền thoại, Cầu Hiền Lương và Nghĩa trang Liệt sĩ Quốc gia Trường Sơn.',
    image: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    featuredUnit: 'Tỉnh Đoàn Quảng Trị'
  },
  'Điện Biên': {
    name: 'Điện Biên',
    code: 'DB',
    region: 'Tây Bắc hùng vĩ',
    count: 620,
    highlight: 'Chiến thắng Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu" - Tinh thần thanh niên xung phong mở đường Thắng Lợi bạt núi kéo pháo.',
    image: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg',
    featuredUnit: 'Tỉnh Đoàn Điện Biên'
  },
  'Tây Ninh': {
    name: 'Tây Ninh',
    code: 'TN',
    region: 'Đông Nam Bộ',
    count: 510,
    highlight: 'Căn cứ Trung ương Cục Miền Nam - Thủ đô kháng chiến giải phóng miền Nam, nơi phong trào thanh niên xung kích một lòng theo Đảng và Bác.',
    image: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
    featuredUnit: 'Tỉnh Đoàn Tây Ninh'
  }
};

// Mặc định cho các tỉnh còn lại trong 34 tỉnh thành
function getProvinceData(name: string): ProvinceStoryData {
  if (PROVINCE_HISTORICAL_DATA[name]) {
    return PROVINCE_HISTORICAL_DATA[name];
  }

  // Tự động tìm kiếm tương đối
  for (const key of Object.keys(PROVINCE_HISTORICAL_DATA)) {
    if (name.includes(key) || key.includes(name)) {
      return PROVINCE_HISTORICAL_DATA[key];
    }
  }

  return {
    name: name,
    code: name,
    region: 'Địa bàn lịch sử & Phong trào thanh niên',
    count: 350,
    highlight: `Những chiến công anh dũng và trang nhật ký việc tốt của tuổi trẻ ${name} noi gương Bác Hồ vĩ đại, chung tay gìn giữ và dựng xây quê hương đất nước.`,
    image: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    featuredUnit: `Đoàn TNCS Hồ Chí Minh tỉnh ${name}`
  };
}

export default function VietnamMap() {
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('Lâm Đồng');
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState(true);

  // Load component @xdev-asia/vietnam-map-34-provinces/react dynamically on client-side
  useEffect(() => {
    let mounted = true;
    import('@xdev-asia/vietnam-map-34-provinces/react')
      .then((mod) => {
        if (mounted && mod && mod.VietnamMap) {
          setMapComponent(() => mod.VietnamMap);
        }
      })
      .catch((err) => {
        console.warn('Lưu ý: Không thể tải bản đồ Highcharts, dùng bản đồ tương tác dự phòng:', err);
      })
      .finally(() => {
        if (mounted) setLoadingMap(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentInfo = getProvinceData(selectedProvinceName);

  // Danh sách data 34 tỉnh thành với số lượng bài viết để Highcharts tô màu heatmap
  const mapData = [
    { name: 'Lâm Đồng', value: 680, storiesCount: 680 },
    { name: 'Hồ Chí Minh', value: 2450, storiesCount: 2450 },
    { name: 'Hà Nội', value: 1820, storiesCount: 1820 },
    { name: 'Đà Nẵng', value: 780, storiesCount: 780 },
    { name: 'Khánh Hòa', value: 890, storiesCount: 890 },
    { name: 'Quảng Trị', value: 1150, storiesCount: 1150 },
    { name: 'Điện Biên', value: 620, storiesCount: 620 },
    { name: 'Tây Ninh', value: 510, storiesCount: 510 },
    { name: 'Thanh Hóa', value: 430, storiesCount: 430 },
    { name: 'Nghệ An', value: 480, storiesCount: 480 },
    { name: 'Quảng Ninh', value: 360, storiesCount: 360 },
    { name: 'Hải Phòng', value: 490, storiesCount: 490 },
    { name: 'Đồng Nai', value: 410, storiesCount: 410 },
    { name: 'Cần Thơ', value: 390, storiesCount: 390 },
    { name: 'Gia Lai', value: 320, storiesCount: 320 },
    { name: 'Đắk Lắk', value: 350, storiesCount: 350 },
    { name: 'Huế', value: 460, storiesCount: 460 },
    { name: 'An Giang', value: 310, storiesCount: 310 },
    { name: 'Cà Mau', value: 290, storiesCount: 290 },
    { name: 'Cao Bằng', value: 330, storiesCount: 330 },
    { name: 'Lạng Sơn', value: 310, storiesCount: 310 },
    { name: 'Lào Cai', value: 340, storiesCount: 340 },
    { name: 'Sơn La', value: 280, storiesCount: 280 },
    { name: 'Bắc Ninh', value: 370, storiesCount: 370 },
    { name: 'Thái Nguyên', value: 350, storiesCount: 350 },
    { name: 'Phú Thọ', value: 400, storiesCount: 400 },
    { name: 'Hưng Yên', value: 380, storiesCount: 380 },
    { name: 'Ninh Bình', value: 420, storiesCount: 420 },
    { name: 'Hà Tĩnh', value: 390, storiesCount: 390 },
    { name: 'Quảng Ngãi', value: 330, storiesCount: 330 },
    { name: 'Đồng Tháp', value: 310, storiesCount: 310 },
    { name: 'Vĩnh Long', value: 300, storiesCount: 300 },
    { name: 'Tuyên Quang', value: 290, storiesCount: 290 },
    { name: 'Lai Châu', value: 260, storiesCount: 260 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      
      {/* HEADER BANNER BẢN ĐỒ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-2">
            <Compass className="w-3.5 h-3.5 text-red-700" />
            <span>Bản đồ hành chính số hóa 34 tỉnh/thành phố</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            Bản Đồ Ký Ức Lịch Sử & Địa Chỉ Đỏ Toàn Quốc
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ứng dụng bản đồ 34 tỉnh thành mới (@xdev-asia/vietnam-map-34-provinces) • Trọng tâm: <strong>Đà Lạt (Lâm Đồng - Phường Xuân Hương)</strong>
          </p>
        </div>

        {/* Nút bấm chọn nhanh địa phương trọng tâm */}
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedProvinceName('Lâm Đồng')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              selectedProvinceName.includes('Lâm Đồng')
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span>🌸 P. Xuân Hương (Đà Lạt)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedProvinceName('Khánh Hòa')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              selectedProvinceName.includes('Khánh Hòa')
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <span>⚓ Q.Đ Trường Sa</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedProvinceName('Đà Nẵng')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              selectedProvinceName.includes('Đà Nẵng')
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <span>⚓ Q.Đ Hoàng Sa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CỘT TRÁI: BẢN ĐỒ 34 TỈNH THÀNH MỚI (@xdev-asia/vietnam-map-34-provinces) */}
        <div className="lg:col-span-7 bg-slate-50/80 rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-inner flex flex-col justify-between">
          
          <div className="flex items-center justify-between text-xs pb-3 mb-2 border-b border-slate-200">
            <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bản đồ tương tác 34 tỉnh/thành</span>
            </span>
            <span className="text-[11px] text-red-700 font-semibold bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              Đang chọn: <strong>{selectedProvinceName}</strong>
            </span>
          </div>

          {/* VÙNG HIỂN THỊ MAP HIGHCHARTS 34 PROVINCES */}
          <div className="relative w-full min-h-[480px] sm:min-h-[540px] flex items-center justify-center rounded-2xl overflow-hidden bg-white border border-slate-200/80 p-2">
            {MapComponent ? (
              <div className="w-full h-full">
                <MapComponent
                  height={520}
                  data={mapData}
                  showLabels={true}
                  showZoomControls={true}
                  enableDrilldown={false}
                  hoverColor="#b91c1c"
                  borderColor="#cbd5e1"
                  colorAxis={{
                    min: 200,
                    max: 2500,
                    minColor: '#fee2e2',
                    maxColor: '#991b1b'
                  }}
                  onProvinceClick={(prov: any) => {
                    if (prov && prov.name) {
                      setSelectedProvinceName(prov.name);
                    }
                  }}
                  tooltipFormatter={(p: any) => {
                    return `<b>${p.name}</b><br/>📖 Đã số hóa: <b>${p.value || 350} trang nhật ký</b><br/><i>Bấm để xem chiến công & tư liệu</i>`;
                  }}
                />
              </div>
            ) : (
              /* Giao diện fallback đẹp mắt khi đang nạp Highcharts */
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium text-xs">
                  {loadingMap ? 'Đang khởi tạo Bản đồ 34 tỉnh thành...' : 'Sẵn sàng tương tác'}
                </p>
              </div>
            )}
          </div>

          {/* GHI CHÚ CHỦ QUYỀN HOÀNG SA & TRƯỜNG SA */}
          <div className="mt-4 p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs flex items-center justify-between gap-3 text-blue-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="font-semibold">
                Khẳng định trọn vẹn chủ quyền thiêng liêng: <strong>Quần đảo Hoàng Sa (Đà Nẵng)</strong> & <strong>Quần đảo Trường Sa (Khánh Hòa)</strong>.
              </span>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: KHUNG THÔNG TIN CHI TIẾT TƯ LIỆU VÀ ĐƠN VỊ THI ĐUA */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          
          <div className="relative rounded-2xl overflow-hidden shadow-md group h-56 sm:h-64 bg-slate-900">
            <img
              src={currentInfo.image}
              alt={currentInfo.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <span className="bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                {currentInfo.region}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-serif font-black text-2xl text-white drop-shadow">
                {currentInfo.name}
              </h3>
              {currentInfo.featuredUnit && (
                <div className="text-xs text-amber-300 font-semibold mt-1">
                  ★ {currentInfo.featuredUnit}
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
              {currentInfo.highlight}
            </p>
          </div>

          {/* Số liệu thống kê bài viết */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <div className="font-serif font-black text-2xl sm:text-3xl text-red-700">
                {currentInfo.count.toLocaleString()}+
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Trang nhật ký & Tư liệu lưu giữ
              </div>
            </div>

            <a
              href={withBase(`/thu-vien?province=${currentInfo.code}`)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám phá tư liệu</span>
              <span>→</span>
            </a>
          </div>

          {/* Khối lời gọi thi đua cho 37 Tổ Dân Phố Phường Xuân Hương */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50/50 rounded-2xl border border-red-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-700 text-amber-300 flex items-center justify-center font-bold text-base shrink-0">
              ★
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
