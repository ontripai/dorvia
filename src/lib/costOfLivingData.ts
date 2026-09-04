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
  costIndexVsBucharest: number; // e.g. 100 for Bucharest, 105 for Cluj, 85 for Iasi
  rent: {
    dorm: number; // monthly EUR
    shared: number;
    one_bed_center: number;
    one_bed_suburb: number;
    two_bed_center: number;
    three_bed: number;
  };
  utilities: {
    baseMonthly1Person: number; // heating, electricity, water, garbage
    baseMonthlyFamily: number;
    fiberInternet: number; // 1 Gbps high-speed
    mobileSim5G: number;
  };
  food: {
    basicGroceryMonthly1Person: number;
    diningOutMealBudget: number;
    diningOutMealMidRange: number;
    coffeeCappuccino: number;
  };
  transport: {
    monthlyPassGeneral: number;
    monthlyPassStudent: number; // Subsidized (90% discount in RO)
    taxiPerKm: number;
    avgBoltUberTrip: number;
  };
  lifestyle: {
    gymMonthly: number;
    cinemaTicket: number;
    leisureMonthlyEstimate: number;
  };
}

export const EUR_TO_RON_RATE = 4.97;

export const ROMANIAN_CITIES_COST: Record<CityId, CityCostData> = {
  'cluj-napoca': {
    id: 'cluj-napoca',
    name: { fa: 'کلوژ-نپوکا', en: 'Cluj-Napoca' },
    romanianName: 'Cluj-Napoca',
    region: { fa: 'ترانسیلوانیا', en: 'Transylvania' },
    costIndexRank: 1,
    costIndexVsBucharest: 105,
    rent: {
      dorm: 140,
      shared: 240,
      one_bed_center: 550,
      one_bed_suburb: 420,
      two_bed_center: 750,
      three_bed: 1050,
    },
    utilities: {
      baseMonthly1Person: 105,
      baseMonthlyFamily: 190,
      fiberInternet: 9,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 220,
      diningOutMealBudget: 9.5,
      diningOutMealMidRange: 22,
      coffeeCappuccino: 3.2,
    },
    transport: {
      monthlyPassGeneral: 38,
      monthlyPassStudent: 3.8,
      taxiPerKm: 0.95,
      avgBoltUberTrip: 5.5,
    },
    lifestyle: {
      gymMonthly: 52,
      cinemaTicket: 7.5,
      leisureMonthlyEstimate: 140,
    },
  },
  'bucharest': {
    id: 'bucharest',
    name: { fa: 'بخارست', en: 'Bucharest' },
    romanianName: 'București',
    region: { fa: 'مونتنیا (پایتخت)', en: 'Muntenia (Capital)' },
    isCapital: true,
    costIndexRank: 2,
    costIndexVsBucharest: 100,
    rent: {
      dorm: 120,
      shared: 220,
      one_bed_center: 520,
      one_bed_suburb: 380,
      two_bed_center: 700,
      three_bed: 980,
    },
    utilities: {
      baseMonthly1Person: 100,
      baseMonthlyFamily: 180,
      fiberInternet: 9,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 210,
      diningOutMealBudget: 9,
      diningOutMealMidRange: 20,
      coffeeCappuccino: 3,
    },
    transport: {
      monthlyPassGeneral: 28, // STB + Metrorex integrated
      monthlyPassStudent: 2.8, // 90% student reduction
      taxiPerKm: 0.85,
      avgBoltUberTrip: 6.0,
    },
    lifestyle: {
      gymMonthly: 48,
      cinemaTicket: 7.5,
      leisureMonthlyEstimate: 150,
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
      dorm: 110,
      shared: 200,
      one_bed_center: 450,
      one_bed_suburb: 350,
      two_bed_center: 620,
      three_bed: 850,
    },
    utilities: {
      baseMonthly1Person: 95,
      baseMonthlyFamily: 175,
      fiberInternet: 8.5,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 195,
      diningOutMealBudget: 8.5,
      diningOutMealMidRange: 18.5,
      coffeeCappuccino: 2.8,
    },
    transport: {
      monthlyPassGeneral: 25,
      monthlyPassStudent: 2.5,
      taxiPerKm: 0.8,
      avgBoltUberTrip: 4.5,
    },
    lifestyle: {
      gymMonthly: 42,
      cinemaTicket: 6.5,
      leisureMonthlyEstimate: 120,
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
      dorm: 100,
      shared: 190,
      one_bed_center: 430,
      one_bed_suburb: 330,
      two_bed_center: 590,
      three_bed: 800,
    },
    utilities: {
      baseMonthly1Person: 92,
      baseMonthlyFamily: 170,
      fiberInternet: 8.5,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 190,
      diningOutMealBudget: 8.0,
      diningOutMealMidRange: 18.0,
      coffeeCappuccino: 2.7,
    },
    transport: {
      monthlyPassGeneral: 26,
      monthlyPassStudent: 2.6,
      taxiPerKm: 0.8,
      avgBoltUberTrip: 4.5,
    },
    lifestyle: {
      gymMonthly: 40,
      cinemaTicket: 6.5,
      leisureMonthlyEstimate: 115,
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
      dorm: 90,
      shared: 170,
      one_bed_center: 400,
      one_bed_suburb: 300,
      two_bed_center: 540,
      three_bed: 750,
    },
    utilities: {
      baseMonthly1Person: 88,
      baseMonthlyFamily: 160,
      fiberInternet: 8.5,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 180,
      diningOutMealBudget: 7.5,
      diningOutMealMidRange: 16.5,
      coffeeCappuccino: 2.5,
    },
    transport: {
      monthlyPassGeneral: 24,
      monthlyPassStudent: 2.4,
      taxiPerKm: 0.75,
      avgBoltUberTrip: 4.0,
    },
    lifestyle: {
      gymMonthly: 38,
      cinemaTicket: 6.0,
      leisureMonthlyEstimate: 105,
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
      dorm: 95,
      shared: 180,
      one_bed_center: 420,
      one_bed_suburb: 320,
      two_bed_center: 570,
      three_bed: 790,
    },
    utilities: {
      baseMonthly1Person: 90,
      baseMonthlyFamily: 165,
      fiberInternet: 8.5,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 185,
      diningOutMealBudget: 8.0,
      diningOutMealMidRange: 17.5,
      coffeeCappuccino: 2.6,
    },
    transport: {
      monthlyPassGeneral: 25,
      monthlyPassStudent: 2.5,
      taxiPerKm: 0.8,
      avgBoltUberTrip: 4.2,
    },
    lifestyle: {
      gymMonthly: 39,
      cinemaTicket: 6.5,
      leisureMonthlyEstimate: 110,
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
      dorm: 95,
      shared: 180,
      one_bed_center: 410,
      one_bed_suburb: 310,
      two_bed_center: 560,
      three_bed: 780,
    },
    utilities: {
      baseMonthly1Person: 90,
      baseMonthlyFamily: 165,
      fiberInternet: 8.5,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 185,
      diningOutMealBudget: 8.0,
      diningOutMealMidRange: 17.0,
      coffeeCappuccino: 2.6,
    },
    transport: {
      monthlyPassGeneral: 24,
      monthlyPassStudent: 2.4,
      taxiPerKm: 0.75,
      avgBoltUberTrip: 4.0,
    },
    lifestyle: {
      gymMonthly: 38,
      cinemaTicket: 6.0,
      leisureMonthlyEstimate: 110,
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
      dorm: 85,
      shared: 160,
      one_bed_center: 370,
      one_bed_suburb: 270,
      two_bed_center: 500,
      three_bed: 700,
    },
    utilities: {
      baseMonthly1Person: 85,
      baseMonthlyFamily: 155,
      fiberInternet: 8.5,
      mobileSim5G: 6,
    },
    food: {
      basicGroceryMonthly1Person: 175,
      diningOutMealBudget: 7.0,
      diningOutMealMidRange: 15.5,
      coffeeCappuccino: 2.3,
    },
    transport: {
      monthlyPassGeneral: 22,
      monthlyPassStudent: 2.2,
      taxiPerKm: 0.7,
      avgBoltUberTrip: 3.8,
    },
    lifestyle: {
      gymMonthly: 35,
      cinemaTicket: 5.5,
      leisureMonthlyEstimate: 95,
    },
  },
};

