/**
 * Skeleton Loader for Dashboard.
 * Renders animated placeholders matching the layout of summary cards,
 * charts, insights, and recommendations.
 */
export default function DashboardSkeleton() {
  return (
    <div className="container py-5" aria-hidden="true" style={{ opacity: 0.7 }}>
      {/* Title & Subtitle skeleton */}
      <div className="text-center mb-5">
        <div className="skeleton mb-2" style={{ height: 40, width: 300 }}></div>
        <div className="skeleton" style={{ height: 20, width: 200 }}></div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="col-6 col-md-3">
            <div className="glass-card p-3 text-center summary-card" style={{ cursor: 'wait' }}>
              <div className="skeleton mb-2" style={{ height: 32, width: 32, borderRadius: '50%' }}></div>
              <div className="skeleton mb-2" style={{ height: 24, width: '60%' }}></div>
              <div className="skeleton" style={{ height: 16, width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="row g-4 mb-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="col-12 col-md-6">
            <div className="glass-card p-4" style={{ height: 380, cursor: 'wait' }}>
              <div className="skeleton mb-3" style={{ height: 24, width: '40%' }}></div>
              <div className="d-flex justify-content-center align-items-center" style={{ height: 260 }}>
                {n % 2 === 0 ? (
                  // Pie/Doughnut-like skeleton
                  <div className="skeleton" style={{ height: 200, width: 200, borderRadius: '50%' }}></div>
                ) : (
                  // Bar/Line-like skeleton
                  <div className="w-100 h-100 d-flex align-items-end justify-content-between px-3">
                    {[30, 60, 45, 90, 75, 50, 80].map((h, i) => (
                      <div key={i} className="skeleton" style={{ height: `${h}%`, width: '10%', borderRadius: '4px 4px 0 0' }}></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights & Recommendations Skeleton */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="glass-card p-4" style={{ minHeight: 300, cursor: 'wait' }}>
            <div className="skeleton mb-3" style={{ height: 24, width: '30%' }}></div>
            <div className="skeleton mb-2 w-100" style={{ height: 16 }}></div>
            <div className="skeleton mb-2 w-100" style={{ height: 16 }}></div>
            <div className="skeleton mb-2 w-75" style={{ height: 16 }}></div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="glass-card p-4" style={{ minHeight: 300, cursor: 'wait' }}>
            <div className="skeleton mb-3" style={{ height: 24, width: '40%' }}></div>
            <div className="d-flex flex-column gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="d-flex gap-2 align-items-center p-2 border-bottom border-light">
                  <div className="skeleton" style={{ height: 36, width: 36, borderRadius: '8px' }}></div>
                  <div className="flex-grow-1">
                    <div className="skeleton mb-1" style={{ height: 16, width: '50%' }}></div>
                    <div className="skeleton" style={{ height: 12, width: '80%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
