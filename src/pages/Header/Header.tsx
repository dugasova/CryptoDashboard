import React from 'react';
import Menu from '../../components/Menu/Menu';
import Logo from '../../assets/Bitcoin.svg.webp';
import './Header.scss';
import { useDarkMode } from '../../hooks/useDarkMode';
import Auth from '../../components/Auth/Auth';

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className={darkMode ? 'header--dark' : ''}>
      <div className="logo">
        <img src={Logo} alt="Bitcoin Logo" />
        <h2 className='logo__name'>Crypto</h2>
      </div>
      <Menu />
      <div>
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Auth />
      </div>
    </header>
  )
}
