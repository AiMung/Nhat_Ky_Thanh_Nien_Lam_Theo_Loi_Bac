import React, { useState } from 'react';
import { withBase } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  desc: string;
  img: string;
  link: string;
}

const TIMELINE_DATA: Milestone[] = [
  {
    year: '1945',
    title: 'Cách mạng Tháng Tám & Mùa thu Độc lập',
    desc: 'Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình lịch sử, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    img: '/images/thoi-hoa-lua/story-den-hung.jpg',
    link: '/thu-vien?period=1945-truoc'
  },
  {
    year: '1954',
    title: 'Chiến thắng Điện Biên Phủ "Lừng lẫy năm châu"',
    desc: '56 ngày đêm khoét núi ngủ hầm, tuổi trẻ bạt núi kéo pháo làm nên chiến thắng chấn động địa cầu, giải phóng hoàn toàn miền Bắc.',
    img: '/images/thoi-hoa-lua/story-chien-dich-dien-bien-phu.jpg',
    link: '/thu-vien?period=1945-1954'
  },
  {
    year: '1968',
    title: 'Tổng tiến công Mậu Thân & Tiếng hát át tiếng bom',
    desc: 'Ngọn lửa đấu tranh của phong trào học sinh - sinh viên và các chiến sĩ biệt động dũng cảm tiến công giữa lòng đô thành.',
    img: '/images/thoi-hoa-lua/cat-khang-chien.jpg',
    link: '/thu-vien?period=1955-1975'
  },
  {
    year: '1975',
    title: 'Đại thắng Mùa Xuân & Giải phóng Đà Lạt (3/4/1975)',
    desc: 'Non sông thu về một mối. Tuổi trẻ Khu phố Ánh Sáng và nhân dân Phường Xuân Hương hân hoan rợp cờ hoa đón đoàn quân giải phóng.',
    img: '/images/thoi-hoa-lua/story-me-va-nhung-la-thu.jpg',
    link: '/thu-vien?period=1955-1975'
  },
  {
    year: '1979',
    title: 'Bảo vệ biên giới thiêng liêng của Tổ quốc',
    desc: 'Hàng vạn thanh niên xung phong, bộ đội biên phòng kiên cường bảo vệ từng tấc đất thiêng liêng nơi biên cương địa đầu non sông.',
    img: '/images/thoi-hoa-lua/cat-bien-gioi.jpg',
    link: '/thu-vien?period=1975-1988'
  },
  {
    year: '1988',
    title: 'Khúc tráng ca Gạc Ma & Chủ quyền Biển đảo',
    desc: '64 chiến sĩ Hải quân tạo thành "Vòng tròn bất tử" bảo vệ lá cờ Tổ quốc giữa ngàn khơi Hoàng Sa - Trường Sa ruột thịt.',
    img: '/images/truong-sa-chu-quyen.jpg',
    link: '/thu-vien?period=1975-1988'
  },
  {
    year: '1990+',
    title: 'Đổi mới & hội nhập sâu rộng',
    desc: 'Đất nước bước vào thời kỳ Đổi mới, phát triển kinh tế, số hóa di sản và hội nhập quốc tế sâu rộng cùng tuổi trẻ Phường Xuân Hương.',
    img: '/images/thoi-hoa-lua/sk-tin1.jpg',
    link: '/thu-vien?period=1989-nay'
  }
];

export default function InteractiveTimelineGsap() {
  const [activeIdx, setActiveIdx] = useState(6); // Default active at 1990+ as in screenshot 4

  const activeItem = TIMELINE_DATA[activeIdx];

  return (
    <div className="space-y-8">
      
      {/* THANH DÒNG CHẢY LỊCH SỬ NẰM NGANG VỚI CÁC MỐC NĂM (CHUẨN SCREENSHOT 4) */}
      <div className="relative px-4 sm:px-8 py-4">
        {/* Đường kẻ ngang */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-amber-200/90 z-0"></div>

        {/* Các mốc chấm tròn */}
        <div className="relative z-10 flex items-center justify-between">
          {TIMELINE_DATA.map((item, idx) => {
            const isCur = activeIdx === idx;
            return (
              <button
                key={item.year}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className="group flex flex-col items-center focus:outline-none cursor-pointer"
              >
                {/* Chấm tròn */}
                <div
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 ${
                    isCur
                      ? 'bg-red-700 border-red-700 scale-125 shadow-md shadow-red-700/40'
                      : 'bg-amber-100 border-amber-300 group-hover:border-red-600 group-hover:scale-110'
                  }`}
                />
                {/* Nhãn năm dưới chấm tròn */}
                <span
                  className={`mt-2.5 text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                    isCur ? 'text-red-800 font-black text-sm sm:text-base' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {item.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* THẺ HIỂN THỊ NỘI DUNG THỜI KỲ (BÊN TRÁI CHỮ, BÊN PHẢI ẢNH LỚN) */}
      <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-8 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Cột trái: Tiêu đề, mô tả, nút xem câu chuyện */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
              MỐC SON NĂM {activeItem.year}
            </span>

            <h3 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 leading-snug">
              {activeItem.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {activeItem.desc}
            </p>

            <div className="pt-2">
              <a
                href={withBase(activeItem.link)}
                className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-bold text-xs sm:text-sm hover:underline"
              >
                <span>Xem câu chuyện thời kỳ này</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cột phải: Ảnh tư liệu lớn */}
          <div className="md:col-span-6 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-amber-200 shadow-xs relative">
            <img
              src={activeItem.img}
              alt={activeItem.title}
              className="w-full h-full object-cover filter brightness-95"
            />
          </div>

        </div>
      </div>

    </div>
  );
}
