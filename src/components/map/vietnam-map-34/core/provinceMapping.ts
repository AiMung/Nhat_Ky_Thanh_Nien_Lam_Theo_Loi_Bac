/**
 * 34 PROVINCES MAPPING CONFIGURATION
 * Theo Quyết định 19/2025/QĐ-TTg (có hiệu lực từ 01/07/2025)
 * Source: https://github.com/phucanhle/vn-xaphuong-2025
 * 
 * OFFICIAL DATA: 34 tỉnh/TP, 3,321 xã/phường
 * 
 * Cấu trúc mới: Tỉnh → Xã (bỏ cấp huyện)
 */

// === TYPES & INTERFACES ===

export interface Province {
    /** Mã tỉnh mới BNV (unique ID) */
    code: number;
    /** Mã TMS (Tax Management System) */
    tms_code: number;
    /** Tên tỉnh mới */
    name: string;
    /** Tên chuẩn hóa không dấu */
    codename: string;
    /** Loại: "tỉnh" hoặc "thành phố" */
    division_type: "tỉnh" | "thành phố";
    /** Số xã/phường */
    commune_count: number;
    /** Danh sách các tỉnh cũ được hợp nhất (nếu có) */
    merged_from?: string[];
}

export interface Commune {
    /** Mã xã/phường */
    code: number;
    /** Tên xã/phường */
    name: string;
}

// === 34 TỈNH MỚI (TỪ QĐ 19/2025) ===

