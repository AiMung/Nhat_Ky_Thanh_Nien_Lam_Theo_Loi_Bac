/**
 * Danh mục Phân loại Đơn vị Đóng góp cho Dự án:
 * "NHẬT KÝ THANH NIÊN LÀM THEO LỜI BÁC" — Phường Xuân Hương, Đà Lạt
 * Bao gồm:
 * 1. Khối 37 Tổ Dân Phố (Phường Xuân Hương)
 * 2. Khối Trường học (CĐ, THPT, THCS, Tiểu học, Mầm non trên địa bàn)
 * 3. Khối Người dân & Đơn vị khác
 */

export interface ContributorUnitOption {
  id: string;
  name: string;
  type: 'tdp' | 'school' | 'citizen' | 'other';
  groupName: string;
  badge: string;
}

// 1. DANH SÁCH 37 TỔ DÂN PHỐ PHƯỜNG XUÂN HƯƠNG — ĐÀ LẠT
export const TDP_UNITS: string[] = [
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

// 2. KHỐI TRƯỜNG HỌC TẠI PHƯỜNG XUÂN HƯƠNG — ĐÀ LẠT
export const SCHOOL_UNITS: string[] = [
  'Trường Cao đẳng Sư phạm Đà Lạt',
  'Trường THPT Bùi Thị Xuân',
  'Trường THPT Chuyên Thăng Long',
  'Trường THCS Quang Trung',
  'Trường THCS Phan Chu Trinh',
  'Trường Tiểu học Đoàn Thị Điểm',
  'Trường Tiểu học Trưng Vương',
  'Trường Mầm non 1 — Đà Lạt',
  'Trường Mầm non 2 — Đà Lạt',
  'Chi đoàn / Liên đội Trường học khác'
];

// 3. KHỐI NGƯỜI DÂN & TỔ CHỨC KHÁC
export const CITIZEN_UNITS: string[] = [
  'Người dân Phường Xuân Hương',
  'Hội Cựu chiến binh Phường Xuân Hương',
  'Nhân chứng lịch sử / Cựu thanh niên xung phong',
  'Cán bộ lão thành / Hưu trí',
  'Đoàn viên thanh niên tự do',
  'Cá nhân / Đơn vị hảo tâm khác'
];

// Nhóm danh mục tổng hợp
export const ALL_UNIT_GROUPS = [
  {
    type: 'tdp' as const,
    label: 'Khối 37 Tổ Dân Phố',
    badge: 'Tổ Dân Phố',
    items: TDP_UNITS
  },
  {
    type: 'school' as const,
    label: 'Khối Trường Học',
    badge: 'Trường Học',
    items: SCHOOL_UNITS
  },
  {
    type: 'citizen' as const,
    label: 'Người Dân & Nhân Chứng',
    badge: 'Người Dân',
    items: CITIZEN_UNITS
  }
];

export function getUnitBadge(unitName?: string): { text: string; colorClass: string; type: string } {
  if (!unitName || unitName.trim() === '' || unitName === 'Đơn vị' || unitName.toLowerCase() === 'khác') {
    return { 
      text: 'Ký Ức Lịch Sử', 
      colorClass: 'bg-gradient-to-r from-red-900/90 to-amber-900/90 text-amber-200 border-amber-500/40 shadow-xs',
      type: 'history'
    };
  }
  
  // 1. Khối 37 Tổ dân phố
  if (unitName.includes('Tổ dân phố') || unitName.includes('TDP') || TDP_UNITS.includes(unitName)) {
    // Trích xuất tên ngắn gọn nếu dài
    const shortName = unitName.replace('Tổ dân phố ', 'TDP ').replace(' — Phường Xuân Hương', '');
    return { 
      text: shortName.length > 25 ? 'Tổ Dân Phố' : shortName, 
      colorClass: 'bg-red-50 text-red-900 border-red-200/90 font-bold',
      type: 'tdp'
    };
  }

  // 2. Khối Trường học
  if (SCHOOL_UNITS.some(s => unitName.includes(s)) || unitName.includes('Trường') || unitName.includes('Liên đội') || unitName.includes('CĐ Sư phạm') || unitName.includes('THPT') || unitName.includes('THCS')) {
    const shortName = unitName.replace('Trường ', '').replace(' — Đà Lạt', '');
    return { 
      text: shortName.length > 25 ? 'Khối Trường Học' : shortName, 
      colorClass: 'bg-blue-50 text-blue-900 border-blue-200/90 font-bold',
      type: 'school'
    };
  }

  // 3. Khối Người dân & Cựu chiến binh
  if (unitName.includes('Cựu chiến binh') || unitName.includes('Nhân chứng') || unitName.includes('Người dân') || unitName.includes('Cán bộ lão thành')) {
    return { 
      text: unitName.length > 25 ? 'Nhân Chứng Lịch Sử' : unitName, 
      colorClass: 'bg-emerald-50 text-emerald-900 border-emerald-200/90 font-bold',
      type: 'citizen'
    };
  }

  // 4. Các đơn vị khác
  return { 
    text: unitName.length > 24 ? unitName.substring(0, 22) + '...' : unitName, 
    colorClass: 'bg-amber-50 text-amber-900 border-amber-300/80 font-bold',
    type: 'custom'
  };
}
