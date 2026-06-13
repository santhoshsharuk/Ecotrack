import { useState } from 'react';
import CarbonForm from '../components/calculator/CarbonForm';
import CarbonResult from '../components/calculator/CarbonResult';
import { calculateTotalFootprint } from '../utils/carbonCalculator';
import { useFirestore } from '../hooks/useFirestore';

/**
 * Carbon calculator page.
 * Collects footprint entries across domains and runs calculation, displaying
 * interactive summaries and storing calculations back to the database.
 */
export default function Calculator() {
  const [result, setResult] = useState(null);
  const { saveCalculation, loading, error, statusMessage } = useFirestore();

  const handleCalculate = async (formData) => {
    const footprint = calculateTotalFootprint(formData);
    setResult(footprint);
    await saveCalculation(footprint);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <h1 className="page-title">Carbon Footprint Calculator</h1>
        <p className="text-muted">Answer a few questions to estimate your annual carbon emissions</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4 p-md-5">
            <CarbonForm onSubmit={handleCalculate} />

            {loading && (
              <div className="text-muted mt-3 text-center" role="status">
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Saving to database...
              </div>
            )}

            {!loading && (error || statusMessage) && (
              <div className={`alert mt-3 text-center ${error ? 'alert-warning' : 'alert-success'}`} role="status">
                {error && <div className="fw-bold mb-1 text-danger">{error}</div>}
                <div>{statusMessage || 'Data saved successfully'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div id="results" className="row justify-content-center mt-5">
          <div className="col-12 col-lg-8">
            <CarbonResult result={result} />
          </div>
        </div>
      )}
    </main>
  );
}
