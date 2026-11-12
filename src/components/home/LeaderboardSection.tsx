import { useState } from 'react';
import { withBase } from '@/lib/utils';
import { Trophy, Award, Flame, Users, ArrowUpRight, PlusCircle, CheckCircle2 } from 'lucide-react';

interface LeaderboardItem {
  rank: number;
  name: string;
  subtext: string;
  storyCount: number;
  approvedCount: number;
  progressPercent: number;
  badge?: string;
}

const XUAN_HUONG_LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, name: 'Tổ dân phố 12', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 48, approvedCount: 46, progressPercent: 100, badge: 'Đơn vị Dẫn đầu' },
  { rank: 2, name: 'Tổ dân phố 5', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 42, approvedCount: 40, progressPercent: 96, badge: 'Đơn vị Xuất sắc' },
  { rank: 3, name: 'Tổ dân phố 21', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 39, approvedCount: 37, progressPercent: 92, badge: 'Đơn vị Tiên tiến' },
  { rank: 4, name: 'Tổ dân phố 1', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 35, approvedCount: 33, progressPercent: 88 },
  { rank: 5, name: 'Tổ dân phố 18', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 31, approvedCount: 29, progressPercent: 82 },
  { rank: 6, name: 'Tổ dân phố 37', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 29, approvedCount: 28, progressPercent: 78 },
  { rank: 7, name: 'Tổ dân phố 8', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 26, approvedCount: 25, progressPercent: 74 },
  { rank: 8, name: 'Tổ dân phố 15', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 24, approvedCount: 23, progressPercent: 70 },
  { rank: 9, name: 'Tổ dân phố 3', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 21, approvedCount: 20, progressPercent: 66 },
  { rank: 10, name: 'Tổ dân phố 27', subtext: 'Phường Xuân Hương, TP. Đà Lạt (Lâm Đồng)', storyCount: 19, approvedCount: 18, progressPercent: 62 },
];

const HCM_LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, name: 'Quận Đoàn 1', subtext: 'Thành Đoàn TP. Hồ Chí Minh', storyCount: 1240, approvedCount: 1205, progressPercent: 100, badge: 'Cờ Luân lưu Thi đua' },
  { rank: 2, name: 'Lực lượng Thanh niên Xung phong', subtext: 'Thành Đoàn TP. Hồ Chí Minh', storyCount: 980, approvedCount: 955, progressPercent: 95, badge: 'Đơn vị Anh hùng' },
  { rank: 3, name: 'Đoàn Trường ĐH KHXH&NV', subtext: 'ĐHQG TP. Hồ Chí Minh', storyCount: 850, approvedCount: 820, progressPercent: 90, badge: 'Tuổi trẻ Sáng tạo' },
  { rank: 4, name: 'Huyện Đoàn Cần Giờ', subtext: 'Chiến khu Rừng Sác anh hùng', storyCount: 710, approvedCount: 690, progressPercent: 85 },
  { rank: 5, name: 'Quận Đoàn 5', subtext: 'Căn cứ Biệt động thành Sài Gòn', storyCount: 650, approvedCount: 630, progressPercent: 80 },
];

const NATIONAL_LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, name: 'Tuổi trẻ Vùng 4 Hải quân', subtext: 'Quần đảo Trường Sa & Nhà giàn DK1', storyCount: 1450, approvedCount: 1420, progressPercent: 100, badge: 'Bảo vệ Tổ quốc' },
  { rank: 2, name: 'Thành Đoàn Hà Nội', subtext: 'Thủ đô Anh hùng, Ngàn năm văn hiến', storyCount: 1320, approvedCount: 1290, progressPercent: 96, badge: 'Tiên phong Gương mẫu' },
  { rank: 3, name: 'Tỉnh Đoàn Quảng Trị', subtext: 'Mảnh đất tuyến lửa Thành Cổ anh hùng', storyCount: 1150, approvedCount: 1120, progressPercent: 92, badge: 'Tri ân Liệt sĩ' },
  { rank: 4, name: 'Tỉnh Đoàn Điện Biên', subtext: 'Chiến trường Điện Biên Phủ lịch sử', storyCount: 920, approvedCount: 890, progressPercent: 85 },
  { rank: 5, name: 'Tỉnh Đoàn Lâm Đồng', subtext: 'Tuổi trẻ Cao nguyên đất đỏ', storyCount: 840, approvedCount: 810, progressPercent: 82 },
];

