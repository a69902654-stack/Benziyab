import React, { useState, useEffect, useMemo } from 'react';
import { FuelStation, RouteOption, DigitalFuelPass, UserReport, CrowdLevel } from './types/station';
import { INITIAL_STATIONS, CITIES } from './data/mockStations';
import { calculateDistanceKm, calculateRoutes } from './services/routingService';
import { Header } from './components/Header';
import { MapComponent } from './components/MapComponent';
import { FilterBar, FilterCategory, SortOption } from './components/FilterBar';
import { StationCard } from './components/StationCard';
import { StationDetailsModal } from './components/StationDetailsModal';
import { OnlinePaymentModal } from './components/OnlinePaymentModal';
import { NavigationBanner } from './components/NavigationBanner';
import { PriceBoardModal } from './components/PriceBoardModal';
import { OnlinePayGuideModal } from './components/OnlinePayGuideModal';
import { StationReportModal } from './components/StationReportModal';
import { Zap, Navigation, Fuel, AlertCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function App() {
  // City & Location State (Default: Khorramabad, Lorestan)
  const [currentCityId, setCurrentCityId] = useState<string>('khorramabad');
  const [userLocation, setUserLocation] = useState<[number, number]>([33.4878, 48.3558]);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Stations State
  const [stations, setStations] = useState<FuelStation[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Routing & Navigation State
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('opt-highway');
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Modals State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [activeFastPayStation, setActiveFastPayStation] = useState<FuelStation | null>(null);
  const [activeReportStation, setActiveReportStation] = useState<FuelStation | null>(null);
  const [isPriceBoardOpen, setIsPriceBoardOpen] = useState<boolean>(false);
  const [isOnlinePayGuideOpen, setIsOnlinePayGuideOpen] = useState<boolean>(false);
  const [userPasses, setUserPasses] = useState<DigitalFuelPass[]>([]);

  // Update stations with dynamic distance and travel time relative to current userLocation
  const stationsWithDistance = useMemo(() => {
    return stations.map((st) => {
      const dist = calculateDistanceKm(userLocation[0], userLocation[1], st.lat, st.lng);
      const drivingTime = Math.max(2, Math.round((dist * 1.35 / 35) * 60) + 1);

      return {
        ...st,
        travelDistanceKm: dist,
        travelTimeMinutes: drivingTime,
      };
    });
  }, [stations, userLocation]);

  // Recalculate routes whenever selected station or user location changes
  useEffect(() => {
    if (selectedStation) {
      const generated = calculateRoutes(userLocation, [selectedStation.lat, selectedStation.lng], selectedStation.name);
      setRoutes(generated);
      const matched = generated.find((r) => r.id === selectedRouteId) || generated[0];
      setActiveRoute(matched);
    } else {
      setRoutes([]);
      setActiveRoute(null);
      setIsNavigating(false);
    }
  }, [selectedStation, userLocation]);

  const handleSelectRouteId = (routeId: string) => {
    setSelectedRouteId(routeId);
    const chosen = routes.find((r) => r.id === routeId) || routes[0];
    setActiveRoute(chosen);
  };

  // Filter & Sort stations
  const filteredStations = useMemo(() => {
    let result = [...stationsWithDistance];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (st) =>
          st.name.toLowerCase().includes(q) ||
          st.code.toLowerCase().includes(q) ||
          st.address.toLowerCase().includes(q) ||
          st.zone.toLowerCase().includes(q)
      );
    }

    if (selectedCategory === 'online_pay') {
      result = result.filter((st) => st.hasOnlinePayment);
    } else if (selectedCategory === 'low_crowd') {
      result = result.filter((st) => st.crowdLevel === 'low');
    } else if (selectedCategory === 'super') {
      result = result.filter((st) => st.fuels.super?.available || st.fuels.super_import?.available);
    } else if (selectedCategory === 'cng') {
      result = result.filter((st) => st.fuels.cng?.available);
    }

    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.travelDistanceKm || 0) - (b.travelDistanceKm || 0);
      }
      if (sortBy === 'time') {
        return (a.travelTimeMinutes || 0) - (b.travelTimeMinutes || 0);
      }
      if (sortBy === 'crowd') {
        return a.waitTimeMinutes - b.waitTimeMinutes;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return result;
  }, [stationsWithDistance, searchQuery, selectedCategory, sortBy]);

  // City Selector Handler
  const handleSelectCity = (cityId: string) => {
    setCurrentCityId(cityId);
    const city = CITIES.find((c) => c.id === cityId);
    if (city) {
      setUserLocation(city.center);
      setSelectedStation(null);
      setActiveRoute(null);
      setIsNavigating(false);
    }
  };

  // GPS Locate Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      () => {
        // Fallback to current position
        setUserLocation((prev) => [prev[0] + 0.001, prev[1] + 0.001]);
        setIsLocating(false);
      },
      { timeout: 6000 }
    );
  };

  // Actions
  const handleSelectStation = (station: FuelStation) => {
    setSelectedStation(station);
  };

  const handleStartRoute = (station: FuelStation, routeId?: string) => {
    setSelectedStation(station);
    if (routeId) {
      handleSelectRouteId(routeId);
    }
    setIsDetailsModalOpen(false);
    setIsNavigating(true);
    setActiveView('map');
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setActiveRoute(null);
  };

  const handlePassGenerated = (pass: DigitalFuelPass) => {
    setUserPasses((prev) => [pass, ...prev]);
  };

  const handleSubmitUserReport = (stationId: string, report: UserReport, crowdLevel: CrowdLevel) => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id === stationId) {
          const waitTime =
            crowdLevel === 'low' ? 2 : crowdLevel === 'medium' ? 6 : crowdLevel === 'high' ? 12 : 20;

          return {
            ...st,
            crowdLevel: crowdLevel,
            waitTimeMinutes: waitTime,
            reports: [report, ...st.reports],
          };
        }
        return st;
      })
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0f19] font-sans text-slate-100" dir="rtl">
      {/* Sleek Minimal Header */}
      <Header
        currentCityId={currentCityId}
        onSelectCity={handleSelectCity}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        onOpenPriceBoard={() => setIsPriceBoardOpen(true)}
        onOpenOnlinePayGuide={() => setIsOnlinePayGuideOpen(true)}
        activeView={activeView}
        onToggleView={setActiveView}
        activeNavStationName={isNavigating ? selectedStation?.name : undefined}
        onStopNavigation={handleStopNavigation}
      />

      {/* Clean Filter & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalStationsCount={filteredStations.length}
      />

      {/* Main Map + Sidebar Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Sidebar / List View */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-slate-950/95 backdrop-blur-md border-l border-slate-800/80 flex flex-col z-20 transition-all duration-300 ${
            activeView === 'list'
              ? 'flex'
              : 'hidden md:flex'
          } ${isSidebarOpen ? 'translate-x-0' : 'md:translate-x-full md:w-0 md:opacity-0 pointer-events-none'}`}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>نزدیک‌ترین جایگاه‌ها ({filteredStations.length})</span>
            {userPasses.length > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {userPasses.length} نوبت فعال
              </span>
            )}
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredStations.length === 0 ? (
              <div className="text-center py-16 px-4 text-slate-500 space-y-2">
                <AlertCircle className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs">جایگاهی با این مشخصات یافت نشد.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-amber-400 hover:underline mt-2"
                >
                  نمایش همه جایگاه‌ها
                </button>
              </div>
            ) : (
              filteredStations.map((st) => (
                <StationCard
                  key={st.id}
                  station={st}
                  isSelected={selectedStation?.id === st.id}
                  onSelect={handleSelectStation}
                  onStartRoute={(station) => handleStartRoute(station)}
                  onOpenFastPay={(station) => setActiveFastPayStation(station)}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar Collapse Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:flex absolute top-3 right-3 z-30 p-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-slate-400 hover:text-white shadow-lg transition"
          title={isSidebarOpen ? 'بستن پنل کناری' : 'نمایش پنل کناری'}
        >
          {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Map View */}
        <div className={`flex-1 h-full relative ${activeView === 'list' ? 'hidden md:block' : 'block'}`}>
          <MapComponent
            userLocation={userLocation}
            stations={filteredStations}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            activeRoute={activeRoute}
            onCenterUser={() => setUserLocation((prev) => [prev[0], prev[1]])}
          />

          {/* Navigation banner */}
          {isNavigating && selectedStation && activeRoute && (
            <NavigationBanner
              station={selectedStation}
              route={activeRoute}
              onStop={handleStopNavigation}
            />
          )}

          {/* Minimalist Floating Card for Selected Station (Bottom of Map) */}
          {selectedStation && !isNavigating && (
            <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-[420px] z-20 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl animate-slideUp text-right">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">{selectedStation.code}</span>
                    <h3 className="text-sm font-bold text-white truncate">{selectedStation.name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{selectedStation.address}</p>
                </div>

                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-1 text-slate-500 hover:text-white rounded-lg transition"
                  title="بستن"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-2 text-xs my-2.5 text-slate-300">
                <span className="font-mono text-white font-bold">{selectedStation.travelDistanceKm} کیلومتر</span>
                <span className="text-slate-600">·</span>
                <span>~{selectedStation.travelTimeMinutes} دقیقه رانندگی</span>
                <span className="text-slate-600">·</span>
                <span
                  className={
                    selectedStation.crowdLevel === 'low'
                      ? 'text-emerald-400'
                      : selectedStation.crowdLevel === 'medium'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }
                >
                  معطلی: {selectedStation.waitTimeMinutes} دقیقه
                </span>
              </div>

              {/* Prices line */}
              <div className="text-[11px] text-slate-400 py-1.5 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span>آزاد ۳,۰۰۰</span>
                  <span className="mx-1.5 text-slate-600">·</span>
                  <span>سهمیه‌ای ۱,۵۰۰</span>
                  {selectedStation.fuels.super?.available && (
                    <>
                      <span className="mx-1.5 text-slate-600">·</span>
                      <span className="text-amber-400">سوپر ۳,۵۰۰</span>
                    </>
                  )}
                </div>

                {selectedStation.hasOnlinePayment ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                    <Zap className="w-3 h-3 fill-emerald-400" />
                    <span>پرداخت آنلاین</span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[10px]">پرداخت در مکان</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-1">
                <button
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                >
                  جزییات کامل
                </button>

                {selectedStation.hasOnlinePayment && (
                  <button
                    onClick={() => setActiveFastPayStation(selectedStation)}
                    className="py-2 px-3 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>پرداخت آنلاین</span>
                  </button>
                )}

                <button
                  onClick={() => handleStartRoute(selectedStation)}
                  className="py-2 px-4 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 rotate-45" />
                  <span>مسیریابی</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Station Detailed Info Modal */}
      {isDetailsModalOpen && selectedStation && (
        <StationDetailsModal
          station={selectedStation}
          onClose={() => setIsDetailsModalOpen(false)}
          onStartRoute={handleStartRoute}
          onOpenFastPay={(st) => {
            setIsDetailsModalOpen(false);
            setActiveFastPayStation(st);
          }}
          onOpenReportModal={(st) => setActiveReportStation(st)}
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRouteId={handleSelectRouteId}
        />
      )}

      {/* 2. Fast Online Payment Modal */}
      {activeFastPayStation && (
        <OnlinePaymentModal
          station={activeFastPayStation}
          onClose={() => setActiveFastPayStation(null)}
          onPassGenerated={handlePassGenerated}
        />
      )}

      {/* 3. Official Fuel Prices Board Modal */}
      {isPriceBoardOpen && <PriceBoardModal onClose={() => setIsPriceBoardOpen(false)} />}

      {/* 4. Online Payment vs On-Site Guide Modal */}
      {isOnlinePayGuideOpen && <OnlinePayGuideModal onClose={() => setIsOnlinePayGuideOpen(false)} />}

      {/* 5. Station Crowd Report Modal */}
      {activeReportStation && (
        <StationReportModal
          station={activeReportStation}
          onClose={() => setActiveReportStation(null)}
          onSubmitReport={handleSubmitUserReport}
        />
      )}
    </div>
  );
}
