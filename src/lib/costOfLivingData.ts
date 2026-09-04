/**
 * DORVIA COST OF LIVING BENCHMARK DATASET
 * 
 * Sources:
 * 1. Everyday Consumer Prices: Numbeo (numbeo.com/cost-of-living/in/<City>) — Crowd-sourced data, last reviewed: September 2026.
 * 2. Official Currency Exchange Rate: National Bank of Romania (BNR) via cursbnr.ro — Reference rate: 1 EUR = 5.25 RON (September 3, 2026).
 * 3. Student Dormitories: Official Romanian university portals (campus.tuiasi.ro, unitbv.ro, ubbcluj.ro, upb.ro) & evz.ro (2025-2026 academic year).
 * 4. Transit Student Pass: Local public transit operators (STB, CTP, RATBV, STPT) — Full upfront pass cost recorded; statutory 90% reimbursement handled post-purchase by universities.
 */

export type CityId = 'bucharest' | 'cluj-napoca' | 'timisoara' | 'iasi' | 'brasov' | 'constanta' | 'sibiu' | 'craiova';

export type HouseholdType = 'student' | 'single' | 'couple' | 'family';
export type AccommodationType = 'dorm' | 'shared' | 'one_bed_center' | 'one_bed_suburb' | 'two_bed_center' | 'three_bed';
export type LifestyleLevel = 'frugal' | 'balanced' | 'comfort';
export type Currency = 'EUR' | 'RON';

export interface CityCostData {
  id: CityId;
  name: {
    fa: string;
    en: string;
  };
  romanianName: string;
  region: {
    fa: string;
    en: string;
  };
  isCapital?: boolean;
  costIndexRank: number; // 1 = highest in Romania
  costIndexVsBucharest: number; // e.g. 100 for Bucharest, 105 for Cluj
  rent: {
    dorm: number; // monthly RON (sourced or scaled estimate)
    isDormEstimated?: boolean;
    shared: number; // derived: 0.55 * rent1BROutside (RON)
    one_bed_center: number; // direct Numbeo (RON)
    one_bed_suburb: number; // direct Numbeo (RON)
    two_bed_center: number; // derived: 1BR_center + 0.65 * (3BR_center - 1BR_center) (RON)
    three_bed: number; // direct Numbeo 3BR center (RON)
    three_bed_suburb: number; // direct Numbeo 3BR outside (RON)
  };
  utilities: {
    baseMonthly1Person: number; // derived: 0.6 * familyUtility (RON)
    baseMonthlyFamily: number; // direct Numbeo (85m² apartment) (RON)
    fiberInternet: number; // direct Numbeo (60Mbps+ / fiber) (RON)
    mobileSim5G: number; // direct Numbeo (10GB+ data plan) (RON)
  };
  food: {
    basicGroceryMonthly1Person: number; // Monthly grocery basket (RON)
    isGroceryEstimated?: boolean;
    diningOutMealBudget: number; // direct Numbeo (inexpensive restaurant) (RON)
    diningOutMealMidRange: number; // direct Numbeo (per-person portion of 3-course mid-range meal = 2-person / 2) (RON)
    diningOutMealMidRange2P: number; // direct Numbeo 2-person mid-range (RON)
    coffeeCappuccino: number; // direct Numbeo (RON)
    milk1L: number; // direct Numbeo (RON)
    bread500g: number; // direct Numbeo (RON)
  };
  transport: {
    monthlyPassGeneral: number; // direct Numbeo regular monthly pass (RON)
    monthlyPassStudent: number; // Upfront full pass cost (reimbursement note provided in UI) (RON)
    taxiStart: number; // direct Numbeo (RON)
    taxiPerKm: number; // direct Numbeo approximate (RON)
    avgBoltUberTrip: number; // typical urban ride-sharing trip (RON)
  };
  lifestyle: {
    gymMonthly: number; // direct Numbeo 1 adult fitness club (RON)
    cinemaTicket: number; // direct Numbeo 1 seat international release (RON)
    leisureMonthlyEstimate: number; // monthly leisure & personal care estimate (RON)
  };
}

