import { NavLink } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { FaLeaf, FaSun, FaMoon, FaBars } from 'react-icons/fa';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg sticky-top eco-navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/" aria-label="EcoTrack Home">
          <FaLeaf className="brand-icon" aria-hidden="true" />
          <span className="brand-text">EcoTrack</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end aria-label="Home page">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/calculator" aria-label="Carbon calculator">Calculator</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard" aria-label="Analytics dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/suggestions" aria-label="Personalized suggestions">Suggestions</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/challenges" aria-label="Eco challenges">Challenges</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/history" aria-label="Carbon footprint history">History</NavLink>
            </li>
            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-sm theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
