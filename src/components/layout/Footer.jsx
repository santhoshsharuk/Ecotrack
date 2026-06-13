import { FaLeaf, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="eco-footer mt-auto" role="contentinfo" aria-label="Site footer">
      <div className="container">
        <div className="row align-items-center py-4">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <FaLeaf className="text-accent" aria-hidden="true" />
              <span className="fw-semibold">EcoTrack</span>
            </div>
            <small className="text-muted d-block mt-1">Track your impact. Save the planet.</small>
          </div>
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <small className="text-muted">
              Made with <FaHeart className="text-danger mx-1" aria-label="love" /> for a greener future
            </small>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <small className="text-muted">© {new Date().getFullYear()} EcoTrack. All rights reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
