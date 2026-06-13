import { calculateGamificationState } from '../utils/gamification';

describe('Gamification Utility Tests', () => {
  const challengesList = [
    { id: 'meatless-week', duration: 4 },
    { id: 'bike-week', duration: 5 },
    { id: 'cold-shower', duration: 7 }
  ];

  test('should return all badges locked and zero progress milestones for empty inputs', () => {
    const { badges, milestones } = calculateGamificationState([], {}, challengesList);

    badges.forEach((badge) => {
      expect(badge.unlocked).toBe(false);
    });

    const calcsMilestone = milestones.find((m) => m.id === 'calculations-logged');
    expect(calcsMilestone.current).toBe(0);
    expect(calcsMilestone.percent).toBe(0);
    expect(calcsMilestone.completed).toBe(false);
  });

  test('should unlock Eco Beginner badge when 1 calculation is logged', () => {
    const history = [{ total: 4500, rating: 'Average' }];
    const { badges } = calculateGamificationState(history, {}, challengesList);

    const beginner = badges.find((b) => b.id === 'eco-beginner');
    const warrior = badges.find((b) => b.id === 'eco-warrior');
    const champion = badges.find((b) => b.id === 'eco-champion');

    expect(beginner.unlocked).toBe(true);
    expect(warrior.unlocked).toBe(false);
    expect(champion.unlocked).toBe(false);
  });

  test('should unlock Eco Warrior when calculations >= 3 and at least 1 challenge is joined', () => {
    const history = [
      { total: 4500, rating: 'Average' },
      { total: 5500, rating: 'Average' },
      { total: 6000, rating: 'Average' },
    ];
    const progress = { 'meatless-week': { joined: true, completed: 2 } };

    const { badges } = calculateGamificationState(history, progress, challengesList);

    const beginner = badges.find((b) => b.id === 'eco-beginner');
    const warrior = badges.find((b) => b.id === 'eco-warrior');
    const champion = badges.find((b) => b.id === 'eco-champion');

    expect(beginner.unlocked).toBe(true);
    expect(warrior.unlocked).toBe(true);
    expect(champion.unlocked).toBe(false);
  });

  test('should unlock Eco Champion when calculations >= 5, 1 challenge is completed, and latest rating is Good/Excellent', () => {
    const history = [
      { total: 2500, rating: 'Excellent' },
      { total: 4500, rating: 'Good' },
      { total: 5500, rating: 'Average' },
      { total: 6000, rating: 'Average' },
      { total: 6500, rating: 'Average' },
    ];
    // Completed meatless-week challenge (completed = duration = 4)
    const progress = { 'meatless-week': { joined: true, completed: 4 } };

    const { badges, milestones } = calculateGamificationState(history, progress, challengesList);

    const beginner = badges.find((b) => b.id === 'eco-beginner');
    const warrior = badges.find((b) => b.id === 'eco-warrior');
    const champion = badges.find((b) => b.id === 'eco-champion');

    expect(beginner.unlocked).toBe(true);
    expect(warrior.unlocked).toBe(true);
    expect(champion.unlocked).toBe(true);

    const ratingMilestone = milestones.find((m) => m.id === 'green-rating');
    expect(ratingMilestone.completed).toBe(true);
    expect(ratingMilestone.percent).toBe(100);
  });
});
