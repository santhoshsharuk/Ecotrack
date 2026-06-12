import { FaTrash } from 'react-icons/fa';

/**
 * Table to display footprint history
 */
export default function HistoryTable({ history, onDelete }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-5" role="status">
        <div className="empty-state-icon mb-3">📊</div>
        <h4>No History Yet</h4>
        <p className="text-muted">Complete a carbon footprint calculation to see your history here.</p>
      </div>
    );
  }

  const getRatingColor = (entry) => {
    if (entry.ratingColor) return entry.ratingColor;
    const rating = entry.impactLevel || entry.rating;
    switch (rating) {
      case 'Excellent': return '#10b981';
      case 'Good': return '#3b82f6';
      case 'Average': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getFormattedDate = (entry) => {
    const dateStr = entry.createdAt || entry.timestamp;
    return dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A';
  };

  return (
    <div className="history-table-wrapper">
      <div className="table-responsive">
        <table className="table table-hover align-middle" aria-label="Carbon footprint history">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Total (kg CO₂)</th>
              <th scope="col" className="d-none d-md-table-cell">Transport</th>
              <th scope="col" className="d-none d-md-table-cell">Energy</th>
              <th scope="col" className="d-none d-md-table-cell">Diet</th>
              <th scope="col" className="d-none d-md-table-cell">Lifestyle</th>
              <th scope="col">Rating</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{getFormattedDate(entry)}</td>
                <td><strong>{(entry.totalFootprint ?? entry.total)?.toLocaleString()}</strong></td>
                <td className="d-none d-md-table-cell">{(entry.transportation ?? entry.transport)?.toLocaleString()}</td>
                <td className="d-none d-md-table-cell">{(entry.homeEnergy ?? entry.energy)?.toLocaleString()}</td>
                <td className="d-none d-md-table-cell">{entry.diet?.toLocaleString()}</td>
                <td className="d-none d-md-table-cell">{entry.lifestyle?.toLocaleString()}</td>
                <td>
                  <span className="badge" style={{ background: getRatingColor(entry) }}>
                    {entry.impactLevel || entry.rating}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(entry.id)}
                    aria-label={`Delete entry from ${getFormattedDate(entry)}`}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
