import { useMemo, useState, type ReactNode } from 'react';
import { toolsByCategory, getCategory, searchTools, type Tool } from '@/tools';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';
import { guideKey, toolDescKey } from './toolText';
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Command,
  Folder,
  Keyboard,
  Languages,
  Lightbulb,
  ListChecks,
  Search as SearchIcon,
  Sparkles,
  Star,
  Target,
  WandSparkles,
} from 'lucide-react';

const START_ITEMS = [
  { key: 'palette', icon: Command },
  { key: 'smart', icon: WandSparkles },
  { key: 'fav', icon: Star },
  { key: 'theme', icon: Languages },
  { key: 'data', icon: Folder },
  { key: 'shortcuts', icon: Keyboard },
] as const;

interface GuideProps {
  onSelectTool?: (id: string) => void;
}

export default function Guide({ onSelectTool }: GuideProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const matched = searchTools(query);
    return toolsByCategory(matched);
  }, [query]);

  const visibleIds = useMemo(
    () => groups.flatMap((g) => g.tools.map((tool) => tool.id)),
    [groups],
  );
  const allOpen = visibleIds.length > 0 && visibleIds.every((id) => open.has(id));

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(visibleIds));

  return (
    <div className="min-h-full p-6 xl:p-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <PageHeader
          icon={BookOpen}
          eyebrow={t('guide.eyebrow')}
          title={t('guide.title')}
          description={t('guide.desc')}
        />

        {/* Prise en main */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">{t('guide.start.title')}</h2>
            </div>
            <p className="mt-1.5 max-w-2xl text-xs leading-6 text-muted-foreground">
              {t('guide.start.lead')}
            </p>
          </div>
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {START_ITEMS.map(({ key, icon: Icon }, i) => (
              <div
                key={key}
                className={`p-5 ${i % 3 !== 2 ? 'lg:border-r' : ''} ${i < 3 ? 'lg:border-b' : ''} ${
                  i % 2 === 0 ? 'sm:border-r' : ''
                } border-border`}
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-semibold">{t(`guide.start.${key}.title`)}</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {t(`guide.start.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Barre d'outils : filtre + tout déplier */}
        <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center gap-3 border-b border-border bg-background px-1 py-2.5">
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('guide.filter')}
              className="h-9 pl-9"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleAll}
            disabled={visibleIds.length === 0}
            className="gap-1.5"
          >
            <ListChecks className="h-3.5 w-3.5" />
            {allOpen ? t('guide.collapseAll') : t('guide.expandAll')}
          </Button>
        </div>

        {groups.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            {t('guide.noMatch')}
          </p>
        ) : (
          <div className="space-y-10">
            {groups.map(({ category, tools: catTools }) => (
              <section key={category.key} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${category.dot}`} />
                  <h2 className="text-sm font-semibold">{t(`cat.${category.key}`)}</h2>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {t(catTools.length > 1 ? 'guide.toolsIn' : 'guide.toolIn', { n: catTools.length })}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {catTools.map((tool) => (
                    <GuideCard
                      key={tool.id}
                      tool={tool}
                      expanded={open.has(tool.id)}
                      onToggle={() => toggle(tool.id)}
                      onOpen={onSelectTool ? () => onSelectTool(tool.id) : undefined}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuideCard({
  tool,
  expanded,
  onToggle,
  onOpen,
}: {
  tool: Tool;
  expanded: boolean;
  onToggle: () => void;
  onOpen?: () => void;
}) {
  const { t } = useI18n();
  const Icon = tool.icon;
  const chip = getCategory(tool.category).chip;

  const steps = t(guideKey(tool.id, 'steps'))
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const tip = t(guideKey(tool.id, 'tip'));
  const hasTip = tip.length > 0 && tip !== guideKey(tool.id, 'tip');

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-card transition-colors ${
        expanded ? 'border-primary/25' : 'border-border hover:border-primary/20'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left"
      >
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${chip}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{tool.name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {t(toolDescKey(tool.id))}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-y-0 md:divide-x">
            <Field icon={Target} tint="text-primary" label={t('guide.role')}>
              <p>{t(guideKey(tool.id, 'role'))}</p>
            </Field>
            <Field icon={Lightbulb} tint="text-amber-500" label={t('guide.need')}>
              <p>{t(guideKey(tool.id, 'need'))}</p>
            </Field>
          </div>

          <div className="border-t border-border">
            <Field icon={ListChecks} tint="text-emerald-500" label={t('guide.steps')}>
              <ol className="space-y-1.5">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-px font-mono text-[10px] text-muted-foreground tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">{step}</span>
                  </li>
                ))}
              </ol>
            </Field>
          </div>

          <div className="border-t border-border">
            <Field icon={BookOpen} tint="text-cyan-500" label={t('guide.details')}>
              <p>{t(guideKey(tool.id, 'details'))}</p>
            </Field>
          </div>

          {hasTip && (
            <div className="flex items-start gap-2.5 border-t border-border bg-primary/[0.04] px-4 py-3">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-xs leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">{t('guide.tipLabel')} — </span>
                {tip}
              </p>
            </div>
          )}

          {onOpen && (
            <div className="border-t border-border px-4 py-3">
              <Button variant="secondary" size="sm" onClick={onOpen} className="gap-1.5">
                {t('guide.openTool')}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Field({
  icon: Icon,
  tint,
  label,
  children,
}: {
  icon: typeof Target;
  tint: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${tint}`} />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-xs leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}
