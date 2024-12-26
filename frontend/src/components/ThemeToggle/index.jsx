import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggleLayout from './Layout';

const ThemeToggle = ({ className }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ThemeToggleLayout
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      className={className}
    />
  );
};

export default ThemeToggle; 