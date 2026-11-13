-- ========================================================
-- BẢNG QUẢN LÝ TÀI KHOẢN 37 TỔ DÂN PHỐ & ADMIN TRÊN SUPABASE
-- ========================================================

CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  to_dan_pho TEXT,
  role TEXT NOT NULL CHECK (role IN ('tdp', 'admin')),
  avatar TEXT,
  tdp_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read accounts for auth" ON public.accounts;
CREATE POLICY "Public read accounts for auth" ON public.accounts
  FOR SELECT USING (true);

-- 1. TÀI KHOẢN ADMIN
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'admin-xuanhuong',
  'admin',
  'ae10d7ac64e503cfad66a55fa42c0be75b4e34e79097e068428beb12f3247188',
  'Ban Biên tập Đoàn Phường Xuân Hương',
  'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — Đà Lạt',
  NULL,
  'admin',
  '/images/thoi-hoa-lua/logo-doan.webp',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit;

-- 2. TÀI KHOẢN 37 TỔ DÂN PHỐ
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-01',
  'tdp01',
  'b1a7e5b9c7be6c956dcb1471cf3965b9ca5d4c9bc21fd524caf61592728ebbf3',
  'Chi đoàn Tổ dân phố Nguyễn Văn Trỗi',
  'Tổ dân phố Nguyễn Văn Trỗi — Phường Xuân Hương',
  'Tổ dân phố Nguyễn Văn Trỗi',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '01'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-02',
  'tdp02',
  '3a39745501683cb9c8cf1f019c3a0a0b91e9c6e5ab35406bdad17c80572c8c8d',
  'Chi đoàn Tổ dân phố Hòa Bình',
  'Tổ dân phố Hòa Bình — Phường Xuân Hương',
  'Tổ dân phố Hòa Bình',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '02'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-03',
  'tdp03',
  '74fd8f068358c9a4cc34c60f3c5d5dcade4fb419eaefdcc4dcaf368cfe284b95',
  'Chi đoàn Tổ dân phố Ánh Sáng',
  'Tổ dân phố Ánh Sáng — Phường Xuân Hương',
  'Tổ dân phố Ánh Sáng',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '03'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-04',
  'tdp04',
  '83241d4d4ed7ef22066b029ce2addd476527a419b3ace0384685b56479994c52',
  'Chi đoàn Tổ dân phố Đa Hòa',
  'Tổ dân phố Đa Hòa — Phường Xuân Hương',
  'Tổ dân phố Đa Hòa',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '04'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-05',
  'tdp05',
  '4fb2db3ada42da77ebd5e863c092e7951d69886e7f6ad512407007ec73914f36',
  'Chi đoàn Tổ dân phố Tô Ngọc Vân',
  'Tổ dân phố Tô Ngọc Vân — Phường Xuân Hương',
  'Tổ dân phố Tô Ngọc Vân',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '05'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-06',
  'tdp06',
  'afb479ae66e0497b7c75cae9f569dbb80b15cf1ff31bd1e88f2606946b3b19aa',
  'Chi đoàn Tổ dân phố Lý Tự Trọng',
  'Tổ dân phố Lý Tự Trọng — Phường Xuân Hương',
  'Tổ dân phố Lý Tự Trọng',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '06'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-07',
  'tdp07',
  '8a739b516ea76342d63a081980c9de31d3d5eaf1786590c98ee185429aba3dbe',
  'Chi đoàn Tổ dân phố Bùi Thị Xuân',
  'Tổ dân phố Bùi Thị Xuân — Phường Xuân Hương',
  'Tổ dân phố Bùi Thị Xuân',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '07'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-08',
  'tdp08',
  '6aee55cc43568653ad6e47e3f2ac8767e18779c63c1b2e756a5ee0b9f37950f4',
  'Chi đoàn Tổ dân phố Mỹ Lộc',
  'Tổ dân phố Mỹ Lộc — Phường Xuân Hương',
  'Tổ dân phố Mỹ Lộc',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '08'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-09',
  'tdp09',
  '4ded053de2d64bba3e793a460ace0ab6c9aa0bb23fdfa29ac362cf7af70eb0c3',
  'Chi đoàn Tổ dân phố Phan Đình Phùng',
  'Tổ dân phố Phan Đình Phùng — Phường Xuân Hương',
  'Tổ dân phố Phan Đình Phùng',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '09'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-10',
  'tdp10',
  'd36465aca2c294c10e9ad354bc198757d8d996a7c3db1cbe68d925a7159d09bf',
  'Chi đoàn Tổ dân phố Phạm Ngũ Lão',
  'Tổ dân phố Phạm Ngũ Lão — Phường Xuân Hương',
  'Tổ dân phố Phạm Ngũ Lão',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '10'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-11',
  'tdp11',
  '5c3ae0772c3166c33465ca709ecb9debf1187e12ae4fc5a3348a2a072df1626a',
  'Chi đoàn Tổ dân phố Trần Phú',
  'Tổ dân phố Trần Phú — Phường Xuân Hương',
  'Tổ dân phố Trần Phú',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '11'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-12',
  'tdp12',
  'aa97d575fc33893929f1f0b88044e3ecf7e7237abbb963c19b87dedb729c37a0',
  'Chi đoàn Tổ dân phố Xuân An',
  'Tổ dân phố Xuân An — Phường Xuân Hương',
  'Tổ dân phố Xuân An',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '12'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-13',
  'tdp13',
  'f478ee1ab747d0df9dff06a74a75ccacb430b8f9921af0572c1e32f27f46dfab',
  'Chi đoàn Tổ dân phố Hà Huy Tập',
  'Tổ dân phố Hà Huy Tập — Phường Xuân Hương',
  'Tổ dân phố Hà Huy Tập',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '13'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-14',
  'tdp14',
  '3185b11bea5ab9faf1f95fbb522c89cc0c7e4e08918cf03431519f2343022c0e',
  'Chi đoàn Tổ dân phố Tân Bình',
  'Tổ dân phố Tân Bình — Phường Xuân Hương',
  'Tổ dân phố Tân Bình',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '14'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-15',
  'tdp15',
  '13016fffd00c080917c5b804b65b0fa4dd052c40a2cbea4c315ddaa2a4a5e6f4',
  'Chi đoàn Tổ dân phố Ba Tháng Tư',
  'Tổ dân phố Ba Tháng Tư — Phường Xuân Hương',
  'Tổ dân phố Ba Tháng Tư',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '15'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-16',
  'tdp16',
  'dc318ea9d783eb0697572c3022a2adcb2d49208f7e67c485a7fd5ee60de65325',
  'Chi đoàn Tổ dân phố Đặng Thái Thân',
  'Tổ dân phố Đặng Thái Thân — Phường Xuân Hương',
  'Tổ dân phố Đặng Thái Thân',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '16'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-17',
  'tdp17',
  '1ed321608c3fa020a12b208e7390d28129dd2329673d5f3e83c6f18871c98d93',
  'Chi đoàn Tổ dân phố An Bình',
  'Tổ dân phố An Bình — Phường Xuân Hương',
  'Tổ dân phố An Bình',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '17'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-18',
  'tdp18',
  '38e6d169b044e3943ffb185c08eeb342b1ac067339b838e551169ab77022ecc6',
  'Chi đoàn Tổ dân phố Nguyễn Trung Trực',
  'Tổ dân phố Nguyễn Trung Trực — Phường Xuân Hương',
  'Tổ dân phố Nguyễn Trung Trực',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '18'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-19',
  'tdp19',
  'db32575ef0b70a48aa40ac35ff582fe77da6bfaf2d6a6fbff63858e0f3542ae5',
  'Chi đoàn Tổ dân phố Tân Lạc',
  'Tổ dân phố Tân Lạc — Phường Xuân Hương',
  'Tổ dân phố Tân Lạc',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '19'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-20',
  'tdp20',
  '00c9e93478ed1886fad26e845eea075e44fcb7346f045ec734c4d097f03bb82a',
  'Chi đoàn Tổ dân phố Prenn',
  'Tổ dân phố Prenn — Phường Xuân Hương',
  'Tổ dân phố Prenn',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '20'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-21',
  'tdp21',
  'cebcc16406a2e841057fe3b0f1d7e0966615152883440fa5dcc7c8e0eca3ca89',
  'Chi đoàn Tổ dân phố Trường Chinh',
  'Tổ dân phố Trường Chinh — Phường Xuân Hương',
  'Tổ dân phố Trường Chinh',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '21'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-22',
  'tdp22',
  '2eb04b7c0b39eb52a5654d1fb99d525596ce4781d00e96ce2a0a8893b1811e4f',
  'Chi đoàn Tổ dân phố Mạc Đĩnh Chi',
  'Tổ dân phố Mạc Đĩnh Chi — Phường Xuân Hương',
  'Tổ dân phố Mạc Đĩnh Chi',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '22'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-23',
  'tdp23',
  '1beddcdd13fbbc93d649267c4995b4ec2ec8f56e8b3822e8b5f1fa74d17d7a6b',
  'Chi đoàn Tổ dân phố Huỳnh Thúc Kháng',
  'Tổ dân phố Huỳnh Thúc Kháng — Phường Xuân Hương',
  'Tổ dân phố Huỳnh Thúc Kháng',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '23'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-24',
  'tdp24',
  'ea1da07d56212b5f0953e9a4ecc79ae705754f7e99fe5367bac6708cc200a21c',
  'Chi đoàn Tổ dân phố Đồng Tâm',
  'Tổ dân phố Đồng Tâm — Phường Xuân Hương',
  'Tổ dân phố Đồng Tâm',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '24'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-25',
  'tdp25',
  '03486caaafc06faa4c47d003c4b27d11f95f83ba60c60d16bc4fd09ae79b0864',
  'Chi đoàn Tổ dân phố Nam Thiên',
  'Tổ dân phố Nam Thiên — Phường Xuân Hương',
  'Tổ dân phố Nam Thiên',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '25'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-26',
  'tdp26',
  '4404215a30501967aad4533ad0ffd37fbd8c8634bad11d59e99df12fbf18295e',
  'Chi đoàn Tổ dân phố Ngô Thì Sỹ',
  'Tổ dân phố Ngô Thì Sỹ — Phường Xuân Hương',
  'Tổ dân phố Ngô Thì Sỹ',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '26'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-27',
  'tdp27',
  '8b3ba1ec550a09dfa8a66cb525ad08a3b78859a00de88611ab0ad7284d0c47e2',
  'Chi đoàn Tổ dân phố Lê Hồng Phong',
  'Tổ dân phố Lê Hồng Phong — Phường Xuân Hương',
  'Tổ dân phố Lê Hồng Phong',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '27'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-28',
  'tdp28',
  '22572fbcf7435f1b046cd8161cd98608bf8339f15efd3e9f9b8a182de1b85c1e',
  'Chi đoàn Tổ dân phố Hoàng Hoa Thám',
  'Tổ dân phố Hoàng Hoa Thám — Phường Xuân Hương',
  'Tổ dân phố Hoàng Hoa Thám',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '28'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-29',
  'tdp29',
  '4e300a65c93747d76360368a713539e682999efeef10b169a9c6ca43cbe5b74a',
  'Chi đoàn Tổ dân phố Trần Quang Diệu',
  'Tổ dân phố Trần Quang Diệu — Phường Xuân Hương',
  'Tổ dân phố Trần Quang Diệu',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '29'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-30',
  'tdp30',
  'e391ca4104f3cebc288803749ed7940ddafbbb61ed435bbf1f7094eaf11194e2',
  'Chi đoàn Tổ dân phố Trần Quý Cáp',
  'Tổ dân phố Trần Quý Cáp — Phường Xuân Hương',
  'Tổ dân phố Trần Quý Cáp',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '30'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-31',
  'tdp31',
  '1dc52a046501eef8b4c5c3a8dfcb091b38a7d2b664114791236d692db6728719',
  'Chi đoàn Tổ dân phố Khe Sanh',
  'Tổ dân phố Khe Sanh — Phường Xuân Hương',
  'Tổ dân phố Khe Sanh',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '31'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-32',
  'tdp32',
  '9a1806899917576b2448f78d743db02e4c3f7abcc55dce575fedf9f79d276e00',
  'Chi đoàn Tổ dân phố Yersin',
  'Tổ dân phố Yersin — Phường Xuân Hương',
  'Tổ dân phố Yersin',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '32'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-33',
  'tdp33',
  '649fcfb910bf547abbd2267ce30f917d7ed5fc8fc73dfdb115f6caf6894350ab',
  'Chi đoàn Tổ dân phố Trần Hưng Đạo',
  'Tổ dân phố Trần Hưng Đạo — Phường Xuân Hương',
  'Tổ dân phố Trần Hưng Đạo',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '33'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-34',
  'tdp34',
  'f77ed17dc66293ad5122475995eef3ebb08bd087d154a499315f20bee2650139',
  'Chi đoàn Tổ dân phố Nguyễn Du',
  'Tổ dân phố Nguyễn Du — Phường Xuân Hương',
  'Tổ dân phố Nguyễn Du',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '34'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-35',
  'tdp35',
  '31721439c1fffe8715014ce5d3580beb79fcc1988a147b30a88e1343795c35ed',
  'Chi đoàn Tổ dân phố An Sơn 1',
  'Tổ dân phố An Sơn 1 — Phường Xuân Hương',
  'Tổ dân phố An Sơn 1',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '35'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-36',
  'tdp36',
  '6e618f0580d191023ef8de774134dfcb7c2056f21959121dbe8323fe47db86c2',
  'Chi đoàn Tổ dân phố An Sơn 2',
  'Tổ dân phố An Sơn 2 — Phường Xuân Hương',
  'Tổ dân phố An Sơn 2',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '36'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
INSERT INTO public.accounts (id, username, password_hash, name, unit, to_dan_pho, role, avatar, tdp_code)
VALUES (
  'user-tdp-37',
  'tdp37',
  '75e0afcadd487a0ab93a47dc76e9dbd539030a76bd79725eb658e5b11065c17d',
  'Chi đoàn Tổ dân phố Phạm Hồng Thái',
  'Tổ dân phố Phạm Hồng Thái — Phường Xuân Hương',
  'Tổ dân phố Phạm Hồng Thái',
  'tdp',
  '/images/thoi-hoa-lua/logo-doan.webp',
  '37'
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  unit = EXCLUDED.unit,
  to_dan_pho = EXCLUDED.to_dan_pho;
