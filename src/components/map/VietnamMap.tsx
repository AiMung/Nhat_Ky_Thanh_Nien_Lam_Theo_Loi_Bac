import { useState } from 'react';
import { withBase } from '@/lib/utils';
import { MapPin, BookOpen } from 'lucide-react';

const PROVINCE_STATS: Record<string, { count: number; region: string; name: string }> = {
  HN: { name: 'Hà Nội', count: 124, region: 'Bắc Bộ' },
  HCM: { name: 'TP. Hồ Chí Minh', count: 285, region: 'Nam Bộ' },
  DB: { name: 'Điện Biên', count: 96, region: 'Bắc Bộ' },
  QT: { name: 'Quảng Trị', count: 182, region: 'Trung Bộ' },
  DN: { name: 'Đà Nẵng (gồm Quần đảo Hoàng Sa)', count: 68, region: 'Trung Bộ' },
  KH: { name: 'Khánh Hòa (gồm Quần đảo Trường Sa)', count: 75, region: 'Trung Bộ' },
  TH: { name: 'Thanh Hóa', count: 112, region: 'Bắc Trung Bộ' },
  NA: { name: 'Nghệ An', count: 145, region: 'Bắc Trung Bộ' },
  TN: { name: 'Tây Ninh', count: 54, region: 'Nam Bộ' },
  BD: { name: 'Bình Dương', count: 48, region: 'Nam Bộ' },
  CT: { name: 'Cần Thơ', count: 62, region: 'Tây Nam Bộ' },
};

