import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './styles.css';

const ThemeToggleLayout = ({ className }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${className || ''}`}
      onClick={toggleTheme}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <i className={`bi bi-${isDarkMode ? 'sun-fill' : 'moon-stars-fill'}`}></i>
    </button>
  );
};

export default ThemeToggleLayout; 