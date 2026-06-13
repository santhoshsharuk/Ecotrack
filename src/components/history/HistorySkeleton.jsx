/**
 * Skeleton Loader for History Table.
 * Renders animated placeholders to indicate data loading state.
 */
export default function HistorySkeleton() {
  return (
    <div className="history-table-wrapper" aria-hidden="true" style={{ opacity: 0.7 }}>
      <div className="table-responsive">
        <table className="table align-middle" style={{ cursor: 'wait' }}>
          <thead>
            <tr>
              <th scope="col"><div className="skeleton" style={{ height: 16, width: 60 }}></div></th>
              <th scope="col"><div className="skeleton" style={{ height: 16, width: 80 }}></div></th>
              <th scope="col" className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 16, width: 70 }}></div></th>
              <th scope="col" className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 16, width: 70 }}></div></th>
              <th scope="col" className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 16, width: 70 }}></div></th>
              <th scope="col" className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 16, width: 70 }}></div></th>
              <th scope="col"><div className="skeleton" style={{ height: 16, width: 60 }}></div></th>
              <th scope="col"><div className="skeleton" style={{ height: 16, width: 50 }}></div></th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((n) => (
              <tr key={n}>
                <td><div className="skeleton" style={{ height: 20, width: 85 }}></div></td>
                <td><div className="skeleton" style={{ height: 20, width: 65 }}></div></td>
                <td className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 20, width: 50 }}></div></td>
                <td className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 20, width: 50 }}></div></td>
                <td className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 20, width: 50 }}></div></td>
                <td className="d-none d-md-table-cell"><div className="skeleton" style={{ height: 20, width: 50 }}></div></td>
                <td><div className="skeleton" style={{ height: 24, width: 70, borderRadius: 50 }}></div></td>
                <td><div className="skeleton" style={{ height: 30, width: 30, borderRadius: 4 }}></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
