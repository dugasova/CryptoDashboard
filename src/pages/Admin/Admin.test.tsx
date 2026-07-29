import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { registerUser } from '../../services/authStorage';
import { loginAs } from '../../test/authTestUtils';
import { makeCoin } from '../../test/fixtures';
import useCryptoStore from '../../store/cryptoStore';
import Admin from './Admin';

function renderAdmin() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  // Admin reads the real (persisted) store singleton, so reset it by hand
  // rather than remounting the module.
  useCryptoStore.setState({ selectedCoinsByUser: {} });
});

describe('Admin — empty state', () => {
  it('shows a message when there are no registered users', () => {
    renderAdmin();
    expect(screen.getByText(/no registered users yet/i)).toBeInTheDocument();
  });
});

describe('Admin — user list', () => {
  it('lists registered users with their watchlist and a "You" badge for the current user', async () => {
    await loginAs('alice');
    await registerUser('bob', 'password123');
    useCryptoStore.setState({
      selectedCoinsByUser: { alice: [makeCoin({ id: 'bitcoin', name: 'Bitcoin' })] },
    });

    renderAdmin();

    const aliceRow = screen.getByText('alice').closest('tr')!;
    expect(within(aliceRow).getByText('You')).toBeInTheDocument();
    expect(within(aliceRow).getByText('Bitcoin')).toBeInTheDocument();

    const bobRow = screen.getByText('bob').closest('tr')!;
    expect(within(bobRow).queryByText('You')).not.toBeInTheDocument();
    expect(within(bobRow).getByText(/no coins/i)).toBeInTheDocument();
  });
});

describe('Admin — deleting a user', () => {
  it('asks for confirmation and lets you cancel without deleting', async () => {
    await registerUser('carol', 'password123');
    const user = userEvent.setup();
    renderAdmin();

    const carolRow = screen.getByText('carol').closest('tr')!;
    await user.click(within(carolRow).getByRole('button', { name: /delete/i }));
    expect(within(carolRow).getByText(/delete carol\?/i)).toBeInTheDocument();

    await user.click(within(carolRow).getByRole('button', { name: /cancel/i }));
    expect(screen.getByText('carol')).toBeInTheDocument();
    expect(within(carolRow).getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });

  it('removes the user and their watchlist on confirm', async () => {
    await registerUser('carol', 'password123');
    useCryptoStore.setState({ selectedCoinsByUser: { carol: [makeCoin()] } });
    const user = userEvent.setup();
    renderAdmin();

    const carolRow = screen.getByText('carol').closest('tr')!;
    await user.click(within(carolRow).getByRole('button', { name: /delete/i }));
    await user.click(within(carolRow).getByRole('button', { name: /confirm/i }));

    expect(screen.queryByText('carol')).not.toBeInTheDocument();
    expect(useCryptoStore.getState().selectedCoinsByUser.carol).toBeUndefined();
  });

  it('logs out and navigates home when the current user deletes their own account', async () => {
    await loginAs('dave');
    const user = userEvent.setup();
    renderAdmin();

    const daveRow = screen.getByText('dave').closest('tr')!;
    await user.click(within(daveRow).getByRole('button', { name: /delete/i }));
    await user.click(within(daveRow).getByRole('button', { name: /confirm/i }));

    expect(await screen.findByText('Home Page')).toBeInTheDocument();
  });
});
