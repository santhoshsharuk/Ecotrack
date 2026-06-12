import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import ChartCard from '../components/ChartCard';
import { getHistory, getLastCalculation } from '../utils/storage';
import { useTheme } from '../components/ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

export default function Dashboard() {
  const { theme } = useTheme();
  const history = getHistory();
  const lastCalc = getLastCalculation();
  const textColor = theme === 'dark' ? '#e2e8f0' : '#1e293b';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

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

  const barData = useMemo(() => {
    if (history.length === 0) return null;
    const recent = history.slice(0, 12).reverse();
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
  }, [history]);

  const lineData = useMemo(() => {
    if (history.length === 0) return null;
    const recent = history.slice(0, 12).reverse();
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
  }, [history]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter' } } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    },
  };

  if (!lastCalc && history.length === 0) {
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
      <p className="text-center text-muted mb-5">Visualize your carbon footprint data</p>

      {/* Summary Cards */}
      {lastCalc && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Emissions', value: `${lastCalc.total.toLocaleString()} kg`, color: lastCalc.ratingColor, icon: '🌍' },
            { label: 'Rating', value: lastCalc.rating, color: lastCalc.ratingColor, icon: '⭐' },
            { label: 'vs Global Avg', value: `${lastCalc.comparisonToAverage}%`, color: lastCalc.comparisonToAverage <= 100 ? '#10b981' : '#ef4444', icon: '📈' },
            { label: 'Calculations', value: history.length, color: '#6366f1', icon: '📋' },
          ].map((card) => (
            <div key={card.label} className="col-6 col-md-3">
              <div className="glass-card p-3 text-center summary-card">
                <div className="summary-icon">{card.icon}</div>
                <div className="summary-value" style={{ color: card.color }}>{card.value}</div>
                <small className="text-muted">{card.label}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="row g-4">
        {doughnutData && (
          <div className="col-12 col-md-6">
            <ChartCard title="Emissions Breakdown" description="Doughnut chart showing CO2 breakdown by category">
              <div style={{ height: 300 }}>
                <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined, cutout: '60%' }} />
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
        {lineData && (
          <div className="col-12">
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
