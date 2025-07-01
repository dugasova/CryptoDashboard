import React from 'react';
import Menu from '../../components/Menu/Menu';
import Logo from '../../assets/Bitcoin.svg.webp';
import './Header.scss';
import Auth from '../../components/Auth/Auth';
import ToggleSwitch from '../../components/ToggleSwitch/ToggleSwitch';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function Header() {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className={darkMode ? 'header--dark' : ''}>
      <div className="logo" onClick={() => navigate('/')}>
        <img src={Logo} alt="Bitcoin Logo" />
        <h2 className='logo__name'>Crypto</h2>
      </div>
      <div className="header__right">
        <Menu />
        <div className="header__right__auth">
          <Auth />
          <ToggleSwitch />
        </div>
      </div>
    </header>
  )
}