export default function VietnamMap() {
  const [activeProvince, setActiveProvince] = useState<string>('HCM');

  const selected = PROVINCE_STATS[activeProvince] || {
    name: 'TP. Hồ Chí Minh',
    count: 285,
    region: 'Nam Bộ'
  };

  return (
    <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        
        {/* Bản đồ SVG trực quan có Hoàng Sa và Trường Sa */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[3/4] bg-heritage-50 rounded-2xl border border-heritage-200 p-4 flex flex-col justify-between overflow-hidden">
            
            {/* Header bản đồ */}
            <div className="text-center z-10">
              <span className="text-[11px] font-bold text-redflag-800 tracking-wider uppercase bg-white/80 px-2.5 py-1 rounded-full border border-heritage-200">
                Bản đồ Ký ức Lịch sử Việt Nam
              </span>
            </div>

            {/* Minh họa mô phỏng vị trí các tỉnh trọng điểm & 2 Quần đảo */}
            <div className="relative flex-1 flex flex-col justify-around py-4">
              
              {/* Miền Bắc */}
              <div className="flex justify-around items-center">
                <button
                  onClick={() => setActiveProvince('DB')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    activeProvince === 'DB' 
                      ? 'bg-redflag-800 text-amber-200 ring-2 ring-redflag-600 scale-105' 
                      : 'bg-heritage-200 text-heritage-800 hover:bg-heritage-300'
                  }`}
                >
                  Điện Biên ({PROVINCE_STATS.DB.count})
                </button>

                <button
                  onClick={() => setActiveProvince('HN')}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    activeProvince === 'HN' 
                      ? 'bg-redflag-800 text-amber-200 ring-2 ring-redflag-600 scale-105' 
                      : 'bg-redflag-100 text-redflag-900 hover:bg-redflag-200'
                  }`}
                >
                  ★ Hà Nội ({PROVINCE_STATS.HN.count})
                </button>
              </div>

              {/* Miền Trung & Quần đảo Hoàng Sa */}
              <div className="flex justify-between items-center px-4 relative">
                <button
                  onClick={() => setActiveProvince('QT')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    activeProvince === 'QT' 
                      ? 'bg-redflag-800 text-amber-200 ring-2 ring-redflag-600' 
                      : 'bg-heritage-200 text-heritage-800 hover:bg-heritage-300'
                  }`}
                >
                  Quảng Trị ({PROVINCE_STATS.QT.count})
                </button>

                {/* Quần đảo Hoàng Sa (Thuộc TP. Đà Nẵng) */}
                <div 
                  onClick={() => setActiveProvince('DN')}
                  className="cursor-pointer bg-amber-100/90 hover:bg-amber-200 border-2 border-dashed border-amber-600 rounded-lg p-2 text-center transition-all shadow-sm"
                  title="Quần đảo Hoàng Sa (Thuộc TP. Đà Nẵng)"
                >
                  <div className="text-[10px] font-black text-redflag-900 uppercase">
                    Q.Đ HOÀNG SA
                  </div>
                  <div className="text-[9px] text-heritage-600">
                    (TP. Đà Nẵng)
                  </div>
                </div>
              </div>

              {/* Miền Nam & Quần đảo Trường Sa */}
              <div className="flex justify-between items-center px-2 relative">
                <button
                  onClick={() => setActiveProvince('HCM')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeProvince === 'HCM' 
                      ? 'bg-redflag-800 text-amber-200 ring-2 ring-redflag-600 scale-105 shadow-md' 
                      : 'bg-redflag-700 text-white hover:bg-redflag-800'
                  }`}
                >
                  ★ TP. Hồ Chí Minh ({PROVINCE_STATS.HCM.count})
                </button>

                {/* Quần đảo Trường Sa (Thuộc Tỉnh Khánh Hòa) */}
                <div 
                  onClick={() => setActiveProvince('KH')}
                  className="cursor-pointer bg-redflag-50 hover:bg-redflag-100 border-2 border-dashed border-redflag-600 rounded-lg p-2.5 text-center transition-all shadow-sm"
                  title="Quần đảo Trường Sa (Thuộc Tỉnh Khánh Hòa)"
                >
                  <div className="text-[10px] font-black text-redflag-900 uppercase">
                    Q.Đ TRƯỜNG SA
                  </div>
                  <div className="text-[9px] text-heritage-600">
                    (Khánh Hòa)
                  </div>
                </div>
              </div>

              {/* Tây Nam Bộ */}
              <div className="flex justify-start px-6">
                <button
                  onClick={() => setActiveProvince('CT')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    activeProvince === 'CT' 
                      ? 'bg-redflag-800 text-amber-200 ring-2 ring-redflag-600' 
                      : 'bg-heritage-200 text-heritage-800 hover:bg-heritage-300'
                  }`}
                >
                  Cần Thơ ({PROVINCE_STATS.CT.count})
                </button>
              </div>

            </div>

            <div className="text-[10px] text-center text-heritage-500 border-t border-heritage-200 pt-2">
              Khẳng định chủ quyền trọn vẹn của Việt Nam trên hai quần đảo Hoàng Sa và Trường Sa
            </div>

          </div>
        </div>

        {/* Bảng thông tin chi tiết địa phương đã chọn */}
        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-redflag-800 bg-redflag-50 px-3 py-1 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Địa phương đang chọn</span>
          </div>

          <h3 className="font-serif font-black text-2xl text-heritage-900 mb-2">
            {selected.name}
          </h3>

          <p className="text-sm text-heritage-600 mb-6">
            Thuộc khu vực <strong>{selected.region}</strong>. Nơi đã ghi dấu hàng ngàn chiến công oanh liệt và những câu chuyện kiên trung của quân và dân ta qua các thời kỳ.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-heritage-50 p-4 rounded-xl border border-heritage-200">
              <div className="text-2xl font-black font-serif text-redflag-800">
                {selected.count}+
              </div>
              <div className="text-xs text-heritage-600 font-medium">
                Câu chuyện đã số hóa
              </div>
            </div>

            <div className="bg-heritage-50 p-4 rounded-xl border border-heritage-200">
              <div className="text-2xl font-black font-serif text-heritage-800">
                100%
              </div>
              <div className="text-xs text-heritage-600 font-medium">
                Đã qua xác minh & duyệt
              </div>
            </div>
          </div>

          <a
            href={withBase(`/thu-vien?tinh=${activeProvince}`)}
            className="inline-flex items-center gap-2 bg-heritage-900 hover:bg-black text-amber-100 px-5 py-3 rounded-xl text-sm font-medium transition-all shadow"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Xem tất cả câu chuyện tại {selected.name}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
