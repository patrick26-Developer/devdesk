// Gestion du thème avec 3 états : 'light', 'dark' ou 'system' (suit la préférence de l'OS).
// createContext/useContext : partage l'état sans prop-drilling.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  // Choix de l'utilisateur.
  theme: Theme;
  // Thème réellement appliqué (résout 'system' selon l'OS).
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  // Cycle light -> dark -> system, conservé pour les raccourcis / compat.
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'devdesk-theme';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark);

  // Suit les changements de préférence de l'OS (utile quand theme === 'system').
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  // Applique/retire la classe .dark sur <html>, persiste le CHOIX (pas la résolution),
  // et met à jour la couleur des contrôles de fenêtre intégrés (Windows).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
    window.api?.setOverlayTheme?.(resolvedTheme === 'dark');
  }, [theme, resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState((current) =>
          current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
        ),
    }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l’intérieur de <ThemeProvider>');
  }
  return context;
}
