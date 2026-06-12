import { getAllChallenges, getChallengeById, calculateProgress, isChallengeComplete, getChallengesByCategory } from '../utils/challenges';

describe('challenges', () => {
  describe('getAllChallenges', () => {
    test('returns all challenges', () => {
      const challenges = getAllChallenges();
      expect(challenges.length).toBeGreaterThan(0);
      challenges.forEach((c) => {
        expect(c).toHaveProperty('id');
        expect(c).toHaveProperty('title');
        expect(c).toHaveProperty('duration');
        expect(c).toHaveProperty('co2Savings');
      });
    });
  });

  describe('getChallengeById', () => {
    test('returns correct challenge', () => {
      const c = getChallengeById('meatless-week');
      expect(c).not.toBeNull();
      expect(c.title).toBe('Meatless Monday Champion');
    });

    test('returns null for unknown id', () => {
      expect(getChallengeById('nonexistent')).toBeNull();
    });
  });

  describe('calculateProgress', () => {
    test('returns 0 for 0 completed', () => {
      expect(calculateProgress(0, 10)).toBe(0);
    });

    test('returns 50 for half completed', () => {
      expect(calculateProgress(5, 10)).toBe(50);
    });

    test('returns 100 for fully completed', () => {
      expect(calculateProgress(10, 10)).toBe(100);
    });

    test('caps at 100 for over-completed', () => {
      expect(calculateProgress(15, 10)).toBe(100);
    });

    test('returns 0 for 0 total', () => {
      expect(calculateProgress(5, 0)).toBe(0);
    });
  });

  describe('isChallengeComplete', () => {
    test('returns false when not complete', () => {
      expect(isChallengeComplete(3, 5)).toBe(false);
    });

    test('returns true when exactly complete', () => {
      expect(isChallengeComplete(5, 5)).toBe(true);
    });

    test('returns true when over complete', () => {
      expect(isChallengeComplete(7, 5)).toBe(true);
    });
  });

  describe('getChallengesByCategory', () => {
    test('filters by category', () => {
      const energy = getChallengesByCategory('energy');
      expect(energy.length).toBeGreaterThan(0);
      energy.forEach((c) => expect(c.category).toBe('energy'));
    });
  });
});
