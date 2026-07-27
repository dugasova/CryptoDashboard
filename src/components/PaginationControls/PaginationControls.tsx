import React from 'react';
import useCryptoStore from '../../store/cryptoStore';
import './PaginationControls.scss';

const PaginationControls: React.FC = () => {
  const {
    coins,
    currentPage,
    hasNextPage,
    loading,
    setCurrentPage,
  } = useCryptoStore();

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

  // Don't render controls if there's nothing to paginate at all
  if (coins.length === 0 && currentPage === 1) {
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
