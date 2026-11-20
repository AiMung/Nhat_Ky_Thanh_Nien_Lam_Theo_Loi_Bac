import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getAllStories, getFavoriteStoryIds, type Story } from '@/lib/storage';
import { withBase, formatDate, resolveImageUrl } from '@/lib/utils';
import { getUnitBadge } from '@/lib/units';
import { Search, Filter, BookOpen, ChevronDown, Check, BookMarked, Building2, GraduationCap, Users } from 'lucide-react';

function removeTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Tất cả chuyên mục' },
  { id: 'hoc-tap-bac', label: 'Học tập & Làm theo lời Bác' },
  { id: 'dia-chi-do', label: 'Địa chỉ Đỏ & Di tích Đà Lạt' },
  { id: 'phong-trao-doan', label: 'Tuổi trẻ Phường Xuân Hương' },
  { id: 'thanh-nien-xung-phong', label: 'Thanh niên Xung phong & Tiên phong' },
  { id: 'tinh-nguyen', label: 'Những lá thư thời hoa lửa' },
  { id: 'bien-dao', label: 'Bảo vệ chủ quyền Biển đảo' }
];

export default function StoryLibraryView() {
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedUnitType, setSelectedUnitType] = useState<'all' | 'tdp' | 'school' | 'citizen'>('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [filterFavOnly, setFilterFavOnly] = useState(false);

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
        if (selectedUnitType === 'tdp' && !unitName.includes('tổ dân phố')) {
          return false;
        }
        if (selectedUnitType === 'school' && !unitName.includes('trường') && !unitName.includes('liên đội')) {
          return false;
        }
        if (selectedUnitType === 'citizen' && !unitName.includes('người dân') && !unitName.includes('cựu chiến binh') && !unitName.includes('nhân chứng')) {
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Bộ lọc tinh tế, tối giản */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        
        {/* Hàng tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tiêu đề, nhân chứng, lời Bác, địa danh Đà Lạt..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700 bg-stone-200/70 px-2 py-0.5 rounded-md"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Bộ lọc Phân loại: Chuyên mục & Khối Đơn vị */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Chuyên mục */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Chuyên mục
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Khối đơn vị đóng góp */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
              Khối Đơn Vị Đóng Góp
            </label>
            <select
              value={selectedUnitType}
              onChange={(e) => setSelectedUnitType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white"
            >
              <option value="all">Tất cả các khối đơn vị</option>
              <option value="tdp">Khối 37 Tổ Dân Phố Phường Xuân Hương</option>
              <option value="school">Khối Trường Học trên địa bàn</option>
              <option value="citizen">Khối Người Dân & Nhân Chứng</option>
            </select>
          </div>
        </div>

        {/* Nút lọc nhanh bài đã lưu & reset */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterFavOnly(!filterFavOnly)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                filterFavOnly
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Chỉ xem bài đã lưu</span>
            </button>

            {(selectedCat !== 'all' || selectedUnitType !== 'all' || keyword.trim() || filterFavOnly) && (
              <button
                type="button"
                onClick={() => { setSelectedCat('all'); setSelectedUnitType('all'); setKeyword(''); setFilterFavOnly(false); }}
                className="text-red-700 hover:underline font-semibold"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          <div className="text-stone-500">
            Hiển thị <strong className="text-red-800 font-bold">{filteredStories.length}</strong> câu chuyện đã xuất bản
          </div>
        </div>

      </div>

      {/* LƯỚI BÀI VIẾT EDITORIAL SẠCH SẼ, TRANG NHÃ */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-serif font-bold text-stone-800 text-base mb-1">
            Không tìm thấy câu chuyện phù hợp
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto mb-4">
            Hãy thử tìm bằng từ khóa khác hoặc đặt lại bộ lọc để đọc toàn bộ kho câu chuyện.
          </p>
          <button
            type="button"
            onClick={() => { setSelectedCat('all'); setSelectedUnitType('all'); setKeyword(''); setFilterFavOnly(false); }}
            className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold text-xs rounded-xl"
          >
            Xem tất cả câu chuyện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const badge = getUnitBadge(story.contributor_unit || story.to_dan_pho);
            return (
              <article 
                key={story.id} 
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all flex flex-col group"
              >
                {/* Ảnh bìa */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={resolveImageUrl(story.cover_url)}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${badge.colorClass}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                {/* Nội dung bài viết */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-semibold text-stone-500 mb-1">
                      {story.contributor_unit || story.to_dan_pho || 'Phường Xuân Hương'}
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 text-base leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                      <a href={withBase(`/truyen/chi-tiet?slug=${story.slug}`)}>
                        {story.title}
                      </a>
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mt-2">
                      {story.summary}
                    </p>
                  </div>

                  {/* Tác giả & Nút đọc */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
                    <div className="truncate">
                      <span className="text-stone-400 text-[10px] block">Người kể / Tác giả</span>
                      <span className="font-semibold text-stone-800 truncate block">{story.narrator_name || story.contributor_name}</span>
                    </div>

                    <a
                      href={withBase(`/truyen/chi-tiet?slug=${story.slug}`)}
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-800 hover:text-white text-stone-700 font-bold text-xs transition-colors"
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
