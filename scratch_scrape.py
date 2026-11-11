import urllib.request
import re
import os

base_url = 'https://cauchuyenlichsu.vn'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

download_dir = 'G:/DTN-HCM/public/images/thoi-hoa-lua'
os.makedirs(download_dir, exist_ok=True)

# Discovered images and potential asset paths
images_to_check = [
    '/images/home/hero-bg.jpg',
    '/images/home/cta-bg.jpg',
    '/images/home/featured.jpg',
    '/images/home/cat-bien-dao.jpg',
    '/images/home/cat-hau-phuong.jpg',
    '/images/home/cat-khang-chien.jpg',
    '/images/home/cat-me-vnah.jpg',
    '/images/home/co-dang.webp',
    '/images/home/logo-doan.webp',
    '/images/home/logo.png',
    '/images/home/timeline-1975.jpg',
    '/images/home/timeline-1945.jpg',
    '/images/home/timeline-1954.jpg',
    '/images/home/timeline-1968.jpg',
    '/images/home/timeline-1979.jpg',
    '/images/home/timeline-1988.jpg',
    '/images/home/timeline-1990.jpg',
    '/images/home/cat-cuu-chien-binh.jpg',
    '/images/home/cat-nhan-chung.jpg',
    '/images/home/cat-nguoi-co-cong.jpg',
    '/images/home/cat-anh-hung-llvt.jpg',
    '/images/6.png'
]

subpages = [
    '/',
    '/thu-vien-ky-uc',
    '/ban-do-ky-uc',
    '/su-kien',
    '/nhan-vat-lich-su',
    '/vinh-danh',
    '/ve-de-an'
]

found_images = set(images_to_check)

for page in subpages:
    try:
        req = urllib.request.Request(base_url + page, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'([^\s"\'<>]+\.(?:jpg|png|webp|svg|jpeg))', html)
            for m in matches:
                if not m.startswith('http'):
                    if not m.startswith('/'):
                        m = '/' + m
                    m = base_url + m
                found_images.add(m)
    except Exception as e:
        print(f"Page {page} error:", e)

print(f"Total candidate images: {len(found_images)}")

downloaded = 0
for img in found_images:
    full_url = img if img.startswith('http') else (base_url + img)
    fname = os.path.basename(full_url.split('?')[0])
    if not fname:
        continue
    out_path = os.path.join(download_dir, fname)
    try:
        req = urllib.request.Request(full_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(out_path, 'wb') as f:
                    f.write(data)
                downloaded += 1
                print(f"Downloaded: {fname} ({len(data)} bytes)")
    except Exception:
        pass

print(f"Successfully downloaded {downloaded} images into {download_dir}")
