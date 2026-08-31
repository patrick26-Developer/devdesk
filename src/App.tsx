import { useEffect, useState } from 'react';
import Sidebar, { SidebarToggle } from '@/components/Sidebar';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import About from '@/pages/About';
import Guide from '@/pages/Guide';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import CommandPalette, { pushRecentTool } from '@/components/CommandPalette';
import { Kbd } from '@/components/ui/kbd';
import { tools } from '@/tools';
import { Search } from 'lucide-react';

const LAST_TOOL_KEY = 'devdesk-last-tool';

function readLastTool(): string {
  try {
    return localStorage.getItem(LAST_TOOL_KEY) ?? 'home';
  } catch {
    return 'home';
  }
}

export default function App() {
  const [activeToolId, setActiveToolId] = useState(readLastTool);
  // Contrôle l'affichage de la sidebar en mode fenêtre étroite (drawer). Sans effet sur grand écran.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const navigate = (id: string) => {
    setActiveToolId(id);
    try {
      localStorage.setItem(LAST_TOOL_KEY, id);
    } catch {
      /* localStorage indisponible */
    }
    if (tools.some((t) => t.id === id)) pushRecentTool(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarOpen((open) => !open);
      }
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTool = tools.find((tool) => tool.id === activeToolId);
  const ActiveComponent = activeTool?.component;

  // Barre de titre intégrée : la barre utilitaire sert de zone de déplacement de la fenêtre.
  const platform = typeof window !== 'undefined' ? window.api?.platform : undefined;
  const dragPad =
    platform === 'win32' ? 'pr-[140px]' : platform === 'darwin' ? 'pl-[76px]' : '';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        activeToolId={activeToolId}
        onSelectTool={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Barre utilitaire = zone de déplacement de la fenêtre (app-region: drag).
            Les éléments interactifs doivent être marqués no-drag. */}
        <header
          className={`flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6 [-webkit-app-region:drag] ${dragPad}`}
        >
          <div className="flex items-center gap-2 [-webkit-app-region:no-drag]">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <div className="flex items-center gap-2 md:hidden">
              <Logo className="h-6 w-6" />
              <span className="text-sm font-semibold tracking-tight">DevDesk</span>
            </div>
          </div>

          <div className="flex items-center gap-2 [-webkit-app-region:no-drag]">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-8 items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Rechercher</span>
              <Kbd className="hidden sm:inline-flex">Ctrl K</Kbd>
            </button>
            <ThemeToggle />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto">
          {activeToolId === 'settings' && <Settings />}
          {activeToolId === 'about' && <About />}
          {activeToolId === 'guide' && <Guide />}
          {activeToolId === 'home' && <Home onSelectTool={navigate} />}
          {activeTool && ActiveComponent && <ActiveComponent />}
        </div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onNavigate={navigate} />
    </div>
  );
}
