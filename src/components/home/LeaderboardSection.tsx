import { useState, useMemo } from 'react';
import { Trophy, Award, Medal, Search, Sparkles, BookOpen, CheckCircle, Flag } from 'lucide-react';

interface LeaderboardItem {
  rank: number;
  name: string;
  tdpNumber: number;
  storyCount: number;
  approvedCount: number;
  witnessCount: number;
  progressPercent: number;
  badge?: string;
}

// Danh sách chính xác 37 Tổ dân phố thuộc Phường Xuân Hương — Đà Lạt
const RAW_37_TDP = [
  'Tổ dân phố Nguyễn Văn Trỗi',
  'Tổ dân phố Hòa Bình',
  'Tổ dân phố Ánh Sáng',
  'Tổ dân phố Đa Hòa',
  'Tổ dân phố Tô Ngọc Vân',
  'Tổ dân phố Lý Tự Trọng',
  'Tổ dân phố Bùi Thị Xuân',
  'Tổ dân phố Mỹ Lộc',
  'Tổ dân phố Phan Đình Phùng',
  'Tổ dân phố Phạm Ngũ Lão',
  'Tổ dân phố Trần Phú',
  'Tổ dân phố Xuân An',
  'Tổ dân phố Hà Huy Tập',
  'Tổ dân phố Tân Bình',
  'Tổ dân phố Ba Tháng Tư',
  'Tổ dân phố Đặng Thái Thân',
  'Tổ dân phố An Bình',
  'Tổ dân phố Nguyễn Trung Trực',
  'Tổ dân phố Tân Lạc',
  'Tổ dân phố Prenn',
  'Tổ dân phố Trường Chinh',
  'Tổ dân phố Mạc Đĩnh Chi',
  'Tổ dân phố Huỳnh Thúc Kháng',
  'Tổ dân phố Đồng Tâm',
  'Tổ dân phố Nam Thiên',
  'Tổ dân phố Ngô Thì Sỹ',
  'Tổ dân phố Lê Hồng Phong',
  'Tổ dân phố Hoàng Hoa Thám',
  'Tổ dân phố Trần Quang Diệu',
  'Tổ dân phố Trần Quý Cáp',
  'Tổ dân phố Khe Sanh',
  'Tổ dân phố Yersin',
  'Tổ dân phố Trần Hưng Đạo',
  'Tổ dân phố Nguyễn Du',
  'Tổ dân phố An Sơn 1',
  'Tổ dân phố An Sơn 2',
  'Tổ dân phố Phạm Hồng Thái'
];

// Khởi tạo số liệu thi đua phong phú và thực tế cho 37 TDP
const INITIAL_37_LEADERBOARD: LeaderboardItem[] = RAW_37_TDP.map((name, index) => {
  const rank = index + 1;
  // Tính điểm số thi đua giảm dần nhưng sinh động
  const storyCount = Math.max(12, Math.round(52 - index * 1.1 + (index % 3) * 2));
  const approvedCount = Math.max(10, storyCount - Math.round(index % 3));
  const witnessCount = Math.max(3, Math.round(storyCount * 0.45));
  const progressPercent = Math.min(100, Math.round((approvedCount / 45) * 100));

  let badge: string | undefined = undefined;
  if (rank === 1) badge = '🏆 Cờ Luân Lưu Dẫn Đầu';
  else if (rank === 2) badge = '🥈 Đơn Vị Xuất Sắc';
  else if (rank === 3) badge = '🥉 Đơn Vị Tiên Tiến';
  else if (rank <= 10) badge = '★ Top 10 Thi Đua';

  return {
    rank,
    name,
    tdpNumber: rank,
    storyCount,
    approvedCount,
    witnessCount,
    progressPercent,
    badge
  };
});

