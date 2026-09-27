import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FuelStation, RouteOption } from '../types/station';
import { ZoomIn, ZoomOut, Navigation, Layers, Zap } from 'lucide-react';

// Safe guard against Leaflet race conditions during unmount / animations
if (typeof L !== 'undefined' && L.DomUtil) {
  const originalGetPosition = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el: HTMLElement) {
    if (!el) {
      return new L.Point(0, 0);
    }
    return originalGetPosition(el) || new L.Point(0, 0);
  };

  const originalSetPosition = L.DomUtil.setPosition;
  L.DomUtil.setPosition = function (el: HTMLElement, point: L.Point) {
    if (!el) return;
    originalSetPosition(el, point);
  };
}

interface MapComponentProps {
  userLocation: [number, number];
  stations: FuelStation[];
  selectedStation: FuelStation | null;
  onSelectStation: (station: FuelStation) => void;
  activeRoute: RouteOption | null;
  onCenterUser: () => void;
}

type OsmLayer = 'osm-standard' | 'osm-hot';

export const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  stations,
  selectedStation,
  onSelectStation,
  activeRoute,
  onCenterUser,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [osmLayer, setOsmLayer] = useState<OsmLayer>('osm-standard');

  // Initialize Map with OpenStreetMap (OSM) & Leaflet
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Reset container if previous instance left an id
    if ((container as unknown as { _leaflet_id?: number })._leaflet_id && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(container, {
      center: userLocation,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // OpenStreetMap (OSM) Standard Tile Layer
    const tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    tileLayerRef.current = tile;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Track timeouts and observer for clean teardown
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    timeouts.push(
      setTimeout(() => {
        if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100)
    );

    timeouts.push(
      setTimeout(() => {
        if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 400)
    );

    return () => {
      resizeObserver.disconnect();
      timeouts.forEach(clearTimeout);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      userMarkerRef.current = null;
      routeLayerRef.current = null;
      tileLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update OSM Tile Layer on toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current.getContainer()) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      osmLayer === 'osm-standard'
        ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: osmLayer === 'osm-hot' ? 'abc' : [],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.invalidateSize();
  }, [osmLayer]);

  // Update User GPS Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current.getContainer()) return;

    const userHtml = `
      <div class="relative flex items-center justify-center w-8 h-8 pointer-events-none">
        <div class="absolute inset-0 bg-blue-500/30 rounded-full user-gps-pulse"></div>
        <div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md flex items-center justify-center">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'user-marker',
      html: userHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    if (userMarkerRef.current && mapInstanceRef.current.hasLayer(userMarkerRef.current)) {
      userMarkerRef.current.setLatLng(userLocation);
    } else {
      userMarkerRef.current = L.marker(userLocation, {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(mapInstanceRef.current);
    }
  }, [userLocation]);

  // Update Minimalist Station Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current.getContainer() || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    stations.forEach((st) => {
      const isSelected = selectedStation?.id === st.id;

      // Status color
      let dotColor = '#10b981'; // emerald
      let glowClass = 'shadow-emerald-500/20';

      if (st.crowdLevel === 'medium') {
        dotColor = '#f59e0b'; // amber
        glowClass = 'shadow-amber-500/20';
      } else if (st.crowdLevel === 'high' || st.crowdLevel === 'extreme') {
        dotColor = '#ef4444'; // rose
        glowClass = 'shadow-rose-500/20';
      }

      // Minimal badge designed to be clear on top of OpenStreetMap
      const markerHtml = `
        <div class="group relative cursor-pointer transition-all duration-200 transform ${
          isSelected ? 'scale-115 z-50' : 'hover:scale-105 z-20'
        }">
          <div class="flex items-center gap-1 px-2.5 py-1 bg-slate-900/95 text-white rounded-full shadow-md ${glowClass} border ${
            isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-700'
          }">
            <div class="w-2 h-2 rounded-full shrink-0" style="background-color: ${dotColor}"></div>
            <span class="text-[11px] font-bold font-mono tracking-tight text-white">${st.waitTimeMinutes}'</span>
            ${
              st.hasOnlinePayment
                ? `<span class="text-[9px] text-emerald-400 font-bold" title="پرداخت سریع آنلاین">⚡</span>`
                : ''
            }
          </div>
          <div class="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b ${
            isSelected ? 'border-amber-400' : 'border-slate-700'
          }"></div>
        </div>
      `;

      const stationIcon = L.divIcon({
        className: 'minimal-station-marker',
        html: markerHtml,
        iconSize: [60, 34],
        iconAnchor: [30, 32],
      });

      const marker = L.marker([st.lat, st.lng], { icon: stationIcon });

      marker.on('click', () => {
        onSelectStation(st);
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [stations, selectedStation, onSelectStation]);

  // Update Route Polyline on OpenStreetMap
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current.getContainer()) return;

    if (routeLayerRef.current) {
      if (mapInstanceRef.current.hasLayer(routeLayerRef.current)) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
      }
      routeLayerRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 0) {
      const line = L.polyline(activeRoute.coordinates, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '6, 8',
        className: 'route-animated-dash',
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = line;

      try {
        mapInstanceRef.current.fitBounds(line.getBounds(), {
          padding: [60, 60],
          maxZoom: 15,
          animate: false,
        });
      } catch {
        // Safe fallback if bounds calculation is interrupted
      }
    }
  }, [activeRoute]);

  // Center map on selected station if no active route
  useEffect(() => {
    if (selectedStation && mapInstanceRef.current && mapInstanceRef.current.getContainer() && !activeRoute) {
      try {
        mapInstanceRef.current.setView([selectedStation.lat, selectedStation.lng], 14, {
          animate: false,
        });
      } catch {
        // Safe fallback
      }
    }
  }, [selectedStation, activeRoute]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden">
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Modern Minimalist Floating Controls (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Zoom controls */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            title="بزرگ‌نمایی"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-[1px] bg-slate-800" />
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            title="کوچک‌نمایی"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Center on User */}
        <button
          onClick={onCenterUser}
          className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg text-slate-300 hover:text-blue-400 hover:bg-slate-800/80 transition active:scale-95"
          title="موقعیت فعلی من"
        >
          <Navigation className="w-4 h-4 rotate-45" />
        </button>

        {/* Toggle OSM Style (Standard vs Humanitarian) */}
        <button
          onClick={() => setOsmLayer((prev) => (prev === 'osm-standard' ? 'osm-hot' : 'osm-standard'))}
          className="p-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition"
          title={osmLayer === 'osm-standard' ? 'تغییر به لایه شهری تفصیلی OpenStreetMap' : 'تغییر به نقشه استاندارد OpenStreetMap'}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Clean Subtle Status Key (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 px-3 py-1.5 rounded-full text-[11px] text-slate-300 shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>خلوت</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>متوسط</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>شلوغ</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <span>⚡</span>
          <span>پرداخت آنلاین</span>
        </span>
      </div>

      {/* OpenStreetMap Attribution Badge (Bottom Right) */}
      <div className="absolute bottom-1 right-2 z-10 text-[10px] text-slate-500 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded shadow-sm backdrop-blur-xs">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-slate-700 dark:hover:text-slate-300">OpenStreetMap</a> · Leaflet
      </div>
    </div>
  );
};
