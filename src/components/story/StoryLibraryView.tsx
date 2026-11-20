import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getAllStories, getFavoriteStoryIds, type Story } from '@/lib/storage';
import { withBase, formatDate, resolveImageUrl } from '@/lib/utils';
import { getUnitBadge } from '@/lib/units';
import { 
  Search, 
  Filter, 
  BookOpen, 
  ChevronDown, 
  Check, 
  BookMarked, 
  Building2, 
  GraduationCap, 
  Users, 
  Sparkles,
  Compass,
  Heart,
  Flag,
  RotateCcw,
  Clock,
  Layers,
  Flame
} from 'lucide-react';

function removeTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Tất cả chuyên mục', icon: Layers },
  { id: 'hoc-tap-bac', label: 'Học tập & Làm theo lời Bác', icon: Heart },
  { id: 'dia-chi-do', label: 'Địa chỉ Đỏ & Di tích Đà Lạt', icon: Compass },
  { id: 'phong-trao-doan', label: 'Tuổi trẻ Phường Xuân Hương', icon: Flame },
  { id: 'thanh-nien-xung-phong', label: 'Thanh niên Xung phong & Tiên phong', icon: Flag },
  { id: 'tinh-nguyen', label: 'Những lá thư thời hoa lửa', icon: BookOpen },
  { id: 'bien-dao', label: 'Bảo vệ chủ quyền Biển đảo', icon: Compass }
];

const UNIT_OPTIONS = [
  { id: 'all', label: 'Tất cả các khối đơn vị', icon: Sparkles },
  { id: 'tdp', label: 'Khối 37 Tổ Dân Phố', icon: Building2 },
  { id: 'school', label: 'Khối Trường Học tại P. Xuân Hương', icon: GraduationCap },
  { id: 'citizen', label: 'Khối Người Dân & Nhân Chứng', icon: Users }
];

