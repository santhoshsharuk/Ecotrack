import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SuggestionCard from '../components/suggestions/SuggestionCard';
import { getSuggestions } from '../utils/suggestions';
import { getLastCalculation } from '../utils/storage';

/**
 * Suggestions page component.
 * Performs personalized analysis of the latest carbon calculation
 * to serve targeted green options and custom savings opportunities.
 */
export default function Suggestions() {
  const lastCalc = getLastCalculation();
  const [filter, setFilter] = useState('all');

  const suggestions = useMemo(() => {
    if (!lastCalc) return [];
    return getSuggestions(lastCalc, 20);
  }, [lastCalc]);

  const filtered = filter === 'all' ? suggestions : suggestions.filter((s) => s.category === filter);

  const categories = ['all', 'transport', 'energy', 'diet', 'lifestyle'];

  if (!lastCalc) {
    return (
      <main className="container py-5 text-center">
        <h1 className="page-title mb-3">Personalized Suggestions</h1>
        <div className="glass-card p-5 mx-auto" style={{ maxWidth: 500 }}>
          <div className="empty-state-icon mb-3">💡</div>
          <h4>No Data Yet</h4>
          <p className="text-muted mb-4">Complete a calculation first to get personalized eco suggestions.</p>
          <Link to="/calculator" className="btn btn-accent">Calculate Now →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="page-title text-center mb-2">Personalized Suggestions</h1>
      <p className="text-center text-muted mb-4">Based on your most recent footprint calculation</p>

      {/* Filter tabs */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap" role="tablist" aria-label="Filter suggestions by category">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${filter === cat ? 'btn-accent' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(cat)}
            role="tab"
            aria-selected={filter === cat}
            aria-label={`Filter by ${cat}`}
          >
            {cat === 'all' ? '🌐 All' : cat === 'transport' ? '🚗 Transport' : cat === 'energy' ? '⚡ Energy' : cat === 'diet' ? '🥗 Diet' : '🌍 Lifestyle'}
          </button>
        ))}
      </div>

      {/* Potential savings summary */}
      {filtered.length > 0 && (
        <div className="glass-card p-3 mb-4 text-center" role="status">
          <strong className="text-accent">🌱 Total potential savings: {filtered.reduce((sum, s) => sum + s.savings, 0).toLocaleString()} kg CO₂/year</strong>
        </div>
      )}

      {/* Suggestion cards */}
      <div className="row g-4">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <div key={s.id} className="col-12 col-md-6">
              <SuggestionCard suggestion={s} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-4">
            <p className="text-muted">No suggestions for this category. Great job! 🎉</p>
          </div>
        )}
      </div>
    </main>
  );
}
