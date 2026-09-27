import { RouteOption } from '../types/station';

/**
 * Calculates straight line distance in km between two lat/lng points
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

/**
 * Generates curved intermediate waypoints to simulate realistic urban road paths
 */
function generateRoadWaypoints(
  start: [number, number],
  end: [number, number],
  variation: 'highway' | 'direct' | 'bypass'
): [number, number][] {
  const points: [number, number][] = [start];
  const steps = 14;

  const latDiff = end[0] - start[0];
  const lngDiff = end[1] - start[1];

  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    // Linear base
    let lat = start[0] + latDiff * t;
    let lng = start[1] + lngDiff * t;

    // Add realistic Manhattan-style / highway curves
    const wave = Math.sin(t * Math.PI);
    if (variation === 'highway') {
      // Highway arc
      lat += (lngDiff * 0.18 + 0.003) * wave;
      lng += (-latDiff * 0.18 + 0.002) * wave;
    } else if (variation === 'bypass') {
      // Alternate bypass
      lat += (-lngDiff * 0.22 - 0.003) * wave;
      lng += (latDiff * 0.22 - 0.002) * wave;
    } else {
      // Direct urban grid
      lat += (Math.sin(t * Math.PI * 2) * 0.0015);
      lng += (Math.cos(t * Math.PI * 2) * 0.0015);
    }

    points.push([lat, lng]);
  }

  points.push(end);
  return points;
}

/**
 * Generates realistic routing options between user location and station
 */
export function calculateRoutes(
  userPos: [number, number],
  stationPos: [number, number],
  stationName: string
): RouteOption[] {
  const straightDist = calculateDistanceKm(userPos[0], userPos[1], stationPos[0], stationPos[1]);
  
  // Real driving distance in urban grid is typically 1.25x - 1.45x straight line
  const highwayDist = Math.max(1.1, Number((straightDist * 1.35).toFixed(1)));
  const directDist = Math.max(0.8, Number((straightDist * 1.15).toFixed(1)));
  const bypassDist = Math.max(1.3, Number((straightDist * 1.48).toFixed(1)));

  // Durations based on average speed (km/h) + traffic
  const highwaySpeed = 48; // km/h
  const directSpeed = 26; // km/h urban traffic
  const bypassSpeed = 40; // km/h

  const highwayDur = Math.max(2, Math.round((highwayDist / highwaySpeed) * 60) + 2);
  const directDur = Math.max(3, Math.round((directDist / directSpeed) * 60) + 4);
  const bypassDur = Math.max(4, Math.round((bypassDist / bypassSpeed) * 60) + 2);

  return [
    {
      id: 'opt-highway',
      name: 'سریع‌ترین مسیر (بلوار شریانی)',
      distanceKm: highwayDist,
      durationMin: highwayDur,
      trafficLevel: 'light',
      summary: 'از طریق بلوار اصلی و مسیر روان کم‌تردد',
      coordinates: generateRoadWaypoints(userPos, stationPos, 'highway'),
      steps: [
        { instruction: 'از مبدأ در جهت خیابان اصلی حرکت کنید', distanceMeters: 400 },
        { instruction: 'وارد بلوار شریانی شده و مسیر مستقیم را ادامه دهید', distanceMeters: 2800 },
        { instruction: 'به سمت لاین راست خروجی تقاطع تغییر مسیر دهید', distanceMeters: 750 },
        { instruction: `به سمت راست بپیچید؛ ${stationName} در سمت راست شماست`, distanceMeters: 150 },
      ],
    },
    {
      id: 'opt-direct',
      name: 'کوتاه‌ترین مسیر (خیابان‌های اصلی)',
      distanceKm: directDist,
      durationMin: directDur,
      trafficLevel: 'moderate',
      summary: 'مسافت کمتر با عبور از تقاطع‌ها و چراغ راهنمایی',
      coordinates: generateRoadWaypoints(userPos, stationPos, 'direct'),
      steps: [
        { instruction: 'در خیابان اصلی به سمت مقصد حرکت کنید', distanceMeters: 600 },
        { instruction: 'در تقاطع اول به چپ گردش کنید', distanceMeters: 1200 },
        { instruction: 'میدان را مستقیم دور بزنید و خروجی دوم را انتخاب کنید', distanceMeters: 900 },
        { instruction: `به مقصد رسیدید: ${stationName}`, distanceMeters: 200 },
      ],
    },
    {
      id: 'opt-bypass',
      name: 'مسیر جایگزین (بدون طرح ترافیک)',
      distanceKm: bypassDist,
      durationMin: bypassDur,
      trafficLevel: 'heavy',
      summary: 'دور زدن گره‌های ترافیکی مرکزی و محدوده زوج و فرد',
      coordinates: generateRoadWaypoints(userPos, stationPos, 'bypass'),
      steps: [
        { instruction: 'از مسیر کمربندی شمالی ادامه مسیر دهید', distanceMeters: 1800 },
        { instruction: 'وارد زیرگذر شده و بعد از ۵۰۰ متر خارج شوید', distanceMeters: 1400 },
        { instruction: 'در میدان به راست پیچیده و وارد لاین کندرو شوید', distanceMeters: 800 },
        { instruction: `ورود به محوطه جایگاه سوخت`, distanceMeters: 100 },
      ],
    },
  ];
}