/**
 * Official BNR reference exchange rate.
 * Source: cursbnr.ro / BNR (September 3, 2026).
 * 1 EUR = 5.25 RON
 */
export const EUR_TO_RON_RATE = 5.25;

export const ROMANIAN_CITIES_COST: Record<CityId, CityCostData> = {
  'bucharest': {
    id: 'bucharest',
    name: { fa: 'بخارست', en: 'Bucharest' },
    romanianName: 'București',
    region: { fa: 'مونتنیا (پایتخت)', en: 'Muntenia (Capital)' },
    isCapital: true,
    costIndexRank: 2,
    costIndexVsBucharest: 100,
    rent: {
      // Source: evz.ro / UPB CPV international student dorms (~550 RON/mo; university range 350-1230 RON)
      dorm: 550.00,
      isDormEstimated: false,
      // Derived: 0.55 * 2184.18 = 1201.30 RON
      shared: 1201.30,
      one_bed_center: 3227.85,
      one_bed_suburb: 2184.18,
      // Derived: 3227.85 + 0.65 * (5177.81 - 3227.85) = 4495.32 RON
      two_bed_center: 4495.32,
      three_bed: 5177.81,
      three_bed_suburb: 3440.96,
    },
    utilities: {
      // Derived: 0.6 * 908.79 = 545.27 RON
      baseMonthly1Person: 545.27,
      baseMonthlyFamily: 908.79,
      fiberInternet: 45.46,
      mobileSim5G: 38.55,
    },
    food: {
      // Direct basket sum from Numbeo items: eggs, cheese, chicken, apples, potatoes, onion, lettuce, water, beer, milk, bread = 438.04 RON
      basicGroceryMonthly1Person: 438.04,
      isGroceryEstimated: false,
      diningOutMealBudget: 65.00,
      diningOutMealMidRange: 138.75, // 277.50 / 2
      diningOutMealMidRange2P: 277.50,
      coffeeCappuccino: 16.38,
      milk1L: 8.19,
      bread500g: 5.87,
    },
    transport: {
      monthlyPassGeneral: 100.00,
      monthlyPassStudent: 100.00, // Upfront ticket (90% university reimbursement claimable post-purchase)
      taxiStart: 3.00,
      taxiPerKm: 3.00,
      avgBoltUberTrip: 25.00,
    },
    lifestyle: {
      gymMonthly: 245.19,
      cinemaTicket: 40.00,
      leisureMonthlyEstimate: 600.00,
    },
  },

  'cluj-napoca': {
    id: 'cluj-napoca',
    name: { fa: 'کلوژ-نپوکا', en: 'Cluj-Napoca' },
    romanianName: 'Cluj-Napoca',
    region: { fa: 'ترانسیلوانیا', en: 'Transylvania' },
    costIndexRank: 1,
    costIndexVsBucharest: 105,
    rent: {
      // Estimated: Scaled from 3-city average (556.67 RON) with Cluj rent ratio (2999.10 / 2986.46) = 560 RON
      dorm: 560.00,
      isDormEstimated: true,
      // Derived: 0.55 * 2476.64 = 1362.15 RON
      shared: 1362.15,
      one_bed_center: 2999.10,
      one_bed_suburb: 2476.64,
      // Derived: 2999.10 + 0.65 * (5436.35 - 2999.10) = 4583.31 RON
      two_bed_center: 4583.31,
      three_bed: 5436.35,
      three_bed_suburb: 3889.06,
    },
    utilities: {
      // Derived: 0.6 * 757.30 = 454.38 RON
      baseMonthly1Person: 454.38,
      baseMonthlyFamily: 757.30,
      fiberInternet: 46.79,
      mobileSim5G: 40.62,
    },
    food: {
      // Scaled by cheap meal ratio vs Bucharest: (60.00 / 65.00) * 438.04 = 404.34 RON
      basicGroceryMonthly1Person: 404.34,
      isGroceryEstimated: true,
      diningOutMealBudget: 60.00,
      diningOutMealMidRange: 128.19, // 256.37 / 2
      diningOutMealMidRange2P: 256.37,
      coffeeCappuccino: 17.44,
      milk1L: 7.78,
      bread500g: 6.38,
    },
    transport: {
      monthlyPassGeneral: 146.00,
      monthlyPassStudent: 146.00,
      taxiStart: 4.28,
      taxiPerKm: 4.50,
      avgBoltUberTrip: 23.00,
    },
    lifestyle: {
      gymMonthly: 221.54,
      cinemaTicket: 45.00,
      leisureMonthlyEstimate: 580.00,
    },
  },

  'brasov': {
    id: 'brasov',
    name: { fa: 'براشوف', en: 'Brașov' },
    romanianName: 'Brașov',
    region: { fa: 'ترانسیلوانیا (منطقه کوهستانی)', en: 'Transylvania (Carpathians)' },
    costIndexRank: 3,
    costIndexVsBucharest: 92,
    rent: {
      // Source: unitbv.ro & evz.ro (Transilvania Univ Colina/Memorandumului dorms: 725-735 RON)
      dorm: 730.00,
      isDormEstimated: false,
      // Derived: 0.55 * 2211.79 = 1216.48 RON
      shared: 1216.48,
      one_bed_center: 3231.41,
      one_bed_suburb: 2211.79,
      // Derived: 3231.41 + 0.65 * (6101.91 - 3231.41) = 5097.24 RON
      two_bed_center: 5097.24,
      three_bed: 6101.91,
      three_bed_suburb: 4936.36,
    },
    utilities: {
      // Derived: 0.6 * 852.03 = 511.22 RON
      baseMonthly1Person: 511.22,
      baseMonthlyFamily: 852.03,
      fiberInternet: 43.44,
      mobileSim5G: 37.08,
    },
    food: {
      // Scaled by cheap meal ratio vs Bucharest: (55.00 / 65.00) * 438.04 = 370.65 RON
      basicGroceryMonthly1Person: 370.65,
      isGroceryEstimated: true,
      diningOutMealBudget: 55.00,
      diningOutMealMidRange: 125.00, // 250.00 / 2
      diningOutMealMidRange2P: 250.00,
      coffeeCappuccino: 17.32,
      milk1L: 7.34,
      bread500g: 6.05,
    },
    transport: {
      monthlyPassGeneral: 110.00,
      monthlyPassStudent: 110.00, // Note: RATBV Brașov municipal council subsidizes 100% locally for active registered students
      taxiStart: 3.10,
      taxiPerKm: 3.10,
      avgBoltUberTrip: 20.00,
    },
    lifestyle: {
      gymMonthly: 274.45,
      cinemaTicket: 45.00,
      leisureMonthlyEstimate: 500.00,
    },
  },

  'timisoara': {
    id: 'timisoara',
    name: { fa: 'تیمیشوارا', en: 'Timișoara' },
    romanianName: 'Timișoara',
    region: { fa: 'بانات (غرب رومانی)', en: 'Banat (Western Romania)' },
    costIndexRank: 4,
    costIndexVsBucharest: 89,
    rent: {
      // Estimated: Scaled with rent ratio (2548.76 / 2986.46) * 556.67 = 475 RON
      dorm: 475.00,
      isDormEstimated: true,
      // Derived: 0.55 * 1698.93 = 934.41 RON
      shared: 934.41,
      one_bed_center: 2548.76,
      one_bed_suburb: 1698.93,
      // Derived: 2548.76 + 0.65 * (3889.07 - 2548.76) = 3419.96 RON
      two_bed_center: 3419.96,
      three_bed: 3889.07,
      three_bed_suburb: 2877.49,
    },
    utilities: {
      // Derived: 0.6 * 807.05 = 484.23 RON
      baseMonthly1Person: 484.23,
      baseMonthlyFamily: 807.05,
      fiberInternet: 40.67,
      mobileSim5G: 31.42,
    },
    food: {
      // Scaled: (50.00 / 65.00) * 438.04 = 336.95 RON
      basicGroceryMonthly1Person: 336.95,
      isGroceryEstimated: true,
      diningOutMealBudget: 50.00,
      diningOutMealMidRange: 110.00, // 220.00 / 2
      diningOutMealMidRange2P: 220.00,
      coffeeCappuccino: 14.23,
      milk1L: 6.60,
      bread500g: 5.30,
    },
    transport: {
      monthlyPassGeneral: 160.00,
      monthlyPassStudent: 160.00,
      taxiStart: 3.99,
      taxiPerKm: 4.00,
      avgBoltUberTrip: 20.00,
    },
    lifestyle: {
      gymMonthly: 186.27,
      cinemaTicket: 40.00,
      leisureMonthlyEstimate: 480.00,
    },
  },

  'iasi': {
    id: 'iasi',
    name: { fa: 'یاش', en: 'Iași' },
    romanianName: 'Iași',
    region: { fa: 'مولداوی (شمال شرق)', en: 'Moldavia (Northeast)' },
    costIndexRank: 5,
    costIndexVsBucharest: 84,
    rent: {
      // Source: campus.tuiasi.ro & evz.ro (Tudor Vladimirescu campus: 385-400 RON)
      dorm: 390.00,
      isDormEstimated: false,
      // Derived: 0.55 * 1991.14 = 1095.13 RON
      shared: 1095.13,
      one_bed_center: 2500.11,
      one_bed_suburb: 1991.14,
      // Derived: 2500.11 + 0.65 * (4152.64 - 2500.11) = 3574.25 RON
      two_bed_center: 3574.25,
      three_bed: 4152.64,
      three_bed_suburb: 3097.58,
    },
    utilities: {
      // Derived: 0.6 * 837.75 = 502.65 RON
      baseMonthly1Person: 502.65,
      baseMonthlyFamily: 837.75,
      fiberInternet: 39.38,
      mobileSim5G: 33.30,
    },
    food: {
      // Scaled: (50.00 / 65.00) * 438.04 = 336.95 RON
      basicGroceryMonthly1Person: 336.95,
      isGroceryEstimated: true,
      diningOutMealBudget: 50.00,
      diningOutMealMidRange: 100.00, // 200.00 / 2
      diningOutMealMidRange2P: 200.00,
      coffeeCappuccino: 13.62,
      milk1L: 7.45,
      bread500g: 5.72,
    },
    transport: {
      monthlyPassGeneral: 130.00,
      monthlyPassStudent: 130.00,
      taxiStart: 4.00,
      taxiPerKm: 4.00,
      avgBoltUberTrip: 18.00,
    },
    lifestyle: {
      gymMonthly: 208.75,
      cinemaTicket: 40.00,
      leisureMonthlyEstimate: 450.00,
    },
  },

  'constanta': {
    id: 'constanta',
    name: { fa: 'کونستانتسا', en: 'Constanța' },
    romanianName: 'Constanța',
    region: { fa: 'دوبروجا (ساحل دریای سیاه)', en: 'Dobrogea (Black Sea Coast)' },
    costIndexRank: 6,
    costIndexVsBucharest: 86,
    rent: {
      // Estimated: Scaled with rent ratio (2844.77 / 2986.46) * 556.67 = 530 RON
      dorm: 530.00,
      isDormEstimated: true,
      // Derived: 0.55 * 2252.96 = 1239.13 RON
      shared: 1239.13,
      one_bed_center: 2844.77,
      one_bed_suburb: 2252.96,
      // Derived: 2844.77 + 0.65 * (4989.25 - 2844.77) = 4238.68 RON
      two_bed_center: 4238.68,
      three_bed: 4989.25,
      three_bed_suburb: 3495.51,
    },
    utilities: {
      // Derived: 0.6 * 795.63 = 477.38 RON
      baseMonthly1Person: 477.38,
      baseMonthlyFamily: 795.63,
      fiberInternet: 38.50,
      mobileSim5G: 36.11,
    },
    food: {
      // Scaled: (60.00 / 65.00) * 438.04 = 404.34 RON
      basicGroceryMonthly1Person: 404.34,
      isGroceryEstimated: true,
      diningOutMealBudget: 60.00,
      diningOutMealMidRange: 150.00, // 300.00 / 2
      diningOutMealMidRange2P: 300.00,
      coffeeCappuccino: 15.38,
      milk1L: 7.65,
      bread500g: 5.25,
    },
    transport: {
      monthlyPassGeneral: 80.00,
      monthlyPassStudent: 80.00,
      taxiStart: 4.00,
      taxiPerKm: 3.69,
      avgBoltUberTrip: 20.00,
    },
    lifestyle: {
      gymMonthly: 263.00,
      cinemaTicket: 32.50,
      leisureMonthlyEstimate: 460.00,
    },
  },

  'sibiu': {
    id: 'sibiu',
    name: { fa: 'سیبیو', en: 'Sibiu' },
    romanianName: 'Sibiu',
    region: { fa: 'ترانسیلوانیا', en: 'Transylvania' },
    costIndexRank: 7,
    costIndexVsBucharest: 87,
    rent: {
      // Source: evz.ro / ULBS student housing (range 300-800 RON, midpoint 550 RON)
      dorm: 550.00,
      isDormEstimated: false,
      // Derived: 0.55 * 1957.20 = 1076.46 RON
      shared: 1076.46,
      one_bed_center: 2112.21,
      one_bed_suburb: 1957.20,
      // Derived: 2112.21 + 0.65 * (3933.59 - 2112.21) = 3296.11 RON
      two_bed_center: 3296.11,
      three_bed: 3933.59,
      three_bed_suburb: 2812.39,
    },
    utilities: {
      // Derived: 0.6 * 546.52 = 327.91 RON
      baseMonthly1Person: 327.91,
      baseMonthlyFamily: 546.52,
      fiberInternet: 58.20,
      mobileSim5G: 43.50,
    },
    food: {
      // Scaled: (40.00 / 65.00) * 438.04 = 269.56 RON
      basicGroceryMonthly1Person: 269.56,
      isGroceryEstimated: true,
      diningOutMealBudget: 40.00,
      diningOutMealMidRange: 100.00, // 200.00 / 2
      diningOutMealMidRange2P: 200.00,
      coffeeCappuccino: 15.11,
      milk1L: 6.69,
      bread500g: 4.84,
    },
    transport: {
      monthlyPassGeneral: 83.00,
      monthlyPassStudent: 83.00,
      taxiStart: 4.50,
      taxiPerKm: 4.00,
      avgBoltUberTrip: 18.00,
    },
    lifestyle: {
      gymMonthly: 165.43,
      cinemaTicket: 32.50,
      leisureMonthlyEstimate: 450.00,
    },
  },

  'craiova': {
    id: 'craiova',
    name: { fa: 'کرایووا', en: 'Craiova' },
    romanianName: 'Craiova',
    region: { fa: 'اولتنیا (جنوب غرب)', en: 'Oltenia (Southwest)' },
    costIndexRank: 8,
    costIndexVsBucharest: 80,
    rent: {
      // Estimated: Scaled with rent ratio (2406.46 / 2986.46) * 556.67 = 450 RON
      dorm: 450.00,
      isDormEstimated: true,
      // Derived: 0.55 * 1842.54 = 1013.40 RON
      shared: 1013.40,
      one_bed_center: 2406.46,
      one_bed_suburb: 1842.54,
      // Derived: 2406.46 + 0.65 * (4186.61 - 2406.46) = 3563.56 RON
      two_bed_center: 3563.56,
      three_bed: 4186.61,
      three_bed_suburb: 2867.00,
    },
    utilities: {
      // Derived: 0.6 * 928.00 = 556.80 RON
      baseMonthly1Person: 556.80,
      baseMonthlyFamily: 928.00,
      fiberInternet: 52.50,
      mobileSim5G: 47.80,
    },
    food: {
      // Scaled: (35.00 / 65.00) * 438.04 = 235.87 RON
      basicGroceryMonthly1Person: 235.87,
      isGroceryEstimated: true,
      diningOutMealBudget: 35.00,
      diningOutMealMidRange: 85.00, // 170.00 / 2
      diningOutMealMidRange2P: 170.00,
      coffeeCappuccino: 12.75,
      milk1L: 6.20,
      bread500g: 3.63,
    },
    transport: {
      monthlyPassGeneral: 120.00,
      monthlyPassStudent: 120.00,
      taxiStart: 3.00,
      taxiPerKm: 3.00,
      avgBoltUberTrip: 16.00,
    },
    lifestyle: {
      gymMonthly: 185.00,
      cinemaTicket: 35.00,
      leisureMonthlyEstimate: 400.00,
    },
  },
};