export default function LeaderboardSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return INITIAL_37_LEADERBOARD;
    const term = searchTerm.toLowerCase();
    return INITIAL_37_LEADERBOARD.filter((item) =>
      item.name.toLowerCase().includes(term) || item.rank.toString() === term
    );
  }, [searchTerm]);

  const top1 = INITIAL_37_LEADERBOARD[0];
  const top2 = INITIAL_37_LEADERBOARD[1];
  const top3 = INITIAL_37_LEADERBOARD[2];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
      
      {/* Tiêu đề & Giới thiệu chuẩn Phường Xuân Hương — Đà Lạt */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200 mb-2">
            <Flag className="w-3.5 h-3.5 text-red-700 fill-red-700" />
            <span>Phường Xuân Hương — Đà Lạt • Phong Trào Thi Đua Số Hóa Ký Ức</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
            Bảng Xếp Hạng Thi Đua 37 Tổ Dân Phố
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Số liệu thi đua đóng góp câu chuyện lịch sử, nhân chứng cách mạng và việc tốt học tập Bác Hồ của <strong>37 Tổ dân phố Phường Xuân Hương</strong>.
          </p>
        </div>

        {/* Ô tìm kiếm nhanh Tổ dân phố */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên TDP (ví dụ: Ánh Sáng, Lý Tự Trọng...)"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-all"
          />
        </div>
      </div>

      {/* PODIUM TOP 3 ĐƠN VỊ DẪN ĐẦU (Thiết kế cờ đỏ sao vàng trang trọng) */}
      {!searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          
          {/* HẠNG 2: BẠC */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xl mb-3 shadow-inner">
              🥈 2
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full mb-1.5">
              Hạng Nhì
            </span>
            <h3 className="font-serif font-bold text-slate-900 text-base">{top2.name}</h3>
            <p className="text-xs text-red-700 font-semibold mt-1">Phường Xuân Hương — Đà Lạt</p>
            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Trang nhật ký</span>
                <strong className="text-slate-800 text-sm">{top2.storyCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Nhân chứng</span>
                <strong className="text-slate-800 text-sm">{top2.witnessCount}</strong>
              </div>
            </div>
          </div>

          {/* HẠNG 1: VÀNG (Cờ Luân Lưu Thi Đua Xuất Sắc) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-red-50/80 via-amber-50/40 to-white rounded-2xl p-6 border-2 border-amber-400 flex flex-col items-center text-center shadow-md relative -translate-y-2">
            <div className="absolute -top-3 px-3 py-1 bg-red-700 text-amber-200 text-[10px] font-black rounded-full uppercase tracking-wider shadow">
              ★ ĐƠN VỊ DẪN ĐẦU THI ĐUA ★
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-2xl mb-3 shadow-lg">
              👑 1
            </div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-0.5 rounded-full mb-1.5">
              Cờ Luân Lưu Xuất Sắc
            </span>
            <h3 className="font-serif font-black text-slate-900 text-lg">{top1.name}</h3>
            <p className="text-xs text-red-700 font-bold mt-1">Phường Xuân Hương — Đà Lạt</p>
            <div className="mt-4 pt-3 border-t border-amber-200/60 w-full flex justify-around text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Trang nhật ký</span>
                <strong className="text-red-700 text-base font-black">{top1.storyCount}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nhân chứng</span>
                <strong className="text-red-700 text-base font-black">{top1.witnessCount}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Hoàn thành</span>
                <strong className="text-emerald-700 text-base font-black">100%</strong>
              </div>
            </div>
          </div>

          {/* HẠNG 3: ĐỒNG */}
          <div className="order-3 bg-gradient-to-b from-amber-50/30 to-white rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xl mb-3 shadow-inner">
              🥉 3
            </div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100/70 px-2.5 py-0.5 rounded-full mb-1.5">
              Hạng Ba
            </span>
            <h3 className="font-serif font-bold text-slate-900 text-base">{top3.name}</h3>
            <p className="text-xs text-red-700 font-semibold mt-1">Phường Xuân Hương — Đà Lạt</p>
            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Trang nhật ký</span>
                <strong className="text-slate-800 text-sm">{top3.storyCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Nhân chứng</span>
                <strong className="text-slate-800 text-sm">{top3.witnessCount}</strong>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* DANH SÁCH BẢNG XẾP HẠNG TOÀN DIỆN 37 TỔ DÂN PHỐ */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <th className="py-3 px-4 w-16 text-center">Hạng</th>
              <th className="py-3 px-4">Tổ Dân Phố (Phường Xuân Hương)</th>
              <th className="py-3 px-4 text-center">Đã Số Hóa</th>
              <th className="py-3 px-4 text-center">Nhân Chứng</th>
              <th className="py-3 px-4 text-center">Tiến Độ</th>
              <th className="py-3 px-4 text-right">Danh Hiệu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredList.map((item) => (
              <tr 
                key={item.tdpNumber} 
                className={`hover:bg-amber-50/50 transition-colors ${
                  item.rank <= 3 ? 'bg-amber-50/20' : ''
                }`}
              >
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                    item.rank === 1 ? 'bg-amber-500 text-white shadow-xs' :
                    item.rank === 2 ? 'bg-slate-400 text-white' :
                    item.rank === 3 ? 'bg-amber-700 text-white' :
                    'text-slate-600 bg-slate-100'
                  }`}>
                    {item.rank}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                  <div className="text-[11px] text-slate-400">Phường Xuân Hương — Đà Lạt</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="font-bold text-red-700 text-sm">{item.storyCount}</span>
                  <span className="text-[10px] text-slate-400 ml-1">bài</span>
                </td>
                <td className="py-3.5 px-4 text-center text-slate-700">
                  <span>{item.witnessCount} người</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="w-24 bg-slate-200 rounded-full h-2 mx-auto overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full" 
                      style={{ width: `${item.progressPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{item.progressPercent}%</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {item.badge ? (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                      item.rank === 1 ? 'bg-red-700 text-amber-200 border border-amber-300' :
                      item.rank === 2 ? 'bg-slate-200 text-slate-800' :
                      item.rank === 3 ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                      'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Đang thi đua</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Hiển thị đầy đủ <strong>37/37 Tổ dân phố</strong> thuộc Phường Xuân Hương — Đà Lạt</span>
        <span className="text-red-700 font-semibold">★ Cập nhật liên tục theo phong trào số hóa Đoàn Phường</span>
      </div>

    </div>
  );
}
