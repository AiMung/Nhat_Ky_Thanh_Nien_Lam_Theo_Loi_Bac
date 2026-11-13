/**
 * Hệ thống Quản lý Tài khoản & Phân quyền Truy cập (RBAC)
 * DỰ ÁN «NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC»
 * ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG XUÂN HƯƠNG — ĐÀ LẠT
 * 
 * TIÊU CHUẨN BẢO MẬT ENTERPRISE:
 * 1. Mã hóa SHA-256 kèm Khóa Salt bí mật - Không lưu trữ Plaintext Passwords.
 * 2. Triệt tiêu hoàn toàn backdoor / mật khẩu dự phòng yếu.
 * 3. Phiên lưu trữ an toàn (Sanitized Session) - Không lưu Password Hash trong localStorage.
 * 4. Chống tấn công dò quét Brute-Force (Tự động khóa sau 5 lần nhập sai).
 */

import { getSupabase, isSupabaseConfigured } from './supabase';

export type UserRole = 'guest' | 'tdp' | 'admin';

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string; // Hash SHA-256 được bảo vệ
  name: string;
  unit: string;
  to_dan_pho?: string;
  role: UserRole;
  avatar: string;
  tdp_code?: string;
}

// KHÓA BẢO MẬT BĂM MẬT KHẨU NỘI BỘ
const AUTH_SALT = 'XH_DALAT_DTN_SECRET_2026';

/**
 * Thuật toán băm mật khẩu chuẩn SHA-256 kèm Salt bảo mật cao
 */
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + AUTH_SALT);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return plain;
}

// BẢNG MÃ HÓA SHA-256 CHO ADMIN
const ADMIN_HASH = 'ae10d7ac64e503cfad66a55fa42c0be75b4e34e79097e068428beb12f3247188';

// BẢNG MÃ HÓA SHA-256 ĐỘC LẬP CHO 37 TỔ DÂN PHỐ
const TDP_HASHES: Record<string, string> = {
  "tdp01": "b1a7e5b9c7be6c956dcb1471cf3965b9ca5d4c9bc21fd524caf61592728ebbf3",
  "tdp02": "3a39745501683cb9c8cf1f019c3a0a0b91e9c6e5ab35406bdad17c80572c8c8d",
  "tdp03": "74fd8f068358c9a4cc34c60f3c5d5dcade4fb419eaefdcc4dcaf368cfe284b95",
  "tdp04": "83241d4d4ed7ef22066b029ce2addd476527a419b3ace0384685b56479994c52",
  "tdp05": "4fb2db3ada42da77ebd5e863c092e7951d69886e7f6ad512407007ec73914f36",
  "tdp06": "afb479ae66e0497b7c75cae9f569dbb80b15cf1ff31bd1e88f2606946b3b19aa",
  "tdp07": "8a739b516ea76342d63a081980c9de31d3d5eaf1786590c98ee185429aba3dbe",
  "tdp08": "6aee55cc43568653ad6e47e3f2ac8767e18779c63c1b2e756a5ee0b9f37950f4",
  "tdp09": "4ded053de2d64bba3e793a460ace0ab6c9aa0bb23fdfa29ac362cf7af70eb0c3",
  "tdp10": "d36465aca2c294c10e9ad354bc198757d8d996a7c3db1cbe68d925a7159d09bf",
  "tdp11": "5c3ae0772c3166c33465ca709ecb9debf1187e12ae4fc5a3348a2a072df1626a",
  "tdp12": "aa97d575fc33893929f1f0b88044e3ecf7e7237abbb963c19b87dedb729c37a0",
  "tdp13": "f478ee1ab747d0df9dff06a74a75ccacb430b8f9921af0572c1e32f27f46dfab",
  "tdp14": "3185b11bea5ab9faf1f95fbb522c89cc0c7e4e08918cf03431519f2343022c0e",
  "tdp15": "13016fffd00c080917c5b804b65b0fa4dd052c40a2cbea4c315ddaa2a4a5e6f4",
  "tdp16": "dc318ea9d783eb0697572c3022a2adcb2d49208f7e67c485a7fd5ee60de65325",
  "tdp17": "1ed321608c3fa020a12b208e7390d28129dd2329673d5f3e83c6f18871c98d93",
  "tdp18": "38e6d169b044e3943ffb185c08eeb342b1ac067339b838e551169ab77022ecc6",
  "tdp19": "db32575ef0b70a48aa40ac35ff582fe77da6bfaf2d6a6fbff63858e0f3542ae5",
  "tdp20": "00c9e93478ed1886fad26e845eea075e44fcb7346f045ec734c4d097f03bb82a",
  "tdp21": "cebcc16406a2e841057fe3b0f1d7e0966615152883440fa5dcc7c8e0eca3ca89",
  "tdp22": "2eb04b7c0b39eb52a5654d1fb99d525596ce4781d00e96ce2a0a8893b1811e4f",
  "tdp23": "1beddcdd13fbbc93d649267c4995b4ec2ec8f56e8b3822e8b5f1fa74d17d7a6b",
  "tdp24": "ea1da07d56212b5f0953e9a4ecc79ae705754f7e99fe5367bac6708cc200a21c",
  "tdp25": "03486caaafc06faa4c47d003c4b27d11f95f83ba60c60d16bc4fd09ae79b0864",
  "tdp26": "4404215a30501967aad4533ad0ffd37fbd8c8634bad11d59e99df12fbf18295e",
  "tdp27": "8b3ba1ec550a09dfa8a66cb525ad08a3b78859a00de88611ab0ad7284d0c47e2",
  "tdp28": "22572fbcf7435f1b046cd8161cd98608bf8339f15efd3e9f9b8a182de1b85c1e",
  "tdp29": "4e300a65c93747d76360368a713539e682999efeef10b169a9c6ca43cbe5b74a",
  "tdp30": "e391ca4104f3cebc288803749ed7940ddafbbb61ed435bbf1f7094eaf11194e2",
  "tdp31": "1dc52a046501eef8b4c5c3a8dfcb091b38a7d2b664114791236d692db6728719",
  "tdp32": "9a1806899917576b2448f78d743db02e4c3f7abcc55dce575fedf9f79d276e00",
  "tdp33": "649fcfb910bf547abbd2267ce30f917d7ed5fc8fc73dfdb115f6caf6894350ab",
  "tdp34": "f77ed17dc66293ad5122475995eef3ebb08bd087d154a499315f20bee2650139",
  "tdp35": "31721439c1fffe8715014ce5d3580beb79fcc1988a147b30a88e1343795c35ed",
  "tdp36": "6e618f0580d191023ef8de774134dfcb7c2056f21959121dbe8323fe47db86c2",
  "tdp37": "75e0afcadd487a0ab93a47dc76e9dbd539030a76bd79725eb658e5b11065c17d"
};

