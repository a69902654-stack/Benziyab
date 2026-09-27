import React from 'react';
import { FuelStation } from '../types/station';
import { Navigation, Zap } from 'lucide-react';

interface StationCardProps {
  station: FuelStation;
  isSelected: boolean;
  onSelect: (station: FuelStation) => void;
  onStartRoute: (station: FuelStation) => void;
  onOpenFastPay: (station: FuelStation) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected,
  onSelect,
  onStartRoute,
  onOpenFastPay,
}) => {
  // Dot color for crowd
  const dotColor =
    station.crowdLevel === 'low'
      ? 'bg-emerald-400'
      : station.crowdLevel === 'medium'
      ? 'bg-amber-400'
      : 'bg-rose-500';

  const crowdText =
    station.crowdLevel === 'low'
      ? 'خلوت'
      : station.crowdLevel === 'medium'
      ? 'معمولی'
      : 'شلوغ';

  return (
    <div
      onClick={() => onSelect(station)}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right ${
        isSelected
          ? 'bg-slate-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top: Name, Status */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-mono">{station.code}</span>
            <h3 className="text-xs sm:text-sm font-bold text-white truncate">{station.name}</h3>
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{station.address}</p>
        </div>

        {/* Status dot & wait time */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
          <span className="text-slate-300 font-medium">{station.waitTimeMinutes} د معطلی</span>
        </div>
      </div>

      {/* Distance & driving time */}
      <div className="flex items-center gap-2 text-xs text-slate-300 my-2 font-medium">
        <span className="text-white font-mono">{station.travelDistanceKm} کیلومتر</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400">~{station.travelTimeMinutes} دقیقه رانندگی</span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400">{station.activeNozzles} از {station.totalNozzles} نازل</span>
      </div>

      {/* Fuel prices overview */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate py-1 border-t border-slate-800/60">
        <span>آزاد ۳,۰۰۰</span>
        <span>·</span>
        <span>سهمیه‌ای ۱,۵۰۰</span>
        {station.fuels.super?.available && (
          <>
            <span>·</span>
            <span className="text-amber-400">سوپر ۳,۵۰۰</span>
          </>
        )}
        {station.fuels.cng?.available && (
          <>
            <span>·</span>
            <span className="text-blue-400">CNG ۶۵۰</span>
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <div className="text-[11px]">
          {station.hasOnlinePayment ? (
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Zap className="w-3 h-3 fill-emerald-400" />
              <span>لاین پرداخت آنلاین فعال</span>
            </span>
          ) : (
            <span className="text-slate-500">پرداخت در مکان</span>
          )}
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {station.hasOnlinePayment && (
            <button
              onClick={() => onOpenFastPay(station)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition"
            >
              پرداخت سریع
            </button>
          )}

          <button
            onClick={() => onStartRoute(station)}
            className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition flex items-center gap-1"
          >
            <span>مسیر</span>
            <Navigation className="w-3 h-3 rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};
