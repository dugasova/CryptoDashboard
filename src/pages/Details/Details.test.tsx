import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../services/cryptos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/cryptos')>();
  return {
    ...actual,
    getCoinDetails: vi.fn(),
    getCoinMarketChart: vi.fn(),
  };
});

import { getCoinDetails, getCoinMarketChart, ApiError } from '../../services/cryptos';
import Details from './Details';

const mockGetCoinDetails = vi.mocked(getCoinDetails);
const mockGetCoinMarketChart = vi.mocked(getCoinMarketChart);

interface CoinDetailsData {
  id: string;
  symbol: string;
  name: string;
  image: { thumb: string };
  market_data: {
    current_price: { usd: number };
    market_cap_rank: number;
    market_cap: { usd: number } | null;
    fully_diluted_valuation: { usd: number } | null;
    total_volume: { usd: number } | null;
    circulating_supply: number;
  };
  description: { en: string };
}

function makeCoinDetails(overrides: Partial<CoinDetailsData> = {}): CoinDetailsData {
  return { ...baseCoinDetails(), ...overrides };
}

function baseCoinDetails(): CoinDetailsData {
  return {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: { thumb: 'https://example.com/btc-thumb.png' },
    market_data: {
      current_price: { usd: 50000 },
      market_cap_rank: 1,
      market_cap: { usd: 900_000_000_000 },
      fully_diluted_valuation: { usd: 1_000_000_000_000 },
      total_volume: { usd: 30_000_000_000 },
      circulating_supply: 19_000_000,
    },
    description: { en: 'Bitcoin is a decentralized digital currency.' },
  };
}

function renderDetails(coinId = 'bitcoin') {
  return render(
    <MemoryRouter initialEntries={[`/crypto/${coinId}`]}>
      <Routes>
        <Route path="/crypto/:id" element={<Details />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // PriceHistoryChart mounts as soon as details load, so it needs a
  // resolvable mock too, even though these tests aren't about the chart.
  mockGetCoinMarketChart.mockResolvedValue({ prices: [], market_caps: [], total_volumes: [] });
});

describe('Details — loading and error states', () => {
  it('shows a loading message while the fetch is in flight', () => {
    mockGetCoinDetails.mockReturnValue(new Promise(() => {}));
    renderDetails();
    expect(screen.getByText(/loading details/i)).toBeInTheDocument();
  });

  it('shows an error message with a working retry button', async () => {
    mockGetCoinDetails.mockRejectedValueOnce(new ApiError('Cryptocurrency "bitcoin" not found.', 404));
    const user = userEvent.setup();
    renderDetails();

    expect(await screen.findByText('Error: Cryptocurrency "bitcoin" not found.')).toBeInTheDocument();

    mockGetCoinDetails.mockResolvedValueOnce(makeCoinDetails());
    await user.click(screen.getByRole('button', { name: /retry/i }));

    expect(await screen.findByText(/bitcoin btc/i)).toBeInTheDocument();
  });
});

describe('Details — rendered content', () => {
  it('renders the coin header and market data', async () => {
    mockGetCoinDetails.mockResolvedValue(makeCoinDetails());
    renderDetails();

    expect(await screen.findByText(/bitcoin btc/i)).toBeInTheDocument();
    expect(screen.getByText('$50000')).toBeInTheDocument();
    expect(screen.getByText(/900000000000/)).toBeInTheDocument();
    expect(screen.getByText('19000000')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin is a decentralized digital currency.')).toBeInTheDocument();
  });

  it('shows N/A for market data fields the API returned as null', async () => {
    mockGetCoinDetails.mockResolvedValue(
      makeCoinDetails({
        market_data: {
          ...baseCoinDetails().market_data,
          market_cap: null,
          fully_diluted_valuation: null,
          total_volume: null,
        },
      })
    );
    renderDetails();

    await screen.findByText(/bitcoin btc/i);
    expect(screen.getAllByText(/n\/a/i)).toHaveLength(3);
  });

  it('requests the coin id taken from the route', async () => {
    mockGetCoinDetails.mockResolvedValue(makeCoinDetails({ id: 'ethereum', symbol: 'eth', name: 'Ethereum' }));
    renderDetails('ethereum');

    await waitFor(() => expect(mockGetCoinDetails).toHaveBeenCalledWith('ethereum'));
  });
});
