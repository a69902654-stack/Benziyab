import React, { useState } from 'react';
import { FuelStation, FuelType, DigitalFuelPass } from '../types/station';
import {
  X,
  Zap,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  CreditCard,
  Wallet,
  Clock,
  Car,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface OnlinePaymentModalProps {
  station: FuelStation;
  onClose: () => void;
  onPassGenerated: (pass: DigitalFuelPass) => void;
}

export const OnlinePaymentModal: React.FC<OnlinePaymentModalProps> = ({
  station,
  onClose,
  onPassGenerated,
}) => {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>('regular');
  const [liters, setLiters] = useState<number>(20);
  const [customLiters, setCustomLiters] = useState<string>('');
  const [plateNumber, setPlateNumber] = useState<string>('۲۴ ب ۷۱۸ ایران ۴۴');
  const [paymentMethod, setPaymentMethod] = useState<'online_gateway' | 'wallet'>('online_gateway');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activePass, setActivePass] = useState<DigitalFuelPass | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Available fuel rates
  const fuelRates: Record<FuelType, { name: string; price: number; desc: string }> = {
    quota: { name: 'بنزین سهمیه‌ای (کارت سوخت)', price: 1500, desc: 'استفاده از ۶۰ لیتر ماهیانه' },
    regular: { name: 'بنزین آزاد (نرخ دوم)', price: 3000, desc: 'کارت آزاد یا سهمیه اعتباری' },
    super: { name: 'بنزین سوپر داخلی', price: 3500, desc: 'اکتان بالا برای موتورهای توربو' },
    super_import: { name: 'سوپر وارداتی پریمیوم', price: 75000, desc: 'اکتان ۹۸ بدون سرب' },
    cng: { name: 'گاز فشرده CNG', price: 650, desc: 'متر مکعب فشرده' },
    diesel: { name: 'گازوئیل یورو ۵', price: 600, desc: 'خودروهای دیزلی' },
  };

  const activeFuelInfo = fuelRates[selectedFuel];
  const totalAmount = (customLiters ? Number(customLiters) : liters) * activeFuelInfo.price;

  const handlePayAndReserve = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generatedPass: DigitalFuelPass = {
        passId: `FP-${Math.floor(100000 + Math.random() * 900000)}`,
        stationId: station.id,
        stationName: station.name,
        fuelType: selectedFuel,
        fuelName: activeFuelInfo.name,
        liters: customLiters ? Number(customLiters) : liters,
        totalPriceToman: totalAmount,
        paymentMethod: paymentMethod,
        createdAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        expiresAt: '۱۵ دقیقه دیگر',
        qrToken: `SOKHT-SMART-${station.code}-${Date.now().toString().slice(-6)}`,
        fastLaneNozzleId: `لاین سبز ۳ - نازل شماره ${Math.floor(Math.random() * 4) + 1}`,
        status: 'valid',
      };

      setIsProcessing(false);
      setActivePass(generatedPass);
      onPassGenerated(generatedPass);
    }, 1200);
  };

  const handleCopyToken = () => {
    if (activePass) {
      navigator.clipboard?.writeText(activePass.qrToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>رزرو آنلاین سوخت و پرداخت سریع</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                  لاین سبز
                </span>
              </h2>
              <span className="text-[11px] text-slate-400">{station.name}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh] space-y-4">
          {!activePass ? (
            <>
              {/* Feature info callout */}
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="leading-relaxed">
                  با رزرو آنلاین، نازل اختصاصی تا ۱۵ دقیقه برای شما رزرو شده و بدون انتظار در صف با
                  اسکن بارکد در پمپ، سوخت‌گیری بلافاصله آغاز می‌شود.
                </p>
              </div>

              {/* Step 1: Fuel Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  ۱. انتخاب نوع سوخت:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Quota */}
                  <div
                    onClick={() => setSelectedFuel('quota')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedFuel === 'quota'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1">بنزین سهمیه‌ای</div>
                    <div className="text-amber-400 text-xs font-mono font-bold">۱,۵۰۰ تومان</div>
                    <div className="text-[10px] text-slate-400 mt-1">نرخ اول دولتی</div>
                  </div>

                  {/* Regular */}
                  <div
                    onClick={() => setSelectedFuel('regular')}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      selectedFuel === 'regular'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold mb-1">بنزین آزاد</div>
                    <div className="text-amber-400 text-xs font-mono font-bold">۳,۰۰۰ تومان</div>
                    <div className="text-[10px] text-slate-400 mt-1">نرخ دوم آزاد</div>
                  </div>

                  {/* Super */}
                  {station.fuels.super?.available && (
                    <div
                      onClick={() => setSelectedFuel('super')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        selectedFuel === 'super'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">بنزین سوپر داخلی</div>
                      <div className="text-amber-400 text-xs font-mono font-bold">۳,۵۰۰ تومان</div>
                      <div className="text-[10px] text-emerald-400 mt-1">موجود در جایگاه ✓</div>
                    </div>
                  )}

                  {/* Super Imported */}
                  {station.fuels.super_import?.available && (
                    <div
                      onClick={() => setSelectedFuel('super_import')}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        selectedFuel === 'super_import'
                          ? 'bg-emerald-950/40 border-emerald-500 text-white'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">سوپر وارداتی پریمیوم</div>
                      <div className="text-amber-400 text-xs font-mono font-bold">۷۵,۰۰۰ تومان</div>
                      <div className="text-[10px] text-emerald-400 mt-1">اکتان ۹۸</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Liters Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  ۲. مقدار سوخت (لیتر):
                </label>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {[10, 20, 30, 40, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setLiters(num);
                        setCustomLiters('');
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        liters === num && !customLiters
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {num} لیتر
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">یا مقدار دلخواه:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="مثلا: ۲۵"
                    value={customLiters}
                    onChange={(e) => setCustomLiters(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 text-center"
                  />
                  <span className="text-[11px] text-slate-400">لیتر</span>
                </div>
              </div>

              {/* Step 3: Vehicle plate */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  ۳. پلاک خودرو (جهت شناسایی در دوربین لاین سبز):
                </label>
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl p-2.5">
                  <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="bg-transparent text-xs text-white font-mono flex-1 focus:outline-none text-center"
                  />
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  ۴. روش پرداخت آنلاین:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setPaymentMethod('online_gateway')}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2 ${
                      paymentMethod === 'online_gateway'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">درگاه اینترنتی شتاب</div>
                      <div className="text-[10px] text-slate-400">سداد / به‌پرداخت ملت</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-2 ${
                      paymentMethod === 'wallet'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">کیف‌پول سوخت</div>
                      <div className="text-[10px] text-emerald-400 font-mono">موجودی: ۲۵۰,۰۰۰ ت</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>نوع و حجم سوخت:</span>
                  <span className="font-semibold text-slate-200">
                    {customLiters || liters} لیتر {activeFuelInfo.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>نرخ هر لیتر:</span>
                  <span className="font-mono text-slate-200">
                    {activeFuelInfo.price.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>تخفیف هوشمند نوبت‌دهی:</span>
                  <span className="text-emerald-400">رایگان (۰ تومان)</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-sm font-bold text-white">
                  <span>مبلغ کل پرداخت:</span>
                  <span className="text-emerald-400 font-mono text-base">
                    {totalAmount.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayAndReserve}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال اتصال به درگاه شاپرک و رزرو نازل...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>پرداخت آنلاین {totalAmount.toLocaleString('fa-IR')} تومان و دریافت بارکد</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* SUCCESS PASS DISPLAY */
            <div className="text-center space-y-4 py-2 animate-scaleUp">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">پرداخت و نوبت‌دهی آنلاین با موفقیت انجام شد</h3>
                <p className="text-xs text-slate-400 mt-1">
                  کد دیجیتال و نازل اختصاصی شما برای مراجعه صادر شد.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-inner space-y-3 text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                  <span className="text-slate-400">شناسه نوبت:</span>
                  <span className="font-mono font-bold text-amber-400">{activePass.passId}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">محل سوخت‌گیری:</span>
                  <span className="font-bold text-emerald-400">{activePass.fastLaneNozzleId}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">سوخت و حجم:</span>
                  <span className="font-semibold text-slate-200">
                    {activePass.liters} لیتر {activePass.fuelName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">مبلغ پرداخت شده:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {activePass.totalPriceToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                {/* QR Code Simulation */}
                <div className="my-3 p-3 bg-white rounded-xl flex flex-col items-center justify-center shadow-lg">
                  <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex items-center justify-center relative">
                    <QrCode className="w-32 h-32 text-white" />
                  </div>
                  <span className="text-[10px] text-slate-800 font-mono mt-1.5 font-bold">
                    {activePass.qrToken}
                  </span>
                </div>

                <div className="text-[11px] text-center text-slate-400 bg-slate-900 p-2 rounded-xl flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>اعتبار تا {activePass.expiresAt} (لاین ویژه شما باز است)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToken}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'کپی شد!' : 'کپی شناسه بارکد'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                >
                  تأیید و بازگشت به نقشه
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
