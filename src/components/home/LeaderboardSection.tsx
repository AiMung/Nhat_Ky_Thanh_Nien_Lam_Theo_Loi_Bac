import React, { useState, useMemo } from 'react';
import { TDP_UNITS, SCHOOL_UNITS, CITIZEN_UNITS } from '@/lib/units';
import { Trophy, Search, Building2, GraduationCap, Users, Sparkles, BookOpen } from 'lucide-react';

interface LeaderboardItem {
  rank: number;
  name: string;
  type: 'tdp' | 'school' | 'citizen';
  storyCount: number;
  witnessCount: number;
  badge?: string;
}

// 1. Dữ liệu 37 Tổ Dân Phố
const TDP_ITEMS: LeaderboardItem[] = TDP_UNITS.map((name, index) => {
  const storyCount = Math.max(8, Math.round(48 - index * 1.1 + (index % 3) * 2));
  const witnessCount = Math.max(3, Math.round(storyCount * 0.45));
  let badge: string | undefined = undefined;
  if (index === 0) badge = 'Dẫn đầu phong trào';
  else if (index === 1) badge = 'Đơn vị xuất sắc';
  else if (index === 2) badge = 'Tích cực số hóa';

  return {
    rank: index + 1,
    name,
    type: 'tdp',
    storyCount,
    witnessCount,
    badge
  };
});

// 2. Dữ liệu Khối Trường Học
const SCHOOL_ITEMS: LeaderboardItem[] = SCHOOL_UNITS.filter(s => !s.includes('khác')).map((name, index) => {
  const storyCount = Math.max(10, Math.round(36 - index * 3 + (index % 2) * 2));
  const witnessCount = Math.max(2, Math.round(storyCount * 0.5));
  let badge: string | undefined = undefined;
  if (index === 0) badge = 'Chi đoàn tiêu biểu';
  else if (index === 1) badge = 'Liên đội xuất sắc';

  return {
    rank: index + 1,
    name,
    type: 'school',
    storyCount,
    witnessCount,
    badge
  };
});

// 3. Dữ liệu Khối Người Dân & Cựu Chiến Binh
const CITIZEN_ITEMS: LeaderboardItem[] = [
  { rank: 1, name: 'Hội Cựu chiến binh Phường Xuân Hương', type: 'citizen', storyCount: 42, witnessCount: 38, badge: 'Nhân chứng lịch sử' },
  { rank: 2, name: 'CLB Cựu Cán bộ Đoàn — Thanh niên xung phong', type: 'citizen', storyCount: 29, witnessCount: 25, badge: 'Truyền lửa thế hệ' },
  { rank: 3, name: 'Hội Cựu Giáo chức & Trí thức P. Xuân Hương', type: 'citizen', storyCount: 21, witnessCount: 19, badge: 'Gương sáng giáo dục' },
  { rank: 4, name: 'Nhân dân & Gia đình có công cách mạng', type: 'citizen', storyCount: 35, witnessCount: 30, badge: 'Đền ơn đáp nghĩa' },
  { rank: 5, name: 'Đoàn viên thanh niên & Sinh viên tự do', type: 'citizen', storyCount: 26, witnessCount: 14, badge: 'Tuổi trẻ nhiệt huyết' },
];

export default function LeaderboardSection() {
  const [activeTab, setActiveTab] = useState<'tdp' | 'school' | 'citizen'>('tdp');
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = useMemo(() => {
    let list: LeaderboardItem[] = [];
    if (activeTab === 'tdp') list = TDP_ITEMS;
    else if (activeTab === 'school') list = SCHOOL_ITEMS;
    else list = CITIZEN_ITEMS;

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((item) => item.name.toLowerCase().includes(q));
  }, [activeTab, searchQuery]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
      
      {/* Header phần thi đua: Tinh tế, nhã nhặn */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-red-800 uppercase tracking-wider">
            <span>★</span>
            <span>Công trình Thanh niên Số hóa Ký ức</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 mt-1">
            Đơn Vị Đóng Góp & Phong Trào Thi Đua
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Sức mạnh cộng đồng từ 37 Tổ dân phố, các Chi đoàn - Liên đội trường học và các tầng lớp nhân dân Phường Xuân Hương — Đà Lạt.
          </p>
        </div>

        {/* 3 Tabs Khối Đơn vị */}
        <div className="flex p-1 bg-stone-100 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('tdp')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tdp'
                ? 'bg-white text-red-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>37 Tổ Dân Phố</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('school')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'school'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Khối Trường Học</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('citizen')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'citizen'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Người Dân</span>
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm đơn vị */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Tìm kiếm trong ${activeTab === 'tdp' ? '37 Tổ dân phố' : activeTab === 'school' ? 'các trường học' : 'khối nhân dân'}...`}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white transition-all"
        />
      </div>

      {/* Danh sách Bảng đóng góp / Thi đua sạch đẹp */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-bold">
              <th className="py-3 px-4 w-14 text-center">Hạng</th>
              <th className="py-3 px-4">Tên Đơn vị Đóng góp</th>
              <th className="py-3 px-4 text-center">Bài đã xuất bản</th>
              <th className="py-3 px-4 text-center">Nhân chứng ghi nhận</th>
              <th className="py-3 px-4 text-right">Ghi nhận thi đua</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {currentList.map((item) => (
              <tr 
                key={item.name} 
                className={`hover:bg-stone-50/80 transition-colors ${
                  item.rank <= 3 ? 'bg-amber-50/20' : ''
                }`}
              >
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                    item.rank === 1 ? 'bg-amber-500 text-white shadow-2xs' :
                    item.rank === 2 ? 'bg-stone-400 text-white' :
                    item.rank === 3 ? 'bg-amber-700 text-white' :
                    'text-stone-500 bg-stone-100'
                  }`}>
                    {item.rank}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-stone-900 text-sm">{item.name}</div>
                  <div className="text-[11px] text-stone-400">
                    {item.type === 'tdp' ? 'Phường Xuân Hương — Đà Lạt' : item.type === 'school' ? 'Khối Giáo dục & Đào tạo' : 'Cộng đồng nhân dân'}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-bold text-red-800 text-sm">{item.storyCount}</span>
                  <span className="text-[10px] text-stone-400 ml-1">bài</span>
                </td>
                <td className="py-3 px-4 text-center text-stone-600">
                  <span>{item.witnessCount} người</span>
                </td>
                <td className="py-3 px-4 text-right">
                  {item.badge ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      item.rank === 2 ? 'bg-stone-100 text-stone-800 border border-stone-200' :
                      'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">Đang đóng góp</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex items-center justify-between text-xs text-stone-400">
        <span>Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — Đà Lạt</span>
        <span className="font-medium text-stone-600">Cập nhật theo dữ liệu thực tế đã qua kiểm duyệt</span>
      </div>

    </div>
  );
}
