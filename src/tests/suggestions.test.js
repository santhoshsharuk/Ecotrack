import { getSuggestions, getAllSuggestions, getSuggestionsByCategory } from '../utils/suggestions';

describe('suggestions', () => {
  describe('getSuggestions', () => {
    test('returns empty array for null data', () => {
      expect(getSuggestions(null)).toEqual([]);
    });

    test('returns empty array for invalid data', () => {
      expect(getSuggestions({ foo: 'bar' })).toEqual([]);
    });

    test('returns transport suggestions for high transport emissions', () => {
      const data = { transport: 4000, energy: 500, diet: 1500, lifestyle: 500, total: 6500 };
      const suggestions = getSuggestions(data);
      expect(suggestions.length).toBeGreaterThan(0);
      const hasTransport = suggestions.some((s) => s.category === 'transport');
      expect(hasTransport).toBe(true);
    });

    test('returns diet suggestions for heavy meat eaters', () => {
      const data = { transport: 500, energy: 500, diet: 3500, lifestyle: 500, total: 5000 };
      const suggestions = getSuggestions(data);
      const hasDiet = suggestions.some((s) => s.category === 'diet');
      expect(hasDiet).toBe(true);
    });

    test('respects maxSuggestions limit', () => {
      const data = { transport: 5000, energy: 3000, diet: 4000, lifestyle: 2000, total: 14000 };
      const suggestions = getSuggestions(data, 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });

    test('sorts by savings descending', () => {
      const data = { transport: 5000, energy: 3000, diet: 4000, lifestyle: 2000, total: 14000 };
      const suggestions = getSuggestions(data, 20);
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i - 1].savings).toBeGreaterThanOrEqual(suggestions[i].savings);
      }
    });

    test('does not include condition function in output', () => {
      const data = { transport: 5000, energy: 3000, diet: 4000, lifestyle: 2000, total: 14000 };
      const suggestions = getSuggestions(data);
      suggestions.forEach((s) => {
        expect(s).not.toHaveProperty('condition');
      });
    });
  });

  describe('getAllSuggestions', () => {
    test('returns all suggestions', () => {
      const all = getAllSuggestions();
      expect(all.length).toBeGreaterThan(10);
    });
  });

  describe('getSuggestionsByCategory', () => {
    test('filters by category', () => {
      const transport = getSuggestionsByCategory('transport');
      transport.forEach((s) => expect(s.category).toBe('transport'));
    });
  });
});
