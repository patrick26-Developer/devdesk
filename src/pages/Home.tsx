import { tools } from '@/tools';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  Command,
  Keyboard,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import heroImage from '../../assets/branding/bg-home2.jpg';

interface HomeProps {
  onSelectTool: (id: string) => void;
  onOpenGuide?: () => void;
}

const FEATURED_TOOL_IDS = ['markdown', 'qrcode', 'api-tester'];

/**
 * Couleurs propres à chaque outil.
 * On garde la même logique visuelle dans toute l'application :
 * une couleur = une identité visuelle pour l'outil.
 */
const TOOL_ICON_STYLES: Record<
  string,
  {
    wrapper: string;
    icon: string;
  }
> = {
  markdown: {
    wrapper: 'bg-blue-500/10 border-blue-500/15',
    icon: 'text-blue-500',
  },
  qrcode: {
    wrapper: 'bg-emerald-500/10 border-emerald-500/15',
    icon: 'text-emerald-500',
  },
  'api-tester': {
    wrapper: 'bg-orange-500/10 border-orange-500/15',
    icon: 'text-orange-500',
  },
  'json-formatter': {
    wrapper: 'bg-indigo-500/10 border-indigo-500/15',
    icon: 'text-indigo-500',
  },
  base64: {
    wrapper: 'bg-cyan-500/10 border-cyan-500/15',
    icon: 'text-cyan-500',
  },
  uuid: {
    wrapper: 'bg-violet-500/10 border-violet-500/15',
    icon: 'text-violet-500',
  },
  regex: {
    wrapper: 'bg-pink-500/10 border-pink-500/15',
    icon: 'text-pink-500',
  },
  timestamp: {
    wrapper: 'bg-amber-500/10 border-amber-500/15',
    icon: 'text-amber-500',
  },
  color: {
    wrapper: 'bg-rose-500/10 border-rose-500/15',
    icon: 'text-rose-500',
  },
  jwt: {
    wrapper: 'bg-red-500/10 border-red-500/15',
    icon: 'text-red-500',
  },
  hash: {
    wrapper: 'bg-purple-500/10 border-purple-500/15',
    icon: 'text-purple-500',
  },
  url: {
    wrapper: 'bg-sky-500/10 border-sky-500/15',
    icon: 'text-sky-500',
  },
  lorem: {
    wrapper: 'bg-teal-500/10 border-teal-500/15',
    icon: 'text-teal-500',
  },
};

const DEFAULT_ICON_STYLE = {
  wrapper: 'bg-primary/10 border-primary/15',
  icon: 'text-primary',
};

export default function Home({
  onSelectTool,
  onOpenGuide,
}: HomeProps) {
  const featuredTools = FEATURED_TOOL_IDS
    .map((id) => tools.find((tool) => tool.id === id))
    .filter(Boolean) as typeof tools;

  return (
    <div className="min-h-full p-6 xl:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* =========================================================
            HERO — IMAGE PLEIN ÉCRAN AVEC TEXTE SUPERPOSÉ
        ========================================================= */}
        <section className="relative overflow-hidden rounded-2xl border border-border">
          {/* Image en fond — occupe toute la div */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="DevDesk developer toolkit"
              className="h-full w-full object-cover object-center"
            />
            {/* Overlay sombre pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
            
            {/* Légère touche de la couleur primaire */}
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </div>

          {/* Contenu superposé sur l'image */}
          <div className="relative z-10 flex min-h-[420px] flex-col justify-center p-8 xl:p-12">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>Developer productivity toolkit</span>
              </div>

              {/* Titre */}
              <h1 className="text-3xl font-semibold tracking-tight text-white xl:text-5xl xl:leading-[1.12]">
                Tout ce dont vous avez besoin,
                <span className="text-violet-400"> au même endroit.</span>
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-xl text-base leading-7 text-white/80 xl:text-lg">
                DevDesk réunit vos outils développeur essentiels dans une
                application desktop rapide, locale et pensée pour votre
                workflow quotidien.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  onClick={onOpenGuide}
                  className="group gap-2 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300"
                >
                  <BookOpen className="h-4 w-4" />
                  Apprendre à utiliser DevDesk
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>

                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  100% local
                </div>
              </div>
            </div>
          </div>

          {/* Bordure interne subtile */}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.08]" />
        </section>

        {/* =========================================================
            OUTILS POPULAIRES
        ========================================================= */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Outils populaires
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Les outils les plus utiles pour votre workflow quotidien.
              </p>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Accès rapide
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredTools.map((tool) => {
              const Icon = tool.icon;
              const iconStyle = TOOL_ICON_STYLES[tool.id] ?? DEFAULT_ICON_STYLE;

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
                  className="group flex min-h-[180px] flex-col rounded-xl border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {/* Icon avec couleur unique */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${iconStyle.wrapper} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${iconStyle.icon}`} />
                  </div>

                  {/* Contenu */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-foreground">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {tool.description || 'Un outil essentiel pour votre workflow développeur.'}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                    Ouvrir l'outil
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            GUIDE + RACCOURCIS
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* GUIDE */}
          <section className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-500/15 bg-violet-500/10 text-violet-500">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold">
                  Découvrez comment utiliser DevDesk
                </h2>
                <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                  Découvrez le rôle de chaque outil, le problème qu'il résout,
                  les cas d'utilisation et les bonnes pratiques pour l'utiliser
                  efficacement.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenGuide}
                  className="mt-4 gap-2 transition-all duration-200 hover:scale-105"
                >
                  Ouvrir le guide
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </section>

          {/* RACCOURCIS */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-sky-500" />
              <h2 className="text-sm font-semibold">Raccourcis</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  keys: 'Ctrl + K',
                  label: 'Recherche',
                  icon: Command,
                  color: 'text-sky-500',
                  bg: 'bg-sky-500/10',
                },
                {
                  keys: 'Ctrl + B',
                  label: 'Thème',
                  icon: Sparkles,
                  color: 'text-violet-500',
                  bg: 'bg-violet-500/10',
                },
                {
                  keys: 'Ctrl + R',
                  label: 'Actualiser',
                  icon: RefreshCw,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10',
                },
              ].map((shortcut) => {
                const Icon = shortcut.icon;

                return (
                  <div
                    key={shortcut.keys}
                    className="rounded-xl border border-border bg-card p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                  >
                    <div className={`mb-3 flex h-7 w-7 items-center justify-center rounded-md ${shortcut.bg} ${shortcut.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <p className="font-mono text-[11px] font-medium text-foreground">
                      {shortcut.keys}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {shortcut.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <div className="flex items-center justify-between border-t border-border pt-5 text-[11px] text-muted-foreground">
          <span>DevDesk · Developer Toolkit</span>
          <span>Travaillez plus vite. Restez concentré.</span>
        </div>

      </div>
    </div>
  );
}