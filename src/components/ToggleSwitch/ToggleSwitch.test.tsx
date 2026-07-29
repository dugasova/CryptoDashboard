import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DarkModeProvider } from '../../context/DarkModeContext.tsx';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch', () => {
  it('renders without crashing', () => {
    render(
      <DarkModeProvider>
        <ToggleSwitch />
      </DarkModeProvider>
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
