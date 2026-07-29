import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { DarkModeProvider } from '../../context/DarkModeContext.tsx';
import MobileMenu from './MobileMenu';

describe('MobileMenu', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <DarkModeProvider>
            <MobileMenu />
          </DarkModeProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });
});
