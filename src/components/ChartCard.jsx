export default function ChartCard({ title, children, description }) {
  return (
    <div className="glass-card chart-card p-3 p-md-4 h-100" role="figure" aria-label={title}>
      <h5 className="chart-title mb-3">{title}</h5>
      {description && (
        <p className="visually-hidden">{description}</p>
      )}
      <div className="chart-container">
        {children}
      </div>
    </div>
  );
}
