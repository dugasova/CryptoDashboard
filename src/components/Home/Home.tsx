import React, { useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './Home.scss';
import useCryptoStore from '../../store/cryptoStore';
import type { CoinData } from '../../types/cryptoTypes';
import MarketCapFilter from '../MarketCapFilter/MarketCapFilter';
import PaginationControls from '../PaginationControls/PaginationControls';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home: React.FC = () => {
  const navigate = useNavigate(); // Get the navigate function

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
    addSelectedCoin, // Import the addSelectedCoin action
  } = useCryptoStore();

  useEffect(() => {
    // Fetch coins when the component mounts
    fetchCoins();
  }, [fetchCoins]); // Add fetchCoins to dependency array

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

  // Remove unused filter handling functions
  // const handleMinMarketCapChange = (event: React.ChangeEvent<HTMLInputElement>) => { ... };
  // const handleMaxMarketCapChange = (event: React.ChangeEvent<HTMLInputElement>) => { ... };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <h1>Cryptocurrency Prices by Market Cap</h1>

      {/* Render the separate MarketCapFilter component */}
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
            <th></th> {/* New column for selection */}
          </tr>
        </thead>
        <tbody>
          {currentCoins.map((coin: CoinData) => (
            <tr 
              key={coin.id} 
              onClick={() => navigate(`/crypto/${coin.id}`)} // Add onClick handler
              className="clickable-row" // Add class for styling
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
                  <ResponsiveContainer width="70%" height={70}>
                    <LineChart data={coin.sparkline_in_7d.price.map((price: number, index: number) => ({ price, day: index }))}>
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8" // You can customize the color
                        strokeWidth={2}
                        dot={false} // Hide data points
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); addSelectedCoin(coin); }}>Add to My Crypto</button> {/* Stop propagation to prevent row click */}
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
