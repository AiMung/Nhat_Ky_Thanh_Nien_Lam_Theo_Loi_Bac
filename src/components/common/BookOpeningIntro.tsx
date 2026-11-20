import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import { withBase } from '@/lib/utils';

export default function BookOpeningIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(true);

  useEffect(() => {
    // Kiểm tra xem trong phiên này đã xem intro chưa
    const seen = sessionStorage.getItem('seen_book_intro_2026');
    if (!seen) {
      setHasDismissed(false);
      // Tự động mở sách sau 600ms
      const t1 = setTimeout(() => {
        setIsOpen(true);
      }, 700);

      // Tự động đóng sau khi đọc xong intro (3.8s) để vào trang chủ
      const t2 = setTimeout(() => {
        handleClose();
      }, 4500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setHasDismissed(true);
      setIsAnimating(false);
      sessionStorage.setItem('seen_book_intro_2026', 'true');
    }, 600);
  };

  // Lắng nghe sự kiện nếu người dùng bấm "Xem lại Intro" từ Header
  useEffect(() => {
    const handleReplay = () => {
      setHasDismissed(false);
      setIsOpen(false);
      setTimeout(() => setIsOpen(true), 400);
    };
    window.addEventListener('replay-book-intro', handleReplay);
    return () => window.removeEventListener('replay-book-intro', handleReplay);
  }, []);

  if (hasDismissed) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md transition-opacity duration-700 ${
        isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ perspective: '1600px' }}
    >
      {/* Nút bỏ qua nhanh */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-5 right-5 z-50 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-sm"
      >
        <span>Bỏ qua Intro</span>
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Ánh hào quang tỏa sáng từ phía sau cuốn sách */}
      <div className={`absolute w-96 h-96 rounded-full bg-gradient-to-r from-amber-500/30 via-red-600/30 to-amber-400/20 blur-3xl pointer-events-none transition-all duration-1000 ${
        isOpen ? 'scale-150 opacity-100' : 'scale-75 opacity-40'
      }`}></div>

      {/* CUỐN SÁCH LỊCH SỬ 3D */}
      <div 
        className="relative max-w-2xl w-full aspect-[16/11] sm:aspect-[16/10] transition-all duration-1000 select-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* NỀN / BÌA SAU CỦA SÁCH */}
        <div className="absolute inset-0 bg-[#2A1208] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-[#8B5A2B]/40"></div>

        {/* TRANG SÁCH BÊN TRONG (KHI MỞ RA) */}
        <div 
          className={`absolute inset-2 bg-gradient-to-r from-[#F9F5EA] via-[#FFFDF7] to-[#F5EEDB] rounded-xl p-6 sm:p-10 flex flex-col justify-between border border-[#D4AF37]/30 shadow-inner transition-opacity duration-700 ${
            isOpen ? 'opacity-100 delay-300' : 'opacity-0'
          }`}
        >
          {/* Họa tiết góc cổ kính */}
          <div className="absolute top-3 left-3 text-amber-700/30 text-lg font-serif">❧</div>
          <div className="absolute top-3 right-3 text-amber-700/30 text-lg font-serif">❧</div>
          <div className="absolute bottom-3 left-3 text-amber-700/30 text-lg font-serif">❧</div>
          <div className="absolute bottom-3 right-3 text-amber-700/30 text-lg font-serif">❧</div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/80 border border-red-300 text-red-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span>★</span>
              <span>Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — Đà Lạt</span>
              <span>★</span>
            </div>

            <div className="font-serif font-black text-xs sm:text-sm text-stone-500 uppercase tracking-widest mt-1">
              Công trình Thanh niên Số hóa
            </div>

            <h2 className="font-serif font-black text-2xl sm:text-4xl text-stone-900 leading-tight">
              Mỗi nhân chứng <br />
              là một <span className="text-red-800 underline decoration-amber-500 decoration-2 underline-offset-4">trang sử sống</span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto italic font-serif leading-relaxed pt-1">
              "Lưu giữ ký ức hào hùng của dân tộc Việt Nam qua những trang hồi ức thời hoa lửa, bài học làm theo lời Bác và sức trẻ của 37 Tổ dân phố cùng khối trường học quê hương Đà Lạt."
            </p>
          </div>

          <div className="pt-4 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-500">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Đang mở ra kho tàng 2.000+ câu chuyện lịch sử...</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full bg-red-800 hover:bg-red-900 text-amber-100 font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105"
            >
              <span>Vào khám phá ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* NẮP BÌA TRƯỚC LẬT 3D (BOOK COVER FLIP) */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-0 bg-gradient-to-br from-red-950 via-red-900 to-stone-950 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-4 border-amber-500/50 shadow-2xl cursor-pointer"
          style={{
            transformOrigin: 'left center',
            transform: isOpen ? 'rotateY(-140deg)' : 'rotateY(0deg)',
            transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            backfaceVisibility: 'hidden',
            boxShadow: isOpen 
              ? '-20px 20px 40px rgba(0,0,0,0.8)' 
              : '0 20px 50px rgba(0,0,0,0.9)'
          }}
        >
          {/* Họa tiết dập vàng trên bìa sách */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/80 flex items-center justify-center text-amber-300 text-2xl sm:text-3xl font-black mb-4 shadow-inner ring-4 ring-amber-500/20">
            ★
          </div>

          <div className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            CÂU CHUYỆN THỜI HOA LỬA
          </div>

          <h1 className="font-serif font-black text-xl sm:text-3xl text-white tracking-tight leading-snug drop-shadow-md">
            NHẬT KÝ THANH NIÊN <br />
            LÀM THEO LỜI BÁC
          </h1>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3"></div>

          <div className="text-[11px] text-amber-200/90 uppercase tracking-wider font-semibold">
            Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — Đà Lạt
          </div>

          <div className="mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-200 text-xs font-medium animate-pulse">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chạm để mở cuốn sách ký ức</span>
          </div>
        </div>

      </div>
    </div>
  );
}
