import React from 'react';
import { Search, Zap, ArrowDownUp } from 'lucide-react';

export type FilterCategory = 'all' | 'super' | 'cng' | 'low_crowd' | 'online_pay';
export type SortOption = 'distance' | 'time' | 'crowd' | 'rating';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: FilterCategory;
  onCategoryChange: (cat: FilterCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalStationsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalStationsCount,
}) => {
  return (
    <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="جستجوی جایگاه، خیابان یا بزرگراه..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Minimal Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1 text-xs rounded-lg transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            همه ({totalStationsCount})
          </button>

          <button
            onClick={() => onCategoryChange('online_pay')}
            className={`px-3 py-1 text-xs rounded-lg transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'online_pay'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>پرداخت آنلاین</span>
          </button>

          <button
            onClick={() => onCategoryChange('low_crowd')}
            className={`px-3 py-1 text-xs rounded-lg transition whitespace-nowrap ${
              selectedCategory === 'low_crowd'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            خلوت
          </button>

          <button
            onClick={() => onCategoryChange('super')}
            className={`px-3 py-1 text-xs rounded-lg transition whitespace-nowrap ${
              selectedCategory === 'super'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            بنزین سوپر
          </button>

          <button
            onClick={() => onCategoryChange('cng')}
            className={`px-3 py-1 text-xs rounded-lg transition whitespace-nowrap ${
              selectedCategory === 'cng'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            CNG
          </button>
        </div>

        {/* Minimal Sort */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs">
          <ArrowDownUp className="w-3 h-3 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-slate-400 hover:text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="distance" className="bg-slate-900 text-slate-200">نزدیک‌ترین</option>
            <option value="time" className="bg-slate-900 text-slate-200">سریع‌ترین زمان</option>
            <option value="crowd" className="bg-slate-900 text-slate-200">خلوت‌ترین</option>
            <option value="rating" className="bg-slate-900 text-slate-200">بالاترین امتیاز</option>
          </select>
        </div>
      </div>
    </div>
  );
};
