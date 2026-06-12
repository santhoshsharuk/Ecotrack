/**
 * Eco Challenges — definitions and progress tracking logic
 */

export const CHALLENGES = [
  {
    id: 'meatless-week',
    title: 'Meatless Monday Champion',
    description: 'Go meat-free every Monday for a month. Track each Monday you complete!',
    category: 'diet',
    duration: 4,
    unit: 'Mondays',
    icon: '🥬',
    co2Savings: 50,
    difficulty: 'easy',
    tips: ['Try bean burritos', 'Explore Indian dal recipes', 'Make a hearty veggie soup'],
  },
  {
    id: 'bike-week',
    title: 'Bike to Work Week',
    description: 'Cycle to work every day for 5 consecutive days instead of driving.',
    category: 'transport',
    duration: 5,
    unit: 'days',
    icon: '🚴',
    co2Savings: 30,
    difficulty: 'medium',
    tips: ['Plan your route in advance', 'Check your tires the night before', 'Pack a change of clothes'],
  },
  {
    id: 'zero-waste-month',
    title: 'Zero Waste Challenge',
    description: 'Minimize your waste output for 30 days. Refuse, reduce, reuse, recycle, rot!',
    category: 'lifestyle',
    duration: 30,
    unit: 'days',
    icon: '♻️',
    co2Savings: 100,
    difficulty: 'hard',
    tips: ['Bring reusable bags everywhere', 'Say no to single-use plastics', 'Compost food scraps'],
  },
  {
    id: 'cold-shower',
    title: 'Cold Shower Challenge',
    description: 'Take cold showers for 7 days to reduce water heating energy.',
    category: 'energy',
    duration: 7,
    unit: 'days',
    icon: '🚿',
    co2Savings: 15,
    difficulty: 'medium',
    tips: ['Start with lukewarm and gradually decrease', 'Focus on breathing', 'End with 30 seconds of cold'],
  },
  {
    id: 'screen-free-evenings',
    title: 'Screen-Free Evenings',
    description: 'Turn off all screens after 8 PM for 14 days. Save electricity and sleep better!',
    category: 'energy',
    duration: 14,
    unit: 'days',
    icon: '📵',
    co2Savings: 20,
    difficulty: 'medium',
    tips: ['Read a book instead', 'Try board games', 'Practice meditation'],
  },
  {
    id: 'local-food',
    title: 'Eat Local for Two Weeks',
    description: 'Source all your food from local producers for 14 days. Reduce food miles!',
    category: 'diet',
    duration: 14,
    unit: 'days',
    icon: '🧑‍🌾',
    co2Savings: 40,
    difficulty: 'medium',
    tips: ['Visit your local farmers market', 'Join a CSA program', 'Grow herbs on your windowsill'],
  },
  {
    id: 'public-transit-month',
    title: 'Public Transit Month',
    description: 'Use only public transportation for an entire month. No personal car trips!',
    category: 'transport',
    duration: 30,
    unit: 'days',
    icon: '🚌',
    co2Savings: 200,
    difficulty: 'hard',
    tips: ['Download your local transit app', 'Plan routes the night before', 'Bring a book for the commute'],
  },
  {
    id: 'energy-fast',
    title: 'Weekend Energy Fast',
    description: 'Minimize electricity usage for 4 weekends. Unplug appliances, use natural light!',
    category: 'energy',
    duration: 4,
    unit: 'weekends',
    icon: '🔋',
    co2Savings: 25,
    difficulty: 'easy',
    tips: ['Open curtains for natural light', 'Cook on a grill outside', 'Spend time outdoors'],
  },
];

/**
 * Get all available challenges
 */
export function getAllChallenges() {
  return CHALLENGES;
}

/**
 * Get a challenge by ID
 */
export function getChallengeById(id) {
  return CHALLENGES.find((c) => c.id === id) || null;
}

/**
 * Calculate progress percentage
 * @param {number} completed - number of units completed
 * @param {number} total - total units required
 * @returns {number} percentage (0-100)
 */
export function calculateProgress(completed, total) {
  if (total <= 0) return 0;
  return Math.min(Math.round((completed / total) * 100), 100);
}

/**
 * Check if a challenge is complete
 */
export function isChallengeComplete(completed, total) {
  return completed >= total;
}

/**
 * Get challenges filtered by category
 */
export function getChallengesByCategory(category) {
  return CHALLENGES.filter((c) => c.category === category);
}

/**
 * Get challenges filtered by difficulty
 */
export function getChallengesByDifficulty(difficulty) {
  return CHALLENGES.filter((c) => c.difficulty === difficulty);
}
