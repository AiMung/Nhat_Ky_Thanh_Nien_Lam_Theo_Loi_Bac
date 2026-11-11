import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { SAMPLE_STORIES, type Story } from '@/lib/supabase';
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
  const [results, setResults] = useState<Story[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (text: string, period = selectedPeriod) => {
    setKeyword(text);
    if (!text.trim() && period === 'all') {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const cleanKey = removeVietnameseTones(text.trim());

    const filtered = SAMPLE_STORIES.filter((item) => {
      const matchPeriod = period === 'all' || item.period === period;
      if (!matchPeriod) return false;

      if (!cleanKey) return true;

      const titleMatch = removeVietnameseTones(item.title).includes(cleanKey);
      const narratorMatch = removeVietnameseTones(item.narrator_name).includes(cleanKey);
      const provinceMatch = removeVietnameseTones(item.province_name).includes(cleanKey);
      const summaryMatch = removeVietnameseTones(item.summary).includes(cleanKey);

      return titleMatch || narratorMatch || provinceMatch || summaryMatch;
    });

    setResults(filtered);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative flex flex-col sm:flex-row gap-3">
        
        {/* Ô nhập từ khóa tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-500" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm theo tên nhân chứng, sự kiện, địa danh (vd: dien bien phu, ha noi)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-heritage-300 bg-white text-heritage-900 placeholder-heritage-400 focus:outline-none focus:ring-2 focus:ring-redflag-700 shadow-sm text-sm"
          />
          {keyword && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-heritage-400 hover:text-heritage-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bộ lọc thời kỳ lịch sử */}
        <div className="sm:w-56">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              handleSearch(keyword, e.target.value);
            }}
            className="w-full py-3.5 px-4 rounded-xl border border-heritage-300 bg-white text-heritage-900 text-sm focus:outline-none focus:ring-2 focus:ring-redflag-700 shadow-sm cursor-pointer"
          >
            <option value="all">Tất cả thời kỳ</option>
            <option value="1945-truoc">Trước năm 1945</option>
            <option value="1945-1954">1945 - 1954 (Kháng chiến chống Pháp)</option>
            <option value="1955-1975">1955 - 1975 (Kháng chiến chống Mỹ)</option>
            <option value="1975-1988">1975 - 1988 (Bảo vệ biên giới & hải đảo)</option>
            <option value="1989-nay">1989 - Nay (Đổi mới & Dựng xây)</option>
          </select>
        </div>

      </div>

      {/* Hiển thị kết quả tìm kiếm tức thì */}
      {isSearching && (
        <div className="mt-4 p-4 bg-white rounded-xl border border-heritage-200 shadow-lg">
          <div className="flex items-center justify-between text-xs text-heritage-600 mb-3 pb-2 border-b border-heritage-100">
            <span>Tìm thấy <strong>{results.length}</strong> câu chuyện phù hợp</span>
            <span className="text-heritage-400">Tìm kiếm không dấu & có dấu</span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-heritage-500 text-sm">
              Không tìm thấy câu chuyện nào phù hợp với từ khóa "{keyword}".
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((item) => (
                <a
                  key={item.id}
                  href={withBase(`/truyen/${item.slug}`)}
                  className="block p-3 rounded-lg hover:bg-heritage-50 border border-transparent hover:border-heritage-200 transition-all"
                >
                  <div className="flex items-center gap-2 text-xs text-redflag-800 font-semibold mb-1">
                    <span>{item.province_name}</span>
                    <span>•</span>
                    <span>{item.event_year ? `Năm ${item.event_year}` : 'Lịch sử'}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-heritage-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-heritage-600 line-clamp-1">
                    {item.summary}
                  </p>
                  <div className="text-[11px] text-heritage-400 mt-1">
                    Người kể: <span className="text-heritage-700">{item.narrator_name}</span>
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
