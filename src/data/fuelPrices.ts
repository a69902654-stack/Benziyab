import { FuelType } from '../types/station';

export interface StandardFuelRate {
  type: FuelType;
  title: string;
  priceToman: number;
  unit: string;
  description: string;
  quotaPerMonth?: string;
  status: 'active' | 'limited' | 'special';
}

export const OFFICIAL_FUEL_PRICES: Record<FuelType, StandardFuelRate> = {
  quota: {
    type: 'quota',
    title: 'بنزین سهمیه‌ای (کارت سوخت)',
    priceToman: 1500,
    unit: 'لیتر',
    description: 'سهمیه ماهیانه ۶۰ لیتر خودروهای شخصی و تا ۲۵۰ لیتر تاکسی‌ها',
    quotaPerMonth: '۶۰ لیتر / ماه',
    status: 'active',
  },
  regular: {
    type: 'regular',
    title: 'بنزین آزاد (نرخ دوم)',
    priceToman: 3000,
    unit: 'لیتر',
    description: 'اعتبار کارت آزاد جایگاه یا سهمیه اعتباری مازاد کارت شخصی',
    quotaPerMonth: '۱۰۰ لیتر / ماه',
    status: 'active',
  },
  super: {
    type: 'super',
    title: 'بنزین سوپر داخلی',
    priceToman: 3500,
    unit: 'لیتر',
    description: 'اکتان ۹۲-۹۵ برای خودروهای توربو شارژ و استاندارد یورو ۴ و ۵',
    status: 'limited',
  },
  super_import: {
    type: 'super_import',
    title: 'بنزین سوپر وارداتی (پریمیوم)',
    priceToman: 75000,
    unit: 'لیتر',
    description: 'بنزین بدون سرب وارداتی با اکتان ۹۸ جهت خودروهای خارجی و وارداتی نوین',
    status: 'special',
  },
  cng: {
    type: 'cng',
    title: 'گاز طبیعی فشرده (CNG)',
    priceToman: 650,
    unit: 'متر مکعب',
    description: 'سوخت پاک فشرده جایگزین برای خودروهای گازسوز و دوگانه‌سوز',
    status: 'active',
  },
  diesel: {
    type: 'diesel',
    title: 'گازوئیل (نفت‌گاز یورو ۵)',
    priceToman: 600,
    unit: 'لیتر',
    description: 'مخصوص خودروهای سنگین، مینی‌بوس، اتوبوس و ناوگان دیزلی',
    status: 'active',
  },
};
