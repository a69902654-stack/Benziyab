import React, { useState, useEffect } from 'react';
import { RouteOption, FuelStation } from '../types/station';
import {
  Navigation,
  ArrowUp,
  CornerUpRight,
  CornerUpLeft,
  X,
  Volume2,
  VolumeX,
  Gauge,
  Clock,
  MapPin,
  Flag,
} from 'lucide-react';

interface NavigationBannerProps {
  station: FuelStation;
  route: RouteOption;
  onStop: () => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({ station, route, onStop }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(54);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [remainingDist, setRemainingDist] = useState<number>(route.distanceKm);

  // Simulate progress through turn instructions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < route.steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });

      // Fluctuate speed realistically
      setCurrentSpeed((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.min(85, Math.max(30, prev + delta));
      });

      // Reduce remaining distance
      setRemainingDist((prev) => Math.max(0.1, Number((prev - 0.2).toFixed(1))));
    }, 4500);

    return () => clearInterval(timer);
  }, [route]);

  const currentStep = route.steps[currentStepIndex] || route.steps[0];
  const isFinalStep = currentStepIndex >= route.steps.length - 1;

  return (
    <div className="absolute top-16 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-30 animate-slideDown">
      <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden text-right text-slate-100">
        {/* Main Instruction Bar */}
        <div className="p-3.5 bg-gradient-to-r from-blue-900/60 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-blue-500/30 shrink-0">
              {isFinalStep ? (
                <Flag className="w-5 h-5 text-slate-950" />
              ) : currentStepIndex % 2 === 0 ? (
                <CornerUpRight className="w-6 h-6 stroke-[3]" />
              ) : (
                <ArrowUp className="w-6 h-6 stroke-[3]" />
              )}
            </div>
            <div>
              <span className="text-[11px] text-blue-300 font-bold block">
                {currentStep.distanceMeters} متر دیگر:
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                {currentStep.instruction}
              </h4>
            </div>
          </div>

          <button
            onClick={onStop}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="خروج از ناوبری"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Row */}
        <div className="px-4 py-2.5 bg-slate-950/80 flex items-center justify-between text-xs border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-white">{currentSpeed}</span>
            <span className="text-[10px] text-slate-400">km/h</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono font-bold text-white">~{route.durationMin}</span>
            <span className="text-[10px] text-slate-400">دقیقه</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-bold text-white">{remainingDist}</span>
            <span className="text-[10px] text-slate-400">کیلومتر مانده</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 text-slate-400 hover:text-slate-200"
            title={isMuted ? 'روشن کردن صدای راهنما' : 'بی‌صدا کردن'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>
        </div>

        {/* Destination Footer */}
        <div className="px-3.5 py-2 bg-slate-900 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">مقصد: {station.name}</span>
          </div>
          <span className="text-emerald-400 shrink-0 font-medium">
            صف: {station.waitTimeMinutes} د
          </span>
        </div>
      </div>
    </div>
  );
};