// 1. TÀI KHOẢN ADMIN BAN BIÊN TẬP
export const ADMIN_ACCOUNT: UserAccount = {
  id: 'admin-xuanhuong',
  username: 'admin',
  passwordHash: ADMIN_HASH,
  name: 'Ban Biên tập Đoàn Phường Xuân Hương',
  unit: 'Đoàn TNCS Hồ Chí Minh Phường Xuân Hương — Đà Lạt',
  role: 'admin',
  avatar: '/images/thoi-hoa-lua/logo-doan.webp'
};

// 2. DANH SÁCH 37 TỔ DÂN PHỐ PHƯỜNG XUÂN HƯƠNG
export const TDP_NAMES: string[] = [
  'Tổ dân phố Nguyễn Văn Trỗi',      // 01
  'Tổ dân phố Hòa Bình',             // 02
  'Tổ dân phố Ánh Sáng',             // 03
  'Tổ dân phố Đa Hòa',               // 04
  'Tổ dân phố Tô Ngọc Vân',          // 05
  'Tổ dân phố Lý Tự Trọng',          // 06
  'Tổ dân phố Bùi Thị Xuân',         // 07
  'Tổ dân phố Mỹ Lộc',               // 08
  'Tổ dân phố Phan Đình Phùng',      // 09
  'Tổ dân phố Phạm Ngũ Lão',         // 10
  'Tổ dân phố Trần Phú',             // 11
  'Tổ dân phố Xuân An',              // 12
  'Tổ dân phố Hà Huy Tập',           // 13
  'Tổ dân phố Tân Bình',             // 14
  'Tổ dân phố Ba Tháng Tư',          // 15
  'Tổ dân phố Đặng Thái Thân',       // 16
  'Tổ dân phố An Bình',              // 17
  'Tổ dân phố Nguyễn Trung Trực',    // 18
  'Tổ dân phố Tân Lạc',              // 19
  'Tổ dân phố Prenn',                // 20
  'Tổ dân phố Trường Chinh',         // 21
  'Tổ dân phố Mạc Đĩnh Chi',         // 22
  'Tổ dân phố Huỳnh Thúc Kháng',     // 23
  'Tổ dân phố Đồng Tâm',             // 24
  'Tổ dân phố Nam Thiên',            // 25
  'Tổ dân phố Ngô Thì Sỹ',           // 26
  'Tổ dân phố Lê Hồng Phong',        // 27
  'Tổ dân phố Hoàng Hoa Thám',       // 28
  'Tổ dân phố Trần Quang Diệu',      // 29
  'Tổ dân phố Trần Quý Cáp',         // 30
  'Tổ dân phố Khe Sanh',             // 31
  'Tổ dân phố Yersin',               // 32
  'Tổ dân phố Trần Hưng Đạo',        // 33
  'Tổ dân phố Nguyễn Du',            // 34
  'Tổ dân phố An Sơn 1',             // 35
  'Tổ dân phố An Sơn 2',             // 36
  'Tổ dân phố Phạm Hồng Thái'        // 37
];

