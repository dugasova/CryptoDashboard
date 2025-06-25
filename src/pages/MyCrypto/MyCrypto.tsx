import React from 'react';
import useCryptoStore from '../../store/cryptoStore';
import type { CoinData } from '../../types/cryptoTypes';
import './MyCrypto.scss';

const MyCrypto: React.FC = () => {
  const { selectedCoins, removeSelectedCoin } = useCryptoStore();

  return (
    <div className="my-crypto-container">
      <h1>My Cryptocurrencies</h1>

      {selectedCoins.length === 0 ? (
        <p>You haven't selected any cryptocurrencies yet.</p>
      ) : (
        <table className="my-crypto-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Price</th>
              <th>Market Cap</th>
              <th>24h Volume</th>
              <th></th> {/* Column for remove button */}
            </tr>
          </thead>
          <tbody>
            {selectedCoins.map((coin: CoinData) => (
              <tr key={coin.id}>
                <td>
                  <img src={coin.image} alt={coin.name} width="20" height="20" />
                  {coin.name} ({coin.symbol.toUpperCase()})
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td>
                  <button onClick={() => removeSelectedCoin(coin.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCrypto;
