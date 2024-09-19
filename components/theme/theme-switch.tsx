import React from 'react';
import { useTheme } from '@/context/theme-context';

const ThemeSwitch: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <label htmlFor="theme-switch" className="mr-2 text-gray-400">
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </label>
      <input
        id="theme-switch"
        type="checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
        className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer"
        style={{ accentColor: '#4A5568' }} // Change this if needed
      />
      <span
        className={`absolute top-0 left-0 w-6 h-6 bg-white rounded-full transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'} transition-transform`}
      ></span>
    </div>
  );
};

export default ThemeSwitch;
