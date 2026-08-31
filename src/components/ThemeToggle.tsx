// Contrôle segmenté à 3 états : Clair / Système / Sombre.
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/hooks/useTheme';

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'system', label: 'Système', icon: Monitor },
  { value: 'dark', label: 'Sombre', icon: Moon },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Thème"
      className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
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
