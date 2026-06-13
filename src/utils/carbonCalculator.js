/**
 * Carbon Footprint Calculator
 * Emission factors based on EPA and IPCC data (kg CO₂ per unit)
 */

export const EMISSION_FACTORS = {
  transport: {
    carPerKm: 0.21,           // kg CO₂ per km (average gasoline car)
    flightPerHour: 250,        // kg CO₂ per flight hour
    publicTransitPerHour: 4.0, // kg CO₂ per hour of public transit
  },
  energy: {
    electricityPerKwh: 0.42,   // kg CO₂ per kWh (US average)
    naturalGasPerTherm: 5.3,   // kg CO₂ per therm
  },
  diet: {
    vegan: 1500,               // kg CO₂ per year
    vegetarian: 1700,
    mixed: 2500,
    'heavy-meat': 3300,
  },
  lifestyle: {
    shoppingHigh: 800,         // kg CO₂ per year
    shoppingMedium: 400,
    shoppingLow: 200,
    recyclingNone: 500,
    recyclingPartial: 250,
    recyclingFull: 100,
    waterHigh: 400,
    waterMedium: 200,
    waterLow: 100,
  },
};

// Named Constants to eliminate magic numbers
export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;
export const PERCENT_DIVISOR = 100;
export const GLOBAL_AVERAGE_FOOTPRINT = 4000;

export const RATING_THRESHOLDS = {
  EXCELLENT: 3000,
  GOOD: 5000,
  AVERAGE: 8000,
};

export const RATING_COLORS = {
  Excellent: '#10b981',
  Good: '#3b82f6',
  Average: '#f59e0b',
  High: '#ef4444',
  Default: '#6b7280',
};

export const DIET_WASTE_MULTIPLIERS = {
  high: 1.25,
  low: 0.9,
  medium: 1.0,
};

/**
 * Get color corresponding to carbon rating
 * @param {string} rating - The carbon rating
 * @returns {string} The hex color code
 */
export function getRatingColor(rating) {
  return RATING_COLORS[rating] || RATING_COLORS.Default;
}

/**
 * Calculate transportation emissions (kg CO₂/year)
 * @param {Object} params
 * @param {number} [params.carKmPerWeek=0] - Kilometers driven per week
 * @param {number} [params.flightHoursPerYear=0] - Flight hours per year
 * @param {number} [params.publicTransitHoursPerWeek=0] - Hours of public transit per week
 * @returns {number} Rounded annual carbon emissions in kg CO₂
 */
export function calculateTransportEmissions({ carKmPerWeek = 0, flightHoursPerYear = 0, publicTransitHoursPerWeek = 0 }) {
  const carAnnual = carKmPerWeek * WEEKS_PER_YEAR * EMISSION_FACTORS.transport.carPerKm;
  const flightAnnual = flightHoursPerYear * EMISSION_FACTORS.transport.flightPerHour;
  const transitAnnual = publicTransitHoursPerWeek * WEEKS_PER_YEAR * EMISSION_FACTORS.transport.publicTransitPerHour;
  return Math.round(carAnnual + flightAnnual + transitAnnual);
}

/**
 * Calculate home energy emissions (kg CO₂/year)
 * @param {Object} params
 * @param {number} [params.electricityKwhPerMonth=0] - Electricity usage in kWh per month
 * @param {number} [params.naturalGasThermsPerMonth=0] - Natural gas usage in therms per month
 * @param {number} [params.renewablePercent=0] - Percentage of energy from renewable sources
 * @returns {number} Rounded annual carbon emissions in kg CO₂
 */
export function calculateEnergyEmissions({ electricityKwhPerMonth = 0, naturalGasThermsPerMonth = 0, renewablePercent = 0 }) {
  const electricityAnnual = electricityKwhPerMonth * MONTHS_PER_YEAR * EMISSION_FACTORS.energy.electricityPerKwh;
  const gasAnnual = naturalGasThermsPerMonth * MONTHS_PER_YEAR * EMISSION_FACTORS.energy.naturalGasPerTherm;
  const renewableFactor = 1 - (renewablePercent / PERCENT_DIVISOR);
  return Math.round((electricityAnnual + gasAnnual) * renewableFactor);
}

