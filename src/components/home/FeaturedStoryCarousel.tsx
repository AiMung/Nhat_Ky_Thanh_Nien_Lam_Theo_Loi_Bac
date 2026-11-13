import React, { useState } from 'react';
import { withBase, resolveImageUrl } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import type { Story } from '@/lib/storage';

interface Props {
  stories: Story[];
}

export default function FeaturedStoryCarousel({ stories }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/90 p-4 sm:p-6 shadow-xs relative overflow-hidden">
      
      {/* Header dòng chữ và 2 nút mũi tên < > ở góc phải */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-red-800 bg-red-100 px-3 py-1 rounded-full border border-red-200">
            ★ CÂU CHUYỆN NỔI BẬT
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            ({currentIndex + 1} / {stories.length})
          </span>
        </div>

        {/* Nút điều hướng Carousel tròn */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-white hover:bg-amber-100 border border-amber-300 flex items-center justify-center text-slate-700 hover:text-red-700 transition-colors shadow-2xs"
            title="Câu chuyện trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-white hover:bg-amber-100 border border-amber-300 flex items-center justify-center text-slate-700 hover:text-red-700 transition-colors shadow-2xs"
            title="Câu chuyện tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thẻ nội dung chính (Ảnh trái, chữ phải) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Cột trái: Ảnh tư liệu lớn */}
        <div className="md:col-span-6 rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-amber-200/80 shadow-xs relative group">
          <img
            src={resolveImageUrl(currentStory.cover_url)}
            alt={currentStory.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-700/90 text-amber-200 text-xs font-bold shadow backdrop-blur-xs">
            {currentStory.category_name}
          </div>
        </div>

        {/* Cột phải: Thông tin & Trích dẫn */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-red-800">
              {currentStory.to_dan_pho || currentStory.province_name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentStory.read_minutes} phút đọc</span>
            </span>
          </div>

          <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-900 leading-snug hover:text-red-700 transition-colors">
            <a href={withBase(`/truyen/chi-tiet?slug=${currentStory.slug}`)}>
              {currentStory.title}
            </a>
          </h3>

          <p className="font-serif italic text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed border-l-2 border-red-700 pl-3 py-0.5">
            "{currentStory.summary}"
          </p>

          <div className="pt-2 text-xs text-slate-500">
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">Người kể / Nhân chứng:</span>
            <span className="font-bold text-slate-900 text-sm">{currentStory.narrator_name}</span>
          </div>

          <div className="pt-3">
            <a
              href={withBase(`/truyen/chi-tiet?slug=${currentStory.slug}`)}
              className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-bold text-xs sm:text-sm hover:underline"
            >
              <span>Đọc tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

