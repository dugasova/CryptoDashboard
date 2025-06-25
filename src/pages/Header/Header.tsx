import React from 'react';
import Menu from '../../components/Menu/Menu';
import Logo  from '../../assets/Bitcoin.svg.webp';
import './Header.scss';
import { useDarkMode } from '../../hooks/useDarkMode'; // Import the useDarkMode hook
import Auth from '../../components/Auth/Auth';

export default function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Use the useDarkMode hook to access dark mode state and toggle action

  return (
    <header className={darkMode ? 'header--dark' : ''}> {/* Apply dark mode class to header */}
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
