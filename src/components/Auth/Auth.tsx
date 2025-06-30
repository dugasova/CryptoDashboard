import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Auth.scss';

export default function Auth() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error('Auth component must be used within an AuthProvider');
  }

  const { isAuth, setIsAuth } = authContext;

  const handleLogout = () => {
    setIsAuth(false);
    navigate('/'); // Redirect to home or login page after logout
  };

  return (
    <div className="auth-controls">
      {isAuth ? (
        <button className="auth-btn" onClick={handleLogout}>
          Logout
        </button>
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