export default function StoryLibraryView() {
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedUnitType, setSelectedUnitType] = useState<'all' | 'tdp' | 'school' | 'citizen'>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [filterFavOnly, setFilterFavOnly] = useState(false);

  // Quản lý trạng thái mở/đóng dropdown tùy biến cao cấp
  const [openDropdown, setOpenDropdown] = useState<'cat' | 'unit' | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        catRef.current && !catRef.current.contains(event.target as Node) &&
        unitRef.current && !unitRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = () => {
    // RÀNG BUỘC CHẶT CHẼ: CHỈ HIỂN THỊ CÁC BÀI ĐÃ QUA PHÊ DUYỆT (APPROVED)
    setStories(getAllStories().filter((s) => s.status === 'approved'));
  };

  useEffect(() => {
    loadData();
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

    window.addEventListener('stories-changed', loadData);
    return () => window.removeEventListener('stories-changed', loadData);
  }, []);

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
      if (selectedUnitType !== 'all') {
        const unitName = (s.contributor_unit || s.to_dan_pho || '').toLowerCase();
        if (selectedUnitType === 'tdp' && !unitName.includes('tổ dân phố') && !unitName.includes('tdp')) {
          return false;
        }
        if (selectedUnitType === 'school' && !unitName.includes('trường') && !unitName.includes('liên đội') && !unitName.includes('cđ sư phạm') && !unitName.includes('thpt') && !unitName.includes('thcs')) {
          return false;
        }
        if (selectedUnitType === 'citizen' && !unitName.includes('người dân') && !unitName.includes('cựu chiến binh') && !unitName.includes('nhân chứng') && !unitName.includes('lão thành')) {
          return false;
        }
      }
      if (cleanKey) {
        const title = removeTones(s.title);
        const narrator = removeTones(s.narrator_name);
        const unit = removeTones(s.contributor_unit || s.to_dan_pho || '');
        const summary = removeTones(s.summary);
        return title.includes(cleanKey) || narrator.includes(cleanKey) || unit.includes(cleanKey) || summary.includes(cleanKey);
      }
      return true;
    });
  }, [stories, keyword, selectedCat, selectedUnitType, filterFavOnly]);

  const activeCategory = CATEGORY_OPTIONS.find((c) => c.id === selectedCat) || CATEGORY_OPTIONS[0];
  const activeUnit = UNIT_OPTIONS.find((u) => u.id === selectedUnitType) || UNIT_OPTIONS[0];

  const resetFilters = () => {
    setSelectedCat('all');
    setSelectedUnitType('all');
    setKeyword('');
    setFilterFavOnly(false);
    setOpenDropdown(null);
  };

  const hasActiveFilter = selectedCat !== 'all' || selectedUnitType !== 'all' || keyword.trim() !== '' || filterFavOnly;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* ================= BỘ LỌC TỔNG HỢP CAO CẤP (THANH TÌM KIẾM BÊN TRÁI + DROPDOWN TÙY BIẾN) ================= */}
      <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        
        {/* HÀNG TRÊN: THANH TÌM KIẾM BÊN TRÁI + 2 DROPDOWN BỘ LỌC BÊN PHẢI */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* 1. THANH TÌM KIẾM ĐƯA QUA BÊN TRÁI (Chiếm ưu thế thị giác) */}
          <div className="relative flex-1 lg:max-w-md xl:max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tiêu đề, nhân chứng, lời Bác, địa danh..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-stone-200 bg-stone-50/80 hover:bg-stone-50 focus:bg-white text-stone-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-stone-400 shadow-2xs"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400 hover:text-stone-700 bg-stone-200/60 hover:bg-stone-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* 2. KHU VỰC CÁC DROPDOWN BỘ LỌC ĐƯỢC THIẾT KẾ CSS TỪNG CHI TIẾT */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 flex-1 justify-start lg:justify-end">
            
            {/* DROPDOWN 1: CHUYÊN MỤC */}
            <div className="relative flex-1 sm:flex-initial sm:min-w-[210px]" ref={catRef}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs ${
                  openDropdown === 'cat'
                    ? 'border-red-600 bg-white ring-2 ring-red-100 text-stone-900'
                    : selectedCat !== 'all'
                    ? 'border-red-300 bg-red-50/60 text-red-900'
                    : 'border-stone-200 bg-stone-50/80 hover:bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <activeCategory.icon className={`w-4 h-4 shrink-0 ${selectedCat !== 'all' ? 'text-red-700' : 'text-stone-400'}`} />
                  <span className="truncate">{activeCategory.label}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform duration-200 ${openDropdown === 'cat' ? 'rotate-180 text-red-700' : ''}`} />
              </button>

              {/* CỬA SỔ MENU POPUP DROPDOWN CHUYÊN MỤC */}
              {openDropdown === 'cat' && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-stone-200 shadow-xl p-1.5 space-y-0.5 max-h-72 overflow-y-auto animate-fade-in sm:w-72">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                    Chọn Chuyên mục chủ đề
                  </div>
                  {CATEGORY_OPTIONS.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCat(cat.id);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 text-red-900 font-bold'
                            : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-red-700' : 'text-stone-400'}`} />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-700 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DROPDOWN 2: KHỐI ĐƠN VỊ ĐÓNG GÓP */}
            <div className="relative flex-1 sm:flex-initial sm:min-w-[210px]" ref={unitRef}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'unit' ? null : 'unit')}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs ${
                  openDropdown === 'unit'
                    ? 'border-red-600 bg-white ring-2 ring-red-100 text-stone-900'
                    : selectedUnitType !== 'all'
                    ? 'border-blue-300 bg-blue-50/60 text-blue-900'
                    : 'border-stone-200 bg-stone-50/80 hover:bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <activeUnit.icon className={`w-4 h-4 shrink-0 ${selectedUnitType !== 'all' ? 'text-blue-700' : 'text-stone-400'}`} />
                  <span className="truncate">{activeUnit.label}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform duration-200 ${openDropdown === 'unit' ? 'rotate-180 text-blue-700' : ''}`} />
              </button>

              {/* CỬA SỔ MENU POPUP DROPDOWN ĐƠN VỊ */}
              {openDropdown === 'unit' && (
                <div className="absolute top-full left-0 right-0 sm:right-0 sm:left-auto mt-2 z-50 bg-white rounded-2xl border border-stone-200 shadow-xl p-1.5 space-y-0.5 max-h-72 overflow-y-auto animate-fade-in sm:w-72">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
                    Chọn Khối đơn vị tham gia
                  </div>
                  {UNIT_OPTIONS.map((unit) => {
                    const Icon = unit.icon;
                    const isSelected = selectedUnitType === unit.id;
                    return (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => {
                          setSelectedUnitType(unit.id as any);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-700' : 'text-stone-400'}`} />
                          <span className="truncate">{unit.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* HÀNG DƯỚI: NÚT LỌC BÀI ĐÃ LƯU + THÔNG BÁO TỔNG SỐ BÀI VIẾT + NÚT RESET */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Nút lọc bài đã lưu */}
            <button
              type="button"
              onClick={() => setFilterFavOnly(!filterFavOnly)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                filterFavOnly
                  ? 'bg-red-800 text-white shadow-xs hover:bg-red-900'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Chỉ xem bài đã lưu</span>
            </button>

            {/* Nút đặt lại bộ lọc */}
            {hasActiveFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-800 hover:bg-red-100 font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại bộ lọc</span>
              </button>
            )}
          </div>

          {/* Đếm số câu chuyện đang hiển thị */}
          <div className="flex items-center gap-2 text-stone-500 font-medium ml-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              Hiển thị <strong className="text-red-800 font-bold text-sm">{filteredStories.length}</strong> câu chuyện đã xuất bản
            </span>
          </div>

        </div>

      </div>

      {/* ================= LƯỚI BÀI VIẾT EDITORIAL TRANG NHÃ ================= */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-stone-800 text-lg mb-1">
            Không tìm thấy câu chuyện phù hợp
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
            Hãy thử tìm bằng từ khóa khác hoặc bấm nút đặt lại bộ lọc để đọc toàn bộ kho câu chuyện lịch sử.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-full shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Xem tất cả câu chuyện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredStories.map((story) => {
            const badge = getUnitBadge(story.contributor_unit || story.to_dan_pho);
            return (
              <article 
                key={story.id} 
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-stone-300 hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Ảnh bìa bài viết với Huy hiệu đơn vị sắc nét */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={resolveImageUrl(story.cover_url)}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                  {/* Huy hiệu đơn vị đóng góp ở góc trên bên trái */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-xs shadow-md ${badge.colorClass}`}>
                      {badge.text}
                    </span>
                  </div>

                  {/* Chuyên mục ở góc dưới bên phải ảnh */}
                  <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-amber-200/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {story.category_name || 'Học tập lời Bác'}
                  </div>
                </div>

                {/* Thân bài viết */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Tên đơn vị / Địa danh */}
                    <div className="text-[11px] font-semibold text-stone-400 mb-1 flex items-center gap-1">
                      <span>🏛️</span>
                      <span className="truncate">{story.contributor_unit || story.to_dan_pho || 'Phường Xuân Hương — Đà Lạt'}</span>
                    </div>

                    <h3 className="font-serif font-black text-stone-900 text-base leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                      <a href={withBase(`/truyen/chi-tiet?slug=${story.slug}`)}>
                        {story.title}
                      </a>
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mt-2 font-normal">
                      {story.summary}
                    </p>
                  </div>

                  {/* Tác giả & Nút đọc bài */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate">
                      <span className="text-stone-400 text-[10px] block">Người kể / Nhân chứng</span>
                      <span className="font-semibold text-stone-800 truncate block">
                        {story.narrator_name || story.contributor_name || 'Đoàn viên thanh niên'}
                      </span>
                    </div>

                    <a
                      href={withBase(`/truyen/chi-tiet?slug=${story.slug}`)}
                      className="shrink-0 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-red-800 hover:text-white text-stone-700 font-bold text-xs transition-colors shadow-2xs"
                    >
                      Đọc tiếp →
                    </a>
                  </div>
                </div>

              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
