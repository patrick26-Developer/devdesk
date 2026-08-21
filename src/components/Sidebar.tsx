import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { tools } from '@/tools';
import { Star, Home, Search, Settings, Info } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import Logo from '@/components/Logo';

interface SidebarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
}

export default function Sidebar({ activeToolId, onSelectTool }: SidebarProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* En-tête : logo + nom */}
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 shrink-0" />
          <div>
            <h1 className="text-base font-semibold tracking-tight">DevDesk</h1>
            <p className="text-xs text-muted-foreground">Developer Toolbox</p>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="px-5 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un outil..."
            className="w-full rounded-lg border border-sidebar-border bg-sidebar-accent/40 py-1.5 pl-8 pr-14 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-sidebar-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <button
          onClick={() => onSelectTool('home')}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
            activeToolId === 'home'
              ? 'bg-primary text-primary-foreground'
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
          )}
        >
          <Home className="h-4 w-4" />
          Accueil
        </button>

        {filteredTools.length > 0 && (
          <p className="px-3 pb-1 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Outils
          </p>
        )}

        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const active = tool.id === activeToolId;
          const favorite = isFavorite(tool.id);

          return (
            <div key={tool.id} className="group flex items-center gap-1">
              <button
                onClick={() => onSelectTool(tool.id)}
                className={cn(
                  'flex-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tool.name}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(tool.id);
                }}
                className="rounded-lg p-2 opacity-0 transition group-hover:opacity-100 hover:bg-sidebar-accent"
                title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Star
                  className={cn(
                    'h-4 w-4',
                    favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
          );
        })}

        {query && filteredTools.length === 0 && (
          <p className="px-3 py-4 text-sm text-muted-foreground">Aucun outil trouvé.</p>
        )}
      </nav>

      {/* Pied de sidebar : "Paramètres" et "À propos" sont maintenant de vrais boutons de navigation,
          traités comme 'home' via des ids spéciaux qui ne correspondent à aucun outil du registre */}
      <div className="space-y-1 border-t border-sidebar-border p-4">
        <button
          onClick={() => onSelectTool('settings')}
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground"
        >
          <Settings className="h-4 w-4" />
          Paramètres
        </button>
        <button
          onClick={() => onSelectTool('about')}
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground"
        >
          <Info className="h-4 w-4" />
          À propos
        </button>
        <p className="pt-2 text-xs text-muted-foreground">Version 1.0.0</p>
      </div>
    </aside>
  );
}