export interface ExpenseCalculationInput {
  cityId: CityId;
  household: HouseholdType;
  accommodation: AccommodationType;
  lifestyle: LifestyleLevel;
  eatingOutWeeklyCount: number; // 0 to 14
  usePublicTransit: boolean;
  rideShareTripsMonthly: number; // 0 to 30
  includeGym: boolean;
  currency: Currency;
}

export interface ExpenseBreakdown {
  rent: number;
  utilities: number;
  food: number;
  transport: number;
  lifestyle: number;
  totalMonthly: number;
  totalAnnual: number;
  currency: Currency;
  categoryPercentages: {
    rent: number;
    utilities: number;
    food: number;
    transport: number;
    lifestyle: number;
  };
  itemizedDetails: {
    categoryKey: string;
    items: { labelKey: string; amount: number }[];
  }[];
}

export function calculateMonthlyCost(input: ExpenseCalculationInput): ExpenseBreakdown {
  const city = ROMANIAN_CITIES_COST[input.cityId] || ROMANIAN_CITIES_COST['bucharest'];
  
  // Convert native RON base amounts to selected currency
  const toSelectedCurrency = (amountRon: number) => {
    return input.currency === 'EUR' ? amountRon / EUR_TO_RON_RATE : amountRon;
  };

  // 1. Rent calculation (Native RON)
  const rentRon = city.rent[input.accommodation];

  // 2. Utilities calculation (Native RON)
  let utilitiesRon = 0;
  if (input.accommodation === 'dorm') {
    // Dormitories in Romania include heating & water; add mobile SIM & small personal electricity/misc allowance
    utilitiesRon = city.utilities.mobileSim5G + 40;
  } else if (input.household === 'family' || input.accommodation === 'two_bed_center' || input.accommodation === 'three_bed') {
    utilitiesRon = city.utilities.baseMonthlyFamily + city.utilities.fiberInternet + (city.utilities.mobileSim5G * (input.household === 'family' ? 2.5 : 2));
  } else if (input.household === 'couple') {
    utilitiesRon = (city.utilities.baseMonthly1Person * 1.3) + city.utilities.fiberInternet + (city.utilities.mobileSim5G * 2);
  } else {
    // Single / Shared
    utilitiesRon = (input.accommodation === 'shared' ? city.utilities.baseMonthly1Person * 0.6 : city.utilities.baseMonthly1Person) +
      city.utilities.fiberInternet + city.utilities.mobileSim5G;
  }

  // 3. Food & Groceries calculation (Native RON)
  let personCount = 1;
  if (input.household === 'couple') personCount = 2;
  if (input.household === 'family') personCount = 2.6; // Scale factor: 2.6x single basket for family of 3-4

  let lifestyleFoodMultiplier = 1.0;
  if (input.lifestyle === 'frugal') lifestyleFoodMultiplier = 0.85;
  if (input.lifestyle === 'comfort') lifestyleFoodMultiplier = 1.25;

  const baseGroceriesRon = city.food.basicGroceryMonthly1Person * personCount * lifestyleFoodMultiplier;
  
  // Dining out: cost per meal * weekly meals * 4.33 weeks (per month)
  const mealCostRon = input.lifestyle === 'comfort' ? city.food.diningOutMealMidRange : city.food.diningOutMealBudget;
  const diningOutMonthlyRon = input.eatingOutWeeklyCount * 4.33 * mealCostRon * (input.household === 'couple' || input.household === 'family' ? Math.min(2, Math.round(personCount)) : 1);
  const foodRon = baseGroceriesRon + diningOutMonthlyRon;

  // 4. Transportation calculation (Native RON)
  let transportRon = 0;
  if (input.usePublicTransit) {
    // Display full upfront pass cost; reimbursement details noted in UI as per Romanian student transit policy
    const transitPass = city.transport.monthlyPassGeneral;
    transportRon += transitPass * (input.household === 'couple' ? 2 : input.household === 'family' ? 2.5 : 1);
  }
  // Ride-sharing trips
  transportRon += input.rideShareTripsMonthly * city.transport.avgBoltUberTrip;

  // 5. Lifestyle & Leisure calculation (Native RON)
  let lifestyleRon = 0;
  if (input.includeGym) {
    lifestyleRon += city.lifestyle.gymMonthly * (input.household === 'couple' ? 2 : 1);
  }
  let baseLeisure = city.lifestyle.leisureMonthlyEstimate * (personCount > 1 ? personCount * 0.75 : 1);
  if (input.lifestyle === 'frugal') baseLeisure *= 0.6;
  if (input.lifestyle === 'comfort') baseLeisure *= 1.5;
  lifestyleRon += baseLeisure;

  // Convert to output currency
  const rent = Math.round(toSelectedCurrency(rentRon));
  const utilities = Math.round(toSelectedCurrency(utilitiesRon));
  const food = Math.round(toSelectedCurrency(foodRon));
  const transport = Math.round(toSelectedCurrency(transportRon));
  const lifestyle = Math.round(toSelectedCurrency(lifestyleRon));

  const totalMonthly = rent + utilities + food + transport + lifestyle;
  const totalAnnual = totalMonthly * 12;

  const categoryPercentages = {
    rent: totalMonthly > 0 ? Math.round((rent / totalMonthly) * 100) : 0,
    utilities: totalMonthly > 0 ? Math.round((utilities / totalMonthly) * 100) : 0,
    food: totalMonthly > 0 ? Math.round((food / totalMonthly) * 100) : 0,
    transport: totalMonthly > 0 ? Math.round((transport / totalMonthly) * 100) : 0,
    lifestyle: totalMonthly > 0 ? Math.round((lifestyle / totalMonthly) * 100) : 0,
  };

  const itemizedDetails = [
    {
      categoryKey: 'rent',
      items: [
        { labelKey: `accommodation_${input.accommodation}`, amount: rent },
      ],
    },
    {
      categoryKey: 'utilities',
      items: [
        { labelKey: 'utilities_basic', amount: Math.round(toSelectedCurrency(utilitiesRon * 0.75)) },
        { labelKey: 'utilities_internet_mobile', amount: Math.round(toSelectedCurrency(utilitiesRon * 0.25)) },
      ],
    },
    {
      categoryKey: 'food',
      items: [
        { labelKey: 'food_groceries', amount: Math.round(toSelectedCurrency(baseGroceriesRon)) },
        { labelKey: 'food_dining_out', amount: Math.round(toSelectedCurrency(diningOutMonthlyRon)) },
      ],
    },
    {
      categoryKey: 'transport',
      items: [
        { labelKey: 'transport_public', amount: Math.round(toSelectedCurrency(input.usePublicTransit ? (city.transport.monthlyPassGeneral * (input.household === 'couple' ? 2 : input.household === 'family' ? 2.5 : 1)) : 0)) },
        { labelKey: 'transport_rideshare', amount: Math.round(toSelectedCurrency(input.rideShareTripsMonthly * city.transport.avgBoltUberTrip)) },
      ],
    },
    {
      categoryKey: 'lifestyle',
      items: [
        { labelKey: 'lifestyle_gym', amount: Math.round(toSelectedCurrency(input.includeGym ? (city.lifestyle.gymMonthly * (input.household === 'couple' ? 2 : 1)) : 0)) },
        { labelKey: 'lifestyle_leisure', amount: Math.round(toSelectedCurrency(baseLeisure)) },
      ],
    },
  ];

  return {
    rent,
    utilities,
    food,
    transport,
    lifestyle,
    totalMonthly,
    totalAnnual,
    currency: input.currency,
    categoryPercentages,
    itemizedDetails,
  };
}
