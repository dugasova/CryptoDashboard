import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCoinList,
  getCoinDetails,
  searchCoins,
  getCoinMarketChart,
  getCoinsByIds,
} from './cryptos';

function mockResponse(status: number, body: unknown, statusText = ''): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => body,
  } as Response;
}

let mockFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockFetch = vi.fn();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('error mapping (shared by every endpoint)', () => {
  it('returns the parsed JSON body on a successful response', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, [{ id: 'bitcoin' }]));
    await expect(getCoinList()).resolves.toEqual([{ id: 'bitcoin' }]);
  });

  it('maps a 429 to a rate-limit ApiError', async () => {
    mockFetch.mockResolvedValue(mockResponse(429, {}));
    await expect(getCoinList()).rejects.toMatchObject({
      name: 'ApiError',
      status: 429,
      message: 'Too many requests to CoinGecko. Please wait a moment and try again.',
    });
  });

  it('maps a 404 to the endpoint-specific not-found ApiError', async () => {
    mockFetch.mockResolvedValue(mockResponse(404, {}));
    await expect(getCoinDetails('doesnotexist')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Cryptocurrency "doesnotexist" not found.',
    });
  });

  it('maps any other non-ok status to a generic ApiError carrying the status text', async () => {
    mockFetch.mockResolvedValue(mockResponse(500, {}, 'Internal Server Error'));
    await expect(getCoinList()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      message: 'CoinGecko request failed: Internal Server Error',
    });
  });

  it('wraps a network failure (fetch rejecting) in an ApiError', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(getCoinList()).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Network error: unable to reach CoinGecko.',
    });
  });
});

describe('getCoinList', () => {
  it('defaults to page 1 / 100 per page', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, []));
    await getCoinList();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/coins/markets');
    expect(url).toContain('page=1');
    expect(url).toContain('per_page=100');
  });

  it('forwards the requested page and page size', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, []));
    await getCoinList(3, 25);
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('page=3');
    expect(url).toContain('per_page=25');
  });
});

describe('getCoinDetails', () => {
  it('requests the given coin id', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, { id: 'ethereum' }));
    await getCoinDetails('ethereum');
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/coins/ethereum');
  });
});

describe('searchCoins', () => {
  it('URL-encodes the query and returns the coins array', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, { coins: [{ id: 'bitcoin' }] }));
    const results = await searchCoins('bit coin');
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/search?query=bit%20coin');
    expect(results).toEqual([{ id: 'bitcoin' }]);
  });

  it('returns an empty array when the response has no coins field', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, {}));
    await expect(searchCoins('nothing')).resolves.toEqual([]);
  });
});

describe('getCoinMarketChart', () => {
  it('requests the given coin id and day range', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, { prices: [], market_caps: [], total_volumes: [] }));
    await getCoinMarketChart('bitcoin', 30);
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('/coins/bitcoin/market_chart');
    expect(url).toContain('days=30');
  });
});

describe('getCoinsByIds', () => {
  it('returns an empty array without calling fetch when given no ids', async () => {
    await expect(getCoinsByIds([])).resolves.toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('joins multiple ids with a comma', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, []));
    await getCoinsByIds(['bitcoin', 'ethereum']);
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain('ids=bitcoin,ethereum');
  });
});
