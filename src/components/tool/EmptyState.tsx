// État vide standard : icône dans un chip, titre, description optionnelle.
// Unifie les ~6 variantes d'états vides disséminées dans les outils.

import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  // Contenu additionnel (ex. bouton d'action).
  children?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center justify-center px-6 py-10 text-center',
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>

      {description ? (
        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
