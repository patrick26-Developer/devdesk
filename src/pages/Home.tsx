import { tools, getToolChip } from '@/tools';
import { Button } from '@/components/ui/button';
import SmartPaste from '@/components/SmartPaste';
import { ArrowRight, BookOpen, Command, Keyboard, PanelLeft, Sparkles, X } from 'lucide-react';
import heroImage from '../../assets/branding/bg-home2.jpg';

interface HomeProps {
  onSelectTool: (id: string) => void;
}

const FEATURED_TOOL_IDS = ['markdown', 'qrcode', 'api-tester'];

export default function Home({ onSelectTool }: HomeProps) {
  const featuredTools = FEATURED_TOOL_IDS.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as typeof tools;

  return (
    <div className="min-h-full p-4 sm:p-6 xl:p-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-border">
          <div className="absolute inset-0">
            <img src={heroImage} alt="DevDesk developer toolkit" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>

          {/* min-h réduit sur mobile pour ne pas occuper tout l'écran d'une petite fenêtre */}
          <div className="relative z-10 flex min-h-[280px] flex-col justify-center p-6 sm:min-h-[360px] sm:p-8 xl:min-h-[420px] xl:p-12">
            <div className="max-w-2xl">
              <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur-md sm:mb-5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>Developer productivity toolkit</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl xl:text-5xl xl:leading-[1.12]">
                Tout ce dont vous avez besoin,
                <span className="text-violet-400"> au même endroit.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:mt-4 sm:text-base sm:leading-7 xl:text-lg">
                DevDesk réunit vos outils développeur essentiels dans une
                application desktop rapide, locale et pensée pour votre
                workflow quotidien.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                {/* Effets de survol retirés : plus de scale/translate, juste un léger changement de fond */}
                <Button onClick={() => onSelectTool('guide')} className="gap-2 bg-white text-black hover:bg-white/90">
                  <BookOpen className="h-4 w-4" />
                  Apprendre à utiliser DevDesk
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  100% local
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.08]" />
        </section>

        <SmartPaste onSelectTool={onSelectTool} />

        {/* OUTILS POPULAIRES : grille qui passe de 1 à 2 à 3 colonnes selon la largeur */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Outils populaires</h2>
              <p className="mt-1 text-xs text-muted-foreground">Les outils les plus utiles pour votre workflow quotidien.</p>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">Accès rapide</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {featuredTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="group flex min-h-[160px] flex-col rounded-xl border border-border bg-card p-5 text-left transition-colors duration-200 hover:border-primary/30 hover:bg-accent/40"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${getToolChip(tool)}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-foreground">{tool.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.description}</p>
                  </div>

                  <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                    Ouvrir l'outil
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* GUIDE + RACCOURCIS : une colonne en dessous de lg, deux au-dessus */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-primary/30">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-500/15 bg-violet-500/10 text-violet-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">Découvrez comment utiliser DevDesk</h2>
                <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                  Découvrez le rôle de chaque outil, le problème qu'il résout,
                  et comment l'utiliser efficacement.
                </p>
                <Button variant="secondary" size="sm" onClick={() => onSelectTool('guide')} className="mt-4 gap-2">
                  Ouvrir le guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-sky-500" />
              <h2 className="text-sm font-semibold">Raccourcis</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { keys: 'Ctrl+K', label: 'Recherche', icon: Command, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                { keys: 'Ctrl+B', label: 'Sidebar', icon: PanelLeft, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                { keys: 'Échap', label: 'Fermer', icon: X, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              ].map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <div key={shortcut.keys} className="rounded-xl border border-border bg-card p-3 sm:p-3.5">
                    <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-md sm:mb-3 ${shortcut.bg} ${shortcut.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <p className="font-mono text-[10px] font-medium text-foreground sm:text-[11px]">{shortcut.keys}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground sm:text-[11px]">{shortcut.label}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>DevDesk · Developer Toolkit</span>
          <span>Travaillez plus vite. Restez concentré.</span>
        </div>
      </div>
    </div>
  );
}