import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateDietEmissions,
  calculateLifestyleEmissions,
  calculateTotalFootprint,
  EMISSION_FACTORS,
} from '../utils/carbonCalculator';

describe('carbonCalculator', () => {
  describe('calculateTransportEmissions', () => {
    test('returns 0 for zero inputs', () => {
      expect(calculateTransportEmissions({})).toBe(0);
    });

    test('calculates car emissions correctly', () => {
      const result = calculateTransportEmissions({ carKmPerWeek: 100 });
      // 100 km * 52 weeks * 0.21 kg/km = 1092
      expect(result).toBe(1092);
    });

    test('calculates flight emissions correctly', () => {
      const result = calculateTransportEmissions({ flightHoursPerYear: 10 });
      // 10 hours * 250 kg/hour = 2500
      expect(result).toBe(2500);
    });

    test('calculates combined transport emissions', () => {
      const result = calculateTransportEmissions({
        carKmPerWeek: 50,
        flightHoursPerYear: 4,
        publicTransitHoursPerWeek: 5,
      });
      // car: 50*52*0.21=546, flight: 4*250=1000, transit: 5*52*4=1040
      expect(result).toBe(546 + 1000 + 1040);
    });
  });

  describe('calculateEnergyEmissions', () => {
    test('returns 0 for zero inputs', () => {
      expect(calculateEnergyEmissions({})).toBe(0);
    });

    test('calculates electricity emissions', () => {
      const result = calculateEnergyEmissions({ electricityKwhPerMonth: 900 });
      // 900 * 12 * 0.42 = 4536
      expect(result).toBe(4536);
    });

    test('applies renewable energy reduction', () => {
      const full = calculateEnergyEmissions({ electricityKwhPerMonth: 900, renewablePercent: 0 });
      const half = calculateEnergyEmissions({ electricityKwhPerMonth: 900, renewablePercent: 50 });
      expect(half).toBe(Math.round(full * 0.5));
    });

    test('100% renewable = 0 emissions', () => {
      const result = calculateEnergyEmissions({ electricityKwhPerMonth: 900, renewablePercent: 100 });
      expect(result).toBe(0);
    });
  });

  describe('calculateDietEmissions', () => {
    test('returns mixed diet as default', () => {
      const result = calculateDietEmissions({});
      expect(result).toBe(EMISSION_FACTORS.diet.mixed);
    });

    test('vegan is lower than heavy-meat', () => {
      const vegan = calculateDietEmissions({ dietType: 'vegan' });
      const meat = calculateDietEmissions({ dietType: 'heavy-meat' });
      expect(vegan).toBeLessThan(meat);
    });

    test('high food waste increases emissions', () => {
      const base = calculateDietEmissions({ dietType: 'mixed', foodWasteLevel: 'medium' });
      const high = calculateDietEmissions({ dietType: 'mixed', foodWasteLevel: 'high' });
      expect(high).toBeGreaterThan(base);
    });
  });

  describe('calculateLifestyleEmissions', () => {
    test('returns default for empty inputs', () => {
      const result = calculateLifestyleEmissions({});
      expect(result).toBe(400 + 250 + 200); // medium defaults
    });

    test('high everything is highest', () => {
      const high = calculateLifestyleEmissions({ shoppingFrequency: 'high', recyclingHabit: 'none', waterUsage: 'high' });
      const low = calculateLifestyleEmissions({ shoppingFrequency: 'low', recyclingHabit: 'full', waterUsage: 'low' });
      expect(high).toBeGreaterThan(low);
    });
  });

  describe('calculateTotalFootprint', () => {
    test('returns all categories and total', () => {
      const result = calculateTotalFootprint({
        transport: { carKmPerWeek: 50 },
        energy: { electricityKwhPerMonth: 500 },
        diet: { dietType: 'mixed' },
        lifestyle: { shoppingFrequency: 'medium' },
      });

      expect(result).toHaveProperty('transport');
      expect(result).toHaveProperty('energy');
      expect(result).toHaveProperty('diet');
      expect(result).toHaveProperty('lifestyle');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('ratingColor');
      expect(result).toHaveProperty('comparisonToAverage');
      expect(result.total).toBe(result.transport + result.energy + result.diet + result.lifestyle);
    });

    test('assigns correct ratings', () => {
      // Force a low total
      const low = calculateTotalFootprint({
        transport: {},
        energy: {},
        diet: { dietType: 'vegan', foodWasteLevel: 'low' },
        lifestyle: { shoppingFrequency: 'low', recyclingHabit: 'full', waterUsage: 'low' },
      });
      expect(low.rating).toBe('Excellent');
    });
  });
});
