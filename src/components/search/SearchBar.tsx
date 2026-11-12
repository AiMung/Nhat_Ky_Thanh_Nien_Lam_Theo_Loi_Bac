import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check, Sparkles } from 'lucide-react';
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

const PERIOD_LIST = [
  { id: 'all', label: 'Tất cả các thời kỳ lịch sử' },
  { id: '1989-nay', label: '1989 - Nay: Thời kỳ Đổi mới & Hội nhập' },
  { id: '1975-1988', label: '1975 - 1988: Biên giới & Biển đảo quê hương' },
  { id: '1955-1975', label: '1955 - 1975: Kháng chiến chống Mỹ cứu nước' },
  { id: '1945-1954', label: '1945 - 1954: Kháng chiến chống thực dân Pháp' },
  { id: '1945-truoc', label: 'Trước 1945: Thời kỳ dựng Đảng, lập Đội' }
];

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close results dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setPeriodDropdownOpen(false);
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

  const handlePeriodSelect = (p: string) => {
    setSelectedPeriod(p);
    setPeriodDropdownOpen(false);
    setIsSearching(Boolean(keyword.trim() || p !== 'all'));
  };

  const handleClose = () => {
    setIsSearching(false);
  };

  const currentPeriodLabel = useMemo(() => {
    return PERIOD_LIST.find((p) => p.id === selectedPeriod)?.label || 'Tất cả các thời kỳ';
  }, [selectedPeriod]);

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="relative flex flex-col sm:flex-row gap-2.5">
        
        {/* Ô nhập từ khóa */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
          <input
            type="text"
            value={keyword}
            onFocus={() => { if (keyword.trim() || selectedPeriod !== 'all') setIsSearching(true); }}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Tìm tên anh hùng, Bác Hồ, di tích Đà Lạt, nhân chứng (gõ có hoặc không dấu)..."
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

        {/* Bộ lọc thời kỳ: Custom Dropdown CSS đẹp mắt chuẩn Cờ đỏ sao vàng */}
        <div className="sm:w-64 shrink-0 relative">
          <button
            type="button"
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="w-full h-full py-3 px-3.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white text-slate-800 text-xs font-semibold flex items-center justify-between shadow-inner transition-colors cursor-pointer text-left"
          >
            <span className="truncate pr-1">{currentPeriodLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${periodDropdownOpen ? 'rotate-180 text-red-700' : ''}`} />
          </button>

          {periodDropdownOpen && (
            <div className="absolute top-full right-0 left-0 sm:w-72 mt-2 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 bg-red-50 text-[10px] font-bold text-red-800 uppercase tracking-widest border-b border-red-100 flex items-center gap-1">
                <span>★</span>
                <span>Giai đoạn lịch sử</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {PERIOD_LIST.map((item) => {
                  const isSelected = item.id === selectedPeriod;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handlePeriodSelect(item.id)}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-red-700 text-white font-bold'
                          : 'hover:bg-amber-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Kết quả tìm kiếm thời gian thực: Gọn gàng max-h-72 có nút đóng rõ ràng */}
      {isSearching && (
        <div className="absolute left-0 right-0 top-full mt-2 p-3 sm:p-4 bg-white rounded-2xl border-2 border-amber-400/80 shadow-2xl z-50 text-left max-h-72 overflow-y-auto animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 pb-2 border-b border-slate-100">
            <span className="flex items-center gap-1 font-medium">
              <span className="text-red-700 font-bold">★</span>
              <span>Tìm thấy <strong className="text-red-700 font-bold">{results.length}</strong> câu chuyện phù hợp</span>
            </span>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 font-semibold px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Đóng</span>
            </button>
          </div>

          {results.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              Không tìm thấy câu chuyện nào phù hợp. Hãy thử từ khóa khác hoặc chuyển sang "Tất cả các thời kỳ lịch sử".
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((item) => (
                <a
                  key={item.id}
                  href={withBase(`/truyen/chi-tiet?slug=${item.slug}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 transition-all group"
                >
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-12 h-14 object-cover object-center rounded-lg shrink-0 border border-slate-200 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-red-700">{item.province_name}</span>
                      <span>•</span>
                      <span className="text-amber-800 font-medium">{item.category_name}</span>
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
