import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCryptoStore from '../../store/cryptoStore';
import { getUsernames, deleteUser } from '../../services/authStorage';
import './Admin.scss';

export default function Admin() {
  const { username: currentUsername, logout } = useAuth();
  const { selectedCoinsByUser, removeUserCoins } = useCryptoStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState<string[]>(() => getUsernames());
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const handleConfirmDelete = (username: string) => {
    deleteUser(username);
    removeUserCoins(username);
    setUsers((prev) => prev.filter((existing) => existing !== username));
    setPendingDelete(null);

    if (username === currentUsername) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin</h1>
      <p className="admin-subtitle">Registered users on this device</p>

      {users.length === 0 ? (
        <p>No registered users yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Watchlist</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((username) => {
              const coins = selectedCoinsByUser[username] ?? [];

              return (
                <tr key={username}>
                  <td>
                    {username}
                    {username === currentUsername && <span className="admin-badge">You</span>}
                  </td>
                  <td>
                    {coins.length === 0 ? (
                      <span className="admin-empty">No coins</span>
                    ) : (
                      coins.map((coin) => coin.name).join(', ')
                    )}
                  </td>
                  <td className="admin-actions">
                    {pendingDelete === username ? (
                      <>
                        <span className="admin-confirm-text">Delete {username}?</span>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger"
                          onClick={() => handleConfirmDelete(username)}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="admin-btn"
                          onClick={() => setPendingDelete(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        onClick={() => setPendingDelete(username)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