/**
 * Calculate diet emissions (kg CO₂/year)
 * @param {Object} params
 * @param {string} [params.dietType='mixed'] - Type of diet (e.g., 'vegan', 'vegetarian', 'mixed', 'heavy-meat')
 * @param {string} [params.foodWasteLevel='medium'] - Level of food waste ('high', 'medium', 'low')
 * @returns {number} Rounded annual carbon emissions in kg CO₂
 */
export function calculateDietEmissions({ dietType = 'mixed', foodWasteLevel = 'medium' }) {
  const baseEmissions = EMISSION_FACTORS.diet[dietType] || EMISSION_FACTORS.diet.mixed;
  const wasteMultiplier = DIET_WASTE_MULTIPLIERS[foodWasteLevel] ?? DIET_WASTE_MULTIPLIERS.medium;
  return Math.round(baseEmissions * wasteMultiplier);
}

/**
 * Calculate lifestyle emissions (kg CO₂/year)
 * @param {Object} params
 * @param {string} [params.shoppingFrequency='medium'] - Shopping frequency ('high', 'medium', 'low')
 * @param {string} [params.recyclingHabit='partial'] - Recycling habit ('none', 'partial', 'full')
 * @param {string} [params.waterUsage='medium'] - Water usage ('high', 'medium', 'low')
 * @returns {number} Annual carbon emissions in kg CO₂
 */
export function calculateLifestyleEmissions({ shoppingFrequency = 'medium', recyclingHabit = 'partial', waterUsage = 'medium' }) {
  const shoppingMap = {
    high: EMISSION_FACTORS.lifestyle.shoppingHigh,
    medium: EMISSION_FACTORS.lifestyle.shoppingMedium,
    low: EMISSION_FACTORS.lifestyle.shoppingLow,
  };
  const recyclingMap = {
    none: EMISSION_FACTORS.lifestyle.recyclingNone,
    partial: EMISSION_FACTORS.lifestyle.recyclingPartial,
    full: EMISSION_FACTORS.lifestyle.recyclingFull,
  };
  const waterMap = {
    high: EMISSION_FACTORS.lifestyle.waterHigh,
    medium: EMISSION_FACTORS.lifestyle.waterMedium,
    low: EMISSION_FACTORS.lifestyle.waterLow,
  };

  const defaultShopping = EMISSION_FACTORS.lifestyle.shoppingMedium;
  const defaultRecycling = EMISSION_FACTORS.lifestyle.recyclingPartial;
  const defaultWater = EMISSION_FACTORS.lifestyle.waterMedium;

  return (
    (shoppingMap[shoppingFrequency] ?? defaultShopping) +
    (recyclingMap[recyclingHabit] ?? defaultRecycling) +
    (waterMap[waterUsage] ?? defaultWater)
  );
}

/**
 * Calculate total carbon footprint and provide rating/comparison
 * @param {Object} data - Form data with transport, energy, diet, and lifestyle entries
 * @returns {Object} Total footprint details including category breakdown, rating, and ratingColor
 */
export function calculateTotalFootprint(data) {
  const transport = calculateTransportEmissions(data.transport || {});
  const energy = calculateEnergyEmissions(data.energy || {});
  const diet = calculateDietEmissions(data.diet || {});
  const lifestyle = calculateLifestyleEmissions(data.lifestyle || {});
  const total = transport + energy + diet + lifestyle;

  const comparisonToAverage = Math.round((total / GLOBAL_AVERAGE_FOOTPRINT) * PERCENT_DIVISOR);
  
  let rating = 'High';
  if (total < RATING_THRESHOLDS.EXCELLENT) {
    rating = 'Excellent';
  } else if (total < RATING_THRESHOLDS.GOOD) {
    rating = 'Good';
  } else if (total < RATING_THRESHOLDS.AVERAGE) {
    rating = 'Average';
  }

  return {
    transport,
    energy,
    diet,
    lifestyle,
    total,
    comparisonToAverage,
    rating,
    ratingColor: getRatingColor(rating),
  };
}
