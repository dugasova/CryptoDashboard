import React, { useEffect, useState } from 'react';
import useCryptoStore from '../../store/cryptoStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import './SearchBar.scss';

const SearchBar: React.FC = () => {
  const setSearchQuery = useCryptoStore((state) => state.setSearchQuery);
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebouncedValue(inputValue, 400);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  return (
    <div className="search-bar">
      <label htmlFor="coin-search">Search:</label>
      <input
        type="text"
        id="coin-search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search by name or ticker (e.g. Bitcoin, BTC)"
      />
    </div>
  );
};

export default SearchBar;
