import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { getAllStories } from '@/lib/storage';
import { withBase } from '@/lib/utils';

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const stories = useMemo(() => {
    return getAllStories().filter((s) => s.status === 'approved');
  }, []);

  const results = useMemo(() => {
    if (!keyword.trim() && selectedPeriod === 'all') {
      return [];
    }

    const cleanKey = removeVietnameseTones(keyword.trim());

    return stories.filter((item) => {
      const matchPeriod = selectedPeriod === 'all' || item.period === selectedPeriod;
      if (!matchPeriod) return false;

      if (!cleanKey) return true;

      const titleMatch = removeVietnameseTones(item.title).includes(cleanKey);
      const narratorMatch = removeVietnameseTones(item.narrator_name).includes(cleanKey);
      const provinceMatch = removeVietnameseTones(item.province_name).includes(cleanKey);
      const summaryMatch = removeVietnameseTones(item.summary).includes(cleanKey);

      return titleMatch || narratorMatch || provinceMatch || summaryMatch;
    });
  }, [stories, keyword, selectedPeriod]);

  const handleInput = (text: string) => {
    setKeyword(text);
    setIsSearching(Boolean(text.trim() || selectedPeriod !== 'all'));
  };

  const handlePeriod = (p: string) => {
    setSelectedPeriod(p);
    setIsSearching(Boolean(keyword.trim() || p !== 'all'));
  };

  return (
    <div className="w-full relative">
      <div className="relative flex flex-col sm:flex-row gap-3">
        
        {/* Ô nhập từ khóa */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Tìm theo tên anh hùng, liệt sĩ, nhân chứng, di tích (gõ không dấu hoặc có dấu)..."
            className="w-full pl-12 pr-10 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-doan-600 shadow-lg text-sm"
          />
          {keyword && (
            <button
              onClick={() => handleInput('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bộ lọc thời kỳ */}
        <div className="sm:w-60">
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriod(e.target.value)}
            className="w-full py-4 px-4 rounded-2xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-doan-600 shadow-lg cursor-pointer"
          >
            <option value="all">Mọi thời kỳ lịch sử</option>
            <option value="1989-nay">1989 - Nay (Đổi mới & Hội nhập)</option>
            <option value="1975-1988">1975 - 1988 (Khai hoang & Biên giới)</option>
            <option value="1955-1975">1955 - 1975 (Chống Mỹ cứu nước)</option>
            <option value="1945-1954">1945 - 1954 (Kháng chiến chống Pháp)</option>
            <option value="1945-truoc">Trước năm 1945 (Dựng Đảng, lập Đoàn)</option>
          </select>
        </div>

      </div>

      {/* Kết quả tìm kiếm thời gian thực */}
      {isSearching && (
        <div className="absolute left-0 right-0 top-full mt-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 text-left max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
            <span>Tìm thấy <strong className="text-doan-800 font-bold">{results.length}</strong> câu chuyện</span>
            <button
              onClick={() => { setKeyword(''); setSelectedPeriod('all'); setIsSearching(false); }}
              className="text-redflag-700 hover:underline font-semibold"
            >
              Đóng kết quả
            </button>
          </div>

          {results.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              Không tìm thấy câu chuyện nào phù hợp. Bạn hãy thử gõ không dấu hoặc chọn thời kỳ khác nhé!
            </div>
          ) : (
            <div className="space-y-2.5">
              {results.map((item) => (
                <a
                  key={item.id}
                  href={withBase(`/truyen/${item.slug}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                      <span className="font-bold text-doan-800">{item.province_name}</span>
                      <span>•</span>
                      <span>{item.category_name}</span>
                    </div>
                    <div className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-doan-800 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Kể bởi: <span className="text-slate-800 font-medium">{item.narrator_name}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
