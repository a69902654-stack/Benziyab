import React, { useState } from 'react';
import { FuelStation, CrowdLevel, UserReport } from '../types/station';
import { X, MessageSquarePlus, Check, AlertTriangle, Users } from 'lucide-react';

interface StationReportModalProps {
  station: FuelStation;
  onClose: () => void;
  onSubmitReport: (stationId: string, newReport: UserReport, crowdLevel: CrowdLevel) => void;
}

export const StationReportModal: React.FC<StationReportModalProps> = ({
  station,
  onClose,
  onSubmitReport,
}) => {
  const [crowd, setCrowd] = useState<CrowdLevel>(station.crowdLevel);
  const [superAvailable, setSuperAvailable] = useState<boolean>(
    Boolean(station.fuels.super?.available)
  );
  const [reportText, setReportText] = useState<string>('');
  const [userName, setUserName] = useState<string>('راننده همیار');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const report: UserReport = {
      id: `rep-${Date.now()}`,
      user: userName.trim() || 'کاربر بنزین‌یاب',
      time: 'هم‌اکنون',
      text:
        reportText.trim() ||
        (crowd === 'low'
          ? 'صف کاملاً خلوته و تردد روان است.'
          : crowd === 'high'
          ? 'صف تا بیرون جایگاه کشیده شده.'
          : 'وضعیت صف عادی است.'),
      crowd: crowd,
      superFuelAvailable: superAvailable,
      upvotes: 1,
    };

    onSubmitReport(station.id, report, crowd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">ثبت گزارش لحظه‌ای وضعیت جایگاه</h2>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Crowd selector */}
          <div>
            <label className="font-bold text-slate-200 block mb-2">
              وضعیت فعلی شلوغی و صف پمپ‌ها:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCrowd('low')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                  crowd === 'low'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                خلوت (زیر ۳ دقیقه)
              </button>
              <button
                type="button"
                onClick={() => setCrowd('medium')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                  crowd === 'medium'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                معمولی (۳ تا ۷ دقیقه)
              </button>
              <button
                type="button"
                onClick={() => setCrowd('high')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                  crowd === 'high'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                شلوغ (۸ تا ۱۵ دقیقه)
              </button>
              <button
                type="button"
                onClick={() => setCrowd('extreme')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                  crowd === 'extreme'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                صف بسیار سنگین
              </button>
            </div>
          </div>

          {/* Super Fuel Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700">
            <span>آیا بنزین سوپر در این جایگاه موجود است؟</span>
            <button
              type="button"
              onClick={() => setSuperAvailable(!superAvailable)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                superAvailable
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {superAvailable ? 'بله، موجود است' : 'خیر، تمام شده'}
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-200 block mb-1">
              توضیحات تکمیلی (اختیاری):
            </label>
            <textarea
              rows={3}
              placeholder="مثلا: کارت‌خوان نازل ۴ قطع است، لاین پرداخت هوشمند خلوت است..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* User Name */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">نام شما جهت نمایش:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition active:scale-98"
          >
            ثبت و به‌روزرسانی وضعیت جایگاه
          </button>
        </form>
      </div>
    </div>
  );
};
