import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeCoin } from '../test/fixtures';

vi.mock('../services/cryptos', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/cryptos')>();
  return {
    ...actual,
    getCoinList: vi.fn(),
    getCoinsByIds: vi.fn(),
    searchCoins: vi.fn(),
  };
});

import { getCoinList, getCoinsByIds, searchCoins, ApiError } from '../services/cryptos';
import type { CoinData } from '../types/cryptoTypes';

const mockGetCoinList = vi.mocked(getCoinList);
const mockGetCoinsByIds = vi.mocked(getCoinsByIds);
const mockSearchCoins = vi.mocked(searchCoins);

// The store is a module-level singleton (zustand), so each test needs a fresh
// module instance — otherwise state and the mocked-request race counter would
// leak between tests.
let useCryptoStore: typeof import('./cryptoStore')['default'];

beforeEach(async () => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.resetModules();
  ({ default: useCryptoStore } = await import('./cryptoStore'));
});

describe('fetchCoins', () => {
  it('loads a page of coins and flags hasNextPage when the page is full', async () => {
    const coins = Array.from({ length: 25 }, (_, i) => makeCoin({ id: `coin-${i}` }));
    mockGetCoinList.mockResolvedValue(coins);

    await useCryptoStore.getState().fetchCoins();

    const state = useCryptoStore.getState();
    expect(state.coins).toEqual(coins);
    expect(state.hasNextPage).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('flags hasNextPage=false when a page comes back short', async () => {
    mockGetCoinList.mockResolvedValue([makeCoin()]);

    await useCryptoStore.getState().fetchCoins();

    expect(useCryptoStore.getState().hasNextPage).toBe(false);
  });

  it('searches instead of paginating once a search query is set', async () => {
    useCryptoStore.getState().setSearchQuery('bitcoin');
    mockSearchCoins.mockResolvedValue([
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', market_cap_rank: 1, thumb: '', large: '' },
    ]);
    mockGetCoinsByIds.mockResolvedValue([makeCoin()]);

    await useCryptoStore.getState().fetchCoins();

    expect(mockGetCoinList).not.toHaveBeenCalled();
    expect(mockGetCoinsByIds).toHaveBeenCalledWith(['bitcoin']);
    expect(useCryptoStore.getState().hasNextPage).toBe(false);
    expect(useCryptoStore.getState().coins).toHaveLength(1);
  });

  it('surfaces an ApiError message and clears coins on failure', async () => {
    mockGetCoinList.mockRejectedValue(new ApiError('Too many requests to CoinGecko. Please wait a moment and try again.', 429));

    await useCryptoStore.getState().fetchCoins();

    const state = useCryptoStore.getState();
    expect(state.error).toBe('Too many requests to CoinGecko. Please wait a moment and try again.');
    expect(state.coins).toEqual([]);
    expect(state.hasNextPage).toBe(false);
    expect(state.loading).toBe(false);
  });

  it('falls back to a generic message for non-ApiError failures', async () => {
    mockGetCoinList.mockRejectedValue(new Error('boom'));

    await useCryptoStore.getState().fetchCoins();

    expect(useCryptoStore.getState().error).toBe('Failed to fetch cryptocurrency data.');
  });

  it('ignores a stale response that resolves after a newer request', async () => {
    let resolveFirst!: (coins: CoinData[]) => void;
    const firstRequest = new Promise<CoinData[]>((resolve) => { resolveFirst = resolve; });

    mockGetCoinList
      .mockImplementationOnce(() => firstRequest)
      .mockImplementationOnce(() => Promise.resolve([makeCoin({ id: 'second' })]));

    const firstCall = useCryptoStore.getState().fetchCoins();
    const secondCall = useCryptoStore.getState().fetchCoins();

    // The second (newer) request resolves first...
    await secondCall;
    expect(useCryptoStore.getState().coins).toEqual([makeCoin({ id: 'second' })]);

    // ...and when the older, slower first request finally resolves, it must
    // not overwrite the newer data.
    resolveFirst([makeCoin({ id: 'stale' })]);
    await firstCall;

    expect(useCryptoStore.getState().coins).toEqual([makeCoin({ id: 'second' })]);
    expect(useCryptoStore.getState().loading).toBe(false);
  });
});

describe('pagination and filter setters', () => {
  it('resets currentPage to 1 when the market cap filter changes', () => {
    useCryptoStore.getState().setCurrentPage(3);
    useCryptoStore.getState().setMinMarketCap(1000);
    expect(useCryptoStore.getState().currentPage).toBe(1);

    useCryptoStore.getState().setCurrentPage(3);
    useCryptoStore.getState().setMaxMarketCap(2000);
    expect(useCryptoStore.getState().currentPage).toBe(1);
  });

  it('resets currentPage to 1 when the search query changes', () => {
    useCryptoStore.getState().setCurrentPage(3);
    useCryptoStore.getState().setSearchQuery('eth');
    expect(useCryptoStore.getState().currentPage).toBe(1);
  });
});

describe('selected coins (per user)', () => {
  it('adds a coin to a specific user watchlist', () => {
    const coin = makeCoin();
    useCryptoStore.getState().addSelectedCoin('alice', coin);
    expect(useCryptoStore.getState().selectedCoinsByUser.alice).toEqual([coin]);
  });

  it('does not add the same coin twice for the same user', () => {
    const coin = makeCoin();
    useCryptoStore.getState().addSelectedCoin('alice', coin);
    useCryptoStore.getState().addSelectedCoin('alice', coin);
    expect(useCryptoStore.getState().selectedCoinsByUser.alice).toHaveLength(1);
  });

  it('keeps watchlists isolated between users', () => {
    useCryptoStore.getState().addSelectedCoin('alice', makeCoin({ id: 'bitcoin' }));
    useCryptoStore.getState().addSelectedCoin('bob', makeCoin({ id: 'ethereum' }));

    expect(useCryptoStore.getState().selectedCoinsByUser.alice).toHaveLength(1);
    expect(useCryptoStore.getState().selectedCoinsByUser.bob).toHaveLength(1);
    expect(useCryptoStore.getState().selectedCoinsByUser.alice[0].id).toBe('bitcoin');
  });

  it('removes a single coin from one user without affecting others', () => {
    useCryptoStore.getState().addSelectedCoin('alice', makeCoin({ id: 'bitcoin' }));
    useCryptoStore.getState().addSelectedCoin('alice', makeCoin({ id: 'ethereum' }));

    useCryptoStore.getState().removeSelectedCoin('alice', 'bitcoin');

    const alice = useCryptoStore.getState().selectedCoinsByUser.alice;
    expect(alice).toHaveLength(1);
    expect(alice[0].id).toBe('ethereum');
  });

  it('removes all coins for a user on removeUserCoins', () => {
    useCryptoStore.getState().addSelectedCoin('alice', makeCoin());
    useCryptoStore.getState().removeUserCoins('alice');

    expect(useCryptoStore.getState().selectedCoinsByUser.alice).toBeUndefined();
  });
});
