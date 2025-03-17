import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ColorMode, getTheme } from '@/utils/theme';

interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialColorMode?: ColorMode;
}> = ({ children, initialColorMode }) => {
  const systemColorScheme = useColorScheme() as ColorMode | null;
  const [colorMode, setColorMode] = useState<ColorMode>(
    initialColorMode || systemColorScheme || 'dark'
  );

  useEffect(() => {
    if (!initialColorMode && systemColorScheme) {
      setColorMode(systemColorScheme);
    }
  }, [systemColorScheme, initialColorMode]);

  const theme = getTheme(colorMode);

  const toggleColorMode = () => {
    setColorMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, colorMode, toggleColorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};