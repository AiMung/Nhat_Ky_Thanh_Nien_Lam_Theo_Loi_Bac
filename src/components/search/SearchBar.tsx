import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, BookOpen, Clock, MapPin } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close results dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleClose = () => {
    setIsSearching(false);
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="relative flex flex-col sm:flex-row gap-2.5">
        
        {/* Ô nhập từ khóa */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onFocus={() => { if (keyword.trim() || selectedPeriod !== 'all') setIsSearching(true); }}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Tìm tên anh hùng, liệt sĩ, nhân chứng, di tích (gõ có hoặc không dấu)..."
            className="w-full pl-10 pr-9 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm font-medium shadow-inner"
          />
          {keyword && (
            <button
              onClick={() => { setKeyword(''); setIsSearching(Boolean(selectedPeriod !== 'all')); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bộ lọc thời kỳ */}
        <div className="sm:w-56 shrink-0">
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriod(e.target.value)}
            className="w-full py-3 px-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer shadow-inner"
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

      {/* Kết quả tìm kiếm thời gian thực: Gọn gàng max-h-64 có nút đóng rõ ràng */}
      {isSearching && (
        <div className="absolute left-0 right-0 top-full mt-2 p-3 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 text-left max-h-64 sm:max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 pb-2 border-b border-slate-100">
            <span>Tìm thấy <strong className="text-red-700 font-bold">{results.length}</strong> câu chuyện</span>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 font-semibold px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đóng</span>
            </button>
          </div>

          {results.length === 0 ? (
            <div className="py-5 text-center text-xs text-slate-500">
              Không tìm thấy trang nhật ký nào phù hợp. Hãy thử từ khóa khác hoặc chuyển sang "Mọi thời kỳ lịch sử".
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((item) => (
                <a
                  key={item.id}
                  href={withBase(`/truyen/chi-tiet?slug=${item.slug}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-12 h-12 object-cover object-top rounded-lg shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-red-700">{item.province_name}</span>
                      <span>•</span>
                      <span>{item.category_name}</span>
                    </div>
                    <div className="font-serif font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-700 truncate">
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
