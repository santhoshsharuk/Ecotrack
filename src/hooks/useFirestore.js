import { useState, useCallback } from 'react';
import {
  saveCalculationToFirestore,
  getCalculationsFromFirestore,
  deleteCalculationFromFirestore,
} from '../firebase/firestore';
import {
  getHistory as getLocalHistory,
  deleteHistoryEntry as deleteLocalHistoryEntry,
  saveCalculation as saveLocalCalculation,
} from '../utils/storage';

/**
 * Custom hook to interface with Firestore for carbon calculations storage,
 * with seamless fallback/synchronization to local storage.
 * @returns {Object} Loading status, errors, and save/get/delete functions
 */
export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  /**
   * Save calculation to database and backup locally
   * @param {Object} footprintData - The calculated footprint breakdown and totals
   * @returns {Promise<boolean>} True if saved to Firestore, false if fallback local storage was used
   */
  const saveCalculation = useCallback(async (footprintData) => {
    setLoading(true);
    setError(null);
    setStatusMessage(null);

    const formattedData = {
      totalFootprint: footprintData.total,
      transportation: footprintData.transport,
      homeEnergy: footprintData.energy,
      diet: footprintData.diet,
      lifestyle: footprintData.lifestyle,
      impactLevel: footprintData.rating,
      createdAt: new Date().toISOString(),
    };

    let docId = null;
    let savedToFirestore = false;

    try {
      docId = await saveCalculationToFirestore(formattedData);
      savedToFirestore = true;
      setStatusMessage('Data saved successfully');
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
      setError('Unable to connect to database');
      setStatusMessage('Using local storage backup');
    }

    try {
      // Local storage save utilizing unified helper
      saveLocalCalculation(footprintData, docId, formattedData.createdAt);
    } catch (err) {
      console.error('Failed to save locally:', err);
    }

    setLoading(false);
    return savedToFirestore;
  }, []);

  /**
   * Fetch all calculations from database, falling back to local storage if offline
   * @returns {Promise<Array<Object>>} List of historical carbon calculation entries
   */
  const getHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const data = await getCalculationsFromFirestore();
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Failed to fetch from Firestore, falling back to LocalStorage:', err);
      setError('Unable to connect to database');
      setStatusMessage('Using local storage backup');

      const localData = getLocalHistory();
      setLoading(false);
      return localData;
    }
  }, []);

  /**
   * Delete a calculation from database and local storage by ID
   * @param {string} id - The ID of the calculation entry to delete
   * @returns {Promise<boolean>} True if deleted from Firestore, false if local only
   */
  const deleteHistory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    setStatusMessage(null);

    let deletedFromFirestore = false;

    try {
      await deleteCalculationFromFirestore(id);
      deletedFromFirestore = true;
      setStatusMessage('Data deleted successfully');
    } catch (err) {
      console.error('Failed to delete from Firestore:', err);
      setError('Unable to connect to database');
      setStatusMessage('Using local storage backup');
    }

    try {
      // Always delete from local storage as well to keep in sync
      deleteLocalHistoryEntry(id);
    } catch (err) {
      console.error('Failed to delete from local storage:', err);
    }

    setLoading(false);
    return deletedFromFirestore;
  }, []);

  return {
    loading,
    error,
    statusMessage,
    saveCalculation,
    getHistory,
    deleteHistory,
  };
}
