const APY_URL =  'https://api.coingecko.com/api/v3';
const API_KEY = `CG-wkfMVNPvgZ8YuSb2p2Ah2qJk`;

export const getCoinList = async (page: number = 1, per_page: number = 100) => {
  try {
    const response = await fetch(`${APY_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage='1h%2C24h%2C7d'&x_cg_demo_api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch coin list:", error);
    return [];
  }
};

export const getCoinDetails = async (coinId: string) => {
  try {
    const response = await fetch(`${APY_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error fetching details for ${coinId}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch details for ${coinId}:`, error);
    return null;
  }
};

// https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_demo_api_key=CG-wkfMVNPvgZ8YuSb2p2Ah2qJk