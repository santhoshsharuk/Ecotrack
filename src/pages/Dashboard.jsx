import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import ChartCard from '../components/common/ChartCard';
import { useTheme } from '../hooks/useTheme';
import { useCalculationHistory } from '../hooks/useCalculationHistory';
import { getRatingColor } from '../utils/carbonCalculator';
import { getSuggestions } from '../utils/suggestions';
import { useChallenges } from '../hooks/useChallenges';
import { calculateGamificationState } from '../utils/gamification';
import DashboardSkeleton from '../components/common/DashboardSkeleton';

/**
 * Analytics Dashboard page component.
 * Registers chart elements and uses dynamic database-derived or fallback state-derived data
 * to render visual charts (doughnut, pie, category comparisons, and trend/cumulative lines),
 * personalized insights, eco achievements/badges, and recommendation lists.
 */

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

export default function Dashboard() {
  const { theme } = useTheme();
  const { history, loading, error, statusMessage } = useCalculationHistory();
  const { progress: challengeProgress, challenges } = useChallenges();

  const textColor = theme === 'dark' ? '#e2e8f0' : '#1e293b';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  // Normalize history entries to support both local storage and Firestore keys
  const normalizedHistory = useMemo(() => {
    return (history || []).map((entry) => {
      const total = entry.totalFootprint ?? entry.total ?? 0;
      const transport = entry.transportation ?? entry.transport ?? 0;
      const energy = entry.homeEnergy ?? entry.energy ?? 0;
      const diet = entry.diet ?? 0;
      const lifestyle = entry.lifestyle ?? 0;
      const rating = entry.impactLevel ?? entry.rating ?? 'High';
      const timestamp = entry.createdAt || entry.timestamp || new Date().toISOString();
      const ratingColor = entry.ratingColor || getRatingColor(rating);
      const comparisonToAverage = entry.comparisonToAverage ?? Math.round((total / 4000) * 100);

      return {
        ...entry,
        id: entry.id,
        total,
        transport,
        energy,
        diet,
        lifestyle,
        rating,
        ratingColor,
        comparisonToAverage,
        timestamp,
      };
    });
  }, [history]);

  const lastCalc = useMemo(() => {
    return normalizedHistory[0] || null;
  }, [normalizedHistory]);

  const { badges, milestones } = useMemo(() => {
    return calculateGamificationState(normalizedHistory, challengeProgress, challenges);
  }, [normalizedHistory, challengeProgress, challenges]);

  const doughnutData = useMemo(() => {
    if (!lastCalc) return null;
    return {
      labels: ['Transport', 'Energy', 'Diet', 'Lifestyle'],
      datasets: [{
        data: [lastCalc.transport, lastCalc.energy, lastCalc.diet, lastCalc.lifestyle],
        backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ec4899'],
        borderWidth: 0,
        hoverOffset: 10,
      }],
    };
  }, [lastCalc]);

  const pieData = useMemo(() => {
    if (!lastCalc) return null;
    return {
      labels: ['Transport', 'Energy', 'Diet', 'Lifestyle'],
      datasets: [{
        data: [lastCalc.transport, lastCalc.energy, lastCalc.diet, lastCalc.lifestyle],
        backgroundColor: ['#4f46e5', '#f59e0b', '#10b981', '#db2777'],
        borderWidth: 0,
        hoverOffset: 10,
      }],
    };
  }, [lastCalc]);

  const barData = useMemo(() => {
    if (normalizedHistory.length === 0) return null;
    const recent = [...normalizedHistory].slice(0, 12).reverse();
    return {
      labels: recent.map((e) => new Date(e.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Total CO₂ (kg)',
        data: recent.map((e) => e.total),
        backgroundColor: '#14b8a6',
        borderRadius: 8,
        borderSkipped: false,
      }],
    };
  }, [normalizedHistory]);

  const categoryBarData = useMemo(() => {
    if (!lastCalc) return null;
    return {
      labels: ['Transport', 'Energy', 'Diet', 'Lifestyle'],
      datasets: [{
        label: 'Emissions (kg CO₂)',
        data: [lastCalc.transport, lastCalc.energy, lastCalc.diet, lastCalc.lifestyle],
        backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ec4899'],
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  }, [lastCalc]);

  const lineData = useMemo(() => {
    if (normalizedHistory.length === 0) return null;
    const recent = [...normalizedHistory].slice(0, 12).reverse();
    let cumulative = 0;
    const cumulativeData = recent.map((e) => { cumulative += e.total; return cumulative; });
    return {
      labels: recent.map((e) => new Date(e.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Cumulative CO₂ (kg)',
        data: cumulativeData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
      }],
    };
  }, [normalizedHistory]);

  const trendLineData = useMemo(() => {
    if (normalizedHistory.length === 0) return null;
    const recent = [...normalizedHistory].slice(0, 12).reverse();
    return {
      labels: recent.map((e) => new Date(e.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Historical Emissions (kg CO₂)',
        data: recent.map((e) => e.total),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
      }],
    };
  }, [normalizedHistory]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter' } } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    },
  };

  // Personalized insights generation
  const insights = useMemo(() => {
    if (!lastCalc) return [];
    const list = [];
    
    // 1. Largest source of emission
    const categories = [
      { name: 'Transport', value: lastCalc.transport, icon: '🚗', message: 'Consider switching to public transit or carpooling.' },
      { name: 'Energy', value: lastCalc.energy, icon: '⚡', message: 'Switching to LED bulbs or clean energy will help.' },
      { name: 'Diet', value: lastCalc.diet, icon: '🥗', message: 'Try adding more plant-based meals to your diet.' },
      { name: 'Lifestyle', value: lastCalc.lifestyle, icon: '🛍️', message: 'Try shopping mindfully and recycling fully.' }
    ];
    const highest = categories.reduce((prev, current) => (prev.value > current.value) ? prev : current);
    list.push({
      type: 'highest',
      icon: highest.icon,
      title: 'Highest Emission Category',
      text: `Your largest footprint driver is ${highest.name} (${highest.value.toLocaleString()} kg CO₂). ${highest.message}`
    });

    // 2. Vs Average Comparison
    const diff = lastCalc.total - 4000;
    if (diff > 0) {
      list.push({
        type: 'average',
        icon: '📈',
        title: 'Above Global Average',
        text: `Your footprint is ${diff.toLocaleString()} kg CO₂ above the global average of 4,000 kg. Reducing it can make a big impact.`
      });
    } else {
      list.push({
        type: 'average',
        icon: '✨',
        title: 'Eco Champion',
        text: `Fantastic! Your footprint is ${Math.abs(diff).toLocaleString()} kg CO₂ below the global average of 4,000 kg. Keep it up!`
      });
    }

    // 3. Historical change
    if (normalizedHistory.length >= 2) {
      const prevCalc = normalizedHistory[1];
      const change = lastCalc.total - prevCalc.total;
      const pct = prevCalc.total > 0 ? Math.round((change / prevCalc.total) * 100) : 0;
      if (pct < 0) {
        list.push({
          type: 'trend',
          icon: '📉',
          title: 'Footprint Decreased',
          text: `Awesome progress! Your footprint has decreased by ${Math.abs(pct)}% since your previous calculation.`
        });
      } else if (pct > 0) {
        list.push({
          type: 'trend',
          icon: '⚠️',
          title: 'Footprint Increased',
          text: `Your carbon footprint has increased by ${pct}% compared to your last calculation. Check out recommendations below.`
        });
      } else {
        list.push({
          type: 'trend',
          icon: '📋',
          title: 'Footprint Stable',
          text: `Your footprint remains unchanged from the last calculation. Try adopting new habits to start lowering it.`
        });
      }
    }

    // 4. Recommendation Potential Savings
    const recs = getSuggestions(lastCalc, 3);
    const potentialSavings = recs.reduce((acc, curr) => acc + curr.savings, 0);
    if (potentialSavings > 0) {
      list.push({
        type: 'savings',
        icon: '🌱',
        title: 'Potential Impact',
        text: `By adopting the personalized actions below, you can save up to ${potentialSavings.toLocaleString()} kg CO₂ per year!`
      });
    }

    return list;
  }, [lastCalc, normalizedHistory]);

  const recommendations = useMemo(() => {
    if (!lastCalc) return [];
    return getSuggestions(lastCalc, 3);
  }, [lastCalc]);

  if (loading && normalizedHistory.length === 0) {
    return <DashboardSkeleton />;
  }

  if (!lastCalc && normalizedHistory.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="page-title mb-3">Analytics Dashboard</h1>
        <div className="glass-card p-5 mx-auto" style={{ maxWidth: 500 }}>
          <div className="empty-state-icon mb-3">📊</div>
          <h4>No Data Yet</h4>
          <p className="text-muted mb-4">Complete a carbon footprint calculation to see your analytics.</p>
          <Link to="/calculator" className="btn btn-accent">Calculate Now →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="page-title text-center mb-2">Analytics Dashboard</h1>
      <p className="text-center text-muted mb-4">Visualize and understand your environmental impact</p>

      {/* Database status alert */}
      {(error || statusMessage) && (
        <div className="d-flex justify-content-center mb-4">
          <div
            className={`alert-premium px-4 py-3 ${error ? 'warning' : 'success'}`}
            role="status"
            style={{ width: '100%', maxWidth: 600 }}
          >
            <div className="d-flex align-items-center gap-2">
              <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>{error ? '⚠️' : '✨'}</span>
              <span className="small text-start">
                {error && <span className="fw-bold text-danger me-2">{error} —</span>}
                <span>{statusMessage}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats Cards */}
      {lastCalc && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Emissions', value: `${lastCalc.total.toLocaleString()} kg`, color: lastCalc.ratingColor, icon: '🌍' },
            { label: 'Rating', value: lastCalc.rating, color: lastCalc.ratingColor, icon: '⭐' },
            { label: 'vs Global Avg', value: `${lastCalc.comparisonToAverage}%`, color: lastCalc.comparisonToAverage <= 100 ? '#10b981' : '#ef4444', icon: '📈' },
            { label: 'Calculations', value: normalizedHistory.length, color: '#6366f1', icon: '📋' },
          ].map((card) => (
            <div key={card.label} className="col-6 col-md-3">
              <div className="glass-card p-3 text-center summary-card h-100">
                <div className="summary-icon">{card.icon}</div>
                <div className="summary-value" style={{ color: card.color }}>{card.value}</div>
                <small className="text-muted">{card.label}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements & Milestones Section */}
      {lastCalc && (
        <div className="glass-card p-4 mb-4">
          <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <span>🏆</span> Achievements & Milestones
          </h4>
          <div className="row g-4">
            {/* Badges Column */}
            <div className="col-12 col-lg-6">
              <h5 className="fw-semibold mb-3">Your Eco Badges</h5>
              <div className="row g-3">
                {badges.map((badge) => (
                  <div key={badge.id} className="col-12 col-sm-4 text-center">
                    <div 
                      className={`p-3 rounded-3 h-100 d-flex flex-column align-items-center justify-content-center border ${badge.unlocked ? 'badge-card-unlocked' : 'badge-card-locked'}`}
                      style={{
                        transition: 'all 0.3s ease',
                        background: badge.unlocked 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 184, 166, 0.12) 100%)' 
                          : 'rgba(255, 255, 255, 0.02)',
                        borderColor: badge.unlocked ? 'var(--accent)' : 'var(--border-color)',
                        opacity: badge.unlocked ? 1 : 0.65,
                        boxShadow: badge.unlocked ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none',
                        position: 'relative'
                      }}
                      title={badge.description}
                    >
                      {/* Lock status overlay */}
                      {!badge.unlocked && (
                        <span 
                          style={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)'
                          }}
                          aria-hidden="true"
                        >
                          🔒
                        </span>
                      )}
                      
                      <div 
                        className="badge-icon mb-2"
                        style={{ 
                          fontSize: '2.5rem',
                          filter: badge.unlocked ? 'none' : 'grayscale(100%) brightness(0.6)',
                          animation: badge.unlocked ? 'leafPulse 3s ease-in-out infinite' : 'none'
                        }}
                      >
                        {badge.icon}
                      </div>
                      
                      <h6 className={`fw-bold mb-1 ${badge.unlocked ? 'text-accent' : 'text-muted'}`}>
                        {badge.title}
                      </h6>
                      
                      <p className="text-muted small mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                        {badge.requirementText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones Column */}
            <div className="col-12 col-lg-6">
              <h5 className="fw-semibold mb-3">Milestone Progress</h5>
              <div className="d-flex flex-column gap-3">
                {milestones.map((milestone) => (
                  <div key={milestone.id}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-semibold">{milestone.title}</span>
                      <span className="small text-muted font-monospace">
                        {milestone.id === 'green-rating' 
                          ? milestone.current 
                          : `${milestone.current} / ${milestone.target}`}
                      </span>
                    </div>
                    <div 
                      className="progress rounded-pill" 
                      style={{ height: '8px', background: 'var(--border-color)' }}
                    >
                      <div 
                        className={`progress-bar rounded-pill ${milestone.completed ? 'bg-success' : 'bg-info'}`}
                        role="progressbar"
                        style={{ 
                          width: `${milestone.percent}%`,
                          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                          background: milestone.completed 
                            ? 'linear-gradient(90deg, #10b981, #14b8a6)' 
                            : 'linear-gradient(90deg, #6366f1, #3b82f6)'
                        }}
                        aria-valuenow={milestone.percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`${milestone.title} - ${milestone.percent}%`}
                      ></div>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {milestone.description}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights and Personalized Recommendations Section */}
      {lastCalc && (
        <div className="row g-4 mb-4">
          {/* Carbon Footprint Insights */}
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 h-100">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <span>💡</span> Carbon Footprint Insights
              </h4>
              <div className="d-flex flex-column gap-3">
                {insights.map((insight, idx) => (
                  <div key={idx} className="d-flex gap-3 p-3 rounded-3" style={{ background: 'var(--accent-subtle)' }}>
                    <div style={{ fontSize: '1.5rem', userSelect: 'none' }}>{insight.icon}</div>
                    <div>
                      <h6 className="fw-bold mb-1">{insight.title}</h6>
                      <p className="text-muted small mb-0">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personalized Actions */}
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 h-100">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <span>🌱</span> Top Recommendations
              </h4>
              <div className="d-flex flex-column gap-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => {
                    const difficultyColor = 
                      rec.difficulty === 'easy' ? 'var(--accent)' :
                      rec.difficulty === 'medium' ? '#fbbf24' : '#f87171';
                    return (
                      <div 
                        key={rec.id} 
                        className="d-flex gap-3 p-3 rounded-3 border-start border-4 text-start" 
                        style={{ 
                          borderLeftColor: difficultyColor, 
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderLeftWidth: '4px'
                        }}
                      >
                        <div style={{ fontSize: '1.5rem', userSelect: 'none' }}>{rec.icon}</div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-bold mb-0 text-start">{rec.title}</h6>
                            <span 
                              className="badge text-uppercase font-monospace" 
                              style={{ 
                                fontSize: '0.7rem', 
                                background: `${difficultyColor}22`, 
                                color: difficultyColor, 
                                border: `1px solid ${difficultyColor}44` 
                              }}
                            >
                              {rec.difficulty}
                            </span>
                          </div>
                          <p className="text-muted small mb-2 text-start">{rec.description}</p>
                          <div className="d-flex justify-content-between align-items-center text-accent small fw-bold">
                            <span>Category: {rec.category}</span>
                            <span>Est. Savings: {rec.savings} kg/yr</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted">
                    No recommendations needed at this level. You're doing excellent!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Charts */}
      <div className="row g-4">
        {/* Row 1: Footprint Breakdowns */}
        {doughnutData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Emissions Breakdown" description="Doughnut chart showing CO2 breakdown by category">
              <div style={{ height: 300 }}>
                <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined, cutout: '60%' }} />
              </div>
            </ChartCard>
          </div>
        )}
        {pieData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Footprint Breakdown" description="Pie chart showing CO2 breakdown by category">
              <div style={{ height: 300 }}>
                <Pie data={pieData} options={{ ...chartOptions, scales: undefined }} />
              </div>
            </ChartCard>
          </div>
        )}

        {/* Row 2: History & Comparison */}
        {categoryBarData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Category Comparison" description="Bar chart comparing emissions across different categories">
              <div style={{ height: 300 }}>
                <Bar data={categoryBarData} options={chartOptions} />
              </div>
            </ChartCard>
          </div>
        )}
        {barData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Calculation History" description="Bar chart showing total emissions over time">
              <div style={{ height: 300 }}>
                <Bar data={barData} options={chartOptions} />
              </div>
            </ChartCard>
          </div>
        )}

        {/* Row 3: Trends */}
        {trendLineData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Historical Trend" description="Line chart showing total footprint trend over time">
              <div style={{ height: 300 }}>
                <Line data={trendLineData} options={chartOptions} />
              </div>
            </ChartCard>
          </div>
        )}
        {lineData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Cumulative Emissions" description="Line chart showing cumulative CO2 over time">
              <div style={{ height: 300 }}>
                <Line data={lineData} options={chartOptions} />
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </main>
  );
}
