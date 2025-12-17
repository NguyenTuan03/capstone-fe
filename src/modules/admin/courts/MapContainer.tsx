// MapComponent.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Custom green marker for courts
const courtIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Selected marker (larger)
const selectedCourtIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -48],
  shadowSize: [57, 57],
});

interface Court {
  id: string;
  name: string;
  address: string;
  provinceId: number;
  districtId: number;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  pricePerHour?: number;
  publicUrl?: string;
  provinceName?: string;
  districtName?: string;
}

interface MapComponentProps {
  courts: Court[];
  selectedCourtId: string | null;
  onMarkerClick: (courtId: string) => void;
}

const DEFAULT_CENTER: [number, number] = [16.0544, 108.2022];

export default function MapComponent({
  courts,
  selectedCourtId,
  onMarkerClick,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update markers and view when courts or selection changes
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const map = mapRef.current;
    const layer = markersLayerRef.current;

    layer.clearLayers();

    courts.forEach((court) => {
      const icon = court.id === selectedCourtId ? selectedCourtIcon : courtIcon;
      const marker = L.marker([court.latitude, court.longitude], { icon });

      marker.on('click', () => onMarkerClick(court.id));

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2';
      popupContent.innerHTML = `
        ${court.publicUrl ? `<img src="${court.publicUrl}" alt="${court.name}" class="w-full h-32 object-cover rounded-lg mb-2" />` : ''}
        <div class="mb-2 text-green-700 font-semibold">${court.name}</div>
        <div class="text-sm">${court.address}</div>
        ${court.phoneNumber ? `<div class="text-sm">📞 ${court.phoneNumber}</div>` : ''}
        ${
          court.pricePerHour
            ? `<div class="text-sm font-semibold text-green-600">💰 ${court.pricePerHour.toLocaleString(
                'vi-VN',
              )}đ/giờ</div>`
            : ''
        }
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });
      marker.addTo(layer);
    });

    // Fit bounds or focus selected court
    if (selectedCourtId) {
      const court = courts.find((c) => c.id === selectedCourtId);
      if (court) {
        map.setView([court.latitude, court.longitude], 15, { animate: true });
      }
    } else if (courts.length > 0) {
      const bounds = courts.map((court) => [court.latitude, court.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [courts, selectedCourtId, onMarkerClick]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
}
