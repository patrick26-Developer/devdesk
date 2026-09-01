import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n';

interface InlineEditProps {
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Ouvre en édition immédiatement (ex. après création). */
  autoEdit?: boolean;
}

// Texte cliquable qui devient un champ de saisie ; valide sur Entrée / blur, annule sur Échap.
export default function InlineEdit({
  value,
  onCommit,
  placeholder,
  className,
  inputClassName,
  autoEdit = false,
}: InlineEditProps) {
  const t = useT();
  const [editing, setEditing] = useState(autoEdit);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      ref.current?.focus();
      ref.current?.select();
    }
  }, [editing, value]);

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== value) onCommit(next);
  };

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        placeholder={placeholder}
        className={cn(
          'min-w-0 rounded border border-primary/40 bg-background px-1 py-0.5 text-xs outline-none',
          inputClassName
        )}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title={t('ui.inline.rename')}
      className={cn('cursor-text truncate', className)}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </span>
  );
}
