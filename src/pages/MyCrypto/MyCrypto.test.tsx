import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { loginAs } from '../../test/authTestUtils';
import { makeCoin } from '../../test/fixtures';
import useCryptoStore from '../../store/cryptoStore';
import MyCrypto from './MyCrypto';

function renderMyCrypto() {
  return render(
    <MemoryRouter initialEntries={['/my-crypto']}>
      <AuthProvider>
        <Routes>
          <Route path="/my-crypto" element={<MyCrypto />} />
          <Route path="/crypto/:id" element={<div>Coin Details Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  // MyCrypto reads the real (persisted) store singleton, so reset it by hand
  // rather than remounting the module.
  useCryptoStore.setState({ selectedCoinsByUser: {} });
});

describe('MyCrypto', () => {
  it('shows a message when the user has no selected coins', async () => {
    await loginAs('alice');
    renderMyCrypto();

    expect(screen.getByText(/you haven't selected any cryptocurrencies yet/i)).toBeInTheDocument();
  });

  it('removes a coin from the current user without affecting other users', async () => {
    await loginAs('alice');
    useCryptoStore.setState({
      selectedCoinsByUser: {
        alice: [
          makeCoin({ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' }),
          makeCoin({ id: 'ethereum', name: 'Ethereum', symbol: 'eth' }),
        ],
        bob: [makeCoin({ id: 'litecoin', name: 'Litecoin', symbol: 'ltc' })],
      },
    });
    const user = userEvent.setup();
    renderMyCrypto();

    const bitcoinRow = screen.getByText('Bitcoin (BTC)').closest('tr')!;
    await user.click(within(bitcoinRow).getByRole('button', { name: /remove/i }));

    expect(screen.queryByText('Bitcoin (BTC)')).not.toBeInTheDocument();
    expect(screen.getByText('Ethereum (ETH)')).toBeInTheDocument();
    expect(useCryptoStore.getState().selectedCoinsByUser.bob).toHaveLength(1);
  });
});
