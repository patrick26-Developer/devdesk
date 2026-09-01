// Contrôle segmenté à 3 états : Clair / Système / Sombre.
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { useT } from '@/i18n';

const OPTIONS: { value: Theme; key: string; icon: typeof Sun }[] = [
  { value: 'light', key: 'theme.light', icon: Sun },
  { value: 'system', key: 'theme.system', icon: Monitor },
  { value: 'dark', key: 'theme.dark', icon: Moon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useT();

  return (
    <div
      role="radiogroup"
      aria-label={t('theme.label')}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5"
    >
      {OPTIONS.map(({ value, key, icon: Icon }) => {
        const active = theme === value;
        const label = t(key);
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
