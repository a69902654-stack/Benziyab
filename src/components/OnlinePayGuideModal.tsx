import React from 'react';
import { X, Zap, CreditCard, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface OnlinePayGuideModalProps {
  onClose: () => void;
}

export const OnlinePayGuideModal: React.FC<OnlinePayGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right text-slate-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                راهنمای سیستم پرداخت آنلاین و مقایسه با پرداخت در مکان
              </h2>
              <span className="text-[11px] text-slate-400">راهکار کاهش زمان انتظار در صف پمپ بنزین</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Online Fast Lane */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>پرداخت آنلاین (لاین سبز)</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                  زمان انتظار: ~۲ دقیقه
                </span>
              </div>

              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>انتخاب لیتراژ و پرداخت با کارت شتاب پیش از رسیدن</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>رزرو نازل اختصاصی تا ۱۵ دقیقه</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>ورود مستقیم به لاین سبز بدون توقف در صف عمومی</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>اسکن بارکد هوشمند روی پمپ و سوخت‌گیری فوری</span>
                </li>
              </ul>
            </div>

            {/* Standard On-Site */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-bold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>پرداخت در مکان (روش عادی)</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300">
                  زمان انتظار: ۱۰ تا ۲۵ دقیقه
                </span>
              </div>

              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>ایستادن در انتهای صف خودروهای ورودی جایگاه</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>قرار دادن کارت سوخت شخصی هوشمند در نازل</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>وارد کردن رمز کارت سوخت و انجام سوخت‌گیری</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>پرداخت با کارتخوان سیار پوز به متصدی یا نقدی</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 4-step infographic */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-200 text-xs">
              چگونه از قابلیت پرداخت آنلاین استفاده کنیم؟
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-1.5">
                  ۱
                </div>
                <div className="font-bold text-white mb-0.5">انتخاب جایگاه</div>
                <div className="text-slate-400 text-[10px]">
                  جایگاه‌های دارای نشان ⚡ لاین سبز متصل هستند
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-1.5">
                  ۲
                </div>
                <div className="font-bold text-white mb-0.5">پرداخت لیتراژ</div>
                <div className="text-slate-400 text-[10px]">
                  تعیین بنزین آزاد یا سهمیه‌ای و پرداخت شتاب
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-1.5">
                  ۳
                </div>
                <div className="font-bold text-white mb-0.5">دریافت QR کد</div>
                <div className="text-slate-400 text-[10px]">
                  شناسه نازل رزرو شده با ۱۵ دقیقه مهلت
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mx-auto mb-1.5">
                  ۴
                </div>
                <div className="font-bold text-white mb-0.5">سوخت‌گیری فوری</div>
                <div className="text-slate-400 text-[10px]">
                  اسکن بارکد در پمپ لاین سبز بدون توقف در صف
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  );
};
