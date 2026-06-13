import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarbonForm from '../components/calculator/CarbonForm';

describe('CarbonForm', () => {
  test('renders the form with step indicator', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    expect(screen.getByLabelText('Carbon footprint calculator form')).toBeInTheDocument();
    expect(screen.getByLabelText('Calculator steps')).toBeInTheDocument();
  });

  test('starts on transportation step', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    expect(screen.getByLabelText('Transportation details')).toBeInTheDocument();
  });

  test('navigates to next step', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    fireEvent.click(screen.getByLabelText('Go to next step'));
    expect(screen.getByLabelText('Home energy details')).toBeInTheDocument();
  });

  test('navigates back to previous step', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    fireEvent.click(screen.getByLabelText('Go to next step'));
    fireEvent.click(screen.getByLabelText('Go to previous step'));
    expect(screen.getByLabelText('Transportation details')).toBeInTheDocument();
  });

  test('previous button is disabled on first step', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    expect(screen.getByLabelText('Go to previous step')).toBeDisabled();
  });

  test('shows calculate button on last step', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    // Navigate to last step
    fireEvent.click(screen.getByLabelText('Go to next step'));
    fireEvent.click(screen.getByLabelText('Go to next step'));
    fireEvent.click(screen.getByLabelText('Go to next step'));
    expect(screen.getByLabelText('Calculate your carbon footprint')).toBeInTheDocument();
  });

  test('calls onSubmit when form is submitted', () => {
    const mockSubmit = jest.fn();
    render(<CarbonForm onSubmit={mockSubmit} />);
    // Navigate to last step
    fireEvent.click(screen.getByLabelText('Go to next step'));
    fireEvent.click(screen.getByLabelText('Go to next step'));
    fireEvent.click(screen.getByLabelText('Go to next step'));
    fireEvent.click(screen.getByLabelText('Calculate your carbon footprint'));
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  test('input fields accept values', () => {
    render(<CarbonForm onSubmit={() => {}} />);
    const carInput = screen.getByLabelText('Car kilometers per week');
    fireEvent.change(carInput, { target: { value: '100' } });
    expect(carInput.value).toBe('100');
  });
});