export const NEW_34_PROVINCES: Province[] = [
    { code: 1, tms_code: 101, name: "Hà Nội", codename: "ha_noi", division_type: "thành phố", commune_count: 126, merged_from: ["Hà Nội", "Hà Tây"] },
    { code: 2, tms_code: 102, name: "Bắc Ninh", codename: "bac_ninh", division_type: "tỉnh", commune_count: 99, merged_from: ["Bắc Ninh", "Bắc Giang"] },
    { code: 3, tms_code: 103, name: "Quảng Ninh", codename: "quang_ninh", division_type: "tỉnh", commune_count: 54 },
    { code: 4, tms_code: 104, name: "Hải Phòng", codename: "hai_phong", division_type: "thành phố", commune_count: 114, merged_from: ["Hải Phòng", "Hải Dương"] },
    { code: 5, tms_code: 105, name: "Hưng Yên", codename: "hung_yen", division_type: "tỉnh", commune_count: 104, merged_from: ["Hưng Yên", "Thái Bình"] },
    { code: 6, tms_code: 106, name: "Ninh Bình", codename: "ninh_binh", division_type: "tỉnh", commune_count: 129, merged_from: ["Ninh Bình", "Nam Định", "Hà Nam"] },
    { code: 7, tms_code: 107, name: "Cao Bằng", codename: "cao_bang", division_type: "tỉnh", commune_count: 56 },
    { code: 8, tms_code: 108, name: "Tuyên Quang", codename: "tuyen_quang", division_type: "tỉnh", commune_count: 124, merged_from: ["Tuyên Quang", "Hà Giang"] },
    { code: 9, tms_code: 109, name: "Lào Cai", codename: "lao_cai", division_type: "tỉnh", commune_count: 99, merged_from: ["Lào Cai", "Yên Bái"] },
    { code: 10, tms_code: 110, name: "Thái Nguyên", codename: "thai_nguyen", division_type: "tỉnh", commune_count: 92, merged_from: ["Thái Nguyên", "Bắc Kạn"] },
    { code: 11, tms_code: 111, name: "Lạng Sơn", codename: "lang_son", division_type: "tỉnh", commune_count: 65 },
    { code: 12, tms_code: 112, name: "Phú Thọ", codename: "phu_tho", division_type: "tỉnh", commune_count: 148, merged_from: ["Phú Thọ", "Vĩnh Phúc", "Hòa Bình"] },
    { code: 13, tms_code: 113, name: "Điện Biên", codename: "dien_bien", division_type: "tỉnh", commune_count: 45 },
    { code: 14, tms_code: 114, name: "Lai Châu", codename: "lai_chau", division_type: "tỉnh", commune_count: 38 },
    { code: 15, tms_code: 115, name: "Sơn La", codename: "son_la", division_type: "tỉnh", commune_count: 75 },
    { code: 16, tms_code: 116, name: "Thanh Hóa", codename: "thanh_hoa", division_type: "tỉnh", commune_count: 166 },
    { code: 17, tms_code: 117, name: "Nghệ An", codename: "nghe_an", division_type: "tỉnh", commune_count: 130 },
    { code: 18, tms_code: 118, name: "Hà Tĩnh", codename: "ha_tinh", division_type: "tỉnh", commune_count: 69 },
    { code: 19, tms_code: 119, name: "Quảng Trị", codename: "quang_tri", division_type: "tỉnh", commune_count: 78, merged_from: ["Quảng Trị", "Quảng Bình"] },
    { code: 20, tms_code: 120, name: "Huế", codename: "hue", division_type: "thành phố", commune_count: 40, merged_from: ["Thừa Thiên Huế"] },
    { code: 21, tms_code: 121, name: "Đà Nẵng", codename: "da_nang", division_type: "thành phố", commune_count: 94, merged_from: ["Đà Nẵng", "Quảng Nam"] },
    { code: 22, tms_code: 122, name: "Quảng Ngãi", codename: "quang_ngai", division_type: "tỉnh", commune_count: 96, merged_from: ["Quảng Ngãi", "Kon Tum"] },
    { code: 23, tms_code: 123, name: "Khánh Hòa", codename: "khanh_hoa", division_type: "tỉnh", commune_count: 65, merged_from: ["Khánh Hòa", "Ninh Thuận"] },
    { code: 24, tms_code: 124, name: "Gia Lai", codename: "gia_lai", division_type: "tỉnh", commune_count: 135, merged_from: ["Gia Lai", "Bình Định"] },
    { code: 25, tms_code: 125, name: "Đắk Lắk", codename: "dak_lak", division_type: "tỉnh", commune_count: 102, merged_from: ["Đắk Lắk", "Phú Yên"] },
    { code: 26, tms_code: 126, name: "Lâm Đồng", codename: "lam_dong", division_type: "tỉnh", commune_count: 124, merged_from: ["Lâm Đồng", "Đắk Nông", "Bình Thuận"] },
    { code: 27, tms_code: 127, name: "Tây Ninh", codename: "tay_ninh", division_type: "tỉnh", commune_count: 96, merged_from: ["Tây Ninh", "Long An"] },
    { code: 28, tms_code: 128, name: "Đồng Nai", codename: "dong_nai", division_type: "tỉnh", commune_count: 95, merged_from: ["Đồng Nai", "Bình Phước"] },
    { code: 29, tms_code: 129, name: "Hồ Chí Minh", codename: "ho_chi_minh", division_type: "thành phố", commune_count: 168, merged_from: ["Hồ Chí Minh", "Bình Dương", "Bà Rịa - Vũng Tàu"] },
    { code: 30, tms_code: 130, name: "Vĩnh Long", codename: "vinh_long", division_type: "tỉnh", commune_count: 124, merged_from: ["Vĩnh Long", "Bến Tre", "Trà Vinh"] },
    { code: 31, tms_code: 131, name: "Đồng Tháp", codename: "dong_thap", division_type: "tỉnh", commune_count: 102, merged_from: ["Đồng Tháp", "Tiền Giang"] },
    { code: 32, tms_code: 132, name: "An Giang", codename: "an_giang", division_type: "tỉnh", commune_count: 102, merged_from: ["An Giang", "Kiên Giang"] },
    { code: 33, tms_code: 133, name: "Cần Thơ", codename: "can_tho", division_type: "thành phố", commune_count: 103, merged_from: ["Cần Thơ", "Hậu Giang", "Sóc Trăng"] },
    { code: 34, tms_code: 134, name: "Cà Mau", codename: "ca_mau", division_type: "tỉnh", commune_count: 64, merged_from: ["Cà Mau", "Bạc Liêu"] }
];

// === QUICK LOOKUP MAP (OLD -> NEW) ===

/**
 * Map tên tỉnh cũ (chuẩn hóa) → tên tỉnh mới
 * Dùng cho việc tra cứu nhanh khi có dữ liệu từ API 63 tỉnh cũ
 */
