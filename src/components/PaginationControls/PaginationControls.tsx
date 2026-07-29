import React from 'react';
import useCryptoStore from '../../store/cryptoStore';
import { useShallow } from 'zustand/react/shallow';
import './PaginationControls.scss';

const PaginationControls: React.FC = () => {
  const {
    coins,
    currentPage,
    hasNextPage,
    loading,
    searchQuery,
    setCurrentPage,
  } = useCryptoStore(
    useShallow((state) => ({
      coins: state.coins,
      currentPage: state.currentPage,
      hasNextPage: state.hasNextPage,
      loading: state.loading,
      searchQuery: state.searchQuery,
      setCurrentPage: state.setCurrentPage,
    }))
  );

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Search results aren't paginated, and there's nothing to paginate when empty
  if (searchQuery.trim() || (coins.length === 0 && currentPage === 1)) {
    return null;
  }

  return (
    <div className="pagination-controls">
      <button onClick={handlePreviousPage} disabled={currentPage === 1 || loading}>Previous</button>
      <span>Page {currentPage}</span>
      <button onClick={handleNextPage} disabled={!hasNextPage || loading}>Next</button>
    </div>
  );
};

export default PaginationControls;
