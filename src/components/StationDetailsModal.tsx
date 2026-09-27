import React from 'react';
import { FuelStation, RouteOption } from '../types/station';
import {
  X,
  Navigation,
  Clock,
  Fuel,
  Zap,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  MessageSquarePlus,
  Phone,
} from 'lucide-react';

interface StationDetailsModalProps {
  station: FuelStation | null;
  onClose: () => void;
  onStartRoute: (station: FuelStation, routeOptionId?: string) => void;
  onOpenFastPay: (station: FuelStation) => void;
  onOpenReportModal: (station: FuelStation) => void;
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRouteId: (id: string) => void;
}

export const StationDetailsModal: React.FC<StationDetailsModalProps> = ({
  station,
  onClose,
  onStartRoute,
  onOpenFastPay,
  onOpenReportModal,
  routes,
  selectedRouteId,
  onSelectRouteId,
}) => {
  if (!station) return null;

  const dotColor =
    station.crowdLevel === 'low'
      ? 'bg-emerald-400'
      : station.crowdLevel === 'medium'
      ? 'bg-amber-400'
      : 'bg-rose-500';

  const crowdTitle =
    station.crowdLevel === 'low'
      ? 'خلوت (بدون معطلی صف)'
      : station.crowdLevel === 'medium'
      ? 'معمولی (تردد روان)'
      : 'شلوغ و دارای صف';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                {station.code}
              </span>
              <h2 className="text-base font-bold text-white truncate">{station.name}</h2>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
              <span>{station.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">فاصله تا شما</span>
              <span className="text-sm font-bold text-white font-mono">
                {station.travelDistanceKm} کیلومتر
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">زمان تخمینی رانندگی</span>
              <span className="text-sm font-bold text-blue-400 font-mono">
                ~{station.travelTimeMinutes} دقیقه
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 block mb-0.5">معطلی در صف</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {station.waitTimeMinutes} دقیقه
              </span>
            </div>
          </div>

          {/* Crowd status bar */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
              <span className="font-semibold text-slate-200">{crowdTitle}</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {station.activeNozzles} نازل فعال از {station.totalNozzles}
            </span>
          </div>

          {/* Fuel prices list */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 block">نرخ لحظه‌ای سوخت در این جایگاه:</span>
            <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/70 bg-slate-950/40">
              <div className="flex items-center justify-between p-2.5">
                <span className="text-slate-200">بنزین سهمیه‌ای (نرخ اول)</span>
                <span className="font-mono font-bold text-slate-300">۱,۵۰۰ تومان / لیتر</span>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-slate-200">بنزین آزاد (نرخ دوم)</span>
                <span className="font-mono font-bold text-slate-300">۳,۰۰۰ تومان / لیتر</span>
              </div>
              {station.fuels.super && (
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-slate-200">بنزین سوپر داخلی</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">۳,۵۰۰ تومان</span>
                    {station.fuels.super.available ? (
                      <span className="text-[10px] text-emerald-400 font-semibold">موجود ✓</span>
                    ) : (
                      <span className="text-[10px] text-rose-400">اتمام موجودی</span>
                    )}
                  </div>
                </div>
              )}
              {station.fuels.super_import && (
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-slate-200">سوپر وارداتی پریمیوم</span>
                  <span className="font-mono font-bold text-purple-400">۷۵,۰۰۰ تومان / لیتر</span>
                </div>
              )}
              {station.fuels.cng && (
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-slate-200">گاز طبیعی فشرده (CNG)</span>
                  <span className="font-mono font-bold text-blue-400">۶۵۰ تومان / متر مکعب</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment modalities (Required by user) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">نحوه پرداخت در این جایگاه:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Online Pay */}
              <div
                className={`p-3 rounded-xl border ${
                  station.hasOnlinePayment
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>پرداخت آنلاین سریع</span>
                  </span>
                  {station.hasOnlinePayment && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                      فعال
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {station.hasOnlinePayment
                    ? 'رزرو نازل اختصاصی و ورود به لاین سبز بدون توقف در صف.'
                    : 'سامانه پرداخت آنلاین در این جایگاه فعال نیست.'}
                </p>
                {station.hasOnlinePayment && (
                  <button
                    onClick={() => onOpenFastPay(station)}
                    className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    رزرو و پرداخت آنلاین
                  </button>
                )}
              </div>

              {/* On-site Pay */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="font-bold text-slate-200 flex items-center gap-1 mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>پرداخت در مکان (روش عادی)</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  پرداخت مستقیم پای پمپ با کارت‌خوان یا کارت سوخت هوشمند شخصی پس از سوخت‌گیری.
                </p>
              </div>
            </div>
          </div>

          {/* Route Options */}
          {routes.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 block">انتخاب مسیر حرکت:</span>
              <div className="grid grid-cols-3 gap-2">
                {routes.map((rt) => (
                  <div
                    key={rt.id}
                    onClick={() => onSelectRouteId(rt.id)}
                    className={`p-2 rounded-xl border cursor-pointer text-center transition ${
                      selectedRouteId === rt.id
                        ? 'bg-blue-950/50 border-blue-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-[11px]">{rt.name.split(' ')[0]}</div>
                    <div className="text-blue-400 font-mono text-xs">{rt.durationMin} د</div>
                    <div className="text-[10px] text-slate-500">{rt.distanceKm} km</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          {station.phone && (
            <a
              href={`tel:${station.phone}`}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="تماس"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => onOpenReportModal(station)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition whitespace-nowrap"
          >
            ثبت گزارش صف
          </button>

          <button
            onClick={() => onStartRoute(station, selectedRouteId)}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-4 h-4 rotate-45" />
            <span>شروع ناوبری به این جایگاه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
