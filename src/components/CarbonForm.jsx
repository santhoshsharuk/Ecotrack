import { useState } from 'react';

const INITIAL_STATE = {
  transport: {
    carKmPerWeek: '',
    flightHoursPerYear: '',
    publicTransitHoursPerWeek: '',
  },
  energy: {
    electricityKwhPerMonth: '',
    naturalGasThermsPerMonth: '',
    renewablePercent: '',
  },
  diet: {
    dietType: 'mixed',
    foodWasteLevel: 'medium',
  },
  lifestyle: {
    shoppingFrequency: 'medium',
    recyclingHabit: 'partial',
    waterUsage: 'medium',
  },
};

export default function CarbonForm({ onSubmit }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [step, setStep] = useState(0);

  const steps = [
    { key: 'transport', label: 'Transportation', icon: '🚗' },
    { key: 'energy', label: 'Home Energy', icon: '⚡' },
    { key: 'diet', label: 'Diet', icon: '🥗' },
    { key: 'lifestyle', label: 'Lifestyle', icon: '🌍' },
  ];

  const updateField = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // Convert numeric strings to numbers
    const processed = {
      transport: {
        carKmPerWeek: Number(formData.transport.carKmPerWeek) || 0,
        flightHoursPerYear: Number(formData.transport.flightHoursPerYear) || 0,
        publicTransitHoursPerWeek: Number(formData.transport.publicTransitHoursPerWeek) || 0,
      },
      energy: {
        electricityKwhPerMonth: Number(formData.energy.electricityKwhPerMonth) || 0,
        naturalGasThermsPerMonth: Number(formData.energy.naturalGasThermsPerMonth) || 0,
        renewablePercent: Number(formData.energy.renewablePercent) || 0,
      },
      diet: formData.diet,
      lifestyle: formData.lifestyle,
    };
    onSubmit(processed);
  };

  const canGoNext = step < steps.length - 1;
  const canGoPrev = step > 0;
  const isLastStep = step === steps.length - 1;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="carbon-form" aria-label="Carbon footprint calculator form">
      {/* Step indicator */}
      <div className="step-indicator mb-4" role="tablist" aria-label="Calculator steps">
        {steps.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            onClick={() => setStep(i)}
            role="tab"
            aria-selected={i === step}
            aria-label={`Step ${i + 1}: ${s.label}`}
          >
            <span className="step-icon">{s.icon}</span>
            <span className="step-label d-none d-md-inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step 0: Transportation */}
      {step === 0 && (
        <div className="form-step fade-in" role="tabpanel" aria-label="Transportation details">
          <h3 className="form-step-title">🚗 Transportation</h3>
          <p className="text-muted mb-4">How do you get around?</p>

          <div className="mb-3">
            <label htmlFor="carKm" className="form-label">Car kilometers per week</label>
            <input
              id="carKm"
              type="number"
              className="form-control"
              min="0"
              max="5000"
              placeholder="e.g., 100"
              value={formData.transport.carKmPerWeek}
              onChange={(e) => updateField('transport', 'carKmPerWeek', e.target.value)}
              aria-describedby="carKmHelp"
            />
            <small id="carKmHelp" className="form-text">Average distance driven by car each week</small>
          </div>

          <div className="mb-3">
            <label htmlFor="flightHours" className="form-label">Flight hours per year</label>
            <input
              id="flightHours"
              type="number"
              className="form-control"
              min="0"
              max="1000"
              placeholder="e.g., 10"
              value={formData.transport.flightHoursPerYear}
              onChange={(e) => updateField('transport', 'flightHoursPerYear', e.target.value)}
              aria-describedby="flightHelp"
            />
            <small id="flightHelp" className="form-text">Total hours spent flying annually</small>
          </div>

          <div className="mb-3">
            <label htmlFor="transit" className="form-label">Public transit hours per week</label>
            <input
              id="transit"
              type="number"
              className="form-control"
              min="0"
              max="100"
              placeholder="e.g., 5"
              value={formData.transport.publicTransitHoursPerWeek}
              onChange={(e) => updateField('transport', 'publicTransitHoursPerWeek', e.target.value)}
              aria-describedby="transitHelp"
            />
            <small id="transitHelp" className="form-text">Hours spent on buses, trains, subways weekly</small>
          </div>
        </div>
      )}

      {/* Step 1: Energy */}
      {step === 1 && (
        <div className="form-step fade-in" role="tabpanel" aria-label="Home energy details">
          <h3 className="form-step-title">⚡ Home Energy</h3>
          <p className="text-muted mb-4">Your household energy consumption</p>

          <div className="mb-3">
            <label htmlFor="electricity" className="form-label">Electricity (kWh/month)</label>
            <input
              id="electricity"
              type="number"
              className="form-control"
              min="0"
              max="10000"
              placeholder="e.g., 900"
              value={formData.energy.electricityKwhPerMonth}
              onChange={(e) => updateField('energy', 'electricityKwhPerMonth', e.target.value)}
              aria-describedby="electricityHelp"
            />
            <small id="electricityHelp" className="form-text">Check your electricity bill for monthly kWh usage</small>
          </div>

          <div className="mb-3">
            <label htmlFor="gas" className="form-label">Natural gas (therms/month)</label>
            <input
              id="gas"
              type="number"
              className="form-control"
              min="0"
              max="500"
              placeholder="e.g., 50"
              value={formData.energy.naturalGasThermsPerMonth}
              onChange={(e) => updateField('energy', 'naturalGasThermsPerMonth', e.target.value)}
              aria-describedby="gasHelp"
            />
            <small id="gasHelp" className="form-text">Monthly natural gas consumption in therms</small>
          </div>

          <div className="mb-3">
            <label htmlFor="renewable" className="form-label">Renewable energy percentage (%)</label>
            <input
              id="renewable"
              type="range"
              className="form-range"
              min="0"
              max="100"
              step="5"
              value={formData.energy.renewablePercent || 0}
              onChange={(e) => updateField('energy', 'renewablePercent', e.target.value)}
              aria-label={`Renewable energy: ${formData.energy.renewablePercent || 0}%`}
              aria-describedby="renewableHelp"
            />
            <div className="d-flex justify-content-between">
              <small>0%</small>
              <strong className="text-accent">{formData.energy.renewablePercent || 0}%</strong>
              <small>100%</small>
            </div>
            <small id="renewableHelp" className="form-text">Percentage of your energy from renewable sources</small>
          </div>
        </div>
      )}

      {/* Step 2: Diet */}
      {step === 2 && (
        <div className="form-step fade-in" role="tabpanel" aria-label="Diet details">
          <h3 className="form-step-title">🥗 Diet</h3>
          <p className="text-muted mb-4">Your eating habits matter</p>

          <div className="mb-4">
            <label htmlFor="dietType" className="form-label">Diet type</label>
            <select
              id="dietType"
              className="form-select"
              value={formData.diet.dietType}
              onChange={(e) => updateField('diet', 'dietType', e.target.value)}
              aria-describedby="dietHelp"
            >
              <option value="vegan">🌿 Vegan</option>
              <option value="vegetarian">🥕 Vegetarian</option>
              <option value="mixed">🍽️ Mixed / Balanced</option>
              <option value="heavy-meat">🥩 Heavy Meat Eater</option>
            </select>
            <small id="dietHelp" className="form-text">Select the option that best describes your typical diet</small>
          </div>

          <div className="mb-3">
            <label htmlFor="foodWaste" className="form-label">Food waste level</label>
            <select
              id="foodWaste"
              className="form-select"
              value={formData.diet.foodWasteLevel}
              onChange={(e) => updateField('diet', 'foodWasteLevel', e.target.value)}
              aria-describedby="wasteHelp"
            >
              <option value="low">Low — I rarely throw food away</option>
              <option value="medium">Medium — Some food waste occasionally</option>
              <option value="high">High — Significant food goes to waste</option>
            </select>
            <small id="wasteHelp" className="form-text">How much food do you typically throw away?</small>
          </div>
        </div>
      )}

      {/* Step 3: Lifestyle */}
      {step === 3 && (
        <div className="form-step fade-in" role="tabpanel" aria-label="Lifestyle details">
          <h3 className="form-step-title">🌍 Lifestyle</h3>
          <p className="text-muted mb-4">Daily habits and consumption patterns</p>

          <div className="mb-4">
            <label htmlFor="shopping" className="form-label">Shopping frequency</label>
            <select
              id="shopping"
              className="form-select"
              value={formData.lifestyle.shoppingFrequency}
              onChange={(e) => updateField('lifestyle', 'shoppingFrequency', e.target.value)}
              aria-describedby="shopHelp"
            >
              <option value="low">Low — I buy only what I need</option>
              <option value="medium">Medium — Occasional non-essential purchases</option>
              <option value="high">High — Frequent shopping for new items</option>
            </select>
            <small id="shopHelp" className="form-text">How often do you buy non-essential goods?</small>
          </div>

          <div className="mb-4">
            <label htmlFor="recycling" className="form-label">Recycling habits</label>
            <select
              id="recycling"
              className="form-select"
              value={formData.lifestyle.recyclingHabit}
              onChange={(e) => updateField('lifestyle', 'recyclingHabit', e.target.value)}
              aria-describedby="recycleHelp"
            >
              <option value="full">I recycle everything I can</option>
              <option value="partial">I recycle some items</option>
              <option value="none">I don't recycle</option>
            </select>
            <small id="recycleHelp" className="form-text">How consistently do you recycle?</small>
          </div>

          <div className="mb-3">
            <label htmlFor="water" className="form-label">Water usage</label>
            <select
              id="water"
              className="form-select"
              value={formData.lifestyle.waterUsage}
              onChange={(e) => updateField('lifestyle', 'waterUsage', e.target.value)}
              aria-describedby="waterHelp"
            >
              <option value="low">Low — Short showers, mindful usage</option>
              <option value="medium">Medium — Average household usage</option>
              <option value="high">High — Long showers, frequent watering</option>
            </select>
            <small id="waterHelp" className="form-text">How would you rate your daily water consumption?</small>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setStep((s) => s - 1)}
          disabled={!canGoPrev}
          aria-label="Go to previous step"
        >
          ← Previous
        </button>

        {isLastStep ? (
          <button
            type="button"
            className="btn btn-accent btn-lg"
            onClick={handleSubmit}
            aria-label="Calculate your carbon footprint"
          >
            🌱 Calculate Footprint
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canGoNext}
            aria-label="Go to next step"
          >
            Next →
          </button>
        )}
      </div>
    </form>
  );
}
