import { useState } from 'react';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { useChallenges } from '../hooks/useChallenges';
import { getChallengesByCategory } from '../utils/challenges';

/**
 * Challenges page component.
 * Allows users to view, filter, join, progress, and complete various eco challenges.
 */
export default function Challenges() {
  const {
    challenges,
    progress,
    handleJoin,
    handleLeave,
    handleProgress,
    joinedCount,
    completedCount,
  } = useChallenges();

  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const onJoin = (id) => {
    handleJoin(id);
    const challenge = challenges.find((c) => c.id === id);
    showToast(`Joined challenge: ${challenge?.title || 'Eco Challenge'}! 🚀`, 'success');
  };

  const onLeave = (id) => {
    handleLeave(id);
    const challenge = challenges.find((c) => c.id === id);
    showToast(`Left challenge: ${challenge?.title || 'Eco Challenge'}`, 'info');
  };

  const onProgress = (id) => {
    handleProgress(id);
    const challenge = challenges.find((c) => c.id === id);
    const prog = progress[id];
    const completed = (prog?.completed || 0) + 1;
    if (challenge && completed >= challenge.duration) {
      showToast(`🎉 Completed challenge: ${challenge.title}! Amazing job!`, 'success');
    } else {
      showToast(`Logged progress for ${challenge?.title || 'Eco Challenge'}! 🌱`, 'success');
    }
  };

  const filtered = filter === 'all' ? challenges : getChallengesByCategory(filter);

  return (
    <main className="container py-5">
      <h1 className="page-title text-center mb-2">Eco Challenges</h1>
      <p className="text-center text-muted mb-4">Join challenges to build sustainable habits</p>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container-feedback" role="alert" aria-live="assertive">
          <div className="toast-feedback success">
            <span>✨</span>
            <span className="small fw-semibold text-start">{toast.message}</span>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setToast(null)}
              aria-label="Close notification"
              style={{ fontSize: '0.75rem' }}
            ></button>
          </div>
        </div>
      )}

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
            <ChallengeCard challenge={ch} progress={progress[ch.id]} onJoin={onJoin} onLeave={onLeave} onProgress={onProgress} />
          </div>
        ))}
      </div>
    </main>
  );
}
