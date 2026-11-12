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

    if (sessionStorage.getItem('pwa_prompt_dismissed')) return;

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
      }, 4000);
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

  const dismissAndroid = () => {
    setShowAndroidBtn(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const dismissIOSModal = () => {
    setShowIOSModal(false);
    sessionStorage.setItem('ios_pwa_dismissed', 'true');
  };

  return (
    <>
      {showAndroidBtn && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2 rounded-full shadow-lg border border-slate-700 text-xs">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 font-medium hover:text-amber-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Cài app vào máy</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={dismissAndroid}
            className="text-slate-400 hover:text-white p-0.5 rounded-full"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {showIOSModal && (
        <div className="fixed inset-x-4 bottom-6 z-50 max-w-sm mx-auto bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Thêm ứng dụng vào Màn hình chính</span>
            </div>
            <button 
              onClick={dismissIOSModal}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
            Chạm vào <strong className="text-white inline-flex items-center gap-0.5">Chia sẻ <Share className="w-3 h-3 inline text-blue-400" /></strong> rồi chọn <strong className="text-white inline-flex items-center gap-0.5">Thêm vào MH chính <PlusSquare className="w-3 h-3 inline text-emerald-400" /></strong>.
          </p>
        </div>
      )}
    </>
  );
}
