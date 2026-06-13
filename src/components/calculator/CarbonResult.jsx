import { FaArrowDown, FaArrowUp, FaEquals } from 'react-icons/fa';

export default function CarbonResult({ result }) {
  if (!result) return null;

  const { transport, energy, diet, lifestyle, total, comparisonToAverage, rating, ratingColor } = result;

  const categories = [
    { label: 'Transportation', value: transport, icon: '🚗', color: '#6366f1' },
    { label: 'Home Energy', value: energy, icon: '⚡', color: '#f59e0b' },
    { label: 'Diet', value: diet, icon: '🥗', color: '#10b981' },
    { label: 'Lifestyle', value: lifestyle, icon: '🌍', color: '#ec4899' },
  ];

  const getComparisonIcon = () => {
    if (comparisonToAverage < 90) return <FaArrowDown className="text-success" aria-hidden="true" />;
    if (comparisonToAverage > 110) return <FaArrowUp className="text-danger" aria-hidden="true" />;
    return <FaEquals className="text-warning" aria-hidden="true" />;
  };

  const getComparisonText = () => {
    if (comparisonToAverage < 90) return `${100 - comparisonToAverage}% below average`;
    if (comparisonToAverage > 110) return `${comparisonToAverage - 100}% above average`;
    return 'Near global average';
  };

  return (
    <div className="carbon-result fade-in" role="region" aria-label="Carbon footprint results">
      {/* Total */}
      <div className="result-hero text-center mb-4">
        <h2 className="mb-1">Your Carbon Footprint</h2>
        <div className="result-total" style={{ color: ratingColor }}>
          {total.toLocaleString()}
          <span className="result-unit"> kg CO₂/year</span>
        </div>
        <span className="badge result-badge" style={{ background: ratingColor }}>
          {rating}
        </span>
      </div>

      {/* Comparison */}
      <div className="result-comparison glass-card p-3 mb-4 text-center" aria-label="Comparison to global average">
        <div className="d-flex align-items-center justify-content-center gap-2">
          {getComparisonIcon()}
          <span>{getComparisonText()}</span>
        </div>
        <small className="text-muted d-block mt-1">Global average: ~4,000 kg CO₂/year</small>
        <div className="progress mt-2" style={{ height: '8px' }} role="progressbar" aria-label={`${comparisonToAverage}% of global average`} aria-valuenow={Math.min(comparisonToAverage, 200)} aria-valuemin={0} aria-valuemax={200}>
          <div
            className="progress-bar"
            style={{ width: `${Math.min(comparisonToAverage / 2, 100)}%`, background: ratingColor }}
          ></div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="row g-3">
        {categories.map((cat) => (
          <div key={cat.label} className="col-6">
            <div className="glass-card p-3 text-center category-card" aria-label={`${cat.label}: ${cat.value} kg CO₂ per year`}>
              <div className="category-icon mb-2">{cat.icon}</div>
              <div className="category-value" style={{ color: cat.color }}>
                {cat.value.toLocaleString()}
              </div>
              <small className="text-muted">{cat.label}</small>
              <div className="category-percent">
                {total > 0 ? Math.round((cat.value / total) * 100) : 0}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
