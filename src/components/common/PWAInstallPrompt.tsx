import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidBtn, setShowAndroidBtn] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroidBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|firefox|fxios/.test(userAgent);

    if (isIOSDevice && isSafari && !sessionStorage.getItem('ios_pwa_dismissed')) {
      const timer = setTimeout(() => {
        setShowIOSModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidBtn(false);
    }
    setDeferredPrompt(null);
  };

  const dismissIOSModal = () => {
    setShowIOSModal(false);
    sessionStorage.setItem('ios_pwa_dismissed', 'true');
  };

  return (
    <>
      {showAndroidBtn && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-redflag-800 hover:bg-redflag-900 text-amber-100 font-medium px-4 py-2.5 rounded-full shadow-lg border border-amber-400/40 text-sm"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Cài ứng dụng Ký Ức</span>
          </button>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-x-4 bottom-6 z-50 max-w-md mx-auto bg-heritage-900/95 backdrop-blur text-white p-5 rounded-2xl shadow-2xl border border-heritage-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-amber-300 text-sm">
              <Download className="w-4 h-4" />
              <span>Cài ứng dụng Ký Ức lên iPhone</span>
            </div>
            <button 
              onClick={dismissIOSModal}
              className="text-heritage-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-heritage-200 mb-3 leading-relaxed">
            Để truy cập nhanh và đọc bài viết khi không có mạng, bạn có thể thêm ứng dụng vào màn hình chính:
          </p>

          <ol className="text-xs space-y-2 text-heritage-300 border-t border-heritage-800 pt-2">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-redflag-800 text-amber-200 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Chạm vào nút <strong className="text-white inline-flex items-center gap-1">Chia sẻ <Share className="w-3.5 h-3.5 inline text-blue-400" /></strong> ở thanh dưới</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-redflag-800 text-amber-200 flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Cuộn xuống chọn <strong className="text-white inline-flex items-center gap-1">Thêm vào MH chính <PlusSquare className="w-3.5 h-3.5 inline text-green-400" /></strong></span>
            </li>
          </ol>
        </div>
      )}
    </>
  );
}
