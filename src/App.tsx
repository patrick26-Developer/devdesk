import { useEffect, useState } from 'react';
import Sidebar, { SidebarToggle } from '@/components/Sidebar';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Guide from '@/pages/Guide';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { tools } from '@/tools';

export default function App() {
  const [activeToolId, setActiveToolId] = useState('home');
  // Contrôle l'affichage de la sidebar en mode fenêtre étroite (drawer). Sans effet sur grand écran (toujours visible).
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const activeTool = tools.find((tool) => tool.id === activeToolId);
  const ActiveComponent = activeTool?.component;

  const headerInfo =
    activeToolId === 'settings'
      ? { title: 'Paramètres', subtitle: 'Préférences locales.' }
      : activeToolId === 'about'
        ? { title: 'À propos', subtitle: 'Informations sur DevDesk.' }
        : activeToolId === 'guide'
          ? { title: "Guide d'utilisation", subtitle: 'Comment utiliser chaque outil.' }
          : activeTool
            ? { title: activeTool.name, subtitle: 'Utilitaire développeur professionnel.' }
            : { title: 'Accueil', subtitle: 'Vue d’ensemble de vos outils.' };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        activeToolId={activeToolId}
        onSelectTool={setActiveToolId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex min-w-0 items-center gap-2">
            {/* Bouton hamburger : visible uniquement sous md (voir classe md:hidden dans SidebarToggle) */}
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold sm:text-lg">{headerInfo.title}</h2>
              {/* Sous-titre masqué sur très petite largeur pour ne pas encombrer l'en-tête */}
              <p className="hidden truncate text-sm text-muted-foreground sm:block">{headerInfo.subtitle}</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-auto">
          {activeToolId === 'settings' && <Settings />}
          {activeToolId === 'about' && <About />}
          {activeToolId === 'guide' && <Guide />}
          {activeToolId === 'home' && <Home onSelectTool={setActiveToolId} />}
          {activeTool && ActiveComponent && <ActiveComponent />}
        </div>
      </main>
    </div>
  );
}