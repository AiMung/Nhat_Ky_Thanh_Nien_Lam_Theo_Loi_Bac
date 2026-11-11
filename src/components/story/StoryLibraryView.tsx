import { useState, useMemo, useEffect } from 'react';
import { getAllStories, type Story } from '@/lib/storage';
import { withBase, formatDate } from '@/lib/utils';
import { Search, Filter, BookOpen } from 'lucide-react';

function removeTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function StoryLibraryView() {
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);

  const loadData = () => {
    setStories(getAllStories().filter((s) => s.status === 'approved'));
  };

  useEffect(() => {
    loadData();
    const handleChanged = () => loadData();
    window.addEventListener('stories-changed', handleChanged);
    return () => window.removeEventListener('stories-changed', handleChanged);
  }, []);

  const filteredStories = useMemo(() => {
    const cleanKey = removeTones(keyword.trim());

    return stories.filter((s) => {
      // Lọc theo chuyên mục
      if (selectedCat !== 'all' && s.category_id !== selectedCat) {
        return false;
      }
      // Lọc theo thời kỳ
      if (selectedPeriod !== 'all' && s.period !== selectedPeriod) {
        return false;
      }
      // Tìm kiếm từ khóa không dấu
      if (cleanKey) {
        const title = removeTones(s.title);
        const narrator = removeTones(s.narrator_name);
        const province = removeTones(s.province_name);
        const summary = removeTones(s.summary);
        return title.includes(cleanKey) || narrator.includes(cleanKey) || province.includes(cleanKey) || summary.includes(cleanKey);
      }
      return true;
    });
  }, [stories, keyword, selectedCat, selectedPeriod]);

  return (
    <div className="space-y-8">
      
      {/* Bộ lọc và Thanh tìm kiếm đa chiều */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Hàng 1: Ô tìm kiếm từ khóa */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên nhân chứng, anh hùng, địa danh, di tích (gõ không dấu hoặc có dấu)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none transition-all"
          />
        </div>

        {/* Hàng 2: Hai bộ chọn danh mục và thời kỳ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-doan-700" />
              <span>Chuyên mục / Phong trào</span>
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả chuyên mục (Hiển thị toàn bộ)</option>
              <option value="phong-trao-doan">Ký ức Thành Đoàn & Kháng chiến</option>
              <option value="thanh-nien-xung-phong">Thanh niên xung phong & Tiên phong</option>
              <option value="tinh-nguyen">Tình nguyện vì cộng đồng (Mùa hè xanh...)</option>
              <option value="bien-dao">Bảo vệ chủ quyền Biển đảo (Trường Sa, DK1)</option>
              <option value="hoc-tap-bac">Học tập & Làm theo lời Bác</option>
              <option value="cong-trinh-thanh-nien">Công trình Thanh niên thời đại số</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-redflag-700" />
              <span>Thời kỳ lịch sử</span>
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-doan-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả các thời kỳ lịch sử</option>
              <option value="1955-1975">1955 - 1975: Kháng chiến chống Mỹ, Giải phóng miền Nam</option>
              <option value="1975-1988">1975 - 1988: Khai hoang Rừng Sác & Bảo vệ biên giới</option>
              <option value="1989-nay">1989 - Nay: Thời kỳ Đổi mới, Tình nguyện & Hội nhập</option>
              <option value="1945-1954">1945 - 1954: Kháng chiến chống thực dân Pháp</option>
              <option value="1945-truoc">Trước năm 1945: Thời kỳ đầu dựng Đảng, lập Đoàn</option>
            </select>
          </div>
        </div>

        {/* Thanh đếm kết quả */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Đang hiển thị <strong className="text-doan-900 font-bold">{filteredStories.length}</strong> câu chuyện phù hợp
          </div>
          {(keyword || selectedCat !== 'all' || selectedPeriod !== 'all') && (
            <button
              onClick={() => { setKeyword(''); setSelectedCat('all'); setSelectedPeriod('all'); }}
              className="text-redflag-700 hover:underline font-bold"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

      </div>

      {/* Danh sách lưới các bài viết */}
      {filteredStories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-4">
            📜
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-800 mb-1">
            Không tìm thấy câu chuyện nào
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Không có bài viết nào khớp với từ khóa "{keyword}" hoặc bộ lọc bạn đã chọn. Hãy thử tìm với từ khóa khác nhé.
          </p>
          <button
            onClick={() => { setKeyword(''); setSelectedCat('all'); setSelectedPeriod('all'); }}
            className="px-4 py-2 bg-doan-800 text-white rounded-xl text-xs font-bold hover:bg-doan-900 transition-colors"
          >
            Xem toàn bộ câu chuyện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <article 
              key={story.id} 
              className="youth-card rounded-2xl overflow-hidden flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={story.cover_url} 
                  alt={story.title} 
                  loading="lazy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-doan-900/90 text-gold-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow border border-gold-400/30">
                    📍 {story.province_name}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white">
                  <span className="font-bold text-gold-300 text-[11px] bg-redflag-900/90 px-2.5 py-0.5 rounded border border-gold-400/30">
                    {story.category_name}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    ⏱️ {story.read_minutes} phút
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-500 mb-2">
                    {formatDate(story.published_at || story.created_at)}
                  </div>
                  <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg leading-snug group-hover:text-doan-800 transition-colors mb-2">
                    <a href={withBase(`/truyen/${story.slug}`)}>
                      {story.title}
                    </a>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <div className="font-bold text-slate-800 truncate">
                      Kể: <span className="text-doan-800">{story.narrator_name}</span>
                    </div>
                  </div>
                  <a
                    href={withBase(`/truyen/${story.slug}`)}
                    className="shrink-0 font-bold text-doan-800 bg-doan-50 hover:bg-doan-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Đọc tiếp →
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
