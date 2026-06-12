/**
 * Rule-based personalized suggestion engine
 * Analyzes carbon footprint breakdown and returns tailored advice
 */

const ALL_SUGGESTIONS = [
  // Transport suggestions
  {
    id: 'bike-commute',
    category: 'transport',
    title: 'Bike or Walk to Work',
    description: 'Replace short car trips with cycling or walking. A 10km daily bike commute saves over 500 kg CO₂ per year.',
    savings: 500,
    difficulty: 'medium',
    icon: '🚲',
    condition: (data) => data.transport > data.total * 0.3,
  },
  {
    id: 'carpool',
    category: 'transport',
    title: 'Start Carpooling',
    description: 'Share rides with colleagues or neighbors. Carpooling with just one other person halves your per-trip emissions.',
    savings: 400,
    difficulty: 'easy',
    icon: '🚗',
    condition: (data) => data.transport > 2000,
  },
  {
    id: 'ev-switch',
    category: 'transport',
    title: 'Consider an Electric Vehicle',
    description: 'EVs produce zero tailpipe emissions. Even accounting for electricity generation, they\'re 50-70% cleaner than gas cars.',
    savings: 2000,
    difficulty: 'hard',
    icon: '⚡',
    condition: (data) => data.transport > 3000,
  },
  {
    id: 'reduce-flights',
    category: 'transport',
    title: 'Reduce Air Travel',
    description: 'One round-trip transatlantic flight equals ~1,600 kg CO₂. Consider virtual meetings or train alternatives.',
    savings: 1600,
    difficulty: 'medium',
    icon: '✈️',
    condition: (data) => data.transport > data.total * 0.4,
  },
  {
    id: 'public-transit',
    category: 'transport',
    title: 'Use Public Transit More',
    description: 'Buses and trains produce 45-80% fewer emissions per passenger-km than private cars.',
    savings: 600,
    difficulty: 'easy',
    icon: '🚌',
    condition: (data) => data.transport > 1500,
  },

  // Energy suggestions
  {
    id: 'led-bulbs',
    category: 'energy',
    title: 'Switch to LED Lighting',
    description: 'LED bulbs use 75% less energy than incandescent bulbs and last 25x longer.',
    savings: 150,
    difficulty: 'easy',
    icon: '💡',
    condition: (data) => data.energy > 1000,
  },
  {
    id: 'smart-thermostat',
    category: 'energy',
    title: 'Install a Smart Thermostat',
    description: 'Smart thermostats can reduce heating and cooling costs by 10-15%, saving both energy and money.',
    savings: 300,
    difficulty: 'medium',
    icon: '🌡️',
    condition: (data) => data.energy > 1500,
  },
  {
    id: 'solar-panels',
    category: 'energy',
    title: 'Go Solar',
    description: 'Rooftop solar panels can eliminate 80-100% of your electricity carbon footprint. Many areas offer tax incentives.',
    savings: 1500,
    difficulty: 'hard',
    icon: '☀️',
    condition: (data) => data.energy > 2000,
  },
  {
    id: 'energy-audit',
    category: 'energy',
    title: 'Get a Home Energy Audit',
    description: 'Professional energy audits identify inefficiencies. Sealing drafts and insulating can cut energy use by 20-30%.',
    savings: 500,
    difficulty: 'medium',
    icon: '🏠',
    condition: (data) => data.energy > data.total * 0.3,
  },
  {
    id: 'unplug-devices',
    category: 'energy',
    title: 'Unplug Idle Electronics',
    description: 'Standby power ("vampire energy") accounts for 5-10% of household energy use. Use smart power strips.',
    savings: 100,
    difficulty: 'easy',
    icon: '🔌',
    condition: (data) => data.energy > 800,
  },

  // Diet suggestions
  {
    id: 'meatless-days',
    category: 'diet',
    title: 'Try Meatless Mondays',
    description: 'Replacing meat with plant-based meals one day per week can save over 200 kg CO₂ per year.',
    savings: 200,
    difficulty: 'easy',
    icon: '🥗',
    condition: (data) => data.diet > 2500,
  },
  {
    id: 'plant-based',
    category: 'diet',
    title: 'Explore Plant-Based Proteins',
    description: 'Lentils, beans, and tofu produce 10-50x fewer emissions than beef per gram of protein.',
    savings: 800,
    difficulty: 'medium',
    icon: '🌱',
    condition: (data) => data.diet > 3000,
  },
  {
    id: 'reduce-food-waste',
    category: 'diet',
    title: 'Reduce Food Waste',
    description: 'Plan meals, use leftovers creatively, and compost scraps. Food waste in landfills generates methane.',
    savings: 300,
    difficulty: 'easy',
    icon: '♻️',
    condition: (data) => data.diet > 2000,
  },
  {
    id: 'buy-local',
    category: 'diet',
    title: 'Buy Local & Seasonal Produce',
    description: 'Locally sourced food travels fewer miles and supports sustainable farming practices.',
    savings: 150,
    difficulty: 'easy',
    icon: '🧑‍🌾',
    condition: (data) => data.diet > 1800,
  },

  // Lifestyle suggestions
  {
    id: 'recycle-more',
    category: 'lifestyle',
    title: 'Improve Your Recycling Habits',
    description: 'Recycling aluminum cans saves 95% of the energy needed to make new ones. Learn your local recycling rules.',
    savings: 300,
    difficulty: 'easy',
    icon: '♻️',
    condition: (data) => data.lifestyle > 700,
  },
  {
    id: 'sustainable-fashion',
    category: 'lifestyle',
    title: 'Choose Sustainable Fashion',
    description: 'Fast fashion is a major polluter. Buy secondhand, choose quality over quantity, and repair before replacing.',
    savings: 400,
    difficulty: 'medium',
    icon: '👕',
    condition: (data) => data.lifestyle > 600,
  },
  {
    id: 'water-conservation',
    category: 'lifestyle',
    title: 'Conserve Water',
    description: 'Shorter showers, fixing leaks, and efficient appliances reduce both water use and the energy to heat/treat it.',
    savings: 150,
    difficulty: 'easy',
    icon: '💧',
    condition: (data) => data.lifestyle > 500,
  },
  {
    id: 'composting',
    category: 'lifestyle',
    title: 'Start Composting',
    description: 'Composting organic waste prevents methane emissions from landfills and creates free fertilizer for gardens.',
    savings: 200,
    difficulty: 'medium',
    icon: '🪱',
    condition: (data) => data.lifestyle > 400,
  },
];

/**
 * Helper to remove the condition function from suggestion objects for export
 */
function removeCondition(suggestion) {
  const copy = { ...suggestion };
  delete copy.condition;
  return copy;
}

/**
 * Get personalized suggestions based on footprint data
 * @param {Object} footprintData - { transport, energy, diet, lifestyle, total }
 * @param {number} maxSuggestions - max number of suggestions to return
 * @returns {Array} filtered and sorted suggestions
 */
export function getSuggestions(footprintData, maxSuggestions = 8) {
  if (!footprintData || typeof footprintData.total !== 'number') {
    return [];
  }

  const matching = ALL_SUGGESTIONS
    .filter((s) => s.condition(footprintData))
    .sort((a, b) => b.savings - a.savings)
    .slice(0, maxSuggestions)
    .map(removeCondition);

  return matching;
}

/**
 * Get all suggestions (unfiltered) for reference
 */
export function getAllSuggestions() {
  return ALL_SUGGESTIONS.map(removeCondition);
}

/**
 * Get suggestions for a specific category
 */
export function getSuggestionsByCategory(category) {
  return ALL_SUGGESTIONS
    .filter((s) => s.category === category)
    .map(removeCondition);
}
