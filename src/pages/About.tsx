import { useEffect, useState } from 'react';
import { tools } from '@/tools';
import PageHeader from '@/components/PageHeader';
import { useT } from '@/i18n';
// Import ES du logo réel : garantit un chemin correct en dev ET en production (voir explication plus haut)
import logoSrc from '../../assets/branding/devdesk-icon.png';
import {
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers3,
  Database,
  Code2,
  Sparkles,
} from 'lucide-react';

export default function About() {
  const t = useT();
  const [version, setVersion] = useState('');

  useEffect(() => {
    window.api.getVersion().then(setVersion);
  }, []);

  return (
    <div className="min-h-full p-8">
      <div className="mx-auto max-w-5xl space-y-8">

        <PageHeader
          eyebrow={t('about.eyebrow')}
          title="DevDesk"
          description={t('about.desc')}
        />

        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                <img src={logoSrc} alt="DevDesk" className="h-11 w-11" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    DevDesk
                  </h2>

                  {version && (
                    <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      v{version}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t('about.tagline')}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t('about.localRun')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />

              <div>
                <p className="text-xs font-medium">
                  {t('about.localData')}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t('about.localDataSub')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/[0.03]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers3 className="h-4 w-4" />
            </div>

            <p className="text-2xl font-semibold">
              {tools.length}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t('about.toolsCount')}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/[0.03]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <Cpu className="h-4 w-4" />
            </div>

            <p className="text-2xl font-semibold">
              100%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t('about.desktopApp')}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-violet-500/40 hover:bg-violet-500/[0.03]">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
              <Database className="h-4 w-4" />
            </div>

            <p className="text-2xl font-semibold">
              Local
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t('about.dataProcessing')}
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                {t('about.why')}
              </h2>

              <p className="text-xs text-muted-foreground">
                {t('about.whySub')}
              </p>
            </div>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {t('about.whyText1')}
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            {t('about.whyText2')}
          </p>
        </section>

        {/* Tools */}
        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold">
              {t('about.toolsAvailable')}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              {t('about.toolsAvailableSub')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <div
                  key={tool.id}
                  className="
                    group flex items-center gap-3 rounded-lg border border-border
                    bg-card px-3 py-3
                    transition-colors duration-200
                    hover:border-primary/40
                    hover:bg-primary/[0.03]
                  "
                >
                  <div className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-md bg-muted
                    text-muted-foreground
                    transition-colors duration-200
                    group-hover:bg-primary/10
                    group-hover:text-primary
                  ">
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="truncate text-xs font-medium">
                    {tool.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tech stack */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
              <Code2 className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                {t('about.stack')}
              </h2>

              <p className="text-xs text-muted-foreground">
                {t('about.stackSub')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Electron',
              'React',
              'TypeScript',
              'Vite',
              'Tailwind CSS',
              'shadcn/ui',
            ].map((tech) => (
              <span
                key={tech}
                className="
                  rounded-lg border border-border
                  bg-muted/50 px-3 py-1.5
                  text-xs font-medium text-muted-foreground
                  transition-colors duration-200
                  hover:border-primary/30
                  hover:text-foreground
                "
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium">
              {t('about.by')}
            </p>

            <p className="mt-1 text-[11px] text-muted-foreground">
              DevDesk — Developer productivity toolbox.
            </p>
          </div>

          <a
            href="https://github.com/patrick26-Developer/devdesk"
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex items-center gap-2 rounded-lg
              border border-border bg-card px-3 py-2
              text-xs font-medium
              transition-colors duration-200
              hover:border-primary/40
              hover:bg-primary/[0.04]
              hover:text-primary
            "
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t('about.source')}
          </a>
        </section>
      </div>
    </div>
  );
}