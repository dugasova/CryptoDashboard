import React from 'react';
import useCryptoStore from '../../store/cryptoStore';
import type { CoinData } from '../../types/cryptoTypes';
import './PaginationControls.scss';

const PaginationControls: React.FC = () => {
  const {
    coins,
    currentPage,
    itemsPerPage,
    minMarketCap,
    maxMarketCap,
    setCurrentPage,
  } = useCryptoStore();

  // Filter coins based on market cap input (same logic as in Home.tsx)
  const filteredCoins = coins.filter((coin: CoinData) => {
    const min = typeof minMarketCap === 'number' ? minMarketCap : 0;
    const max = typeof maxMarketCap === 'number' ? maxMarketCap : Infinity;
    return coin.market_cap >= min && coin.market_cap <= max;
  });

  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Don't render controls if there are no filtered coins or only one page
  if (filteredCoins.length === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-controls">
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
    </div>
  );
};

export default PaginationControls;
