import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ThemeToggle from '@/components/ThemeToggle';
import PageHeader from '@/components/PageHeader';
import { notify } from '@/lib/notify';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import { LOCALES, useI18n } from '@/i18n';
import {
  ChevronRight,
  Database,
  FolderOpen,
  HardDrive,
  Info,
  Languages,
  Monitor,
  Palette,
  RotateCcw,
  ShieldCheck,
  Star,
} from 'lucide-react';

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  tint,
  title,
  sub,
  right,
  border,
}: {
  icon: typeof Palette;
  tint: string;
  title: string;
  sub: string;
  right: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-5 p-5 transition-colors hover:bg-accent/40 ${border ? 'border-b border-border' : ''}`}>
      <div className="flex min-w-0 items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${tint}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{sub}</p>
        </div>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

export default function Settings() {
  const { theme, resolvedTheme } = useTheme();
  const { favorites } = useFavorites();
  const { t, locale, setLocale } = useI18n();
  const [version, setVersion] = useState('');

  useEffect(() => {
    window.api.getVersion().then(setVersion);
  }, []);

  const clearFavorites = async () => {
    await window.api.clearFavorites();
    notify(t('settings.favCleared'));
  };

  const plural = favorites.length > 1 ? 's' : '';

  return (
    <div className="min-h-full p-6 xl:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader icon={Palette} eyebrow={t('settings.eyebrow')} title={t('settings.title')} description={t('settings.desc')} />

        <section className="overflow-hidden rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('settings.appLocal')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('settings.appLocalSub')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3">
              <Monitor className="h-4 w-4 text-sky-500" />
              <div>
                <p className="text-[11px] text-muted-foreground">{t('settings.installedVersion')}</p>
                <p className="mt-0.5 font-mono text-xs font-medium">{version ? `v${version}` : '—'}</p>
              </div>
            </div>
          </div>
        </section>

        <Section title={t('settings.appearance')} sub={t('settings.appearanceSub')}>
          <Row
            icon={Palette}
            tint="border-violet-500/15 bg-violet-500/10 text-violet-500"
            title={t('theme.label')}
            sub={
              theme === 'system'
                ? `${t('theme.system')} · ${resolvedTheme === 'dark' ? t('theme.dark') : t('theme.light')}`
                : theme === 'dark'
                  ? t('theme.dark')
                  : t('theme.light')
            }
            right={<ThemeToggle />}
            border
          />
          <Row
            icon={Languages}
            tint="border-sky-500/15 bg-sky-500/10 text-sky-500"
            title={t('settings.language')}
            sub={t('settings.languageSub')}
            right={
              <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
                {LOCALES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLocale(l.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      locale === l.value ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="border-t border-border bg-muted/20 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-[11px] text-muted-foreground">{t('settings.themeApplied')}</p>
            </div>
          </div>
        </Section>

        <Section title={t('settings.localData')} sub={t('settings.localDataSub')}>
          <Row
            icon={FolderOpen}
            tint="border-cyan-500/15 bg-cyan-500/10 text-cyan-500"
            title={t('settings.dataFolder')}
            sub={t('settings.dataFolderSub')}
            right={
              <Button variant="secondary" size="sm" onClick={() => window.api.openDataFolder()} className="gap-2">
                {t('common.open')}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            }
            border
          />
          <Row
            icon={Star}
            tint="border-amber-500/15 bg-amber-500/10 text-amber-500"
            title={t('settings.favorites')}
            sub={favorites.length === 0 ? t('settings.favNone') : `${favorites.length}`}
            right={
              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="destructive" size="sm" disabled={favorites.length === 0} className="gap-1.5" />}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t('common.reset')}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('settings.favClearTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('settings.favClearBody')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={clearFavorites}>
                      {t('settings.favClearAction')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }
          />
        </Section>

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">{t('settings.dataState')}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{t('settings.dataStateSub')}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/15 bg-amber-500/10 text-amber-500">
                <Star className="h-4 w-4" />
              </div>
              <p className="text-2xl font-semibold tabular-nums">{favorites.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('settings.favorites')}
                {plural}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/15 bg-cyan-500/10 text-cyan-500">
                <Database className="h-4 w-4" />
              </div>
              <p className="text-2xl font-semibold">{t('settings.localFirst')}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t('about.dataProcessing')}</p>
            </div>
          </div>
        </section>

        <Section title={t('settings.application')} sub={t('settings.applicationSub')}>
          <Row
            icon={Info}
            tint="border-violet-500/15 bg-violet-500/10 text-violet-500"
            title={t('settings.version')}
            sub={t('settings.installedVersion')}
            right={
              <span className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
                {version ? `v${version}` : '—'}
              </span>
            }
            border
          />
          <Row
            icon={Monitor}
            tint="border-sky-500/15 bg-sky-500/10 text-sky-500"
            title={t('settings.appLocal')}
            sub={t('settings.appLocalSub')}
            right={
              <span className="rounded-md border border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
                {t('settings.localFirst')}
              </span>
            }
            border
          />
          <Row
            icon={HardDrive}
            tint="border-emerald-500/15 bg-emerald-500/10 text-emerald-500"
            title={t('about.localData')}
            sub={t('settings.footer')}
            right={
              <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                {t('settings.localFirst')}
              </span>
            }
          />
        </Section>

        <footer className="border-t border-border pt-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-muted-foreground">{t('settings.footer')}</p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('settings.localFirst')}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