export interface ExpenseCalculationInput {
  cityId: CityId;
  household: HouseholdType;
  accommodation: AccommodationType;
  lifestyle: LifestyleLevel;
  eatingOutWeeklyCount: number; // e.g. 0 to 14
  usePublicTransit: boolean;
  rideShareTripsMonthly: number; // e.g. 0 to 30
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
  const multiplier = input.currency === 'RON' ? EUR_TO_RON_RATE : 1;

  // 1. Rent calculation (Base in EUR)
  let rentEur = city.rent[input.accommodation];

  // 2. Utilities calculation
  let utilitiesEur = 0;
  if (input.accommodation === 'dorm') {
    // Dorms usually include basic utilities; add mobile SIM
    utilitiesEur = city.utilities.mobileSim5G + 15;
  } else if (input.household === 'family' || input.accommodation === 'two_bed_center' || input.accommodation === 'three_bed') {
    utilitiesEur = city.utilities.baseMonthlyFamily + city.utilities.fiberInternet + (city.utilities.mobileSim5G * (input.household === 'family' ? 2.5 : 2));
  } else if (input.household === 'couple') {
    utilitiesEur = (city.utilities.baseMonthly1Person * 1.3) + city.utilities.fiberInternet + (city.utilities.mobileSim5G * 2);
  } else {
    // Single / Shared
    utilitiesEur = (input.accommodation === 'shared' ? city.utilities.baseMonthly1Person * 0.6 : city.utilities.baseMonthly1Person) +
      city.utilities.fiberInternet + city.utilities.mobileSim5G;
  }

