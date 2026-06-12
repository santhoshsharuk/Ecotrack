import { useState, useCallback } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import { getAllChallenges } from '../utils/challenges';
import { getChallengeProgress, saveChallengeProgress, removeChallengeProgress } from '../utils/storage';

export default function Challenges() {
  const challenges = getAllChallenges();
  const [progress, setProgress] = useState(() => getChallengeProgress());
  const [filter, setFilter] = useState('all');

  const handleJoin = useCallback((id) => {
    const newProgress = { joined: true, completed: 0, startDate: new Date().toISOString() };
    saveChallengeProgress(id, newProgress);
    setProgress((prev) => ({ ...prev, [id]: newProgress }));
  }, []);

  const handleLeave = useCallback((id) => {
    removeChallengeProgress(id);
    setProgress((prev) => { const next = { ...prev }; delete next[id]; return next; });
  }, []);

  const handleProgress = useCallback((id) => {
    setProgress((prev) => {
      const challenge = challenges.find((c) => c.id === id);
      const current = prev[id] || { joined: true, completed: 0 };
      const updated = { ...current, completed: Math.min(current.completed + 1, challenge?.duration || 999) };
      saveChallengeProgress(id, updated);
      return { ...prev, [id]: updated };
    });
  }, [challenges]);

  const filtered = filter === 'all' ? challenges : challenges.filter((c) => c.category === filter);
  const joinedCount = Object.keys(progress).length;
  const completedCount = Object.entries(progress).filter(([id, p]) => {
    const ch = challenges.find((c) => c.id === id);
    return ch && p.completed >= ch.duration;
  }).length;

  return (
    <main className="container py-5">
      <h1 className="page-title text-center mb-2">Eco Challenges</h1>
      <p className="text-center text-muted mb-4">Join challenges to build sustainable habits</p>

      {/* Stats */}
      <div className="row g-3 mb-4 justify-content-center">
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center">
            <div className="summary-value text-accent">{joinedCount}</div>
            <small className="text-muted">Active</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center">
            <div className="summary-value" style={{ color: '#10b981' }}>{completedCount}</div>
            <small className="text-muted">Completed</small>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap" role="tablist" aria-label="Filter challenges by category">
        {['all', 'transport', 'energy', 'diet', 'lifestyle'].map((cat) => (
          <button key={cat} className={`btn btn-sm ${filter === cat ? 'btn-accent' : 'btn-outline-secondary'}`} onClick={() => setFilter(cat)} role="tab" aria-selected={filter === cat}>
            {cat === 'all' ? '🌐 All' : cat === 'transport' ? '🚗' : cat === 'energy' ? '⚡' : cat === 'diet' ? '🥗' : '🌍'} {cat !== 'all' ? cat : ''}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {filtered.map((ch) => (
          <div key={ch.id} className="col-12 col-md-6 col-lg-4">
            <ChallengeCard challenge={ch} progress={progress[ch.id]} onJoin={handleJoin} onLeave={handleLeave} onProgress={handleProgress} />
          </div>
        ))}
      </div>
    </main>
  );
}
