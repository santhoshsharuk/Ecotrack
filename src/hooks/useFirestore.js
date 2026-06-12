import { useState, useCallback } from 'react';
import {
  saveCalculationToFirestore,
  getCalculationsFromFirestore,
  deleteCalculationFromFirestore,
} from '../firebase/firestore';
import {
  getHistory as getLocalHistory,
  deleteHistoryEntry as deleteLocalHistoryEntry,
  setItem,
  STORAGE_KEYS,
} from '../utils/storage';

export function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

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
      // Fallback / Local storage save
      const localEntry = {
        id: docId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
        timestamp: formattedData.createdAt,
        ...footprintData,
        // Also add the new properties to be fully compatible with either schema
        totalFootprint: formattedData.totalFootprint,
        transportation: formattedData.transportation,
        homeEnergy: formattedData.homeEnergy,
        impactLevel: formattedData.impactLevel,
        createdAt: formattedData.createdAt,
      };

      const history = getLocalHistory() || [];
      if (!history.some((item) => item.id === localEntry.id)) {
        history.unshift(localEntry);
        setItem(STORAGE_KEYS.HISTORY, history);
      }
      setItem(STORAGE_KEYS.LAST_CALCULATION, localEntry);
    } catch (err) {
      console.error('Failed to save locally:', err);
    }

    setLoading(false);
    return savedToFirestore;
  }, []);

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
