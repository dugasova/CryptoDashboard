import React from 'react';
import useCryptoStore from '../../store/cryptoStore';
import './MarketCapFilter.scss';

const MarketCapFilter: React.FC = () => {
  const { minMarketCap, maxMarketCap, setMinMarketCap, setMaxMarketCap } = useCryptoStore();

  const handleMinMarketCapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinMarketCap(value === '' ? '' : Number(value));
  };

  const handleMaxMarketCapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxMarketCap(value === '' ? '' : Number(value));
  };

  return (
    <div className="filter-controls">
      <label htmlFor="minMarketCap">Min Market Cap:</label>
      <input
        type="number"
        id="minMarketCap"
        value={minMarketCap}
        onChange={handleMinMarketCapChange}
        placeholder="e.g., 1000000"
      />

      <label htmlFor="maxMarketCap">Max Market Cap:</label>
      <input
        type="number"
        id="maxMarketCap"
        value={maxMarketCap}
        onChange={handleMaxMarketCapChange}
        placeholder="e.g., 1000000000"
      />
    </div>
  );
};

export default MarketCapFilter;
