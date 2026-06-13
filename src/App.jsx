import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import Suggestions from './pages/Suggestions';
import Challenges from './pages/Challenges';
import History from './pages/History';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div className="app-wrapper d-flex flex-column min-vh-100">
          <Navbar />
          <div id="main-content" className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
