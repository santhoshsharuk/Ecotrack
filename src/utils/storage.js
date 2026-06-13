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
 * @param {string} key - The localStorage key
 * @returns {*} The parsed JSON value, or null if not found or on error
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
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store
 * @returns {boolean} True if successful, false otherwise
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
 * @param {string} key - The localStorage key
 * @returns {boolean} True if successful, false otherwise
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
 * Maps properties for both local and firestore schemas to ensure compatibility.
 * @param {Object} calculation - The calculation data
 * @param {string} [customId] - Optional custom ID (e.g. from firestore)
 * @param {string} [customTimestamp] - Optional custom ISO timestamp
 * @returns {Object} The saved history entry object
 */
export function saveCalculation(calculation, customId = null, customTimestamp = null) {
  const history = getItem(STORAGE_KEYS.HISTORY) || [];

  const total = calculation.totalFootprint ?? calculation.total;
  const transport = calculation.transportation ?? calculation.transport;
  const energy = calculation.homeEnergy ?? calculation.energy;
  const diet = calculation.diet;
  const lifestyle = calculation.lifestyle;
  const rating = calculation.impactLevel ?? calculation.rating;
  const ratingColor = calculation.ratingColor;

  const timestamp = customTimestamp || calculation.createdAt || calculation.timestamp || new Date().toISOString();
  const id = customId || calculation.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));

  const entry = {
    ...calculation,
    id,
    timestamp,

    // Original schema keys
    total,
    transport,
    energy,
    diet,
    lifestyle,
    rating,
    ratingColor,

    // Firestore schema keys for full compatibility
    totalFootprint: total,
    transportation: transport,
    homeEnergy: energy,
    impactLevel: rating,
    createdAt: timestamp,
  };

  // Prevent duplicate ID entry if fallback runs after successful Firestore save
  const existingIndex = history.findIndex((item) => item.id === entry.id);
  if (existingIndex > -1) {
    history[existingIndex] = entry;
  } else {
    history.unshift(entry); // newest first
  }

  setItem(STORAGE_KEYS.HISTORY, history);
  setItem(STORAGE_KEYS.LAST_CALCULATION, entry);
  return entry;
}

/**
 * Get all calculation history
 * @returns {Array<Object>} List of history entries
 */
export function getHistory() {
  return getItem(STORAGE_KEYS.HISTORY) || [];
}

/**
 * Delete a single history entry by ID
 * @param {string} id - The ID of the entry to delete
 * @returns {Array<Object>} The updated history list
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
 * @returns {Object|null} The last calculation object, or null
 */
export function getLastCalculation() {
  return getItem(STORAGE_KEYS.LAST_CALCULATION);
}

// ---- Challenge progress operations ----

/**
 * Get all challenge progress data
 * @returns {Object} Map of challengeId to progress data
 */
export function getChallengeProgress() {
  return getItem(STORAGE_KEYS.CHALLENGES) || {};
}

/**
 * Save progress for a specific challenge
 * @param {string} challengeId - Unique challenge ID
 * @param {Object} progress - Progress object { joined: boolean, completed: number, startDate: string }
 */
export function saveChallengeProgress(challengeId, progress) {
  const allProgress = getChallengeProgress();
  allProgress[challengeId] = progress;
  setItem(STORAGE_KEYS.CHALLENGES, allProgress);
}

/**
 * Remove progress for a specific challenge (leave the challenge)
 * @param {string} challengeId - Unique challenge ID
 */
export function removeChallengeProgress(challengeId) {
  const allProgress = getChallengeProgress();
  delete allProgress[challengeId];
  setItem(STORAGE_KEYS.CHALLENGES, allProgress);
}

// ---- Theme operations ----

/**
 * Get saved theme preference
 * @returns {string} Theme preference ('light' or 'dark')
 */
export function getTheme() {
  return getItem(STORAGE_KEYS.THEME) || 'light';
}

/**
 * Save theme preference
 * @param {string} theme - Theme preference ('light' or 'dark')
 */
export function saveTheme(theme) {
  setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Export history as JSON string (for download)
 * @returns {string} Pretty printed JSON string of all history
 */
export function exportHistoryAsJSON() {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
}

export { STORAGE_KEYS };
