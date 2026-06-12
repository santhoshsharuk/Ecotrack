import { getItem, setItem, removeItem, saveCalculation, getHistory, deleteHistoryEntry, clearHistory, getLastCalculation } from '../utils/storage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
});

describe('storage utilities', () => {
  describe('getItem / setItem', () => {
    test('stores and retrieves JSON', () => {
      setItem('test_key', { foo: 'bar' });
      expect(getItem('test_key')).toEqual({ foo: 'bar' });
    });

    test('returns null for missing key', () => {
      expect(getItem('nonexistent')).toBeNull();
    });

    test('handles arrays', () => {
      setItem('arr', [1, 2, 3]);
      expect(getItem('arr')).toEqual([1, 2, 3]);
    });
  });

  describe('removeItem', () => {
    test('removes a key', () => {
      setItem('temp', 'value');
      removeItem('temp');
      expect(getItem('temp')).toBeNull();
    });
  });

  describe('saveCalculation / getHistory', () => {
    test('saves and retrieves calculations', () => {
      saveCalculation({ total: 5000, transport: 2000, energy: 1000, diet: 1500, lifestyle: 500 });
      const history = getHistory();
      expect(history.length).toBe(1);
      expect(history[0].total).toBe(5000);
      expect(history[0]).toHaveProperty('id');
      expect(history[0]).toHaveProperty('timestamp');
    });

    test('newest entry is first', () => {
      saveCalculation({ total: 1000 });
      saveCalculation({ total: 2000 });
      const history = getHistory();
      expect(history[0].total).toBe(2000);
      expect(history[1].total).toBe(1000);
    });
  });

  describe('deleteHistoryEntry', () => {
    test('deletes specific entry', () => {
      saveCalculation({ total: 1000 });
      saveCalculation({ total: 2000 });
      const history = getHistory();
      const idToDelete = history[0].id;
      const updated = deleteHistoryEntry(idToDelete);
      expect(updated.length).toBe(1);
      expect(updated[0].total).toBe(1000);
    });

    test('updates lastCalculation when deleting the most recent entry', () => {
      saveCalculation({ total: 1000 });
      const secondEntry = saveCalculation({ total: 2000 });
      expect(getLastCalculation().total).toBe(2000);

      deleteHistoryEntry(secondEntry.id);
      expect(getLastCalculation().total).toBe(1000);
    });

    test('removes lastCalculation completely when last remaining entry is deleted', () => {
      const entry = saveCalculation({ total: 1000 });
      expect(getLastCalculation().total).toBe(1000);

      deleteHistoryEntry(entry.id);
      expect(getLastCalculation()).toBeNull();
    });
  });

  describe('clearHistory', () => {
    test('clears all history', () => {
      saveCalculation({ total: 1000 });
      saveCalculation({ total: 2000 });
      clearHistory();
      expect(getHistory()).toEqual([]);
    });
  });

  describe('getLastCalculation', () => {
    test('returns last saved calculation', () => {
      saveCalculation({ total: 3000 });
      const last = getLastCalculation();
      expect(last.total).toBe(3000);
    });

    test('returns null when no calculations', () => {
      expect(getLastCalculation()).toBeNull();
    });
  });
});
