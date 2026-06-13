import { useState, useCallback, useMemo } from 'react';
import { getAllChallenges } from '../utils/challenges';
import { getChallengeProgress, saveChallengeProgress, removeChallengeProgress } from '../utils/storage';

/**
 * Custom hook to manage active eco challenges progress.
 * Separates data fetching and mutation logic from presentation components.
 * @returns {Object} Hook outputs: challenges list, progress map, operations, and counts
 */
export function useChallenges() {
  const challenges = useMemo(() => getAllChallenges(), []);
  const [progress, setProgress] = useState(() => getChallengeProgress());

  const handleJoin = useCallback((id) => {
    const newProgress = { joined: true, completed: 0, startDate: new Date().toISOString() };
    saveChallengeProgress(id, newProgress);
    setProgress((prev) => ({ ...prev, [id]: newProgress }));
  }, []);

  const handleLeave = useCallback((id) => {
    removeChallengeProgress(id);
    setProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleProgress = useCallback((id) => {
    setProgress((prev) => {
      const challenge = challenges.find((c) => c.id === id);
      const current = prev[id] || { joined: true, completed: 0 };
      const updated = {
        ...current,
        completed: Math.min(current.completed + 1, challenge?.duration || 999),
      };
      saveChallengeProgress(id, updated);
      return { ...prev, [id]: updated };
    });
  }, [challenges]);

  const joinedCount = useMemo(() => Object.keys(progress).length, [progress]);

  const completedCount = useMemo(() => {
    return Object.entries(progress).filter(([id, p]) => {
      const ch = challenges.find((c) => c.id === id);
      return ch && p.completed >= ch.duration;
    }).length;
  }, [progress, challenges]);

  return {
    challenges,
    progress,
    handleJoin,
    handleLeave,
    handleProgress,
    joinedCount,
    completedCount,
  };
}
