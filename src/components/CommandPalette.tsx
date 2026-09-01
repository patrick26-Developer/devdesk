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
import { useT } from '@/i18n';
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
  { id: 'home', key: 'nav.home', icon: Home },
  { id: 'guide', key: 'nav.guide', icon: BookOpen },
  { id: 'settings', key: 'nav.settings', icon: Settings },
  { id: 'about', key: 'nav.about', icon: Info },
];

export default function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const { setTheme } = useTheme();
  const t = useT();

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
      title={t('palette.title')}
      description={t('palette.desc')}
      className="sm:max-w-lg"
    >
      <Command
        onKeyDown={(e) => {
          // Filet de sécurité : garantit la fermeture sur Échap même si le Dialog ne capte pas la touche.
          if (e.key === 'Escape') onOpenChange(false);
        }}
      >
        <CommandInput placeholder={t('palette.placeholder')} />
        <CommandList>
        <CommandEmpty>{t('palette.empty')}</CommandEmpty>

        {recentTools.length > 0 && (
          <>
            <CommandGroup heading={t('palette.recent')}>
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

        <CommandGroup heading={t('palette.navigation')}>
          {PAGES.map(({ id, key, icon: Icon }) => (
            <CommandItem key={id} value={`page ${t(key)}`} onSelect={() => go(id)}>
              <Icon />
              {t(key)}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('palette.tools')}>
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

        <CommandGroup heading={t('palette.themeGroup')}>
          <CommandItem value="theme light clair" onSelect={() => { setTheme('light'); onOpenChange(false); }}>
            <Sun />
            {t('palette.themeLight')}
          </CommandItem>
          <CommandItem value="theme dark sombre" onSelect={() => { setTheme('dark'); onOpenChange(false); }}>
            <Moon />
            {t('palette.themeDark')}
          </CommandItem>
          <CommandItem value="theme system système" onSelect={() => { setTheme('system'); onOpenChange(false); }}>
            <Monitor />
            {t('palette.themeSystem')}
          </CommandItem>
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
