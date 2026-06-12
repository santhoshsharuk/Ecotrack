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

/**
 * Calculate transportation emissions (kg CO₂/year)
 */
export function calculateTransportEmissions({ carKmPerWeek = 0, flightHoursPerYear = 0, publicTransitHoursPerWeek = 0 }) {
  const carAnnual = carKmPerWeek * 52 * EMISSION_FACTORS.transport.carPerKm;
  const flightAnnual = flightHoursPerYear * EMISSION_FACTORS.transport.flightPerHour;
  const transitAnnual = publicTransitHoursPerWeek * 52 * EMISSION_FACTORS.transport.publicTransitPerHour;
  return Math.round(carAnnual + flightAnnual + transitAnnual);
}

/**
 * Calculate home energy emissions (kg CO₂/year)
 */
export function calculateEnergyEmissions({ electricityKwhPerMonth = 0, naturalGasThermsPerMonth = 0, renewablePercent = 0 }) {
  const electricityAnnual = electricityKwhPerMonth * 12 * EMISSION_FACTORS.energy.electricityPerKwh;
  const gasAnnual = naturalGasThermsPerMonth * 12 * EMISSION_FACTORS.energy.naturalGasPerTherm;
  const renewableFactor = 1 - (renewablePercent / 100);
  return Math.round((electricityAnnual + gasAnnual) * renewableFactor);
}

/**
 * Calculate diet emissions (kg CO₂/year)
 */
export function calculateDietEmissions({ dietType = 'mixed', foodWasteLevel = 'medium' }) {
  const baseEmissions = EMISSION_FACTORS.diet[dietType] || EMISSION_FACTORS.diet.mixed;
  const wasteMultiplier = foodWasteLevel === 'high' ? 1.25 : foodWasteLevel === 'low' ? 0.9 : 1.0;
  return Math.round(baseEmissions * wasteMultiplier);
}

/**
 * Calculate lifestyle emissions (kg CO₂/year)
 */
export function calculateLifestyleEmissions({ shoppingFrequency = 'medium', recyclingHabit = 'partial', waterUsage = 'medium' }) {
  const shoppingMap = { high: EMISSION_FACTORS.lifestyle.shoppingHigh, medium: EMISSION_FACTORS.lifestyle.shoppingMedium, low: EMISSION_FACTORS.lifestyle.shoppingLow };
  const recyclingMap = { none: EMISSION_FACTORS.lifestyle.recyclingNone, partial: EMISSION_FACTORS.lifestyle.recyclingPartial, full: EMISSION_FACTORS.lifestyle.recyclingFull };
  const waterMap = { high: EMISSION_FACTORS.lifestyle.waterHigh, medium: EMISSION_FACTORS.lifestyle.waterMedium, low: EMISSION_FACTORS.lifestyle.waterLow };

  return (shoppingMap[shoppingFrequency] || 400) + (recyclingMap[recyclingHabit] || 250) + (waterMap[waterUsage] || 200);
}

/**
 * Calculate total carbon footprint
 * Returns breakdown and total in kg CO₂/year
 */
export function calculateTotalFootprint(data) {
  const transport = calculateTransportEmissions(data.transport || {});
  const energy = calculateEnergyEmissions(data.energy || {});
  const diet = calculateDietEmissions(data.diet || {});
  const lifestyle = calculateLifestyleEmissions(data.lifestyle || {});
  const total = transport + energy + diet + lifestyle;

  return {
    transport,
    energy,
    diet,
    lifestyle,
    total,
    comparisonToAverage: Math.round((total / 4000) * 100), // % of global average
    rating: total < 3000 ? 'Excellent' : total < 5000 ? 'Good' : total < 8000 ? 'Average' : 'High',
    ratingColor: total < 3000 ? '#10b981' : total < 5000 ? '#3b82f6' : total < 8000 ? '#f59e0b' : '#ef4444',
  };
}
