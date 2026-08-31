// Palette de commandes (Ctrl/Cmd + K) : aller à un outil ou une page, changer de thème.
import { useMemo } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { tools, getCategory } from '@/tools';
import { useTheme } from '@/hooks/useTheme';
import { BookOpen, Home, Info, Monitor, Moon, Settings, Sun } from 'lucide-react';

const RECENT_KEY = 'devdesk-recent-tools';
const RECENT_MAX = 5;

export function pushRecentTool(id: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = [id, ...list.filter((x) => x !== id)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* localStorage indisponible : on ignore */
  }
}

function readRecentTools(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // id d'outil, ou 'home' | 'guide' | 'settings' | 'about'
  onNavigate: (id: string) => void;
}

const PAGES = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'guide', label: 'Guide', icon: BookOpen },
  { id: 'settings', label: 'Paramètres', icon: Settings },
  { id: 'about', label: 'À propos', icon: Info },
];

export default function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const { setTheme } = useTheme();

  const recentTools = useMemo(() => {
    if (!open) return [];
    return readRecentTools()
      .map((id) => tools.find((t) => t.id === id))
      .filter((t): t is (typeof tools)[number] => Boolean(t));
  }, [open]);

  const go = (id: string) => {
    onNavigate(id);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Palette de commandes"
      description="Rechercher un outil ou une commande"
      className="sm:max-w-lg"
    >
      <Command>
        <CommandInput placeholder="Rechercher un outil, une page, un thème..." />
        <CommandList>
        <CommandEmpty>Aucun résultat.</CommandEmpty>

        {recentTools.length > 0 && (
          <>
            <CommandGroup heading="Récents">
              {recentTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <CommandItem
                    key={`recent-${tool.id}`}
                    value={`recent ${tool.name} ${(tool.keywords ?? []).join(' ')}`}
                    onSelect={() => go(tool.id)}
                  >
                    <Icon className={getCategory(tool.category).text} />
                    {tool.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          {PAGES.map(({ id, label, icon: Icon }) => (
            <CommandItem key={id} value={`page ${label}`} onSelect={() => go(id)}>
              <Icon />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Outils">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <CommandItem
                key={tool.id}
                value={`${tool.name} ${(tool.keywords ?? []).join(' ')}`}
                onSelect={() => go(tool.id)}
              >
                <Icon className={getCategory(tool.category).text} />
                {tool.name}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Thème">
          <CommandItem value="thème clair light" onSelect={() => { setTheme('light'); onOpenChange(false); }}>
            <Sun />
            Thème clair
          </CommandItem>
          <CommandItem value="thème sombre dark" onSelect={() => { setTheme('dark'); onOpenChange(false); }}>
            <Moon />
            Thème sombre
          </CommandItem>
          <CommandItem value="thème système system" onSelect={() => { setTheme('system'); onOpenChange(false); }}>
            <Monitor />
            Thème système
          </CommandItem>
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
