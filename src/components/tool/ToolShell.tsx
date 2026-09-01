// Enveloppe standard de tous les outils.
// Rend UN SEUL en-tête (chip d'icône coloré selon la catégorie, nom, description, actions à droite)
// et un conteneur au rythme vertical normalisé. Supprime le double en-tête qui existait avant
// (l'en-tête global de App.tsx + l'en-tête que chaque outil re-dessinait à sa façon).

import type { ReactNode } from 'react';

import type { Tool } from '@/tools';
import { getToolChip } from '@/tools';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n';
import { toolDescKey } from '@/pages/toolText';

interface ToolShellProps {
  tool: Tool;
  // Contenu aligné à droite dans l'en-tête (ex. bouton "Réinitialiser").
  actions?: ReactNode;
  children: ReactNode;
  // Classes supplémentaires pour le conteneur de contenu.
  contentClassName?: string;
  // Si vrai, le contenu défile verticalement. Sinon (défaut) l'outil gère lui-même son défilement.
  scroll?: boolean;
}

export default function ToolShell({
  tool,
  actions,
  children,
  contentClassName,
  scroll = false,
}: ToolShellProps) {
  const Icon = tool.icon;
  const t = useT();
  const descKey = toolDescKey(tool.id);
  const description = t(descKey) === descKey ? tool.description : t(descKey);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
              getToolChip(tool)
            )}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-tight text-foreground">
              {tool.name}
            </h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>

      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-5 p-6 xl:p-8',
          scroll && 'overflow-auto',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
