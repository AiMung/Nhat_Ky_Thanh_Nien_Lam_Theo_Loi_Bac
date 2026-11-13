import React, { useState, useEffect, useRef } from 'react';
import { 
  submitNewStory, 
  getHistoricalCharacters, 
  addHistoricalCharacter, 
  type HistoricalCharacter, 
  type Story 
} from '@/lib/storage';
import { getCurrentSession, type UserAccount } from '@/lib/auth';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';
import { saveStoryToSupabase } from '@/lib/supabase';
import { withBase } from '@/lib/utils';
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Send, 
  User, 
  Plus, 
  X, 
  Search, 
  FileText, 
  Video, 
  Mic, 
  Image as ImageIcon, 
  Check, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading2, 
  Heading3, 
  Heading4, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Table, 
  Undo, 
  Redo, 
  Upload, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

// Danh sách chuẩn 37 Tổ Dân Phố Phường Xuân Hương - Đà Lạt
const TO_DAN_PHO_LIST = [
  'Tổ dân phố Nguyễn Văn Trỗi',
  'Tổ dân phố Hòa Bình',
  'Tổ dân phố Ánh Sáng',
  'Tổ dân phố Đa Hòa',
  'Tổ dân phố Tô Ngọc Vân',
  'Tổ dân phố Lý Tự Trọng',
  'Tổ dân phố Bùi Thị Xuân',
  'Tổ dân phố Mỹ Lộc',
  'Tổ dân phố Phan Đình Phùng',
  'Tổ dân phố Phạm Ngũ Lão',
  'Tổ dân phố Trần Phú',
  'Tổ dân phố Xuân An',
  'Tổ dân phố Hà Huy Tập',
  'Tổ dân phố Tân Bình',
  'Tổ dân phố Ba Tháng Tư',
  'Tổ dân phố Đặng Thái Thân',
  'Tổ dân phố An Bình',
  'Tổ dân phố Nguyễn Trung Trực',
  'Tổ dân phố Tân Lạc',
  'Tổ dân phố Prenn',
  'Tổ dân phố Trường Chinh',
  'Tổ dân phố Mạc Đĩnh Chi',
  'Tổ dân phố Huỳnh Thúc Kháng',
  'Tổ dân phố Đồng Tâm',
  'Tổ dân phố Nam Thiên',
  'Tổ dân phố Ngô Thì Sỹ',
  'Tổ dân phố Lê Hồng Phong',
  'Tổ dân phố Hoàng Hoa Thám',
  'Tổ dân phố Trần Quang Diệu',
  'Tổ dân phố Trần Quý Cáp',
  'Tổ dân phố Khe Sanh',
  'Tổ dân phố Yersin',
  'Tổ dân phố Trần Hưng Đạo',
  'Tổ dân phố Nguyễn Du',
  'Tổ dân phố An Sơn 1',
  'Tổ dân phố An Sơn 2',
  'Tổ dân phố Phạm Hồng Thái'
];

