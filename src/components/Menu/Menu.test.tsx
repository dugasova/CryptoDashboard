import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Menu from './Menu';

describe('Menu', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Menu />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
