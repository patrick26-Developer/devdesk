// Sun/Moon : icônes lucide représentant respectivement le thème clair et sombre
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title="Basculer le thème (Ctrl+B)"
      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5 transition-colors hover:bg-accent"
    >
      {/* L'icône du thème actif est colorée en "primary", l'autre reste grise, comme dans ta capture */}
      <Sun className={cn('h-4 w-4', theme === 'light' ? 'text-primary' : 'text-muted-foreground')} />
      <Moon className={cn('h-4 w-4', theme === 'dark' ? 'text-primary' : 'text-muted-foreground')} />
    </button>
  );
}