import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import './ToggleSwitch.scss';

export default function ToggleSwitch() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        id="darkModeToggle"
        className="toggle-switch-checkbox"
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <label className="toggle-switch-label" htmlFor="darkModeToggle">
        <span className="toggle-switch-inner" />
        <span className="toggle-switch-switch" />
      </label>
    </div>
  );
}
