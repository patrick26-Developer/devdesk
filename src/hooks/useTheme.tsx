// createContext/useContext : partage l'état du thème entre tous les composants sans prop-drilling
// useState/useEffect : gère la valeur courante et synchronise avec le DOM + localStorage
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Seules deux valeurs possibles pour le thème de l'app
type Theme = 'light' | 'dark';

// Forme de ce que le contexte expose : la valeur actuelle + la fonction pour basculer
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

// Contexte React, initialisé à null : sera rempli par le Provider plus bas
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Clé utilisée pour sauvegarder le choix de thème dans le localStorage du renderer
const STORAGE_KEY = 'devdesk-theme';

// Détermine le thème initial au tout premier chargement de l'app :
// 1) si l'utilisateur a déjà choisi un thème avant (localStorage), on le respecte
// 2) sinon, on suit la préférence système (dark mode OS) via matchMedia
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Provider à placer une seule fois, tout en haut de l'arbre React (dans main.tsx)
export function ThemeProvider({ children }: { children: ReactNode }) {
  // État React : la fonction passée à useState ne s'exécute qu'une fois, au tout premier rendu
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // À chaque changement de thème : applique/retire la classe .dark sur <html>, et persiste le choix
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Fonction exposée pour basculer entre les deux thèmes
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook pratique pour consommer le contexte depuis n'importe quel composant
export function useTheme() {
  const context = useContext(ThemeContext);
  // Erreur explicite si le hook est utilisé hors du Provider — évite un bug silencieux
  if (!context) {
    throw new Error('useTheme doit être utilisé à l’intérieur de <ThemeProvider>');
  }
  return context;
}