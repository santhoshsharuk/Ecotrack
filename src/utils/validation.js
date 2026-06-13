/**
 * Security validation and sanitization helpers for carbon footprint forms.
 */

const MAX_LIMITS = {
  carKmPerWeek: 5000,
  flightHoursPerYear: 1000,
  publicTransitHoursPerWeek: 168,
  electricityKwhPerMonth: 10000,
  naturalGasThermsPerMonth: 500,
  renewablePercent: 100,
};

const ALLOWED_VALUES = {
  dietType: ['vegan', 'vegetarian', 'mixed', 'heavy-meat'],
  foodWasteLevel: ['low', 'medium', 'high'],
  shoppingFrequency: ['low', 'medium', 'high'],
  recyclingHabit: ['none', 'partial', 'full'],
  waterUsage: ['low', 'medium', 'high'],
};

/**
 * Validate a specific form field value.
 * @param {string} name - Field name
 * @param {*} value - Field value
 * @returns {string|null} Error message or null if valid
 */
export function validateField(name, value) {
  if (value === '' || value === undefined || value === null) {
    return null; // Empty values are valid and will default to 0/neutral in sanitization
  }

  // Check numeric boundaries for fields in MAX_LIMITS
  if (MAX_LIMITS[name] !== undefined) {
    const num = Number(value);
    if (isNaN(num)) {
      return 'Must be a valid number';
    }
    if (!Number.isFinite(num)) {
      return 'Must be a finite number';
    }
    if (num < 0) {
      return 'Value cannot be negative';
    }
    if (num > MAX_LIMITS[name]) {
      return `Maximum allowed value is ${MAX_LIMITS[name]}`;
    }
  }

  // Check enums for fields in ALLOWED_VALUES
  if (ALLOWED_VALUES[name] !== undefined) {
    if (!ALLOWED_VALUES[name].includes(value)) {
      return 'Invalid selection value';
    }
  }

  return null;
}

/**
 * Validate all fields in a specific step of the calculator.
 * @param {string} stepKey - Category key ('transport', 'energy', 'diet', 'lifestyle')
 * @param {Object} stepData - Values map for that step
 * @returns {Object} Map of field names to error messages (empty if valid)
 */
export function validateStep(stepKey, stepData) {
  const errors = {};
  if (!stepData) return errors;

  Object.entries(stepData).forEach(([field, val]) => {
    const err = validateField(field, val);
    if (err) {
      errors[field] = err;
    }
  });

  return errors;
}

/**
 * Sanitize raw user form inputs.
 * Strips unexpected strings, parses digits to non-negative integers within bounds,
 * and restricts select variables to known safe options.
 * @param {Object} rawData - Raw state from form
 * @returns {Object} Cleaned, type-safe data structure matching calculation expectations
 */
export function sanitizeFormData(rawData) {
  const sanitizeNumber = (val, max) => {
    const parsed = Math.floor(Number(val));
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(parsed, max);
  };

  const sanitizeString = (val, allowed, fallback) => {
    if (typeof val !== 'string') return fallback;
    const trimmed = val.trim();
    return allowed.includes(trimmed) ? trimmed : fallback;
  };

  const transport = rawData?.transport || {};
  const energy = rawData?.energy || {};
  const diet = rawData?.diet || {};
  const lifestyle = rawData?.lifestyle || {};

  return {
    transport: {
      carKmPerWeek: sanitizeNumber(transport.carKmPerWeek, MAX_LIMITS.carKmPerWeek),
      flightHoursPerYear: sanitizeNumber(transport.flightHoursPerYear, MAX_LIMITS.flightHoursPerYear),
      publicTransitHoursPerWeek: sanitizeNumber(transport.publicTransitHoursPerWeek, MAX_LIMITS.publicTransitHoursPerWeek),
    },
    energy: {
      electricityKwhPerMonth: sanitizeNumber(energy.electricityKwhPerMonth, MAX_LIMITS.electricityKwhPerMonth),
      naturalGasThermsPerMonth: sanitizeNumber(energy.naturalGasThermsPerMonth, MAX_LIMITS.naturalGasThermsPerMonth),
      renewablePercent: sanitizeNumber(energy.renewablePercent, MAX_LIMITS.renewablePercent),
    },
    diet: {
      dietType: sanitizeString(diet.dietType, ALLOWED_VALUES.dietType, 'mixed'),
      foodWasteLevel: sanitizeString(diet.foodWasteLevel, ALLOWED_VALUES.foodWasteLevel, 'medium'),
    },
    lifestyle: {
      shoppingFrequency: sanitizeString(lifestyle.shoppingFrequency, ALLOWED_VALUES.shoppingFrequency, 'medium'),
      recyclingHabit: sanitizeString(lifestyle.recyclingHabit, ALLOWED_VALUES.recyclingHabit, 'partial'),
      waterUsage: sanitizeString(lifestyle.waterUsage, ALLOWED_VALUES.waterUsage, 'medium'),
    },
  };
}
