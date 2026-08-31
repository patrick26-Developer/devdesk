import { useEffect, useState } from 'react';
import Sidebar, { SidebarToggle } from '@/components/Sidebar';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Guide from '@/pages/Guide';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { tools } from '@/tools';

export default function App() {
  const [activeToolId, setActiveToolId] = useState('home');
  // Contrôle l'affichage de la sidebar en mode fenêtre étroite (drawer). Sans effet sur grand écran (toujours visible).
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B : ouvre/ferme la sidebar (convention). Sans effet sur grand écran où elle est fixe.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarOpen((open) => !open);
      }
      // Échap : referme le drawer mobile.
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTool = tools.find((tool) => tool.id === activeToolId);
  const ActiveComponent = activeTool?.component;

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        activeToolId={activeToolId}
        onSelectTool={setActiveToolId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Barre utilitaire : identité (mobile) + actions globales. L'identité de la page/outil
            vit désormais dans ToolShell / PageHeader, plus dans cette barre. */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <div className="flex items-center gap-2 md:hidden">
              <Logo className="h-6 w-6" />
              <span className="text-sm font-semibold tracking-tight">DevDesk</span>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <div className="min-h-0 flex-1 overflow-auto">
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
