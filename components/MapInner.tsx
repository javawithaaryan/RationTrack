'use client';

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '@/lib/store';

interface MapInnerProps {
  districts: any[];
  selectedDistrict: any | null;
  onSelectDistrict: (d: any) => void;
  getRiskColor: (r: string) => string;
}

export default function MapInner({ districts, selectedDistrict, onSelectDistrict, getRiskColor }: MapInnerProps) {
  const { state } = useAppStore();

  return (
    <MapContainer
      center={[23.4733, 77.9470]}
      zoom={6}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%', borderRadius: '1rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {districts.map((district) => {
        const color = getRiskColor(district.riskLevel);
        const style = { color, fillColor: color, fillOpacity: 0.8 };
        return (
          <CircleMarker
            key={district.id}
            center={[district.lat, district.lng]}
            radius={Math.max(12, Math.min(30, district.alerts * 1.5))}
            pathOptions={style}
            eventHandlers={{
              click: () => onSelectDistrict(district),
            }}
          >
            <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent>
              <div className="font-bold text-center leading-tight">
                {district.alerts}
              </div>
            </Tooltip>
            <Popup>
              <div className="text-center font-bold">{district.name}</div>
              <div className="text-xs text-gray-500">{district.alerts} alerts</div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
