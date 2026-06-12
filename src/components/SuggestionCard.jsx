export default function SuggestionCard({ suggestion }) {
  const { icon, title, description, savings, difficulty, category } = suggestion;
  const diffColors = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
  const stars = difficulty === 'easy' ? '⭐' : difficulty === 'medium' ? '⭐⭐' : '⭐⭐⭐';

  return (
    <div className="glass-card suggestion-card p-3 p-md-4 h-100" role="article" aria-label={`Suggestion: ${title}`} tabIndex={0}>
      <div className="d-flex align-items-start gap-3">
        <span className="suggestion-icon" aria-hidden="true">{icon}</span>
        <div className="flex-grow-1">
          <h5 className="suggestion-title mb-1">{title}</h5>
          <span className={`badge bg-opacity-25 text-capitalize mb-2 category-badge category-${category}`}>{category}</span>
          <p className="suggestion-desc text-muted mb-2">{description}</p>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="savings-badge" aria-label={`Save ${savings} kg CO2 per year`}>🌱 Save ~{savings} kg/yr</span>
            <span className="difficulty-badge" style={{ color: diffColors[difficulty] }} aria-label={`Difficulty: ${difficulty}`}>{stars} {difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
