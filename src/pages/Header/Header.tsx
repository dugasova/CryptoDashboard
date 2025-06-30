import React from 'react';
import Menu from '../../components/Menu/Menu';
import Logo from '../../assets/Bitcoin.svg.webp';
import './Header.scss';
import { useDarkMode } from '../../hooks/useDarkMode';
import Auth from '../../components/Auth/Auth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className={darkMode ? 'header--dark' : ''}>
      <div className="logo" onClick={() => navigate('/')}>
        <img src={Logo} alt="Bitcoin Logo" />
        <h2 className='logo__name'>Crypto</h2>
      </div>
      <div className="header__right">
        <Menu />
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Auth />
      </div>
    </header>
  )
}
