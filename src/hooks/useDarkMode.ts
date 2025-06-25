import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext.ts'; // Explicitly import from .ts file

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};
