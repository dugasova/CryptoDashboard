import React, { useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './Home.scss';
import useCryptoStore from '../../store/cryptoStore';
import type { CoinData } from '../../types/cryptoTypes';
import MarketCapFilter from '../MarketCapFilter/MarketCapFilter';
import PaginationControls from '../PaginationControls/PaginationControls';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Use state and actions from the Zustand store
  const {
    coins,
    loading,
    error,
    currentPage,
    itemsPerPage,
    minMarketCap,
    maxMarketCap,
    fetchCoins,
    addSelectedCoin,
  } = useCryptoStore();

  useEffect(() => {
    // Fetch coins when the component mounts
    fetchCoins();
  }, [fetchCoins]);

  // Filter coins based on market cap input
  const filteredCoins = coins.filter((coin: CoinData) => {
    const min = typeof minMarketCap === 'number' ? minMarketCap : 0;
    const max = typeof maxMarketCap === 'number' ? maxMarketCap : Infinity;
    return coin.market_cap >= min && coin.market_cap <= max;
  });

  // Implement pagination on the filtered coins
  const indexOfLastCoin = currentPage * itemsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - itemsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <h1>Cryptocurrency Prices by Market Cap</h1>

      <MarketCapFilter />

      <table className="coin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>24h Volume</th>
            <th>Market Cap</th>
            <th>Last 7 Days</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentCoins.map((coin: CoinData) => (
            <tr
              key={coin.id}
              onClick={() => navigate(`/crypto/${coin.id}`)}
              className="clickable-row"
            >
              <td>{coin.market_cap_rank}</td>
              <td>
                <img src={coin.image} alt={coin.name} width="20" height="20" />
                {coin.name} ({coin.symbol.toUpperCase()})
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_1h_in_currency && coin.price_change_percentage_1h_in_currency > 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: coin.price_change_percentage_24h_in_currency && coin.price_change_percentage_24h_in_currency > 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: coin.price_change_percentage_7d_in_currency && coin.price_change_percentage_7d_in_currency > 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>
                {coin.sparkline_in_7d?.price && (
                  <ResponsiveContainer width="100%" height={70}>
                    <LineChart data={coin.sparkline_in_7d.price.map((price: number, index: number) => ({ price, day: index }))}>
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); addSelectedCoin(coin); }}>Add to My Crypto</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render the separate PaginationControls component */}
      <PaginationControls />
    </div>
  );
};

export default Home;