export const OLD_TO_NEW_PROVINCE_MAP: Record<string, string> = {
    // Giữ nguyên (7)
    "cao bang": "Cao Bằng",
    "lang son": "Lạng Sơn",
    "quang ninh": "Quảng Ninh",
    "dien bien": "Điện Biên",
    "lai chau": "Lai Châu",
    "son la": "Sơn La",
    "thanh hoa": "Thanh Hóa",
    "nghe an": "Nghệ An",
    "ha tinh": "Hà Tĩnh",

    // Hà Nội (+ Hà Tây cũ)
    "ha noi": "Hà Nội",
    "ha tay": "Hà Nội",

    // Bắc Ninh (+ Bắc Giang)
    "bac ninh": "Bắc Ninh",
    "bac giang": "Bắc Ninh",

    // Hải Phòng (+ Hải Dương)
    "hai phong": "Hải Phòng",
    "hai duong": "Hải Phòng",

    // Hưng Yên (+ Thái Bình)
    "hung yen": "Hưng Yên",
    "thai binh": "Hưng Yên",

    // Ninh Bình (+ Nam Định + Hà Nam)
    "ninh binh": "Ninh Bình",
    "nam dinh": "Ninh Bình",
    "ha nam": "Ninh Bình",

    // Tuyên Quang (+ Hà Giang)
    "tuyen quang": "Tuyên Quang",
    "ha giang": "Tuyên Quang",

    // Lào Cai (+ Yên Bái)
    "lao cai": "Lào Cai",
    "yen bai": "Lào Cai",

    // Thái Nguyên (+ Bắc Kạn)
    "thai nguyen": "Thái Nguyên",
    "bac kan": "Thái Nguyên",
    "bac can": "Thái Nguyên",

    // Phú Thọ (+ Vĩnh Phúc + Hòa Bình)
    "phu tho": "Phú Thọ",
    "vinh phuc": "Phú Thọ",
    "hoa binh": "Phú Thọ",

    // Quảng Trị (+ Quảng Bình)
    "quang tri": "Quảng Trị",
    "quang binh": "Quảng Trị",

    // Huế (Thừa Thiên Huế)
    "hue": "Huế",
    "thua thien hue": "Huế",
    "thua thien - hue": "Huế",

    // Đà Nẵng (+ Quảng Nam)
    "da nang": "Đà Nẵng",
    "quang nam": "Đà Nẵng",

    // Quảng Ngãi (+ Kon Tum)
    "quang ngai": "Quảng Ngãi",
    "kon tum": "Quảng Ngãi",

    // Khánh Hòa (+ Ninh Thuận)
    "khanh hoa": "Khánh Hòa",
    "ninh thuan": "Khánh Hòa",

    // Gia Lai (+ Bình Định)
    "gia lai": "Gia Lai",
    "binh dinh": "Gia Lai",

    // Đắk Lắk (+ Phú Yên)
    "dak lak": "Đắk Lắk",
    "phu yen": "Đắk Lắk",

    // Lâm Đồng (+ Đắk Nông + Bình Thuận)
    "lam dong": "Lâm Đồng",
    "dak nong": "Lâm Đồng",
    "binh thuan": "Lâm Đồng",

    // Tây Ninh (+ Long An)
    "tay ninh": "Tây Ninh",
    "long an": "Tây Ninh",

    // Đồng Nai (+ Bình Phước)
    "dong nai": "Đồng Nai",
    "binh phuoc": "Đồng Nai",

    // HCM (+ Bình Dương + Bà Rịa-VT)
    "ho chi minh": "Hồ Chí Minh",
    "ho chi minh city": "Hồ Chí Minh",
    "binh duong": "Hồ Chí Minh",
    "ba ria - vung tau": "Hồ Chí Minh",
    "ba ria vung tau": "Hồ Chí Minh",

    // Vĩnh Long (+ Bến Tre + Trà Vinh)
    "vinh long": "Vĩnh Long",
    "ben tre": "Vĩnh Long",
    "tra vinh": "Vĩnh Long",

    // Đồng Tháp (+ Tiền Giang)
    "dong thap": "Đồng Tháp",
    "tien giang": "Đồng Tháp",

    // An Giang (+ Kiên Giang)
    "an giang": "An Giang",
    "kien giang": "An Giang",

    // Cần Thơ (+ Hậu Giang + Sóc Trăng)
    "can tho": "Cần Thơ",
    "hau giang": "Cần Thơ",
    "soc trang": "Cần Thơ",

    // Cà Mau (+ Bạc Liêu)
    "ca mau": "Cà Mau",
    "bac lieu": "Cà Mau"
};