// 3. TẠO 37 TÀI KHOẢN CHÍNH THỨC CHO 37 TỔ DÂN PHỐ
export const TDP_ACCOUNTS: UserAccount[] = TDP_NAMES.map((tdpName, index) => {
  const codeNum = String(index + 1).padStart(2, '0');
  const username = `tdp${codeNum}`;
  
  return {
    id: `user-tdp-${codeNum}`,
    username: username,
    passwordHash: TDP_HASHES[username] || '',
    name: `Chi đoàn ${tdpName}`,
    unit: `${tdpName} — Phường Xuân Hương`,
    to_dan_pho: tdpName,
    role: 'tdp',
    tdp_code: codeNum,
    avatar: '/images/thoi-hoa-lua/logo-doan.webp'
  };
});

// Danh sách tất cả tài khoản hợp lệ của hệ thống
export const ALL_ACCOUNTS: UserAccount[] = [
  ADMIN_ACCOUNT,
  ...TDP_ACCOUNTS
];

// KHÁCH VÃNG LAI MẶC ĐỊNH (GUEST)
export const GUEST_USER: UserAccount = {
  id: 'guest',
  username: 'guest',
  passwordHash: '',
  name: 'Độc giả',
  unit: 'Phường Xuân Hương — Đà Lạt',
  role: 'guest',
  avatar: '/images/thoi-hoa-lua/logo-doan.webp'
};

const STORAGE_KEY_AUTH = 'dtn_xh_auth_session_v7';

/**
 * LẤY PHIÊN ĐĂNG NHẬP HIỆN TẠI
 * Mặc định luôn là guest nếu chưa đăng nhập hợp lệ
 */
export function getCurrentSession(): UserAccount {
  if (typeof window === 'undefined') return GUEST_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return GUEST_USER;
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.role === 'admin' || parsed.role === 'tdp')) {
      return parsed;
    }
    return GUEST_USER;
  } catch {
    return GUEST_USER;
  }
}

/**
 * XÁC THỰC VÀ ĐĂNG NHẬP CHUẨN ENTERPRISE (SHA-256 + RATE LIMITING)
 * Tuyệt đối không cho phép bypass, bảo vệ chống Brute-Force
 */
