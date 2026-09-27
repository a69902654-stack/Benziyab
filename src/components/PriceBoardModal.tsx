import React, { useState } from 'react';
import { X, DollarSign, Calculator, AlertCircle, Fuel, Check, Info } from 'lucide-react';
import { OFFICIAL_FUEL_PRICES } from '../data/fuelPrices';
import { FuelType } from '../types/station';

interface PriceBoardModalProps {
  onClose: () => void;
}

export const PriceBoardModal: React.FC<PriceBoardModalProps> = ({ onClose }) => {
  const [tankSize, setTankSize] = useState<number>(50);
  const [selectedCalcType, setSelectedCalcType] = useState<FuelType>('quota');
  const [quotaLiters, setQuotaLiters] = useState<number>(30);

  // Calculation
  const pricePerLiter = OFFICIAL_FUEL_PRICES[selectedCalcType]?.priceToman || 1500;
  let estimatedTotal = 0;

  if (selectedCalcType === 'quota') {
    const quotaPortion = Math.min(tankSize, quotaLiters) * 1500;
    const remainingLiters = Math.max(0, tankSize - quotaLiters);
    const freePortion = remainingLiters * 3000;
    estimatedTotal = quotaPortion + freePortion;
  } else {
    estimatedTotal = tankSize * pricePerLiter;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right text-slate-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">تابلو نرخ رسمی و لحظه‌ای سوخت کشور</h2>
              <span className="text-[11px] text-slate-400">آخرین به‌روزرسانی سامانه هوشمند سوخت</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Fuel cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(OFFICIAL_FUEL_PRICES).map((item) => (
              <div
                key={item.type}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                    {item.status === 'special' ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        پریمیوم
                      </span>
                    ) : item.status === 'limited' ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        محدود
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        سراسری
                      </span>
                    )}
                  </div>
                  <div className="text-base font-bold text-amber-400 font-mono my-1">
                    {item.priceToman.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-sans text-slate-400">تومان / {item.unit}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{item.description}</p>
                </div>

                {item.quotaPerMonth && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>سهمیه مجاز:</span>
                    <span className="font-semibold text-slate-300">{item.quotaPerMonth}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Calculator Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-200">
                محاسبه‌گر هزینه باک و باقیمانده سهمیه
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  ظرفیت باک خودرو (لیتر):
                </label>
                <div className="flex items-center gap-2">
                  {[40, 50, 60, 70].map((liters) => (
                    <button
                      key={liters}
                      onClick={() => setTankSize(liters)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                        tankSize === liters
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {liters}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  نوع سوخت مورد نظر:
                </label>
                <select
                  value={selectedCalcType}
                  onChange={(e) => setSelectedCalcType(e.target.value as FuelType)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-1.5 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="quota">ترکیبی سهمیه‌ای (۱,۵۰۰) + آزاد (۳,۰۰۰)</option>
                  <option value="regular">تماماً بنزین آزاد (۳,۰۰۰ تومان)</option>
                  <option value="super">بنزین سوپر داخلی (۳,۵۰۰ تومان)</option>
                  <option value="super_import">بنزین سوپر وارداتی (۷۵,۰۰۰ تومان)</option>
                </select>
              </div>
            </div>

            {selectedCalcType === 'quota' && (
              <div className="text-xs">
                <label className="text-[11px] text-slate-400 block mb-1">
                  میزان سهمیه ۱۵۰۰ تومانی باقیمانده در کارت سوخت: {quotaLiters} لیتر
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={quotaLiters}
                  onChange={(e) => setQuotaLiters(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300">هزینه تخمینی پر کردن باک {tankSize} لیتری:</span>
              <span className="font-mono text-base font-bold text-amber-400">
                {estimatedTotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>

          {/* Useful notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-blue-950/20 border border-blue-800/30 text-xs text-blue-300">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              توجه: بر اساس بخشنامه وزارت نفت، اعتبار سهمیه کارت‌های شخصی حداکثر تا ۹ ماه (۳۶۰ لیتر)
              ذخیره شده و مازاد آن نیاز به استفاده از کارت آزاد جایگاه خواهد داشت.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
