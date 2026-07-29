import React, { useCallback, useEffect } from 'react';
import './Home.scss';
import useCryptoStore from '../../store/cryptoStore';
import { useShallow } from 'zustand/react/shallow';
import { useAuth } from '../../hooks/useAuth';
import type { CoinData } from '../../types/cryptoTypes';
import MarketCapFilter from '../../components/MarketCapFilter/MarketCapFilter';
import SearchBar from '../../components/SearchBar/SearchBar';
import PaginationControls from '../../components/PaginationControls/PaginationControls';
import CoinRow from '../../components/CoinRow/CoinRow';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useAuth();

  // Selective subscription: only re-render when these specific fields change,
  // not on every store update (e.g. selectedCoinsByUser changes from other pages).
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
  } = useCryptoStore(
    useShallow((state) => ({
      coins: state.coins,
      loading: state.loading,
      error: state.error,
      currentPage: state.currentPage,
      minMarketCap: state.minMarketCap,
      maxMarketCap: state.maxMarketCap,
      searchQuery: state.searchQuery,
      fetchCoins: state.fetchCoins,
      addSelectedCoin: state.addSelectedCoin,
    }))
  );

  useEffect(() => {
    // Coins are paginated server-side and search re-queries CoinGecko, so
    // re-fetch whenever the page or the (debounced) search query changes.
    fetchCoins();
  }, [fetchCoins, currentPage, searchQuery]);

  // Stable references so CoinRow's React.memo actually prevents re-renders
  // of unrelated rows when Home re-renders (e.g. typing in the market cap filter).
  const handleRowClick = useCallback((coinId: string) => navigate(`/crypto/${coinId}`), [navigate]);
  const handleAddCoin = useCallback(
    (coin: CoinData) => { if (username) addSelectedCoin(username, coin); },
    [username, addSelectedCoin]
  );

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
        <SkeletonLoader />
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
                <CoinRow
                  key={coin.id}
                  coin={coin}
                  username={username}
                  onRowClick={handleRowClick}
                  onAddCoin={handleAddCoin}
                />
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