  // 3. Food & Groceries calculation
  let personCount = 1;
  if (input.household === 'couple') personCount = 2;
  if (input.household === 'family') personCount = 3.2; // 2 adults + 1-2 kids

  // Base groceries
  let lifestyleFoodMultiplier = 1.0;
  if (input.lifestyle === 'frugal') lifestyleFoodMultiplier = 0.85;
  if (input.lifestyle === 'comfort') lifestyleFoodMultiplier = 1.25;

  const baseGroceriesEur = city.food.basicGroceryMonthly1Person * personCount * lifestyleFoodMultiplier;
  
  // Dining out: cost per meal * weekly meals * 4.33 weeks
  const mealCostEur = input.lifestyle === 'comfort' ? city.food.diningOutMealMidRange : city.food.diningOutMealBudget;
  const diningOutMonthlyEur = input.eatingOutWeeklyCount * 4.33 * mealCostEur * (input.household === 'couple' || input.household === 'family' ? Math.min(2, personCount) : 1);
  const foodEur = baseGroceriesEur + diningOutMonthlyEur;

  // 4. Transportation calculation
  let transportEur = 0;
  const isStudent = input.household === 'student';
  if (input.usePublicTransit) {
    const transitPass = isStudent ? city.transport.monthlyPassStudent : city.transport.monthlyPassGeneral;
    transportEur += transitPass * (input.household === 'couple' ? 2 : input.household === 'family' ? 2.5 : 1);
  }
  // Ride share trips
  transportEur += input.rideShareTripsMonthly * city.transport.avgBoltUberTrip;

  // 5. Lifestyle & Leisure calculation
  let lifestyleEur = 0;
  if (input.includeGym) {
    lifestyleEur += city.lifestyle.gymMonthly * (input.household === 'couple' ? 2 : 1);
  }
  let baseLeisure = city.lifestyle.leisureMonthlyEstimate * (personCount > 1 ? personCount * 0.75 : 1);
  if (input.lifestyle === 'frugal') baseLeisure *= 0.6;
  if (input.lifestyle === 'comfort') baseLeisure *= 1.5;
  lifestyleEur += baseLeisure;

  // Totals in requested currency
  const rent = Math.round(rentEur * multiplier);
  const utilities = Math.round(utilitiesEur * multiplier);
  const food = Math.round(foodEur * multiplier);
  const transport = Math.round(transportEur * multiplier);
  const lifestyle = Math.round(lifestyleEur * multiplier);

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
        { labelKey: 'utilities_basic', amount: Math.round(utilities * 0.75) },
        { labelKey: 'utilities_internet_mobile', amount: Math.round(utilities * 0.25) },
      ],
    },
    {
      categoryKey: 'food',
      items: [
        { labelKey: 'food_groceries', amount: Math.round(baseGroceriesEur * multiplier) },
        { labelKey: 'food_dining_out', amount: Math.round(diningOutMonthlyEur * multiplier) },
      ],
    },
    {
      categoryKey: 'transport',
      items: [
        { labelKey: 'transport_public', amount: Math.round((input.usePublicTransit ? (isStudent ? city.transport.monthlyPassStudent : city.transport.monthlyPassGeneral) : 0) * multiplier) },
        { labelKey: 'transport_rideshare', amount: Math.round(input.rideShareTripsMonthly * city.transport.avgBoltUberTrip * multiplier) },
      ],
    },
    {
      categoryKey: 'lifestyle',
      items: [
        { labelKey: 'lifestyle_gym', amount: Math.round((input.includeGym ? city.lifestyle.gymMonthly : 0) * multiplier) },
        { labelKey: 'lifestyle_leisure', amount: Math.round(baseLeisure * multiplier) },
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
