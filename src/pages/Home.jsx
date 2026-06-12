import { Link } from 'react-router-dom';
import { FaCalculator, FaChartBar, FaLightbulb, FaTrophy, FaHistory } from 'react-icons/fa';

export default function Home() {
  const features = [
    { icon: <FaCalculator />, title: 'Carbon Calculator', desc: 'Calculate your annual carbon footprint across 4 categories.', link: '/calculator', color: '#6366f1' },
    { icon: <FaChartBar />, title: 'Analytics Dashboard', desc: 'Visualize your emissions with interactive charts.', link: '/dashboard', color: '#10b981' },
    { icon: <FaLightbulb />, title: 'Smart Suggestions', desc: 'Get personalized tips to reduce your impact.', link: '/suggestions', color: '#f59e0b' },
    { icon: <FaTrophy />, title: 'Eco Challenges', desc: 'Join challenges and track your green progress.', link: '/challenges', color: '#ec4899' },
    { icon: <FaHistory />, title: 'Track History', desc: 'Monitor your footprint over time with localStorage.', link: '/history', color: '#14b8a6' },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section" aria-label="Welcome to EcoTrack">
        <div className="container text-center py-5">
          <div className="hero-content">
            <h1 className="hero-title">
              Track Your <span className="text-gradient">Carbon Footprint</span>
            </h1>
            <p className="hero-subtitle mx-auto">
              Understand your environmental impact, get personalized suggestions, and join eco challenges to build a sustainable future.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
              <Link to="/calculator" className="btn btn-accent btn-lg hero-btn" aria-label="Start calculating your carbon footprint">
                🌱 Start Calculating
              </Link>
              <Link to="/dashboard" className="btn btn-outline-light btn-lg hero-btn" aria-label="View analytics dashboard">
                📊 View Dashboard
              </Link>
            </div>
          </div>
          <div className="hero-stats mt-5">
            <div className="row g-3 justify-content-center">
              <div className="col-6 col-md-3">
                <div className="stat-card glass-card p-3">
                  <div className="stat-number">4,000</div>
                  <div className="stat-label">kg CO₂ avg/year</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card glass-card p-3">
                  <div className="stat-number">4</div>
                  <div className="stat-label">Impact Categories</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card glass-card p-3">
                  <div className="stat-number">18+</div>
                  <div className="stat-label">Smart Suggestions</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-card glass-card p-3">
                  <div className="stat-number">8</div>
                  <div className="stat-label">Eco Challenges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5" aria-label="Platform features">
        <div className="container">
          <h2 className="text-center mb-2">Everything You Need</h2>
          <p className="text-center text-muted mb-5">Comprehensive tools to understand and reduce your environmental impact</p>
          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-12 col-md-6 col-lg-4">
                <Link to={f.link} className="text-decoration-none">
                  <div className="glass-card feature-card p-4 h-100" tabIndex={0} aria-label={f.title}>
                    <div className="feature-icon mb-3" style={{ color: f.color }}>{f.icon}</div>
                    <h4 className="feature-title">{f.title}</h4>
                    <p className="feature-desc text-muted">{f.desc}</p>
                    <span className="feature-link" style={{ color: f.color }}>Explore →</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-center" aria-label="Call to action">
        <div className="container">
          <div className="glass-card p-5 cta-card">
            <h2>Ready to Make a Difference?</h2>
            <p className="text-muted mb-4">Every small change counts. Start tracking your carbon footprint today.</p>
            <Link to="/calculator" className="btn btn-accent btn-lg">Get Started Free 🌍</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
