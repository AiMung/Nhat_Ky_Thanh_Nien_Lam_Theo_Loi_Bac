import { useState, useMemo, useEffect, useRef } from 'react';
import { getAllStories, getFavoriteStoryIds, type Story } from '@/lib/storage';
import { withBase, formatDate } from '@/lib/utils';
import { Search, Filter, BookOpen, ChevronDown, Check, Sparkles, BookMarked } from 'lucide-react';

function removeTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Tất cả chuyên mục (Toàn bộ)' },
  { id: 'hoc-tap-bac', label: '★ Học tập & Làm theo lời Bác' },
  { id: 'dia-chi-do', label: '📍 Địa chỉ Đỏ & Di tích Đà Lạt' },
  { id: 'phong-trao-doan', label: '🌸 Tuổi trẻ Phường Xuân Hương' },
  { id: 'thanh-nien-xung-phong', label: '⚔️ Thanh niên Xung phong & Tiên phong' },
  { id: 'tinh-nguyen', label: '💌 Những lá thư thời hoa lửa' },
  { id: 'bien-dao', label: '🌊 Bảo vệ chủ quyền Biển đảo (Hoàng Sa - Trường Sa)' }
];

const PERIOD_OPTIONS = [
  { id: 'all', label: 'Tất cả các thời kỳ lịch sử' },
  { id: '1945-truoc', label: 'Trước 1945: Thời kỳ dựng Đảng, lập Đội' },
  { id: '1945-1954', label: '1945 - 1954: Kháng chiến chống thực dân Pháp' },
  { id: '1955-1975', label: '1955 - 1975: Kháng chiến chống Mỹ, Giải phóng' },
  { id: '1975-1988', label: '1975 - 1988: Biên giới & Chủ quyền Biển đảo' },
  { id: '1989-nay', label: '1989 - Nay: Thời kỳ Đổi mới, Số hóa & Hội nhập' }
];

