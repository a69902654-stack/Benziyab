export type FuelType = 'quota' | 'regular' | 'super' | 'super_import' | 'cng' | 'diesel';

export type CrowdLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface FuelInfo {
  available: boolean;
  price: number; // in Tomans per liter or cubic meter
  unit: string; // 'لیتر' or 'متر مکعب'
  name: string;
  badge?: string;
}

export interface UserReport {
  id: string;
  user: string;
  time: string;
  text: string;
  crowd: CrowdLevel;
  superFuelAvailable?: boolean;
  upvotes: number;
}

export interface FuelStation {
  id: string;
  code: string; // e.g. "جایگاه ۱۱۵"
  name: string;
  brand: string;
  address: string;
  city: string;
  zone: string;
  lat: number;
  lng: number;
  fuels: Partial<Record<FuelType, FuelInfo>>;
  crowdLevel: CrowdLevel;
  waitTimeMinutes: number; // Estimated wait in queue
  travelDistanceKm?: number; // Calculated relative to user
  travelTimeMinutes?: number; // Travel time by car
  queueLengthVehicles: number;
  totalNozzles: number;
  activeNozzles: number;
  hasOnlinePayment: boolean; // Coordinated with online payment & digital pass
  onlineFastLane: boolean;
  acceptsOnSitePayment: boolean; // Standard on-site pos/cash
  rating: number;
  reviewCount: number;
  is24Hours: boolean;
  phone?: string;
  amenities: string[];
  hourlyCrowd: number[]; // 24 items, index = hour 0..23, value = 0..100%
  reports: UserReport[];
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  durationMin: number;
  trafficLevel: 'light' | 'moderate' | 'heavy';
  summary: string;
  coordinates: [number, number][]; // [lat, lng][]
  steps: {
    instruction: string;
    distanceMeters: number;
    icon?: string;
  }[];
}

export interface DigitalFuelPass {
  passId: string;
  stationId: string;
  stationName: string;
  fuelType: FuelType;
  fuelName: string;
  liters: number;
  totalPriceToman: number;
  paymentMethod: 'online_gateway' | 'wallet';
  createdAt: string;
  expiresAt: string;
  qrToken: string;
  fastLaneNozzleId: string;
  status: 'valid' | 'used' | 'expired';
}
