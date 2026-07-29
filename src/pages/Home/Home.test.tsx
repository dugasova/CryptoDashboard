import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { makeCoin } from '../../test/fixtures';
import type { CoinData } from '../../types/cryptoTypes';

vi.mock('../../services/cryptos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/cryptos')>();
  return {
    ...actual,
    getCoinList: vi.fn(),
    getCoinsByIds: vi.fn(),
    searchCoins: vi.fn(),
  };
});

import { getCoinList, ApiError } from '../../services/cryptos';
import useCryptoStore from '../../store/cryptoStore';
import Home from './Home';

const mockGetCoinList = vi.mocked(getCoinList);

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crypto/:id" element={<div>Coin Details Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // Home reads/writes the real (persisted) store singleton, so reset it by
  // hand instead of remounting the module — components elsewhere already
  // hold a reference to this exact store instance.
  useCryptoStore.setState({
    coins: [],
    loading: false,
    error: null,
    currentPage: 1,
    minMarketCap: '',
    maxMarketCap: '',
    searchQuery: '',
    hasNextPage: true,
    selectedCoinsByUser: {},
  });
});

describe('Home — loading and error states', () => {
  it('shows a skeleton loader while the initial fetch is in flight', async () => {
    let resolveFetch!: (coins: CoinData[]) => void;
    mockGetCoinList.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));

    const { container } = renderHome();

    expect(container.querySelector('.skeleton-loader')).toBeInTheDocument();

    resolveFetch([makeCoin()]);
    await waitFor(() => expect(container.querySelector('.skeleton-loader')).not.toBeInTheDocument());
  });

  it('shows an error message with a working retry button', async () => {
    mockGetCoinList.mockRejectedValueOnce(
      new ApiError('Too many requests to CoinGecko. Please wait a moment and try again.', 429)
    );
    const user = userEvent.setup();
    renderHome();

    expect(await screen.findByText(/too many requests to coingecko/i)).toBeInTheDocument();

    mockGetCoinList.mockResolvedValueOnce([makeCoin({ id: 'bitcoin', name: 'Bitcoin' })]);
    await user.click(screen.getByRole('button', { name: /retry/i }));

    expect(await screen.findByText('Bitcoin (BTC)')).toBeInTheDocument();
  });
});

describe('Home — market cap filter', () => {
  it('shows a message when the filter excludes every coin on the page', async () => {
    useCryptoStore.setState({ minMarketCap: 1_000_000_000_000 });
    mockGetCoinList.mockResolvedValue([makeCoin({ market_cap: 1000 })]);

    renderHome();

    expect(
      await screen.findByText(/no coins on this page match the market cap filter/i)
    ).toBeInTheDocument();
  });

  it('renders only coins within the min/max market cap range', async () => {
    useCryptoStore.setState({ minMarketCap: 500, maxMarketCap: 1500 });
    mockGetCoinList.mockResolvedValue([
      makeCoin({ id: 'too-small', name: 'TooSmall', symbol: 'ts', market_cap: 100 }),
      makeCoin({ id: 'in-range', name: 'InRange', symbol: 'ir', market_cap: 1000 }),
      makeCoin({ id: 'too-big', name: 'TooBig', symbol: 'tb', market_cap: 5000 }),
    ]);

    renderHome();

    expect(await screen.findByText('InRange (IR)')).toBeInTheDocument();
    expect(screen.queryByText('TooSmall (TS)')).not.toBeInTheDocument();
    expect(screen.queryByText('TooBig (TB)')).not.toBeInTheDocument();
  });
});

describe('Home — navigation', () => {
  it('navigates to the coin details page when a row is clicked', async () => {
    mockGetCoinList.mockResolvedValue([makeCoin({ id: 'bitcoin', name: 'Bitcoin' })]);
    const user = userEvent.setup();
    renderHome();

    const row = (await screen.findByText('Bitcoin (BTC)')).closest('tr');
    expect(row).not.toBeNull();
    await user.click(row!);

    expect(await screen.findByText('Coin Details Page')).toBeInTheDocument();
  });
});