export default function StoryLibraryView() {
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [filterFavOnly, setFilterFavOnly] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setStories(getAllStories().filter((s) => s.status === 'approved'));
  };

  useEffect(() => {
    loadData();
    // Kiểm tra query param nếu người dùng click vào Xem đã lưu
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('fav') === 'true') {
        setFilterFavOnly(true);
      }
      const catParam = urlParams.get('cat');
      if (catParam) {
        setSelectedCat(catParam);
      }
      const qParam = urlParams.get('q');
      if (qParam) {
        setKeyword(qParam);
      }
    }
    const handleChanged = () => loadData();
    window.addEventListener('stories-changed', handleChanged);
    return () => window.removeEventListener('stories-changed', handleChanged);
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setPeriodOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCatLabel = useMemo(() => {
    return CATEGORY_OPTIONS.find((c) => c.id === selectedCat)?.label || 'Tất cả chuyên mục';
  }, [selectedCat]);

  const selectedPeriodLabel = useMemo(() => {
    return PERIOD_OPTIONS.find((p) => p.id === selectedPeriod)?.label || 'Tất cả các thời kỳ';
  }, [selectedPeriod]);

  const filteredStories = useMemo(() => {
    const cleanKey = removeTones(keyword.trim());
    const favIds = filterFavOnly ? getFavoriteStoryIds() : [];

    return stories.filter((s) => {
      if (filterFavOnly && !favIds.includes(s.id)) {
        return false;
      }
      if (selectedCat !== 'all' && s.category_id !== selectedCat) {
        return false;
      }
      if (selectedPeriod !== 'all' && s.period !== selectedPeriod) {
        return false;
      }
      if (cleanKey) {
        const title = removeTones(s.title);
        const narrator = removeTones(s.narrator_name);
        const province = removeTones(s.province_name);
        const summary = removeTones(s.summary);
        return title.includes(cleanKey) || narrator.includes(cleanKey) || province.includes(cleanKey) || summary.includes(cleanKey);
      }
      return true;
    });
  }, [stories, keyword, selectedCat, selectedPeriod, filterFavOnly]);

  return (
    <div className="space-y-8">
      
      {/* Bộ lọc và Thanh tìm kiếm đa chiều chuẩn Cờ đỏ sao vàng */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Hàng 1: Ô tìm kiếm từ khóa */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-700" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên nhân chứng, Bác Hồ, di tích Đà Lạt, anh hùng liệt sĩ (gõ có hoặc không dấu)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-all shadow-inner font-medium"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200/80 px-2 py-1 rounded-lg"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Hàng 2: Hai bộ chọn Custom Dropdown chuẩn CSS Cờ đỏ sao vàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* CUSTOM DROPDOWN 1: CHUYÊN MỤC */}
          <div ref={catRef} className="relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-red-700" />
              <span>Chuyên mục / Phong trào</span>
            </label>
            
            <button
              type="button"
              onClick={() => { setCatOpen(!catOpen); setPeriodOpen(false); }}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs transition-colors cursor-pointer text-left"
            >
              <span className="truncate pr-2">{selectedCatLabel}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${catOpen ? 'rotate-180 text-red-700' : ''}`} />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-amber-400/80 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in duration-200">
                <div className="px-3 py-1.5 bg-red-50 text-[10px] font-bold text-red-800 uppercase tracking-widest border-b border-red-100 flex items-center gap-1">
                  <span>★</span>
                  <span>Chọn chuyên mục nhật ký</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = cat.id === selectedCat;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { setSelectedCat(cat.id); setCatOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-700 text-white font-bold'
                            : 'hover:bg-amber-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-300 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CUSTOM DROPDOWN 2: THỜI KỲ LỊCH SỬ */}
          <div ref={periodRef} className="relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-red-700" />
              <span>Thời kỳ lịch sử</span>
            </label>
            
            <button
              type="button"
              onClick={() => { setPeriodOpen(!periodOpen); setCatOpen(false); }}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs transition-colors cursor-pointer text-left"
            >
              <span className="truncate pr-2">{selectedPeriodLabel}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${periodOpen ? 'rotate-180 text-red-700' : ''}`} />
            </button>

            {periodOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-amber-400/80 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in duration-200">
                <div className="px-3 py-1.5 bg-red-50 text-[10px] font-bold text-red-800 uppercase tracking-widest border-b border-red-100 flex items-center gap-1">
                  <span>★</span>
                  <span>Chọn giai đoạn lịch sử</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {PERIOD_OPTIONS.map((p) => {
                    const isSelected = p.id === selectedPeriod;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setSelectedPeriod(p.id); setPeriodOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-red-700 text-white font-bold'
                            : 'hover:bg-amber-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-300 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Nút lọc nhanh: Đã lưu & Số lượng kết quả */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterFavOnly(!filterFavOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                filterFavOnly
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Chỉ xem bài đã lưu</span>
            </button>

            {(selectedCat !== 'all' || selectedPeriod !== 'all' || keyword.trim() || filterFavOnly) && (
              <button
                type="button"
                onClick={() => { setSelectedCat('all'); setSelectedPeriod('all'); setKeyword(''); setFilterFavOnly(false); }}
                className="text-red-700 hover:underline font-semibold"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          <div className="text-slate-500 font-medium">
            Đang hiển thị <strong className="text-red-700 font-bold">{filteredStories.length}</strong> câu chuyện phù hợp
          </div>
        </div>

      </div>

      {/* LƯỚI BÀI VIẾT HÌNH CHỮ NHẬT DỰNG ĐỨNG (PORTRAIT ASPECT-[3/4] THỜI HOA LỬA) */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
            ★
          </div>
          <h3 className="font-serif font-black text-slate-900 text-lg mb-2">
            Không tìm thấy câu chuyện phù hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Hãy thử tìm bằng từ khóa khác hoặc bấm nút đặt lại bộ lọc để đọc toàn bộ kho câu chuyện.
          </p>
          <button
            type="button"
            onClick={() => { setSelectedCat('all'); setSelectedPeriod('all'); setKeyword(''); setFilterFavOnly(false); }}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Xem tất cả câu chuyện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStories.map((story) => (
            <article 
              key={story.id} 
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              
              {/* Ảnh hình chữ nhật dựng đứng (aspect-[3/4] portrait) */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
                <img
                  src={story.cover_url}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                
                {/* Lớp bóng mờ cổ kính */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent"></div>

                {/* Huy hiệu Cờ đỏ ở góc trên */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className="bg-red-700/95 text-amber-200 border border-amber-300/40 text-[10px] font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <span>★</span>
                    <span>{story.province_name.replace('TP. ', '')}</span>
                  </span>
                  {story.event_year && (
                    <span className="bg-slate-950/80 backdrop-blur-md text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      {story.event_year}
                    </span>
                  )}
                </div>

                {/* Tên danh mục & Thời gian đọc ở góc dưới ảnh dựng đứng */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-bold text-[10px] text-amber-200 bg-red-950/90 border border-amber-400/40 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow">
                    {story.category_name}
                  </span>
                  <span className="text-[11px] text-amber-100 font-medium drop-shadow">
                    ⏱️ {story.read_minutes} phút đọc
                  </span>
                </div>
              </div>

              {/* Thông tin bài viết */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5 font-medium">
                    Xuất bản: {formatDate(story.published_at || story.created_at)}
                  </div>
                  
                  <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-red-700 transition-colors mb-2.5 line-clamp-2">
                    <a href={withBase(`/truyen/chi-tiet?slug=${story.slug}`)}>
                      {story.title}
                    </a>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {story.summary}
                  </p>
                </div>

                {/* Người kể & Nút đọc bài */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Người kể:</span>
                    <span className="text-slate-900 font-bold truncate block">{story.narrator_name}</span>
                  </div>
                  <a
                    href={withBase(`/truyen/chi-tiet?slug=${story.slug}`)}
                    className="shrink-0 px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xs hover:shadow transition-colors"
                  >
                    Đọc bài →
                  </a>
                </div>
              </div>

            </article>
          ))}
        </div>
      )}

    </div>
  );
}
