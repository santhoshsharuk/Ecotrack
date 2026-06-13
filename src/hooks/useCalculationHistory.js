import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './useFirestore';

/**
 * Custom hook to manage carbon calculation history.
 * Coordinates database retrieval, fallback state, and entry deletion.
 * @returns {Object} Hook outputs: history list, loading/error states, operations
 */
export function useCalculationHistory() {
  const [history, setHistory] = useState([]);
  const { getHistory, deleteHistory, loading, error, statusMessage } = useFirestore();

  const fetchHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data || []);
  }, [getHistory]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getHistory();
      if (active) {
        setHistory(data || []);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [getHistory]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this calculation history entry?')) {
      await deleteHistory(id);
      const data = await getHistory();
      setHistory(data || []);
    }
  }, [deleteHistory, getHistory]);

  return {
    history,
    loading,
    error,
    statusMessage,
    handleDelete,
    refreshHistory: fetchHistory,
  };
}
