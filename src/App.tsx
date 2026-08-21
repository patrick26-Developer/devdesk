import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { tools } from '@/tools';

export default function App() {
  const [activeToolId, setActiveToolId] = useState('home');
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleTheme();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        window.location.reload();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  // undefined si activeToolId est 'home', 'settings' ou 'about' (ids spéciaux hors du registre d'outils)
  const activeTool = tools.find((tool) => tool.id === activeToolId);
  const ActiveComponent = activeTool?.component;

  // Détermine le titre et le sous-titre affichés dans l'en-tête, selon la page active
  const headerInfo =
    activeToolId === 'settings'
      ? { title: 'Paramètres', subtitle: 'Préférences locales.' }
      : activeToolId === 'about'
        ? { title: 'À propos', subtitle: 'Informations sur DevDesk.' }
        : activeTool
          ? { title: activeTool.name, subtitle: 'Utilitaire développeur professionnel.' }
          : { title: 'Accueil', subtitle: 'Vue d’ensemble de vos outils.' };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar activeToolId={activeToolId} onSelectTool={setActiveToolId} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-8 py-4">
          <div>
            <h2 className="text-lg font-semibold">{headerInfo.title}</h2>
            <p className="text-sm text-muted-foreground">{headerInfo.subtitle}</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-auto">
          {activeToolId === 'settings' && <Settings />}
          {activeToolId === 'about' && <About />}
          {activeToolId === 'home' && <Home onSelectTool={setActiveToolId} />}
          {activeTool && ActiveComponent && <ActiveComponent />}
        </div>
      </main>
    </div>
  );
}