import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bookmark, Share2, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { toggleFavorite, getFavoriteIds } from '@/lib/storage';

interface Props {
  storyId: string;
  storyTitle: string;
  storyContent: string;
}

export default function StoryReaderToolbar({ storyId, storyTitle, storyContent }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Default font size in px
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const favs = getFavoriteIds();
    setIsFav(favs.includes(storyId));

    // Cleanup speech synthesis on unmount
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [storyId]);

  // Điều khiển Web Speech API (Đọc to bằng tiếng Việt)
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng Web Speech API.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${storyTitle}. ${storyContent.replace(/[#*>-]/g, '')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleToggleFav = () => {
    const state = toggleFavorite(storyId);
    setIsFav(state);
  };

  const handleChangeFontSize = (delta: number) => {
    const next = Math.min(26, Math.max(15, fontSize + delta));
    setFontSize(next);
    const contentEl = document.getElementById('story-body-content');
    if (contentEl) {
      contentEl.style.fontSize = `${next}px`;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3 mb-8">
      
      {/* Nhóm Nghe đọc bằng giọng nói */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleSpeech}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            isPlaying 
              ? 'bg-redflag-700 text-white animate-pulse' 
              : 'bg-doan-50 hover:bg-doan-100 text-doan-900 border border-doan-200'
          }`}
          title="Đọc to nội dung bằng Web Speech API"
        >
          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-doan-700" />}
          <span>{isPlaying ? 'Dừng đọc' : 'Nghe đọc bài'}</span>
        </button>
      </div>

      {/* Nhóm chỉnh cỡ chữ (A- / A+) */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => handleChangeFontSize(-1)}
          className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
          title="Giảm cỡ chữ"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-600 px-2 select-none">
          {fontSize}px
        </span>
        <button
          onClick={() => handleChangeFontSize(1)}
          className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors"
          title="Tăng cỡ chữ"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Nhóm Yêu thích & Chia sẻ */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleFav}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isFav 
              ? 'bg-redflag-50 border-redflag-300 text-redflag-700' 
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-redflag-600 text-redflag-600' : ''}`} />
          <span>{isFav ? 'Đã lưu' : 'Lưu lại'}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
        </button>
      </div>

    </div>
  );
}

