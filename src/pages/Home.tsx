// Liste centrale de tous les outils, pour piocher les "outils populaires" à mettre en avant
import { tools } from '@/tools';
import { Button } from '@/components/ui/button';

// Fonction reçue depuis App.tsx pour naviguer vers un outil au clic sur "Ouvrir"
interface HomeProps {
  onSelectTool: (id: string) => void;
}

// IDs des outils choisis pour apparaître en vedette sur la page d'accueil
const FEATURED_TOOL_IDS = ['markdown', 'qrcode', 'api-tester'];

export default function Home({ onSelectTool }: HomeProps) {
  // Filtre le registre complet pour ne garder que les outils mis en avant, dans l'ordre défini ci-dessus
  const featuredTools = FEATURED_TOOL_IDS.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as typeof tools;

  return (
    <div className="p-8 space-y-8">
      {/* Bannière de bienvenue : dégradé subtil basé sur la couleur primary, s'adapte automatiquement au thème */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Bienvenue sur DevDesk <span>👋</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          Votre boîte à outils développeur tout-en-un.
        </p>
      </div>

      {/* Section outils populaires : 3 cartes cliquables vers des outils choisis */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Outils populaires</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
                {/* Pastille d'icône colorée avec la couleur primary en fond léger */}
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">{tool.name}</p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-auto w-fit"
                  onClick={() => onSelectTool(tool.id)}
                >
                  Ouvrir →
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section raccourcis clavier, purement informative */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Raccourcis</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { keys: 'Ctrl + K', label: 'Recherche' },
            { keys: 'Ctrl + B', label: 'Basculer thème' },
            { keys: 'Ctrl + R', label: 'Actualiser' },
          ].map((shortcut) => (
            <div key={shortcut.keys} className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-sm">{shortcut.keys}</p>
              <p className="mt-1 text-xs text-muted-foreground">{shortcut.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}