import { useState, useEffect, useCallback } from 'react';
import { useSettings, updateSettings } from '../db/useSettings';

export function useTheme() {
  const settings = useSettings();
  const [theme, setThemeState] = useState(() => {
    // Read from localStorage first for instant apply before DB loads
    return localStorage.getItem('dompetku-theme') || 'dark';
  });

  // Sync with DB settings when loaded
  useEffect(() => {
    if (settings?.theme) {
      setThemeState(settings.theme);
      localStorage.setItem('dompetku-theme', settings.theme);
    }
  }, [settings?.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const setTheme = useCallback(async (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('dompetku-theme', newTheme);
    await updateSettings({ theme: newTheme });
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [theme, setTheme]);

  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return { theme, setTheme, toggleTheme, isDark };
}
