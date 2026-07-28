import React, { useContext, useEffect } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import './Home.scss';
import useCryptoStore from '../../store/cryptoStore';
import AuthContext from '../../context/AuthContext';
import type { CoinData } from '../../types/cryptoTypes';
import MarketCapFilter from '../../components/MarketCapFilter/MarketCapFilter';
import SearchBar from '../../components/SearchBar/SearchBar';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const username = authContext?.username ?? null;

  // Use state and actions from the Zustand store
  const {
    coins,
    loading,
    error,
    currentPage,
    minMarketCap,
    maxMarketCap,
    searchQuery,
    fetchCoins,
    addSelectedCoin,
  } = useCryptoStore();

  useEffect(() => {
    // Coins are paginated server-side and search re-queries CoinGecko, so
    // re-fetch whenever the page or the (debounced) search query changes.
    fetchCoins();
  }, [fetchCoins, currentPage, searchQuery]);

  // The min/max market cap filter narrows the coins already loaded for this
  // page — CoinGecko's /coins/markets endpoint has no server-side market cap
  // filter, so a page can legitimately show fewer rows (or none) than usual.
  const filteredCoins = coins.filter((coin: CoinData) => {
    const min = typeof minMarketCap === 'number' ? minMarketCap : 0;
    const max = typeof maxMarketCap === 'number' ? maxMarketCap : Infinity;
    return coin.market_cap >= min && coin.market_cap <= max;
  });

  return (
    <div className="home-container">
      <h1>Cryptocurrency Prices by Market Cap</h1>

      {/* Kept mounted across loading/error states so typed input isn't lost mid-fetch */}
      <SearchBar />
      <MarketCapFilter />

      {error ? (
        <div className="home-error">
          <p>Error: {error}</p>
          <button onClick={() => fetchCoins()}>Retry</button>
        </div>
      ) : loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {filteredCoins.length === 0 && (
            <p>
              {searchQuery.trim()
                ? `No coins found matching "${searchQuery.trim()}".`
                : 'No coins on this page match the market cap filter — try Next/Previous or widen the range.'}
            </p>
          )}

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
              {filteredCoins.map((coin: CoinData) => (
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
                          <YAxis hide domain={['dataMin', 'dataMax']} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={
                              coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1] >= coin.sparkline_in_7d.price[0]
                                ? 'green'
                                : 'red'
                            }
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (username) addSelectedCoin(username, coin); }}
                      disabled={!username}
                      title={username ? undefined : 'Log in to save coins to My Crypto'}
                    >
                      Add to My Crypto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <PaginationControls />
    </div>
  );
};

export default Home;