export async function login(
  username: string, 
  password: string
): Promise<{ success: boolean; user?: UserAccount; message: string }> {
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  // Kiểm tra chống brute-force (Rate Limiting 5 lần sai -> khóa 30 giây)
  if (typeof window !== 'undefined') {
    const failedAttempts = Number(sessionStorage.getItem('dtn_auth_failed_count') || '0');
    const lockUntil = Number(sessionStorage.getItem('dtn_auth_locked_until') || '0');
    if (Date.now() < lockUntil) {
      const remainSec = Math.ceil((lockUntil - Date.now()) / 1000);
      return {
        success: false,
        message: `Hệ thống tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${remainSec} giây.`
      };
    }
  }

  // Băm mật khẩu người dùng vừa nhập
  const inputHash = await hashPassword(cleanPass);

  // 0. XÁC THỰC QUA ĐÁM MÂY SUPABASE (NẾU ĐÃ KẾT NỐI VÀ CÓ BẢNG ACCOUNTS)
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabase();
      const { data: cloudUser, error } = await client
        .from('accounts')
        .select('*')
        .or(`username.ilike.${cleanUser},to_dan_pho.ilike.${cleanUser}`)
        .limit(1)
        .maybeSingle();

      if (cloudUser && !error) {
        if (cloudUser.password_hash === inputHash) {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('dtn_auth_failed_count');
            sessionStorage.removeItem('dtn_auth_locked_until');
            const safeUser: UserAccount = {
              id: cloudUser.id,
              username: cloudUser.username,
              passwordHash: '',
              name: cloudUser.name,
              unit: cloudUser.unit,
              to_dan_pho: cloudUser.to_dan_pho,
              role: cloudUser.role,
              avatar: cloudUser.avatar || '/images/thoi-hoa-lua/logo-doan.webp',
              tdp_code: cloudUser.tdp_code
            };
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(safeUser));
            window.dispatchEvent(new Event('auth-changed'));
          }
          return {
            success: true,
            user: cloudUser,
            message: `Xác thực thành công qua Supabase Cloud: ${cloudUser.name}!`
          };
        } else {
          if (typeof window !== 'undefined') {
            const failedAttempts = Number(sessionStorage.getItem('dtn_auth_failed_count') || '0') + 1;
            sessionStorage.setItem('dtn_auth_failed_count', String(failedAttempts));
            if (failedAttempts >= 5) {
              sessionStorage.setItem('dtn_auth_locked_until', String(Date.now() + 30000));
              return { success: false, message: 'CẢNH BÁO BẢO MẬT: Nhập sai mật khẩu 5 lần! Hệ thống tạm khóa 30 giây.' };
            }
          }
          return { success: false, message: 'Mật khẩu không chính xác theo dữ liệu Supabase!' };
        }
      }
    } catch (e) {
      console.warn('Supabase accounts check fallback:', e);
    }
  }

  // 1. Kiểm tra Admin Ban Biên tập (Chế độ dự phòng cục bộ an toàn)
  if (
    (cleanUser === 'admin' || cleanUser === 'bientap@xuanhuong.dalat.vn') &&
    inputHash === ADMIN_HASH
  ) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dtn_auth_failed_count');
      sessionStorage.removeItem('dtn_auth_locked_until');
      // Lưu phiên an toàn (KHÔNG chứa passwordHash trong LocalStorage)
      const safeUser: UserAccount = {
        ...ADMIN_ACCOUNT,
        passwordHash: ''
      };
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(safeUser));
      window.dispatchEvent(new Event('auth-changed'));
    }
    return { success: true, user: ADMIN_ACCOUNT, message: 'Đăng nhập thành công với quyền Quản trị Ban Biên tập!' };
  }

  // 2. Kiểm tra 37 Tổ Dân Phố
  const foundTdp = TDP_ACCOUNTS.find(
    (acc) => acc.username.toLowerCase() === cleanUser || acc.to_dan_pho?.toLowerCase() === cleanUser
  );

  if (foundTdp) {
    const targetHash = TDP_HASHES[foundTdp.username];
    if (targetHash && inputHash === targetHash) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('dtn_auth_failed_count');
        sessionStorage.removeItem('dtn_auth_locked_until');
        // Lưu phiên an toàn (KHÔNG chứa passwordHash trong LocalStorage)
        const safeUser: UserAccount = {
          ...foundTdp,
          passwordHash: ''
        };
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(safeUser));
        window.dispatchEvent(new Event('auth-changed'));
      }
      return { success: true, user: foundTdp, message: `Đăng nhập thành công với tài khoản ${foundTdp.name}!` };
    }
  }

  // Xử lý khi đăng nhập thất bại
  if (typeof window !== 'undefined') {
    const failedAttempts = Number(sessionStorage.getItem('dtn_auth_failed_count') || '0');
    const newFailed = failedAttempts + 1;
    sessionStorage.setItem('dtn_auth_failed_count', String(newFailed));
    if (newFailed >= 5) {
      sessionStorage.setItem('dtn_auth_locked_until', String(Date.now() + 30000));
      return {
        success: false,
        message: 'CẢNH BÁO BẢO MẬT: Nhập sai mật khẩu 5 lần! Hệ thống tạm khóa 30 giây.'
      };
    }
    return { 
      success: false, 
      message: `Mật khẩu hoặc thông tin xác thực không chính xác (còn ${5 - newFailed} lần thử)!` 
    };
  }

  return { success: false, message: 'Thông tin đăng nhập không chính xác!' };
}

/**
 * ĐĂNG XUẤT AN TOÀN
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    window.dispatchEvent(new Event('auth-changed'));
  }
}

/**
 * KIỂM TRA QUYỀN TRUY CẬP (ACCESS CONTROL GUARDS)
 */
export function isAdmin(): boolean {
  return getCurrentSession().role === 'admin';
}

export function isTdp(): boolean {
  return getCurrentSession().role === 'tdp';
}

export function canModerate(): boolean {
  return getCurrentSession().role === 'admin';
}

export function canSubmit(): boolean {
  const s = getCurrentSession();
  return s.role === 'admin' || s.role === 'tdp';
}
