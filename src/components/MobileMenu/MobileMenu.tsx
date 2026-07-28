import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';
import Auth from '../Auth/Auth';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import './MobileMenu.scss';

const routes = [
  { path: '/', title: 'Home' },
  { path: '/my-crypto', title: 'My Crypto' },
  { path: '/admin', title: 'Admin' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu__trigger"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <HiOutlineXMark size={26} /> : <HiOutlineBars3 size={26} />}
      </button>

      <div
        className={`mobile-menu__backdrop${isOpen ? ' mobile-menu__backdrop--visible' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <nav
        id="mobile-menu-panel"
        className={`mobile-menu__panel${isOpen ? ' mobile-menu__panel--open' : ''}`}
        inert={!isOpen ? true : undefined}
      >
        <ul className="mobile-menu__list">
          {routes.map((item) => (
            <li key={item.path} className="mobile-menu__list-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `mobile-menu__link${isActive ? ' mobile-menu__link--active' : ''}`
                }
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mobile-menu__footer">
          <Auth />
          <ToggleSwitch />
        </div>
      </nav>
    </div>
  );
}
