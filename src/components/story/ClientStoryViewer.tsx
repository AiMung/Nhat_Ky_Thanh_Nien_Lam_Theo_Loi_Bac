import { useState, useEffect } from 'react';
import { getAllStories, type Story } from '@/lib/storage';
import { formatDate, withBase } from '@/lib/utils';
import { renderStoryContent } from '@/lib/renderContent';
import FacebookImageGrid from '@/components/story/FacebookImageGrid';
import StoryReaderToolbar from '@/components/story/StoryReaderToolbar';
import StoryActionToolbar from '@/components/story/StoryActionToolbar';
import { ArrowLeft, Clock, MapPin, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  initialSlug?: string;
}

export default function ClientStoryViewer({ initialSlug }: Props) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy slug từ props hoặc từ URL params / pathname
    let slug = initialSlug;
    if (!slug && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      slug = urlParams.get('slug') || '';
      
      if (!slug) {
        // Trích xuất từ pathname /truyen/adasdasd-9814
        const match = window.location.pathname.match(/\/truyen\/([^/?#]+)/);
        if (match && match[1] && match[1] !== 'chi-tiet') {
          slug = decodeURIComponent(match[1]);
        }
      }
    }

    if (slug) {
      const all = getAllStories();
      const found = all.find((s) => s.slug === slug || s.id === slug);
      if (found) {
        setStory(found);
      }
    }
    setLoading(false);
  }, [initialSlug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium text-sm">Đang nạp trang nhật ký ký ức...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-700 flex items-center justify-center text-2xl mx-auto mb-4 border border-red-200">
          📜
        </div>
        <h2 className="font-serif font-bold text-2xl text-slate-900 mb-2">
          Không tìm thấy trang nhật ký
        </h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Bài viết có thể chưa được lưu trên trình duyệt này hoặc đường dẫn chưa chính xác. Hãy kiểm tra danh sách bài viết trong thư viện.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href={withBase('/thu-vien')}
            className="px-5 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs hover:bg-red-800 transition-colors shadow-sm"
          >
            Quay lại Thư viện
          </a>
          <a
            href={withBase('/tai-khoan/truyen-cua-toi')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Bài viết của tôi
          </a>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Banner thông báo trạng thái kiểm duyệt nếu bài chưa approved */}
      {story.status === 'pending' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block text-amber-950 font-bold text-sm mb-0.5">
              Bài viết đang trong hàng đợi kiểm duyệt (Chế độ xem trước)
            </strong>
            Bài viết của bạn đã được tiếp nhận và lưu an toàn. Ban Biên tập Thành Đoàn sẽ thẩm định tư liệu trước khi công bố rộng rãi trên Cổng thông tin toàn quốc.
          </div>
        </div>
      )}

      {story.status === 'rejected' && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block text-rose-950 font-bold text-sm mb-0.5">
              Bài viết cần chỉnh sửa thêm
            </strong>
            {story.reject_reason || 'Cần bổ sung thêm thông tin chứng minh nhân chứng lịch sử.'}
          </div>
        </div>
      )}

      {/* Breadcrumb điều hướng */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <a href={withBase('/')} className="hover:text-red-700 font-medium">Trang chủ</a>
        <span>/</span>
        <a href={withBase('/thu-vien')} className="hover:text-red-700 font-medium">Thư viện nhật ký</a>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{story.title}</span>
      </nav>

      {/* Header câu chuyện */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2.5 text-xs mb-4">
          <span className="font-bold text-red-800 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {story.category_name}
          </span>
          <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{story.province_name}</span>
          </span>
          {story.event_year && (
            <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Năm {story.event_year}</span>
            </span>
          )}
          <span className="text-slate-500">
            • {story.read_minutes} phút đọc
          </span>
          <span className="text-slate-500">
            • Ngày tạo: {formatDate(story.published_at || story.created_at)}
          </span>
        </div>

        <h1 className="font-serif font-black text-2xl sm:text-4xl text-slate-900 leading-tight mb-5">
          {story.title}
        </h1>

        {/* Tóm tắt */}
        <p className="text-base sm:text-lg text-slate-700 italic bg-amber-50/60 p-5 rounded-2xl border-l-4 border-amber-500 leading-relaxed mb-6">
          "{story.summary}"
        </p>

        {/* Khung thông tin Người kể & Đơn vị */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              Nhân chứng lịch sử / Người kể lại:
            </div>
            <div className="font-serif font-bold text-base text-slate-900 mt-0.5">
              {story.narrator_name}
            </div>
          </div>

          <div className="sm:border-l sm:border-slate-200 sm:pl-6 flex flex-col justify-between">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                Đơn vị / Chi đoàn ghi chép & gửi bài:
              </div>
              <div className="font-semibold text-sm text-slate-800 mt-0.5">
                {story.contributor_unit || story.contributor_name}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end">
              <StoryActionToolbar story={story} />
            </div>
          </div>
        </div>
      </header>

      {/* Album ảnh Facebook Collage */}
      <div className="mb-8">
        <FacebookImageGrid
          images={story.images && story.images.length > 0 ? story.images : [story.cover_url]}
          title={story.title}
        />
      </div>

      {/* Thanh công cụ đọc to, chỉnh cỡ chữ, bookmark */}
      <StoryReaderToolbar
        storyId={story.id}
        storyTitle={story.title}
        storyContent={story.summary + ' ' + story.body}
      />

      {/* Nội dung bài viết */}
      <div className="prose max-w-none text-slate-800 leading-relaxed font-serif text-[18px] transition-all">
        <div dangerouslySetInnerHTML={{ __html: renderStoryContent(story.body) }} />
      </div>

      {/* Xác thực tư liệu */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-red-50/70 via-amber-50/40 to-white border border-red-200/80 flex items-start gap-4 shadow-sm">
        <img
          src={withBase('/images/thoi-hoa-lua/logo-doan.webp')}
          alt="Huy hiệu Đoàn"
          className="w-12 h-12 object-contain drop-shadow shrink-0"
        />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-red-950 font-bold block mb-1 text-sm">
            XÁC THỰC BỞI ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG XUÂN HƯƠNG — ĐÀ LẠT
          </strong>
          Tư liệu trên đã được tiếp nhận, đối chiếu cẩn trọng nhằm giáo dục truyền thống cách mạng và truyền lửa nhiệt huyết cho thế hệ trẻ 37 Tổ dân phố Phường Xuân Hương và tuổi trẻ cả nước học tập, làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh.
        </div>
      </div>

      {/* Chân trang */}
      <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <a
          href={withBase('/thu-vien')}
          className="text-red-700 hover:text-red-800 font-bold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư viện nhật ký</span>
        </a>

        <a
          href={withBase('/tai-khoan/truyen-cua-toi')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
        >
          Xem danh sách bài của tôi
        </a>
      </footer>

    </article>
  );
}

