/**
 * Gamification utility helpers for EcoTrack.
 * Defines badges, milestones, and provides logic to calculate unlock status
 * based on calculation history and challenges progress.
 */

export const BADGES_METADATA = [
  {
    id: 'eco-beginner',
    title: 'Eco Beginner',
    icon: '🌱',
    description: 'Awarded for taking your first step towards sustainability by logging your carbon footprint.',
    requirementText: 'Log at least 1 calculation',
  },
  {
    id: 'eco-warrior',
    title: 'Eco Warrior',
    icon: '🛡️',
    description: 'Awarded for actively tracking footprint history and engaging in sustainability challenges.',
    requirementText: 'Log at least 3 calculations and join at least 1 challenge',
  },
  {
    id: 'eco-champion',
    title: 'Eco Champion',
    icon: '🏆',
    description: 'Awarded for achieving top-tier sustainability achievements and maintaining a low emission rating.',
    requirementText: 'Log at least 5 calculations, complete at least 1 challenge, and achieve a "Good" or "Excellent" latest rating',
  },
];

/**
 * Calculates badges and milestones status based on calculations and challenges progress
 * @param {Array<Object>} normalizedHistory - List of normalized historical calculations (latest first)
 * @param {Object} challengeProgress - Map of challenge progress
 * @param {Array<Object>} challenges - List of all challenge definitions
 * @returns {Object} Gamification status containing badges list and milestones list
 */
export function calculateGamificationState(normalizedHistory = [], challengeProgress = {}, challenges = []) {
  const calculationsCount = normalizedHistory.length;
  const challengesJoined = Object.keys(challengeProgress).length;

  const challengesCompleted = Object.entries(challengeProgress).filter(([id, p]) => {
    const ch = challenges.find((c) => c.id === id);
    return ch && p.completed >= ch.duration;
  }).length;

  const latestCalc = normalizedHistory[0] || null;
  const latestRating = latestCalc ? (latestCalc.rating || latestCalc.impactLevel) : null;
  const hasGoodOrExcellentRating = latestRating === 'Good' || latestRating === 'Excellent';

  // Badge unlock conditions
  const badges = BADGES_METADATA.map((badge) => {
    let unlocked = false;
    if (badge.id === 'eco-beginner') {
      unlocked = calculationsCount >= 1;
    } else if (badge.id === 'eco-warrior') {
      unlocked = calculationsCount >= 3 && challengesJoined >= 1;
    } else if (badge.id === 'eco-champion') {
      unlocked = calculationsCount >= 5 && challengesCompleted >= 1 && hasGoodOrExcellentRating;
    }

    return {
      ...badge,
      unlocked,
    };
  });

  // Milestone tracking
  const milestones = [
    {
      id: 'calculations-logged',
      title: 'Carbon Tracking Consistency',
      description: 'Log your footprint to build awareness.',
      current: calculationsCount,
      target: 5,
      unit: 'calculations',
      percent: Math.min(Math.round((calculationsCount / 5) * 100), 100),
      completed: calculationsCount >= 5,
    },
    {
      id: 'challenges-joined',
      title: 'Habit Enrollment',
      description: 'Join eco challenges to build active habits.',
      current: challengesJoined,
      target: 2,
      unit: 'challenges joined',
      percent: Math.min(Math.round((challengesJoined / 2) * 100), 100),
      completed: challengesJoined >= 2,
    },
    {
      id: 'challenges-completed',
      title: 'Habit Mastery',
      description: 'Complete at least 1 challenge.',
      current: challengesCompleted,
      target: 1,
      unit: 'challenges completed',
      percent: Math.min(Math.round((challengesCompleted / 1) * 100), 100),
      completed: challengesCompleted >= 1,
    },
    {
      id: 'green-rating',
      title: 'Emission Target Quality',
      description: 'Achieve a "Good" or "Excellent" rating on your latest log.',
      current: hasGoodOrExcellentRating ? 'Achieved' : (latestRating ? `Latest: ${latestRating}` : 'No logs'),
      target: 'Good or Excellent',
      percent: hasGoodOrExcellentRating ? 100 : 0,
      completed: hasGoodOrExcellentRating,
    },
  ];

  return {
    badges,
    milestones,
  };
}
