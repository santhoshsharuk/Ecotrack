/**
 * LocalStorage utility helpers for EcoTrack
 */

const STORAGE_KEYS = {
  HISTORY: 'ecotrack_history',
  CHALLENGES: 'ecotrack_challenges',
  THEME: 'ecotrack_theme',
  LAST_CALCULATION: 'ecotrack_last_calculation',
};

/**
 * Safely get a JSON value from localStorage
 */
export function getItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return null;
  }
}

/**
 * Safely set a JSON value in localStorage
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove a key from localStorage
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

// ---- History operations ----

/**
 * Save a carbon footprint calculation to history
 */
export function saveCalculation(calculation) {
  const history = getItem(STORAGE_KEYS.HISTORY) || [];
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    timestamp: new Date().toISOString(),
    ...calculation,
  };
  history.unshift(entry); // newest first
  setItem(STORAGE_KEYS.HISTORY, history);
  setItem(STORAGE_KEYS.LAST_CALCULATION, entry);
  return entry;
}

/**
 * Get all calculation history
 */
export function getHistory() {
  return getItem(STORAGE_KEYS.HISTORY) || [];
}

/**
 * Delete a single history entry by ID
 */
export function deleteHistoryEntry(id) {
  const history = getHistory().filter((entry) => entry.id !== id);
  setItem(STORAGE_KEYS.HISTORY, history);

  // If the deleted calculation was the last calculation, update it
  const lastCalc = getLastCalculation();
  if (lastCalc && lastCalc.id === id) {
    if (history.length > 0) {
      setItem(STORAGE_KEYS.LAST_CALCULATION, history[0]);
    } else {
      removeItem(STORAGE_KEYS.LAST_CALCULATION);
    }
  }

  return history;
}

/**
 * Clear all history
 */
export function clearHistory() {
  removeItem(STORAGE_KEYS.HISTORY);
  removeItem(STORAGE_KEYS.LAST_CALCULATION);
}

/**
 * Get the most recent calculation
 */
export function getLastCalculation() {
  return getItem(STORAGE_KEYS.LAST_CALCULATION);
}

// ---- Challenge progress operations ----

/**
 * Get all challenge progress data
 */
export function getChallengeProgress() {
  return getItem(STORAGE_KEYS.CHALLENGES) || {};
}

/**
 * Save progress for a specific challenge
 * @param {string} challengeId
 * @param {Object} progress - { joined: boolean, completed: number, startDate: string }
 */
export function saveChallengeProgress(challengeId, progress) {
  const allProgress = getChallengeProgress();
  allProgress[challengeId] = progress;
  setItem(STORAGE_KEYS.CHALLENGES, allProgress);
}

/**
 * Remove progress for a specific challenge (leave the challenge)
 */
export function removeChallengeProgress(challengeId) {
  const allProgress = getChallengeProgress();
  delete allProgress[challengeId];
  setItem(STORAGE_KEYS.CHALLENGES, allProgress);
}

// ---- Theme operations ----

/**
 * Get saved theme preference
 */
export function getTheme() {
  return getItem(STORAGE_KEYS.THEME) || 'light';
}

/**
 * Save theme preference
 */
export function saveTheme(theme) {
  setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Export history as JSON string (for download)
 */
export function exportHistoryAsJSON() {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
}

export { STORAGE_KEYS };