export default function StorySubmitForm() {
  const [currentUser, setCurrentUser] = useState<UserAccount>(getCurrentSession());

  // 1. Quản lý Nhân vật lịch sử
  const [characterList, setCharacterList] = useState<HistoricalCharacter[]>([]);
  const [characterSearch, setCharacterSearch] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<HistoricalCharacter[]>([]);
  const [showNewCharModal, setShowNewCharModal] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharBirth, setNewCharBirth] = useState('');
  const [newCharHometown, setNewCharHometown] = useState('');
  const [newCharBio, setNewCharBio] = useState('');

  // 2. Nội dung bài viết
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [mediaType, setMediaType] = useState<'article' | 'video' | 'audio' | 'gallery'>('article');
  const [period, setPeriod] = useState('1954-1975');
  const [eventYear, setEventYear] = useState<number | ''>(1968);
  const [toDanPho, setToDanPho] = useState(TO_DAN_PHO_LIST[2]); // Mặc định Tổ TDP Ánh Sáng
  const [category, setCategory] = useState('hoc-tap-bac');
  const [body, setBody] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 3. Đa phương tiện
  const [images, setImages] = useState<string[]>([
    '/images/thoi-hoa-lua-hero.jpg'
  ]);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // 4. Cam kết của người gửi
  const [c1, setC1] = useState(true);
  const [c2, setC2] = useState(true);
  const [c3, setC3] = useState(true);
  const [c4, setC4] = useState(true);

  // 5. Trạng thái phản hồi & Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCharacterList(getHistoricalCharacters());
    const session = getCurrentSession();
    setCurrentUser(session);
    if (session.role === 'tdp' && session.to_dan_pho) {
      setToDanPho(session.to_dan_pho);
    }
  }, []);

  // Lọc nhân vật lịch sử
  const filteredCharacters = characterList.filter((c) => {
    const q = characterSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.hometown && c.hometown.toLowerCase().includes(q)) ||
      (c.birth_year && c.birth_year.toLowerCase().includes(q))
    );
  });

  const handleAddCharacter = (char: HistoricalCharacter) => {
    if (!selectedCharacters.some((c) => c.id === char.id)) {
      setSelectedCharacters([...selectedCharacters, char]);
    }
  };

  const handleRemoveCharacter = (id: string) => {
    setSelectedCharacters(selectedCharacters.filter((c) => c.id !== id));
  };

  const handleCreateNewCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;
    const added = addHistoricalCharacter({
      name: newCharName.trim(),
      birth_year: newCharBirth.trim(),
      hometown: newCharHometown.trim(),
      biography: newCharBio.trim()
    });
    setCharacterList(getHistoricalCharacters());
    setSelectedCharacters([...selectedCharacters, added]);
    setShowNewCharModal(false);
    setNewCharName('');
    setNewCharBirth('');
    setNewCharHometown('');
    setNewCharBio('');
    showToast(`Đã tạo và gắn nhân vật: ${added.name}`);
  };

  // Thao tác thanh công cụ Rich Text
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const replacement = prefix + (selected || 'Văn bản mẫu') + suffix;
    const newBody = el.value.substring(0, start) + replacement + el.value.substring(end);
    setBody(newBody);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 11));
    }, 50);
  };

  // Xử lý upload ảnh (hỗ trợ kéo thả, chọn file và dán Clipboard)
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImg(true);
    setUploadProgress(10);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadToCloudinary(file, 'image', (pct) => {
          setUploadProgress(Math.min(95, Math.round(((i + pct / 100) / files.length) * 100)));
        });
        uploadedUrls.push(res.secure_url || res.url);
      } catch (err: any) {
        console.error('Lỗi tải ảnh:', err);
        showToast('Lỗi tải file: ' + (err.message || 'Thử lại sau'));
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls]);
      showToast(`Đã thêm thành công ${uploadedUrls.length} ảnh vào thư viện!`);
    }
    setUploadProgress(100);
    setTimeout(() => {
      setIsUploadingImg(false);
      setUploadProgress(0);
    }, 400);
  };

  const handlePasteImage = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }
    if (imageFiles.length > 0) {
      e.preventDefault();
      const dt = new DataTransfer();
      imageFiles.forEach((f) => dt.items.add(f));
      await handleFileUpload(dt.files);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Lưu bài viết (Nháp hoặc Gửi duyệt)
  const handleSaveOrSubmit = async (status: 'draft' | 'pending') => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tiêu đề bài viết trước khi tiếp tục.');
      return;
    }

    if (status === 'pending') {
      if (!body.trim() && !summary.trim()) {
        alert('Vui lòng nhập Nội dung chi tiết hoặc tóm tắt bài viết.');
        return;
      }
      if (!c1 || !c2 || !c3 || !c4) {
        alert('Vui lòng tích chọn đầy đủ 4 cam kết xác thực trước khi gửi duyệt.');
        return;
      }
    }

    setIsSubmitting(true);

    const categoryMap: Record<string, string> = {
      'hoc-tap-bac': 'Học tập & Làm theo lời Bác',
      'dia-chi-do': 'Địa chỉ Đỏ & Di tích Đà Lạt',
      'phong-trao-doan': 'Tuổi trẻ Phường Xuân Hương',
      'thanh-nien-xung-phong': 'Thanh niên xung phong & Tiên phong',
      'tinh-nguyen': 'Những lá thư thời hoa lửa',
      'bien-dao': 'Bảo vệ chủ quyền Biển đảo',
    };

    const narratorNames = selectedCharacters.length > 0 
      ? selectedCharacters.map((c) => c.name).join(', ') 
      : 'Cán bộ & Đoàn viên ' + toDanPho;

    const newStoryData = {
      title: title.trim(),
      narrator_name: narratorNames,
      contributor_name: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — Đà Lạt',
      contributor_unit: toDanPho,
      to_dan_pho: toDanPho,
      summary: summary.trim() || title.trim(),
      body: body.trim() || summary.trim(),
      category_id: category,
      category_name: categoryMap[category] || 'Học tập & Làm theo lời Bác',
      province_code: 'LD',
      province_name: 'Phường Xuân Hương — Đà Lạt',
      event_year: typeof eventYear === 'number' ? eventYear : 1975,
      period: period,
      media_type: mediaType,
      historical_characters: selectedCharacters,
      video_url: videoUrl.trim() || undefined,
      audio_url: audioUrl.trim() || undefined,
      cover_url: images[0] || '/images/thoi-hoa-lua-hero.jpg',
      images: images
    };

    try {
      // 1. Lưu cục bộ (LocalStorage)
      const savedStory = submitNewStory(newStoryData, status);

      // 2. Đồng bộ Supabase nếu đã cấu hình
      await saveStoryToSupabase(savedStory);

      setIsSubmitting(false);

      if (status === 'pending') {
        showToast('✓ Bài viết đã được gửi vào Hàng đợi kiểm duyệt thành công!');
        setTimeout(() => {
          window.location.href = withBase('/quan-tri/duyet-bai');
        }, 1200);
      } else {
        showToast('✓ Đã lưu bản nháp thành công!');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      showToast('Lỗi khi lưu bài: ' + (err.message || 'Thử lại sau'));
    }
  };

  return (
    <div className="space-y-6" onPaste={handlePasteImage}>
      
      {/* Toast thông báo nổi bật */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-amber-900 text-amber-100 border border-amber-500/80 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-medium text-sm">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR: Gửi câu chuyện mới */}
      <div className="bg-[#FAF6F0] border border-amber-200/80 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a
            href={withBase('/')}
            className="p-2.5 rounded-2xl bg-white hover:bg-amber-100 text-slate-700 hover:text-red-700 border border-amber-200/60 transition-colors shadow-2xs"
            title="Quay lại Trang chủ"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="font-serif font-black text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
              <span>Gửi câu chuyện mới</span>
              <span className="text-amber-500 text-lg">★</span>
            </h1>
            <p className="text-xs text-amber-900/80 mt-0.5">
              Đang gửi với tài khoản: <strong className="text-red-800">{currentUser.name}</strong> • Quyền: <span className="font-bold uppercase text-amber-900">{currentUser.role === 'admin' ? 'Ban Biên tập' : currentUser.role === 'tdp' ? 'Tổ Dân Phố' : 'Độc giả'}</span>
            </p>
          </div>
        </div>

        {/* Nút hành động trên Header */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-red-700 border border-amber-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveOrSubmit('draft')}
            className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300/80 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4 text-amber-800" />
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveOrSubmit('pending')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-amber-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span>Tạo bài & Gửi duyệt</span>
          </button>
        </div>
      </div>

      {/* FORM LAYOUT 2 CỘT CHUẨN THỜI HOA LỬA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= CỘT TRÁI (7 CỘT): NHÂN VẬT & NỘI DUNG ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. KHỐI NHÂN VẬT LỊCH SỬ */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif font-black text-base sm:text-lg text-slate-900">
                  Nhân vật lịch sử
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Câu chuyện gắn với một nhân vật lịch sử — chọn nhân vật có sẵn, hoặc tạo nhân vật mới (chờ duyệt).
                </p>
              </div>
            </div>

            {/* Ô tìm kiếm nhân vật */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={characterSearch}
                onChange={(e) => setCharacterSearch(e.target.value)}
                placeholder="Nhập tên nhân vật lịch sử, liệt sĩ, nhân chứng..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-amber-200/80 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
            </div>

            {/* Danh sách cuộn nhân vật */}
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredCharacters.slice(0, 6).map((char) => {
                const isSelected = selectedCharacters.some((c) => c.id === char.id);
                return (
                  <div
                    key={char.id}
                    className="p-2.5 rounded-2xl bg-white border border-amber-200/60 flex items-center justify-between gap-3 text-xs hover:border-amber-400 transition-colors"
                  >
                    <div className="truncate">
                      <div className="font-bold text-slate-900 uppercase tracking-tight">{char.name}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {char.birth_year ? `${char.birth_year} • ` : ''}{char.hometown || char.biography}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isSelected}
                      onClick={() => handleAddCharacter(char)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-amber-100 hover:bg-red-700 hover:text-white text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isSelected ? '✓ Đã chọn' : '+ Thêm'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Hiển thị nhân vật đã chọn */}
            <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-700">Đã chọn ({selectedCharacters.length}):</span>
                {selectedCharacters.length === 0 && (
                  <span className="text-slate-400 italic">Chưa gắn nhân vật nào.</span>
                )}
                {selectedCharacters.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-100 text-red-900 font-bold text-[11px] border border-red-300"
                  >
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacter(c.id)}
                      className="hover:text-red-600 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowNewCharModal(true)}
                className="text-red-700 hover:text-red-800 font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <span>👤+ Không tìm thấy? Tạo nhân vật mới</span>
              </button>
            </div>

          </div>

          {/* 2. KHỐI NỘI DUNG BÀI VIẾT */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif font-black text-base sm:text-lg text-slate-900">
                  Nội dung bài viết
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Mô tả ngắn hiển thị ở thẻ bài viết + nội dung chi tiết
                </p>
              </div>
            </div>

            {/* Tiêu đề bài viết */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tiêu đề bài viết <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề câu chuyện, lời dặn của Bác hoặc hồi ức nhân chứng..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-amber-200/80 text-sm text-slate-900 font-serif font-bold focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
            </div>

            {/* Mô tả ngắn */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mô tả ngắn (Hiển thị xem trước ở thẻ bài)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Tóm tắt ngắn gọn 2 - 3 câu về ý nghĩa lịch sử hoặc lời dạy của Bác..."
                className="w-full px-4 py-2 rounded-2xl bg-white border border-amber-200/80 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
            </div>

            {/* Loại hình câu chuyện (4 nút tabs như Thời Hoa Lửa) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Loại hình <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'article', label: 'Bài viết', desc: 'Soạn thảo văn bản', icon: FileText },
                  { id: 'video', label: 'Video / Phóng sự', desc: 'Dán link video', icon: Video },
                  { id: 'audio', label: 'Audio / Podcast', desc: 'Link hoặc MP3', icon: Mic },
                  { id: 'gallery', label: 'Chùm ảnh', desc: 'Nhiều ảnh + chú thích', icon: ImageIcon }
                ].map((item) => {
                  const Icon = item.icon;
                  const isCur = mediaType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMediaType(item.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCur
                          ? 'bg-red-50 border-red-700 text-red-900 shadow-xs'
                          : 'bg-white border-amber-200/70 text-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${isCur ? 'text-red-700' : 'text-slate-500'}`} />
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hàng chọn Thời kỳ lịch sử & 37 Tổ dân phố Phường Xuân Hương */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thời kỳ lịch sử
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-white border border-amber-200/80 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
                >
                  <option value="1945-truoc">1945 trở về trước (Tiền khởi nghĩa)</option>
                  <option value="1945-1954">1945 - 1954 (Kháng chiến chống Pháp)</option>
                  <option value="1955-1975">1955 - 1975 (Kháng chiến chống Mỹ)</option>
                  <option value="1975-1988">1975 - 1988 (Xây dựng & Bảo vệ biên giới)</option>
                  <option value="1989-nay">1989 - Nay (Đổi mới & Hội nhập)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Tổ Dân Phố đóng góp <span className="text-red-600">*</span></span>
                  {currentUser.role === 'tdp' && (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full border border-red-300">
                      🔒 Khóa định danh
                    </span>
                  )}
                </label>
                {currentUser.role === 'tdp' && currentUser.to_dan_pho ? (
                  <div className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs sm:text-sm font-bold text-red-900 flex items-center justify-between">
                    <span>{currentUser.to_dan_pho}</span>
                    <span className="text-[10px] text-amber-800">Tài khoản chính thức</span>
                  </div>
                ) : (
                  <select
                    value={toDanPho}
                    onChange={(e) => setToDanPho(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white border border-amber-200/80 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
                  >
                    {TO_DAN_PHO_LIST.map((tdp, i) => (
                      <option key={tdp} value={tdp}>
                        {i + 1}. {tdp}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* RICH TEXT EDITOR (THANH CÔNG CỤ SOẠN THẢO) */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Nội dung chi tiết <span className="text-red-600">*</span> (Bắt buộc khi gửi duyệt)</span>
                <span className="text-[11px] text-slate-500 font-normal">Hỗ trợ Markdown & Rich Text</span>
              </label>

              {/* Toolbar */}
              <div className="bg-white border border-amber-300 rounded-t-2xl p-2 flex flex-wrap items-center gap-1 text-slate-700">
                <button
                  type="button"
                  title="In đậm (Bold)"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="In nghiêng (Italic)"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Gạch chân (Underline)"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Gạch ngang (Strikethrough)"
                  onClick={() => insertFormatting('~~', '~~')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                {/* Color Palette */}
                <div className="flex items-center gap-1 px-1">
                  {[
                    { color: '#b91c1c', name: 'Đỏ cờ' },
                    { color: '#d97706', name: 'Vàng sao' },
                    { color: '#15803d', name: 'Xanh lá' },
                    { color: '#1d4ed8', name: 'Xanh dương' },
                    { color: '#1f2937', name: 'Than' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      title={`Màu ${c.name}`}
                      onClick={() => insertFormatting(`<span style="color:${c.color}">`, '</span>')}
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 hover:scale-125 transition-transform"
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                <button
                  type="button"
                  title="Tiêu đề H2"
                  onClick={() => insertFormatting('\n## ', '\n')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 font-bold text-xs"
                >
                  H2
                </button>
                <button
                  type="button"
                  title="Tiêu đề H3"
                  onClick={() => insertFormatting('\n### ', '\n')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 font-bold text-xs"
                >
                  H3
                </button>
                <button
                  type="button"
                  title="Tiêu đề H4"
                  onClick={() => insertFormatting('\n#### ', '\n')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 font-bold text-xs"
                >
                  H4
                </button>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                <button
                  type="button"
                  title="Danh sách số"
                  onClick={() => insertFormatting('\n1. ', '\n2. ')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Danh sách chấm"
                  onClick={() => insertFormatting('\n- ', '\n- ')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Trích dẫn"
                  onClick={() => insertFormatting('\n> "', '"\n')}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                <button
                  type="button"
                  title="Chèn liên kết"
                  onClick={() => {
                    const url = prompt('Nhập địa chỉ link:', 'https://');
                    if (url) insertFormatting('[', `](${url})`);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Chèn ảnh"
                  onClick={() => {
                    const url = prompt('Nhập link ảnh:', 'https://');
                    if (url) insertFormatting('![Ảnh tư liệu](', `${url})`);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                ref={editorRef}
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Soạn thảo nội dung câu chuyện hào hùng, hồi ức của nhân chứng, những trang sử vẻ vang hoặc câu chuyện làm theo lời Bác... Bạn có thể copy và dán ảnh trực tiếp vào đây (Ctrl+V)!"
                className="w-full px-4 py-3 rounded-b-2xl bg-white border-x border-b border-amber-300 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
            </div>

          </div>

        </div>

        {/* ================= CỘT PHẢI (5 CỘT): ĐA PHƯƠNG TIỆN & CAM KẾT ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. THƯ VIỆN ẢNH MINH HỌA */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-slate-900">
                    Thư viện ảnh
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Chùm ảnh minh họa cho câu chuyện
                  </p>
                </div>
              </div>

              {/* Nút Upload ảnh */}
              <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>+ Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Thanh tiến trình upload nếu đang tải */}
            {isUploadingImg && (
              <div className="p-3 rounded-2xl bg-white border border-amber-200">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Đang tải ảnh lên Cloudinary / Máy chủ...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-700 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Grid danh sách ảnh */}
            {images.length === 0 ? (
              <div className="p-6 rounded-2xl border-2 border-dashed border-amber-200 text-center bg-white/60">
                <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">Chưa có ảnh nào trong thư viện.</p>
                <p className="text-[11px] text-slate-400 mt-1">Bấm "+ Thêm ảnh" hoặc kéo thả ảnh vào đây</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-900 aspect-[4/3]">
                    <img
                      src={img}
                      alt="Ảnh tư liệu"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const item = images[idx];
                          setImages([item, ...images.filter((_, i) => i !== idx)]);
                          showToast('Đã đặt làm ảnh đại diện chính!');
                        }}
                        className="px-2 py-1 rounded bg-amber-500 text-white font-bold text-[10px]"
                        title="Đặt làm ảnh bìa"
                      >
                        Bìa
                      </button>
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[10px]"
                        title="Xóa ảnh"
                      >
                        Xóa
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-red-700 text-white text-[9px] font-black uppercase tracking-wider">
                        Ảnh bìa
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. VIDEO / PHÓNG SỰ */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-black text-base text-slate-900">
                  Video / Phóng sự
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Link YouTube, Google Drive, Vimeo hoặc tệp MP4
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Dán link video (vd: https://youtube.com/watch?v=...)"
                className="flex-1 px-3 py-2 rounded-2xl bg-white border border-amber-200/80 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
              <button
                type="button"
                onClick={() => {
                  if (videoUrl) showToast('Đã gắn link video!');
                }}
                className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs"
              >
                Gắn
              </button>
            </div>

            {videoUrl && (
              <div className="p-2.5 rounded-2xl bg-white border border-amber-200 text-xs text-slate-700 flex items-center justify-between">
                <span className="truncate max-w-[240px] font-mono text-[11px]">{videoUrl}</span>
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="text-red-600 font-bold hover:underline"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* 3. AUDIO / PODCAST */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-black text-base text-slate-900">
                  Audio / Podcast
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Link SoundCloud, Google Drive hoặc tải tệp MP3
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="Dán link MP3 hoặc SoundCloud..."
                className="flex-1 px-3 py-2 rounded-2xl bg-white border border-amber-200/80 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700/30"
              />
              <button
                type="button"
                onClick={() => {
                  if (audioUrl) showToast('Đã gắn link audio giọng đọc!');
                }}
                className="px-3.5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs"
              >
                Gắn
              </button>
            </div>

            {audioUrl && (
              <div className="p-2.5 rounded-2xl bg-white border border-amber-200 text-xs text-slate-700 flex items-center justify-between">
                <span className="truncate max-w-[240px] font-mono text-[11px]">{audioUrl}</span>
                <button
                  type="button"
                  onClick={() => setAudioUrl('')}
                  className="text-red-600 font-bold hover:underline"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          {/* 4. CAM KẾT CỦA NGƯỜI GỬI */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-700" />
              <h3 className="font-serif font-black text-sm text-slate-900 uppercase tracking-wider">
                Cam kết của người gửi
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={c1}
                  onChange={(e) => setC1(e.target.checked)}
                  className="mt-0.5 rounded text-red-700 focus:ring-red-700"
                />
                <span>Đã được sự đồng ý của nhân chứng lịch sử hoặc thân nhân gia đình.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={c2}
                  onChange={(e) => setC2(e.target.checked)}
                  className="mt-0.5 rounded text-red-700 focus:ring-red-700"
                />
                <span>Cam kết tính xác thực, khách quan của thông tin và tư liệu gửi lên.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={c3}
                  onChange={(e) => setC3(e.target.checked)}
                  className="mt-0.5 rounded text-red-700 focus:ring-red-700"
                />
                <span>Cam kết bản quyền hình ảnh, âm thanh không vi phạm pháp luật.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={c4}
                  onChange={(e) => setC4(e.target.checked)}
                  className="mt-0.5 rounded text-red-700 focus:ring-red-700"
                />
                <span>Đồng ý để Đoàn TNCS Hồ Chí Minh Phường Xuân Hương lưu trữ phi lợi nhuận.</span>
              </label>
            </div>
          </div>

        </div>

      </div>

      {/* ================= MODAL TẠO NHÂN VẬT MỚI ================= */}
      {showNewCharModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-300 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <h3 className="font-serif font-black text-lg text-slate-900">
                Thêm Nhân vật Lịch sử mới
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCharModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateNewCharacter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Họ và tên nhân vật *
                </label>
                <input
                  type="text"
                  required
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  placeholder="Ví dụ: Bác Mai Hoài Điều, Mẹ Lê Thị Riêng..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Năm sinh / Năm mất</label>
                  <input
                    type="text"
                    value={newCharBirth}
                    onChange={(e) => setNewCharBirth(e.target.value)}
                    placeholder="SN 1920 hoặc 1920 - 1985"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quê quán / Địa phương</label>
                  <input
                    type="text"
                    value={newCharHometown}
                    onChange={(e) => setNewCharHometown(e.target.value)}
                    placeholder="Đà Lạt, Lâm Đồng..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiểu sử tóm tắt</label>
                <textarea
                  rows={3}
                  value={newCharBio}
                  onChange={(e) => setNewCharBio(e.target.value)}
                  placeholder="Tóm tắt công lao, vai trò trong kháng chiến hoặc phong trào thi đua..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCharModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold"
                >
                  + Tạo & Gắn vào bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XEM TRƯỚC (PREVIEW MODAL) ================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] rounded-3xl border border-amber-300 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-300">
                ★ BẢN XEM TRƯỚC CỦA ĐỘC GIẢ
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg"
              >
                ×
              </button>
            </div>

            {images[0] && (
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 max-h-72">
                <img src={images[0]} alt="Ảnh bìa" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-200">
                {toDanPho}
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 mt-2.5">
                {title || 'Tiêu đề câu chuyện chưa nhập'}
              </h2>
              <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-3">
                <span>Nhân vật: <strong>{selectedCharacters.map((c) => c.name).join(', ') || 'Chưa gắn'}</strong></span>
                <span>•</span>
                <span>Thời kỳ: <strong>{period}</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-slate-700 italic">
              "{summary || 'Chưa có mô tả tóm tắt'}"
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
              {body || 'Nội dung chi tiết chưa được soạn thảo.'}
            </div>

            <div className="flex justify-end pt-4 border-t border-amber-200">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs"
              >
                Đóng xem trước
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
