import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.scss';

export default function Auth() {
  const { isAuth, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="auth-controls">
      {isAuth ? (
        <>
          {username && <span className="auth-username">{username}</span>}
          <button className="auth-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="auth-btn">
            Login
          </Link>
          <Link to="/register" className="auth-btn">
            Register
          </Link>
        </>
      )}
    </div>
  );
}
