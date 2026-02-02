"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type DesignSettings = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  ui: {
    borderRadius: string;
    buttonStyle: string;
  };
  darkMode: {
    enabled: true;
  }
};

type ThemeContextType = {
  theme: DesignSettings | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  refreshTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  isDarkMode: false,
  toggleDarkMode: () => {},
  refreshTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<DesignSettings | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchTheme = async () => {
    try {
      const res = await fetch('/api/design');
      const data = await res.json();
      setTheme(data);
      applyTheme(data, isDarkMode);
    } catch (err) {
      console.error("Failed to fetch theme:", err);
    }
  };

  useEffect(() => {
    // Check local storage for dark mode preference
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    
    // Initial theme fetch
    fetchTheme();
  }, []);

  // Re-apply theme whenever theme data or dark mode changes
  useEffect(() => {
    if (theme) {
      applyTheme(theme, isDarkMode);
    }
  }, [isDarkMode, theme]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (theme) applyTheme(theme, newMode);
  };

  const applyTheme = (settings: DesignSettings, dark: boolean) => {
    const root = document.documentElement;
    
    // Apply UI settings
    root.style.setProperty('--radius-sm', settings.ui.borderRadius === '1.5rem' ? '1rem' : '0.375rem'); // Adjust logic as needed
    
    // Button Styles
    if (settings.ui.buttonStyle === 'pill') {
      root.style.setProperty('--radius-btn', '9999px');
    } else if (settings.ui.buttonStyle === 'sharp') {
      root.style.setProperty('--radius-btn', '0px');
    } else {
      root.style.setProperty('--radius-btn', settings.ui.borderRadius); 
    }

    if (dark) {
      // Dark Mode Overrides
      root.style.setProperty('--primary', settings.colors.primary); // Keep brand color or adjust?
      root.style.setProperty('--background', '#0f172a'); // Slate 900
      root.style.setProperty('--surface', '#1e293b');    // Slate 800
      root.style.setProperty('--surface-alt', '#334155'); // Slate 700
      root.style.setProperty('--text-main', '#f8fafc');   // Slate 50
      root.style.setProperty('--text-muted', '#94a3b8');  // Slate 400
      root.style.setProperty('--border', '#334155');      // Slate 700
      root.classList.add('dark');
    } else {
      // Light Mode (from settings)
      root.style.setProperty('--primary', settings.colors.primary);
      root.style.setProperty('--secondary', settings.colors.secondary);
      root.style.setProperty('--accent', settings.colors.accent);
      root.style.setProperty('--background', settings.colors.background);
      root.style.setProperty('--surface', settings.colors.surface);
      root.style.setProperty('--surface-alt', '#f1f5f9'); // Default or configurable?
      root.style.setProperty('--text-main', '#0f172a');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border', '#e2e8f0');
      root.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode, refreshTheme: fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
