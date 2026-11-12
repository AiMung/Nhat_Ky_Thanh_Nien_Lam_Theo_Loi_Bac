import React, { useEffect, useState, useRef, useMemo } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import vnMapData from './core/assets/vn-all.geo.json';
import { PROVINCE_MAPPING, normalizeName } from './core/provinceMapping';

export interface ProvinceData {
  name: string;
  code: string;
  value?: number;
  [key: string]: any;
}

export interface HighchartsVietnamMapProps {
  height?: number | string;
  data?: any[];
  onProvinceClick?: (province: ProvinceData) => void;
  hoverColor?: string;
  borderColor?: string;
  className?: string;
}

export default function HighchartsVietnamMap({
  height = 540,
  data,
  onProvinceClick,
  hoverColor = '#b91c1c',
  borderColor = '#ffffff',
  className
}: HighchartsVietnamMapProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [mapOptions, setMapOptions] = useState<Highcharts.Options | null>(null);

  // Xử lý topology 34 tỉnh thành theo quy hoạch hành chính mới
  const { processedTopology, mergedFeatures } = useMemo(() => {
    if (!vnMapData || !(vnMapData as any).features) return { processedTopology: null, mergedFeatures: [] };

    const groupedFeatures: Record<string, any[]> = {};

    (vnMapData as any).features.forEach((f: any) => {
      const originalName = f.properties.name;
      const normalized = normalizeName(originalName);
      let newName = (PROVINCE_MAPPING as any)[normalized];

      if (!newName) {
        const foundKey = Object.keys(PROVINCE_MAPPING).find((key) => normalized.includes(key));
        newName = foundKey ? (PROVINCE_MAPPING as any)[foundKey] : originalName;
      }

      const newId = `vn-new-${normalizeName(newName).replace(/\s+/g, '-')}`;

      if (!groupedFeatures[newId]) {
        groupedFeatures[newId] = [];
      }

      groupedFeatures[newId].push({
        feature: f,
        newName: newName,
        newId: newId
      });
    });

    const merged = Object.values(groupedFeatures).map((group: any[]) => {
      const firstItem = group[0];
      const newName = firstItem.newName;
      const newId = firstItem.newId;

      if (group.length === 1) {
        return {
          ...firstItem.feature,
          properties: {
            ...firstItem.feature.properties,
            'hc-key': newId,
            name: newName,
            'original-name': firstItem.feature.properties.name
          }
        };
      }

      const mergedCoordinates: any[] = [];
      group.forEach((item) => {
        const geom = item.feature.geometry;
        if (geom.type === 'Polygon') {
          mergedCoordinates.push(geom.coordinates);
        } else if (geom.type === 'MultiPolygon') {
          mergedCoordinates.push(...geom.coordinates);
        }
      });

      return {
        type: 'Feature',
        properties: {
          ...firstItem.feature.properties,
          'hc-key': newId,
          name: newName,
          'original-name': group.map((g) => g.feature.properties.name).join(', ')
        },
        geometry: {
          type: 'MultiPolygon',
          coordinates: mergedCoordinates
        }
      };
    });

    return {
      processedTopology: { ...vnMapData, features: merged },
      mergedFeatures: merged
    };
  }, []);

  // Tính toán dữ liệu hiển thị trên bản đồ
  const computedMapData = useMemo(() => {
    if (!mergedFeatures.length) return [];
    if (data && data.length > 0) {
      return mergedFeatures.map((f: any) => {
        const provName = f.properties.name;
        const found = data.find((d) => d.name === provName || provName.includes(d.name) || d.name.includes(provName));
        return {
          'hc-key': f.properties['hc-key'],
          id: f.properties['hc-key'],
          name: provName,
          value: found ? found.value : 350
        };
      });
    }

    return mergedFeatures.map((f: any) => ({
      'hc-key': f.properties['hc-key'],
      id: f.properties['hc-key'],
      name: f.properties.name,
      value: 350
    }));
  }, [data, mergedFeatures]);

  // Cấu hình Highcharts Options
  useEffect(() => {
    if (!processedTopology || !computedMapData.length) return;

    const options: Highcharts.Options = {
      chart: {
        map: processedTopology,
        backgroundColor: 'transparent',
        height: height,
        style: { fontFamily: 'inherit' }
      },
      title: { text: undefined },
      credits: { enabled: false },
      accessibility: { enabled: false },
      mapNavigation: {
        enabled: true,
        enableDoubleClickZoom: true,
        buttonOptions: { verticalAlign: 'bottom' }
      },
      colorAxis: {
        min: 200,
        max: 2500,
        minColor: '#fee2e2',
        maxColor: '#991b1b'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 10,
        shadow: true,
        useHTML: true,
        headerFormat: '<div style="font-size: 13px; font-weight: bold; color: #991b1b; margin-bottom: 2px;">{point.key}</div>',
        pointFormat: '<div style="color: #334155; font-size: 12px;">Đã số hóa: <b style="color: #991b1b;">{point.value}</b> trang nhật ký<br/><i style="font-size: 11px; color: #64748b;">(Bấm để xem tư liệu chi tiết)</i></div>'
      },
      series: [
        {
          type: 'map',
          name: 'Việt Nam',
          data: computedMapData,
          joinBy: 'hc-key',
          allAreas: false,
          borderColor: borderColor,
          borderWidth: 0.5,
          states: {
            hover: { color: hoverColor, borderColor: '#d97706' },
            select: { color: hoverColor, borderColor: '#d97706' }
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            allowOverlap: true,
            crop: false,
            style: {
              fontSize: '10px',
              fontWeight: '600',
              textOutline: '2px contrast',
              color: '#1e293b'
            }
          },
          point: {
            events: {
              click: function () {
                const point = this as any;
                if (onProvinceClick) {
                  onProvinceClick({
                    name: point.name,
                    code: point['hc-key'],
                    value: point.value
                  });
                }
              }
            }
          }
        }
      ]
    };

    setMapOptions(options);
  }, [processedTopology, computedMapData, height, hoverColor, borderColor, onProvinceClick]);

  if (!mapOptions) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="w-8 h-8 border-3 border-red-700 border-t-transparent rounded-full animate-spin mr-3"></div>
        <span className="text-xs font-medium">Đang khởi tạo bản đồ 34 tỉnh thành...</span>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className || ''}`}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={mapOptions}
        ref={chartRef}
      />
    </div>
  );
}
