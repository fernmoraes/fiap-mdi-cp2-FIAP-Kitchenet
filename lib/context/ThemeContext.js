import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@kitchenet_theme';

const lightColors = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  inputBackground: '#EBEBEB',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#D0D0D0',
  placeholder: '#999999',
  primary: '#F23064',
  disabled: '#BDBDBD',
  divisor: '#D0D0D0',
  waitButton: '#F0F0F0',
  waitButtonText: '#FF9800',
  concludedButton: '#E8E8E8',
  concludedText: '#888888',
  paymentButton: '#EBEBEB',
  paymentButtonText: '#1A1A1A',
};

const darkColors = {
  background: '#262626',
  card: '#2c2c2c',
  surface: '#404040',
  inputBackground: '#404040',
  text: '#FFFFFF',
  textSecondary: '#8C8C8C',
  border: '#8C8C8C',
  placeholder: '#8C8C8C',
  primary: '#F23064',
  disabled: '#8C8C8C',
  divisor: '#1a1a1a',
  waitButton: '#333333',
  waitButtonText: '#FF9800',
  concludedButton: '#333333',
  concludedText: '#8C8C8C',
  paymentButton: '#404040',
  paymentButtonText: '#FFFFFF',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'dark') setIsDark(true);
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: isDark ? darkColors : lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
