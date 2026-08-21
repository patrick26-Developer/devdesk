import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { tools } from '@/tools';
import { Star, Home, Search, Settings, Info } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface SidebarProps {
  activeToolId: string;
  onSelectTool: (id: string) => void;
}

export default function Sidebar({
  activeToolId,
  onSelectTool,
}: SidebarProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState('');

  const searchRef = useRef<HTMLInputElement>(null);

  /* =========================================================
     RACCOURCI CLAVIER — CTRL/CMD + K
     ========================================================= */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* =========================================================
     RECHERCHE DES OUTILS
     ========================================================= */

  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside
      className="
        flex
        w-72
        shrink-0
        flex-col
        border-r
        border-sidebar-border/70
        bg-sidebar
        text-sidebar-foreground
      "
    >
      {/* =====================================================
          BRAND HEADER
          ===================================================== */}

      <div
        className="
          border-b
          border-sidebar-border/70
          px-5
          py-5
        "
      >
        <div className="flex items-center gap-3.5">
          {/* Logo */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-sidebar-border
              bg-sidebar-accent/50
              shadow-sm
            "
          >
            <img src="./assets/branding/devdesk-icon.png" alt="DevDesk" className="h-7 w-7" />
          </div>

          {/* Brand */}
          <div className="min-w-0">
            <h1
              className="
                truncate
                text-[15px]
                font-semibold
                tracking-tight
                text-sidebar-foreground
              "
            >
              DevDesk
            </h1>

            <p
              className="
                mt-0.5
                text-[11px]
                font-medium
                text-muted-foreground
              "
            >
              Developer Toolbox
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SEARCH
          ===================================================== */}

      <div className="px-4 pt-4">
        <div className="group relative">
          <Search
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              h-3.5
              w-3.5
              -translate-y-1/2
              text-muted-foreground
              transition-colors
              duration-200
              group-focus-within:text-primary
            "
          />

          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un outil..."
            className="
              h-9
              w-full
              rounded-lg
              border
              border-sidebar-border
              bg-sidebar-accent/35
              pl-9
              pr-14
              text-xs
              text-sidebar-foreground
              outline-none
              placeholder:text-muted-foreground/70
              transition-all
              duration-200
              focus:border-primary/50
              focus:bg-sidebar-accent/60
              focus:ring-2
              focus:ring-primary/10
            "
          />

          <kbd
            className="
              pointer-events-none
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded-md
              border
              border-sidebar-border
              bg-sidebar
              px-1.5
              py-0.5
              font-mono
              text-[9px]
              font-medium
              text-muted-foreground
              shadow-sm
            "
          >
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 py-4">

        {/* ---------------------------------------------------
            PRINCIPAL
            --------------------------------------------------- */}

        <p
          className="
            mb-2
            px-2
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-muted-foreground/70
          "
        >
          Principal
        </p>

        <button
          type="button"
          onClick={() => onSelectTool('home')}
          className={cn(
            `
              group
              relative
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              text-xs
              font-medium
              transition-all
              duration-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
            `,
            activeToolId === 'home'
              ? `
                bg-primary/10
                text-primary
              `
              : `
                text-sidebar-foreground/70
                hover:bg-sidebar-accent/70
                hover:text-sidebar-foreground
              `
          )}
        >
          {/* Active indicator */}
          {activeToolId === 'home' && (
            <span
              className="
                absolute
                left-0
                top-1/2
                h-5
                w-0.5
                -translate-y-1/2
                rounded-full
                bg-primary
              "
            />
          )}

          <Home
            className={cn(
              'h-4 w-4 shrink-0 transition-colors duration-200',
              activeToolId === 'home'
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-sidebar-foreground'
            )}
          />

          <span>Accueil</span>
        </button>

        {/* ---------------------------------------------------
            OUTILS
            --------------------------------------------------- */}

        {filteredTools.length > 0 && (
          <p
            className="
              mb-2
              mt-6
              px-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-muted-foreground/70
            "
          >
            Outils
          </p>
        )}

        <div className="space-y-0.5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;

            const active = tool.id === activeToolId;
            const favorite = isFavorite(tool.id);

            return (
              <div
                key={tool.id}
                className="group flex items-center gap-1"
              >
                {/* Tool navigation */}
                <button
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
                  className={cn(
                    `
                      relative
                      flex
                      min-w-0
                      flex-1
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      transition-all
                      duration-200
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary/30
                    `,
                    active
                      ? `
                        bg-primary/10
                        text-primary
                      `
                      : `
                        text-sidebar-foreground/70
                        hover:bg-sidebar-accent/70
                        hover:text-sidebar-foreground
                      `
                  )}
                >
                  {/* Active indicator */}
                  {active && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-5
                        w-0.5
                        -translate-y-1/2
                        rounded-full
                        bg-primary
                      "
                    />
                  )}

                  <Icon
                    className={cn(
                      `
                        h-4
                        w-4
                        shrink-0
                        transition-colors
                        duration-200
                      `,
                      active
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-sidebar-foreground'
                    )}
                  />

                  <span className="truncate">
                    {tool.name}
                  </span>
                </button>

                {/* Favorite */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(tool.id);
                  }}
                  title={
                    favorite
                      ? 'Retirer des favoris'
                      : 'Ajouter aux favoris'
                  }
                  className={cn(
                    `
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-primary/30
                    `,
                    favorite
                      ? `
                        opacity-100
                        text-amber-400
                        hover:bg-amber-400/10
                      `
                      : `
                        opacity-0
                        text-muted-foreground
                        group-hover:opacity-100
                        hover:bg-sidebar-accent
                        hover:text-sidebar-foreground
                      `
                  )}
                >
                  <Star
                    className={cn(
                      'h-3.5 w-3.5',
                      favorite && 'fill-current'
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* ---------------------------------------------------
            EMPTY SEARCH STATE
            --------------------------------------------------- */}

        {query && filteredTools.length === 0 && (
          <div className="px-2 py-8 text-center">
            <Search className="mx-auto h-5 w-5 text-muted-foreground/50" />

            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Aucun outil trouvé
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground/70">
              Essayez avec un autre terme.
            </p>
          </div>
        )}
      </nav>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div
        className="
          border-t
          border-sidebar-border/70
          p-3
        "
      >
        {/* Settings */}
        <button
          type="button"
          onClick={() => onSelectTool('settings')}
          className={cn(
            `
              group
              relative
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              text-xs
              font-medium
              transition-all
              duration-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
            `,
            activeToolId === 'settings'
              ? 'bg-primary/10 text-primary'
              : `
                text-sidebar-foreground/65
                hover:bg-sidebar-accent/70
                hover:text-sidebar-foreground
              `
          )}
        >
          {activeToolId === 'settings' && (
            <span
              className="
                absolute
                left-0
                top-1/2
                h-5
                w-0.5
                -translate-y-1/2
                rounded-full
                bg-primary
              "
            />
          )}

          <Settings
            className={cn(
              'h-4 w-4',
              activeToolId === 'settings'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          />

          <span>Paramètres</span>
        </button>

        {/* About */}
        <button
          type="button"
          onClick={() => onSelectTool('about')}
          className={cn(
            `
              group
              relative
              mt-0.5
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              text-xs
              font-medium
              transition-all
              duration-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
            `,
            activeToolId === 'about'
              ? 'bg-primary/10 text-primary'
              : `
                text-sidebar-foreground/65
                hover:bg-sidebar-accent/70
                hover:text-sidebar-foreground
              `
          )}
        >
          {activeToolId === 'about' && (
            <span
              className="
                absolute
                left-0
                top-1/2
                h-5
                w-0.5
                -translate-y-1/2
                rounded-full
                bg-primary
              "
            />
          )}

          <Info
            className={cn(
              'h-4 w-4',
              activeToolId === 'about'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          />

          <span>À propos</span>
        </button>

        {/* Version */}
        <div className="mt-3 border-t border-sidebar-border/50 pt-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] text-muted-foreground/60">
              DevDesk
            </span>

            <span
              className="
                rounded-md
                border
                border-sidebar-border
                bg-sidebar-accent/40
                px-1.5
                py-0.5
                font-mono
                text-[9px]
                text-muted-foreground/70
              "
            >
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}