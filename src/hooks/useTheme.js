import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to access current theme context.
 * @returns {{ theme: string, toggleTheme: function }} Theme state and toggle function
 * @throws {Error} If called outside of a ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