export default function LeaderboardSection() {
  const [scope, setScope] = useState<'xuan-huong' | 'hcm' | 'national'>('xuan-huong');

  const currentList = 
    scope === 'xuan-huong' ? XUAN_HUONG_LEADERBOARD :
    scope === 'hcm' ? HCM_LEADERBOARD : NATIONAL_LEADERBOARD;

  const top1 = currentList[0];
  const top2 = currentList[1];
  const top3 = currentList[2];
  const remaining = currentList.slice(3);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      
      {/* Header & Tabs chuyển đổi phạm vi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Phong trào Thi đua Toàn quốc</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            Bảng Xếp Hạng Đóng Góp Ký Ức
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi tiến độ thi đua thu thập và số hóa trang nhật ký lịch sử của các cơ sở, tổ dân phố
          </p>
        </div>

        {/* Bộ chuyển Tab */}
        <div className="flex flex-wrap p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setScope('xuan-huong')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              scope === 'xuan-huong'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🌸 37 TDP P. Xuân Hương (Đà Lạt)</span>
          </button>

          <button
            type="button"
            onClick={() => setScope('hcm')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              scope === 'hcm'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>★ Đoàn cơ sở TP.HCM</span>
          </button>

          <button
            type="button"
            onClick={() => setScope('national')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              scope === 'national'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span>🇻🇳 Toàn quốc & Biển đảo</span>
          </button>
        </div>
      </div>

      {/* BỤC PODIUM VINH DANH TOP 1 - TOP 2 - TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 pb-8 items-end max-w-4xl mx-auto">
        
        {/* HẠNG 2 - BẠC */}
        {top2 && (
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-5 border border-slate-200/90 text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xl mb-3 shadow-inner border-2 border-white">
              🥈
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Hạng Nhì • Bạc
            </span>
            <h3 className="font-serif font-black text-lg text-slate-900 mt-2">
              {top2.name}
            </h3>
            <p className="text-[11px] text-slate-500 mb-3 truncate">{top2.subtext}</p>
            <div className="p-2.5 bg-slate-100/70 rounded-xl">
              <div className="font-serif font-black text-xl text-slate-800">{top2.storyCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Trang nhật ký đã gửi</div>
            </div>
          </div>
        )}

        {/* HẠNG 1 - VÀNG (PODIUM CAO NHẤT) */}
        {top1 && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 rounded-3xl p-6 border-2 border-amber-400 text-center shadow-lg relative -translate-y-2 hover:scale-[1.02] transition-transform">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow">
              👑 ĐƠN VỊ DẪN ĐẦU
            </div>
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-300 to-amber-400 text-amber-950 flex items-center justify-center font-black text-3xl mb-3 shadow-md border-2 border-white">
              🥇
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full">
              Hạng Nhất • Vàng
            </span>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-900 mt-2">
              {top1.name}
            </h3>
            <p className="text-xs text-slate-600 mb-4">{top1.subtext}</p>
            <div className="p-3 bg-amber-100/80 rounded-2xl border border-amber-200">
              <div className="font-serif font-black text-2xl text-amber-900">{top1.storyCount}</div>
              <div className="text-[11px] text-amber-800 font-bold uppercase">Trang nhật ký xuất sắc</div>
            </div>
          </div>
        )}

        {/* HẠNG 3 - ĐỒNG */}
        {top3 && (
          <div className="order-3 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-5 border border-slate-200/90 text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl mb-3 shadow-inner border-2 border-white">
              🥉
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Hạng Ba • Đồng
            </span>
            <h3 className="font-serif font-black text-lg text-slate-900 mt-2">
              {top3.name}
            </h3>
            <p className="text-[11px] text-slate-500 mb-3 truncate">{top3.subtext}</p>
            <div className="p-2.5 bg-slate-100/70 rounded-xl">
              <div className="font-serif font-black text-xl text-slate-800">{top3.storyCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Trang nhật ký đã gửi</div>
            </div>
          </div>
        )}

      </div>

      {/* DANH SÁCH CHI TIẾT CÁC ĐƠN VỊ TIẾP THEO (TỪ HẠNG 4 TRỞ ĐI) */}
      <div className="mt-4 space-y-2.5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Danh sách thứ hạng tiếp theo ({scope === 'xuan-huong' ? '37 Tổ dân phố P. Xuân Hương' : 'Đơn vị thi đua'}):
        </div>

        {remaining.map((item) => (
          <div
            key={item.rank}
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-slate-100 border border-slate-200/70 transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 font-black text-xs text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                #{item.rank}
              </div>
              <div className="min-w-0">
                <div className="font-serif font-bold text-sm text-slate-900 truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {item.subtext}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 text-right">
              <div>
                <div className="font-serif font-black text-base text-red-700">
                  {item.storyCount}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">bài đã gửi</div>
              </div>

              <div className="hidden sm:block w-28">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Tiến độ</span>
                  <span className="font-bold text-slate-700">{item.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full" 
                    style={{ width: `${item.progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LỜI KÊU GỌI ĐÓNG GÓP CHO ĐƠN VỊ CỦA BẠN */}
      <div className="mt-8 p-5 bg-gradient-to-r from-red-50 via-amber-50/40 to-white rounded-2xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-700 text-amber-300 flex items-center justify-center text-lg shrink-0">
            ★
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900">
              Đồng chí thuộc Tổ dân phố hay Chi đoàn nào?
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Hãy gửi ngay bài viết lịch sử hoặc việc tốt học tập Bác Hồ để tích điểm thi đua cho đơn vị của bạn!
            </div>
          </div>
        </div>

        <a
          href={withBase('/gui-cau-chuyen')}
          className="shrink-0 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gửi bài tính điểm thi đua</span>
        </a>
      </div>

    </div>
  );
}
