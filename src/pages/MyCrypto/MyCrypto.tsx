import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCryptoStore from '../../store/cryptoStore';
import { useShallow } from 'zustand/react/shallow';
import { useAuth } from '../../hooks/useAuth';
import type { CoinData } from '../../types/cryptoTypes';
import './MyCrypto.scss';

const MyCrypto: React.FC = () => {
  const { selectedCoinsByUser, removeSelectedCoin } = useCryptoStore(
    useShallow((state) => ({
      selectedCoinsByUser: state.selectedCoinsByUser,
      removeSelectedCoin: state.removeSelectedCoin,
    }))
  );
  const navigate = useNavigate();
  const { username } = useAuth();

  if (!username) {
    // AuthGuard keeps unauthenticated users out before this ever renders.
    throw new Error('MyCrypto must be used within an AuthProvider by a logged-in user');
  }
  const selectedCoins = selectedCoinsByUser[username] ?? [];

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {selectedCoins.map((coin: CoinData) => (
              <tr
                key={coin.id}
                onClick={() => navigate(`/crypto/${coin.id}`)}
                className="clickable-row"
              >
                <td>
                  <img src={coin.image}
                    alt={coin.name} width="20" height="20" />{coin.name} ({coin.symbol.toUpperCase()})</td><td>${coin.current_price.toLocaleString()}</td><td>${coin.market_cap.toLocaleString()}
                </td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); removeSelectedCoin(username, coin.id); }}>Remove</button>
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
