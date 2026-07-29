import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CoinMarketChart } from '../../types/cryptoTypes';

vi.mock('../../services/cryptos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/cryptos')>();
  return {
    ...actual,
    getCoinMarketChart: vi.fn(),
  };
});

import { getCoinMarketChart, ApiError } from '../../services/cryptos';
import PriceHistoryChart from './PriceHistoryChart';

const mockGetCoinMarketChart = vi.mocked(getCoinMarketChart);

function makeChart(prices: [number, number][] = [[1700000000000, 50000]]): CoinMarketChart {
  return { prices, market_caps: [], total_volumes: [] };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PriceHistoryChart — loading and error states', () => {
  it('shows a loading message while the initial fetch is in flight', () => {
    mockGetCoinMarketChart.mockReturnValue(new Promise(() => {}));
    render(<PriceHistoryChart coinId="bitcoin" />);
    expect(screen.getByText(/loading price history/i)).toBeInTheDocument();
  });

  it('requests 7 days of history by default', async () => {
    mockGetCoinMarketChart.mockResolvedValue(makeChart());
    render(<PriceHistoryChart coinId="bitcoin" />);
    await waitFor(() => expect(mockGetCoinMarketChart).toHaveBeenCalledWith('bitcoin', 7));
    expect(screen.getByRole('button', { name: '7D' })).toHaveClass('active');
  });

  it('shows an error message with a working retry button', async () => {
    mockGetCoinMarketChart.mockRejectedValueOnce(new ApiError('Price history for "bitcoin" not found.', 404));
    const user = userEvent.setup();
    render(<PriceHistoryChart coinId="bitcoin" />);

    expect(await screen.findByText('Error: Price history for "bitcoin" not found.')).toBeInTheDocument();

    mockGetCoinMarketChart.mockResolvedValueOnce(makeChart());
    await user.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => expect(screen.queryByText(/error:/i)).not.toBeInTheDocument());
    expect(screen.queryByText(/loading price history/i)).not.toBeInTheDocument();
  });
});

describe('PriceHistoryChart — period switching', () => {
  it('refetches with the selected day range when a period button is clicked', async () => {
    mockGetCoinMarketChart.mockResolvedValue(makeChart());
    const user = userEvent.setup();
    render(<PriceHistoryChart coinId="bitcoin" />);
    await waitFor(() => expect(mockGetCoinMarketChart).toHaveBeenCalledWith('bitcoin', 7));

    await user.click(screen.getByRole('button', { name: '30D' }));

    await waitFor(() => expect(mockGetCoinMarketChart).toHaveBeenCalledWith('bitcoin', 30));
    expect(screen.getByRole('button', { name: '30D' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: '7D' })).not.toHaveClass('active');
  });

  it('ignores a stale response for an old period that resolves after a newer one', async () => {
    let resolveInitial!: (chart: CoinMarketChart) => void;
    const initialFetch = new Promise<CoinMarketChart>((resolve) => { resolveInitial = resolve; });
    mockGetCoinMarketChart
      .mockImplementationOnce(() => initialFetch)
      .mockImplementationOnce(() => Promise.resolve(makeChart([[1700000000000, 200]])));

    const user = userEvent.setup();
    render(<PriceHistoryChart coinId="bitcoin" />);
    expect(screen.getByText(/loading price history/i)).toBeInTheDocument();

    // Switch to 30D before the initial (7D) request resolves — this should
    // supersede it, the same "cancelled" guard the store's fetchCoins uses.
    await user.click(screen.getByRole('button', { name: '30D' }));
    await waitFor(() => expect(screen.queryByText(/loading price history/i)).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: '30D' })).toHaveClass('active');

    // The stale 7D request finally resolves — it must not revert the UI.
    resolveInitial(makeChart([[1700000000000, 100]]));
    await Promise.resolve();

    expect(screen.getByRole('button', { name: '30D' })).toHaveClass('active');
    expect(screen.queryByText(/loading price history/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error:/i)).not.toBeInTheDocument();
  });
});
