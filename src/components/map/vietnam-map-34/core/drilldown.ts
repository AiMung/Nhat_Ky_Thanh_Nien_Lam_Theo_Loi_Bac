/**
 * Province Drilldown Utilities
 * Load commune/ward level data for each province
 * 
 * Data source: QĐ 19/2025/QĐ-TTg (hiệu lực từ 01/07/2025)
 */

import communesData from './assets/communes-2025.json';

// === Types ===

export interface CommuneData {
    /** Mã xã/phường (5 số) */
    code: number;
    /** Tên xã/phường */
    name: string;
}

export interface ProvinceData {
    /** Mã BNV (2 số) */
    codeBNV: string;
    /** Mã TMS (3 số) */
    codeTMS: string;
    /** Tên tỉnh/TP */
    name: string;
    /** Danh sách xã/phường */
    communes: CommuneData[];
}

interface RawProvinceData {
    matinhBNV: string;
    matinhTMS: string;
    tentinhmoi: string;
    phuongxa: Array<{
        maphuongxa: number;
        tenphuongxa: string;
    }>;
}

// === Process communes data ===

const processedData: ProvinceData[] = (communesData as RawProvinceData[]).map(p => ({
    codeBNV: p.matinhBNV,
    codeTMS: p.matinhTMS,
    name: p.tentinhmoi.replace(/^(Thành phố |Tỉnh |Tp )/, ''),
    communes: p.phuongxa.map(c => ({
        code: c.maphuongxa,
        name: c.tenphuongxa
    }))
}));

// === Province Index ===

export interface ProvinceIndex {
    name: string;
    codeBNV: string;
    codeTMS: string;
    commune_count: number;
}

/**
 * Get list of all 34 new provinces with commune counts
 */
export function getProvincesIndex(): ProvinceIndex[] {
    return processedData.map(p => ({
        name: p.name,
        codeBNV: p.codeBNV,
        codeTMS: p.codeTMS,
        commune_count: p.communes.length
    }));
}

/**
 * Get province info by name
 */
export function getProvinceInfo(provinceName: string): ProvinceIndex | undefined {
    const normalized = provinceName.toLowerCase().replace(/^(thành phố |tỉnh |tp )/i, '');
    return getProvincesIndex().find(
        p => p.name.toLowerCase() === normalized ||
            p.name.toLowerCase() === provinceName.toLowerCase()
    );
}

/**
 * Get communes list for a province
 * @param provinceName - Name of the province (e.g., "Hà Nội")
 */
export function getProvinceCommunes(provinceName: string): CommuneData[] | null {
    const normalized = provinceName.toLowerCase().replace(/^(thành phố |tỉnh |tp )/i, '');
    const province = processedData.find(
        p => p.name.toLowerCase() === normalized ||
            p.name.toLowerCase() === provinceName.toLowerCase()
    );
    return province?.communes || null;
}

/**
 * Get full province data with communes
 */
export function getProvinceData(provinceName: string): ProvinceData | null {
    const normalized = provinceName.toLowerCase().replace(/^(thành phố |tỉnh |tp )/i, '');
    return processedData.find(
        p => p.name.toLowerCase() === normalized ||
            p.name.toLowerCase() === provinceName.toLowerCase()
    ) || null;
}

/**
 * Get all provinces data
 */
export function getAllProvincesData(): ProvinceData[] {
    return processedData;
}

/**
 * Get province by BNV code
 */
export function getProvinceByBNVCode(code: string | number): ProvinceData | null {
    const codeStr = String(code).padStart(2, '0');
    return processedData.find(p => p.codeBNV === codeStr) || null;
}

/**
 * Get province by TMS code
 */
export function getProvinceByTMSCode(code: string | number): ProvinceData | null {
    const codeStr = String(code);
    return processedData.find(p => p.codeTMS === codeStr) || null;
}

/**
 * Search communes by name (across all provinces)
 */
export function searchCommunes(query: string): Array<{ province: string; commune: CommuneData }> {
    const results: Array<{ province: string; commune: CommuneData }> = [];
    const q = query.toLowerCase();

    for (const province of processedData) {
        for (const commune of province.communes) {
            if (commune.name.toLowerCase().includes(q)) {
                results.push({ province: province.name, commune });
            }
        }
    }

    return results;
}

/**
 * Get total statistics
 */
export function getProvinceStats() {
    const provinces = getProvincesIndex();
    const totalCommunes = provinces.reduce((sum, p) => sum + p.commune_count, 0);
    const cities = processedData.filter(p =>
        p.name === 'Hà Nội' || p.name === 'Hồ Chí Minh' ||
        p.name === 'Đà Nẵng' || p.name === 'Hải Phòng' ||
        p.name === 'Cần Thơ' || p.name === 'Huế'
    ).length;

    return {
        totalProvinces: provinces.length,
        totalCommunes,
        cities,
        provinces: provinces.length - cities,
        largestProvince: provinces.reduce((max, p) => p.commune_count > max.commune_count ? p : max),
        smallestProvince: provinces.reduce((min, p) => p.commune_count < min.commune_count ? p : min)
    };
}

// === Legacy support (for old GeoJSON drilldown) ===

export interface CommuneFeature {
    type: 'Feature';
    properties: {
        GID_3: string;
        NAME_1: string;
        NAME_2: string;
        NAME_3: string;
        TYPE_3: string;
        NEW_PROVINCE: string;
        OLD_PROVINCE: string;
    };
    geometry: any;
}

export interface ProvinceGeoJSON {
    type: 'FeatureCollection';
    name: string;
    features: CommuneFeature[];
}

/**
 * @deprecated Use getProvinceCommunes instead. This loads old GADM GeoJSON data.
 */
export async function loadProvinceCommunes(provinceName: string): Promise<ProvinceGeoJSON | null> {
    console.warn('loadProvinceCommunes is deprecated. GeoJSON data is outdated. Use getProvinceCommunes instead.');

    try {
        // Try to load old GeoJSON files (for backward compatibility)
        const normalized = provinceName.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/\s+/g, '-');
        const data = await import(`./assets/provinces/${normalized}.json`);
        return data.default as ProvinceGeoJSON;
    } catch {
        // Fallback: return mock GeoJSON from new data
        const communes = getProvinceCommunes(provinceName);
        if (!communes) return null;

        return {
            type: 'FeatureCollection',
            name: provinceName,
            features: communes.map((c, i) => ({
                type: 'Feature' as const,
                properties: {
                    GID_3: String(c.code),
                    NAME_1: 'Vietnam',
                    NAME_2: provinceName,
                    NAME_3: c.name,
                    TYPE_3: c.name.startsWith('Phường') ? 'Phường' : c.name.startsWith('Xã') ? 'Xã' : 'Thị trấn',
                    NEW_PROVINCE: provinceName,
                    OLD_PROVINCE: provinceName
                },
                geometry: null
            }))
        };
    }
}