// === PROVINCE NAME LOOKUP BY TMS CODE ===

export const TMS_CODE_TO_PROVINCE: Record<number, string> = {
    101: "Hà Nội",
    102: "Bắc Ninh",
    103: "Quảng Ninh",
    104: "Hải Phòng",
    105: "Hưng Yên",
    106: "Ninh Bình",
    107: "Cao Bằng",
    108: "Tuyên Quang",
    109: "Lào Cai",
    110: "Thái Nguyên",
    111: "Lạng Sơn",
    112: "Phú Thọ",
    113: "Điện Biên",
    114: "Lai Châu",
    115: "Sơn La",
    116: "Thanh Hóa",
    117: "Nghệ An",
    118: "Hà Tĩnh",
    119: "Quảng Trị",
    120: "Huế",
    121: "Đà Nẵng",
    122: "Quảng Ngãi",
    123: "Khánh Hòa",
    124: "Gia Lai",
    125: "Đắk Lắk",
    126: "Lâm Đồng",
    127: "Tây Ninh",
    128: "Đồng Nai",
    129: "Hồ Chí Minh",
    130: "Vĩnh Long",
    131: "Đồng Tháp",
    132: "An Giang",
    133: "Cần Thơ",
    134: "Cà Mau"
};

// === HELPER FUNCTIONS ===

/**
 * Chuẩn hóa tên tỉnh về dạng lowercase, không dấu
 */
export const normalizeName = (str: string): string => {
    if (!str) return "";
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .trim();
};

/**
 * Lấy tên tỉnh mới từ tên tỉnh cũ
 */
export const getNewProvinceName = (oldProvinceName: string): string => {
    const normalized = normalizeName(oldProvinceName);
    return OLD_TO_NEW_PROVINCE_MAP[normalized] || oldProvinceName;
};

/**
 * Lấy thông tin đầy đủ tỉnh mới
 */
export const getProvinceByName = (name: string): Province | undefined => {
    const normalized = normalizeName(name);
    const newName = OLD_TO_NEW_PROVINCE_MAP[normalized];
    return NEW_34_PROVINCES.find(p => p.name === newName || p.name === name);
};

/**
 * Lấy tỉnh mới theo mã BNV
 */
export const getProvinceByCode = (code: number): Province | undefined => {
    return NEW_34_PROVINCES.find(p => p.code === code);
};

/**
 * Lấy tỉnh mới theo mã TMS (thuế)
 */
export const getProvinceByTmsCode = (tmsCode: number): Province | undefined => {
    return NEW_34_PROVINCES.find(p => p.tms_code === tmsCode);
};

/**
 * Kiểm tra xem tỉnh có được hợp nhất không
 */
export const isMergedProvince = (provinceName: string): boolean => {
    const province = getProvinceByName(provinceName);
    return province?.merged_from ? province.merged_from.length > 1 : false;
};

/**
 * Lấy tổng số xã/phường
 */
export const getTotalCommunes = (): number => {
    return NEW_34_PROVINCES.reduce((sum, p) => sum + p.commune_count, 0);
};

/**
 * Thống kê
 */
export const getProvinceStats = () => {
    const total = NEW_34_PROVINCES.length;
    const cities = NEW_34_PROVINCES.filter(p => p.division_type === "thành phố").length;
    const merged = NEW_34_PROVINCES.filter(p => p.merged_from && p.merged_from.length > 1).length;
    const communes = getTotalCommunes();
    const largest = NEW_34_PROVINCES.reduce((max, p) => p.commune_count > max.commune_count ? p : max);
    const smallest = NEW_34_PROVINCES.reduce((min, p) => p.commune_count < min.commune_count ? p : min);

    return {
        totalProvinces: total,
        cities,
        provinces: total - cities,
        mergedProvinces: merged,
        unchangedProvinces: total - merged,
        totalCommunes: communes,
        largestProvince: { name: largest.name, commune_count: largest.commune_count },
        smallestProvince: { name: smallest.name, commune_count: smallest.commune_count }
    };
};

// === DEPRECATED (backward compatibility) ===
/** @deprecated Dùng OLD_TO_NEW_PROVINCE_MAP thay thế */
export const PROVINCE_MAPPING = OLD_TO_NEW_PROVINCE_MAP;
