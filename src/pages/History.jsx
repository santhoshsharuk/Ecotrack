import HistoryTable from '../components/history/HistoryTable';
import HistorySkeleton from '../components/history/HistorySkeleton';
import { useCalculationHistory } from '../hooks/useCalculationHistory';

/**
 * Carbon footprint calculations history page.
 * Uses the useCalculationHistory hook to get records list and manage state
 * such as deletion and fallback local storage retrieval.
 */
export default function History() {
  const {
    history,
    loading,
    error,
    statusMessage,
    handleDelete,
  } = useCalculationHistory();

  return (
    <main className="container py-5">
      <h1 className="page-title text-center mb-2">Carbon Footprint History</h1>
      <p className="text-center text-muted mb-4">Track your calculations over time</p>

      {/* Status or Backup messages */}
      {(error || statusMessage) && (
        <div className="d-flex justify-content-center mb-4">
          <div
            className={`alert-premium px-4 py-3 ${error ? 'warning' : 'success'}`}
            role="status"
            style={{ width: '100%', maxWidth: 500 }}
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

      <div className="glass-card p-3 p-md-4">
        {loading && history.length === 0 ? (
          <HistorySkeleton />
        ) : (
          <HistoryTable history={history} onDelete={handleDelete} />
        )}
      </div>
    </main>
  );
}
