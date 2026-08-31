// Carte de contenu réutilisable pour les outils : bordure + fond `card` + coins arrondis,
// avec en-tête / corps / pied optionnels. Remplace le motif copié-collé ~30 fois.

import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card',
        className
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  icon: Icon,
  right,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  icon?: ComponentType<{ className?: string }>;
  // Contenu aligné à droite (bouton copier, badge...).
  right?: ReactNode;
  // Si fourni, remplace entièrement le rendu title/subtitle.
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3',
        className
      )}
    >
      {children ?? (
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
          ) : null}
          <div className="min-w-0">
            {title ? <p className="truncate text-sm font-medium text-foreground">{title}</p> : null}
            {subtitle ? (
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>
      )}

      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </div>
  );
}

export function PanelBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('min-h-0 flex-1 overflow-auto p-4', className)}>{children}</div>;
}

export function PanelFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-2 border-t border-border bg-muted/10 px-4 py-2 text-[10px] text-muted-foreground tabular-nums',
        className
      )}
    >
      {children}
    </div>
  );
}
