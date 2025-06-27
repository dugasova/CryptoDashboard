import { createContext } from 'react';
import type { DarkModeContextType } from './DarkModeContext.tsx';

export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);
