import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { tools, searchTools, toolsByCategory, getCategory, type Tool } from '@/tools';
import { BookOpen, Home, Info, Menu, Search, Settings, Star, X } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import Logo from '@/components/Logo';

interface SidebarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeToolId, onSelectTool, isOpen, onClose }: SidebarProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F : focus la recherche d'outils de la sidebar.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = searchTools(query);
  const groups = toolsByCategory(filtered);
  const favoriteTools = query
    ? filtered.filter((t) => isFavorite(t.id))
    : tools.filter((t) => isFavorite(t.id));

  const handleSelect = (id: string) => {
    onSelectTool(id);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity duration-200 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-sidebar-border/70 bg-sidebar text-sidebar-foreground transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* En-tête (aussi zone de déplacement de la fenêtre sur grand écran) */}
        <div className="flex items-center justify-between border-b border-sidebar-border/70 px-5 py-5 md:[-webkit-app-region:drag]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-accent/50 shadow-sm">
              <Logo className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-semibold tracking-tight text-sidebar-foreground">
                DevDesk
              </h1>
              <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">Developer Toolbox</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent md:hidden [-webkit-app-region:no-drag]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Recherche */}
        <div className="px-4 pt-4">
          <div className="group relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un outil..."
              aria-label="Rechercher un outil"
              className="h-9 w-full rounded-lg border border-sidebar-border bg-sidebar-accent/35 pl-9 pr-3 text-xs text-sidebar-foreground outline-none placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-primary/50 focus:bg-sidebar-accent/60 focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!query && (
            <>
              <SectionLabel>Principal</SectionLabel>
              <NavButton
                icon={Home}
                label="Accueil"
                active={activeToolId === 'home'}
                onClick={() => handleSelect('home')}
              />
              <NavButton
                icon={BookOpen}
                label="Guide"
                active={activeToolId === 'guide'}
                onClick={() => handleSelect('guide')}
              />
            </>
          )}

          {favoriteTools.length > 0 && (
            <>
              <SectionLabel className="mt-6">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Favoris
              </SectionLabel>
              <div className="space-y-0.5">
                {favoriteTools.map((tool) => (
                  <ToolRow
                    key={`fav-${tool.id}`}
                    tool={tool}
                    active={tool.id === activeToolId}
                    favorite
                    onSelect={() => handleSelect(tool.id)}
                    onToggleFavorite={() => toggleFavorite(tool.id)}
                  />
                ))}
              </div>
            </>
          )}

          {groups.map(({ category, tools: categoryTools }) => (
            <div key={category.key}>
              <SectionLabel className="mt-6">
                <span className={cn('h-1.5 w-1.5 rounded-full', category.dot)} />
                {category.label}
              </SectionLabel>
              <div className="space-y-0.5">
                {categoryTools.map((tool) => (
                  <ToolRow
                    key={tool.id}
                    tool={tool}
                    active={tool.id === activeToolId}
                    favorite={isFavorite(tool.id)}
                    onSelect={() => handleSelect(tool.id)}
                    onToggleFavorite={() => toggleFavorite(tool.id)}
                  />
                ))}
              </div>
            </div>
          ))}

          {query && groups.length === 0 && (
            <div className="px-2 py-8 text-center">
              <Search className="mx-auto h-5 w-5 text-muted-foreground/50" />
              <p className="mt-2 text-xs font-medium text-muted-foreground">Aucun outil trouvé</p>
              <p className="mt-1 text-[10px] text-muted-foreground/70">Essayez avec un autre terme.</p>
            </div>
          )}
        </nav>

        {/* Pied */}
        <div className="border-t border-sidebar-border/70 p-3">
          <NavButton
            icon={Settings}
            label="Paramètres"
            active={activeToolId === 'settings'}
            onClick={() => handleSelect('settings')}
          />
          <NavButton
            icon={Info}
            label="À propos"
            active={activeToolId === 'about'}
            onClick={() => handleSelect('about')}
          />

          <div className="mt-3 border-t border-sidebar-border/50 pt-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] text-muted-foreground/60">DevDesk</span>
              <span className="rounded-md border border-sidebar-border bg-sidebar-accent/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/70">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mb-2 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70',
        className
      )}
    >
      {children}
    </p>
  );
}

function NavButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon
        className={cn(
          'h-4 w-4 shrink-0',
          active ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
        )}
      />
      <span>{label}</span>
    </button>
  );
}

function ToolRow({
  tool,
  active,
  favorite,
  onSelect,
  onToggleFavorite,
}: {
  tool: Tool;
  active: boolean;
  favorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const Icon = tool.icon;
  const accent = getCategory(tool.category).dot;

  return (
    <div className="group flex items-center gap-1">
      <button
        onClick={onSelect}
        className={cn(
          'relative flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
        )}
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            active ? 'text-primary' : 'text-muted-foreground group-hover:text-sidebar-foreground'
          )}
        />
        <span className="truncate">{tool.name}</span>
        {!active && (
          <span className={cn('ml-auto h-1 w-1 shrink-0 rounded-full opacity-40', accent)} />
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
          favorite
            ? 'text-amber-400 opacity-100 hover:bg-amber-400/10'
            : 'text-muted-foreground opacity-0 hover:bg-sidebar-accent hover:text-sidebar-foreground group-hover:opacity-100'
        )}
      >
        <Star className={cn('h-3.5 w-3.5', favorite && 'fill-current')} />
      </button>
    </div>
  );
}

// Export du composant bouton "menu" utilisé dans App.tsx
export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Ouvrir le menu"
      className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
