import React from 'react';
import { useMedia } from 'use-media';

const ThemeContext = React.createContext(null);

export const ThemeProvider = ({ children }) => {
  const useDarkTheme = useMedia('(prefers-color-scheme: dark)');

  return (
    <ThemeContext.Provider value={{ useDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
