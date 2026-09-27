import React from 'react';
import { Fuel, MapPin, DollarSign, LocateFixed, Compass, CreditCard } from 'lucide-react';
import { CITIES } from '../data/mockStations';

interface HeaderProps {
  currentCityId: string;
  onSelectCity: (cityId: string) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  onOpenPriceBoard: () => void;
  onOpenOnlinePayGuide: () => void;
  activeView: 'map' | 'list';
  onToggleView: (view: 'map' | 'list') => void;
  activeNavStationName?: string;
  onStopNavigation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCityId,
  onSelectCity,
  onLocateMe,
  isLocating,
  onOpenPriceBoard,
  onOpenOnlinePayGuide,
  activeView,
  onToggleView,
  activeNavStationName,
  onStopNavigation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Fuel className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-white">
            بنزین‌یاب
          </span>
        </div>

        {/* Center / Navigation */}
        <div className="flex items-center gap-2">
          {activeNavStationName ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
              <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">مسیر به:</span>
              <span className="font-semibold max-w-[130px] truncate">{activeNavStationName}</span>
              {onStopNavigation && (
                <button
                  onClick={onStopNavigation}
                  className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded transition"
                >
                  پایان
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenPriceBoard}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>نرخ لحظه‌ای</span>
              </button>

              <button
                onClick={onOpenOnlinePayGuide}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>پرداخت آنلاین</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle (mobile / tablet) */}
          <div className="flex md:hidden items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onToggleView('map')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                activeView === 'map' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              نقشه
            </button>
            <button
              onClick={() => onToggleView('list')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                activeView === 'list' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              لیست
            </button>
          </div>

          {/* City select */}
          <div className="relative">
            <select
              value={currentCityId}
              onChange={(e) => onSelectCity(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 pr-6 pl-2 focus:outline-none focus:border-slate-700 cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <MapPin className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* GPS button */}
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            title="موقعیت فعلی من"
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
