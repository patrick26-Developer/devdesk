import { createRoot } from 'react-dom/client';
import App from './App';
// ThemeProvider doit englober toute l'app pour que useTheme() fonctionne partout, y compris dans Sidebar et ThemeToggle
import { ThemeProvider } from './hooks/useTheme';
import { I18nProvider } from './i18n';
import { Toaster } from './components/ui/toast';
import './index.css';

createRoot(document.getElementById('app')!).render(
  <I18nProvider>
    <ThemeProvider>
      <App />
      <Toaster />
    </ThemeProvider>
  </I18nProvider>
);
