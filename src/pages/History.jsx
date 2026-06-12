import { useState, useEffect } from 'react';
import HistoryTable from '../components/HistoryTable';
import { useFirestore } from '../hooks/useFirestore';

export default function History() {
  const [history, setHistory] = useState([]);
  const { getHistory, deleteHistory, loading, error, statusMessage } = useFirestore();

  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      const data = await getHistory();
      if (active) {
        setHistory(data || []);
      }
    };
    fetchHistory();
    return () => {
      active = false;
    };
  }, [getHistory]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this calculation history entry?')) {
      await deleteHistory(id);
      const data = await getHistory();
      setHistory(data || []);
    }
  };

  return (
    <main className="container py-5">
      <h1 className="page-title text-center mb-2">Carbon Footprint History</h1>
      <p className="text-center text-muted mb-4">Track your calculations over time</p>

      {/* Status or Backup messages */}
      {(error || statusMessage) && (
        <div className="d-flex justify-content-center mb-4">
          <div className={`alert py-2 px-3 text-center mb-0 ${error ? 'alert-warning' : 'alert-success'}`} role="status">
            {error && <span className="fw-bold text-danger me-2">{error} —</span>}
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      <div className="glass-card p-3 p-md-4">
        {loading && history.length === 0 ? (
          <div className="text-center py-5" role="status">
            <div className="spinner-border text-accent mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading history...</p>
          </div>
        ) : (
          <HistoryTable history={history} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
