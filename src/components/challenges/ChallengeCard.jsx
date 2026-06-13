import { calculateProgress, isChallengeComplete, DIFFICULTY_COLORS } from '../../utils/challenges';

export default function ChallengeCard({ challenge, progress, onJoin, onLeave, onProgress }) {
  const { id, title, description, icon, duration, unit, co2Savings, difficulty, tips } = challenge;
  const isJoined = progress?.joined;
  const completed = progress?.completed || 0;
  const percent = calculateProgress(completed, duration);
  const isComplete = isChallengeComplete(completed, duration);

  return (
    <div className={`glass-card challenge-card p-3 p-md-4 h-100 ${isComplete ? 'challenge-complete' : ''}`} role="article" aria-label={`Challenge: ${title}`} tabIndex={0}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="challenge-icon" aria-hidden="true">{icon}</span>
        {isComplete && <span className="badge bg-success">✅ Completed!</span>}
      </div>
      <h5 className="challenge-title">{title}</h5>
      <p className="text-muted small mb-2">{description}</p>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <span className="badge" style={{ backgroundColor: DIFFICULTY_COLORS[difficulty] + '22', color: DIFFICULTY_COLORS[difficulty] }}>{difficulty}</span>
        <span className="badge bg-accent-subtle">🌱 {co2Savings} kg CO₂</span>
        <span className="badge bg-secondary-subtle text-secondary">{duration} {unit}</span>
      </div>

      {isJoined && (
        <>
          <div className="progress mb-2" style={{ height: '10px' }} role="progressbar" aria-label={`Progress: ${percent}%`} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar bg-accent" style={{ width: `${percent}%` }}></div>
          </div>
          <small className="text-muted d-block mb-3">{completed} / {duration} {unit} completed</small>
          {tips && tips.length > 0 && (
            <details className="mb-3">
              <summary className="small text-accent" style={{ cursor: 'pointer' }}>💡 Tips</summary>
              <ul className="small mt-1 mb-0">
                {tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </details>
          )}
        </>
      )}

      <div className="d-flex gap-2">
        {!isJoined ? (
          <button className="btn btn-accent btn-sm" onClick={() => onJoin(id)} aria-label={`Join ${title}`}>Join Challenge</button>
        ) : (
          <>
            {!isComplete && (
              <button className="btn btn-outline-accent btn-sm" onClick={() => onProgress(id)} aria-label={`Log progress for ${title}`}>+1 {unit.replace(/s$/, '')}</button>
            )}
            <button className="btn btn-outline-secondary btn-sm" onClick={() => onLeave(id)} aria-label={`Leave ${title}`}>Leave</button>
          </>
        )}
      </div>
    </div>
  );
}
