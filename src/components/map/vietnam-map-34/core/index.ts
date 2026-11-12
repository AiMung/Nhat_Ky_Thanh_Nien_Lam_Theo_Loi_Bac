/**
 * Core module - Framework-agnostic utilities
 * Data source: QĐ 19/2025/QĐ-TTg (hiệu lực từ 01/07/2025)
 * 
 * Use này với bất kỳ JS framework nào (vanilla, React, Vue, Angular, etc.)
 */

// Export province mapping data and utilities
export {
    NEW_34_PROVINCES,
    OLD_TO_NEW_PROVINCE_MAP,
    TMS_CODE_TO_PROVINCE,
    PROVINCE_MAPPING,
    normalizeName,
    getNewProvinceName,
    getProvinceByName,
    getProvinceByCode,
    getProvinceByTmsCode,
    isMergedProvince,
    getTotalCommunes,
    getProvinceStats as getProvinceStatsFromMapping
} from './provinceMapping';

export type { Province, Commune } from './provinceMapping';

// Export GeoJSON map data
import vnMapData from './assets/vn-all.geo.json';
export { vnMapData };
export const vietnamGeoJson = vnMapData;

// Export drilldown utilities (commune/ward level)
export {
    getProvincesIndex,
    getProvinceInfo,
    getProvinceCommunes,
    getProvinceData,
    getAllProvincesData,
    getProvinceByBNVCode,
    getProvinceByTMSCode,
    searchCommunes,
    getProvinceStats,
    loadProvinceCommunes  // deprecated but kept for compatibility
} from './drilldown';

export type {
    ProvinceIndex,
    ProvinceData,
    CommuneData,
    CommuneFeature,
    ProvinceGeoJSON
} from './drilldown';
