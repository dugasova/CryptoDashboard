const APY_URL =  'https://api.coingecko.com/api/v3';
const API_KEY = `CG-wkfMVNPvgZ8YuSb2p2Ah2qJk`;

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseResponse(response: Response, notFoundMessage: string) {
  if (!response.ok) {
    if (response.status === 429) {
      throw new ApiError('Too many requests to CoinGecko. Please wait a moment and try again.', 429);
    }
    if (response.status === 404) {
      throw new ApiError(notFoundMessage, 404);
    }
    throw new ApiError(`CoinGecko request failed: ${response.statusText}`, response.status);
  }
  return response.json();
}

export const getCoinList = async (page: number = 1, per_page: number = 100) => {
  let response: Response;
  try {
    response = await fetch(`${APY_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage='1h%2C24h%2C7d'&x_cg_demo_api_key=${API_KEY}`);
  } catch (error) {
    console.error('Failed to fetch coin list:', error);
    throw new ApiError('Network error: unable to reach CoinGecko.');
  }
  return parseResponse(response, 'Coin list not found.');
};

export const getCoinDetails = async (coinId: string) => {
  let response: Response;
  try {
    response = await fetch(`${APY_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${API_KEY}`);
  } catch (error) {
    console.error(`Failed to fetch details for ${coinId}:`, error);
    throw new ApiError('Network error: unable to reach CoinGecko.');
  }
  return parseResponse(response, `Cryptocurrency "${coinId}" not found.`);
};

// https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=CG-wkfMVNPvgZ8YuSb2p2Ah2qJk