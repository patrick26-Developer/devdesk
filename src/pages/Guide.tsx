import { tools } from '@/tools';
import PageHeader from '@/components/PageHeader';
import { useI18n } from '@/i18n';
import { guideKey } from './toolText';
import { ArrowRight, BookOpen, CheckCircle2, Lightbulb, Target } from 'lucide-react';

export default function Guide() {
  const { t } = useI18n();

  return (
    <div className="min-h-full p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader
          icon={BookOpen}
          eyebrow={t('guide.eyebrow')}
          title={t('guide.title')}
          description={t('guide.desc')}
        />

        <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">{t('guide.tip')}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t('guide.tipText')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const role = t(guideKey(tool.id, 'role'));
            const hasEntry = role !== guideKey(tool.id, 'role');

            return (
              <article
                key={tool.id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-primary/30 hover:bg-primary/[0.015]"
              >
                <div className="flex items-center gap-4 border-b border-border px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-sm font-semibold">{tool.name}</h2>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t('guide.quickGuide')}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-colors duration-200 group-hover:text-primary" />
                </div>

                {hasEntry ? (
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
                    <div className="border-b border-border p-5 md:border-b-0 md:border-r">
                      <div className="mb-3 flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('guide.role')}
                        </span>
                      </div>
                      <p className="text-xs leading-6 text-muted-foreground">{role}</p>
                    </div>

                    <div className="border-b border-border p-5 md:border-b-0 md:border-r">
                      <div className="mb-3 flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('guide.need')}
                        </span>
                      </div>
                      <p className="text-xs leading-6 text-muted-foreground">{t(guideKey(tool.id, 'need'))}</p>
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {t('guide.usage')}
                        </span>
                      </div>
                      <p className="text-xs leading-6 text-muted-foreground">{t(guideKey(tool.id, 'usage'))}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">{t('guide.todo')}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
