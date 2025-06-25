import { createContext } from 'react';
import type { DarkModeContextType } from './DarkModeContext.tsx'; // Import the type from the other file

export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
