import React, { useContext } from 'react';
import './Auth.scss';
import AuthContext from '../../context/AuthContext';


export default function Auth() {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const handleAuth = () => setIsAuth(prev => !prev);
  return (
    <button className='auth-btn' onClick={handleAuth}>{isAuth ? 'Logout' : 'Login'}</button>
  )
}
