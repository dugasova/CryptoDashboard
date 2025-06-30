import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './AuthForm.scss';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error('AuthForm must be used within an AuthProvider');
  }

  const { login, register, setIsAuth } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let success = false;
    if (type === 'login') {
      success = await login(username, password);
      if (success) {
        navigate('/my-crypto'); // Redirect to a protected route on successful login
      } else {
        setError('Invalid username or password');
      }
    } else { // type === 'register'
      success = await register(username, password);
      if (success) {
        // Optionally log in the user after successful registration
        setIsAuth(true);
        navigate('/my-crypto'); // Redirect to a protected route on successful registration
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn">
          {type === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
